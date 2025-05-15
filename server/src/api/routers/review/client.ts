/* 3 ▸ CLIENT REVIEW ROUTES – src/routes/client/review.route.ts
   ----------------------------------------------------------- */
import { Router } from 'express';
import { ReviewController } from '../../controllers/review.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';

const clientReviewRouter = Router();
clientReviewRouter.use(authenticationV2);

/* Create a new review for a spa */
clientReviewRouter.post(
  '/spas/:spaId',
  hasPermission('review', 'createOwn'),
  ReviewController.createReview
);

/* Manage own reviews */
clientReviewRouter.get(
  '/',
  hasPermission('review', 'readOwn'),
  ReviewController.listMyReviews
);

clientReviewRouter.get(
  '/:reviewId',
  hasPermission('review', 'readOwn'),
  ReviewController.getMyReviewById
);

clientReviewRouter.put(
  '/:reviewId',
  hasPermission('review', 'updateOwn'),
  ReviewController.updateMyReview
);

clientReviewRouter.delete(
  '/:reviewId',
  hasPermission('review', 'deleteOwn'),
  ReviewController.deleteMyReview
);

module.exports = clientReviewRouter;
