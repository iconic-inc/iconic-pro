import { ActionFunctionArgs } from '@remix-run/node';
import { createBooking } from '~/services/booking.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  switch (request.method) {
    case 'POST': {
      const body = new URLSearchParams(await request.text());
      const name = body.get('name');
      const msisdn = body.get('msisdn');
      const spaName = body.get('spaName');
      const branch = body.get('branch');
      const note = body.get('note') || '';
      if (!name || !msisdn || !spaName || !branch) {
        return {
          toast: { message: 'Vui lòng điền đầy đủ thông tin!', type: 'error' },
        };
      }

      try {
        const res = await createBooking({
          name,
          msisdn,
          spaName,
          branch,
          note,
        });

        return { toast: { message: 'Đặt lịch thành công!', type: 'success' } };
      } catch (e) {
        console.error(e);
        return { toast: { message: 'Đặt lịch thất bại!', type: 'error' } };
      }
    }

    default: {
      return { toast: { message: 'Method not allowed', type: 'error' } };
    }
  }
};
