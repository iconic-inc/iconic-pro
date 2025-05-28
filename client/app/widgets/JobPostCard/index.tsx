import { Link } from '@remix-run/react';
import { JOB_POST } from '~/constants/jobPost.constant';
import { IJobPost, IJobPostDetails } from '~/interfaces/jobPost.interface';
import { formatCurrency, formatDate, toAgeString } from '~/utils';
import { toAddressString } from '~/utils/address.util';

export default function JobPostCard({
  jobpost,
  index,
  openPopup,
}: {
  jobpost: IJobPostDetails;
  index: number;
  openPopup?: (jpo: IJobPostDetails) => void;
}) {
  return (
    <article className='relative lg:static grid grid-cols-9 gap-x-4 rounded-lg bg-white border border-zinc-200 shadow overflow-hidden p-4'>
      <div className='detail col-span-12 lg:col-span-7 flex flex-col gap-2'>
        <Link className='block' to={`/viec-lam/d/${jobpost.id}`}>
          <div className='flex'>
            <div className='font-semibold text-lg lg:text-xl flex'>
              <p className='text-[--main-color]'>
                <span className='text-[--sub1-color] w-max'>
                  #{index}{' '}
                  {
                    Object.values(JOB_POST.TYPE).find(
                      (type) => type.slug === jobpost.jpo_type,
                    )?.name
                  }
                </span>
                <span className='text-[--sub1-color] mx-2'>|</span>
                {jobpost.jpo_title}
              </p>
            </div>
          </div>
        </Link>

        <div className='text-sm'>
          <p className='text-[--sub2-text-color]'>
            {formatDate(jobpost.createdAt)}
          </p>
        </div>
      </div>

      <div className='col-span-12 lg:col-span-9 flex flex-col lg:flex-row gap-4 justify-between'>
        <div className='flex gap-6'>
          <div>
            <p className='text-xs'>Nhận học sinh/học viên:</p>
            <p className='font-bold'>{jobpost.jpo_requirements}</p>
          </div>

          <div>
            <p className='text-xs'>Học phí:</p>
            <p className='font-bold'>
              {formatCurrency(jobpost.jpo_salaryFrom || 0)} -{' '}
              {formatCurrency(jobpost.jpo_salaryTo || 0)}
            </p>
          </div>
        </div>

        <button
          className='w-fit uppercase bg-[--main-color] text-white text-base rounded-lg px-6 py-4 h-full col-span-1 text-xs'
          onClick={() => openPopup && openPopup(jobpost)}
        >
          Nhận tư vấn qua Zalo
        </button>
      </div>
    </article>
  );
}
