import { LoaderFunctionArgs } from '@remix-run/node';
import { redirect, Outlet } from '@remix-run/react';
import { parseAuthCookie } from '~/services/cookie.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const auth = await parseAuthCookie(request);
  if (!auth || !auth.user) {
    const url = new URL(request.url);
    return redirect(`/login?redirect=${encodeURIComponent(url.pathname)}`);
  }
  return {};
};

export default function UserLayout() {
  return <Outlet />;
}
