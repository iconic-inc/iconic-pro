import { Schema, Types, model, models } from 'mongoose';
import { ISpa, ISpaModel } from '../interfaces/spa.interface';
import { formatAttributeName } from '../utils';
import { IMAGE, SPA, SPA_OWNER, USER } from '../constants';

/**
 * Sub-documents
 * ------------------------------------------------------------------ */
const OpeningHourSchema = new Schema(
  {
    dayOfWeek: { type: Number, min: 0, max: 6, required: true }, // 0 = Sun … 6 = Sat
    open: { type: String, required: true }, // “09:00”
    close: { type: String, required: true }, // “19:00”
    isClosed: Boolean, // ngày nghỉ lễ
  },
  { _id: false }
);

const ServiceSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    priceFrom: Number,
    priceTo: Number,
    durationMin: Number,
    description: String,
  },
  { _id: false }
);

/**
 * Main Spa schema
 * ------------------------------------------------------------------ */
const spaSchema = new Schema<ISpa, ISpaModel>(
  {
    /* CORE */
    sp_name: {
      type: String,
      trim: true,
      required: true,
    },
    sp_slug: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
    },
    sp_owner: {
      type: Schema.Types.ObjectId,
      ref: SPA_OWNER.DOCUMENT_NAME,
      required: true,
    },
    sp_description: {
      type: String,
      trim: true,
    },
    sp_categories: {
      type: [String],
      index: true,
      default: [],
    },

    /* CONTACT & LOCATION */
    sp_phone: String,
    sp_email: String,
    sp_website: String,
    sp_socialLinks: {
      facebook: String, // facebook.com/…
      instagram: String, // instagram.com/…
      tiktok: String, // tiktok.com/…
      youtube: String, // youtube.com/…
    }, // facebook, tiktok …
    sp_address: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
      formattedAddress: String,
    },

    /* BUSINESS INFO */
    sp_openingHours: {
      type: [OpeningHourSchema],
      default: [],
    },
    sp_services: {
      type: [ServiceSchema],
      default: [],
    },

    /* MEDIA */
    sp_avatar: {
      type: Types.ObjectId,
      ref: IMAGE.DOCUMENT_NAME,
    },
    sp_coverImage: {
      type: Types.ObjectId,
      ref: IMAGE.DOCUMENT_NAME,
    },
    sp_gallery: {
      type: [Types.ObjectId],
      ref: IMAGE.DOCUMENT_NAME,
      default: [],
    },

    /* RATING (denormalised) */
    sp_averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    sp_reviewCount: {
      type: Number,
      default: 0,
    },
    sp_lastReviewAt: Date,

    /* MODERATION */
    sp_status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected', 'deleted'],
      default: 'draft',
      index: true,
    },
    sp_adminNote: String,
    sp_isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: SPA.COLLECTION_NAME,
  }
);

/* INDEXES */
spaSchema.index({ sp_name: 'text', sp_description: 'text' });
spaSchema.index({ 'sp_address.coordinates': '2dsphere' });

/* STATIC BUILD HELPER — identical pattern to PageModel */
spaSchema.statics.build = (attrs: ISpa) => {
  return SpaModel.create(formatAttributeName(attrs, SPA.PREFIX));
};

/* VIRTUALS */
spaSchema.statics.updateAggregateRating = async function (
  this: ISpaModel,
  spaId: string
) {
  const spa = await this.findById(spaId);
  if (!spa) return;

  const [result] = await this.aggregate([
    {
      $match: { _id: new Types.ObjectId(spaId) },
    },
    {
      $lookup: {
        from: 'reviews',
        let: { spaId: '$_id' },
        pipeline: [
          {
            // keep only reviews that belong to this spa **and** are approved
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$rv_spa', '$$spaId'] },
                  { $eq: ['$rv_status', 'approved'] },
                ],
              },
            },
          },
          { $project: { rv_rating: 1 } }, // keep only the fields we need
        ],
        as: 'reviews',
      },
    },
    {
      $unwind: { path: '$reviews', preserveNullAndEmptyArrays: true },
    },
    {
      $group: {
        _id: '$_id',
        sp_averageRating: { $avg: '$reviews.rv_rating' },
        sp_reviewCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        sp_averageRating: { $round: ['$sp_averageRating', 1] },
        sp_reviewCount: 1,
      },
    },
  ]);

  if (result.sp_averageRating && result.sp_reviewCount) {
    await this.findByIdAndUpdate(spaId, {
      sp_averageRating: result.sp_averageRating,
      sp_reviewCount: result.sp_reviewCount,
      sp_lastReviewAt: new Date(),
    });
  } else {
    await this.findByIdAndUpdate(spaId, {
      sp_averageRating: 0,
      sp_reviewCount: 0,
      sp_lastReviewAt: new Date(),
    });
  }
  return spa;
};

export const SpaModel =
  // models[SPA.DOCUMENT_NAME] ||
  model<ISpa, ISpaModel>(SPA.DOCUMENT_NAME, spaSchema);
