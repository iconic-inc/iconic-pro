/* src/services/candidate.service.ts
   ----------------------------------------------------
   Business‑logic for Candidate / CV management
   Uses helpers: getReturnData() & getReturnList()
*/

import { CandidateModel } from '../models/candidate.model';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../core/errors';
import {
  formatAttributeName,
  getReturnData,
  getReturnList,
  isEmptyObj,
  removeNestedNullish,
} from '../utils';
import {
  ICandidate,
  ICandidateAttrs,
  ICandidateResponse,
} from '../interfaces/candidate.interface';
import { IUserAttrs } from '../interfaces/user.interface';
import { UserModel } from '@models/user.model';
import { RoleModel } from '@models/role.model';
import mongoose, { ClientSession } from 'mongoose';
import bcrypt from 'bcrypt';
import slugify from 'slugify';
import { CANDIDATE, USER } from '../constants';

export class CandidateService {
  /* ──────────────── ADMIN METHODS ──────────────── */

  static async listCandidates(query: {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { page = 1, limit = 20, keyword, status, sortBy, sortOrder } = query;
    const filter: any = {};
    if (status) filter.can_status = status;
    if (keyword) filter.$text = { $search: keyword };

    const docs = await CandidateModel.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'can_user',
          foreignField: '_id',
          as: 'can_user',
        },
      },
      {
        $unwind: '$can_user',
      },
      {
        $sort: {
          [sortBy || 'can_user.usr_firstName']: sortOrder === 'asc' ? 1 : -1,
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
          can_user: {
            _id: '$can_user._id',
            usr_email: '$can_user.usr_email',
            usr_firstName: '$can_user.usr_firstName',
            usr_lastName: '$can_user.usr_lastName',
            usr_avatar: '$can_user.usr_avatar',
            usr_slug: '$can_user.usr_slug',
            usr_address: '$can_user.usr_address',
            usr_msisdn: '$can_user.usr_msisdn',
            usr_birthdate: '$can_user.usr_birthdate',
          },
        },
      },
    ]);
    const total = await CandidateModel.countDocuments(filter);

    return {
      data: getReturnList(docs) as ICandidateResponse[],
      pagination: {
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / +limit),
      },
    };
  }

  static async createCandidate(payload: ICandidateAttrs & IUserAttrs) {
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

    /* 4. Get spa candidate role */
    const spaCandidateRole = await RoleModel.findOne({ slug: 'client' });
    if (!spaCandidateRole) {
      throw new InternalServerError('Spa candidate role not found');
    }

    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();

    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(payload.password, salt);
      /* a. Create User with role = 'spa-candidate' */
      const [user] = await UserModel.create(
        [
          formatAttributeName<IUserAttrs>(
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
              role: spaCandidateRole._id,
            },
            USER.PREFIX
          ),
        ],
        { session }
      );

      /* b. Create candidate */
      const [candidate] = await CandidateModel.create(
        [
          formatAttributeName<ICandidateAttrs>(
            {
              user: user.id,
              summary: payload.summary,
              experience: payload.experience,
              skills: payload.skills,
              cvFile: payload.cvFile,
            },
            CANDIDATE.PREFIX
          ),
        ],
        { session }
      );
      if (!candidate) {
        throw new InternalServerError('Failed to create candidate');
      }

      const createdCandidate = await candidate.populate([
        {
          path: 'can_user',
          select: 'usr_email usr_firstName usr_username',
          options: { session },
        },
      ]);
      await session.commitTransaction();

      return getReturnData(createdCandidate) as any as ICandidateResponse;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  static async getCandidateById(id: string) {
    const cv = await CandidateModel.findById(id).populate(
      'can_user',
      'usr_email usr_firstName usr_lastName usr_avatar usr_slug usr_address usr_msisdn usr_birthdate usr_sex usr_username'
    );
    if (!cv) throw new NotFoundError('Candidate profile not found');
    return getReturnData(cv);
  }

  static async getCandidateByUserId(userId: string) {
    const cv = await CandidateModel.findOne({ can_user: userId }).populate({
      path: 'can_user',
      select:
        'usr_email usr_firstName usr_lastName usr_avatar usr_slug usr_address usr_msisdn usr_birthdate usr_sex usr_username',
      populate: {
        path: 'usr_avatar',
        select: 'img_url img_name',
      },
    });
    if (!cv) throw new NotFoundError('Candidate profile not found');
    return getReturnData(cv);
  }

  static async updateCandidate(id: string, body: ICandidateAttrs & IUserAttrs) {
    let session;
    try {
      // Tìm candidate và lấy userId
      const candidate = await CandidateModel.findById(id);

      if (!candidate) {
        throw new NotFoundError('Ứng viên không tồn tại');
      }

      // Kiểm tra trùng lặp email nếu có cập nhật email
      if (body.email) {
        const existingUser = await UserModel.findOne({
          _id: { $ne: candidate.can_user },
          usr_email: body.email,
        });

        if (existingUser) {
          throw new BadRequestError('Email đã tồn tại trong hệ thống');
        }
      }

      // Bắt đầu transaction
      session = await mongoose.startSession();
      session.startTransaction();

      const candidateUpdateData = removeNestedNullish<
        ICandidateAttrs & IUserAttrs
      >(
        getReturnData(body, {
          fields: ['cvFile', 'summary', 'experience', 'skills'],
        })
      );

      // Cập nhật candidate nếu có dữ liệu cần cập nhật
      if (!isEmptyObj(candidateUpdateData)) {
        const updatedCandidate = await CandidateModel.findByIdAndUpdate(
          id,
          { $set: formatAttributeName(candidateUpdateData, CANDIDATE.PREFIX) },
          { new: true, session }
        );

        if (!updatedCandidate) {
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
          candidate.can_user,
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
      const finalCandidate = await CandidateModel.findById(id).populate({
        path: 'can_user',
        select: '-__v -usr_password -usr_salt',
      });

      if (!finalCandidate) {
        throw new NotFoundError('Ứng viên không tồn tại');
      }

      return getReturnData(finalCandidate, { without: ['can_user'] });
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

  static async deleteCandidate(id: string) {
    let session;
    try {
      // Tìm candidate để lấy userId
      const candidate = await CandidateModel.findById(id);

      if (!candidate) {
        throw new NotFoundError('Candidate not found');
      }

      // Bắt đầu transaction
      session = await mongoose.startSession();
      session.startTransaction();

      // Xóa candidate
      const deleteCandidateResult = await CandidateModel.deleteOne(
        { _id: id },
        { session }
      );

      if (deleteCandidateResult.deletedCount === 0) {
        throw new Error('Failed to delete candidate');
      }

      // Xóa user tương ứng
      const deleteUserResult = await UserModel.deleteOne(
        { _id: candidate.can_user },
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
          'Candidate and associated user data have been deleted successfully',
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

  static async bulkHardDeleteCandidates(ids: string[]) {
    // Validate input
    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      ids.some((id) => !mongoose.isValidObjectId(id))
    ) {
      throw new BadRequestError('Invalid candidate IDs');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const candidates = await CandidateModel.find({
        _id: { $in: ids },
      }).session(session);
      if (candidates.length !== ids.length) {
        throw new NotFoundError('Some candidates not found');
      }
      const userIds = candidates.map((candidate) => candidate.can_user);

      const deleteResult = await CandidateModel.deleteMany({
        _id: { $in: ids },
      }).session(session);
      const deleteUserResult = await UserModel.deleteMany({
        _id: { $in: userIds },
      }).session(session);
      if (!deleteResult.deletedCount || !deleteUserResult.deletedCount) {
        throw new NotFoundError('Candidates not found');
      }
      if (deleteResult.deletedCount !== deleteUserResult.deletedCount) {
        throw new InternalServerError('Failed to delete candidates and users');
      }

      await session.commitTransaction();
      return getReturnData(deleteResult);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async bulkDeleteCandidates(ids: string[]) {
    // Validate input
    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      ids.some((id) => !mongoose.isValidObjectId(id))
    ) {
      throw new BadRequestError('Invalid candidate IDs');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const candidates = await CandidateModel.find({
        _id: { $in: ids },
      }).session(session);
      if (candidates.length !== ids.length) {
        throw new NotFoundError('Some candidates not found');
      }
      const userIds = candidates.map((candidate) => candidate.can_user);

      const deleteResult = await CandidateModel.updateMany(
        { _id: { $in: ids } },
        { can_status: CANDIDATE.STATUS.INACTIVE }
      ).session(session);
      const deleteUserResult = await UserModel.updateMany(
        { _id: { $in: userIds } },
        { usr_status: USER.STATUS.INACTIVE }
      ).session(session);
      if (!deleteResult.modifiedCount || !deleteUserResult.modifiedCount) {
        throw new NotFoundError('Candidates not found');
      }
      if (deleteResult.modifiedCount !== deleteUserResult.modifiedCount) {
        throw new InternalServerError('Failed to delete candidates and users');
      }

      await session.commitTransaction();
      return getReturnData(deleteResult);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /* ───────────── CLIENT (SELF‑SERVICE) ─────────────── */

  static getMyProfile(userId: string) {
    return this.getCandidateByUserId(userId);
  }

  static async updateMyProfile(
    userId: string,
    body: ICandidateAttrs & IUserAttrs
  ) {
    let session;
    try {
      // Find candidate by userId
      const candidate = await CandidateModel.findOne({ can_user: userId });
      if (!candidate) {
        throw new NotFoundError('Candidate profile not found');
      }

      // Check for duplicate email if email is being updated
      if (body.email) {
        const existingUser = await UserModel.findOne({
          _id: { $ne: userId },
          usr_email: body.email,
        });

        if (existingUser) {
          throw new BadRequestError('Email already exists in the system');
        }
      }

      // Start transaction
      session = await mongoose.startSession();
      session.startTransaction();

      // Update candidate data
      const candidateUpdateData = removeNestedNullish<ICandidateAttrs>(
        getReturnData(body, {
          fields: ['cvFile', 'summary', 'experience', 'skills', 'status'],
        })
      );

      // Update candidate if there are fields to update
      if (!isEmptyObj(candidateUpdateData)) {
        const updatedCandidate = await CandidateModel.findByIdAndUpdate(
          candidate._id,
          { $set: formatAttributeName(candidateUpdateData, CANDIDATE.PREFIX) },
          { new: true, session }
        );

        if (!updatedCandidate) {
          throw new NotFoundError('Failed to update candidate profile');
        }
      }

      // Update user data
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
          ],
        })
      );

      // Handle password update if provided
      if (body.password) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(body.password, salt);

        userUpdateData.password = hashPassword;
        // @ts-ignore
        userUpdateData.salt = salt;
      }

      // Update user if there are fields to update
      if (!isEmptyObj(userUpdateData)) {
        const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
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

      // Get the updated candidate with user information
      const updatedCandidateWithUser = await CandidateModel.findOne({
        can_user: userId,
      }).populate({
        path: 'can_user',
        select:
          'usr_email usr_firstName usr_lastName usr_avatar usr_slug usr_address usr_msisdn usr_birthdate usr_sex usr_username',
        populate: {
          path: 'usr_avatar',
          select: 'img_url img_name',
        },
      });

      if (!updatedCandidateWithUser) {
        throw new NotFoundError('Candidate profile not found after update');
      }

      return getReturnData(updatedCandidateWithUser);
    } catch (error) {
      // Rollback transaction if there's an error
      if (session) {
        try {
          await session.abortTransaction();
        } catch (abortError) {
          console.error('Error aborting transaction:', abortError);
        }
      }
      throw error;
    } finally {
      // Ensure session always ends
      if (session) {
        try {
          await session.endSession();
        } catch (endError) {
          console.error('Error ending session:', endError);
        }
      }
    }
  }

  static async createMyProfile(userId: string, body: ICandidateAttrs) {
    const exists = await CandidateModel.findOne({ can_user: userId });
    if (exists) {
      throw new BadRequestError('Profile already exists – update instead');
    }

    const candidateData = formatAttributeName<ICandidateAttrs>(
      {
        ...body,
        user: userId,
        status: CANDIDATE.STATUS.ACTIVE,
      },
      CANDIDATE.PREFIX
    );

    const candidate = await CandidateModel.create(candidateData);

    const populatedCandidate = await candidate.populate({
      path: 'can_user',
      select:
        'usr_email usr_firstName usr_lastName usr_avatar usr_slug usr_address usr_msisdn usr_birthdate usr_sex usr_username',
      populate: {
        path: 'usr_avatar',
        select: 'img_url img_name',
      },
    });

    return getReturnData(populatedCandidate);
  }

  static async deleteMyProfile(userId: string) {
    const candidate = await CandidateModel.findOne({ can_user: userId });
    if (!candidate) {
      throw new NotFoundError('Profile not found');
    }

    const updated = await CandidateModel.findByIdAndUpdate(
      candidate._id,
      { can_status: CANDIDATE.STATUS.INACTIVE },
      { new: true }
    );

    if (!updated) {
      throw new NotFoundError('Failed to update profile status');
    }

    return {
      success: true,
      message: 'Candidate profile has been hidden successfully',
    };
  }
}
