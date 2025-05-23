import { useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';

import { isAuthenticated } from '~/services/auth.server';
import { getJobPostById, updateJobPost } from '~/services/jobPost.server';
import JobPostEditForm from './components/JobPostEditForm';
import { IJobPostAttrs } from '~/interfaces/jobPost.interface';
import DashContentHeader from '~/components/DashContentHeader';
import { listJobPosts } from '~/services/jobPost.server';

type ActionData = {
  success: boolean;
  message: string;
  jobPost?: any;
  redirectTo?: string;
};

export const action = async ({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionData> => {
  try {
    // Xác thực người dùng
    const auth = await isAuthenticated(request);
    if (!auth) {
      return { success: false, message: 'Unauthorized' };
    }

    const { id } = params;
    if (!id) {
      return { success: false, message: 'JobPost ID is required' };
    }

    switch (request.method) {
      case 'PUT':
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

        // Kiểm tra dữ liệu bắt buộc
        if (!jobPostData.title) {
          return {
            success: false,
            message: 'Tiêu đề tin tuyển dụng là bắt buộc',
          };
        }

        // Gọi API tạo jobPost cùng case service
        const response = await updateJobPost(id, jobPostData, auth);

        if (!response) {
          return {
            success: false,
            message: 'Lỗi khi cập nhật tin tuyển dụng',
          };
        }

        return {
          success: true,
          message: 'Cập nhật tin tuyển dụng thành công',
          jobPost: response,
          redirectTo: '/admin/job-posts',
        };

      default:
        return {
          success: false,
          message: 'Phương thức không hợp lệ',
        };
    }
  } catch (error: any) {
    console.error('Lỗi cập nhật tin tuyển dụng:', error);
    return {
      success: false,
      message: error.message || 'Đã xảy ra lỗi không xác định',
    };
  }
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const auth = await isAuthenticated(request);
  if (!auth) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const { id } = params;
  if (!id) {
    throw new Response('JobPost ID is required', { status: 400 });
  }

  const jobPost = await getJobPostById(id, auth);

  return { jobPost };
};

export default function EmpNewJobPost() {
  const { jobPost } = useLoaderData<typeof loader>();

  return (
    <>
      <DashContentHeader title='Thay đổi thông tin Tin tuyển dụng' />

      <JobPostEditForm jobPost={jobPost} />
    </>
  );
}
