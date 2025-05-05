/* src/models/spa-owner.model.ts */
import { Schema, Types, model } from 'mongoose';
import { ISpaOwner, ISpaOwnerModel } from '../interfaces/spa-owner.interface';
import { SPA_OWNER, SPA, USER } from '../constants';
import { formatAttributeName } from '../utils';

/**
 * Một “spa-owner” là cầu nối giữa User và một (hoặc nhiều) Spa.
 * Mô hình tách riêng để:
 *  • Cho phép 1 user quản lý nhiều spa (multi-brand).
 *  • Gắn thêm metadata (quyền phụ, trạng thái, thời hạn gói …) mà không đụng tới bảng User.
 */

const spaOwnerSchema = new Schema<ISpaOwner, ISpaOwnerModel>(
  {
    /* RELATIONS --------------------------------------------------- */
    spo_user: {
      type: Schema.Types.ObjectId,
      ref: USER.DOCUMENT_NAME,
      required: true,
      index: true,
      unique: true, // 1 user ↔︎ 1 spa-owner record
    },
    /** Danh sách spa mà user sở hữu / quản lý */
    spo_spas: [
      {
        type: Types.ObjectId,
        ref: SPA.DOCUMENT_NAME,
        required: true,
      },
    ],

    /* BUSINESS INFO ---------------------------------------------- */
    /** Quyền cấp dưới owner: “manager”, “staff”… (nếu cần phân tầng) */
    spo_level: {
      type: String,
      enum: ['owner', 'manager'],
      default: 'owner',
    },
    /** Gói subscription hiện tại (free, pro, vip …) */
    spo_plan: {
      type: String,
      default: 'free',
    },
    /** Thời hạn gói (nếu có) */
    spo_planExpireAt: {
      type: Date,
    },

    /* STATUS ------------------------------------------------------ */
    spo_status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    collection: SPA_OWNER.COLLECTION_NAME,
  }
);

/* STATIC HELPER – giống pattern User/Spa */
spaOwnerSchema.statics.build = (attrs: ISpaOwner) => {
  return SpaOwnerModel.create(formatAttributeName(attrs, SPA_OWNER.PREFIX));
};

export const SpaOwnerModel = model<ISpaOwner, ISpaOwnerModel>(
  SPA_OWNER.DOCUMENT_NAME,
  spaOwnerSchema
);
