import { Document, Model, Types } from 'mongoose';
import { IUserResponseData } from './user.interface';

export interface IRawSpaOwner {
  spo_user: Types.ObjectId; // ref User
  spo_level: 'owner' | 'manager';
  spo_plan: string;
  spo_planExpireAt?: Date;
  spo_status: 'active' | 'suspended';
  createdAt?: Date;
  updatedAt?: Date;
}

/** Creating spa owner interface */
export interface ISpaOwnerAttrs {
  level?: 'owner' | 'manager';
  plan?: string;
  planExpireAt?: Date;
  status?: 'active' | 'suspended';
}

export interface ISpaOwner extends Document {
  /* RELATIONS */
  spo_user: Types.ObjectId; // ref User

  /* BUSINESS INFO */
  spo_level: 'owner' | 'manager';
  spo_plan: string;
  spo_planExpireAt?: Date;

  /* STATUS */
  // spo_status: 'active' | 'suspended';

  /* TIMESTAMPS */
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISpaOwnerModel extends Model<ISpaOwner> {
  build(attrs: ISpaOwner): Promise<ISpaOwner>;
}

export interface ISpaOwnerResponse {
  id: string;
  spo_user: IUserResponseData;
  spo_level: 'owner' | 'manager';
  spo_plan: string;
  spo_planExpireAt?: string;
  spo_status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}
