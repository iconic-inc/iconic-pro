export const JOB_POST = {
  DOCUMENT_NAME: 'JobPost',
  COLLECTION_NAME: 'job_posts',
  PREFIX: 'jpo_',
  TYPE: {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    INTERN: 'intern',
  },
  STATUS: {
    DRAFT: 'draft',
    ACTIVE: 'active',
    CLOSED: 'closed',
  },
} as const;
