import { Link, NavLink } from '@remix-run/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Defer from '~/components/Defer';
import { useMainLoaderData } from '~/lib/useMainLoaderData';

export default function Header({ shadow }: { shadow?: boolean }) {
  const { appSettings, categories } = useMainLoaderData();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className={`${
        shadow ? 'shadow-lg' : ''
      } fixed top-0 w-full bg-white flex z-40 `}
    >
      <div className='container flex items-center justify-between'>
        <Defer resolve={appSettings}>
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
                className={`${
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
                  <Defer resolve={categories}>
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
          <Link
            to='/login'
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

          <button
            className='lg:hidden'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu />
          </button>
        </div>
      </div>
    </header>
  );
}
