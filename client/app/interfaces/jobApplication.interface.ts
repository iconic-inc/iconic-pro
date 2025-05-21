import { ICandidateDetails } from './candidate.interface';
import { IJobPost, IJobPostDetails } from './jobPost.interface';

export interface IJobApplication {
  id: string;
  jap_jobPost: IJobPost;
  jap_candidate: ICandidateDetails;
  jap_message: string;
  jap_status: 'applied' | 'shortlisted' | 'interview' | 'hired' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface IJobApplicationDetails
  extends Omit<IJobApplication, 'jap_jobPost'> {
  jap_jobPost: IJobPostDetails;
}

export interface IJobApplicationAttrs {
  jobPost: string;
  candidate: string;
  message?: string;
  status?: 'applied' | 'shortlisted' | 'interview' | 'hired' | 'rejected';
}
