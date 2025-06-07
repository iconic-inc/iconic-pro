import { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/react';
import { parseAuthCookie } from '~/services/cookie.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const auth = await parseAuthCookie(request);
  if (!auth || !auth.user) {
    return redirect('/login');
  }

  switch (auth.user.usr_role.slug) {
    case 'spa-owner':
      return redirect('/owner');
    case 'admin':
      return redirect('/admin');
    case 'client':
    default:
      return redirect('/user/profile');
  }
};
