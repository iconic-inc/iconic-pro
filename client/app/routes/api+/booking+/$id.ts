import { ActionFunctionArgs } from '@remix-run/node';
import { authenticator, isAuthenticated } from '~/services/auth.server';
import { setViewedBooking, updateBooking } from '~/services/booking.server';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { session, headers } = await isAuthenticated(request);

  switch (request.method) {
    case 'POST': {
      const id = params.id || '';

      const res = await setViewedBooking(id, false, session!);
      return new Response(null, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          ...headers,
        },
      });
    }

    default: {
      return new Response(null, {
        status: 405,
        headers: {
          'Content-Type': 'text/plain',
          ...headers,
        },
      });
    }
  }
};
