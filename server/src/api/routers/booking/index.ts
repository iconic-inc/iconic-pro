import { BookingController } from '@controllers/booking.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';
import { Router } from 'express';
import { validateObjectId, validateSchema } from 'src/api/schema';
import { bookingCreateSchema } from 'src/api/schema/booking.schema';

const bookingRouter = Router();

bookingRouter.post(
  '/',
  validateSchema(bookingCreateSchema),
  BookingController.createBooking
);

bookingRouter.use(authenticationV2);

bookingRouter.get(
  '/',
  hasPermission('booking', 'readAny'),
  BookingController.getBookings
);
bookingRouter.get(
  '/count',
  hasPermission('booking', 'readAny'),
  BookingController.countUnseenBookings
);
bookingRouter.get(
  '/:bookingId',
  validateObjectId('bookingId'),
  hasPermission('booking', 'readAny'),
  BookingController.getBookingDetails
);

bookingRouter.put(
  '/:bookingId',
  validateObjectId('bookingId'),
  hasPermission('booking', 'updateAny'),
  BookingController.updateBooking
);

module.exports = bookingRouter;
