/* src/controllers/spa‑owner.controller.ts */
import { Request, Response, NextFunction } from 'express';
import { SpaOwnerService } from '../services/spaOwner.service';
import { OK } from '../core/success.response';

export class SpaOwnerController {
  static async listSpaOwners(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'List of spa owners',
      metadata: await SpaOwnerService.listSpaOwners(req.query),
    });
  }

  static async createSpaOwner(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Spa owner created successfully',
      metadata: await SpaOwnerService.createSpaOwner(req.body),
    });
  }

  static async getSpaOwnerById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Spa owner details',
      metadata: await SpaOwnerService.getSpaOwnerById(req.params.ownerId),
    });
  }

  static async getMyProfile(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'My profile',
      metadata: await SpaOwnerService.getOwnerByUserId(req.user.userId),
    });
  }

  static async updateMyProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'My profile updated successfully',
      metadata: await SpaOwnerService.updateMyProfile(
        req.user.userId,
        req.body
      ),
    });
  }

  static async updateSpaOwner(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Spa owner updated successfully',
      metadata: await SpaOwnerService.updateSpaOwner(
        req.params.ownerId,
        req.body
      ),
    });
  }

  static async deleteSpaOwner(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Spa owner deleted successfully',
      metadata: await SpaOwnerService.deleteSpaOwner(req.params.ownerId),
    });
  }

  static async assignSpasToOwner(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Spas assigned to owner successfully',
      metadata: await SpaOwnerService.assignSpasToOwner(
        req.params.ownerId,
        req.body.spaIds
      ),
    });
  }

  static async changeOwnerPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Owner plan updated successfully',
      metadata: await SpaOwnerService.changeOwnerPlan(
        req.params.ownerId,
        req.body.plan,
        req.body.expireAt
      ),
    });
  }

  static async getOwnerAuditLog(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Owner audit log',
      metadata: await SpaOwnerService.getOwnerAuditLog(req.params.ownerId),
    });
  }

  static async bulkDeleteSpaOwners(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Spa owners deleted successfully',
      metadata: await SpaOwnerService.bulkDeleteSpaOwners(req.body.ownerIds),
    });
  }

  static async bulkHardDeleteSpaOwners(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Spa owners permanently deleted',
      metadata: await SpaOwnerService.bulkHardDeleteSpaOwners(
        req.body.ownerIds
      ),
    });
  }
}
