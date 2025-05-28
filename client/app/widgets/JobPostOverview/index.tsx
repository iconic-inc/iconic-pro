import BreadScrum from '~/components/BreadScrum';

import style from './index.module.css';
import { Link } from '@remix-run/react';
import { IJobPostDetails } from '~/interfaces/jobPost.interface';
import { toAddressString } from '~/utils/address.util';

export default function JobPostOverview({
  images,
  jobpost,
  breadscrum,
}: {
  images: string[];
  jobpost: IJobPostDetails;
  breadscrum: { label: string; path: string }[];
}) {
  return (
    <>
      <section className={style.jobpost_overview}>
        <div className='container'>
          <div className='col-span-12 flex flex-col gap-3'>
            <BreadScrum links={breadscrum} />

            <div className={`mb-10 ${style.img}`}>
              <div className='relative'>
                <div className='grid grid-cols-12 grid-rows-3 h-40 md:h-80 gap-2'>
                  <div className='col-span-12 lg:col-span-7 row-span-3 overflow-hidden'>
                    <img src={images[0]} alt='' />
                  </div>

                  <div className='hidden lg:block col-span-5 row-span-2 overflow-hidden'>
                    <img src={images[1]} alt='' />
                  </div>

                  <div className='hidden col-span-5 row-span-1 lg:flex gap-2 overflow-hidden'>
                    <div>
                      <img src={images[2]} alt='' />
                    </div>

                    <div>
                      <img src={images[3]} alt='' />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className='text-[--sub2-text-color]'>
              <i>Cập nhật gần nhất: khoảng 2 ngày trước</i>
            </p>

            <h1 className='text-2xl font-bold'>{jobpost.jpo_title}</h1>

            <p className='text-[--sub2-text-color] text-sm'>
              {jobpost.jpo_requirements}
            </p>
          </div>
        </div>
      </section>

      <nav className='sticky top-[72px] shadow-lg border-t mt-4 bg-white z-30'>
        <div className='container overflow-hidden'>
          <div className='col-span-12 w-fit flex flex-nowrap'>
            {sections.map((sec, i) => (
              <Link
                className='w-max p-4 font-semibold text-[--sub2-text-color]'
                key={i}
                to={sec.hash}
              >
                {sec.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

const sections = [
  { label: 'Đề xuất quan tâm', hash: '#de-xuat-quan-tam' },
  { label: 'Tổng quan', hash: '#tong-quan' },
  { label: 'Giới thiệu chung', hash: '#gioi-thieu-chung' },
  { label: 'Liên hệ', hash: '#lien-he' },
];
