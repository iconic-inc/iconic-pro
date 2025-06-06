import { IJobPostDetails } from '~/interfaces/jobPost.interface';
import style from './index.module.css';
import { formatCurrency, toCurrencyString } from '~/utils';
import { JOB_POST } from '~/constants/jobPost.constant';

export default function JobPostContent({
  jobpost,
}: {
  jobpost: IJobPostDetails;
}) {
  return (
    <div className={`${style.wrapper} flex-1 flex flex-col gap-6`}>
      <section id='tong-quan'>
        <div className={style.overview}>
          <h2 className='my-4'>Tổng quan</h2>

          <div>
            <p className={style.key}>Mức lương</p>
            <p className={`${style.value} text-[--main-color]`}>
              {jobpost.jpo_salaryFrom && jobpost.jpo_salaryTo
                ? `${formatCurrency(jobpost.jpo_salaryFrom)} - ${formatCurrency(jobpost.jpo_salaryTo)}`
                : jobpost.jpo_salaryFrom
                  ? `Từ ${formatCurrency(jobpost.jpo_salaryFrom)}`
                  : jobpost.jpo_salaryTo
                    ? `Đến ${formatCurrency(jobpost.jpo_salaryTo)}`
                    : 'Thỏa thuận'}
              {jobpost.jpo_currency ? ` (${jobpost.jpo_currency})` : ''}
            </p>
          </div>

          <div>
            <p className={style.key}>Loại công việc</p>
            <p className={style.value}>
              {Object.values(JOB_POST.TYPE).find(
                (p) => p.slug === jobpost.jpo_type,
              )?.name || 'Không xác định'}
            </p>
          </div>

          <div>
            <p className={style.key}>Hạn ứng tuyển</p>
            <p className={style.value}>
              {jobpost.jpo_deadline
                ? new Date(jobpost.jpo_deadline).toLocaleDateString('vi-VN')
                : 'Không có thời hạn'}
            </p>
          </div>
        </div>
      </section>

      <section id='description'>
        <div className={style.content}>
          <h2>Mô tả công việc</h2>
          <p className='text-lg whitespace-pre-line'>
            {jobpost.jpo_description || 'Không có mô tả.'}
          </p>
        </div>
      </section>

      <section id='requirements'>
        <div className={style.content}>
          <h2>Yêu cầu ứng viên</h2>
          <p className='text-lg whitespace-pre-line'>
            {jobpost.jpo_requirements || 'Không có yêu cầu.'}
          </p>
        </div>
      </section>
    </div>
  );
}
