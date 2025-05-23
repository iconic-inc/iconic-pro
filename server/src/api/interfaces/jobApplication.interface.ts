import { HydratedDocument, Model, ObjectId } from 'mongoose';
import { IJobPostResponse } from './jobPost.interface';
import { ICandidateResponse } from './candidate.interface';

export interface IRawJobApp {
  jap_jobPost: ObjectId;
  jap_candidate: ObjectId;
  jap_message: string;
  jap_status: 'applied' | 'shortlisted' | 'interview' | 'hired' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobAppAttrs {
  jobPost: string;
  candidate: string;
  message?: string;
  status?: 'applied' | 'shortlisted' | 'interview' | 'hired' | 'rejected';
}

export type IJobApp = HydratedDocument<IRawJobApp>;

export interface IJobAppModel extends Model<IJobApp> {
  build(attrs: IJobAppAttrs): Promise<IJobApp>;
}

export interface IJobAppResponse {
  id: string;
  jap_jobPost: IJobPostResponse;
  jap_candidate: ICandidateResponse;
  jap_message: string;
}
