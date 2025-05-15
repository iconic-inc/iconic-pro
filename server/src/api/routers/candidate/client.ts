/* 2 ▸ CLIENT ROUTES  –  src/routes/client/candidate.route.ts
   --------------------------------------------------------- */
import { Router } from 'express';
import { CandidateController } from '../../controllers/candidate.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';

const clientCandidateRouter = Router();

/* Require JWT for client‑candidate routes */
clientCandidateRouter.use(authenticationV2);

/* Each client manages only **own** candidate profile */
clientCandidateRouter.post(
  '/',
  hasPermission('candidate', 'createOwn'),
  CandidateController.createMyProfile
);

clientCandidateRouter.get(
  '/',
  hasPermission('candidate', 'readOwn'),
  CandidateController.getMyProfile // always returns the caller’s CV
);

clientCandidateRouter.put(
  '/',
  hasPermission('candidate', 'updateOwn'),
  CandidateController.updateMyProfile
);

clientCandidateRouter.delete(
  '/',
  hasPermission('candidate', 'deleteOwn'),
  CandidateController.deleteMyProfile
);

module.exports = clientCandidateRouter;
