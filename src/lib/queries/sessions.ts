import { query } from "@/lib/db";

export interface Session {
  id: string;
  session_token: string;
  user_id: string;
  expires: Date;
}

export async function createSession(
  sessionToken: string,
  userId: string,
  expires: Date
): Promise<Session> {
  const sessions = await query<Session>(
    `INSERT INTO sessions (session_token, user_id, expires)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [sessionToken, userId, expires]
  );
  return sessions[0];
}

export async function getSessionByToken(
  sessionToken: string
): Promise<Session | null> {
  const sessions = await query<Session>(
    "SELECT * FROM sessions WHERE session_token = $1 LIMIT 1",
    [sessionToken]
  );
  return sessions[0] || null;
}

export async function deleteSession(sessionToken: string): Promise<void> {
  await query("DELETE FROM sessions WHERE session_token = $1", [sessionToken]);
}

export async function updateSessionExpiry(
  sessionToken: string,
  expires: Date
): Promise<Session | null> {
  const sessions = await query<Session>(
    "UPDATE sessions SET expires = $1 WHERE session_token = $2 RETURNING *",
    [expires, sessionToken]
  );
  return sessions[0] || null;
}
