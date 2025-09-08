/* src/models/placement.model.ts */
import { Schema, Types, model } from 'mongoose';
import { PLACEMENT, JOB_APPLICATION, SPA_OWNER } from '../constants';
import { IPlacement, IPlacementModel } from '../interfaces/placement.interface';

const placementSchema = new Schema<IPlacement, IPlacementModel>(
  {
    plc_application: {
      type: Types.ObjectId,
      ref: JOB_APPLICATION.DOCUMENT_NAME,
      required: true,
      unique: true,
    },
    plc_owner: {
      type: Types.ObjectId,
      ref: SPA_OWNER.DOCUMENT_NAME,
      required: true,
    },
    plc_fee: { type: Number, default: 0 }, // số tiền tính theo % hoặc cố định
    plc_currency: { type: String, default: 'VND' },
    plc_paid: { type: Boolean, default: false },
    plc_paidAt: Date,
  },
  { timestamps: true, collection: PLACEMENT.COLLECTION_NAME }
);

export const PlacementModel = model<IPlacement, IPlacementModel>(
  PLACEMENT.DOCUMENT_NAME,
  placementSchema
);
