export const JOB_POST = {
  TYPE: {
    FULL_TIME: {
      slug: 'full-time',
      name: 'Toàn thời gian',
    },
    PART_TIME: {
      slug: 'part-time',
      name: 'Bán thời gian',
    },
    INTERN: {
      slug: 'intern',
      name: 'Thực tập',
    },
  },
  STATUS: {
    DRAFT: {
      slug: 'draft',
      name: 'Nháp',
    },
    ACTIVE: {
      slug: 'active',
      name: 'Đang hoạt động',
    },
    CLOSED: {
      slug: 'closed',
      name: 'Đã đóng',
    },
  },
} as const;
