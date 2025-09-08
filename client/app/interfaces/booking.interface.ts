export interface IBooking {
  id: string;
  bok_name: string;
  bok_msisdn: string;
  bok_courseName: string;
  bok_courseLevel: string;
  bok_viewed: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface IBookingDetail extends IBooking {
  bok_note?: string;
}

export interface IBookingAttrs {
  name: string;
  msisdn: string;
  courseName: string;
  courseLevel: string;
  note?: string;
}
