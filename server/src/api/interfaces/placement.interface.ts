import { HydratedDocument, Model, ObjectId } from 'mongoose';

export interface IRawPlacement {
  plc_application: ObjectId;
  plc_owner: ObjectId;
  plc_fee: number;
  plc_currency: string;
  plc_paid: boolean;
  plc_paidAt: Date;
  updatedAt: Date;
  createdAt: Date;
}

export interface IPlacementAttrs {
  application: string;
  owner: string;
  fee?: number;
  currency?: string;
  paid?: boolean;
  paidAt?: string;
}

export type IPlacement = HydratedDocument<IRawPlacement>;

export interface IPlacementModel extends Model<IPlacement> {
  build(attrs: IPlacementAttrs): Promise<IPlacement>;
}
