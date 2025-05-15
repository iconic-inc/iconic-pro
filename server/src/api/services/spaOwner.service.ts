/* src/services/spa‑owner.service.ts
   Business‑logic layer for Admin Spa‑Owner management
   --------------------------------------------------- */

import mongoose, { ClientSession, isValidObjectId, Types } from 'mongoose';
import { SpaOwnerModel } from '../models/spaOwner.model';
import { UserModel } from '../models/user.model';
import { SpaModel } from '../models/spa.model';
import { PlacementModel } from '../models/placement.model'; // for audit demo
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../core/errors';
import { ISpaOwner, ISpaOwnerAttrs } from '../interfaces/spaOwner.interface';
import {
  formatAttributeName,
  getReturnData,
  getReturnList,
} from '@utils/index';
import slugify from 'slugify';
import { RoleModel } from '@models/role.model';
import bcrypt from 'bcrypt';
import { IUserAttrs } from '../interfaces/user.interface';
import { IResponseList } from '../interfaces/response.interface';
import { USER } from '../constants';

export class SpaOwnerService {
  /* ▸ 1. LIST ▸────────────────────────────────────────────── */
  static async listSpaOwners(query: {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    plan?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<IResponseList<ISpaOwner>> {
    const {
      page = 1,
      limit = 20,
      keyword,
      status = 'active',
      plan,
      sortBy,
      sortOrder,
    } = query;
    const filter: any = {};

    if (status) filter.spo_status = status;
    if (plan) filter.spo_plan = plan;
    if (keyword) filter.$text = { $search: keyword };

    const owners = await SpaOwnerModel.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'spo_user',
          foreignField: '_id',
          as: 'spo_user',
        },
      },
      {
        $unwind: '$spo_user',
      },
      {
        $lookup: {
          from: 'spas',
          localField: 'spo_spas',
          foreignField: '_id',
          as: 'spo_spas',
        },
      },
      {
        $sort: {
          [sortBy || 'spo_user.usr_firstName']: sortOrder === 'asc' ? 1 : -1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: +limit,
      },
      {
        $project: {
          _id: 1,
          spo_user: {
            usr_email: '$spo_user.usr_email',
            usr_firstName: '$spo_user.usr_firstName',
            usr_lastName: '$spo_user.usr_lastName',
            usr_msisdn: '$spo_user.usr_msisdn',
            usr_address: '$spo_user.usr_address',
            usr_birthdate: '$spo_user.usr_birthdate',
          },
          spo_spas: {
            sp_name: '$spo_spas.sp_name',
          },
          spo_plan: 1,
          spo_planExpireAt: 1,
        },
      },
    ]);

