import { Link, NavLink } from '@remix-run/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Defer from '~/components/Defer';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { AuthConsumer, isClient } from '~/context/auth.context';
import { ICategory } from '~/interfaces/category.interface';
import { IUser } from '~/interfaces/user.interface';
import { useMainLoaderData } from '~/lib/useMainLoaderData';

export default function Header({ shadow }: { shadow?: boolean }) {
  const { appSettings, categories, user } = useMainLoaderData();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className={`${
        shadow ? 'shadow-lg' : ''
      } fixed top-0 w-full bg-white flex z-50`}
    >
      <div className='container flex items-center justify-between'>
        <Defer resolve={appSettings} fallback={<div className='logo' />}>
          {(app) => (
            <div className='logo'>
              <Link className='px-2 py-4' to='/'>
                <img
                  className='h-10 object-contain'
                  src={app.app_logo?.img_url}
                  alt={app.app_title}
                />
              </Link>

              <nav
                className={`z-[100] ${
                  isMenuOpen ? 'left-0' : 'left-full'
                } lg:ml-4 max-lg:fixed lg:block transition-all duration-300 inset-0 w-full h-full bg-black/50 lg:bg-inherit flex justify-end`}
                onClick={() => setIsMenuOpen(false)}
              >
                <button
                  className='lg:hidden absolute top-4 left-4 text-white'
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <X />
                </button>

                <ul
                  className='flex items-center text-[--sub1-text] rounded-lg bg-white h-full min-w-60 gap-4 lg:w-full flex-col lg:flex-row m-2 lg:m-0 p-4 lg:p-0'
                  onClick={(e) => e.stopPropagation()}
                >
                  <Defer<ICategory[]> resolve={categories}>
                    {(cats) =>
                      cats.map((item, index) => (
                        <li
                          key={index}
                          className='mx-2 hover:text-[--sub4-color] font-semibold'
                        >
                          <NavLink
                            className='p-2'
                            to={`/${item.cat_page.pst_slug}`}
                          >
                            {item.cat_name}
                          </NavLink>
                        </li>
                      ))
                    }
                  </Defer>
                </ul>
              </nav>
            </div>
          )}
        </Defer>

        <div className='btn text-[--sub4-text] font-semibold'>
          <AuthConsumer>
            {(auth) =>
              auth.isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className='w-8 h-8 transition-transform hover:scale-105'>
                      <Defer<IUser>
                        resolve={user!}
                        fallback={
                          <AvatarImage src='/assets/user-avatar-placeholder.jpg' />
                        }
                      >
                        {(user) => (
                          <>
                            <AvatarImage
                              src={
                                user?.usr_avatar?.img_url ||
                                '/assets/user-avatar-placeholder.jpg'
                              }
                              alt={`${user?.usr_firstName} ${user?.usr_lastName}`}
                            />
                            <AvatarFallback className='bg-gray-500 text-white'>
                              {user?.usr_firstName?.charAt(0).toUpperCase() ||
                                user?.usr_lastName?.charAt(0).toUpperCase() ||
                                'U'}
                            </AvatarFallback>
                          </>
                        )}
                      </Defer>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='w-56'>
                    <DropdownMenuGroup>
                      {isClient(auth.role) ? (
                        <>
                          <DropdownMenuItem>
                            <Link className='w-full' to='/user/profile'>
                              Tài khoản
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link to='/user/don-ung-tuyen' className='w-full'>
                              Đơn ứng tuyển
                            </Link>
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <DropdownMenuItem>
                          <Link to='/owner'>Trang quản lý</Link>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => {
                        auth.logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link
                    to='/login?tab=chuspa'
                    className='inline-flex items-center gap-2 rounded border bg-[--sub4-color] px-4 py-2 text-sm transition-all hover:shadow-lg disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                  >
                    Chủ Spa
                  </Link>

                  <Link
                    to='/login'
                    className='inline-flex items-center gap-2 rounded border border-[--sub4-color] px-4 
            py-2 text-sm transition-all hover:shadow-lg disabled:pointer-events-none 
            disabled:opacity-50 disabled:shadow-none hidden sm:inline-block text-[--sub4-color]'
                  >
                    Đăng nhập
                  </Link>
                </>
              )
            }
          </AuthConsumer>

          <button
            className='lg:hidden text-[--sub1-text]'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu />
          </button>
        </div>
      </div>
    </header>
  );
}
