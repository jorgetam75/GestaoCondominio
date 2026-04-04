import { Router } from 'express';
import {
  login,
  verifyTokenEndpoint,
  logout,
  getCurrentUser,
} from '../controllers/auth.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/auth/login
 * Login with email and password
 * Body: { email: string, password: string }
 * Returns: { access_token, refresh_token, user }
 */
router.post('/login', login);

/**
 * POST /api/auth/verify
 * Verify JWT token validity
 * Body: { token: string } or Authorization header
 * Returns: { valid: true, user }
 */
router.post('/verify', verifyTokenEndpoint);

/**
 * POST /api/auth/logout
 * Logout (requires authentication)
 */
router.post('/logout', authMiddleware, logout);

/**
 * GET /api/auth/me
 * Get current authenticated user details
 */
router.get('/me', authMiddleware, getCurrentUser);

export default router;
