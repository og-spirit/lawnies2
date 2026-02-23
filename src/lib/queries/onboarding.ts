import { query } from "@/lib/db";

export interface OnboardingResponse {
  id: string;
  operator_id: string | null;
  session_id: string | null;
  responses: Record<string, string>;
  submitted_at: Date;
}

export async function saveOnboardingResponse(
  operatorId: string | null,
  sessionId: string | null,
  responses: Record<string, string>
): Promise<OnboardingResponse> {
  const results = await query<OnboardingResponse>(
    `INSERT INTO onboarding_responses (operator_id, session_id, responses)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [operatorId, sessionId, JSON.stringify(responses)]
  );
  return results[0];
}

export async function getOnboardingResponseBySession(
  sessionId: string
): Promise<OnboardingResponse | null> {
  const results = await query<OnboardingResponse>(
    "SELECT * FROM onboarding_responses WHERE session_id = $1 LIMIT 1",
    [sessionId]
  );
  return results[0] || null;
}
