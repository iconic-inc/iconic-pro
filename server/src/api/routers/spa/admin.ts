import { Router } from 'express';
import { SpaController } from '@controllers/spa.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';
import { validateObjectId, validateSchema } from 'src/api/schema';
import { spaCreateSchema } from 'src/api/schema/spa.schema';

const adminSpaRouter = Router();

/* Require JWT on every admin spa route */
adminSpaRouter.use(authenticationV2);

/* ─────────── CRUD ANY (resource = "spa") ─────────── */

adminSpaRouter.get(
  '/',
  hasPermission('spa', 'readAny'),
  SpaController.listSpas // pagination + filters
);

adminSpaRouter.post(
  '/',
  hasPermission('spa', 'createAny'),
  validateSchema(spaCreateSchema), // validate request body
  SpaController.createSpa // create new spa
);

adminSpaRouter.get(
  '/:spaId',
  validateObjectId('spaId'), // validate request params
  hasPermission('spa', 'readAny'),
  SpaController.getSpaById
);

adminSpaRouter.put(
  '/:spaId',
  validateObjectId('spaId'), // validate request params
  hasPermission('spa', 'updateAny'),
  SpaController.updateSpa
);

// bulk soft-delete
adminSpaRouter.delete(
  '/bulk',
  hasPermission('spa', 'deleteAny'),
  SpaController.bulkDeleteSpas // soft‑delete recommended
);
// bulk hard-delete
adminSpaRouter.delete(
  '/bulk/hard',
  hasPermission('spa', 'deleteAny'),
  SpaController.bulkHardDeleteSpas // hard-delete
);

adminSpaRouter.delete(
  '/:spaId',
  validateObjectId('spaId'), // validate request params
  hasPermission('spa', 'deleteAny'),
  SpaController.deleteSpa // soft‑delete recommended
);

/* Extra: feature & approval flags */
adminSpaRouter.patch(
  '/:spaId/status',
  validateObjectId('spaId'), // validate request params
  hasPermission('spa', 'updateAny'),
  SpaController.updateSpaStatus // approve, reject, suspend
);

adminSpaRouter.patch(
  '/:spaId/feature',
  validateObjectId('spaId'), // validate request params
  hasPermission('spa', 'updateAny'),
  SpaController.toggleFeatured // homepage highlight
);

module.exports = adminSpaRouter;
