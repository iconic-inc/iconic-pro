import { Authenticator } from 'remix-auth';
import { Strategy } from 'remix-auth/strategy';
import { FormStrategy } from 'remix-auth-form';
import { OAuth2Strategy } from 'remix-auth-oauth2';

import { fetcher } from '.';
import { ISessionUser } from '~/interfaces/auth.interface';
import {
  deleteAuthCookie,
  parseAuthCookie,
  serializeAuthCookie,
} from './cookie.server';
import { isExpired } from '~/utils';
import { createOrUpdateUserFromOAuth } from './user.server';
import { IGoogleProfile, IFacebookProfile } from '~/interfaces/user.interface';

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
const authenticator = new Authenticator<ISessionUser>();

export namespace RefreshTokenStrategy {
  /**
   * This interface declares what the developer will receive from the strategy
   * to verify the user identity in their system.
   */
  export interface VerifyOptions {
    request: Request;
  }
}

// Refresh token strategy
class RefreshTokenStrategy<U> extends Strategy<
  U,
  RefreshTokenStrategy.VerifyOptions
> {
  name = 'refresh-token';

  async authenticate(request: Request): Promise<U> {
    return this.verify({ request });
  }
}

authenticator.use(
  new RefreshTokenStrategy(async ({ request }) => {
    const res = await refreshTokenHandler(request);

    return res as ISessionUser;
  }),
  'refresh-token',
);

authenticator.use(
  new FormStrategy<ISessionUser>(async ({ form }) => {
    try {
      const username = form.get('username') as string;
      const password = form.get('password') as string;
      const fingerprint = form.get('fingerprint') as string;

      const user = await login(username, password, fingerprint);

      return user;
    } catch (error: any) {
      console.log('authenticate error: ', error.data);
      throw error;
    }
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  'user-pass',
);

const googleStrategy = new OAuth2Strategy<ISessionUser>(
  {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    clientId: process.env.DEV_GOOGLE_CLIENT_ID!,
    clientSecret: process.env.DEV_GOOGLE_CLIENT_SECRET!,
    redirectURI: process.env.DEV_GOOGLE_REDIRECT_URI!,
    scopes: ['openid', 'profile', 'email'],
    cookie: 'fp',
  },
  async ({ tokens, request }) => {
    // Build a user profile from Google's userinfo endpoint
    const userInfo = await getGoogleUserInfo(tokens.accessToken(), request);
    const cookieHeader = request.headers.get('Cookie') || '';
    const browserId = cookieHeader
      .split('; ')
      .find((cookie) => cookie.startsWith('fp='))
      ?.split('=')[1];
    if (!browserId) {
      throw new Error('Không lấy được thông tin người dùng từ Google.');
    }

    const res = await createOrUpdateUserFromOAuth({
      provider: 'google',
      profile: {
        id: userInfo.id,
        name: userInfo.name,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        email: userInfo.email,
        avatar: userInfo.picture || '',
      },
      browserId,
    });

    return res;
  },
);

export const facebookStrategy = new OAuth2Strategy<ISessionUser>(
  {
    authorizationEndpoint: 'https://www.facebook.com/v17.0/dialog/oauth',
    tokenEndpoint: 'https://graph.facebook.com/v17.0/oauth/access_token',
    clientId: process.env.DEV_FACEBOOK_APP_ID!,
    clientSecret: process.env.DEV_FACEBOOK_APP_SECRET!,
    redirectURI: process.env.DEV_FACEBOOK_REDIRECT_URI!,
    scopes: ['email', 'public_profile'], // Facebook scopes
    cookie: 'fp', // Still using fingerprint stored in cookie
  },
  async ({ tokens, request }) => {
    const accessToken = tokens.accessToken();

    // Fetch user info from Facebook
    const userInfo = await getFacebookUserInfo(accessToken);
    // Extract fingerprint cookie
    const cookieHeader = request.headers.get('Cookie') || '';
    const browserId = cookieHeader
      .split('; ')
      .find((cookie) => cookie.startsWith('fp='))
      ?.split('=')[1];

    if (!browserId) {
      throw new Error('Có lỗi xảy ra khi đăng nhập.');
    }

    // Send to your backend API
    const res = await createOrUpdateUserFromOAuth({
      provider: 'facebook',
      profile: {
        id: userInfo.id,
        name: userInfo.name,
        firstName: userInfo.name,
        lastName: '', // Facebook doesn't provide last name in the default fields
        email: userInfo.email,
        avatar: userInfo.picture?.data?.url || '',
      },
      browserId,
    });

    return res;
  },
);

authenticator.use(googleStrategy, 'google');
authenticator.use(facebookStrategy, 'facebook');

/**
 *
 * @param request
 * @returns \{ session: ISessionUser | null; headers: HeadersInit }
 * @description Checks if the user is authenticated by looking for a valid session cookie.
 * @note Only uses in action functions.
 */
const isAuthenticated = async (
  request: Request,
): Promise<{ session: ISessionUser | null; headers: HeadersInit }> => {
  const cookie = await parseAuthCookie(request);

  if (!cookie) {
    return { session: null, headers: {} };
  }

  const { user, tokens } = cookie;
  if (!isExpired(tokens.accessToken)) {
    return { session: { user, tokens }, headers: {} };
  }

  // Access token expired → try refresh
  if (!isExpired(tokens.refreshToken)) {
    try {
      const refreshed = await authenticator.authenticate(
        'refresh-token',
        request,
      );
      const newCookie = await serializeAuthCookie(refreshed);
      return {
        session: { user: refreshed.user, tokens: refreshed.tokens },
        headers: { 'Set-Cookie': newCookie },
      };
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  }

  // Both tokens invalid or refresh failed
  return {
    session: null,
    headers: {
      'Set-Cookie': await deleteAuthCookie(),
    },
  };
};

const login = async (username: string, password: string, browserId: string) => {
  const res = await fetcher<ISessionUser>('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ username, password, browserId }),
  });

  return res;
};

const logout = async (request: ISessionUser) => {
  await fetcher<any>('/auth/signout', {
    method: 'POST',
    request,
  });
};

const refreshTokenHandler = async (request: Request) => {
  const cookie = await parseAuthCookie(request);

  const res = await fetcher<ISessionUser>('/auth/refresh-token', {
    method: 'POST',
    headers: {
      'x-refresh-token': cookie?.tokens.refreshToken || '',
      'x-client-id': cookie?.user.id || '',
    },
  });

  return res;
};

const getGoogleUserInfo = async (accessToken: string, request: Request) => {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    throw new Error('Không lấy được thông tin người dùng từ Google.');
  }
  const data = await res.json();
  return data as IGoogleProfile;
};
const getFacebookUserInfo = async (accessToken: string) => {
  const res = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`,
  );
  if (!res.ok) {
    throw new Error('Không lấy được thông tin người dùng từ Facebook.');
  }
  const data = await res.json();

  return data as IFacebookProfile;
};

export { authenticator, logout, isAuthenticated };
