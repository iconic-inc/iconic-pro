import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { ISpaOwnerAttrs } from '~/interfaces/spaOwner.interface';
import { isAuthenticated } from '~/services/auth.server';
import { createSpaOwner4Admin } from '~/services/spaOwner.server';
import SpaOwnerCreateForm from './components/SpaOwnerCreateForm';
import DashContentHeader from '~/components/DashContentHeader';

type ActionData = {
  success: boolean;
  message: string;
  spaOwner?: any;
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
      status: 'active',
      spas: [],
      level: 'owner',
      plan: 'free',
      planExpireAt: undefined,
      password: formData.get('password') as string,
      role: formData.get('role') as string,
      username: formData.get('username') as string,
      avatar: formData.get('avatar') as string,
    };

    // Gọi API tạo chủ spa cùng case service
    const spaOwner = await createSpaOwner4Admin(spaOwnerData, auth);

    if (!spaOwner) {
      return {
        success: false,
        message: 'Lỗi khi tạo chủ spa',
      };
    }

    return {
      success: true,
      message: 'Thêm mới chủ spa thành công!',
      spaOwner,
      redirectTo: `/admin/spa-owners/${spaOwner.id}`,
    };
  } catch (error: any) {
    console.error('Lỗi tạo chủ spa:', error);
    return {
      success: false,
      message: error.message || 'Đã xảy ra lỗi không xác định',
    };
  }
};

export default function NewSpaOwner() {
  return (
    <>
      <DashContentHeader title='Thêm mới chủ spa' />

      <SpaOwnerCreateForm />
    </>
  );
}
