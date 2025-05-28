import { Outlet } from '@remix-run/react';

import Footer from '~/components/website/Footer';
import HandsomeError from '~/components/HandsomeError';
import Header from '~/components/website/Header';
import { getBranches } from '~/services/branch.server';
import { getAppSettings } from '~/services/app.server';
import mainStyle from '~/styles/main.scss?url';
import { LinksFunction } from '@remix-run/node';
import { getCategories } from '~/services/category.server';

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: mainStyle,
  },
];

export const loader = () => {
  const branches = getBranches();
  const appSettings = getAppSettings();
  const categories = getCategories();

  return {
    branches,
    appSettings,
    categories,
  };
};

export default function MainLayout() {
  return (
    <>
      <Header shadow />

      <main className='mt-[72px] grid gap-y-16'>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export const ErrorBoundary = () => <HandsomeError />;
