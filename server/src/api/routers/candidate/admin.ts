/* 1 ▸ ADMIN ROUTES  –  src/routes/admin/candidate.route.ts
   ------------------------------------------------------- */
import { Router } from 'express';

import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';
import { CandidateController } from '@controllers/candidate.controller';

const adminCandidateRouter = Router();

/* Require JWT for every admin‑candidate route */
adminCandidateRouter.use(authenticationV2);

/* CRUD : resource = "candidate" (read / create / update / delete ANY) */
adminCandidateRouter.get(
  '/',
  hasPermission('candidate', 'readAny'),
  CandidateController.listCandidates
);

adminCandidateRouter.post(
  '/',
  hasPermission('candidate', 'createAny'),
  CandidateController.createCandidate
);

adminCandidateRouter.get(
  '/:candidateId',
  hasPermission('candidate', 'readAny'),
  CandidateController.getCandidateById
);

adminCandidateRouter.put(
  '/:candidateId',
  hasPermission('candidate', 'updateAny'),
  CandidateController.updateCandidate
);

adminCandidateRouter.delete(
  '/:candidateId',
  hasPermission('candidate', 'deleteAny'),
  CandidateController.deleteCandidate
);

module.exports = adminCandidateRouter;
