import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';

const prod = config.isProduction;

/** Brute-force protection for login. */
export const authLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: prod ? 20 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many login attempts. Try again later.' },
});

/** Token verify and other unauthenticated auth routes. */
export const authPublicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: prod ? 40 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Try again later.' },
});
