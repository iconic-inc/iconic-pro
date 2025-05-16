/* src/services/spa.service.ts
   --------------------------------------------------
   Business‑logic for Spa management (Admin & Owner)
*/

import mongoose, { ClientSession, isValidObjectId, Types } from 'mongoose';
import { SpaModel } from '../models/spa.model';
import { SpaOwnerModel } from '../models/spaOwner.model';
import { ForbiddenError, NotFoundError } from '../core/errors';
import { ISpa, ISpaAttrs, ISpaModel } from '../interfaces/spa.interface';
import {
  formatAttributeName,
  getReturnData,
  getReturnList,
} from '@utils/index';
import slugify from 'slugify';
import { SPA, SPA_OWNER, USER } from '../constants';
import { IResponseList } from '../interfaces/response.interface';

export class SpaService {
  /* ──────────────── ADMIN METHODS ──────────────── */

  /** GET /admin/spas */
  static async listSpas(query: {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<IResponseList<ISpa>> {
    const {
      page = 1,
      limit = 20,
      keyword,
      status,
      category,
      sortBy,
      sortOrder,
    } = query;
    const filter: any = {};

    if (status) filter.sp_status = status;
    if (category) filter.sp_categories = category;
    if (keyword) filter.$text = { $search: keyword };

    const spas = await SpaModel.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: SPA_OWNER.COLLECTION_NAME,
          localField: 'sp_owner',
          foreignField: '_id',
          as: 'sp_owner',
        },
      },
      {
        $unwind: '$sp_owner',
      },
      {
        $lookup: {
          from: USER.COLLECTION_NAME,
          localField: 'sp_owner.spo_user',
          foreignField: '_id',
          as: 'sp_owner.spo_user',
        },
      },
      { $unwind: '$sp_owner.spo_user' },
      {
        $project: {
          sp_name: 1,
          sp_slug: 1,
          sp_address: 1,
          sp_phone: 1,
          sp_email: 1,
          sp_isFeatured: 1,
          sp_averageRating: 1,
          sp_totalReviews: 1,
          sp_status: 1,
          sp_owner: {
            spo_user: {
              usr_email: '$sp_owner.spo_user.usr_email',
              usr_firstName: '$sp_owner.spo_user.usr_firstName',
              usr_lastName: '$sp_owner.spo_user.usr_lastName',
              id: '$sp_owner.spo_user._id',
            },
            id: '$sp_owner._id',
          },
        },
      },
      {
        $sort: { [sortBy || 'sp_name']: sortOrder === 'asc' ? 1 : -1 },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: +limit,
      },
    ]);

    const total = await SpaModel.countDocuments(filter);
    return {
      data: getReturnList(spas) as ISpa[],
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /** POST /admin/spas */
  static async createSpa(body: ISpaAttrs) {
    const spa = await SpaModel.build({
      ...body,
      slug: `${slugify(body.name)}-${Date.now()}`,
      address: {
        type: 'Point',
        coordinates: [0, 0],
        formattedAddress: body.address.formattedAddress,
      },
    });
    return getReturnData(spa);
  }

  /** GET /admin/spas/:id */
  static async getSpaById(spaId: string) {
    if (!isValidObjectId(spaId)) throw new NotFoundError('Spa not found');
    const spa = await SpaModel.findById(spaId).populate({
      path: 'sp_owner',
      select: 'spo_user',
      populate: {
        path: 'spo_user',
        select: 'usr_firstName usr_lastName usr_email',
      },
    });

    if (!spa) throw new NotFoundError('Spa not found');
    return getReturnData(spa);
  }

  /** PUT /admin/spas/:id */
  static async updateSpa(spaId: string, body: ISpaAttrs) {
    const updated = await SpaModel.findByIdAndUpdate(
      spaId,
      formatAttributeName(
        {
          ...body,
          address: {
            type: 'Point',
            coordinates: [0, 0],
            formattedAddress: body.address.formattedAddress,
          },
          ...(body.name ? { slug: `${slugify(body.name)}-${Date.now()}` } : {}),
        },
        SPA.PREFIX
      ),
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updated) throw new NotFoundError('Spa not found');
    return getReturnData(updated);
  }

  /** DELETE /admin/spas/:id (soft‑delete) */
  static async deleteSpa(spaId: string) {
    const deleted = await SpaModel.findByIdAndUpdate(
      spaId,
      { sp_status: 'deleted' },
      { new: true }
    );
    if (!deleted) throw new NotFoundError('Spa not found');
    return getReturnData(deleted);
  }

  /** DELETE /admin/spas/bulk (soft‑delete) */
  static async bulkDeleteSpas(spaIds: string[]) {
    const deleted = await SpaModel.updateMany(
      { _id: { $in: spaIds } },
      { sp_status: 'deleted' }
    );
    if (!deleted) throw new NotFoundError('Spas not found');
    return getReturnData(deleted);
  }

  /** DELETE /admin/spas/bulk/hard (hard‑delete) */
  static async bulkHardDeleteSpas(spaIds: string[]) {
    const deleted = await SpaModel.deleteMany({
      _id: { $in: spaIds },
      sp_status: 'deleted',
    });
    if (!deleted) throw new NotFoundError('Spas not found');
    return getReturnData(deleted);
  }

  /** PATCH /admin/spas/:id/status  (approve / reject / suspend) */
  static async updateSpaStatus(spaId: string, status: string) {
    const allowed = ['pending', 'approved', 'rejected', 'suspended'];
    if (!allowed.includes(status))
      throw new NotFoundError('Invalid status value');

    const updated = await SpaModel.findByIdAndUpdate(
      spaId,
      { sp_status: status },
      { new: true }
    );
    if (!updated) throw new NotFoundError('Spa not found');
    return getReturnData(updated);
  }

  /** PATCH /admin/spas/:id/feature  (toggle) */
  static async toggleFeatured(spaId: string) {
    const spa = await SpaModel.findById(spaId, 'sp_isFeatured');
    if (!spa) throw new NotFoundError('Spa not found');
    spa.sp_isFeatured = !spa.sp_isFeatured;
    await spa.save();
    return getReturnData(spa);
  }

  /* ─────────────── SPA‑OWNER METHODS ─────────────── */

  /** GET /owner/spas */
  static async listMySpas(
    ownerUserId: string,
    query: { page?: number; limit?: number }
  ): Promise<IResponseList<ISpa>> {
    const owner = await SpaOwnerModel.findOne(
      { spo_user: ownerUserId },
      'spo_spas'
    );
    if (!owner) throw new NotFoundError('Owner record not found');

    const spa = await SpaModel.find({ _id: { $in: owner.spo_spas } })
      .skip(((query.page || 1) - 1) * (query.limit || 20))
      .limit(query.limit || 20);
    const total = await SpaModel.countDocuments({
      _id: { $in: owner.spo_spas },
    });
    return {
      data: getReturnList(spa) as ISpa[],
      pagination: {
        total,
        page: query.page || 1,
        limit: query.limit || 20,
        totalPages: Math.ceil(total / (query.limit || 20)),
      },
    };
  }

  /** POST /owner/spas */
  static async createMySpa(ownerUserId: string, body: ISpaAttrs) {
    const owner = await SpaOwnerModel.findOne({ spo_user: ownerUserId });
    if (!owner) throw new NotFoundError('Owner record not found');

    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();
    try {
      const spa = (await SpaModel.create(
        [
          {
            ...formatAttributeName(body, SPA.PREFIX),
            sp_owner: ownerUserId,
            sp_slug: slugify(body.name),
          },
        ],
        {
          session,
        }
      )) as any as ISpaModel[];
      owner.spo_spas.push(spa[0]._id);
      await owner.save({ session });
      await session.commitTransaction();
      return getReturnData(spa[0]);
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }

  /** GET /owner/spas/:id */
  static async getMySpaById(ownerUserId: string, spaId: string) {
    await SpaService.ensureOwnership(ownerUserId, spaId);
    const spa = await SpaModel.findById(spaId);
    if (!spa) throw new NotFoundError('Spa not found');
    return getReturnData(spa);
  }

  /** PUT /owner/spas/:id */
  static async updateMySpa(ownerUserId: string, spaId: string, body: any) {
    await SpaService.ensureOwnership(ownerUserId, spaId);
    const spa = await SpaModel.findByIdAndUpdate(
      spaId,
      formatAttributeName(body, SPA.PREFIX),
      {
        new: true,
        runValidators: true,
      }
    );
    if (!spa) throw new NotFoundError('Spa not found');
    return getReturnData(spa);
  }

  /** DELETE /owner/spas/:id   (deactivate) */
  static async deleteMySpa(ownerUserId: string, spaId: string) {
    await SpaService.ensureOwnership(ownerUserId, spaId);
    const spa = await SpaModel.findByIdAndUpdate(
      spaId,
      { sp_status: 'suspended' },
      { new: true }
    );
    if (!spa) throw new NotFoundError('Spa not found');
    const owner = await SpaOwnerModel.findOne(
      { spo_user: ownerUserId },
      { spo_spas: 1 }
    );
    if (!owner) throw new NotFoundError('Owner record not found');
    owner.spo_spas = owner.spo_spas.filter(
      (id: Types.ObjectId) => id.toString() !== spaId
    );
    await owner.save();
    return getReturnData(spa);
  }

  /* List only approved (and optionally featured) spas */
  static async listPublicSpas(query: {
    page?: number;
    limit?: number;
    keyword?: string;
    category?: string;
    ratingFrom?: number;
    lng?: number;
    lat?: number;
    radiusKm?: number;
  }): Promise<IResponseList<ISpa>> {
    const { ratingFrom, lng, lat, radiusKm, ...others } = query;
    const filter: any = { sp_status: 'approved' };

    if (others.category) filter.sp_categories = others.category;
    if (ratingFrom) filter.sp_averageRating = { $gte: ratingFrom };
    if (others.keyword) filter.$text = { $search: others.keyword };

    if (lng && lat && radiusKm) {
      filter.sp_address = {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [+lng, +lat] },
          $maxDistance: radiusKm * 1000,
        },
      };
    }

    return this.listSpas({ ...others, ...filter }); // reuse admin listing helper
  }

  /* Detail only when approved */
  static async getPublicSpaById(id: string) {
    const spa = await SpaModel.findOne({ _id: id, sp_status: 'approved' })
      .populate('sp_owner', 'usr_firstName')
      .populate('sp_gallery');
    if (!spa) throw new NotFoundError('Spa not found');
    return getReturnData(spa);
  }

  /* ─────────────── HELPER ─────────────── */

  /** Throw 403 if spa not owned by user */
  private static async ensureOwnership(ownerUserId: string, spaId: string) {
    const owner = await SpaOwnerModel.findOne(
      { spo_user: ownerUserId, spo_spas: spaId },
      '_id'
    );
    if (!owner) throw new ForbiddenError('Forbidden – not your spa');
  }
}
