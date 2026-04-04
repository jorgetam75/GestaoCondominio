import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../services/auth.js';

type JWTPayload = {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

type UserRole = 'ADMIN' | 'MANAGER' | 'RESIDENT';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware to verify JWT token
 * Sets req.user if token is valid
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Missing or invalid authorization header',
    });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
    return;
  }

  req.user = payload;
  next();
}

/**
 * Middleware to require specific roles
 * Usage: requireRole('ADMIN', 'MANAGER')
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    if (!roles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions for this action',
      });
      return;
    }

    next();
  };
}

/**
 * Middleware to allow optional authentication
 * Sets req.user if token is provided and valid, continues either way
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
}
