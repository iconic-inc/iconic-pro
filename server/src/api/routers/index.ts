import express from 'express';

import { checkApiKey, checkPermission } from '../auth/checkApiKey';
import { pushLog2Discord } from '../middlewares/logger.middleware';
import CheckController from '@controllers/check.controller';
import { AuthController } from '@controllers/auth.controller';

const router = express.Router();

router.use(pushLog2Discord);
//check api key

router.get('/check-status', CheckController.checkStatus);

router.get('/auth/verify-email', AuthController.verifyEmailToken);

router.use(checkApiKey);
//check api key's permission
router.use(checkPermission('0000'));

router.use('/categories', require('./category'));
router.use('/bookings', require('./booking'));
router.use('/branches', require('./branch'));
router.use('/images', require('./image'));
router.use('/email', require('./email'));
router.use('/users', require('./user'));
router.use('/pages', require('./page'));
router.use('/auth', require('./auth'));
router.use('/app', require('./app'));
router.use('/roles', require('./role'));
router.use('/resources', require('./resource'));
router.use('/notifications', require('./notification'));

router.use('/admin/spas', require('./spa/admin'));
router.use('/admin/reviews', require('./review/admin'));
router.use('/admin/job-posts', require('./jobPost/admin'));
router.use('/admin/spa-owners', require('./spaOwner/admin'));
router.use('/admin/candidates', require('./candidate/admin'));
router.use('/admin/placements', require('./placement/admin'));
router.use('/admin/job-applications', require('./jobApplication/admin'));

router.use('/owner/spas', require('./spa/owner'));
router.use('/owner/reviews', require('./review/owner'));
router.use('/owner/job-posts', require('./jobPost/owner'));
router.use('/owner/placements', require('./placement/owner'));
router.use('/owner/job-applications', require('./jobApplication/owner'));

router.use('/spas', require('./spa/client'));
router.use('/job-posts', require('./jobPost/client'));
router.use('/candidates', require('./candidate/client'));
router.use('/client/reviews', require('./review/client'));
router.use('/job-applications', require('./jobApplication/client'));

module.exports = router;
