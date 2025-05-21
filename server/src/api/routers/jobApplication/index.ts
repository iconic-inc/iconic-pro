import { Router } from 'express';
import { JobApplicationController } from '../../controllers/jobApplication.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';

const adminJobAppRouter = Router();
adminJobAppRouter.use(authenticationV2); // 🔐 JWT required

/* ── CRUD ANY (resource = "jobApplication") ── */
adminJobAppRouter.get(
  '/',
  hasPermission('jobApplication', 'readAny'),
  JobApplicationController.listApplications
);

adminJobAppRouter.get(
  '/:applicationId',
  hasPermission('jobApplication', 'readAny'),
  JobApplicationController.getApplicationById
);

/* Update status (shortlisted, interview, hired, rejected) */
adminJobAppRouter.patch(
  '/:applicationId/status',
  hasPermission('jobApplication', 'updateAny'),
  JobApplicationController.updateApplicationStatus
);

/* Hard / soft delete */
adminJobAppRouter.delete(
  '/:applicationId',
  hasPermission('jobApplication', 'deleteAny'),
  JobApplicationController.deleteApplication
);

module.exports = adminJobAppRouter;
