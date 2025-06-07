import { type MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import {
  BookOpen,
  FileText,
  Users,
  IdCard,
  UserCheck,
  UserCog,
} from 'lucide-react';

import ItemList from './_components/ItemList';
import Post from './_components/Post';
import Specifications from './_components/Specifications';
import SearchBox from '~/components/website/SearchBox';
import { getAppSettings } from '~/services/app.server';
import { JOB_POST } from '~/constants/jobPost.constant';

export const loader = async () => {
  try {
    const appSettings = await getAppSettings();

    return {
      appSettings,
    };
  } catch (error) {
    console.error('Error in loader:', error);
    return {
      appSettings: null,
    };
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { appSettings } = data || {};
  return [
    { title: appSettings?.app_title || 'Iconic Pro' },
    {
      name: 'description',
      content:
        appSettings?.app_description ||
        'Iconic Pro - Học viện Kỹ năng Chuyên nghiệp Ngành Làm đẹp.',
    },
  ];
};

export default function Index() {
  return (
    <>
      <section>
        <div
          style={{
            backgroundImage: 'url(/assets/banner-1.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: 600,
          }}
        >
          <div className='bg-slate-950/60 h-full w-full'>
            <div className='container flex items-center justify-center h-full flex-col text-[--sub4-text]'>
              <h1 className='text-3xl font-bold text-[--sub4-text]'>
                TÌM VIỆC LÀM ĐẸP PHÙ HỢP{' '}
                <span className='text-[--main-color]'>NHANH NHẤT</span> VỚI
                ICONIC PRO
              </h1>

              <p className='text-lg my-4 text-[--sub4-text]'>
                Nền tảng chọn Việc làm Ngành Làm đẹp{' '}
                <b className='text-[--main-color]'>#1</b> Việt Nam
              </p>

              <div className='w-full md:w-2/3'>
                <SearchBox />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Specifications />

      <section className='container'>
        <h2 className='title col-span-12'>Tin mới</h2>

        <div className='col-span-12'>
          <Post
            post={{
              thumbnail: '/assets/news.png',
              title:
                'Iconic Pro giới thiệu tài liệu "Ranking Top 100 Spa, Thẩm mỹ viện Hot Nhất Tháng 6" – thông tin đáng giá về xu hướng và chất lượng dịch vụ',
              excerpt:
                'Trong bối cảnh các tiêu chí lựa chọn Spa, Thẩm mỹ viện ngày càng đa dạng và khắt khe, Iconic Pro tự hào giới thiệu tài liệu "Ranking Top 100 Spa, Thẩm mỹ viện Hot Nhất Tháng 6". Đây là nguồn thông tin quý giá giúp phụ huynh và người tiêu dùng có cái nhìn tổng quan về các cơ sở làm đẹp hàng đầu.',
              slug: 'ranking-top-100-truong-hot-nhat-thang-10',
            }}
          />
        </div>
      </section>

      <section className='container' id='phu-huynh'>
        <h2 className='title col-span-12'>DÀNH CHO NGƯỜI TÌM VIỆC</h2>

        <section className='col-span-12'>
          <ItemList
            items={Object.values(JOB_POST.TYPE).map((t) => ({
              title: t.name,
              slug: t.slug,
              thumbnail:
                'https://s3.ap-southeast-1.amazonaws.com/kiddihub-prod/1/YdXJB0S5ITJEODXv-GMIQfkOJyBmQkXmH.jpg',
              count: 9978,
              // thumbnail: t.thumbnail,
              // count: t.count,
            }))}
          />

          {/* <div className='mt-6'>
            <Link
              to='/blog/tutorial'
              className='text-[--sub3-color] underline text-sm'
            >
              <i>Hướng dẫn cách tìm trường phù hợp và nhanh nhất</i>
            </Link>
          </div> */}
        </section>
      </section>

      <section id='chu-truong'>
        <div className='container'>
          <h2 className='title col-span-12'>DÀNH CHO CHỦ SPA</h2>

          <div className='col-span-12 flex flex-col lg:grid grid-cols-12 mt-4'>
            <div className='col-span-6'>
              <ul>
                {services.map((service, i) => (
                  <li
                    key={i}
                    className='rounded-lg shadow-lg border px-4 py-2 mt-4 flex items-center justify-between gap-4'
                  >
                    <p className='uppercase text-[--sub2-text] text-sm'>
                      {service.title}
                    </p>

                    <div>
                      <Link
                        to={service.link}
                        className='block w-max bg-[--sub4-color] text-[--sub4-text] px-2 py-1 rounded font-medium'
                      >
                        Xem thêm
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className='col-span-6'>
              <img
                src='/assets/illustration.png'
                alt='Các dịch vụ của chủ trường'
              />
            </div>
          </div>
        </div>
      </section>

      <section id='doi-tac'>
        <div className='container'>
          <h2 className='title col-span-12'>ĐỐI TÁC</h2>

          <div className='col-span-12 flex flex-col lg:flex-row justify-between items-center mt-8 gap-8 lg:gap-0 items-center justify-center'>
            {partners.map((partner, i) => (
              <Link
                to={partner.link}
                key={i}
                className='block h-full'
                target='_blank'
                rel='noopener noreferrer'
              >
                <img
                  src={partner.logo}
                  alt={partner.name + ' logo'}
                  title={partner.name}
                  className='object-cover h-16 md:h-24'
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className='container'>
          <h2 className='title col-span-12'>VÌ SAO NÊN CHỌN ICONI SPA</h2>

          <div className='col-span-12 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-6 mt-8'>
            <div className='col-span-4 flex items-center border border-zinc-200 shadow-lg rounded-lg p-4 gap-4'>
              <div>
                <Users size={40} color='var(--main-color)' />
              </div>

              <p className='font-semibold'>
                <span className='text-[--main-color]'>40 triệu</span> lượt phụ
                huynh truy cập
              </p>
            </div>

            <div className='col-span-4 flex items-center border border-zinc-200 shadow-lg rounded-lg p-4 gap-4'>
              <div>
                <UserCheck size={40} color='var(--main-color)' />
              </div>

              <p className='font-semibold'>
                <span className='text-[--main-color]'>182 nghìn</span> lượt phụ
                huynh tin tưởng và đăng ký học
              </p>
            </div>

            <div className='col-span-4 flex items-center border border-zinc-200 shadow-lg rounded-lg p-4 gap-4'>
              <div>
                <UserCog size={40} color='var(--main-color)' />
              </div>

              <p className='font-semibold'>
                <span className='text-[--main-color]'>38 nghìn</span> lượt đánh
                giá từ phụ huynh
              </p>
            </div>

            <div className='col-span-4 flex items-center border border-zinc-200 shadow-lg rounded-lg p-4 gap-4'>
              <div>
                <FileText size={40} color='var(--main-color)' />
              </div>

              <p className='font-semibold'>
                Thông tin chính xác, đầy đủ và cập nhật thường xuyên
              </p>
            </div>

            <div className='col-span-4 flex items-center border border-zinc-200 shadow-lg rounded-lg p-4 gap-4'>
              <div>
                <IdCard size={40} color='var(--main-color)' />
              </div>

              <p className='font-semibold'>
                Tốc độ phản hồi từ phía nhà trường, trung tâm trong 1 phút
              </p>
            </div>

            <div className='col-span-4 flex items-center border border-zinc-200 shadow-lg rounded-lg p-4 gap-4'>
              <div>
                <BookOpen size={40} color='var(--main-color)' />
              </div>

              <p className='font-semibold'>
                Gợi ý chính xác theo nhu cầu về chương trình học, học phí
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-white py-8'>
        <div className='container'>
          <h2 className='title col-span-12'>
            TRUYỀN THÔNG NÓI GÌ VỀ ICONIC SPA
          </h2>

          <div className='flex flex-col lg:grid grid-cols-12 gap-6 mt-8 col-span-12'>
            <section className='col-span-6 px-32'>
              <img src='/assets/illus-social.png' alt='illustration image' />
            </section>

            <section className='col-span-6 grid grid-cols-6 gap-12'>
              {newspapers.map((newspaper, i) => (
                <Link
                  to={newspaper.link}
                  key={i}
                  className='col-span-2'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <img
                    src={newspaper.image}
                    alt='newspaper logo'
                    className='object-contain h-full'
                  />
                </Link>
              ))}
            </section>
          </div>
        </div>
      </section>
    </>
  );
}

const partners = [
  {
    name: 'gakken',
    logo: 'https://gakkensteamprogram.vn/wp-content/uploads/2023/10/Gakken-logo.png',
    link: 'https://gakken.vn',
  },
  {
    name: 'gakken',
    logo: 'https://gakkensteamprogram.vn/wp-content/uploads/2023/10/Gakken-logo.png',
    link: 'https://gakken.vn',
  },
  {
    name: 'gakken',
    logo: 'https://gakkensteamprogram.vn/wp-content/uploads/2023/10/Gakken-logo.png',
    link: 'https://gakken.vn',
  },
  {
    name: 'kidsup',
    logo: 'https://www.kidsup.net/wp-content/uploads/2021/11/logo_kidsup.svg',
    link: 'https://kidsup.vn',
  },
];

const newspapers = [
  {
    link: 'https://giaoducthoinay.net/',
    image:
      'https://giaoducthoinay.net/wp-content/uploads/2024/11/19-11-logo-giao-duc-thoi-nay-cufyb2-c-fillw-440h-188.png',
  },
  {
    link: 'https://giaoducthoinay.net/',
    image:
      'https://giaoducthoinay.net/wp-content/uploads/2024/11/19-11-logo-giao-duc-thoi-nay-cufyb2-c-fillw-440h-188.png',
  },
  {
    link: 'https://giaoducthoinay.net/',
    image:
      'https://giaoducthoinay.net/wp-content/uploads/2024/11/19-11-logo-giao-duc-thoi-nay-cufyb2-c-fillw-440h-188.png',
  },
  {
    link: 'https://giaoducthoinay.net/',
    image:
      'https://giaoducthoinay.net/wp-content/uploads/2024/11/19-11-logo-giao-duc-thoi-nay-cufyb2-c-fillw-440h-188.png',
  },
  {
    link: 'https://giaoducthoinay.net/',
    image:
      'https://giaoducthoinay.net/wp-content/uploads/2024/11/19-11-logo-giao-duc-thoi-nay-cufyb2-c-fillw-440h-188.png',
  },
];

const services = [
  {
    title: 'CÁC DỊCH VỤ CỦA ICONIC PRO',
    link: '/',
  },
];
