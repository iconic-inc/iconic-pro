import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { IJobPostAttrs } from '~/interfaces/jobPost.interface';
import { isAuthenticated } from '~/services/auth.server';
import { createJobPost } from '~/services/jobPost.server';
import DashContentHeader from '~/components/DashContentHeader';
import JobPostCreateForm from './components/JobPostCreateForm';
import { listJobPosts } from '~/services/jobPost.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // Xác thực người dùng
    const auth = await isAuthenticated(request);
    if (!auth) {
      throw new Error('Unauthorized');
    }

    const ownersPromise = listJobPosts(
      { status: 'active' },
      { page: 1, limit: 1000 },
      auth,
    ).catch((fallbackError) => {
      console.error('Fallback error:', fallbackError);
      return {
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };
    });

    return { ownersPromise };
  } catch (error: any) {
    console.error('Lỗi xác thực:', error);
    throw new Response(error.message, { status: 401 });
  }
};

export default function NewJobPost() {
  const { ownersPromise } = useLoaderData<typeof loader>();

  return (
    <>
      <DashContentHeader title='Thêm mới jobPost' />

      <JobPostCreateForm ownersPromise={ownersPromise} />
    </>
  );
}

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<ActionData> => {
  try {
    // Xác thực người dùng
    const auth = await isAuthenticated(request);
    if (!auth) {
      return { success: false, message: 'Unauthorized' };
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
    const jobPost = await createJobPost(jobPostData, auth);

    if (!jobPost) {
      return {
        success: false,
        message: 'Lỗi khi tạo jobPost',
      };
    }

    return {
      success: true,
      message: 'Thêm mới jobPost thành công!',
      jobPost,
      redirectTo: `/admin/job-posts/${jobPost.id}`,
    };
  } catch (error: any) {
    console.error('Lỗi tạo jobPost:', error);
    return {
      success: false,
      message: error.message || 'Đã xảy ra lỗi không xác định',
    };
  }
};

type ActionData = {
  success: boolean;
  message: string;
  jobPost?: any;
  redirectTo?: string;
};
