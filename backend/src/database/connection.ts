import pg from 'pg';
import { config } from '../config/index.js';

const { Pool } = pg;

let pool: pg.Pool;

export async function initializeDatabase() {
  try {
    const connectionConfig = config.DATABASE_URL
      ? { connectionString: config.DATABASE_URL }
      : {
          host: config.DB_HOST,
          port: config.DB_PORT,
          database: config.DB_NAME,
          user: config.DB_USER,
          password: config.DB_PASSWORD,
        };

    pool = new Pool(connectionConfig);

    // Test connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    console.log('Connected to PostgreSQL database');
    return pool;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

export function getPool(): pg.Pool {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initializeDatabase() first.');
  }
  return pool;
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    console.log('Database connection closed');
  }
}

// Export query helper
export async function query(text: string, params?: any[]) {
  return getPool().query(text, params);
}
