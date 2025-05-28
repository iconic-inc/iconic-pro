import { LoaderFunctionArgs, data } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';

import { parseAuthCookie } from '~/services/cookie.server';
import { getBookings } from '~/services/booking.server';
import HandsomeError from '~/components/HandsomeError';
import BookingList from '~/widgets/BookingList';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const auth = await parseAuthCookie(request);
    if (!auth) {
      throw new Response('Unauthorized', { status: 401 });
    }

    const bookings = await getBookings(auth);

    return {
      bookings,
    };
  } catch (error) {
    console.error('Error loading bookings:', error);
    if (error instanceof Response) {
      throw error;
    }
    return { bookings: [] };
  }
};

export default function BookingManager() {
  const { bookings } = useLoaderData<typeof loader>();

  return (
    <div className='container grid grid-cols-12 gap-4'>
      <BookingList bookings={bookings} />

      <Outlet />
    </div>
  );
}

export const ErrorBoundary = () => <HandsomeError />;
