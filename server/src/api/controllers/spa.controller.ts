/* src/controllers/spa.controller.ts */
import { Request, Response, NextFunction } from 'express';
import { SpaService } from '../services/spa.service';
import { OK } from '../core/success.response';

export class SpaController {
  /* ──────────────── ADMIN ENDPOINTS ──────────────── */

  static async listSpas(req: Request, res: Response, next: NextFunction) {
    console.log('helloooo mother fucker');
    return OK({
      res,
      message: 'List of spas',
      metadata: await SpaService.listSpas(req.query),
    });
  }

  static async createSpa(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Spa created successfully',
      metadata: await SpaService.createSpa(req.body),
    });
  }

  static async getSpaById(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Spa details',
      metadata: await SpaService.getSpaById(req.params.spaId),
    });
  }

  static async updateSpa(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Spa updated successfully',
      metadata: await SpaService.updateSpa(req.params.spaId, req.body),
    });
  }

  static async deleteSpa(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Spa deleted successfully',
      metadata: await SpaService.deleteSpa(req.params.spaId),
    });
  }

  static async bulkDeleteSpas(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Spas deleted successfully',
      metadata: await SpaService.bulkDeleteSpas(req.body.spaIds),
    });
  }

  static async bulkHardDeleteSpas(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Spas hard-deleted successfully',
      metadata: await SpaService.bulkHardDeleteSpas(req.body.spaIds),
    });
  }

  static async updateSpaStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Spa status updated successfully',
      metadata: await SpaService.updateSpaStatus(
        req.params.spaId,
        req.body.status
      ),
    });
  }

  static async toggleFeatured(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Spa featured flag updated successfully',
      metadata: await SpaService.toggleFeatured(req.params.spaId),
    });
  }

  /* ─────────────── SPA‑OWNER ENDPOINTS ────────────── */

  static async listMySpas(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'List of my spas',
      metadata: await SpaService.listMySpas(req.user.userId, req.query),
    });
  }

  static async createMySpa(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Spa created successfully',
      metadata: await SpaService.createMySpa(req.user.userId, req.body),
    });
  }

  static async getMySpaById(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Spa details',
      metadata: await SpaService.getMySpaById(
        req.user.userId,
        req.params.spaId
      ),
    });
  }

  static async updateMySpa(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Spa updated successfully',
      metadata: await SpaService.updateMySpa(
        req.user.userId,
        req.params.spaId,
        req.body
      ),
    });
  }

  static async deleteMySpa(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Spa deleted successfully',
      metadata: await SpaService.deleteMySpa(req.user.userId, req.params.spaId),
    });
  }

  static async listSpasPublic(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Public list of spas',
      metadata: await SpaService.listPublicSpas(req.query),
    });
  }

  static async getSpaPublicById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Spa details',
      metadata: await SpaService.getPublicSpaById(req.params.spaId),
    });
  }
}
