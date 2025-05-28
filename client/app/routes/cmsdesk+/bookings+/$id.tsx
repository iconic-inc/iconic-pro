import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  data,
} from '@remix-run/node';
import { isAuthenticated } from '~/services/auth.server';
import { parseAuthCookie } from '~/services/cookie.server';
import { getBookingDetail, setViewedBooking } from '~/services/booking.server';
import BookingDetail from '~/widgets/BookingDetail';
import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useRevalidator,
} from '@remix-run/react';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { session, headers } = await isAuthenticated(request);
  if (!session) {
    return data({ success: false, message: 'Unauthorized' }, { headers });
  }

  const { id } = params;
  const { viewed } = (await request.json()) as any;

  try {
    const res = await setViewedBooking(id || '', viewed, session);
    return data(res, { headers });
  } catch (error) {
    console.error('Error setting viewed booking:', error);
    return data(null, { headers, status: 500 });
  }
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const auth = await parseAuthCookie(request);
  if (!auth) {
    throw new Response('Unauthorized', { status: 401 });
  }

  try {
    if (!params.id) {
      throw new Response('Booking ID is required', { status: 400 });
    }
    const booking = await getBookingDetail(params.id, auth);
    return { booking };
  } catch (error) {
    console.error('Error loading booking detail:', error);
    if (error instanceof Response) {
      throw error;
    }
    return { booking: null };
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
  const { booking } = data || {};
  return [{ title: `${booking?.bok_name}` }];
};
