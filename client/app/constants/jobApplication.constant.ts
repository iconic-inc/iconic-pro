export const JOB_APPLICATION = {
  STATUS: {
    APPLIED: {
      name: 'Đã nộp',
      slug: 'applied',
    },
    SHORTLISTED: {
      name: 'Đã được chọn',
      slug: 'shortlisted',
    },
    INTERVIEW: {
      name: 'Phỏng vấn',
      slug: 'interview',
    },
    HIRED: {
      name: 'Đã nhận việc',
      slug: 'hired',
    },
    REJECTED: {
      name: 'Đã loại',
      slug: 'rejected',
    },
    WITHDRAWN: {
      name: 'Đã thu hồi',
      slug: 'withdrawn',
    },
  },
} as const;
