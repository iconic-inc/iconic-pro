import BreadScrum from '~/components/BreadScrum';

import style from './index.module.css';
import { Link } from '@remix-run/react';
import { IJobPostDetails } from '~/interfaces/jobPost.interface';
import { calHourDiff, calTimeDiff, shortenPeriod } from '~/utils';
import { Button } from '~/components/ui/button';
import { IJobApplication } from '~/interfaces/jobApplication.interface';

export default function JobPostOverview({
  jobpost,
  breadscrum,
  appliedApplication,
}: {
  jobpost: IJobPostDetails;
  breadscrum: { label: string; path: string }[];
  appliedApplication?: IJobApplication | null;
}) {
  return (
    <>
      <section className={style.jobpost_overview}>
        <div className='container'>
          <div className='col-span-12 flex flex-col gap-3 mt-2'>
            <BreadScrum links={breadscrum} />

            {/* <div className={`mb-6 ${style.img}`}>
              <div className='relative'>
                <div className='grid grid-cols-12 grid-rows-3 h-40 md:h-80 gap-2'>
                  <div className='col-span-12 lg:col-span-7 row-span-3 overflow-hidden'>
                    <img
                      src={images[0] || '/assets/image-placeholder.webp'}
                      alt='Spa image 1'
                    />
                  </div>

                  <div className='hidden lg:block col-span-5 row-span-2 overflow-hidden'>
                    <img
                      src={images[1] || '/assets/image-placeholder.webp'}
                      alt='Spa image 2'
                    />
                  </div>

                  <div className='hidden col-span-5 row-span-1 lg:flex gap-2 overflow-hidden'>
                    <div>
                      <img
                        src={images[2] || '/assets/image-placeholder.webp'}
                        alt='Spa image 3'
                      />
                    </div>

                    <div>
                      <img
                        src={images[3] || '/assets/image-placeholder.webp'}
                        alt='Spa image 4'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            <h1 className='text-2xl font-bold'>{jobpost.jpo_title}</h1>

            <p className='text-[--sub6-text] text-sm'>
              <i>
                Cập nhật gần nhất:{' '}
                {shortenPeriod(
                  calTimeDiff(jobpost.updatedAt, new Date().toISOString()),
                )}{' '}
                trước
              </i>
            </p>
          </div>
        </div>
      </section>

      <nav className='sticky top-[72px] shadow-lg border-t mt-4 bg-white z-30'>
        <div className='container overflow-hidden'>
          <div className='col-span-10 w-fit flex flex-nowrap'>
            {sections.map((sec, i) => (
              <Link
                className='w-max p-4 font-semibold text-[--sub2-text]'
                key={i}
                to={sec.hash}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector(sec.hash);
                  if (element) {
                    // const offset = 72; // Adjust for sticky header height
                    // const top =
                    //   element.getBoundingClientRect().top +
                    //   window.scrollY -
                    //   offset;
                    // window.scrollTo({ top, behavior: 'smooth' });
                    element.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    });
                  }
                }}
              >
                {sec.label}
              </Link>
            ))}
          </div>

          <div className='col-span-2 flex justify-end items-center'>
            <Button asChild disabled={!!appliedApplication}>
              {appliedApplication ? (
                <Link to={`/user/don-ung-tuyen/${appliedApplication.id}`}>
                  Xem đơn ứng tuyển
                </Link>
              ) : (
                <Link to={`/viec-lam/d/${jobpost.id}/apply`}>
                  Ứng tuyển ngay
                </Link>
              )}
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}

const sections = [
  { label: 'Tổng quan', hash: '#tong-quan' },
  { label: 'Mô tả công việc', hash: '#description' },
  { label: 'Yêu cầu ứng viên', hash: '#requirements' },
];
