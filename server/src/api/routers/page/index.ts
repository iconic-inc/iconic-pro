import { Router } from 'express';

import { PageController } from '@controllers/page.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';

const router = Router();

router.post('/:id/views', PageController.increasePageViews);

router.get(
  '/all',
  authenticationV2,
  hasPermission('page', 'readAny'),
  PageController.getAllPages
);

router.get(
  '/unpublished',
  authenticationV2,
  hasPermission('page', 'readAny'),
  PageController.getUnpublishedPages
);

router.get('/:id', PageController.getPage);
router.get('/', PageController.getPublishedPages);

router.use(authenticationV2);

router.put(
  '/:id',
  hasPermission('page', 'updateAny'),
  PageController.updatePage
);
router.post('/', hasPermission('page', 'createAny'), PageController.createPage);
router.delete(
  '/:id',
  hasPermission('page', 'deleteAny'),
  PageController.deletePage
);

module.exports = router;
