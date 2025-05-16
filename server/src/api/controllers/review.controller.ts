/* src/controllers/review.controller.ts */
import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';
import { OK } from '../core/success.response';

export class ReviewController {
  /* ──────────────── ADMIN HANDLERS ──────────────── */

  static async listReviews(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'List of reviews',
      metadata: await ReviewService.listReviews(req.query),
    });
  }

  static async getReviewById(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Review details',
      metadata: await ReviewService.getReviewById(req.params.reviewId),
    });
  }

  static async approveReview(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Review approved',
      metadata: await ReviewService.moderateReview(req.params.reviewId, true),
    });
  }

  static async rejectReview(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Review rejected',
      metadata: await ReviewService.moderateReview(req.params.reviewId, false),
    });
  }

  static async deleteReview(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Review deleted successfully',
      metadata: await ReviewService.deleteReview(req.params.reviewId),
    });
  }

  static async bulkHardDeleteReviews(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Reviews deleted successfully',
      metadata: await ReviewService.bulkHardDeleteReviews(req.body.reviewIds),
    });
  }

  /* ─────────────── SPA‑OWNER HANDLERS ─────────────── */

  static async listMySpaReviews(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'List of reviews for my spas',
      metadata: await ReviewService.listOwnerReviews(
        req.user.userId,
        req.query
      ),
    });
  }

  static async getMySpaReviewById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Review details',
      metadata: await ReviewService.getOwnerReviewById(
        req.user.userId,
        req.params.reviewId
      ),
    });
  }

  static async replyToReview(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Reply posted successfully',
      metadata: await ReviewService.replyToReview(
        req.user.userId,
        req.params.reviewId,
        req.body.reply
      ),
    });
  }

  static async hideReview(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Review hidden',
      metadata: await ReviewService.toggleVisibility(
        req.user.userId,
        req.params.reviewId,
        true
      ),
    });
  }

  static async unhideReview(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Review unhidden',
      metadata: await ReviewService.toggleVisibility(
        req.user.userId,
        req.params.reviewId,
        false
      ),
    });
  }

  /* ─────────────── CLIENT HANDLERS ─────────────── */

  static async createReview(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Review created successfully',
      metadata: await ReviewService.createReview(
        req.user.userId,
        req.params.spaId,
        req.body
      ),
    });
  }

  static async listMyReviews(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'List of my reviews',
      metadata: await ReviewService.listClientReviews(
        req.user.userId,
        req.query
      ),
    });
  }

  static async getMyReviewById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Review details',
      metadata: await ReviewService.getClientReviewById(
        req.user.userId,
        req.params.reviewId
      ),
    });
  }

  static async updateMyReview(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Review updated successfully',
      metadata: await ReviewService.updateClientReview(
        req.user.userId,
        req.params.reviewId,
        req.body
      ),
    });
  }

  static async deleteMyReview(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Review deleted successfully',
      metadata: await ReviewService.deleteClientReview(
        req.user.userId,
        req.params.reviewId
      ),
    });
  }
}
