/* src/models/review.model.ts */
import { Schema, Types, model, models } from 'mongoose';
import { IReview, IReviewModel } from '../interfaces/review.interface';
import { formatAttributeName } from '../utils';
import { REVIEW, SPA, IMAGE, USER } from '../constants';
import { SpaModel } from './spa.model';

/* ------------------------------------------------------------------ */
/* Schema                                                             */
/* ------------------------------------------------------------------ */
const reviewSchema = new Schema<IReview, IReviewModel>(
  {
    /* RELATIONS */
    rv_spa: {
      type: Schema.Types.ObjectId,
      ref: SPA.DOCUMENT_NAME, // “Spa”
      required: true,
      index: true,
    },
    rv_author: {
      type: Schema.Types.ObjectId, // ref “User”
      ref: USER.DOCUMENT_NAME,
      required: true,
      index: true,
    },

    /* CONTENT */
    rv_rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    rv_title: {
      type: String,
      trim: true,
    },
    rv_content: {
      type: String,
      trim: true,
      required: true,
    },
    rv_images: {
      type: [Types.ObjectId],
      ref: IMAGE.DOCUMENT_NAME, // hình ảnh đính kèm
      default: [],
    },

    /* META */
    rv_likes: {
      type: Number,
      default: 0,
    },
    rv_isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: REVIEW.COLLECTION_NAME,
  }
);

/* UNIQUE: 1 user chỉ review 1 lần / spa */
reviewSchema.index({ rv_spa: 1, rv_author: 1 }, { unique: true });

/* BUILD HELPER  (giống PageModel & SpaModel) */
reviewSchema.statics.build = (attrs: IReview) => {
  return ReviewModel.create(formatAttributeName(attrs, REVIEW.PREFIX));
};

/* ------------------------------------------------------------------ */
/* MIDDLEWARE: keep spa’s aggregate rating luôn chính xác            */
/* ------------------------------------------------------------------ */
async function recalc(this: any, doc: IReview) {
  // chỉ cập nhật khi review đã duyệt
  if (doc.rv_isApproved) {
    await (SpaModel as any).updateAggregateRating(doc.rv_spa);
  }
}

reviewSchema.post('save', recalc);
reviewSchema.post('findOneAndDelete', recalc);
reviewSchema.post('deleteOne', recalc);

/* ------------------------------------------------------------------ */
/* MODEL                                                              */
/* ------------------------------------------------------------------ */
export const ReviewModel =
  // models[REVIEW.DOCUMENT_NAME] ||
  model<IReview, IReviewModel>(REVIEW.DOCUMENT_NAME, reviewSchema);
