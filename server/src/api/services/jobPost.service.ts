/* src/services/job-post.service.ts
   -------------------------------------------------------------
   Secure business logic for JobPost CRUD (Admin & Spa‑Owner)
*/

import { JobPostModel } from '../models/jobPost.model';
import { SpaOwnerModel } from '../models/spaOwner.model';
import { BadRequestError, NotFoundError, ForbiddenError } from '../core/errors';
import { formatAttributeName, getReturnData, getReturnList } from '../utils';
import { IResponseList } from '../interfaces/response.interface';
import { IJobPost, IJobPostAttrs } from '../interfaces/jobPost.interface';
import { SpaOwnerService } from './spaOwner.service';
import { SpaService } from './spa.service';
import mongoose, { isValidObjectId } from 'mongoose';
import { JOB_POST, SPA, SPA_OWNER, USER } from '../constants';

const VALID_STATUS = ['draft', 'active', 'closed'];

export class JobPostService {
  /* ──────────────── ADMIN METHODS ──────────────── */

  static async listJobPosts(query: {
    page?: number;
    limit?: number;
    status?: string;
    spaId?: string;
    keyword?: string;
  }): Promise<IResponseList<IJobPost>> {
    const { page = 1, limit = 20, status, spaId, keyword } = query;
    const filter: any = {};
    if (status) filter.jpo_status = status;
    if (spaId) filter.jpo_spa = spaId;
    if (keyword) filter.$text = { $search: keyword };

    const docs = await JobPostModel.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: SPA.COLLECTION_NAME,
          localField: 'jpo_spa',
          foreignField: '_id',
          as: 'spa',
        },
      },
      {
        $unwind: { path: '$spa', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: SPA_OWNER.COLLECTION_NAME,
          localField: 'jpo_owner',
          foreignField: '_id',
          as: 'jpo_owner',
        },
      },
      {
        $unwind: '$jpo_owner',
      },
      {
        $lookup: {
          from: USER.COLLECTION_NAME,
          localField: 'jpo_owner.spo_user',
          foreignField: '_id',
          as: 'jpo_owner.spo_user',
        },
      },
      {
        $unwind: '$jpo_owner.spo_user',
      },
      {
        $addFields: {
          jpo_title: { $ifNull: ['$jpo_title', ''] },
          jpo_description: { $ifNull: ['$jpo_description', ''] },
          jpo_status: { $ifNull: ['$jpo_status', ''] },
        },
      },
      {
        $project: {
          jpo_title: 1,
          jpo_description: 1,
          jpo_status: 1,
          jpo_spa: '$spa.sp_name',
          jpo_owner: {
            id: '$jpo_owner._id',
            spo_user: {
              id: '$jpo_owner.spo_user._id',
              usr_email: '$jpo_owner.spo_user.usr_email',
              usr_firstName: '$jpo_owner.spo_user.usr_firstName',
              usr_lastName: '$jpo_owner.spo_user.usr_lastName',
              usr_msisdn: '$jpo_owner.spo_user.usr_msisdn',
            },
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $skip: (page - 1) * +limit,
      },
      {
        $limit: +limit,
      },
    ]);
    const total = await JobPostModel.countDocuments(filter);

    return {
      data: getReturnList(docs) as IJobPost[],
      pagination: {
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / +limit),
      },
    };
  }

  static async createJobPost(body: IJobPostAttrs) {
    const post = await JobPostModel.build(body);
    return getReturnData(post);
  }

  static async getJobPostById(id: string) {
    const post = await JobPostModel.findById(id)
      .populate('jpo_spa', 'sp_name')
      .populate({
        path: 'jpo_owner',
        select: 'spo_user',
        populate: {
          path: 'spo_user',
          select: 'usr_email usr_firstName usr_lastName usr_msisdn',
        },
      });
    if (!post) throw new NotFoundError('Job post not found');
    return getReturnData(post);
  }

  static async updateJobPost(id: string, body: any) {
    const updated = await JobPostModel.findByIdAndUpdate(
      id,
      formatAttributeName({ ...body, owner: undefined }, JOB_POST.PREFIX),
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updated) throw new NotFoundError('Job post not found');
    return getReturnData(updated);
  }

  static async deleteJobPost(id: string) {
    const del = await JobPostModel.findByIdAndUpdate(
      id,
      { jpo_status: 'closed' },
      { new: true }
    );
    if (!del) throw new NotFoundError('Job post not found');
    return getReturnData(del);
  }

  static async bulkDeleteJobPosts(ids: string[]) {
    // validate input
    if (
      !ids ||
      !Array.isArray(ids) ||
      ids.length === 0 ||
      ids.some((id) => !isValidObjectId(id))
    )
      throw new BadRequestError('Invalid job post IDs');

    // delete job posts
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const deleted = await JobPostModel.updateMany(
        { _id: { $in: ids } },
        { jpo_status: 'closed' }
      ).session(session);
      if (deleted.modifiedCount === 0)
        throw new NotFoundError('No job posts found to delete');

      await session.commitTransaction();
      return getReturnData(deleted);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestError('Failed to delete job posts');
    } finally {
      session.endSession();
    }
  }

  static async bulkHardDeleteJobPosts(ids: string[]) {
    // validate input
    if (
      !ids ||
      !Array.isArray(ids) ||
      ids.length === 0 ||
      ids.some((id) => !isValidObjectId(id))
    )
      throw new BadRequestError('Invalid job post IDs');

    // hard delete job posts
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const deleted = await JobPostModel.deleteMany({
        _id: { $in: ids },
      }).session(session);
      if (deleted.deletedCount === 0)
        throw new NotFoundError('No job posts found to delete');

      await session.commitTransaction();
      return getReturnData(deleted);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestError('Failed to delete job posts');
    } finally {
      session.endSession();
    }
  }

  static async updateJobPostStatus(id: string, status: string) {
    if (!VALID_STATUS.includes(status))
      throw new BadRequestError('Invalid status value');
    const up = await JobPostModel.findByIdAndUpdate(
      id,
      { jpo_status: status },
      { new: true }
    );
    if (!up) throw new NotFoundError('Job post not found');
    return getReturnData(up);
  }

  /* ──────────────── SPA‑OWNER METHODS ──────────────── */

  /** helper: ensure user owns spa/job‑post */
  private static async assertOwnership(ownerUserId: string, postId: string) {
    const post = await JobPostModel.findById(postId, 'jpo_spa jpo_owner');
    if (!post) throw new NotFoundError('Job post not found');

    const owner = await SpaOwnerModel.findOne({ spo_user: ownerUserId });
    if (!owner || !post.jpo_owner.toString() === owner.id)
      throw new ForbiddenError('Not your job post');
    return { owner, post };
  }

  static async listMyJobPosts(
    ownerUserId: string,
    query: any
  ): Promise<IResponseList<IJobPost>> {
    const owner = await SpaOwnerModel.findOne({ spo_user: ownerUserId });
    if (!owner) throw new NotFoundError('Owner profile not found');

    const docs = await JobPostModel.find({
      jpo_owner: owner._id,
    })
      .skip(((query.page || 1) - 1) * (query.limit || 20))
      .limit(query.limit || 20);
    const total = await JobPostModel.countDocuments({
      jpo_owner: owner._id,
    });

    return {
      data: getReturnList(docs) as IJobPost[],
      pagination: {
        total,
        page: query.page || 1,
        limit: query.limit || 20,
        totalPages: Math.ceil(total / (query.limit || 20)),
      },
    };
  }

  static async createMyJobPost(ownerUserId: string, body: IJobPostAttrs) {
    // verify spaId belongs to owner
    const owner = await SpaOwnerService.getOwnerByUserId(ownerUserId);
    if (!owner) throw new NotFoundError('Owner profile not found');
    if (body.spa) {
      const spa = await SpaService.getMySpaById(ownerUserId, body.spa);
      if (!spa) throw new ForbiddenError('You do not own this spa');
    }

    const post = await JobPostModel.create({
      ...body,
      jpo_owner: owner._id,
      jpo_spa: body.spa,
    });
    return getReturnData(post);
  }

  static async getMyJobPostById(ownerUserId: string, postId: string) {
    const { post } = await this.assertOwnership(ownerUserId, postId);
    return getReturnData(post);
  }

  static async updateMyJobPost(ownerUserId: string, postId: string, body: any) {
    await this.assertOwnership(ownerUserId, postId);
    const updated = await JobPostModel.findByIdAndUpdate(postId, body, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new NotFoundError('Job post not found');

    return getReturnData(updated);
  }

  static async deleteMyJobPost(ownerUserId: string, postId: string) {
    await this.assertOwnership(ownerUserId, postId);
    const del = await JobPostModel.findByIdAndUpdate(
      postId,
      { jpo_status: 'closed' },
      { new: true }
    );
    if (!del) throw new NotFoundError('Job post not found');
    return getReturnData(del);
  }

  static async updateMyJobPostStatus(
    ownerUserId: string,
    postId: string,
    status: string
  ) {
    if (!VALID_STATUS.includes(status))
      throw new BadRequestError('Invalid status');
    await this.assertOwnership(ownerUserId, postId);
    const up = await JobPostModel.findByIdAndUpdate(
      postId,
      { jpo_status: status },
      { new: true }
    );
    if (!up) throw new NotFoundError('Job post not found');
    return getReturnData(up);
  }

  static async listPublicJobPosts(
    query: any
  ): Promise<IResponseList<IJobPost>> {
    // force status=active
    return this.listJobPosts({ ...query, status: 'active' });
  }

  static async getPublicJobPostById(id: string) {
    const post = await JobPostModel.findOne({
      _id: id,
      jpo_status: 'active',
    }).populate('jpo_spa', 'sp_name');
    if (!post) throw new NotFoundError('Job post not found');
    return getReturnData(post);
  }
}
