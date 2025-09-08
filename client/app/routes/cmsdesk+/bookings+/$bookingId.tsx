import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { authenticator, isAuthenticated } from '~/services/auth.server';
import {
  deleteBooking,
  getBookingDetail,
  setViewedBooking,
} from '~/services/booking.server';
import BookingDetail from '~/widgets/BookingDetail';
import {
  data,
  redirect,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useRevalidator,
} from '@remix-run/react';
import { parseAuthCookie } from '~/services/cookie.server';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { session: user, headers } = await isAuthenticated(request);
  if (!user) {
    return data({ message: 'Vui lòng đăng nhập' }, { status: 401, headers });
  }

  const { bookingId } = params;
  if (!bookingId) {
    return data({ message: 'Yêu cầu không hợp lệ' }, { status: 400, headers });
  }

  try {
    switch (request.method) {
      case 'PUT':
        const formData = await request.formData();
        const viewed = formData.get('viewed') === 'true';
        const res = await setViewedBooking(bookingId, viewed, user);
        return res;

      case 'DELETE':
        const deleteRes = await deleteBooking(bookingId, user);
        return deleteRes;

      default:
        return data(
          { message: 'Phương thức không được hỗ trợ' },
          { status: 405, headers },
        );
    }
  } catch (error: any) {
    console.error('Error setting viewed booking:', error);
    return data(
      { message: error.message || 'Lỗi khi xử lý yêu cầu' },
      { status: 500, headers },
    );
  }
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await parseAuthCookie(request);
  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }

  try {
    if (!params.bookingId) {
      throw new Response('Không tìm thấy lịch hẹn', { status: 404 });
    }
    const booking = await getBookingDetail(params.bookingId, user);
    return { booking, message: null };
  } catch (error) {
    console.error('Error loading booking detail:', error);
    return data(
      {
        booking: null,
        message: error instanceof Error ? error.message : 'Lỗi không xác định',
      },
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

export default function BookingDetailPopup() {
  const { booking } = useLoaderData<typeof loader>() as any;
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  return (
    <BookingDetail
      booking={booking}
      popupHidder={() => {
        navigate(-1);
        revalidator.revalidate();
      }}
    />
  );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { booking, message } = data || {};
  return [{ title: `${booking?.bok_name || message}` }];
};
