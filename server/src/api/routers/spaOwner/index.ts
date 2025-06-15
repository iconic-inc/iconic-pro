/* src/routes/spa‑owner.route.ts */
import { Router } from 'express';
import { SpaOwnerController } from '@controllers/spaOwner.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission, restrictToRoles } from '@middlewares/authorization';
import { validateObjectId, validateSchema } from '@/api/schema';
import {
  spaOwnerCreateSchema,
  spaOwnerUpdateSchema,
} from '@/api/schema/spaOwner.schema';

const spaOwnerRouter = Router();

/* 🔐 Require valid JWT for every route below */
spaOwnerRouter.use(authenticationV2, restrictToRoles('admin', 'spa-owner'));

/* ──────────────────────────────────────────────────────────────
   OWNER CRUD – resource = "spaOwner"
   RBAC action naming: updateOwn, readOwn
   ────────────────────────────────────────────────────────────── */
spaOwnerRouter.use('/me/spas', require('../spa/owner'));
spaOwnerRouter.use('/me/job-posts', require('../jobPost/owner'));
spaOwnerRouter.use('/me/job-applications', require('../jobApplication/owner'));
spaOwnerRouter.get(
  '/me',
  hasPermission('spaOwner', 'readOwn'),
  SpaOwnerController.getMyProfile
);
spaOwnerRouter.put(
  '/me',
  validateSchema(spaOwnerUpdateSchema),
  hasPermission('spaOwner', 'updateOwn'),
  SpaOwnerController.updateMyProfile
);

/* ──────────────────────────────────────────────────────────────
   ADMIN CRUD – resource = "spaOwner"
   RBAC action naming: createAny, readAny, updateAny, deleteAny
   ────────────────────────────────────────────────────────────── */
spaOwnerRouter.get(
  '/:ownerId',
  validateObjectId('ownerId'),
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
  validateSchema(spaOwnerCreateSchema),
  hasPermission('spaOwner', 'createAny'),
  SpaOwnerController.createSpaOwner // invite / onboard flow
);

spaOwnerRouter.put(
  '/:ownerId',
  validateObjectId('ownerId'),
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
  validateObjectId('ownerId'),
  hasPermission('spaOwner', 'deleteAny'),
  SpaOwnerController.deleteSpaOwner // soft‑delete recommended
);

/* ──────────────────────────────────────────────────────────────
   EXTRA ADMIN ACTIONS
   ────────────────────────────────────────────────────────────── */

/* Assign / unassign spas to owner (expects body { spaIds: [] }) */
spaOwnerRouter.patch(
  '/:ownerId/assign-spa',
  validateObjectId('ownerId'),
  hasPermission('spaOwner', 'updateAny'),
  SpaOwnerController.assignSpasToOwner
);

/* Change subscription plan (body { plan: 'pro', expireAt: '...' }) */
spaOwnerRouter.patch(
  '/:ownerId/plan',
  validateObjectId('ownerId'),
  hasPermission('spaOwner', 'updateAny'),
  SpaOwnerController.changeOwnerPlan
);

/* View audit log */
spaOwnerRouter.get(
  '/:ownerId/audit',
  validateObjectId('ownerId'),
  hasPermission('spaOwner', 'readAny'),
  SpaOwnerController.getOwnerAuditLog
);

module.exports = spaOwnerRouter;
