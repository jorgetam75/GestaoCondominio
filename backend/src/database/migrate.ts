import { initializeDatabase } from './connection.js';
import { runMigration } from './schema.js';

async function migrate() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();

    console.log('Running migrations...');
    await runMigration();

    console.log('✓ Migration completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
