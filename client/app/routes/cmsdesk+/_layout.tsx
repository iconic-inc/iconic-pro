import { ActionFunctionArgs, LoaderFunctionArgs, data } from '@remix-run/node';
import {
  Link,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from '@remix-run/react';
import {
  LayoutDashboard,
  Image,
  List,
  GitBranch,
  FileText,
  Calendar,
  LogOut,
} from 'lucide-react';
import 'react-toastify/ReactToastify.css';

import HandsomeError from '~/components/HandsomeError';
import { updateAppSettings } from '~/services/app.server';
import { authenticator, isAuthenticated } from '~/services/auth.server';
import { getCurrentUser } from '~/services/user.server';
import { IUser } from '~/interfaces/user.interface';
import { countUnseenBookings } from '~/services/booking.server';
import LoadingOverlay from '~/components/LoadingOverlay';
import { isExpired } from '~/utils';
import { parseAuthCookie } from '~/services/cookie.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { session, headers } = await isAuthenticated(request);

    if (!session) {
      return data(
        {
          error: 'Unauthorized',
          toast: { message: 'Unauthorized', type: 'error' },
        },
        { headers },
      );
    }

    let formData = await request.formData();

    const res = await updateAppSettings(
      {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        logo: formData.get('logo') as string,
        favicon: formData.get('favicon') as string,
        social: {
          facebook: formData.get('facebook') as string,
          youtube: formData.get('youtube') as string,
          tiktok: formData.get('tiktok') as string,
          zalo: formData.get('zalo') as string,
        },
        taxCode: formData.get('taxCode') as string,
        headScripts: formData.get('headScripts') as string,
        bodyScripts: formData.get('bodyScripts') as string,
      },
      session,
    );

    return data(
      {
        ...res,
        toast: { message: 'Cập nhật thông tin thành công!', type: 'success' },
      },
      { headers },
    );
  } catch (error: any) {
    console.error('Error updating app settings:', error);
    return data(
      {
        error: 'Failed to update app settings',
        toast: { message: error.message || error.statusText, type: 'error' },
      },
      {},
    );
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  try {
    const auth = await parseAuthCookie(request);

    if (url.pathname === '/admin/login') {
      return {
        user: null,
        unseenBookings: 0,
      };
    }

    if (!auth) {
      return redirect('/admin/login' + `?redirect=${url.pathname}`);
    }

    const { tokens } = auth;

    if (isExpired(tokens.accessToken)) {
      console.log('access token expired');

      return redirect('/admin/login' + `?redirect=${url.pathname}`);
    }

    const unseenBookings = await countUnseenBookings(auth!);
    const user = await getCurrentUser(auth!);
    return { user, unseenBookings };
  } catch (error) {
    console.error('Error loading CMS desk:', error);
    return { user: null, unseenBookings: 0 };
  }
};

export function ErrorBoundary() {
  return <HandsomeError basePath='/cmsdesk' />;
}

export default function CmsDesk() {
  const { user, unseenBookings } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return (
    <div className='flex min-h-screen bg-gray-100 font-sans antialiased'>
      {/* <div className='flex flex-wrap bg-gray-100 w-full h-screen overflow-hidden'> */}
      <SideBar user={user!} unseenBookings={unseenBookings} />

      <main className='flex-1 ml-64 p-8 lg:p-12 overflow-y-auto'>
        <Outlet />
      </main>
      {/* </div> */}

      {navigation.state === 'loading' && <LoadingOverlay />}
    </div>
  );
}

const SideBar = ({
  user,
  unseenBookings,
}: {
  user: IUser;
  unseenBookings: boolean;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/cmsdesk', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/cmsdesk/images', label: 'Hình ảnh', icon: Image },
    { to: '/cmsdesk/categories', label: 'Danh mục', icon: List },
    {
      to: '/cmsdesk/branches',
      label: 'Chi nhánh',
      icon: GitBranch,
    },
    { to: '/cmsdesk/pages', label: 'Trang', icon: FileText },
    {
      to: '/cmsdesk/bookings',
      label: 'Đặt lịch',
      icon: Calendar,
      badge: !!unseenBookings && (
        <div
          className={`absolute top-2 right-2 inline-block select-none whitespace-nowrap rounded-full 
    py-1 px-2 align-baseline font-sans text-xs font-medium capitalize leading-none bg-red-500
    tracking-wide text-white`}
        >
          <div className='mt-px'>
            <span className='font-bold'>{unseenBookings}</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <aside className='fixed top-0 left-0 h-full w-64 bg-white p-6 shadow-xl rounded-r-xl flex flex-col justify-between'>
      <div>
        <UserBrief user={user} />

        <nav className='space-y-2'>
          {navLinks.map(({ icon: Icon, ...nav }, i) => (
            <div key={i}>
              <NavLink
                to={nav.to}
                className={({}) =>
                  `${
                    (
                      nav.to.replace('/cmsdesk', '')
                        ? location.pathname.includes(nav.to)
                        : location.pathname === nav.to
                    )
                      ? 'bg-orange-100 text-orange-500 shadow-sm'
                      : ''
                  } flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 hover:text-orange-500 relative`
                }
              >
                {nav.badge}
                <Icon className='w-5 h-5' />
                <span className='font-medium'>{nav.label}</span>
              </NavLink>
            </div>
          ))}
        </nav>
      </div>

      <div className='mt-auto pt-4 border-t border-gray-200'>
        <NavLink
          to='/admin/logout'
          className='flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100'
          onClick={async (e) => {
            e.preventDefault();

            if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
              await fetch('/admin/logout', { method: 'POST' });
              navigate(`/admin/login?redirect=${location.pathname}`, {
                replace: true,
              });
            }
          }}
        >
          <LogOut className='w-5 h-5' />
          <span>Đăng xuất</span>
        </NavLink>
      </div>
    </aside>
  );
};

const UserBrief = ({ user }: { user: IUser }) => {
  const fullName = `${user.usr_firstName} ${user.usr_lastName}`;

  return (
    <div className='flex items-center mb-10 pb-4 border-b border-gray-200'>
      <img
        className='w-10 h-10 rounded-full mr-3 shadow-md'
        src={user.usr_avatar?.img_url || '/assets/user-avatar-placeholder.jpg'}
        alt={fullName}
      />

      <div>
        <h1 className='text-xl font-bold text-gray-800'>{fullName}</h1>
        <div className='flex items-center text-green-500 text-sm'>
          <span className='w-2 h-2 bg-green-500 rounded-full mr-1'></span>{' '}
          Verified
        </div>
      </div>
    </div>
  );
};
