import { useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';

import { isAuthenticated } from '~/services/auth.server';
import { getSpaOwnerById, updateSpaOwner } from '~/services/spaOwner.server';
import SpaOwnerEditForm from './components/SpaOwnerEditForm';
import { ISpaOwnerAttrs } from '~/interfaces/spaOwner.interface';
import DashContentHeader from '~/components/DashContentHeader';

type ActionData = {
  success: boolean;
  message: string;
  spaOwner?: any;
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
      return { success: false, message: 'SpaOwner ID is required' };
    }

    switch (request.method) {
      case 'PUT':
        const formData = await request.formData();

        // Xây dựng dữ liệu chủ spa
        const spaOwnerData: ISpaOwnerAttrs = {
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
          status: 'active',
          spas: [],
          level: 'owner',
          plan: 'free',
          planExpireAt: undefined,
        };

        // Kiểm tra dữ liệu bắt buộc
        if (!spaOwnerData.firstName) {
          return { success: false, message: 'Tên chủ spa là bắt buộc' };
        }

        // Gọi API tạo chủ spa cùng case service
        const response = await updateSpaOwner(id, spaOwnerData, auth);

        if (!response) {
          return {
            success: false,
            message: 'Lỗi khi cập nhật chủ spa',
          };
        }

        return {
          success: true,
          message: 'Cập nhật chủ spa thành công',
          spaOwner: response,
          redirectTo: '/admin/spa-owners',
        };

      default:
        return {
          success: false,
          message: 'Phương thức không hợp lệ',
        };
    }
  } catch (error: any) {
    console.error('Lỗi cập nhật chủ spa:', error);
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
    throw new Response('SpaOwner ID is required', { status: 400 });
  }

  const spaOwner = await getSpaOwnerById(id, auth);

  return { spaOwner };
};

export default function EmpNewSpaOwner() {
  const { spaOwner } = useLoaderData<typeof loader>();

  return (
    <>
      <DashContentHeader title='Thay đổi thông tin chủ spa' />

      <SpaOwnerEditForm spaOwner={spaOwner} />
    </>
  );
}
