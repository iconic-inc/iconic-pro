import { Schema, Types, model } from 'mongoose';
import { IBooking, IBookingModel } from '../interfaces/booking.interface';
import { formatAttributeName } from '../utils';
import { BOOKING, BRANCH } from '../constants';
import { models } from 'mongoose';

const bookingSchema = new Schema<IBooking, IBookingModel>(
  {
    bok_name: { type: String, required: true },
    bok_msisdn: { type: String, required: true, unique: true },
    bok_spaName: { type: String, required: true },
    bok_branch: {
      type: Types.ObjectId,
      ref: BRANCH.DOCUMENT_NAME,
      required: true,
    },
    bok_note: { type: String, default: '' },
    bok_viewed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: BOOKING.COLLECTION_NAME,
  }
);

bookingSchema.statics.build = (attrs: IBooking) => {
  return BookingModel.create(formatAttributeName(attrs, BOOKING.PREFIX));
};

export const BookingModel =
  // models[BOOKING.DOCUMENT_NAME] ||
  model<IBooking, IBookingModel>(BOOKING.DOCUMENT_NAME, bookingSchema);
