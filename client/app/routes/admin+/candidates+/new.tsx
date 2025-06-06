import { ActionFunctionArgs, data, LoaderFunctionArgs } from '@remix-run/node';
import { ICandidateAttrs } from '~/interfaces/candidate.interface';
import { isAuthenticated } from '~/services/auth.server';
import { createCandidate } from '~/services/candidate.server';
import CandidateCreateForm from './components/CandidateCreateForm';
import DashContentHeader from '~/components/admin/DashContentHeader';

type ActionData = {
  success: boolean;
  message: string;
  candidate?: any;
  redirectTo?: string;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  // Xác thực người dùng
  const { session, headers } = await isAuthenticated(request);

  try {
    if (!session) {
      return data({ success: false, message: 'Unauthorized' }, { headers });
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
    const candidate = await createCandidate(candidateData, session);

    if (!candidate) {
      return data(
        {
          success: false,
          message: 'Lỗi khi tạo Ứng viên',
        },
        { headers },
      );
    }

    return data(
      {
        success: true,
        message: 'Thêm mới Ứng viên thành công!',
        candidate,
        redirectTo: `/admin/candidates/${candidate.id}`,
      },
      { headers },
    );
  } catch (error: any) {
    console.error('Lỗi tạo Ứng viên:', error);
    return data(
      {
        success: false,
        message: error.message || 'Đã xảy ra lỗi không xác định',
      },
      { headers },
    );
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
