/* src/controllers/placement.controller.ts */
import { Request, Response, NextFunction } from 'express';
import { PlacementService } from '../services/placement.service';
import { OK } from '../core/success.response';

export class PlacementController {
  /* ──────────────── ADMIN HANDLERS ──────────────── */

  static async listPlacements(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'List of placement records',
      metadata: await PlacementService.listPlacements(req.query),
    });
  }

  static async getPlacementById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Placement details',
      metadata: await PlacementService.getPlacementById(req.params.placementId),
    });
  }

  static async markPaid(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Placement marked as paid',
      metadata: await PlacementService.updatePaymentStatus(
        req.params.placementId,
        true
      ),
    });
  }

  static async markUnpaid(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Placement marked as unpaid',
      metadata: await PlacementService.updatePaymentStatus(
        req.params.placementId,
        false
      ),
    });
  }

  static async deletePlacement(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Placement deleted successfully',
      metadata: await PlacementService.deletePlacement(req.params.placementId),
    });
  }

  /* ─────────────── SPA‑OWNER HANDLERS ─────────────── */

  static async listMyPlacements(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'List of my placement records',
      metadata: await PlacementService.listOwnerPlacements(
        req.user.userId,
        req.query
      ),
    });
  }

  static async getMyPlacementById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Placement details',
      metadata: await PlacementService.getOwnerPlacementById(
        req.user.userId,
        req.params.placementId
      ),
    });
  }

  static async initiatePayment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Payment initiated',
      metadata: await PlacementService.initiatePayment(
        req.user.userId,
        req.params.placementId
      ),
    });
  }
}
