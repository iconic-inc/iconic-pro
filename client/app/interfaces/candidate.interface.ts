import { IUser, IUserAttrs } from './user.interface';

export interface ICandidate {
  id: string;
  can_user: string;
  can_summary?: string;
  can_experience?: string; // markdown / rich‑text
  can_skills?: string[]; // array of strings
  can_cvFile?: string; // URL file pdf
  can_status?: string; // active | hidden
  createdAt: string;
  updatedAt: string;
}

export interface ICandidateDetails extends Omit<ICandidate, 'can_user'> {
  can_user: IUser; // ref User
}

export interface ICandidateAttrs extends IUserAttrs {
  summary?: string;
  experience?: string; // markdown / rich‑text
  skills?: string[]; // array of strings
  cvFile?: string; // URL file pdf
  status?: string; // active | hidden
}
