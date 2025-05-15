import { HydratedDocument, Model, ObjectId } from 'mongoose';

export interface IRawJobPost {
  jpo_title: string;
  jpo_description: string;
  jpo_requirements?: string;
  jpo_salaryFrom?: number;
  jpo_salaryTo?: number;
  jpo_currency?: string;
  jpo_spa: ObjectId;
  jpo_owner: ObjectId;
  jpo_type?: string;
  jpo_status?: string;
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
  spa: string;
  owner: string;
  type?: string;
  status?: string;
  deadline?: Date;
  applicantCount?: number;
}

export type IJobPost = HydratedDocument<IRawJobPost>;

export interface IJobPostModel extends Model<IJobPost> {
  build(attrs: IJobPostAttrs): Promise<IJobPost>;
}
