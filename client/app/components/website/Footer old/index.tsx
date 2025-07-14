import { Link } from '@remix-run/react';

import style from './index.module.css';
import { Facebook, Youtube } from 'lucide-react';
import { useMainLoaderData } from '~/lib/useMainLoaderData';
import Defer from '../../Defer';
import { useAuthContext } from '~/context/auth.context';
import { toAddressString } from '~/utils/address.util';

export default function Footer() {
  const { appSettings, mainBranch } = useMainLoaderData();
  const { isLoggedIn } = useAuthContext();

  return (
    <footer
      id={style.footer}
      className='border-t border-zinc-200 py-8 bg-white'
    >
      <div className='container flex flex-col gap-8'>
        <Defer resolve={appSettings}>
          {({ app_title, app_social: social, ...app }) => (
            <>
              {' '}
              <section className='!flex md:items-center justify-between flex-col md:flex-row'>
                <div className='flex flex-col col-span-3 md:items-center'>
                  <img
                    className='object-scale-down scale-150 w-fit h-fit z-0'
                    src={app.app_logo?.img_url}
                    alt={app_title}
                  />
                  <p className='md:text-center text-[--sub1-text] mt-2'>
                    {app_title}
                  </p>
                </div>

                {isLoggedIn || (
                  <div className='col-span-3 col-start-10 flex items-center justify-center gap-4 font-bold'>
                    <Link
                      to='/login?tab=chuspa'
                      className='inline-flex items-center gap-2 rounded border border-[--sub4-color] bg-[--sub4-color] px-4 py-2 text-sm transition-all hover:shadow-lg disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none text-[--sub4-text] text-[--sub4-color]'
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
                  </div>
                )}
              </section>
              <section className='border-b border-black pb-4'>
                <div className='col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3'>
                  <h4>Phụ huynh</h4>

                  <ul className={style.list}>
                    <li className={style.item}>
                      <Link to='/'> Xem 4 bước chọn trường mầm non</Link>
                    </li>
                  </ul>
                </div>

                <div className='col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3'>
                  <h4>Phụ huynh</h4>

                  <ul className={style.list}>
                    <li className={style.item}>
                      <Link to='/'> Xem 4 bước chọn trường mầm non</Link>
                    </li>
                  </ul>
                </div>

                <div className='col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3'>
                  <h4>Phụ huynh</h4>

                  <ul className={style.list}>
                    <li className={style.item}>
                      <Link to='/'> Xem 4 bước chọn trường mầm non</Link>
                    </li>
                  </ul>
                </div>
              </section>
              <section>
                <div className='col-span-12 md:col-span-9'>
                  <p>Copyright © 2025 {app_title}</p>
                  <p>
                    Iconic PRO -<br />
                    <strong>Mã số thuế:</strong> {app.app_taxCode} <br />
                    <b>Cấp ngày:</b> 10/06/2020 tại Sở Kế hoạch và Đầu tư thành
                    phố Hồ Chí Minh
                    <br />
                    <b>Đại diện:</b> Ông
                  </p>
                  <Defer resolve={mainBranch}>
                    {(mainBranch) => {
                      if (!mainBranch) return null;

                      return (
                        <>
                          <p>
                            Địa chỉ: {toAddressString(mainBranch.bra_address)}
                          </p>
                          <p>
                            <b>Email:</b>{' '}
                            <a
                              className='underline hover:text-main'
                              href={`mailto:${mainBranch.bra_email}`}
                              target='_blank'
                              rel='noreferrer'
                            >
                              {mainBranch.bra_email}
                            </a>
                          </p>
                          <p>
                            <b>Hotline:</b>{' '}
                            <a
                              className='underline hover:text-main'
                              href={`tel:${mainBranch.bra_msisdn}`}
                            >
                              {mainBranch.bra_msisdn}
                            </a>
                          </p>
                        </>
                      );
                    }}
                  </Defer>
                </div>

                <div className='col-span-6 md:col-span-3'>
                  <a
                    href='http://online.gov.vn/Home/WebDetails/124317?AspxAutoDetectCookieSupport=1'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <img
                      data-v-101a839d=''
                      data-v-728576c6=''
                      alt='Logo Chứng nhận dịch vụ công trực tuyến'
                      className='aspect-[5/2] bg-white mx-auto object-scale-down lazyLoad isLoaded'
                      src='http://online.gov.vn/Content/EndUser/LogoCCDVSaleNoti/logoSaleNoti.png'
                    />
                  </a>
                </div>
              </section>
              <section>
                <div className='col-span-12'>
                  <h4 className='text-center'>KẾT NỐI VỚI CHÚNG TÔI</h4>

                  <ul className='text-[--sub2-text] flex flex-wrap gap-4 items-center justify-center'>
                    {social.facebook && (
                      <li className='hover:text-main'>
                        <Link to={social.facebook}>
                          <Facebook />
                        </Link>
                      </li>
                    )}
                    {social.youtube && (
                      <li className='hover:text-main'>
                        <Link to={social.youtube}>
                          <Youtube />
                        </Link>
                      </li>
                    )}
                    {social.tiktok && (
                      <li className='hover:text-main'>
                        <Link to={social.tiktok}>
                          <img
                            src='/assets/tiktok.svg'
                            alt='TikTok'
                            className='w-6 h-6'
                          />
                        </Link>
                      </li>
                    )}
                    {social.zalo && (
                      <li className='hover:text-main'>
                        <Link to={social.zalo}>
                          <img
                            src='/assets/zalo.svg'
                            alt='Zalo'
                            className='w-6 h-6'
                          />
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </section>
            </>
          )}
        </Defer>
      </div>
    </footer>
  );
}
