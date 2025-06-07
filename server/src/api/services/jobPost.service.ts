/* src/services/job-post.service.ts
   -------------------------------------------------------------
   Secure business logic for JobPost CRUD (Admin & Spa‑Owner)
*/

import { JobPostModel } from '../models/jobPost.model';
import { SpaOwnerModel } from '../models/spaOwner.model';
import { BadRequestError, NotFoundError, ForbiddenError } from '../core/errors';
import { formatAttributeName, getReturnData, getReturnList } from '../utils';
import { IResponseList } from '../interfaces/response.interface';
import {
  IJobPost,
  IJobPostAttrs,
  IJobPostResponse,
} from '../interfaces/jobPost.interface';
import { SpaOwnerService } from './spaOwner.service';
import { SpaService } from './spa.service';
import mongoose, { isValidObjectId, Types } from 'mongoose';
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
    ownerId?: string;
    type?: string;
    salaryFrom?: string | number;
    salaryTo?: string | number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<IResponseList<IJobPost>> {
    const {
      page = 1,
      limit = 20,
      status,
      spaId,
      keyword,
      ownerId,
      sortBy,
      sortOrder,
    } = query;
    const filter: any = {};
    if (status) filter.jpo_status = status;
    if (spaId) filter.jpo_spa = spaId;
    if (keyword) filter.$text = { $search: keyword };
    if (ownerId && isValidObjectId(ownerId))
      filter.jpo_owner = new Types.ObjectId(ownerId);
    if (query.type) {
      const type = decodeURIComponent(query.type as string);
      const validTypes = Object.values(JOB_POST.TYPE);
      // type query is an string separated by commas or 'all'
      if (type === 'all') {
        filter.jpo_type = { $in: validTypes }; // assuming 'spa' and 'job' are valid types
      } else if (type.includes(',')) {
        filter.jpo_type = {
          $in: type.split(',').map((t: string) => t.trim()),
        };
      } else if (validTypes.includes(type as any)) filter.jpo_type = type;
    }
    if (query.salaryFrom || query.salaryTo) {
      filter.jpo_salaryFrom = { $gte: +(query.salaryFrom || 0) };
      filter.jpo_salaryTo = {
        $lte: +(query.salaryTo || Number.MAX_SAFE_INTEGER),
      };
    }
    // sort by createdAt or updatedAt if sortBy is not provided
    const sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1; // default sort by createdAt descending
    }

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
        $sort: sort,
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
          jpo_salaryFrom: 1,
          jpo_salaryTo: 1,
          jpo_type: 1,
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
    return getReturnData(post) as any as IJobPostResponse;
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
    const del = await JobPostModel.findByIdAndDelete(id);
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
    const post = await this.getJobPostById(postId);
    if (!post) throw new NotFoundError('Job post not found');

    // const owner = await SpaOwnerModel.findOne({ spo_user: ownerUserId });
    if (post.jpo_owner.spo_user.id !== ownerUserId)
      throw new ForbiddenError('Not your job post');
    return { post };
  }

  static async listMyJobPosts(
    ownerUserId: string,
    query: any
  ): Promise<IResponseList<IJobPost>> {
    const owner = await SpaOwnerModel.findOne({ spo_user: ownerUserId });
    if (!owner) throw new NotFoundError('Owner profile not found');

    return await this.listJobPosts({
      ...query,
      ownerId: owner.id,
    });
  }

  static async createMyJobPost(ownerUserId: string, body: IJobPostAttrs) {
    // verify spaId belongs to owner
    const owner = await SpaOwnerService.getOwnerByUserId(ownerUserId);
    if (!owner) throw new NotFoundError('Owner profile not found');
    if (body.spa) {
      const spa = await SpaService.getMySpaById(ownerUserId, body.spa);
      if (!spa) throw new ForbiddenError('You do not own this spa');
    }

    const post = await JobPostModel.build({
      ...body,
      owner: owner.id,
    });
    return getReturnData(post);
  }

  static async getMyJobPostById(ownerUserId: string, postId: string) {
    const { post } = await this.assertOwnership(ownerUserId, postId);
    return post;
  }

  static async updateMyJobPost(ownerUserId: string, postId: string, body: any) {
    await this.assertOwnership(ownerUserId, postId);
    return await this.updateJobPost(postId, body);
  }

  static async deleteMyJobPost(ownerUserId: string, postId: string) {
    await this.assertOwnership(ownerUserId, postId);
    return this.deleteJobPost(postId);
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
