/**
 * Seed script to create the initial super admin user.
 *
 * Usage:
 *   DATABASE_URL=... npm run seed-admin
 *
 * Or with environment variables set:
 *   ADMIN_EMAIL=admin@example.com ADMIN_NAME="Admin Name" ADMIN_PASSWORD=secret npm run seed-admin
 *
 * If env vars are not set, uses defaults below (change before running in production!).
 */
import { Pool } from "pg";
import bcrypt from "bcrypt";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is required");
  process.exit(1);
}

const email = process.env.ADMIN_EMAIL || "admin@lawnies.com.au";
const name = process.env.ADMIN_NAME || "Lawnies Admin";
const password = process.env.ADMIN_PASSWORD;

if (!password) {
  console.error("Error: ADMIN_PASSWORD environment variable is required");
  console.error("Example: ADMIN_PASSWORD=mySecurePass123 npm run seed-admin");
  process.exit(1);
}

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    // Check if admin already exists
    const existing = await pool.query(
      "SELECT id, email FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (existing.rows.length > 0) {
      console.log(`Admin user already exists: ${email}`);
      console.log("To reset password, delete the user first:");
      console.log(
        `  DELETE FROM users WHERE email = '${email.toLowerCase()}';`
      );
      return;
    }

    const passwordHash = await bcrypt.hash(password as string, 12);

    const result = await pool.query(
      `INSERT INTO users (email, name, password_hash, role)
       VALUES ($1, $2, $3, 'super_admin')
       RETURNING id, email, name, role`,
      [email.toLowerCase(), name, passwordHash]
    );

    console.log("✅ Super admin created successfully:");
    console.log(`   Email: ${result.rows[0].email}`);
    console.log(`   Name:  ${result.rows[0].name}`);
    console.log(`   Role:  ${result.rows[0].role}`);
    console.log(`   ID:    ${result.rows[0].id}`);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
