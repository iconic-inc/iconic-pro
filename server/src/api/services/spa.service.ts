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

  /** GET /spas */
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

  /** POST /spas */
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

  /** GET /spas/:id */
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

  /** PUT /spas/:id */
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

  /** DELETE /spas/:id (soft‑delete) */
  static async deleteSpa(spaId: string) {
    const deleted = await SpaModel.findByIdAndUpdate(
      spaId,
      { sp_status: 'deleted' },
      { new: true }
    );
    if (!deleted) throw new NotFoundError('Spa not found');
    return getReturnData(deleted);
  }

  /** DELETE /spas/bulk (soft‑delete) */
  static async bulkDeleteSpas(spaIds: string[]) {
    const deleted = await SpaModel.updateMany(
      { _id: { $in: spaIds } },
      { sp_status: 'deleted' }
    );
    if (!deleted) throw new NotFoundError('Spas not found');
    return getReturnData(deleted);
  }

  /** DELETE /spas/bulk/hard (hard‑delete) */
  static async bulkHardDeleteSpas(spaIds: string[]) {
    const deleted = await SpaModel.deleteMany({
      _id: { $in: spaIds },
      sp_status: 'deleted',
    });
    if (!deleted) throw new NotFoundError('Spas not found');
    return getReturnData(deleted);
  }

  /** PATCH /spas/:id/status  (approve / reject / suspend) */
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

  /** PATCH /spas/:id/feature  (toggle) */
  static async toggleFeatured(spaId: string) {
    const spa = await SpaModel.findById(spaId, 'sp_isFeatured');
    if (!spa) throw new NotFoundError('Spa not found');
    spa.sp_isFeatured = !spa.sp_isFeatured;
    await spa.save();
    return getReturnData(spa);
  }

  /* ─────────────── SPA‑OWNER METHODS ─────────────── */

  /** GET /spa-owners/me/spas */
  static async listMySpas(
    ownerUserId: string,
    query: { page?: number; limit?: number; status?: string }
  ): Promise<IResponseList<ISpa>> {
    const owner = await SpaOwnerModel.findOne({ spo_user: ownerUserId }).lean();
    if (!owner) throw new NotFoundError('Owner record not found');

    const spa = await SpaModel.find({
      sp_owner: owner.id,
      sp_status: query.status || SPA.STATUS.APPROVED,
    })
      .skip(((query.page || 1) - 1) * (query.limit || 20))
      .limit(query.limit || 20)
      .populate({
        path: 'sp_owner',
        select: 'spo_user',
        populate: {
          path: 'spo_user',
          select: 'usr_firstName usr_lastName usr_email',
        },
      })
      .populate('sp_gallery')
      .populate('sp_avatar')
      .populate('sp_coverImage')
      .lean();
    const total = await SpaModel.countDocuments({
      sp_owner: owner.id,
      sp_status: query.status || SPA.STATUS.APPROVED,
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

  /** POST /spa-owners/me/spas */
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
            sp_address: {
              type: 'Point',
              coordinates: [0, 0],
              formattedAddress: body.address.formattedAddress,
            },
            sp_status: SPA.STATUS.PENDING,
            sp_isFeatured: false,
            sp_averageRating: 0,
            sp_totalReviews: 0,
          },
        ],
        {
          session,
        }
      )) as any as ISpaModel[];

      await session.commitTransaction();
      return getReturnData(spa[0]);
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }

  /** GET /spa-owners/me/spas/:id */
  static async getMySpaById(ownerUserId: string, spaId: string) {
    await SpaService.ensureOwnership(ownerUserId, spaId);
    const spa = await SpaModel.findById(spaId);
    if (!spa) throw new NotFoundError('Spa not found');
    return getReturnData(spa);
  }

  /** PUT /spa-owners/me/spas/:id */
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

  /** DELETE /spa-owners/me/spas/:id   (deactivate) */
  static async deleteMySpa(ownerUserId: string, spaId: string) {
    await SpaService.ensureOwnership(ownerUserId, spaId);
    const spa = await SpaModel.findByIdAndUpdate(
      spaId,
      { sp_status: SPA.STATUS.APPROVED },
      { new: true }
    );
    if (!spa) throw new NotFoundError('Spa not found');
    const owner = await SpaOwnerModel.findOne({ spo_user: ownerUserId });
    if (!owner) throw new NotFoundError('Owner record not found');
    this.updateMySpa(ownerUserId, spaId, {
      sp_status: SPA.STATUS.DELETED,
    });
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
    const filter: any = { sp_status: SPA.STATUS.APPROVED };

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
    const spa = await SpaModel.findOne({
      ...(isValidObjectId(id) ? { _id: id } : { sp_slug: id }),
      sp_status: SPA.STATUS.APPROVED,
    })
      .populate('sp_owner', 'usr_firstName usr_lastName usr_email')
      .populate('sp_avatar')
      .populate('sp_coverImage')
      .populate('sp_gallery');
    if (!spa) throw new NotFoundError('Spa not found');
    return getReturnData(spa);
  }

  /* ─────────────── HELPER ─────────────── */

  /** Throw 403 if spa not owned by user */
  private static async ensureOwnership(ownerUserId: string, spaId: string) {
    const spa = await SpaModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(spaId),
        },
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
        $match: {
          'sp_owner.spo_user': new Types.ObjectId(ownerUserId),
        },
      },
    ]);
    if (!spa) throw new ForbiddenError('Forbidden – not your spa');
  }
}
