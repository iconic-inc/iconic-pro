/* src/controllers/job-application.controller.ts */
import { Request, Response, NextFunction } from 'express';
import { JobApplicationService } from '../services/jobApplication.service';
import { OK } from '../core/success.response';

export class JobApplicationController {
  /* ──────────────── ADMIN HANDLERS ──────────────── */

  static async listApplications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'List of job applications',
      metadata: await JobApplicationService.listApplications(req.query),
    });
  }

  static async getApplicationById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Application details',
      metadata: await JobApplicationService.getApplicationById(
        req.params.applicationId
      ),
    });
  }

  static async updateApplicationStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Application status updated successfully',
      metadata: await JobApplicationService.updateApplicationStatus(
        req.params.applicationId,
        req.body.status
      ),
    });
  }

  static async deleteApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Application deleted successfully',
      metadata: await JobApplicationService.deleteApplication(
        req.params.applicationId
      ),
    });
  }

  /* ─────────────── SPA‑OWNER HANDLERS ─────────────── */

  static async listMyApplications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'List of applications for my spas',
      metadata: await JobApplicationService.listOwnerApplications(
        req.user.userId,
        req.query
      ),
    });
  }

  static async getMyApplicationById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Application details',
      metadata: await JobApplicationService.getOwnerApplicationById(
        req.user.userId,
        req.params.applicationId
      ),
    });
  }

  static async updateMyApplicationStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Application status updated successfully',
      metadata: await JobApplicationService.updateOwnerApplicationStatus(
        req.user.userId,
        req.params.applicationId,
        req.body.status
      ),
    });
  }

  /* ─────────────── CLIENT HANDLERS ─────────────── */

  static async applyJob(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Applied to job successfully',
      metadata: await JobApplicationService.applyJob(
        req.user.userId,
        req.params.jobPostId,
        req.body.message
      ),
    });
  }

  static async listMyApplicationsClient(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'List of my applications',
      metadata: await JobApplicationService.listClientApplications(
        req.user.userId,
        req.query
      ),
    });
  }

  static async getMyApplicationClient(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Application details',
      metadata: await JobApplicationService.getClientApplicationById(
        req.user.userId,
        req.params.applicationId
      ),
    });
  }

  static async deleteMyApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Application withdrawn successfully',
      metadata: await JobApplicationService.deleteClientApplication(
        req.user.userId,
        req.params.applicationId
      ),
    });
  }
}
