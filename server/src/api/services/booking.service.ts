import { BookingModel } from '@models/booking.model';
import { IBookingAttrs } from '../interfaces/booking.interface';
import { BadRequestError, NotFoundError } from '../core/errors';
import {
  formatAttributeName,
  getReturnData,
  getReturnList,
  removeNestedNullish,
} from '@utils/index';
import { BOOKING } from '../constants';

const createBooking = async (data: IBookingAttrs) => {
  const existingBooking = await BookingModel.findOne({
    bok_msisdn: data.msisdn,
  });
  if (existingBooking) {
    throw new BadRequestError(
      'Bạn đã đăng ký thành công trước đó. Vui lòng chờ chúng tôi liên hệ lại với bạn.'
    );
  }

  const newBooking = await BookingModel.build({
    ...data,
    viewed: false,
  });

  return getReturnData(newBooking);
};

const getBookings = async (query: Record<string, any> = {}) => {
  const filter: Record<string, any> = {};

  // Filter by viewed status
  if (query.viewed !== undefined) {
    filter.bok_viewed = query.viewed === 'true';
  }

  // Filter by date range
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) {
      filter.createdAt.$gte = new Date(query.startDate);
    }
    if (query.endDate) {
      filter.createdAt.$lte = new Date(query.endDate);
    }
  }

  const bookings = await BookingModel.find(filter, '-__v')
    .sort({ createdAt: -1 })
    .lean();

  return getReturnList(bookings);
};

const countUnseenBookings = async () => {
  return await BookingModel.countDocuments({ bok_viewed: false });
};

const getBookingDetails = async (id: string) => {
  const booking = await BookingModel.findById(id, { __v: 0 }).lean();

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  return getReturnData(booking);
};

const updateBooking = async (id: string, data: IBookingAttrs) => {
  const booking = await BookingModel.findOneAndUpdate(
    { _id: id },
    formatAttributeName(removeNestedNullish(data), BOOKING.PREFIX),
    {
      new: true,
    }
  );
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }
  return getReturnData(booking);
};

const deleteBooking = async (id: string) => {
  const booking = await BookingModel.findByIdAndDelete(id);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }
  return getReturnData(booking);
};

export {
  createBooking,
  getBookings,
  getBookingDetails,
  updateBooking,
  countUnseenBookings,
  deleteBooking,
};
