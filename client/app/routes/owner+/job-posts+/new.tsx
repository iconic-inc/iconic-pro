import { ActionFunctionArgs, data, LoaderFunctionArgs } from '@remix-run/node';
import { IJobPostAttrs } from '~/interfaces/jobPost.interface';
import { isAuthenticated } from '~/services/auth.server';
import { createMyJobPost } from '~/services/jobPost.server';
import DashContentHeader from '~/components/admin/DashContentHeader';
import JobPostCreateForm from './components/JobPostCreateForm';

export default function NewJobPost() {
  return (
    <>
      <DashContentHeader title='Thêm Tin tuyển dụng' />

      <JobPostCreateForm />
    </>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, headers } = await isAuthenticated(request);
  try {
    // Xác thực người dùng
    if (!session) {
      return data({ success: false, message: 'Unauthorized' }, { headers });
    }

    const formData = await request.formData();

    // Xây dựng dữ liệu jobPost
    const jobPostData: IJobPostAttrs = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      owner: formData.get('ownerId') as string,
      status: formData.get('status') === 'active' ? 'active' : 'closed',
      salaryFrom: parseFloat(formData.get('salaryFrom') as string),
      salaryTo: parseFloat(formData.get('salaryTo') as string),
      type:
        formData.get('type') === 'full-time'
          ? 'full-time'
          : formData.get('type') === 'part-time'
            ? 'part-time'
            : 'intern',
      requirements: formData.get('requirements') as string,
    };

    // Gọi API tạo jobPost cùng case service
    const jobPost = await createMyJobPost(jobPostData, session);

    if (!jobPost) {
      return data(
        {
          success: false,
          message: 'Lỗi khi tạo Tin tuyển dụng',
        },
        { headers },
      );
    }

    return data(
      {
        success: true,
        message: 'Thêm mới Tin tuyển dụng thành công!',
        jobPost,
        redirectTo: `/owner/job-posts/${jobPost.id}`,
      },
      { headers },
    );
  } catch (error: any) {
    console.error('Lỗi tạo Tin tuyển dụng:', error);
    return data(
      {
        success: false,
        message: error.message || 'Đã xảy ra lỗi không xác định',
      },
      { headers },
    );
  }
};
