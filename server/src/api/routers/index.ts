import express from 'express';

import { checkApiKey, checkPermission } from '../auth/checkApiKey';
import { pushLog2Discord } from '../middlewares/logger.middleware';
import CheckController from '@controllers/check.controller';
import { AuthController } from '@controllers/auth.controller';
import { strictLimiter } from '../middlewares/rateLimiter.middleware';

const router = express.Router();

router.use(pushLog2Discord);
//check api key

router.get('/check-status', CheckController.checkStatus);

// Apply strict rate limiting to email verification
router.get(
  '/auth/verify-email',
  strictLimiter,
  AuthController.verifyEmailToken
);

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
router.use('/spa-owners', require('./spaOwner'));
router.use('/spas', require('./spa'));
router.use('/candidates', require('./candidate'));
router.use('/job-posts', require('./jobPost'));
router.use('/job-applications', require('./jobApplication'));

// router.use('/reviews', require('./review'));
// router.use('/placements', require('./placement'));

module.exports = router;
