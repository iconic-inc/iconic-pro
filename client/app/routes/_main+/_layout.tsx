import {
  data,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from '@remix-run/react';

import Footer from '~/components/website/Footer';
import HandsomeError from '~/components/HandsomeError';
import Header from '~/components/website/Header';
import { getBranches, getMainBranch } from '~/services/branch.server';
import { getAppSettings } from '~/services/app.server';
import mainStyle from '~/styles/main.scss?url';
import { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { getCategories } from '~/services/category.server';
import { AuthProvider } from '~/context/auth.context';
import { deleteAuthCookie, parseAuthCookie } from '~/services/cookie.server';
import { getCurrentUser } from '~/services/user.server';
import { logout } from '~/services/auth.server';
import { isExpired } from '~/utils';
import { useEffect, useState } from 'react';
import LoadingOverlay from '~/components/LoadingOverlay';
import CTAMenu from '~/components/website/CTAMenu';

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: mainStyle,
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const auth = await parseAuthCookie(request);
  const mainBranch = getMainBranch().catch((err: any) => {
    console.error('Error fetching branches:', err);
    return null;
  });
  const appSettings = getAppSettings().catch((err) => {
    console.error('Error fetching app settings:', err);
    return null;
  });
  const categories = getCategories().catch((err) => {
    console.error('Error fetching categories:', err);
    return { success: false, message: 'Có lỗi xảy ra khi lấy danh mục.' };
  });

  try {
    const isAuthRoute = ['/login', '/logout'].includes(url.pathname);
    const isAuthenticated = auth && auth.tokens && auth.user;
    if (isAuthRoute || !isAuthenticated) {
      return {
        auth: null,
        user: null,
        mainBranch,
        appSettings,
        categories,
      };
    }

    const { tokens } = auth!;

    if (isExpired(tokens.accessToken)) {
      console.log('access token expired');

      return redirect('/login' + `?redirect=${url.pathname}`);
    }

    const user = getCurrentUser(auth!).catch(async (err) => {
      console.error('Error fetching user:', err);

      return {
        success: false,
        message: 'Có lỗi xảy ra khi lấy thông tin người dùng.',
      };
    });

    return {
      auth,
      user,
      mainBranch,
      appSettings,
      categories,
    };
  } catch (error) {
    console.log(error);
    // delete keyToken in database
    if (auth)
      await logout(auth).catch((error) => {
        console.error('Logout error:', error);
      });

    // Clear session data
    return redirect(`/login`, {
      headers: {
        'Set-Cookie': await deleteAuthCookie(),
      },
    });
  }
};

export default function MainLayout() {
  const { auth } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add('w-[430px]');

    return () => {
      document.body.classList.remove('w-[430px]');
    };
  }, []);

  return (
    <AuthProvider
      value={{
        isLoggedIn: !!auth,
        role: auth?.user.usr_role || null,
        logout: async () => {
          setLoading(true);
          await fetch('/logout', {
            method: 'POST',
          }).catch((error) => {
            console.error('Logout error:', error);
          });
          setLoading(false);
          navigate(`/login?redirect=${location.pathname}`, {
            replace: true,
          });
        },
      }}
    >
      <Header />

      <main className='m-auto grid gap-y-8'>
        <Outlet />
      </main>

      <Footer />

      <CTAMenu />

      {(loading || navigation.state === 'loading') && <LoadingOverlay />}
    </AuthProvider>
  );
}

export const ErrorBoundary = () => <HandsomeError />;
