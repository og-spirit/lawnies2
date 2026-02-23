import { query } from "@/lib/db";

export interface User {
  id: string;
  email: string;
  email_verified: Date | null;
  password_hash: string | null;
  name: string;
  role: "super_admin";
  created_at: Date;
  updated_at: Date;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await query<User>(
    "SELECT * FROM users WHERE email = $1 LIMIT 1",
    [email.toLowerCase()]
  );
  return users[0] || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await query<User>(
    "SELECT * FROM users WHERE id = $1 LIMIT 1",
    [id]
  );
  return users[0] || null;
}

export async function createAdminUser(input: {
  email: string;
  name: string;
  password_hash: string;
}): Promise<User> {
  const users = await query<User>(
    `INSERT INTO users (email, name, password_hash, role)
     VALUES ($1, $2, $3, 'super_admin')
     RETURNING *`,
    [input.email.toLowerCase(), input.name, input.password_hash]
  );
  return users[0];
}
