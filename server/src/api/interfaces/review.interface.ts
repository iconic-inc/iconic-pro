/* src/interfaces/review.interface.ts */

import { Document, Model, Types } from 'mongoose';

/* ------------------------------------------------------------------ */
/* Review main interface                                              */
/* ------------------------------------------------------------------ */
export interface IReview extends Document {
  /* RELATIONS */
  rv_spa: Types.ObjectId; // ref Spa
  rv_author: Types.ObjectId; // ref User

  /* CONTENT */
  rv_rating: number; // 1‒5
  rv_title?: string;
  rv_content: string;
  rv_images: Types.ObjectId[]; // ref Image[]

  /* META */
  rv_likes: number;
  rv_isApproved: boolean;

  /* TIMESTAMPS (added by Mongoose) */
  createdAt?: Date;
  updatedAt?: Date;
}

/* ------------------------------------------------------------------ */
/* Model interface for static helpers                                 */
/* ------------------------------------------------------------------ */
export interface IReviewModel extends Model<IReview> {
  /** Helper to create a review with formatted / prefixed keys */
  build(attrs: IReview): Promise<IReview>;
}

export interface IReviewAttrs {
  /* RELATIONS */
  spa: string; // ref Spa
  author: string; // ref User
  /* CONTENT */
  rating: number; // 1‒5
  title?: string;
  content: string;
  images?: string[]; // ref Image[]
  /* META */
  likes?: number;
  isApproved?: boolean;
}
