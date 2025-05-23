import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { ISpaAttrs } from '~/interfaces/spa.interface';
import { isAuthenticated } from '~/services/auth.server';
import { createSpa4Admin } from '~/services/spa.server';
import DashContentHeader from '~/components/DashContentHeader';
import SpaCreateForm from './components/SpaCreateForm';
import { listSpaOwners4Admin } from '~/services/spaOwner.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // Xác thực người dùng
    const auth = await isAuthenticated(request);
    if (!auth) {
      throw new Error('Unauthorized');
    }

    const ownersPromise = listSpaOwners4Admin(
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

export default function NewSpa() {
  const { ownersPromise } = useLoaderData<typeof loader>();

  return (
    <>
      <DashContentHeader title='Thêm mới spa' />

      <SpaCreateForm ownersPromise={ownersPromise} />
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
      openingHours: JSON.parse(formData.get('openingHours') as string) as any,
      status: (formData.get('status') as any) || 'approved',
    };

    // Gọi API tạo spa cùng case service
    const spa = await createSpa4Admin(spaData, auth);

    if (!spa) {
      return {
        success: false,
        message: 'Lỗi khi tạo spa',
      };
    }

    return {
      success: true,
      message: 'Thêm mới spa thành công!',
      spa,
      redirectTo: `/admin/spas/${spa.id}`,
    };
  } catch (error: any) {
    console.error('Lỗi tạo spa:', error);
    return {
      success: false,
      message: error.message || 'Đã xảy ra lỗi không xác định',
    };
  }
};

type ActionData = {
  success: boolean;
  message: string;
  spa?: any;
  redirectTo?: string;
};
