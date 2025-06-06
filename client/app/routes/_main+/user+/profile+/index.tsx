import { LoaderFunctionArgs } from '@remix-run/node';
import { data, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';

import Defer from '~/components/Defer';
import { ICandidateDetails } from '~/interfaces/candidate.interface';
import { getMyProfile, updateMyProfile } from '~/services/candidate.server';
import { parseAuthCookie } from '~/services/cookie.server';
import UpdateMyCandidateForm from './_components/UpdateMyCandidateForm';
import { isAuthenticated } from '~/services/auth.server';
import MyCandidateProfile from './_components/MyCandidateProfile';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const auth = await parseAuthCookie(request);

  const candidateProfile = getMyProfile(auth!).catch(async (err) => {
    console.error('Error fetching candidate profile:', err);
    // You have no candidate profile yet
    return { success: false, message: 'Lỗi khi lấy thông tin ứng viên.' };
  });

  return { candidateProfile };
};

export default function ProfileIndex() {
  const { candidateProfile } = useLoaderData<typeof loader>();
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
        if (!isUpdate) return;
        if (
          confirm(
            'Bạn có chắc muốn rời khỏi trang này? Thông tin đã thay đổi sẽ không được lưu.',
          )
        ) {
          return true;
        }
        e.preventDefault();
      };
      window.addEventListener('beforeunload', beforeUnloadHandler);

      return () => {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
      };
    }
  }, []);

  return (
    <div className='container py-10'>
      <Defer<ICandidateDetails> resolve={candidateProfile}>
        {(candidate) => {
          return isUpdate ? (
            <div className='col-span-12'>
              <UpdateMyCandidateForm
                candidate={candidate}
                cancelHandler={() => setIsUpdate(false)}
              />
            </div>
          ) : (
            <MyCandidateProfile
              candidate={candidate}
              handleSwitchToUpdate={() => setIsUpdate(true)}
            />
          );
        }}
      </Defer>
    </div>
  );
}

export const action = async ({ request }: LoaderFunctionArgs) => {
  const { session, headers } = await isAuthenticated(request);
  if (!session) {
    return data(
      {
        toast: {
          type: 'error',
          message: 'Bạn cần đăng nhập để thực hiện hành động này.',
        },
      },
      { headers, status: 401 },
    );
  }

  switch (request.method) {
    case 'POST': {
      // Handle form submission for updating candidate profile
      const formData = await request.formData();
      const updateData = Object.fromEntries(formData.entries()) as Record<
        string,
        string
      >;
      const updateResult = await updateMyProfile(
        {
          ...(updateData as any),
          skills: updateData.skills
            ? updateData.skills.split(',').map((skill: string) => skill.trim())
            : [],
        },
        session,
      );
      return data(
        {
          toast: {
            type: 'success',
            message: 'Cập nhật hồ sơ thành công.',
          },
        },
        { headers },
      );
    }
    default:
      return data(
        {
          toast: {
            type: 'error',
            message: 'Phương thức không hợp lệ. Vui lòng thử lại.',
          },
        },
        { headers, status: 405 },
      );
  }
};
