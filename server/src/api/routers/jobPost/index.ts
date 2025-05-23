/* 1 ▸ ADMIN ROUTES – src/routes/job-post.route.ts
   ---------------------------------------------------- */
import { Router } from 'express';
import { JobPostController } from '../../controllers/jobPost.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';

const adminJobPostRouter = Router();

/* 🔐 Require JWT for every admin job‑post route */
adminJobPostRouter.use(authenticationV2);

/* CRUD  (resource = "jobPost", action = *Any) */
adminJobPostRouter.get(
  '/',
  hasPermission('jobPost', 'readAny'),
  JobPostController.listJobPosts
);

adminJobPostRouter.post(
  '/',
  hasPermission('jobPost', 'createAny'),
  JobPostController.createJobPost
);

adminJobPostRouter.get(
  '/:jobPostId',
  hasPermission('jobPost', 'readAny'),
  JobPostController.getJobPostById
);

adminJobPostRouter.put(
  '/:jobPostId',
  hasPermission('jobPost', 'updateAny'),
  JobPostController.updateJobPost
);

adminJobPostRouter.delete(
  '/bulk',
  hasPermission('jobPost', 'deleteAny'),
  JobPostController.bulkDeleteJobPosts
);

adminJobPostRouter.delete(
  '/bulk/hard',
  hasPermission('jobPost', 'deleteAny'),
  JobPostController.bulkHardDeleteJobPosts
);

adminJobPostRouter.delete(
  '/:jobPostId',
  hasPermission('jobPost', 'deleteAny'),
  JobPostController.deleteJobPost
);

/* Approve / close / reopen */
adminJobPostRouter.patch(
  '/:jobPostId/status',
  hasPermission('jobPost', 'updateAny'),
  JobPostController.updateJobPostStatus
);

module.exports = adminJobPostRouter;
