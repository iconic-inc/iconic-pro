import { Router } from 'express';
import { JobApplicationController } from '../../controllers/jobApplication.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';

const ownerJobAppRouter = Router();
ownerJobAppRouter.use(authenticationV2);

/* List applications for ALL spas this owner manages */
ownerJobAppRouter.get(
  '/',
  hasPermission('jobApplication', 'readOwn'),
  JobApplicationController.listMyApplications
);

/* Read single application (ownership enforced in service) */
ownerJobAppRouter.get(
  '/:applicationId',
  hasPermission('jobApplication', 'readOwn'),
  JobApplicationController.getMyApplicationById
);

/* Update pipeline step (shortlist → interview → hired …) */
ownerJobAppRouter.patch(
  '/:applicationId/status',
  hasPermission('jobApplication', 'updateOwn'),
  JobApplicationController.updateMyApplicationStatus
);

module.exports = ownerJobAppRouter;
