import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { IJobApplicationAttrs } from '~/interfaces/jobApplication.interface';
import { isAuthenticated } from '~/services/auth.server';
import { createJobApplication } from '~/services/jobApplication.server';
import JobApplicationCreateForm from './components/JobApplicationCreateForm';
import DashContentHeader from '~/components/DashContentHeader';

type ActionData = {
  success: boolean;
  message: string;
  jobApp?: any;
  redirectTo?: string;
};

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

    // Xây dựng dữ liệu Đơn ứng tuyển
    const jobAppData: IJobApplicationAttrs = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      birthdate: formData.get('birthdate')
        ? new Date(formData.get('birthdate') as string).toISOString()
        : undefined,
      sex: (formData.get('sex') as string) || 'other',
      msisdn: formData.get('msisdn') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      password: formData.get('password') as string,
      role: formData.get('role') as string,
      username: formData.get('username') as string,
      avatar: formData.get('avatar') as string,
      cvFile: formData.get('cvFile') as string,
      summary: formData.get('summary') as string,
      experience: formData.get('experience') as string,
      skills: (formData.get('skills') as string)
        .split(',')
        .map((skill) => skill.trim()),
    };

    // Gọi API tạo Đơn ứng tuyển cùng case service
    const jobApp = await createJobApplication(jobAppData, auth);

    if (!jobApp) {
      return {
        success: false,
        message: 'Lỗi khi tạo Đơn ứng tuyển',
      };
    }

    return {
      success: true,
      message: 'Thêm mới Đơn ứng tuyển thành công!',
      jobApp,
      redirectTo: `/admin/job-applications/${jobApp.id}`,
    };
  } catch (error: any) {
    console.error('Lỗi tạo Đơn ứng tuyển:', error);
    return {
      success: false,
      message: error.message || 'Đã xảy ra lỗi không xác định',
    };
  }
};

export default function NewJobApplication() {
  return (
    <>
      <DashContentHeader title='Thêm mới Đơn ứng tuyển' />

      <JobApplicationCreateForm />
    </>
  );
}
