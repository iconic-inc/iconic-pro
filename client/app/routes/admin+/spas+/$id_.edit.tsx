import { useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';

import { isAuthenticated } from '~/services/auth.server';
import { getSpaById4Admin, updateSpa4Admin } from '~/services/spa.server';
import SpaEditForm from './components/SpaEditForm';
import { ISpaAttrs } from '~/interfaces/spa.interface';
import DashContentHeader from '~/components/DashContentHeader';
import { listSpaOwners4Admin } from '~/services/spaOwner.server';

type ActionData = {
  success: boolean;
  message: string;
  spa?: any;
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
      return { success: false, message: 'Spa ID is required' };
    }

    switch (request.method) {
      case 'PUT':
        const formData = await request.formData();

        // Xây dựng dữ liệu spa
        const spaData: ISpaAttrs = {
          name: formData.get('name') as string,
          address: {
            type: 'Point',
            coordinates: [
              parseFloat(formData.get('longitude') as string),
              parseFloat(formData.get('latitude') as string),
            ],
            formattedAddress: formData.get('address') as string,
          },
          owner: formData.get('owner') as string,
          avatar: formData.get('avatar') as string,
          coverImage: formData.get('coverImage') as string,
          gallery: JSON.parse(formData.get('gallery') as string),
          phone: formData.get('phone') as string,
          email: formData.get('email') as string,
          website: formData.get('website') as string,
          socialLinks: {
            facebook: formData.get('facebook') as string,
            instagram: formData.get('instagram') as string,
            tiktok: formData.get('tiktok') as string,
            youtube: formData.get('youtube') as string,
          },

          description: formData.get('description') as string,
          openingHours: JSON.parse(
            formData.get('openingHours') as string,
          ) as any,
          status: (formData.get('status') as any) || 'approved',
        };

        // Kiểm tra dữ liệu bắt buộc
        if (!spaData.name) {
          return { success: false, message: 'Tên spa là bắt buộc' };
        }

        // Gọi API tạo spa cùng case service
        const response = await updateSpa4Admin(id, spaData, auth);

        if (!response) {
          return {
            success: false,
            message: 'Lỗi khi cập nhật spa',
          };
        }

        return {
          success: true,
          message: 'Cập nhật spa thành công',
          spa: response,
          redirectTo: '/admin/spas',
        };

      default:
        return {
          success: false,
          message: 'Phương thức không hợp lệ',
        };
    }
  } catch (error: any) {
    console.error('Lỗi cập nhật spa:', error);
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
    throw new Response('Spa ID is required', { status: 400 });
  }

  const spa = await getSpaById4Admin(id, auth);
  const ownersPromise = listSpaOwners4Admin(
    { status: 'active' },
    { page: 1, limit: 1000 },
    auth,
  ).catch((error) => {
    console.error('Error loading spa owners:', error);
    return {
      data: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  });

  return { spa, ownersPromise };
};

export default function EmpNewSpa() {
  const { spa, ownersPromise } = useLoaderData<typeof loader>();

  return (
    <>
      <DashContentHeader title='Thay đổi thông tin spa' />

      <SpaEditForm spa={spa} ownersPromise={ownersPromise} />
    </>
  );
}
