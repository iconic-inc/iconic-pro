import { HydratedDocument, Model, ObjectId } from 'mongoose';

export interface IRawBooking {
  id: string;
  bok_name: string;
  bok_msisdn: string;
  bok_courseName: string;
  bok_courseLevel: string;
  bok_viewed: boolean;
  bok_note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookingAttrs {
  name: string;
  msisdn: string;
  courseName: string;
  courseLevel: string;
  note?: string;
  viewed: boolean;
}

export type IBooking = HydratedDocument<IRawBooking>;

export interface IBookingModel extends Model<IBooking> {
  build(attrs: IBookingAttrs): Promise<IBooking>;
}
