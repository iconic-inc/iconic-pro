import { data, useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';

import { isAuthenticated } from '~/services/auth.server';
import { getJobPostById, updateJobPost } from '~/services/jobPost.server';
import JobPostEditForm from './components/JobPostEditForm';
import { IJobPostAttrs } from '~/interfaces/jobPost.interface';
import DashContentHeader from '~/components/DashContentHeader';
import { listJobPosts } from '~/services/jobPost.server';
import { parseAuthCookie } from '~/services/cookie.server';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // Xác thực người dùng
  const { session, headers } = await isAuthenticated(request);

  try {
    if (!session) {
      return data({ success: false, message: 'Unauthorized' }, { headers });
    }

    const { id } = params;
    if (!id) {
      return data(
        { success: false, message: 'JobPost ID is required' },
        { headers },
      );
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
          return data(
            {
              success: false,
              message: 'Tiêu đề tin tuyển dụng là bắt buộc',
            },
            { headers },
          );
        }

        // Gọi API tạo jobPost cùng case service
        const response = await updateJobPost(id, jobPostData, session);

        if (!response) {
          return data(
            {
              success: false,
              message: 'Lỗi khi cập nhật tin tuyển dụng',
            },
            { headers },
          );
        }

        return data(
          {
            success: true,
            message: 'Cập nhật tin tuyển dụng thành công',
            jobPost: response,
            redirectTo: '/admin/job-posts',
          },
          { headers },
        );

      default:
        return data(
          {
            success: false,
            message: 'Phương thức không hợp lệ',
          },
          { headers },
        );
    }
  } catch (error: any) {
    console.error('Lỗi cập nhật tin tuyển dụng:', error);
    return data(
      {
        success: false,
        message: error.message || 'Đã xảy ra lỗi không xác định',
      },
      { headers },
    );
  }
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const auth = await parseAuthCookie(request);
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
