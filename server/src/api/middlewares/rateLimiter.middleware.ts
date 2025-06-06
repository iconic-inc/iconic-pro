import { serverConfig } from '@configs/config.server';
import rateLimit from 'express-rate-limit';

// Standard limiter for most routes
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: serverConfig.environment === 'production' ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production, 1000 in development
  standardHeaders: 'draft-7', // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 'error',
    code: 429,
    message: 'Too many requests, please try again later.',
  },
});

// Stricter limiter for sensitive routes like authentication
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: serverConfig.environment === 'production' ? 20 : 100, // Limit each IP to 20 requests per windowMs in production, 100 in development
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    status: 'error',
    code: 429,
    message: 'Too many authentication attempts, please try again later.',
  },
});

// Very strict limiter for routes that need high protection, like reset password
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: serverConfig.environment === 'production' ? 5 : 10, // Limit each IP to 5 requests per windowMs in production, 10 in development
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    status: 'error',
    code: 429,
    message: 'Too many attempts, please try again after an hour.',
  },
});
