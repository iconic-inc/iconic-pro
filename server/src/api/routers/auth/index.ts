import express from 'express';

import { authenticationV2 } from '../../middlewares/authentication';
import { AuthController } from '../../controllers/auth.controller';
import { authLimiter } from '../../middlewares/rateLimiter.middleware';

const authRouter = express.Router();

// Apply stricter rate limiting to sensitive auth routes
authRouter.post('/social-login', authLimiter, AuthController.socialLogin);
authRouter.post('/signup', authLimiter, AuthController.signUp);
authRouter.post('/signin', authLimiter, AuthController.signIn);
authRouter.post('/refresh-token', authLimiter, AuthController.refreshToken);

// Require authentication routers
authRouter.use(authenticationV2);

authRouter.post('/signout', AuthController.signOut);

module.exports = authRouter;
