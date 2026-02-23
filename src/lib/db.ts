import { Pool } from "pg";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
});

const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
});

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
      max: 10,
    });
  }
  return pool;
}

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const pool = getPool();
  const result = await pool.query(text, params);
  return result.rows;
}
