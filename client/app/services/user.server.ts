import { ISessionUser } from '~/interfaces/auth.interface';
import { fetcher } from '.';
import {
  IUser,
  IUserAttrs,
  IUserSocialLogin,
} from '~/interfaces/user.interface';

const getCurrentUser = async (request: ISessionUser) => {
  const user = await fetcher('/users/me', {
    request,
  });
  return user as IUser;
};

const updateUser = async (userId: string, data: any, request: ISessionUser) => {
  const user = await fetcher(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    request,
  });
  return user as IUser;
};

async function createOrUpdateUserFromOAuth({
  provider,
  profile,
  browserId,
}: {
  provider: 'google' | 'facebook';
  profile: IUserSocialLogin;
  browserId: string;
}) {
  return await fetcher<ISessionUser>('/auth/social-login', {
    method: 'POST',
    body: JSON.stringify({ provider, profile, browserId }),
  });
}

export { getCurrentUser, updateUser, createOrUpdateUserFromOAuth };
