/* src/controllers/candidate.controller.ts */
import { Request, Response, NextFunction } from 'express';
import { CandidateService } from '../services/candidate.service';
import { OK } from '../core/success.response';

export class CandidateController {
  /* ──────────────── ADMIN HANDLERS ──────────────── */

  static async listCandidates(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'List of candidates',
      metadata: await CandidateService.listCandidates(req.query),
    });
  }

  static async createCandidate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Candidate profile created successfully',
      metadata: await CandidateService.createCandidate(req.body),
    });
  }

  static async getCandidateById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Candidate profile details',
      metadata: await CandidateService.getCandidateById(req.params.candidateId),
    });
  }

  static async updateCandidate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Candidate profile updated successfully',
      metadata: await CandidateService.updateCandidate(
        req.params.candidateId,
        req.body
      ),
    });
  }

  static async deleteCandidate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Candidate profile deleted successfully',
      metadata: await CandidateService.deleteCandidate(req.params.candidateId),
    });
  }

  /* ───────────── CLIENT (SELF‑SERVICE) HANDLERS ───────────── */

  static async createMyProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Your candidate profile created successfully',
      metadata: await CandidateService.createMyProfile(
        req.user.userId,
        req.body
      ),
    });
  }

  static async getMyProfile(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Your candidate profile',
      metadata: await CandidateService.getMyProfile(req.user.userId),
    });
  }

  static async updateMyProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Your candidate profile updated successfully',
      metadata: await CandidateService.updateMyProfile(
        req.user.userId,
        req.body
      ),
    });
  }

  static async deleteMyProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Your candidate profile deleted successfully',
      metadata: await CandidateService.deleteMyProfile(req.user.userId),
    });
  }
}
