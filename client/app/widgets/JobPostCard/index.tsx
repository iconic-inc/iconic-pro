import { Link } from '@remix-run/react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { JOB_POST } from '~/constants/jobPost.constant';
import { IJobPost, IJobPostDetails } from '~/interfaces/jobPost.interface';
import { formatCurrency, formatDate, toAgeString } from '~/utils';
import { toAddressString } from '~/utils/address.util';

export default function JobPostCard({
  jobpost,
  index,
}: {
  jobpost: IJobPostDetails;
  index: number;
}) {
  return (
    <article className='relative lg:static grid grid-cols-9 gap-y-4 rounded-lg bg-white border border-zinc-200 shadow overflow-hidden p-4'>
      <div className='detail col-span-12 flex flex-col gap-2'>
        <Link className='block' to={`/viec-lam/d/${jobpost.id}`}>
          <div className='flex'>
            <div className='font-semibold text-lg lg:text-xl flex'>
              <p className='text-[--main-color]'>
                <span className='text-[--sub1-color] w-max'>#{index}</span>
                <span className='text-[--sub1-color] mx-2'>|</span>
                {jobpost.jpo_title}
              </p>
            </div>
          </div>
        </Link>

        <div className='text-sm'>
          <p className='text-[--sub2-text]'>
            {formatDate(jobpost.createdAt)} -{' '}
            {jobpost.jpo_type && JOB_POST_TYPE_BADGE[jobpost.jpo_type]}
          </p>
        </div>
      </div>

      <div className='col-span-12 lg:col-span-9 flex flex-col lg:flex-row gap-4 justify-between'>
        <div className='flex gap-6'>
          <div className='flex gap-2 items-center'>
            <p className='text-xs'>Lương:</p>
            <p className='font-bold'>
              {formatCurrency(jobpost.jpo_salaryFrom || 0)} -{' '}
              {formatCurrency(jobpost.jpo_salaryTo || 0)}
            </p>
          </div>
        </div>

        {/* <Link to={`/viec-lam/d/${jobpost.id}`} className=''>
          <Button className='bg-[--sub4-color] text-white hover:bg-[--sub4-color] hover:opacity-80'>
            Xem chi tiết
          </Button>
        </Link> */}
      </div>
    </article>
  );
}

const JOB_POST_TYPE_BADGE = {
  [JOB_POST.TYPE.FULL_TIME.slug]: (
    <Badge className='bg-green-500 text-white'>
      {JOB_POST.TYPE.FULL_TIME.name}
    </Badge>
  ),
  [JOB_POST.TYPE.PART_TIME.slug]: (
    <Badge className='bg-blue-500 text-white'>
      {JOB_POST.TYPE.PART_TIME.name}
    </Badge>
  ),
  [JOB_POST.TYPE.INTERN.slug]: (
    <Badge className='bg-yellow-500 text-white'>
      {JOB_POST.TYPE.INTERN.name}
    </Badge>
  ),
};
