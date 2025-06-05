export const JOB_APPLICATION = {
  DOCUMENT_NAME: 'JobApplication',
  COLLECTION_NAME: 'job_applications',
  PREFIX: 'jap_',
  STATUS: {
    APPLIED: 'applied',
    SHORTLISTED: 'shortlisted',
    INTERVIEW: 'interview',
    HIRED: 'hired',
    REJECTED: 'rejected',
    WITHDRAWN: 'withdrawn',
  },
} as const;
