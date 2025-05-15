/* 2 ▸ SPA‑OWNER ROUTES – src/routes/owner/job-post.route.ts
   -------------------------------------------------------- */
import { Router } from 'express';
import { JobPostController } from '../../controllers/jobPost.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';

const ownerJobPostRouter = Router();

/* 🔐 Require JWT for owner job‑post routes */
ownerJobPostRouter.use(authenticationV2);

/* List all job posts for spas I own */
ownerJobPostRouter.get(
  '/',
  hasPermission('jobPost', 'readOwn'),
  JobPostController.listMyJobPosts
);

/* Create new job post for one of my spas */
ownerJobPostRouter.post(
  '/',
  hasPermission('jobPost', 'createOwn'),
  JobPostController.createMyJobPost
);

/* Read / update / delete a single post (ownership enforced in service) */
ownerJobPostRouter.get(
  '/:jobPostId',
  hasPermission('jobPost', 'readOwn'),
  JobPostController.getMyJobPostById
);

ownerJobPostRouter.put(
  '/:jobPostId',
  hasPermission('jobPost', 'updateOwn'),
  JobPostController.updateMyJobPost
);

ownerJobPostRouter.delete(
  '/:jobPostId',
  hasPermission('jobPost', 'deleteOwn'),
  JobPostController.deleteMyJobPost
);

/* Close or reopen my post (draft → active → closed) */
ownerJobPostRouter.patch(
  '/:jobPostId/status',
  hasPermission('jobPost', 'updateOwn'),
  JobPostController.updateMyJobPostStatus
);

module.exports = ownerJobPostRouter;
