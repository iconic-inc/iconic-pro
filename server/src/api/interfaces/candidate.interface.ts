import { HydratedDocument, Model, ObjectId } from 'mongoose';
import { IUserAttrs, IUserResponseData } from './user.interface';

export interface IRawCandidate {
  can_user: ObjectId;
  can_summary?: string;
  can_experience?: string; // markdown / rich‑text
  can_skills?: string[]; // array of strings
  can_cvFile?: string; // URL file pdf
  can_status?: string; // active | hidden
  createdAt: Date;
  updatedAt: Date;
}

export interface ICandidateAttrs {
  user: string;
  summary?: string;
  experience?: string; // markdown / rich‑text
  skills?: string[]; // array of strings
  cvFile?: string; // URL file pdf
  status?: string; // active | hidden
}

export interface ICandidateUpdate
  extends Omit<ICandidateAttrs, 'user' | 'status'>,
    Partial<IUserAttrs> {}

export type ICandidate = HydratedDocument<IRawCandidate>;

export interface ICandidateModel extends Model<ICandidate> {
  build(attrs: ICandidateAttrs): Promise<ICandidate>;
}

export interface ICandidateResponse {
  id: string;
  can_user: IUserResponseData;
  can_summary?: string;
  can_experience?: string; // markdown / rich‑text
  can_skills?: string[]; // array of strings
  can_cvFile?: string; // URL file pdf
  can_status?: string; // active | hidden
  createdAt: string;
  updatedAt: string;
}
