/* src/services/review.service.ts
   ------------------------------------------------------------
   Secure business logic for Review moderation / CRUD
*/

import { Types } from 'mongoose';
import { ReviewModel } from '../models/review.model';
import { SpaModel } from '../models/spa.model';
import { SpaOwnerModel } from '../models/spaOwner.model';
import { BadRequestError, NotFoundError, ForbiddenError } from '../core/errors';
import { getReturnData, getReturnList } from '../utils';
import { IResponseList } from '../interfaces/response.interface';
import { IReview } from '../interfaces/review.interface';

/* ─────────────────────────────────────────────────────────────
   ADMIN FUNCTIONS
   ────────────────────────────────────────────────────────────*/
export class ReviewService {
  static async listReviews(query: {
    page?: number;
    limit?: number;
    status?: 'approved' | 'pending';
    spaId?: string;
  }): Promise<IResponseList<IReview>> {
    const { page = 1, limit = 20, status, spaId } = query;
    const filter: any = {};
    if (status === 'approved') filter.rv_isApproved = true;
    if (status === 'pending') filter.rv_isApproved = false;
    if (spaId) filter.rv_spa = spaId;

    const docs = await ReviewModel.find(filter)
      .populate('rv_spa', 'sp_name')
      .populate('rv_author', 'usr_email')
      .skip((+page - 1) * +limit)
      .limit(+limit);
    const total = await ReviewModel.countDocuments(filter);

    return {
      data: getReturnList(docs) as IReview[],
      pagination: {
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / +limit),
      },
    };
  }

  static async getReviewById(reviewId: string) {
    const doc = await ReviewModel.findById(reviewId)
      .populate('rv_spa', 'sp_name')
      .populate('rv_author', 'usr_email');
    if (!doc) throw new NotFoundError('Review not found');
    return getReturnData(doc);
  }

  static async moderateReview(reviewId: string, approve: boolean) {
    const updated = await ReviewModel.findByIdAndUpdate(
      reviewId,
      { rv_isApproved: approve },
      { new: true }
    );
    if (!updated) throw new NotFoundError('Review not found');
    // update aggregate rating
    await (SpaModel as any).updateAggregateRating(updated.rv_spa);
    return getReturnData(updated);
  }

  static async deleteReview(reviewId: string) {
    const del = await ReviewModel.findByIdAndDelete(reviewId);
    if (!del) throw new NotFoundError('Review not found');
    await (SpaModel as any).updateAggregateRating(del.rv_spa);
    return getReturnData({ id: reviewId });
  }

  /* ──────────────────────────────────────────────────────────
     HELPER: ASSERT OWNERSHIP (spa‑owner)
     ───────────────────────────────────────────────────────── */
  private static async assertOwner(ownerUserId: string, reviewId: string) {
    const review = await ReviewModel.findById(reviewId, 'rv_spa');
    if (!review) throw new NotFoundError('Review not found');

    const owner = await SpaOwnerModel.findOne({
      spo_user: ownerUserId,
      spo_spas: review.rv_spa,
    });
    if (!owner) throw new ForbiddenError('Not your spa');
    return review;
  }

  /* ──────────────────────────────────────────────────────────
     SPA‑OWNER FUNCTIONS
     ───────────────────────────────────────────────────────── */
  static async listOwnerReviews(
    ownerUserId: string,
    query: any
  ): Promise<IResponseList<IReview>> {
    const owner = await SpaOwnerModel.findOne(
      { spo_user: ownerUserId },
      'spo_spas'
    );
    if (!owner) throw new NotFoundError('Owner profile not found');

    const docs = await ReviewModel.find({ rv_spa: { $in: owner.spo_spas } })
      .populate('rv_spa', 'sp_name')
      .populate('rv_author', 'usr_email')
      .skip(((query.page || 1) - 1) * (query.limit || 20))
      .limit(query.limit || 20);
    const total = await ReviewModel.countDocuments({
      rv_spa: { $in: owner.spo_spas },
    });

    return {
      data: getReturnList(docs) as IReview[],
      pagination: {
        total,
        page: query.page || 1,
        limit: query.limit || 20,
        totalPages: Math.ceil(total / (query.limit || 20)),
      },
    };
  }

  static async getOwnerReviewById(ownerUserId: string, reviewId: string) {
    await this.assertOwner(ownerUserId, reviewId);
    return this.getReviewById(reviewId);
  }

  static async replyToReview(
    ownerUserId: string,
    reviewId: string,
    reply: string
  ) {
    if (!reply) throw new BadRequestError('Reply text required');
    const review = await this.assertOwner(ownerUserId, reviewId);

    (review as any).rv_reply = {
      text: reply,
      repliedAt: new Date(),
    };
    await review.save();
    return getReturnData(review);
  }

  static async toggleVisibility(
    ownerUserId: string,
    reviewId: string,
    hide: boolean
  ) {
    await this.assertOwner(ownerUserId, reviewId);
    const updated = await ReviewModel.findByIdAndUpdate(
      reviewId,
      { rv_hidden: hide },
      { new: true }
    );
    if (!updated) throw new NotFoundError('Review not found');
    return getReturnData(updated);
  }

  /* ──────────────────────────────────────────────────────────
     CLIENT FUNCTIONS
     ───────────────────────────────────────────────────────── */
  static async createReview(userId: string, spaId: string, body: any) {
    // ensure spa exists & approved
    const spa = await SpaModel.findOne({ _id: spaId, sp_status: 'approved' });
    if (!spa) throw new NotFoundError('Spa not found or not approved');

    // one review per user per spa
    const exists = await ReviewModel.findOne({
      rv_spa: spaId,
      rv_author: userId,
    });
    if (exists) throw new BadRequestError('You already reviewed this spa');

    const doc = await ReviewModel.create({
      rv_spa: spaId,
      rv_author: userId,
      rv_rating: body.rating,
      rv_content: body.content,
      rv_images: body.imageIds || [],
      rv_isApproved: false,
    });

    return getReturnData(doc);
  }

  static async listClientReviews(
    userId: string,
    query: any
  ): Promise<IResponseList<IReview>> {
    const docs = await ReviewModel.find({ rv_author: userId })
      .populate('rv_spa', 'sp_name')
      .skip(((query.page || 1) - 1) * (query.limit || 20))
      .limit(query.limit || 20);
    const total = await ReviewModel.countDocuments({
      rv_author: userId,
    });

    return {
      data: getReturnList(docs) as IReview[],
      pagination: {
        total,
        page: query.page || 1,
        limit: query.limit || 20,
        totalPages: Math.ceil(total / (query.limit || 20)),
      },
    };
  }

  static async getClientReviewById(userId: string, reviewId: string) {
    const doc = await ReviewModel.findOne({
      _id: reviewId,
      rv_author: userId,
    });
    if (!doc) throw new NotFoundError('Review not found');
    return getReturnData(doc);
  }

  static async updateClientReview(userId: string, reviewId: string, body: any) {
    const updated = await ReviewModel.findOneAndUpdate(
      { _id: reviewId, rv_author: userId },
      { rv_rating: body.rating, rv_content: body.content },
      { new: true, runValidators: true }
    );
    if (!updated) throw new NotFoundError('Review not found');
    updated.rv_isApproved = false; // re‑moderate
    await updated.save();
    return getReturnData(updated);
  }

  static async deleteClientReview(userId: string, reviewId: string) {
    const del = await ReviewModel.findOneAndDelete({
      _id: reviewId,
      rv_author: userId,
    });
    if (!del) throw new NotFoundError('Review not found');
    return getReturnData({ _id: reviewId });
  }
}
