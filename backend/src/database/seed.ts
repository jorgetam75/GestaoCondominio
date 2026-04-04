import bcrypt from 'bcrypt';
import { getPool } from './connection.js';
import { initializeDatabase } from './connection.js';
import { config } from '../config/index.js';

async function seedDatabase() {
  try {
    console.log('Seeding database...');
    await initializeDatabase();

    const pool = getPool();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Check if admin already exists
      const adminExists = await client.query(
        "SELECT COUNT(*) FROM users WHERE role = 'ADMIN'"
      );

      if (adminExists.rows[0].count > 0) {
        console.log('Database already seeded. Skipping seed operation.');
        await client.query('COMMIT');
        return;
      }

      console.log('Creating initial admin user...');

      // Create admin user
      const adminPasswordHash = await bcrypt.hash(config.ADMIN_PASSWORD, 10);

      const adminResult = await client.query(
        `INSERT INTO admins (name, email)
         VALUES ($1, $2)
         RETURNING id`,
        ['System Administrator', config.ADMIN_EMAIL]
      );

      const adminId = adminResult.rows[0].id;

      await client.query(
        `INSERT INTO users (email, password_hash, role, admin_id, is_active)
         VALUES ($1, $2, $3, $4, $5)`,
        [config.ADMIN_EMAIL, adminPasswordHash, 'ADMIN', adminId, true]
      );

      await client.query('COMMIT');

      console.log('✓ Database seeding completed');
      console.log(`\n📝 Default Admin Credentials:`);
      console.log(`   Email: ${config.ADMIN_EMAIL}`);
      console.log(`   Password: ${config.ADMIN_PASSWORD}`);
      console.log(`   (Change this password after first login!)`);
    } finally {
      client.release();
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
