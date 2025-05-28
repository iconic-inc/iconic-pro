import { IJobPostDetails } from '~/interfaces/jobPost.interface';
import style from './index.module.css';
import { toCurrencyString } from '~/utils';
import { Facebook, Globe, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from '@remix-run/react';
import { JOB_POST } from '~/constants/jobPost.constant';

export default function JobPostContent({
  jobpost,
  openSupport,
}: {
  jobpost: IJobPostDetails;
  openSupport: (s: IJobPostDetails) => void;
}) {
  return (
    <div className={`${style.wrapper} col-span-12 flex flex-col gap-6`}>
      <section
        id={'de-xuat-quan-tam'}
        className='rounded-xl shadow-lg col-span-12 border border-zinc-200 p-4'
      >
        <div className='flex gap-6'>
          <div className='bee w-20 '>
            <img
              className='object-contain'
              src='/assets/bee-pencil.png'
              alt='bee with pencil'
            />
          </div>

          <div className='flex flex-col justify-between'>
            <p className='py-2'>
              Anh chị quan tâm nhất tới điều gì về công việc này ạ?
            </p>

            <div className='flex flex-wrap gap-x-4 gap-y-2'>
              <button className='py-2 px-4 w-max text-[--sub1-color] bg-[--sub1-color-opacity] rounded-full text-sm'>
                Mô tả công việc
              </button>

              <button className='py-2 px-4 w-max text-[--sub1-color] bg-[--sub1-color-opacity] rounded-full text-sm'>
                Yêu cầu ứng viên
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id='tong-quan'>
        <div className={style.overview}>
          <h2 className='my-4'>Tổng quan</h2>

          <p className={style.key}>Mức lương</p>
          <p className={`${style.value} text-[--sub1-color]`}>
            {jobpost.jpo_salaryFrom && jobpost.jpo_salaryTo
              ? `${toCurrencyString(jobpost.jpo_salaryFrom)} - ${toCurrencyString(jobpost.jpo_salaryTo)}`
              : jobpost.jpo_salaryFrom
                ? `Từ ${toCurrencyString(jobpost.jpo_salaryFrom)}`
                : jobpost.jpo_salaryTo
                  ? `Đến ${toCurrencyString(jobpost.jpo_salaryTo)}`
                  : 'Thỏa thuận'}
            {jobpost.jpo_currency ? `(${jobpost.jpo_currency})` : ''}
          </p>

          <p className={style.key}>Loại công việc</p>
          <p className={style.value}>
            {Object.values(JOB_POST.TYPE).find(
              (p) => p.slug === jobpost.jpo_type,
            )?.name || 'Không xác định'}
          </p>

          <p className={style.key}>Hạn ứng tuyển</p>
          <p className={style.value}>
            {jobpost.jpo_deadline
              ? new Date(jobpost.jpo_deadline).toLocaleDateString('vi-VN')
              : 'Không có thời hạn'}
          </p>

          <div className='flex w-full md:w-1/2 justify-between items-end'>
            <div>
              <p className={style.key}>Số điện thoại</p>
              <p className={style.value}>
                {jobpost.jpo_owner?.spo_user?.usr_msisdn ||
                  'Không có thông tin'}
              </p>
            </div>

            <button
              className='uppercase text-[--main-color] font-bold px-4 py-2 rounded-lg flex items-center gap-2 bg-[--main-color-opacity]'
              onClick={() => openSupport(jobpost)}
            >
              <Phone size={18} /> Liên hệ
            </button>
          </div>

          <p className={style.key}>Địa chỉ</p>
          <p className={style.value}>
            {jobpost.jpo_spa?.sp_address?.formattedAddress ||
              'Không có thông tin'}
          </p>

          <Link
            className='flex text-sm mt-4 items-center text-[--main-color]'
            to={`https://maps.google.com/?q=${jobpost.jpo_spa?.sp_address?.formattedAddress || ''}`}
            target='_blank'
            rel='noreferrer'
          >
            <MapPin size={16} className='mr-1' />
            Xem trên map
          </Link>
        </div>
      </section>

      <section id={'gioi-thieu-chung'}>
        <div className={style.content}>
          <h2>Mô tả công việc</h2>
          <p className='text-lg whitespace-pre-line'>
            {jobpost.jpo_description}
          </p>
        </div>
      </section>

      {jobpost.jpo_requirements && (
        <section id={'yeu-cau'}>
          <div className={style.content}>
            <h2>Yêu cầu ứng viên</h2>
            <p className='text-lg whitespace-pre-line'>
              {jobpost.jpo_requirements}
            </p>
          </div>
        </section>
      )}

      <section id={'lien-he'}>
        <div className={`${style.content}`}>
          <h2>Thông tin liên hệ</h2>

          <div
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-[--sub2-text-color]`}
          >
            <div>
              <Link
                to={`tel:${jobpost.jpo_owner?.spo_user?.usr_msisdn || ''}`}
                className='flex flex-col gap-2 items-center justify-center w-full'
              >
                <Phone className='text-[--main-color]' />
                <p>
                  {jobpost.jpo_owner?.spo_user?.usr_msisdn ||
                    'Không có thông tin'}
                </p>
              </Link>
            </div>

            <div>
              <Link
                to={`mailto:${jobpost.jpo_owner?.spo_user?.usr_email || ''}`}
                className='flex flex-col gap-2 items-center justify-center items-center'
              >
                <Mail className='text-[--main-color]' />
                <p className='w-full text-ellipsis w-full overflow-hidden'>
                  {jobpost.jpo_owner?.spo_user?.usr_email ||
                    'Không có thông tin'}
                </p>
              </Link>
            </div>

            <div>
              <Link
                to={'#'}
                target='_blank'
                rel='noreferrer'
                className='flex flex-col gap-2 items-center justify-center w-full'
              >
                <Facebook className='text-[--main-color]' />
                <p>Facebook</p>
              </Link>
            </div>

            <div>
              <Link
                to={jobpost.jpo_spa?.sp_website || '#'}
                target='_blank'
                rel='noreferrer'
                className='flex flex-col gap-2 items-center justify-center w-full'
              >
                <Globe className='text-[--main-color]' />
                <p>Website</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
