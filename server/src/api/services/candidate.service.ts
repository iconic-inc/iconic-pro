/* src/services/candidate.service.ts
   ----------------------------------------------------
   Business‑logic for Candidate / CV management
   Uses helpers: getReturnData() & getReturnList()
*/

import { CandidateModel } from '../models/candidate.model';
import { BadRequestError, NotFoundError } from '../core/errors';
import { getReturnData, getReturnList } from '../utils';
import { IResponseList } from '../interfaces/response.interface';
import { ICandidate } from '../interfaces/candidate.constant';

export class CandidateService {
  /* ──────────────── ADMIN METHODS ──────────────── */

  static async listCandidates(query: {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
  }): Promise<IResponseList<ICandidate>> {
    const { page = 1, limit = 20, keyword, status } = query;
    const filter: any = {};
    if (status) filter.can_status = status;
    if (keyword) filter.$text = { $search: keyword };

    const docs = await CandidateModel.find(filter)
      .populate('can_user', 'usr_email usr_firstName')
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await CandidateModel.countDocuments(filter);

    return {
      data: getReturnList(docs) as ICandidate[],
      pagination: {
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / +limit),
      },
    };
  }

  static async createCandidate(body: any) {
    const cv = await CandidateModel.create(body);
    return getReturnData(cv);
  }

  static async getCandidateById(id: string) {
    const cv = await CandidateModel.findById(id).populate(
      'can_user',
      'usr_email usr_firstName usr_lastName'
    );
    if (!cv) throw new NotFoundError('Candidate profile not found');
    return getReturnData(cv);
  }

  static async updateCandidate(id: string, body: any) {
    const updated = await CandidateModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new NotFoundError('Candidate profile not found');
    return getReturnData(updated);
  }

  static async deleteCandidate(id: string) {
    const deleted = await CandidateModel.findByIdAndUpdate(
      id,
      { can_status: 'hidden' },
      { new: true }
    );
    if (!deleted) throw new NotFoundError('Candidate profile not found');
    return getReturnData(deleted);
  }

  /* ───────────── CLIENT (SELF‑SERVICE) ─────────────── */

  static async createMyProfile(userId: string, body: any) {
    const exists = await CandidateModel.findOne({ can_user: userId });
    if (exists)
      throw new BadRequestError('Profile already exists – update instead');

    const cv = await CandidateModel.create({ ...body, can_user: userId });
    return getReturnData(cv);
  }

  static async getMyProfile(userId: string) {
    const cv = await CandidateModel.findOne({ can_user: userId });
    if (!cv) throw new NotFoundError('You have no candidate profile yet');
    return getReturnData(cv);
  }

  static async updateMyProfile(userId: string, body: any) {
    const updated = await CandidateModel.findOneAndUpdate(
      { can_user: userId },
      body,
      { new: true, runValidators: true }
    );
    if (!updated) throw new NotFoundError('Profile not found');
    return getReturnData(updated);
  }

  static async deleteMyProfile(userId: string) {
    const deleted = await CandidateModel.findOneAndUpdate(
      { can_user: userId },
      { can_status: 'hidden' },
      { new: true }
    );
    if (!deleted) throw new NotFoundError('Profile not found');
    return getReturnData(deleted);
  }
}
