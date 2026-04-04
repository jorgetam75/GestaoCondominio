import dotenv from 'dotenv';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.BACKEND_PORT || 3001,
  
  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
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

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Optional: Third-party services
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
};

export function validateConfig() {
  if (!config.JWT_SECRET || config.JWT_SECRET.includes('change-in-production')) {
    console.warn('⚠️  JWT_SECRET is not set or using default value. Set JWT_SECRET in .env for production.');
  }
}
