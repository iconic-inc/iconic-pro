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
  isEmptyObj,
  removeNestedNullish,
} from '@utils/index';
import slugify from 'slugify';
import { RoleModel } from '@models/role.model';
import bcrypt from 'bcrypt';
import { IUserAttrs } from '../interfaces/user.interface';
import { IResponseList } from '../interfaces/response.interface';
import { SPA_OWNER, USER } from '../constants';

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
    const owner = await SpaOwnerModel.findById(ownerId).populate('spo_user', [
      'usr_email',
      'usr_firstName',
      'usr_lastName',
      'usr_msisdn',
      'usr_address',
      'usr_birthdate',
      'usr_username',
      'usr_sex',
    ]);

    if (!owner) throw new BadRequestError('Spa owner not found');
    return getReturnData(owner);
  }

  /* ▸ 4. UPDATE PROFILE ▸──────────────────────────────────── */
  static async updateSpaOwner(
    ownerId: string,
    body: ISpaOwnerAttrs & IUserAttrs
  ) {
    let session;
    try {
      // Tìm owner và lấy userId
      const owner = await SpaOwnerModel.findById(ownerId);

      if (!owner) {
        throw new NotFoundError('Chủ spa không tồn tại');
      }

      // Kiểm tra trùng lặp email nếu có cập nhật email
      if (body.email) {
        const existingUser = await UserModel.findOne({
          _id: { $ne: owner.spo_user },
          usr_email: body.email,
        });

        if (existingUser) {
          throw new BadRequestError('Email đã tồn tại trong hệ thống');
        }
      }

      // Bắt đầu transaction
      session = await mongoose.startSession();
      session.startTransaction();

      const ownerUpdateData = removeNestedNullish<ISpaOwnerAttrs & IUserAttrs>(
        getReturnData(body, {
          fields: ['level', 'plan', 'planExpireAt', 'status'],
        })
      );

      // Cập nhật owner nếu có dữ liệu cần cập nhật
      if (!isEmptyObj(ownerUpdateData)) {
        const updatedOwner = await SpaOwnerModel.findByIdAndUpdate(
          ownerId,
          { $set: formatAttributeName(ownerUpdateData, SPA_OWNER.PREFIX) },
          { new: true, session }
        );

        if (!updatedOwner) {
          throw new NotFoundError('Nhân viên không tồn tại');
        }
      }

      const userUpdateData = removeNestedNullish<IUserAttrs>(
        getReturnData(body, {
          fields: [
            'firstName',
            'lastName',
            'email',
            'msisdn',
            'avatar',
            'address',
            'username',
            'birthdate',
            'sex',
            'status',
            'role',
            'password',
          ],
        })
      );

      if (body.password) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(body.password, salt);

        userUpdateData.password = hashPassword;
        // @ts-ignore
        userUpdateData.salt = salt;
      }

      if (!isEmptyObj(userUpdateData)) {
        const updatedUser = await UserModel.findByIdAndUpdate(
          owner.spo_user,
          {
            $set: {
              ...formatAttributeName(userUpdateData, USER.PREFIX),
              ...(body.email && {
                usr_slug: body.email.split('@')[0],
              }),
            },
          },
          { new: true, session }
        );

        if (!updatedUser) {
          throw new NotFoundError('User not found');
        }
      }

      // Commit transaction
      await session.commitTransaction();
      session = null;

      // Lấy dữ liệu mới nhất sau khi cập nhật
      const finalOwner = await SpaOwnerModel.findById(ownerId).populate({
        path: 'spo_user',
        select: '-__v -usr_password -usr_salt',
      });

      if (!finalOwner) {
        throw new NotFoundError('Chủ spa không tồn tại');
      }

      return getReturnData(finalOwner, { without: ['spo_user'] });
    } catch (error) {
      if (session) {
        try {
          await session.abortTransaction();
        } catch (abortError) {
          console.error('Error aborting transaction:', abortError);
        }
      }
      throw error;
    } finally {
      if (session) {
        try {
          await session.endSession();
        } catch (endError) {
          console.error('Error ending session:', endError);
        }
      }
    }
  }

  /* ▸ 5. DELETE (soft) ▸───────────────────────────────────── */
  static async deleteSpaOwner(ownerId: string) {
    let session;
    try {
      // Tìm spaOwner để lấy userId
      const spaOwner = await SpaOwnerModel.findById(ownerId);

      if (!spaOwner) {
        throw new NotFoundError('SpaOwner not found');
      }

      // Bắt đầu transaction
      session = await mongoose.startSession();
      session.startTransaction();

      // Xóa spaOwner
      const deleteSpaOwnerResult = await SpaOwnerModel.deleteOne(
        { _id: ownerId },
        { session }
      );

      if (deleteSpaOwnerResult.deletedCount === 0) {
        throw new Error('Failed to delete spaOwner');
      }

      // Xóa user tương ứng
      const deleteUserResult = await UserModel.deleteOne(
        { _id: spaOwner.spo_user },
        { session }
      );

      if (deleteUserResult.deletedCount === 0) {
        throw new Error('Failed to delete user');
      }

      // Commit transaction
      await session.commitTransaction();

      return {
        success: true,
        message:
          'SpaOwner and associated user data have been deleted successfully',
      };
    } catch (error) {
      // Rollback transaction nếu có lỗi
      if (session) {
        try {
          await session.abortTransaction();
        } catch (abortError) {
          console.error('Error aborting transaction:', abortError);
        }
      }
      throw error;
    } finally {
      // Đảm bảo session luôn được kết thúc
      if (session) {
        try {
          await session.endSession();
        } catch (endError) {
          console.error('Error ending session:', endError);
        }
      }
    }
  }

  /* ▸ 6. ASSIGN / UNASSIGN SPAS ▸──────────────────────────── */
  static async assignSpasToOwner(ownerId: string, spaIds: string[]) {
    const spas = await SpaModel.updateMany(
      { _id: { $in: spaIds } },
      {
        $set: { sp_owner: ownerId },
      }
    );

    return getReturnData(spas);
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

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const owners = await SpaOwnerModel.find({
        _id: { $in: ownerIds },
      });
      if (owners.length === 0) {
        throw new NotFoundError('Spa owner not found');
      }
      const userIds = owners.map((owner) => owner.spo_user);

      const updatedOwner = await SpaOwnerModel.updateMany(
        { _id: { $in: ownerIds } },
        { spo_status: 'suspended' },
        { session }
      );
      const updatedUser = await UserModel.updateMany(
        { _id: { $in: userIds } },
        { usr_status: USER.STATUS.INACTIVE },
        { session }
      );
      if (!updatedOwner || !updatedUser) {
        throw new NotFoundError('Spa owner not found');
      }
      if (updatedOwner.modifiedCount !== updatedUser.modifiedCount) {
        throw new BadRequestError('Failed to update all owners');
      }

      await session.commitTransaction();
      return getReturnData({ deleted: updatedOwner.modifiedCount });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /* ▸ 11. HARD DELETE MULTIPLE SPA OWNERS ▸──────────────────────────── */
  static async bulkHardDeleteSpaOwners(ownerIds: string[]) {
    if (!Array.isArray(ownerIds) || ownerIds.length === 0)
      throw new BadRequestError('Invalid data sent!');

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const owners = await SpaOwnerModel.find({
        _id: { $in: ownerIds },
      });
      if (owners.length === 0) {
        throw new NotFoundError('Spa owner not found');
      }
      const userIds = owners.map((owner) => owner.spo_user);

      const deletedOwner = await SpaOwnerModel.deleteMany(
        { _id: { $in: ownerIds } },
        { session }
      );
      const deletedUser = await UserModel.deleteMany(
        { _id: { $in: userIds } },
        { session }
      );
      if (!deletedOwner || !deletedUser) {
        throw new NotFoundError('Spa owner not found');
      }
      if (deletedOwner.deletedCount !== deletedUser.deletedCount) {
        throw new BadRequestError('Failed to delete spa owners');
      }

      await session.commitTransaction();
      return getReturnData({ deleted: deletedOwner.deletedCount });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /* ▸ 12. GET OWNER BY USER ID ▸──────────────────────────── */
  static async getOwnerByUserId(userId: string) {
    if (!isValidObjectId(userId)) {
      throw new BadRequestError('Invalid user ID');
    }
    const owner = await SpaOwnerModel.findOne({ spo_user: userId }).populate(
      'spo_user',
      'usr_email usr_firstName usr_lastName usr_msisdn usr_address usr_birthdate usr_username'
    );
    if (!owner) throw new NotFoundError('Spa owner not found');
    return getReturnData(owner);
  }

  /* ▸ 13. UPDATE MY PROFILE ▸──────────────────────────────── */
  static async updateMyProfile(
    userId: string,
    body: ISpaOwnerAttrs & IUserAttrs
  ) {
    const owner = await SpaOwnerModel.findOne({ spo_user: userId });
    if (!owner) throw new NotFoundError('Spa owner not found');

    return this.updateSpaOwner(owner.id, body);
  }
}
