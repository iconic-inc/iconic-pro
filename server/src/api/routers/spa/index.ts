import { Router } from 'express';
import { SpaController } from '@controllers/spa.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission, restrictToRoles } from '@middlewares/authorization';
import { validateObjectId, validateSchema } from 'src/api/schema';
import { spaCreateSchema } from 'src/api/schema/spa.schema';

const spaRouter = Router();

/* Require JWT on every admin spa route */
spaRouter.use(authenticationV2);

/* ─────────── CRUD ANY (resource = "spa") ─────────── */

spaRouter.get(
  '/:spaId',
  validateObjectId('spaId'), // validate request params
  hasPermission('spa', 'readAny'),
  SpaController.getSpaPublicById
);

spaRouter.get(
  '/',
  hasPermission('spa', 'readAny'),
  SpaController.listSpasPublic // pagination + filters
);

// spaRouter.get(
//   '/draft',
//   hasPermission('spa', 'readAny'),
//   restrictToRoles('admin', 'spa-owner'),
//   SpaController.listDraftSpas // pagination + filters
// );

spaRouter.post(
  '/',
  hasPermission('spa', 'createAny'),
  validateSchema(spaCreateSchema), // validate request body
  SpaController.createSpa // create new spa
);

spaRouter.put(
  '/:spaId',
  validateObjectId('spaId'), // validate request params
  hasPermission('spa', 'updateAny'),
  SpaController.updateSpa
);

// bulk soft-delete
spaRouter.delete(
  '/bulk',
  hasPermission('spa', 'deleteAny'),
  SpaController.bulkDeleteSpas // soft‑delete recommended
);
// bulk hard-delete
spaRouter.delete(
  '/bulk/hard',
  hasPermission('spa', 'deleteAny'),
  SpaController.bulkHardDeleteSpas // hard-delete
);

spaRouter.delete(
  '/:spaId',
  validateObjectId('spaId'), // validate request params
  hasPermission('spa', 'deleteAny'),
  SpaController.deleteSpa // soft‑delete recommended
);

/* Extra: feature & approval flags */
spaRouter.patch(
  '/:spaId/status',
  validateObjectId('spaId'), // validate request params
  hasPermission('spa', 'updateAny'),
  SpaController.updateSpaStatus // approve, reject, suspend
);

spaRouter.patch(
  '/:spaId/feature',
  validateObjectId('spaId'), // validate request params
  hasPermission('spa', 'updateAny'),
  SpaController.toggleFeatured // homepage highlight
);

module.exports = spaRouter;
