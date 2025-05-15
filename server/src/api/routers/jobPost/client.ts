/* src/routes/client/job-post.route.ts
   ───────────────────────────────────────────────────────── */
import { Router } from 'express';
import { JobPostController } from '../../controllers/jobPost.controller';
import { hasPermission } from '@middlewares/authorization'; // still enforce RBAC

const clientJobPostRouter = Router();

/*  LIST / SEARCH  ───────────────────────────────────────
    Example query params:
      • page, limit
      • keyword       (full‑text search)
      • spaId         (filter by spa)
      • type          (full-time / part-time ...)
      • salaryFrom / salaryTo
*/
clientJobPostRouter.get(
  '/',
  hasPermission('jobPost', 'readAny'), // public “readAny” permission
  JobPostController.listJobPostsPublic
);

/*  DETAIL ─────────────────────────────────────────────── */
clientJobPostRouter.get(
  '/:jobPostId',
  hasPermission('jobPost', 'readAny'),
  JobPostController.getJobPostPublicById
);

module.exports = clientJobPostRouter;
