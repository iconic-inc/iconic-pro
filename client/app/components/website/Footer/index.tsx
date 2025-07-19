import { Image } from '@unpic/react';

import style from './index.module.css';
import { Link } from '@remix-run/react';
import { Facebook, Youtube } from 'lucide-react';
import { Separator } from '~/components/ui/separator';
import { useMainLoaderData } from '~/lib/useMainLoaderData';
import { useEffect, useState } from 'react';
import { toAddressString } from '~/utils/address.util';

export default function Footer() {
  const { appSettings, mainBranch } = useMainLoaderData();
  const [msisdn, setMsisdn] = useState('');
  const [address, setAddress] = useState('');
  const [logo, setLogo] = useState('');
  const [email, setEmail] = useState('');
  const [facebook, setFacebook] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [youtube, setYoutube] = useState('');
  const [zalo, setZalo] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const [settings, branch] = await Promise.all([appSettings, mainBranch]);
      setMsisdn(branch?.bra_msisdn || '');
      setAddress(toAddressString(branch?.bra_address || ({} as any)));
      setLogo(settings?.app_logo?.img_url || '');
      setEmail(branch?.bra_email || '');
      setFacebook(settings?.app_social?.facebook || '');
      setTiktok(settings?.app_social?.tiktok || '');
      setYoutube(settings?.app_social?.youtube || '');
      setZalo(settings?.app_social?.zalo || '');
    };
    loadData();
  }, [appSettings, mainBranch]);

  return (
    <footer id={`${style.footer}`} className='bg-main'>
      <div className='container grid-cols-1 py-10 px-4'>
        <div className='flex flex-col gap-7'>
          <aside className='col-span-3'>
            <Link to='/'>
              <div className='h-40'>
                <Image
                  className='object-contain m-auto px-16'
                  src={logo || '/images/logo.png'}
                  layout='fullWidth'
                  alt='Logo'
                ></Image>
              </div>
            </Link>

            <p className='text-justify my-4'>
              Với sứ mệnh đào tạo nguồn nhân lực chất lượng cao cho ngành làm
              đẹp, Iconic Pro luôn không ngừng cập nhật và hoàn thiện chương
              trình đào tạo để mang đến cho học viên những kiến thức và kỹ năng
              thực tiễn nhất. Iconic Pro: Nơi khởi nguồn những chuyên gia làm
              đẹp tương lai.
            </p>

            <a href='http://' target='_blank' rel='noopener noreferrer'>
              <div className='h-10 w-fit'>
                <img
                  className='object-contain'
                  src='/images/dmca-protected.png'
                  alt='DMCA Protected'
                />
              </div>
            </a>
          </aside>

          <section id={style.contact} className='w-full col-span-3'>
            <h3>THÔNG TIN LIÊN HỆ</h3>

            <ul className='space-y-2 mt-4'>
              <li className=''>
                <span className='text-nowrap'>Địa chỉ:</span>
                <b>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-wrap'
                  >
                    {address}
                  </a>
                </b>
              </li>
              <li>
                <span>Hotline:</span>
                <b>
                  <a href={`tel:${msisdn}`}>{msisdn}</a>
                </b>
              </li>
              <li>
                <span>Email:</span>
                <b>
                  <a href={email}>{email}</a>
                </b>
              </li>
              <li>
                <span>
                  Thời gian làm việc: <b>8h30 - 17h00 từ Thứ 2 - Chủ nhật</b>
                </span>
              </li>
            </ul>

            <section id={style.social_media} className='mt-5'>
              <h4 className='text-center'>Theo dõi chúng tôi tại:</h4>

              <ul className='flex justify-center'>
                {tiktok && (
                  <li>
                    <a
                      href={tiktok}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-black'
                    >
                      <div className='w-6 h-6 m-0 flex items-center justify-center'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                        >
                          <path d='M16 8.24537V15.5C16 19.0899 13.0899 22 9.5 22C5.91015 22 3 19.0899 3 15.5C3 11.9101 5.91015 9 9.5 9C10.0163 9 10.5185 9.06019 11 9.17393V12.3368C10.5454 12.1208 10.0368 12 9.5 12C7.567 12 6 13.567 6 15.5C6 17.433 7.567 19 9.5 19C11.433 19 13 17.433 13 15.5V2H16C16 4.76142 18.2386 7 21 7V10C19.1081 10 17.3696 9.34328 16 8.24537Z'></path>
                        </svg>
                      </div>
                    </a>
                  </li>
                )}

                {facebook && (
                  <li>
                    <a
                      href={facebook}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600'
                    >
                      <Facebook />
                    </a>
                  </li>
                )}

                {youtube && (
                  <li>
                    <a
                      href={youtube}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-red-600'
                    >
                      <Youtube />
                    </a>
                  </li>
                )}

                {zalo && (
                  <li>
                    <a href={zalo} target='_blank' rel='noopener noreferrer'>
                      <img
                        src='/assets/zalo.png'
                        alt='Zalo'
                        className='w-6 h-6'
                      />
                    </a>
                  </li>
                )}
              </ul>
            </section>
          </section>

          <section className='col-span-3'>
            <h3 className='font-bold text-xl'>CHÍNH SÁCH CHUNG</h3>

            <ul>
              <li>
                <Link to='#'>Quy định và điều khoản</Link>
              </li>
              <li>
                <Link to='#'>Chính sách bảo mật thông tin</Link>
              </li>
              <li>
                <Link to='/chi-nhanh'>Hệ thống cơ sở đào tạo</Link>
              </li>
            </ul>
          </section>

          <section className='col-span-3'>
            <h3 className='font-bold text-xl'>KHÓA HỌC NỔI BẬT</h3>

            <ul>
              <li>
                <Link to='/#hot-courses'>Khóa học Marketing</Link>
              </li>
              <li>
                <Link to='/#hot-courses'>Khóa học Telesales</Link>
              </li>
              <li>
                <Link to='/#hot-courses'>Khóa học Tư vấn viên</Link>
              </li>
              <li>
                <Link to='/#hot-courses'>Quản lý spa & thẩm mỹ viện</Link>
              </li>
            </ul>
          </section>
        </div>

        <Separator />

        <div className='text-sm text-center flex flex-col items-center font-semibold'>
          <p className='flex flex-col'>
            <span className='text-center'>
              2020 - 2025 CÔNG TY TNHH GIÁO DỤC VÀ ĐÀO TẠO ICONIC PRO - ICONIC
              PRO EDUCATION AND TRAINING COMPANY LIMITED
            </span>
            {/* <span className='text-center mt-2'>
              Số ĐKKD: 0315 789 123 Do sở KHĐT TP.HCM cấp ngày 15/08/2020
            </span> */}
          </p>

          <section id={style['contact-information']} className='mt-2'>
            <p>
              <span>Địa chỉ:</span>
              <span className=''>
                123 Nguyễn Văn Cừ, Phường 4, Quận 5, TP. Hồ Chí Minh
              </span>
            </p>
            <p>
              <span>Số điện thoại:</span>
              <span>0901234567</span>
            </p>
            <p>
              <span>Email:</span>
              <span>info@iconicpro.edu.vn</span>
            </p>
            <p>
              <span>Người quản lý nội dung:</span>
              <span>Nguyễn Văn An</span>
            </p>
          </section>
        </div>
      </div>
    </footer>
  );
}
