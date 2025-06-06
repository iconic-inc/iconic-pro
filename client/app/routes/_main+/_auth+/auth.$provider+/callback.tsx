// routes/auth.google.callback.ts
import { LoaderFunction, redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { serializeAuthCookie } from '~/services/cookie.server';

export const loader: LoaderFunction = async ({ request, params }) => {
  const provider = params.provider;
  if (!provider || !['google', 'facebook'].includes(provider)) {
    throw new Response('Phương thức xác thực không hỗ trợ.', { status: 400 });
  }

  const clearFingerprint =
    'fp=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax';

  try {
    const res = await authenticator.authenticate(provider, request);

    const headers = new Headers();
    // If the authentication was successful, serialize the auth cookie
    if (res) {
      headers.append('Set-Cookie', await serializeAuthCookie(res));
    }
    // Redirect to the home page or wherever you want after successful login
    // and clear the fingerprint cookie
    headers.append('Set-Cookie', clearFingerprint);

    return redirect('/user', {
      headers,
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    throw redirect('/login?error=authentication_failed', {
      headers: {
        'Set-Cookie': clearFingerprint,
      },
    });
  }
};
