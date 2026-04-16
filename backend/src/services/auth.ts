import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config/index.js';

type JWTPayload = {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT tokens (access + refresh)
 */
export function generateTokens(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  const subject = { sub: payload.sub, email: payload.email, role: payload.role };
  const accessOpts: SignOptions = {
    expiresIn: config.JWT_EXPIRATION as SignOptions['expiresIn'],
    algorithm: 'HS256',
  };
  const refreshOpts: SignOptions = {
    expiresIn: '30d' as SignOptions['expiresIn'],
    algorithm: 'HS256',
  };

  const accessToken = jwt.sign(subject, config.JWT_SECRET, accessOpts);
  const refreshToken = jwt.sign(subject, config.JWT_SECRET, refreshOpts);

  return { accessToken, refreshToken };
}

/**
 * Verify JWT token and extract payload
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    }) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Decode JWT without verification (for debugging)
 */
export function decodeToken(token: string): any {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
}
