/* src/services/job-application.service.ts
   --------------------------------------------------------
   Business logic for JobApplication management
   Uses custom errors + getReturnData / getReturnList helpers
*/

import { JobApplicationModel } from '../models/jobApplication.model';
import { CandidateModel } from '../models/candidate.model';
import { JobPostModel } from '../models/jobPost.model';
import { SpaOwnerModel } from '../models/spaOwner.model';
import { BadRequestError, NotFoundError, ForbiddenError } from '../core/errors';
import { getReturnData, getReturnList } from '../utils';
import { IResponseList } from '../interfaces/response.interface';
import { IJobApp } from '../interfaces/jobApplication.interface';

const VALID_STATUSES = [
  'applied',
  'shortlisted',
  'interview',
  'hired',
  'rejected',
];

export class JobApplicationService {
  /* ──────────────── ADMIN ───────────────────────── */

  /** GET /admin/job-applications */
  static async listApplications(query: {
    page?: number;
    limit?: number;
    status?: string;
    spaId?: string;
  }): Promise<IResponseList<IJobApp>> {
    const { page = 1, limit = 20, status, spaId } = query;
    const filter: any = {};
    if (status) filter.jap_status = status;
    if (spaId)
      filter['jap_jobPost'] = {
        $in: await JobPostModel.find({ jpo_spa: spaId }).distinct('_id'),
      };

    const apps = await JobApplicationModel.find(filter)
      .populate([
        { path: 'jap_jobPost', select: 'jpo_title jpo_spa' },
        { path: 'jap_candidate', select: 'can_fullName can_user' },
      ])
      .skip((page - 1) * +limit)
      .limit(+limit);
    const total = await JobApplicationModel.countDocuments(filter);

    return {
      data: getReturnList(apps) as IJobApp[],
      pagination: {
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / +limit),
      },
    };
  }

  /** GET /admin/job-applications/:id */
  static async getApplicationById(id: string) {
    const app = await JobApplicationModel.findById(id).populate([
      { path: 'jap_jobPost', select: 'jpo_title jpo_spa' },
      { path: 'jap_candidate', select: 'can_fullName can_summary' },
    ]);
    if (!app) throw new NotFoundError('Application not found');
    return getReturnData(app);
  }

  /** PATCH /admin/job-applications/:id/status */
  static async updateApplicationStatus(id: string, status: string) {
    if (!VALID_STATUSES.includes(status))
      throw new BadRequestError('Invalid status value');

    const updated = await JobApplicationModel.findByIdAndUpdate(
      id,
      { jap_status: status },
      { new: true }
    );
    if (!updated) throw new NotFoundError('Application not found');
    return getReturnData(updated);
  }

  /** DELETE /admin/job-applications/:id */
  static async deleteApplication(id: string) {
    const deleted = await JobApplicationModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Application not found');
    return getReturnData(deleted);
  }

  /* ──────────────── SPA‑OWNER ───────────────────── */

  /** helper to assert owner owns the application via jobPost->spa */
  private static async assertOwnerApp(ownerUserId: string, appId: string) {
    const app = await JobApplicationModel.findById(appId).populate({
      path: 'jap_jobPost',
      select: 'jpo_spa',
    });
    if (!app) throw new NotFoundError('Application not found');

    const owner = await SpaOwnerModel.findOne({
      spo_user: ownerUserId,
      spo_spas: (app.jap_jobPost as any).jpo_spa,
    });
    if (!owner) throw new ForbiddenError('Not your application');
    return app;
  }

  static async listOwnerApplications(
    ownerUserId: string,
    query: any
  ): Promise<IResponseList<IJobApp>> {
    const owner = await SpaOwnerModel.findOne({ spo_user: ownerUserId });
    if (!owner) throw new NotFoundError('Owner profile not found');

    const filter = {
      jap_jobPost: {
        $in: await JobPostModel.find({
          jpo_spa: { $in: owner.spo_spas },
        }).distinct('_id'),
      },
    };
    const apps = await JobApplicationModel.find(filter)
      .populate('jap_candidate', 'can_fullName')
      .populate('jap_jobPost', 'jpo_title')
      .skip(((query.page || 1) - 1) * (query.limit || 20))
      .limit(query.limit || 20);
    const total = await JobApplicationModel.countDocuments(filter);

    return {
      data: getReturnList(apps) as IJobApp[],
      pagination: {
        total,
        page: +query.page,
        limit: +query.limit,
        totalPages: Math.ceil(total / +query.limit),
      },
    };
  }

  static async getOwnerApplicationById(ownerUserId: string, appId: string) {
    const app = await this.assertOwnerApp(ownerUserId, appId);
    return getReturnData(app);
  }

  static async updateOwnerApplicationStatus(
    ownerUserId: string,
    appId: string,
    status: string
  ) {
    if (!VALID_STATUSES.includes(status))
      throw new BadRequestError('Invalid status');

    await this.assertOwnerApp(ownerUserId, appId);
    const updated = await JobApplicationModel.findByIdAndUpdate(
      appId,
      { jap_status: status },
      { new: true }
    );
    if (!updated) throw new NotFoundError('Job application not found!');
    return getReturnData(updated);
  }

  /* ──────────────── CLIENT ─────────────────────── */

  /** POST /client/job-applications/jobs/:jobPostId */
  static async applyJob(userId: string, jobPostId: string, message?: string) {
    const candidate = await CandidateModel.findOne({ can_user: userId });
    if (!candidate)
      throw new BadRequestError('You must create a profile first');

    const jobPost = await JobPostModel.findById(jobPostId);
    if (!jobPost || jobPost.jpo_status !== 'active')
      throw new NotFoundError('Job post not available');

    // prevent duplicate apply
    const exists = await JobApplicationModel.findOne({
      jap_jobPost: jobPostId,
      jap_candidate: candidate.id,
    });
    if (exists) throw new BadRequestError('Already applied to this job');

    const app = await JobApplicationModel.create({
      jap_jobPost: jobPostId,
      jap_candidate: candidate.id,
      jap_message: message,
    });

    // increment applicant count
    await JobPostModel.findByIdAndUpdate(jobPostId, {
      $inc: { jpo_applicantCount: 1 },
    });

    return getReturnData(app);
  }

  /** GET /client/job-applications */
  static async listClientApplications(
    userId: string,
    query: any
  ): Promise<IResponseList<IJobApp>> {
    const candidate = await CandidateModel.findOne({ can_user: userId });
    if (!candidate) throw new NotFoundError('Profile not found');

    const apps = await JobApplicationModel.find({
      jap_candidate: candidate.id,
    })
      .populate('jap_jobPost', 'jpo_title')
      .skip(((query.page || 1) - 1) * (query.limit || 20))
      .limit(query.limit || 20);
    const total = await JobApplicationModel.countDocuments({
      jap_candidate: candidate.id,
    });

    return {
      data: getReturnList(apps) as IJobApp[],
      pagination: {
        total,
        page: +query.page,
        limit: +query.limit,
        totalPages: Math.ceil(total / +query.limit),
      },
    };
  }

  static async getClientApplicationById(userId: string, appId: string) {
    const candidate = await CandidateModel.findOne({ can_user: userId });
    if (!candidate) throw new NotFoundError('Profile not found');

    const app = await JobApplicationModel.findOne({
      _id: appId,
      jap_candidate: candidate.id,
    }).populate('jap_jobPost', 'jpo_title jpo_spa');
    if (!app) throw new NotFoundError('Application not found');

    return getReturnData(app);
  }

  static async deleteClientApplication(userId: string, appId: string) {
    const candidate = await CandidateModel.findOne({ can_user: userId });
    if (!candidate) throw new NotFoundError('Profile not found');

    const deleted = await JobApplicationModel.findOneAndDelete({
      _id: appId,
      jap_candidate: candidate.id,
    });
    if (!deleted) throw new NotFoundError('Application not found');

    return getReturnData({ id: appId });
  }
}
