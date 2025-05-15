import { Document, Model, Types } from 'mongoose';

export interface IRawSpaOwner {
  spo_user: Types.ObjectId; // ref User
  spo_spas: Types.ObjectId[]; // ref Spa[]
  spo_level: 'owner' | 'manager';
  spo_plan: string;
  spo_planExpireAt?: Date;
  spo_status: 'active' | 'suspended';
  createdAt?: Date;
  updatedAt?: Date;
}

/** Creating spa owner interface */
export interface ISpaOwnerAttrs {
  spas: string[];
  level?: 'owner' | 'manager';
  plan?: string;
  planExpireAt?: Date;
  status?: 'active' | 'suspended';
}

export interface ISpaOwner extends Document {
  /* RELATIONS */
  spo_user: Types.ObjectId; // ref User
  spo_spas: Types.ObjectId[]; // ref Spa[]

  /* BUSINESS INFO */
  spo_level: 'owner' | 'manager';
  spo_plan: string;
  spo_planExpireAt?: Date;

  /* STATUS */
  spo_status: 'active' | 'suspended';

  /* TIMESTAMPS */
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISpaOwnerModel extends Model<ISpaOwner> {
  build(attrs: ISpaOwner): Promise<ISpaOwner>;
}
