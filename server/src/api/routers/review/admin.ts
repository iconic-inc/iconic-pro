/* 1 ▸ ADMIN REVIEW ROUTES – src/routes/admin/review.route.ts
   --------------------------------------------------------- */
import { Router } from 'express';
import { ReviewController } from '../../controllers/review.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';

const adminReviewRouter = Router();
adminReviewRouter.use(authenticationV2); // 🔐 JWT

/* Resource = "review", action = *Any */
adminReviewRouter.get(
  '/',
  hasPermission('review', 'readAny'),
  ReviewController.listReviews
);

adminReviewRouter.get(
  '/:reviewId',
  hasPermission('review', 'readAny'),
  ReviewController.getReviewById
);

adminReviewRouter.patch(
  '/:reviewId/approve',
  hasPermission('review', 'updateAny'),
  ReviewController.approveReview
);

adminReviewRouter.patch(
  '/:reviewId/reject',
  hasPermission('review', 'updateAny'),
  ReviewController.rejectReview
);

// bulk hard-delete
adminReviewRouter.delete(
  '/bulk/hard',
  hasPermission('spa', 'deleteAny'),
  ReviewController.bulkHardDeleteReviews // hard-delete
);

adminReviewRouter.delete(
  '/:reviewId',
  hasPermission('review', 'deleteAny'),
  ReviewController.deleteReview
);

module.exports = adminReviewRouter;
