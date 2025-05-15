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
export interface IRawSpa {
  spa_name: string;
  spa_slug: string;
  spa_owner: Types.ObjectId; // ref User (role: spaOwner)
  spa_description?: string;
  spa_categories: string[];
  spa_phone?: string;
  spa_email?: string;
  spa_website?: string;
  spa_socialLinks?: Map<string, string>;
  spa_address: ILocation;
  spa_openingHours: IOpeningHour[];
  spa_services: IService[];
  spa_avatar?: Types.ObjectId; // ref Image
  spa_coverImage?: Types.ObjectId; // ref Image
  spa_gallery?: Types.ObjectId[]; // ref Image[]
}

export interface ISpaAttrs {
  name: string;
  slug: string;
  owner: string;
  description?: string;
  categories: string[];
  phone?: string;
  email?: string;
  website?: string;
  socialLinks?: Record<string, string>;
  address: ILocation;
  openingHours: IOpeningHour[];
  services: IService[];
  avatar?: string; // ref Image
  coverImage?: string; // ref Image
  gallery?: string[]; // ref Image[]
  averageRating?: number;
  reviewCount?: number;
  lastReviewAt?: Date;
  status?: 'draft' | 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  isFeatured?: boolean;
}

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
  sp_socialLinks?: Record<string, string>;
  sp_address: ILocation;

  /* BUSINESS INFO */
  sp_openingHours: IOpeningHour[];
  sp_services: IService[];

  /* MEDIA */
  sp_avatar?: Types.ObjectId; // ref Image
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
  build(attrs: ISpaAttrs): Promise<ISpa>;
  /** Re-calculate and persist average rating / review count */
  updateAggregateRating?(spaId: Types.ObjectId): Promise<void>;
}
