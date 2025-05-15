/* 2 ▸ SPA‑OWNER REVIEW ROUTES – src/routes/owner/review.route.ts
   ------------------------------------------------------------- */
import { Router } from 'express';
import { ReviewController } from '../../controllers/review.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';

const ownerReviewRouter = Router();
ownerReviewRouter.use(authenticationV2);

/* Owner sees reviews for spas they manage */
ownerReviewRouter.get(
  '/',
  hasPermission('review', 'readOwn'),
  ReviewController.listMySpaReviews
);

ownerReviewRouter.get(
  '/:reviewId',
  hasPermission('review', 'readOwn'),
  ReviewController.getMySpaReviewById
);

/* Owner response / hide / unhide */
ownerReviewRouter.post(
  '/:reviewId/reply',
  hasPermission('review', 'updateOwn'),
  ReviewController.replyToReview
);

ownerReviewRouter.patch(
  '/:reviewId/hide',
  hasPermission('review', 'updateOwn'),
  ReviewController.hideReview
);

ownerReviewRouter.patch(
  '/:reviewId/unhide',
  hasPermission('review', 'updateOwn'),
  ReviewController.unhideReview
);

module.exports = ownerReviewRouter;
