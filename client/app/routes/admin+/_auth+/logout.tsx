import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { isAuthenticated, logout } from '~/services/auth.server';
import { deleteAuthCookie, parseAuthCookie } from '~/services/cookie.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await parseAuthCookie(request);
  if (!session) {
    return null;
  }

  const url = new URL(request.url);
  const redirectUrl = url.searchParams.get('redirect');

  try {
    // delete keyToken in database
    await logout(session).catch((error) => {
      console.error('Logout error:', error);
    });

    // Clear session data
    return redirect(`/admin/login?redirect=${redirectUrl}`, {
      headers: {
        'Set-Cookie': await deleteAuthCookie(),
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
    throw redirect(`/admin/login?redirect=${redirectUrl}`, {
      headers: {
        'Set-Cookie': await deleteAuthCookie(),
      },
    });
  }
};
