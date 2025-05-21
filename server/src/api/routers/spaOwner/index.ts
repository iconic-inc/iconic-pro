/* src/routes/spa‑owner.route.ts */
import { Router } from 'express';
import { SpaOwnerController } from '@controllers/spaOwner.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission, restrictToRoles } from '@middlewares/authorization';

const spaOwnerRouter = Router();

/* 🔐 Require valid JWT for every route below */
spaOwnerRouter.use(authenticationV2);

/* ──────────────────────────────────────────────────────────────
   OWNER CRUD – resource = "spaOwner"
   RBAC action naming: updateOwn, readOwn
   ────────────────────────────────────────────────────────────── */
spaOwnerRouter.use(
  '/me/spas',
  restrictToRoles('admin', 'spa-owner'),
  require('../spa/owner')
);
spaOwnerRouter.use(
  '/me/job-posts',
  restrictToRoles('admin', 'spa-owner'),
  require('../jobPost/owner')
);
spaOwnerRouter.use(
  '/me/job-applications',
  restrictToRoles('admin', 'spa-owner'),
  require('../jobApplication/owner')
);
// spaOwnerRouter.get(
//   '/me',
//   hasPermission('spaOwner', 'readOwn'),
//   SpaOwnerController.getMyProfile
// );
// spaOwnerRouter.put(
//   '/me',
//   hasPermission('spaOwner', 'updateOwn'),
//   SpaOwnerController.updateMyProfile
// );

/* ──────────────────────────────────────────────────────────────
   ADMIN CRUD – resource = "spaOwner"
   RBAC action naming: createAny, readAny, updateAny, deleteAny
   ────────────────────────────────────────────────────────────── */
spaOwnerRouter.get(
  '/:ownerId',
  hasPermission('spaOwner', 'readAny'),
  SpaOwnerController.getSpaOwnerById
);

spaOwnerRouter.get(
  '/',
  hasPermission('spaOwner', 'readAny'),
  SpaOwnerController.listSpaOwners
);

spaOwnerRouter.post(
  '/',
  hasPermission('spaOwner', 'createAny'),
  SpaOwnerController.createSpaOwner // invite / onboard flow
);

spaOwnerRouter.put(
  '/:ownerId',
  hasPermission('spaOwner', 'updateAny'),
  SpaOwnerController.updateSpaOwner
);

/* ─── BULK DELETE ─────────────────────────────────────────── */
spaOwnerRouter.delete(
  '/bulk',
  hasPermission('spaOwner', 'deleteAny'),
  SpaOwnerController.bulkDeleteSpaOwners
);

spaOwnerRouter.delete(
  '/bulk/hard',
  hasPermission('spaOwner', 'deleteAny'),
  SpaOwnerController.bulkHardDeleteSpaOwners
);

spaOwnerRouter.delete(
  '/:ownerId',
  hasPermission('spaOwner', 'deleteAny'),
  SpaOwnerController.deleteSpaOwner // soft‑delete recommended
);

/* ──────────────────────────────────────────────────────────────
   EXTRA ADMIN ACTIONS
   ────────────────────────────────────────────────────────────── */

/* Assign / unassign spas to owner (expects body { spaIds: [] }) */
spaOwnerRouter.patch(
  '/:ownerId/assign-spa',
  hasPermission('spaOwner', 'updateAny'),
  SpaOwnerController.assignSpasToOwner
);

/* Suspend or activate owner account (body { status: 'active'|'suspended' }) */
spaOwnerRouter.patch(
  '/:ownerId/status',
  hasPermission('spaOwner', 'updateAny'),
  SpaOwnerController.updateOwnerStatus
);

/* Change subscription plan (body { plan: 'pro', expireAt: '...' }) */
spaOwnerRouter.patch(
  '/:ownerId/plan',
  hasPermission('spaOwner', 'updateAny'),
  SpaOwnerController.changeOwnerPlan
);

/* View audit log */
spaOwnerRouter.get(
  '/:ownerId/audit',
  hasPermission('spaOwner', 'readAny'),
  SpaOwnerController.getOwnerAuditLog
);

module.exports = spaOwnerRouter;
