import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { authenticator, isAuthenticated, logout } from '~/services/auth.server';
import { deleteAuthCookie } from '~/services/cookie.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const auth = await isAuthenticated(request);
  if (!auth) {
    return null;
  }

  try {
    // delete keyToken in database
    await logout(auth);

    return redirect(`/cmsdesk/login`, {
      headers: {
        'Set-Cookie': await deleteAuthCookie(),
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
    return null;
  }
};
