import { query } from "@/lib/db";

export interface PendingSignup {
  id: string;
  email: string;
  password_hash: string;
  business_name: string;
  phone: string;
  stripe_checkout_session_id: string | null;
  created_at: Date;
  expires_at: Date;
}

export interface CreatePendingSignupInput {
  email: string;
  password_hash: string;
  business_name: string;
  phone: string;
}

export async function createPendingSignup(
  input: CreatePendingSignupInput
): Promise<PendingSignup> {
  const signups = await query<PendingSignup>(
    `INSERT INTO pending_signups (email, password_hash, business_name, phone)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET
       password_hash = EXCLUDED.password_hash,
       business_name = EXCLUDED.business_name,
       phone = EXCLUDED.phone,
       stripe_checkout_session_id = NULL,
       created_at = NOW(),
       expires_at = NOW() + INTERVAL '24 hours'
     RETURNING *`,
    [
      input.email.toLowerCase(),
      input.password_hash,
      input.business_name,
      input.phone,
    ]
  );
  return signups[0];
}

export async function getPendingSignupById(
  id: string
): Promise<PendingSignup | null> {
  const signups = await query<PendingSignup>(
    "SELECT * FROM pending_signups WHERE id = $1 AND expires_at > NOW() LIMIT 1",
    [id]
  );
  return signups[0] || null;
}

export async function getPendingSignupBySessionId(
  sessionId: string
): Promise<PendingSignup | null> {
  const signups = await query<PendingSignup>(
    "SELECT * FROM pending_signups WHERE stripe_checkout_session_id = $1 LIMIT 1",
    [sessionId]
  );
  return signups[0] || null;
}

export async function updatePendingSignupCheckoutSession(
  id: string,
  sessionId: string
): Promise<PendingSignup | null> {
  const signups = await query<PendingSignup>(
    `UPDATE pending_signups
     SET stripe_checkout_session_id = $1
     WHERE id = $2
     RETURNING *`,
    [sessionId, id]
  );
  return signups[0] || null;
}

export async function deletePendingSignup(id: string): Promise<void> {
  await query("DELETE FROM pending_signups WHERE id = $1", [id]);
}
