/* src/interfaces/spa.interface.ts */
import { Document, Model, Types } from 'mongoose';

/* ------------------------------------------------------------------ */
/* Sub-types                                                          */
/* ------------------------------------------------------------------ */
export interface IOpeningHour {
  /** 0 = Sunday … 6 = Saturday */
  dayOfWeek: number;
  open: string; // “09:00”
  close: string; // “19:00”
  isClosed?: boolean; // Ngày nghỉ lễ, Tết, …
}

export interface IService {
  _id?: Types.ObjectId; // optional when embedded
  name: string;
  priceFrom?: number;
  priceTo?: number;
  durationMin?: number; // phút
  description?: string;
}

export interface ILocation {
  type: 'Point';
  /** [lng, lat]  — chuẩn GeoJSON */
  coordinates: [number, number];
  formattedAddress?: string; // “123 Lê Lợi, Q.1, TP.HCM”
}

/* ------------------------------------------------------------------ */
/* Main Spa interface                                                 */
/* ------------------------------------------------------------------ */
export interface ISpa extends Document {
  /* CORE */
  sp_name: string;
  sp_slug: string;
  sp_owner: Types.ObjectId; // ref User (role: spaOwner)
  sp_description?: string;
  sp_categories: string[];

  /* CONTACT & LOCATION */
  sp_phone?: string;
  sp_email?: string;
  sp_website?: string;
  sp_socialLinks?: Map<string, string>;
  sp_address: ILocation;

  /* BUSINESS INFO */
  sp_openingHours: IOpeningHour[];
  sp_services: IService[];

  /* MEDIA */
  sp_coverImage?: Types.ObjectId; // ref Image
  sp_gallery: Types.ObjectId[]; // ref Image[]

  /* RATING (denormalised) */
  sp_averageRating: number;
  sp_reviewCount: number;
  sp_lastReviewAt?: Date;

  /* MODERATION */
  sp_status: 'draft' | 'pending' | 'approved' | 'rejected';
  sp_adminNote?: string;
  sp_isFeatured: boolean;

  /* TIMESTAMPS (added by Mongoose) */
  createdAt?: Date;
  updatedAt?: Date;
}

/* ------------------------------------------------------------------ */
/* Model interface (for statics)                                      */
/* ------------------------------------------------------------------ */
export interface ISpaModel extends Model<ISpa> {
  /** Helper to create document with prefixed / formatted keys */
  build(attrs: ISpa): Promise<ISpa>;
  /** Re-calculate and persist average rating / review count */
  updateAggregateRating?(spaId: Types.ObjectId): Promise<void>;
}
