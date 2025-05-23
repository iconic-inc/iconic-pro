/* 2 ▸ OWNER ROUTES – src/routes/owner/placement.route.ts
   ----------------------------------------------------- */
import { Router } from 'express';
import { PlacementController } from '../../controllers/placement.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';

const ownerPlacementRouter = Router();
ownerPlacementRouter.use(authenticationV2);

/* resource = "placement" : Owner can read OWN, mark as paid via gateway */
ownerPlacementRouter.get(
  '/',
  hasPermission('placement', 'readOwn'),
  PlacementController.listMyPlacements
);

ownerPlacementRouter.get(
  '/:placementId',
  hasPermission('placement', 'readOwn'),
  PlacementController.getMyPlacementById
);

/* Owner triggers payment (redirects to gateway, then webhook updates) */
ownerPlacementRouter.post(
  '/:placementId/pay',
  hasPermission('placement', 'updateOwn'),
  PlacementController.initiatePayment
);

module.exports = ownerPlacementRouter;