    const total = await SpaOwnerModel.countDocuments(filter);
    return {
      data: getReturnList(owners) as ISpaOwner[],
      pagination: {
        total,
        limit,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /* ▸ 2. CREATE (invite flow) ▸────────────────────────────── */
  static async createSpaOwner(payload: ISpaOwnerAttrs & IUserAttrs) {
    /** 1. Check if provided data is valid */
    if (
      !payload.email ||
      !payload.password ||
      !payload.username ||
      !payload.firstName
    ) {
      throw new BadRequestError('Missing required fields');
    }

    /* 2. Check if user already exists */
    const existingUser = await UserModel.findOne({ usr_email: payload.email });
    if (existingUser) {
      throw new BadRequestError('User already exists');
    }
    /* 3. Check if provided spaIds are valid */
    if (payload.spas?.length > 0) {
      const spaIds = await SpaModel.find({ _id: { $in: payload.spas } }, '_id');
      if (spaIds.length !== payload.spas.length) {
        throw new BadRequestError('Invalid spaIds sent');
      }
    }

    /* 4. Get spa owner role */
    const spaOwnerRole = await RoleModel.findOne({ slug: 'spa-owner' });
    if (!spaOwnerRole) {
      throw new InternalServerError('Spa owner role not found');
    }

    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();

    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(payload.password, salt);
      /* a. Create User with role = 'spa-owner' */
      const [user] = await UserModel.create(
        [
          formatAttributeName(
            {
              ...payload,
              username: payload.username || payload.email,
              slug: slugify(payload.firstName, {
                lower: true,
                strict: true,
              }),
              status: 'active',
              password: hash,
              salt: salt,
              role: spaOwnerRole._id,
            },
            USER.PREFIX
          ),
        ],
        { session }
      );

      /* b. Create SpaOwner */
      const spaOwner = await SpaOwnerModel.create(
        [
          {
            spo_user: user._id,
            spo_spas: payload.spas || [],
            spo_plan: payload.plan ?? 'free',
            spo_planExpireAt: payload.planExpireAt,
          },
        ],
        { session }
      );

      const createdOwner = await spaOwner[0].populate([
        {
          path: 'spo_user',
          select: 'usr_email usr_firstName',
          options: { session },
        },
        { path: 'spo_spas', select: 'sp_name', options: { session } },
      ]);
      await session.commitTransaction();

      return getReturnData(createdOwner);
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  /* ▸ 3. READ BY ID ▸──────────────────────────────────────── */
  static async getSpaOwnerById(ownerId: string) {
    if (!isValidObjectId(ownerId)) {
      throw new BadRequestError('Spa owner not found');
    }
    const owner = await SpaOwnerModel.findById(ownerId)
      .populate('spo_user', [
        'usr_email',
        'usr_firstName',
        'usr_lastName',
        'usr_msisdn',
        'usr_address',
        'usr_birthdate',
        'usr_username',
        'usr_sex',
      ])
      .populate('spo_spas', [
        'sp_name',
        'sp_slug',
        'sp_status',
        'sp_averageRating',
        'sp_reviewCount',
      ]);
    if (!owner) throw new BadRequestError('Spa owner not found');
    return getReturnData(owner);
  }

  /* ▸ 4. UPDATE PROFILE ▸──────────────────────────────────── */
  static async updateSpaOwner(ownerId: string, body: Partial<ISpaOwner>) {
    const updated = await SpaOwnerModel.findByIdAndUpdate(ownerId, body, {
      new: true,
      runValidators: true,
    })
      .populate('spo_user', 'usr_email usr_firstName usr_lastName usr_status')
      .populate('spo_spas', 'sp_name sp_status');
    if (!updated) throw new NotFoundError('Spa owner not found');
    return getReturnData(updated);
  }

  /* ▸ 5. DELETE (soft) ▸───────────────────────────────────── */
  static async deleteSpaOwner(ownerId: string) {
    const deleted = await SpaOwnerModel.findByIdAndUpdate(
      ownerId,
      { spo_status: 'suspended' },
      { new: true }
    );
    if (!deleted) throw new NotFoundError('Spa owner not found');
    return getReturnData(deleted);
  }

  /* ▸ 6. ASSIGN / UNASSIGN SPAS ▸──────────────────────────── */
  static async assignSpasToOwner(ownerId: string, spaIds: string[]) {
    const spas = await SpaModel.find({ _id: { $in: spaIds } }, '_id');
    if (spas.length !== spaIds.length)
      throw new BadRequestError('Invalid spaIds sent');

    const spaOwner = await SpaOwnerModel.findByIdAndUpdate(
      ownerId,
      { spo_spas: spas.map((s) => s._id) },
      { new: true }
    );
    if (!spaOwner) throw new NotFoundError('Spa owner not found');
    return getReturnData(spaOwner);
  }

  /* ▸ 7. UPDATE STATUS ▸──────────────────────────────────── */
  static async updateOwnerStatus(
    ownerId: string,
    status: 'active' | 'suspended'
  ) {
    const spaOwner = await SpaOwnerModel.findByIdAndUpdate(
      ownerId,
      { spo_status: status },
      { new: true }
    );
    if (!spaOwner) throw new NotFoundError('Spa owner not found');
    return getReturnData(spaOwner);
  }

  /* ▸ 8. CHANGE PLAN ▸────────────────────────────────────── */
  static async changeOwnerPlan(ownerId: string, plan: string, expireAt?: Date) {
    const spaOwner = await SpaOwnerModel.findByIdAndUpdate(
      ownerId,
      { spo_plan: plan, spo_planExpireAt: expireAt },
      { new: true }
    );
    if (!spaOwner) throw new NotFoundError('Spa owner not found');

    return getReturnData(spaOwner);
  }

  /* ▸ 9. AUDIT LOG (example) ▸────────────────────────────── */
  static async getOwnerAuditLog(ownerId: string) {
    // Example: fetch placements (fees) as audit evidence
    return PlacementModel.find({ plc_owner: ownerId })
      .sort({ createdAt: -1 })
      .select('plc_fee plc_paid plc_paidAt createdAt');
  }

  /* ▸ 10. SOFT DELETE MULTIPLE SPA OWNERS ▸──────────────────────────── */
  static async bulkDeleteSpaOwners(ownerIds: string[]) {
    if (!Array.isArray(ownerIds) || ownerIds.length === 0)
      throw new BadRequestError('Invalid data sent!');

    await SpaOwnerModel.updateMany(
      { _id: { $in: ownerIds } },
      { spo_status: 'suspended' } // soft-delete
    );
    return getReturnData({ deleted: ownerIds.length });
  }

  /* ▸ 11. HARD DELETE MULTIPLE SPA OWNERS ▸──────────────────────────── */
  static async bulkHardDeleteSpaOwners(ownerIds: string[]) {
    if (!Array.isArray(ownerIds) || ownerIds.length === 0)
      throw new BadRequestError('Invalid data sent!');

    const { deletedCount } = await SpaOwnerModel.deleteMany({
      _id: { $in: ownerIds },
      spo_status: 'suspended', // ensure only suspended owners are deleted
    });

    // Optional: also remove linked Users or cascade logic here.

    return getReturnData({ deleted: deletedCount });
  }
}
