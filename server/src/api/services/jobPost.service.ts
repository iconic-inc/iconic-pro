/* src/services/job-post.service.ts
   -------------------------------------------------------------
   Secure business logic for JobPost CRUD (Admin & Spa‑Owner)
*/

import { JobPostModel } from '../models/jobPost.model';
import { SpaOwnerModel } from '../models/spaOwner.model';
import { BadRequestError, NotFoundError, ForbiddenError } from '../core/errors';
import { getReturnData, getReturnList } from '../utils';
import { IResponseList } from '../interfaces/response.interface';
import { IJobPost } from '../interfaces/jobPost.interface';

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

    const docs = await JobPostModel.find(filter)
      .populate('jpo_spa', 'sp_name')
      .populate('jpo_owner', 'spo_user')
      .skip((+page - 1) * +limit)
      .limit(+limit);
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

  static async createJobPost(body: any) {
    const post = await JobPostModel.create(body);
    return getReturnData(post);
  }

  static async getJobPostById(id: string) {
    const post = await JobPostModel.findById(id)
      .populate('jpo_spa', 'sp_name')
      .populate('jpo_owner', 'spo_user');
    if (!post) throw new NotFoundError('Job post not found');
    return getReturnData(post);
  }

  static async updateJobPost(id: string, body: any) {
    const updated = await JobPostModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
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

    const owner = await SpaOwnerModel.findOne(
      { spo_user: ownerUserId },
      'spo_spas'
    );
    if (
      !owner ||
      (!post.jpo_owner.toString() === owner.id &&
        !owner.spo_spas.includes(post.jpo_spa as any))
    )
      throw new ForbiddenError('Not your job post');
    return { owner, post };
  }

  static async listMyJobPosts(
    ownerUserId: string,
    query: any
  ): Promise<IResponseList<IJobPost>> {
    const owner = await SpaOwnerModel.findOne(
      { spo_user: ownerUserId },
      'spo_spas'
    );
    if (!owner) throw new NotFoundError('Owner profile not found');

    const docs = await JobPostModel.find({
      $or: [{ jpo_owner: owner._id }, { jpo_spa: { $in: owner.spo_spas } }],
    })
      .skip(((query.page || 1) - 1) * (query.limit || 20))
      .limit(query.limit || 20);
    const total = await JobPostModel.countDocuments({
      $or: [{ jpo_owner: owner._id }, { jpo_spa: { $in: owner.spo_spas } }],
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

  static async createMyJobPost(ownerUserId: string, body: any) {
    // verify spaId belongs to owner
    const owner = await SpaOwnerModel.findOne(
      { spo_user: ownerUserId },
      'spo_spas'
    );
    if (!owner) throw new NotFoundError('Owner profile not found');
    if (!owner.spo_spas.map(String).includes(body.jpo_spa))
      throw new ForbiddenError('You do not own this spa');

    const post = await JobPostModel.create({
      ...body,
      jpo_owner: owner._id,
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
