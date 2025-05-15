/* 1 ▸ ADMIN ROUTES – src/routes/admin/placement.route.ts
   ----------------------------------------------------- */
import { Router } from 'express';
import { PlacementController } from '../../controllers/placement.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';

const adminPlacementRouter = Router();
adminPlacementRouter.use(authenticationV2); // 🔐 JWT

/* resource = "placement" : Admin can read / update / delete ANY */
adminPlacementRouter.get(
  '/',
  hasPermission('placement', 'readAny'),
  PlacementController.listPlacements
);

adminPlacementRouter.get(
  '/:placementId',
  hasPermission('placement', 'readAny'),
  PlacementController.getPlacementById
);

/* Mark invoice as paid / unpaid */
adminPlacementRouter.patch(
  '/:placementId/pay',
  hasPermission('placement', 'updateAny'),
  PlacementController.markPaid
);

adminPlacementRouter.patch(
  '/:placementId/unpay',
  hasPermission('placement', 'updateAny'),
  PlacementController.markUnpaid
);

/* (Optional) remove erroneous record */
adminPlacementRouter.delete(
  '/:placementId',
  hasPermission('placement', 'deleteAny'),
  PlacementController.deletePlacement
);

module.exports = adminPlacementRouter;
