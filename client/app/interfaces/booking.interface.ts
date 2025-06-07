export interface IBooking {
  id: string;
  bok_name: string;
  bok_msisdn: string;
  bok_spaName: string;
  bok_branch: {
    id: string;
    bra_name: string;
  };
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
  spaName: string;
  branch: string;
  note?: string;
}
