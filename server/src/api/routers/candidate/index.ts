import { Router } from 'express';

import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission, restrictToRoles } from '@middlewares/authorization';
import { CandidateController } from '@controllers/candidate.controller';

const candidateRouter = Router();
/* 1 ▸ CLIENT ROUTES  –  src/routes/client/candidate.route.ts
   --------------------------------------------------------- */
/* Require JWT for client‑candidate routes */
candidateRouter.use(authenticationV2);

/* Each client manages only **own** candidate profile */
candidateRouter.use(
  '/me/job-applications',
  restrictToRoles('admin', 'client'),
  require('../jobApplication/client')
);

candidateRouter.get(
  '/me',
  hasPermission('candidate', 'readOwn'),
  CandidateController.getMyProfile // always returns the caller’s CV
);

candidateRouter.put(
  '/me',
  hasPermission('candidate', 'updateOwn'),
  CandidateController.updateMyProfile
);

/* 2 ▸ ADMIN ROUTES  –  src/routes/candidate.route.ts
   ------------------------------------------------------- */
/* CRUD : resource = "candidate" (read / create / update / delete ANY) */
candidateRouter.get(
  '/',
  hasPermission('candidate', 'readAny'),
  CandidateController.listCandidates
);

candidateRouter.post(
  '/',
  hasPermission('candidate', 'createAny'),
  CandidateController.createCandidate
);

candidateRouter.get(
  '/:candidateId',
  hasPermission('candidate', 'readAny'),
  CandidateController.getCandidateById
);

candidateRouter.put(
  '/:candidateId',
  hasPermission('candidate', 'updateAny'),
  CandidateController.updateCandidate
);

/* ─── BULK DELETE ─────────────────────────────────────────── */
candidateRouter.delete(
  '/bulk',
  hasPermission('spaOwner', 'deleteAny'),
  CandidateController.bulkDeleteCandidates
);

candidateRouter.delete(
  '/bulk/hard',
  hasPermission('spaOwner', 'deleteAny'),
  CandidateController.bulkHardDeleteCandidates
);

candidateRouter.delete(
  '/:candidateId',
  hasPermission('candidate', 'deleteAny'),
  CandidateController.deleteCandidate
);

module.exports = candidateRouter;
