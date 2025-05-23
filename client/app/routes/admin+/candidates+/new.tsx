import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { ICandidateAttrs } from '~/interfaces/candidate.interface';
import { isAuthenticated } from '~/services/auth.server';
import { createCandidate } from '~/services/candidate.server';
import CandidateCreateForm from './components/CandidateCreateForm';
import DashContentHeader from '~/components/DashContentHeader';

type ActionData = {
  success: boolean;
  message: string;
  candidate?: any;
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

    // Xây dựng dữ liệu Ứng viên
    const candidateData: ICandidateAttrs = {
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

    // Gọi API tạo Ứng viên cùng case service
    const candidate = await createCandidate(candidateData, auth);

    if (!candidate) {
      return {
        success: false,
        message: 'Lỗi khi tạo Ứng viên',
      };
    }

    return {
      success: true,
      message: 'Thêm mới Ứng viên thành công!',
      candidate,
      redirectTo: `/admin/candidates/${candidate.id}`,
    };
  } catch (error: any) {
    console.error('Lỗi tạo Ứng viên:', error);
    return {
      success: false,
      message: error.message || 'Đã xảy ra lỗi không xác định',
    };
  }
};

export default function NewCandidate() {
  return (
    <>
      <DashContentHeader title='Thêm mới Ứng viên' />

      <CandidateCreateForm />
    </>
  );
}
