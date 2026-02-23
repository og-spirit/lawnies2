import { query } from "@/lib/db";

export interface Operator {
  id: string;
  email: string;
  password_hash: string;
  business_name: string;
  phone: string;
  slug: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_checkout_session_id: string | null;
  subscription_status: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateOperatorInput {
  email: string;
  password_hash: string;
  business_name: string;
  phone: string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  stripe_checkout_session_id?: string | null;
}

export async function createOperator(
  input: CreateOperatorInput
): Promise<Operator> {
  const operators = await query<Operator>(
    `INSERT INTO operators
       (email, password_hash, business_name, phone,
        stripe_customer_id, stripe_subscription_id, stripe_checkout_session_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (email) DO NOTHING
     RETURNING *`,
    [
      input.email.toLowerCase(),
      input.password_hash,
      input.business_name,
      input.phone,
      input.stripe_customer_id || null,
      input.stripe_subscription_id || null,
      input.stripe_checkout_session_id || null,
    ]
  );
  return operators[0];
}

export async function getOperatorByEmail(
  email: string
): Promise<Operator | null> {
  const operators = await query<Operator>(
    "SELECT * FROM operators WHERE email = $1 LIMIT 1",
    [email.toLowerCase()]
  );
  return operators[0] || null;
}

export async function getOperatorByCheckoutSession(
  sessionId: string
): Promise<Operator | null> {
  const operators = await query<Operator>(
    "SELECT * FROM operators WHERE stripe_checkout_session_id = $1 LIMIT 1",
    [sessionId]
  );
  return operators[0] || null;
}

export async function getAllOperators(): Promise<Operator[]> {
  return query<Operator>(
    "SELECT * FROM operators ORDER BY created_at DESC"
  );
}

export async function updateOperatorSubscriptionStatus(
  stripeCustomerId: string,
  status: string
): Promise<void> {
  await query(
    "UPDATE operators SET subscription_status = $1, updated_at = NOW() WHERE stripe_customer_id = $2",
    [status, stripeCustomerId]
  );
}
