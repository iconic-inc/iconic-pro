import { data } from '@remix-run/react';
import { IBookingAttrs } from '~/interfaces/booking.interface';
import { isAuthenticated } from '~/services/auth.server';
import { createBooking } from '~/services/booking.server';
import { getMainBranch } from '~/services/branch.server';

export const action = async ({ request }: { request: Request }) => {
  const { headers } = await isAuthenticated(request);

  const mainBranch = await getMainBranch();
  if (!mainBranch) {
    return data(
      { success: false, message: 'Không tìm thấy chi nhánh chính.' },
      { headers },
    );
  }

  const formData = await request.formData();
  const bookingData: IBookingAttrs = {
    name: formData.get('name') as string,
    msisdn: formData.get('msisdn') as string,
    spaName: formData.get('spaName') as string,
    note: formData.get('note') as string,
    branch: mainBranch.id,
  };

  try {
    await createBooking(bookingData);
    return data(
      {
        success: true,
        message: 'Đăng ký thành công!',
      },
      { headers },
    );
  } catch (error: any) {
    console.error('Error creating booking:', error.message);
    return data(
      {
        success: false,
        message:
          error.message || 'Đăng ký không thành công. Vui lòng thử lại sau.',
      },
      { headers },
    );
  }
};
