/* src/routes/client/spa.route.ts
   ─────────────────────────────────────────────────────── */
import { Router } from 'express';
import { SpaController } from '../../controllers/spa.controller';
import { hasPermission } from '@middlewares/authorization'; // keep RBAC guard

const clientSpaRouter = Router();

/* Browse / search spas
   Query params examples:
     • page, limit
     • keyword        (full‑text search on name + description)
     • category       (phun-xam, nail…)
     • ratingFrom     (min avg rating)
     • lng, lat, radiusKm  (geo‑near search)
*/
clientSpaRouter.get(
  '/',
  hasPermission('spa', 'readAny'), // public read
  SpaController.listSpasPublic
);

/* View spa detail */
clientSpaRouter.get(
  '/:spaId',
  hasPermission('spa', 'readAny'),
  SpaController.getSpaPublicById
);

module.exports = clientSpaRouter;
