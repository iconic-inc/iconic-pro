import { HydratedDocument, Model, ObjectId } from 'mongoose';
import { JOB_POST } from '../constants';
import { ISpaOwner, ISpaOwnerResponse } from './spaOwner.interface';

export interface IRawJobPost {
  jpo_title: string;
  jpo_description: string;
  jpo_requirements?: string;
  jpo_salaryFrom?: number;
  jpo_salaryTo?: number;
  jpo_currency?: string;
  jpo_spa?: ObjectId;
  jpo_owner: ObjectId;
  jpo_type?: Values<typeof JOB_POST.TYPE>;
  jpo_status?: Values<typeof JOB_POST.STATUS>;
  jpo_deadline?: Date;
  jpo_applicantCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobPostAttrs {
  title: string;
  description: string;
  requirements?: string;
  salaryFrom?: number;
  salaryTo?: number;
  currency?: string;
  spa?: string;
  owner: string;
  type?: Values<typeof JOB_POST.TYPE>;
  status?: Values<typeof JOB_POST.STATUS>;
  deadline?: Date;
  applicantCount?: number;
}

export type IJobPost = HydratedDocument<IRawJobPost>;

export interface IJobPostModel extends Model<IJobPost> {
  build(attrs: IJobPostAttrs): Promise<IJobPost>;
}

export interface IJobPostResponse {
  id: string;
  jpo_title: string;
  jpo_description: string;
  jpo_requirements?: string;
  jpo_salaryFrom?: number;
  jpo_salaryTo?: number;
  jpo_currency?: string;
  jpo_spa?: ObjectId;
  jpo_owner: ISpaOwnerResponse;
  jpo_type?: Values<typeof JOB_POST.TYPE>;
  jpo_status?: Values<typeof JOB_POST.STATUS>;
  jpo_deadline?: Date;
  jpo_applicantCount?: number;
  createdAt: string;
  updatedAt: string;
}
