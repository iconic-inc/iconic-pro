import { JOB_POST } from '~/constants/jobPost.constant';
import { ISpa } from './spa.interface';
import { ISpaOwner, ISpaOwnerDetails } from './spaOwner.interface';

export interface IJobPostAttrs {
  title: string;
  description: string;
  requirements?: string;
  salaryFrom?: number;
  salaryTo?: number;
  currency?: string;
  spa?: string;
  owner: string;
  type?: Values<typeof JOB_POST.TYPE>['slug'];
  status?: Values<typeof JOB_POST.STATUS>['slug'];
  deadline?: string;
  applicantCount?: number;
}

export interface IJobPost {
  id: string;
  jpo_title: string;
  jpo_description: string;
  jpo_requirements?: string;
  jpo_salaryFrom?: number;
  jpo_salaryTo?: number;
  jpo_currency?: string;
  jpo_spa?: string;
  jpo_owner: string;
  jpo_type?: Values<typeof JOB_POST.TYPE>['slug'];
  jpo_status?: Values<typeof JOB_POST.STATUS>['slug'];
  jpo_deadline?: string;
  jpo_applicantCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IJobPostDetails
  extends Omit<IJobPost, 'jpo_spa' | 'jpo_owner'> {
  jpo_spa?: ISpa; // ref Spa
  jpo_owner: ISpaOwnerDetails; // ref User
}
