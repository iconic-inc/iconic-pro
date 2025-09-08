/* 1 ▸ ADMIN ROUTES – src/routes/job-post.route.ts
   ---------------------------------------------------- */
import { Router } from 'express';
import { JobPostController } from '../../controllers/jobPost.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';

const jobPostRouter = Router();

jobPostRouter.get('/public', JobPostController.listJobPostsPublic);
jobPostRouter.get('/public/:jobPostId', JobPostController.getJobPostPublicById);

/* 🔐 Require JWT for every admin job‑post route */
jobPostRouter.use(authenticationV2);

/* CRUD  (resource = "jobPost", action = *Any) */
jobPostRouter.get(
  '/:jobPostId',
  hasPermission('jobPost', 'readAny'),
  JobPostController.getJobPostById
);

jobPostRouter.get(
  '/',
  hasPermission('jobPost', 'readAny'),
  JobPostController.listJobPosts
);

jobPostRouter.post(
  '/',
  hasPermission('jobPost', 'createAny'),
  JobPostController.createJobPost
);

jobPostRouter.put(
  '/:jobPostId',
  hasPermission('jobPost', 'updateAny'),
  JobPostController.updateJobPost
);

jobPostRouter.delete(
  '/bulk/hard',
  hasPermission('jobPost', 'deleteAny'),
  JobPostController.bulkHardDeleteJobPosts
);

jobPostRouter.delete(
  '/bulk',
  hasPermission('jobPost', 'deleteAny'),
  JobPostController.bulkDeleteJobPosts
);

jobPostRouter.delete(
  '/:jobPostId',
  hasPermission('jobPost', 'deleteAny'),
  JobPostController.deleteJobPost
);

/* Approve / close / reopen */
jobPostRouter.patch(
  '/:jobPostId/status',
  hasPermission('jobPost', 'updateAny'),
  JobPostController.updateJobPostStatus
);

module.exports = jobPostRouter;
