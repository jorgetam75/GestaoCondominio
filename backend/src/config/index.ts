import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

function parsePort(v: string | undefined, fallback: number): number {
  const n = parseInt(v ?? '', 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function parseCorsOrigins(): string | string[] {
  const raw = process.env.CORS_ORIGIN;
  if (!raw?.trim()) {
    return nodeEnv === 'production' ? [] : 'http://localhost:5173';
  }
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) {
    return nodeEnv === 'production' ? [] : 'http://localhost:5173';
  }
  return parts.length === 1 ? parts[0]! : parts;
}

export const config = {
  NODE_ENV: nodeEnv,
  isProduction: nodeEnv === 'production',
  PORT: parsePort(process.env.BACKEND_PORT, 3001),
  TRUST_PROXY: process.env.TRUST_PROXY === '1' || process.env.TRUST_PROXY === 'true',

  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parsePort(process.env.DB_PORT, 5432),
  DB_NAME: process.env.DB_NAME || 'condominio_db',
  DB_USER: process.env.DB_USER || 'condominio_user',
  DB_PASSWORD: process.env.DB_PASSWORD || 'condominio_password',
  DATABASE_URL: process.env.DATABASE_URL,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '7d',

  // Admin defaults
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@condominio.local',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',

  // CORS — comma-separated in production
  CORS_ORIGIN: parseCorsOrigins(),

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
};

const WEAK_JWT_MARKERS = ['change-in-production', 'your_super_secret_jwt_key_change_in_production'];

function jwtLooksWeak(secret: string): boolean {
  return WEAK_JWT_MARKERS.some((m) => secret.toLowerCase().includes(m.toLowerCase()));
}

export function validateConfig() {
  if (config.isProduction) {
    if (!process.env.JWT_SECRET || config.JWT_SECRET.length < 32) {
      throw new Error('FATAL: JWT_SECRET must be set and at least 32 characters in production.');
    }
    if (jwtLooksWeak(config.JWT_SECRET)) {
      throw new Error('FATAL: JWT_SECRET must be a strong unique secret in production.');
    }
    if (!process.env.CORS_ORIGIN?.trim()) {
      throw new Error(
        'FATAL: CORS_ORIGIN must be set in production (comma-separated origins if more than one).'
      );
    }
    const corsParts = process.env.CORS_ORIGIN.split(',').map((s) => s.trim()).filter(Boolean);
    if (corsParts.length === 0) {
      throw new Error('FATAL: CORS_ORIGIN must list at least one origin.');
    }

    if (!process.env.DATABASE_URL) {
      if (!process.env.DB_PASSWORD || config.DB_PASSWORD === 'condominio_password') {
        throw new Error(
          'FATAL: Set DATABASE_URL or a strong DB_PASSWORD in production (defaults are not allowed).'
        );
      }
    }

    if (!process.env.ADMIN_PASSWORD || config.ADMIN_PASSWORD === 'admin123') {
      throw new Error('FATAL: ADMIN_PASSWORD must be changed from the default in production.');
    }
  } else {
    if (!config.JWT_SECRET || jwtLooksWeak(config.JWT_SECRET)) {
      console.warn(
        '[config] JWT_SECRET is missing or weak. Use a strong secret before production.'
      );
    }
  }
}
