import { useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { useState } from 'react';

import { isAuthenticated } from '~/services/auth.server';
import HandsomeError from '~/components/HandsomeError';
import UserProfileForm from '../_components/UserProfileForm';
import { getCurrentUser, updateUser } from '~/services/user.server';
import CustomButton from '~/widgets/CustomButton';
import DashContentHeader from '~/components/DashContentHeader';
import { updateMySpaOwner, updateSpaOwner } from '~/services/spaOwner.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const auth = await isAuthenticated(request);

  const user = await getCurrentUser(auth!);
  return {
    user,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const auth = await isAuthenticated(request);
    if (!auth) {
      throw new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    // Prepare update data
    const updateData = {
      firstName: data.firstName as string,
      lastName: data.lastName as string,
      email: data.email as string,
      msisdn: data.msisdn as string,
      address: data.address as string,
      sex: data.sex as string,
      birthdate: data.birthdate as string,
      username: data.username as string,
      password: data.password as string,
      avatar: data.avatar as string,
    };

    const updatedEmployee = await updateMySpaOwner(updateData, auth!);
    return {
      employee: updatedEmployee,
      toast: { message: 'Cập nhật thông tin thành công!', type: 'success' },
    };
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return {
      toast: {
        message: error.message || error.statusText || 'Cập nhật thất bại!',
        type: 'error',
      },
    };
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
