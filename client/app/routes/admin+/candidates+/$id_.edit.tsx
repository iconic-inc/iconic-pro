import { data, useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';

import { isAuthenticated } from '~/services/auth.server';
import { getCandidateById, updateCandidate } from '~/services/candidate.server';
import CandidateEditForm from './components/CandidateEditForm';
import { ICandidateAttrs } from '~/interfaces/candidate.interface';
import DashContentHeader from '~/components/DashContentHeader';
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
        { success: false, message: 'Candidate ID is required' },
        { headers },
      );
    }

    switch (request.method) {
      case 'PUT':
        const formData = await request.formData();

        // Xây dựng dữ liệu ứng viên
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

        // Kiểm tra dữ liệu bắt buộc
        if (!candidateData.firstName) {
          return { success: false, message: 'Tên ứng viên là bắt buộc' };
        }

        // Gọi API tạo ứng viên cùng case service
        const response = await updateCandidate(id, candidateData, session);

        if (!response) {
          return data(
            {
              success: false,
              message: 'Lỗi khi cập nhật ứng viên',
            },
            { headers },
          );
        }

        return data(
          {
            success: true,
            message: 'Cập nhật ứng viên thành công',
            candidate: response,
            redirectTo: '/admin/candidates',
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
    console.error('Lỗi cập nhật ứng viên:', error);
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
    throw new Response('Candidate ID is required', { status: 400 });
  }

  const candidate = await getCandidateById(id, auth);

  return { candidate };
};

export default function EmpNewCandidate() {
  const { candidate } = useLoaderData<typeof loader>();

  return (
    <>
      <DashContentHeader title='Thay đổi thông tin ứng viên' />

      <CandidateEditForm candidate={candidate} />
    </>
  );
}
