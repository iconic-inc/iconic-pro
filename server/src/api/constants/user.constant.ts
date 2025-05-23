export const USER = {
  DOCUMENT_NAME: 'User',
  COLLECTION_NAME: 'users',
  PREFIX: 'usr_',
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
  },
  SEX: {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other',
  },
  EMPLOYEE: {
    PREFIX: 'emp_',
    DOCUMENT_NAME: 'Employee',
    COLLECTION_NAME: 'employees',
  },
} as const;
