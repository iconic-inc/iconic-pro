import { Router } from 'express';
import { JobApplicationController } from '../../controllers/jobApplication.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';

const clientJobAppRouter = Router();
clientJobAppRouter.use(authenticationV2);

/* Apply to a job post */
clientJobAppRouter.post(
  '/jobs/:jobPostId',
  hasPermission('jobApplication', 'createOwn'),
  JobApplicationController.applyJob
);

/* List my applications */
clientJobAppRouter.get(
  '/',
  hasPermission('jobApplication', 'readOwn'),
  JobApplicationController.listMyApplicationsClient
);

/* View single application */
clientJobAppRouter.get(
  '/:applicationId',
  hasPermission('jobApplication', 'readOwn'),
  JobApplicationController.getMyApplicationClient
);

/* Withdraw / delete my application */
clientJobAppRouter.delete(
  '/:applicationId',
  hasPermission('jobApplication', 'deleteOwn'),
  JobApplicationController.deleteMyApplication
);

module.exports = clientJobAppRouter;
