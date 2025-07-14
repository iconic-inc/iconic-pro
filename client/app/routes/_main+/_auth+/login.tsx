// components
import { useEffect, useRef, useState } from 'react';
import {
  Form,
  Link,
  redirect,
  useFetcher,
  useNavigation,
  useSearchParams,
} from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { toast } from 'react-toastify';

import { authenticator, logout } from '~/services/auth.server';
import { isExpired } from '~/utils';
import {
  deleteAuthCookie,
  parseAuthCookie,
  serializeAuthCookie,
} from '~/services/cookie.server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Briefcase, Facebook, User } from 'lucide-react';
import { Button } from '~/components/ui/button';
import TextInput from '~/components/TextInput';
import PasswordInput from '~/components/PasswordInput';
import BookingForm from '~/components/website/BookingForm';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const auth = await parseAuthCookie(request);
  const url = new URL(request.url);
  const redirectUrl = url.searchParams.get('redirect') || '/user/profile';

  // If the user is already authenticated
  if (auth) {
    const { user, tokens } = auth;

    // Check if the access token is expired
    if (isExpired(tokens.accessToken)) {
      console.log('access token expired');

      // If the refresh token is also expired, destroy the session and redirect to login
      if (isExpired(tokens.refreshToken)) {
        console.log('refresh token expired');
        return new Response(null, {
          headers: {
            'Set-Cookie': await deleteAuthCookie(),
          },
          status: 302,
          statusText: 'Redirecting to login',
        });
      }

      try {
        // If the access token is expired but the refresh token is valid, handle refresh token
        const tokenRefresh = await authenticator.authenticate(
          'refresh-token',
          request,
        );

        return redirect(redirectUrl, {
          headers: {
            'Set-Cookie': await serializeAuthCookie(tokenRefresh),
          },
        });
      } catch (err: any) {
        console.error('Error refreshing token:', err);
        await logout(auth).catch((error) => {
          console.error('Logout error:', error);
        });
        return new Response(err.message, {
          headers: {
            'Set-Cookie': await deleteAuthCookie(),
          },
          status: err.status || 500,
          statusText: err.statusText || 'Internal Server Error',
        });
      }
    }

    // If the user is authenticated and the access token is valid, redirect to the specified URL
    throw redirect(redirectUrl);
  }
  // If the user is not authenticated, return an empty object
  // This will allow the login page to render without any data
  return {};
};

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const redicrectUrl = url.searchParams.get('redirect') || '/user/profile';
  try {
    const auth = await authenticator.authenticate('user-pass', request);
    if (auth.user.usr_role.slug === 'spa-owner') {
      // If the user is a spa owner, redirect to the spa owner dashboard
      return redirect('/owner', {
        headers: {
          'Set-Cookie': await serializeAuthCookie(auth),
        },
      });
    }
    return redirect(redicrectUrl, {
      headers: {
        'Set-Cookie': await serializeAuthCookie(auth),
      },
    });
  } catch (err: any) {
    if (err instanceof Response) {
      throw err;
    }

    return {
      toast: {
        message: err.message,
        type: 'error',
      },
    };
  }
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'ungvien';
  const redirectUrl = searchParams.get('redirect') || '/user';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const fetcher = useFetcher<typeof action>();
  const toastIdRef = useRef<any>(null);
  const navigation = useNavigation();

  useEffect(() => {
    switch (navigation.state) {
      case 'loading':
        toast.dismiss();
        break;

      default:
        break;
    }
  }, [navigation.state]);

  useEffect(() => {
    switch (fetcher.state) {
      case 'submitting':
        toastIdRef.current = toast.loading('Loading...', {
          autoClose: false,
        });
        setLoading(true);
        break;

      case 'idle':
        if (fetcher.data?.toast && toastIdRef.current) {
          const { toast: toastData } = fetcher.data as any;
          toast.update(toastIdRef.current, {
            render: toastData.message,
            type: toastData.type || 'success', // Default to 'success' if type is not provided
            autoClose: 3000,
            isLoading: false,
          });
          toastIdRef.current = null;
          setLoading(false);
          break;
        }

        toast.update(toastIdRef.current, {
          render: fetcher.data?.toast.message,
          autoClose: 3000,
          isLoading: false,
          type: 'error',
        });
        setLoading(false);
        break;
    }
  }, [fetcher.state]);

  const [fingerprint, setFingerprint] = useState('');

  useEffect(() => {
    import('@fingerprintjs/fingerprintjs').then((FingerprintJS) => {
      // Initialize an agent at application startup
      FingerprintJS.load()
        .then((fp) => {
          // Get the visitor identifier when you need it
          return fp.get();
        })
        .then((result) => {
          // This is the visitor identifier
          const visitorId = result.visitorId;
          setFingerprint(visitorId);
        })
        .catch((error) => {
          console.error('Error getting fingerprint:', error);
        });
    });
  }, []);

  return (
    <div className='container py-16'>
      <div className='col-span-12 text-center md:text-left'>
        <p className='text-gray-700 text-lg text-center mb-2'>
          Chào mừng bạn đến với
        </p>
        <h2 className='text-3xl sm:text-4xl font-bold mb-1 text-center'>
          <span className='text-main'>
            <span className='text-gray-800'>Iconic</span>
            Pro
          </span>
          <span className='text-gray-800'> | Việc Làm Thẩm mỹ Hàng Đầu</span>
        </h2>
      </div>

      <div className='col-span-12 flex gap-8 items-center justify-between'>
        {/* Left Column: Login/Register Form */}
        <Card className='w-1/2 h-fit bg-white p-0 md:py-10 shadow-xl'>
          <CardHeader className='sm:p-8'>
            <CardTitle className='text-2xl sm:text-3xl font-bold text-gray-800'>
              Đăng ký / Đăng nhập
            </CardTitle>
            <CardDescription className='text-gray-600 text-sm pt-1'>
              Liên kết tài khoản của bạn để tiếp tục sử dụng dịch vụ của ICONIC
              PRO
            </CardDescription>
          </CardHeader>

          <CardContent className='p-6 sm:p-8 -mt-8'>
            <Tabs value={activeTab} className='w-full'>
              <TabsList className='grid w-full grid-cols-2 mb-6 bg-transparent p-0 border-b border-gray-200 rounded-none'>
                <TabsTrigger
                  value='ungvien'
                  className='pb-3 data-[state=active]:shadow-none data-[state=active]:border-main data-[state=active]:text-main rounded-none'
                  onClick={() => setActiveTab('ungvien')}
                >
                  <User size={18} className='mr-2' /> Ứng viên
                </TabsTrigger>

                <TabsTrigger
                  value='chuspa'
                  className='pb-3 data-[state=active]:shadow-none data-[state=active]:border-red-500 data-[state=active]:text-main rounded-none'
                  onClick={() => setActiveTab('chuspa')}
                >
                  <Briefcase size={18} className='mr-2' /> Nhà tuyển dụng
                </TabsTrigger>
              </TabsList>

              <TabsContent value='ungvien'>
                <div className='flex flex-col space-y-4'>
                  <Link
                    to={`/auth/google`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.cookie = `fp=${fingerprint}; path=/; max-age=300; SameSite=Lax`;
                      document.cookie = `redirect=${redirectUrl}; path=/; max-age=300; SameSite=Lax`;
                      window.location.href = '/auth/google';
                    }}
                  >
                    <Button
                      variant='outline'
                      className='w-full text-gray-700 border-gray-300 hover:bg-gray-50 py-3'
                    >
                      <img
                        src='/assets/google.svg'
                        className='mr-2 w-5 h-5 text-red-600'
                      />
                      {/* Using Chrome as a stand-in for Google logo */}
                      Tiếp tục với Google
                    </Button>
                  </Link>

                  {/* <Link
                  to={`/auth/facebook?fp=${fingerprint}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.cookie = `fp=${fingerprint}; path=/; max-age=300; SameSite=Lax`;
                    window.location.href = '/auth/facebook';
                  }}
                >
                  <Button className='w-full bg-blue-800 hover:bg-blue-900 text-white py-3'>
                    <Facebook size={20} className='mr-2' />
                    Tiếp tục với Facebook
                  </Button>
                </Link> */}
                </div>
              </TabsContent>

              <TabsContent value='chuspa'>
                {/* Content for Nhà tuyển dụng tab - can be different form fields or info */}
                <div className=''>
                  <fetcher.Form method='POST' className='space-y-5'>
                    <TextInput
                      label='Tên đăng nhập hoặc email'
                      name='username'
                      value={username}
                      onChange={(value) => setUsername(value)}
                      placeholder='Nhập tên đăng nhập hoặc email'
                    />

                    <PasswordInput
                      id='password'
                      label='Mật khẩu'
                      name='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder='Nhập mật khẩu'
                    />

                    <input
                      type='hidden'
                      name='fingerprint'
                      value={fingerprint}
                    />

                    <Button
                      type='submit'
                      className='w-full bg-blue-500 hover:bg-blue-600 text-white'
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Đăng nhập'}
                    </Button>
                  </fetcher.Form>
                </div>
              </TabsContent>
            </Tabs>

            <p className='text-xs text-gray-500 mt-8 text-center'>
              Bằng việc tiếp tục, bạn đồng ý với{' '}
              <a href='#' className='text-main hover:underline'>
                Điều Khoản Sử Dụng
              </a>{' '}
              và{' '}
              <a href='#' className='text-main hover:underline'>
                Chính Sách Bảo Mật
              </a>{' '}
              của Iconic PRO.
            </p>
          </CardContent>
        </Card>
        {/* Right Column: Welcome Message & Benefits */}
        <div className='w-1/2 flex justify-center items-center mt-8 md:mt-0'>
          {activeTab === 'chuspa' ? (
            <BookingForm />
          ) : (
            <img
              src='https://placehold.co/450x280/f2e6d6/f582a8?text=Illustration+(Beauty)'
              alt='Developer working at desk illustration'
              className='rounded-lg shadow-md max-w-md w-full h-auto'
            />
          )}
        </div>
      </div>

      <Card className='col-span-12 bg-white shadow-lg'>
        <CardContent className='p-6'>
          <p className='text-gray-700 mb-4 text-sm sm:text-base'>
            Đăng nhập ngay để tận dụng tối đa các công cụ của Iconic PRO và gia
            tăng cơ hội tiếp cận công việc Thẩm Mỹ hot nhất
          </p>
          <ul className='space-y-2 text-gray-600 text-sm sm:text-base list-inside'>
            {[
              'Tạo CV chuẩn và chuyên nghiệp chỉ trong vài phút',
              'Tìm kiếm việc làm Thẩm Mỹ phù hợp với kỹ năng và sở thích',
              'Nhận thông báo việc làm mới nhất từ các nhà tuyển dụng hàng đầu',
            ].map((benefit) => (
              <li key={benefit} className='flex items-start'>
                <span className='text-main mr-2 mt-1'>&#8226;</span>{' '}
                {/* Bullet point */}
                {benefit}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
