/* src/controllers/job-post.controller.ts */
import { Request, Response, NextFunction } from 'express';
import { JobPostService } from '../services/jobPost.service';
import { OK } from '../core/success.response';

export class JobPostController {
  /* ──────────────── ADMIN HANDLERS ──────────────── */

  static async listJobPosts(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'List of job posts',
      metadata: await JobPostService.listJobPosts(req.query),
    });
  }

  static async createJobPost(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Job post created successfully',
      metadata: await JobPostService.createJobPost(req.body),
    });
  }

  static async getJobPostById(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Job post details',
      metadata: await JobPostService.getJobPostById(req.params.jobPostId),
    });
  }

  static async updateJobPost(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Job post updated successfully',
      metadata: await JobPostService.updateJobPost(
        req.params.jobPostId,
        req.body
      ),
    });
  }

  static async deleteJobPost(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Job post deleted successfully',
      metadata: await JobPostService.deleteJobPost(req.params.jobPostId),
    });
  }

  static async updateJobPostStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Job post status updated successfully',
      metadata: await JobPostService.updateJobPostStatus(
        req.params.jobPostId,
        req.body.status
      ),
    });
  }

  /* ─────────────── SPA‑OWNER HANDLERS ─────────────── */

  static async listMyJobPosts(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'List of my job posts',
      metadata: await JobPostService.listMyJobPosts(req.user.userId, req.query),
    });
  }

  static async createMyJobPost(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Job post created successfully',
      metadata: await JobPostService.createMyJobPost(req.user.userId, req.body),
    });
  }

  static async getMyJobPostById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Job post details',
      metadata: await JobPostService.getMyJobPostById(
        req.user.userId,
        req.params.jobPostId
      ),
    });
  }

  static async updateMyJobPost(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Job post updated successfully',
      metadata: await JobPostService.updateMyJobPost(
        req.user.userId,
        req.params.jobPostId,
        req.body
      ),
    });
  }

  static async deleteMyJobPost(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Job post deleted successfully',
      metadata: await JobPostService.deleteMyJobPost(
        req.user.userId,
        req.params.jobPostId
      ),
    });
  }

  static async updateMyJobPostStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Job post status updated successfully',
      metadata: await JobPostService.updateMyJobPostStatus(
        req.user.userId,
        req.params.jobPostId,
        req.body.status
      ),
    });
  }

  static async listJobPostsPublic(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Public list of job posts',
      metadata: await JobPostService.listPublicJobPosts(req.query),
    });
  }

  static async getJobPostPublicById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Job post details',
      metadata: await JobPostService.getPublicJobPostById(req.params.jobPostId),
    });
  }
}
