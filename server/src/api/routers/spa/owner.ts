import { Router } from 'express';
import { SpaController } from '@controllers/spa.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';

const ownerSpaRouter = Router();

/* Require JWT for spa‑owner routes */
ownerSpaRouter.use(authenticationV2);

/* Note: action verbs are "*own" – RBAC checks ownership inside controller/service */

/* LIST my spas (if multi‑spa) */
ownerSpaRouter.get(
  '/',
  hasPermission('spa', 'readOwn'),
  SpaController.listMySpas
);

/* CREATE a spa I will own  (on‑boarding flow) */
ownerSpaRouter.post(
  '/',
  hasPermission('spa', 'createOwn'),
  SpaController.createMySpa
);

/* READ single spa */
ownerSpaRouter.get(
  '/:spaId',
  hasPermission('spa', 'readOwn'),
  SpaController.getMySpaById
);

/* UPDATE profile, gallery, services … */
ownerSpaRouter.put(
  '/:spaId',
  hasPermission('spa', 'updateOwn'),
  SpaController.updateMySpa
);

/* DELETE (deactivate) */
ownerSpaRouter.delete(
  '/:spaId',
  hasPermission('spa', 'deleteOwn'),
  SpaController.deleteMySpa
);

module.exports = ownerSpaRouter;
