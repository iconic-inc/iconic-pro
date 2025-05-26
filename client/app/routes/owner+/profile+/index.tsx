import { data, useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { useState } from 'react';

import { isAuthenticated } from '~/services/auth.server';
import HandsomeError from '~/components/HandsomeError';
import UserProfileForm from '../_components/UserProfileForm';
import { getCurrentUser } from '~/services/user.server';
import DashContentHeader from '~/components/DashContentHeader';
import { updateMySpaOwner } from '~/services/spaOwner.server';
import { parseAuthCookie } from '~/services/cookie.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const auth = await parseAuthCookie(request);

  const user = await getCurrentUser(auth!);
  return {
    user,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, headers } = await isAuthenticated(request);
  try {
    if (!session) {
      throw new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();

    // Prepare update data
    const updateData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      msisdn: formData.get('msisdn') as string,
      address: formData.get('address') as string,
      sex: formData.get('sex') as string,
      birthdate: formData.get('birthdate') as string,
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      avatar: formData.get('avatar') as string,
    };

    const updatedEmployee = await updateMySpaOwner(updateData, session!);
    return data(
      {
        employee: updatedEmployee,
        toast: { message: 'Cập nhật thông tin thành công!', type: 'success' },
      },
      { headers },
    );
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return data(
      {
        toast: {
          message: error.message || error.statusText || 'Cập nhật thất bại!',
          type: 'error',
        },
      },
      { headers },
    );
  }
};

export default function OwnerProfile() {
  const { user } = useLoaderData<typeof loader>();
  const formId = 'owner-profile-form';

  const [isChanged, setIsChanged] = useState(false);

  return (
    <>
      {/* Content Header */}
      <DashContentHeader
        title='Thông tin cá nhân'
        actionContent={
          <div className='flex items-center'>
            <span className='material-symbols-outlined text-sm mr-1'>save</span>
            Lưu
          </div>
        }
        actionHandler={() => {
          const form = document.getElementById(formId) as HTMLFormElement;
          if (form) {
            form.requestSubmit();
          }
        }}
        actionDisabled={!isChanged}
      />

      {/* Form Container */}
      <UserProfileForm
        user={user}
        formId={formId}
        setIsChanged={setIsChanged}
      />
    </>
  );
}

export const ErrorBoundary = () => <HandsomeError basePath='/owner' />;
