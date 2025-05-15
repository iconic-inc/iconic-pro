/* src/services/placement.service.ts
   --------------------------------------------------------
   Secure handling of recruitment‑fee (Placement) records
*/

import { Types } from 'mongoose';
import { PlacementModel } from '../models/placement.model';
import { SpaOwnerModel } from '../models/spaOwner.model';
import { BadRequestError, NotFoundError, ForbiddenError } from '../core/errors';
import { getReturnData, getReturnList } from '../utils';
import { IResponseList } from '../interfaces/response.interface';
import { IPlacement } from '../interfaces/placement.interface';
// import { buildPaymentUrl } from '../utils/payment-gateway'; // helper wraps VNPAY / Stripe

export class PlacementService {
  /* ──────────────── ADMIN METHODS ──────────────── */

  /** GET /admin/placements */
  static async listPlacements(query: {
    page?: number;
    limit?: number;
    paid?: string;
  }): Promise<IResponseList<IPlacement>> {
    const { page = 1, limit = 20, paid } = query;
    const filter: any = {};
    if (paid === 'true') filter.plc_paid = true;
    if (paid === 'false') filter.plc_paid = false;

    const docs = await PlacementModel.find(filter)
      .populate('plc_owner', 'spo_user')
      .skip((+page - 1) * +limit)
      .limit(+limit);
    const total = await PlacementModel.countDocuments(filter);

    return {
      data: getReturnList(docs) as IPlacement[],
      pagination: {
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / +limit),
      },
    };
  }

  /** GET /admin/placements/:id */
  static async getPlacementById(id: string) {
    const plc = await PlacementModel.findById(id).populate(
      'plc_owner',
      'spo_user'
    );
    if (!plc) throw new NotFoundError('Placement not found');
    return getReturnData(plc);
  }

  /** PATCH /admin/placements/:id/pay|unpay */
  static async updatePaymentStatus(id: string, paid: boolean) {
    const plc = await PlacementModel.findByIdAndUpdate(
      id,
      { plc_paid: paid, plc_paidAt: paid ? new Date() : undefined },
      { new: true }
    );
    if (!plc) throw new NotFoundError('Placement not found');
    return getReturnData(plc);
  }

  /** DELETE /admin/placements/:id */
  static async deletePlacement(id: string) {
    const removed = await PlacementModel.findByIdAndDelete(id);
    if (!removed) throw new NotFoundError('Placement not found');
    return getReturnData({ _id: id });
  }

  /* ──────────────── OWNER METHODS ──────────────── */

  /** verify that placement belongs to this spa‑owner */
  private static async assertOwnership(ownerUserId: string, plcId: string) {
    const owner = await SpaOwnerModel.findOne({ spo_user: ownerUserId }, '_id');
    if (!owner) throw new ForbiddenError('Owner profile not found');

    const plc = await PlacementModel.findById(plcId);
    if (!plc) throw new NotFoundError('Placement not found');
    if (!plc.plc_owner.toString() === owner.id)
      throw new ForbiddenError('Not your placement');
    return { owner, plc };
  }

  /** GET /owner/placements */
  static async listOwnerPlacements(
    ownerUserId: string,
    query: any
  ): Promise<IResponseList<IPlacement>> {
    const owner = await SpaOwnerModel.findOne({ spo_user: ownerUserId }, '_id');
    if (!owner) throw new NotFoundError('Owner profile not found');

    const docs = await PlacementModel.find({ plc_owner: owner._id })
      .skip(((query.page || 1) - 1) * (query.limit || 20))
      .limit(query.limit || 20);
    const total = await PlacementModel.countDocuments({ plc_owner: owner._id });

    return {
      data: getReturnList(docs) as IPlacement[],
      pagination: {
        total,
        page: query.page || 1,
        limit: query.limit || 20,
        totalPages: Math.ceil(total / (query.limit || 20)),
      },
    };
  }

  /** GET /owner/placements/:id */
  static async getOwnerPlacementById(ownerUserId: string, id: string) {
    const { plc } = await this.assertOwnership(ownerUserId, id);
    return getReturnData(plc);
  }

  /** POST /owner/placements/:id/pay  → returns payment URL */
  static async initiatePayment(ownerUserId: string, id: string) {
    const { plc } = await this.assertOwnership(ownerUserId, id);
    if (plc.plc_paid)
      throw new BadRequestError('This placement is already paid');

    // Build redirect/payment link via helper
    // const paymentUrl = buildPaymentUrl({
    //   amount: plc.plc_fee,
    //   currency: plc.plc_currency,
    //   meta: { placementId: plc._id.toString() },
    // });

    // return getReturnData({ paymentUrl });
    return 'hi';
  }
}
