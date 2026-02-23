import { query } from "@/lib/db";
import { encrypt, decrypt } from "@/lib/crypto";

export interface SystemSetting {
  id: number;
  category: string;
  key: string;
  value: string | null;
  is_encrypted: boolean;
  updated_at: Date;
  updated_by: string | null;
}

// Sensitive keys that should be encrypted
const SENSITIVE_KEYS = ["password", "api_key", "secret", "token"];

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEYS.some((sensitive) =>
    key.toLowerCase().includes(sensitive)
  );
}

export async function getSetting(
  category: string,
  key: string
): Promise<string | null> {
  const results = await query<SystemSetting>(
    `SELECT * FROM system_settings WHERE category = $1 AND key = $2`,
    [category, key]
  );
  if (!results[0]) return null;
  const setting = results[0];
  if (setting.is_encrypted && setting.value) {
    return decrypt(setting.value);
  }
  return setting.value;
}

export async function getSettingsByCategory(
  category: string
): Promise<Record<string, string>> {
  const results = await query<SystemSetting>(
    `SELECT * FROM system_settings WHERE category = $1`,
    [category]
  );
  const settings: Record<string, string> = {};
  for (const setting of results) {
    if (setting.value !== null) {
      settings[setting.key] = setting.is_encrypted
        ? decrypt(setting.value)
        : setting.value;
    }
  }
  return settings;
}

export async function getSettingsByCategoryMasked(
  category: string
): Promise<Record<string, string>> {
  const results = await query<SystemSetting>(
    `SELECT * FROM system_settings WHERE category = $1`,
    [category]
  );
  const settings: Record<string, string> = {};
  for (const setting of results) {
    if (setting.value !== null) {
      settings[setting.key] = setting.is_encrypted ? "••••••••" : setting.value;
    }
  }
  return settings;
}

export async function setSetting(
  category: string,
  key: string,
  value: string | null,
  userId: string
): Promise<void> {
  const shouldEncrypt = isSensitiveKey(key) && value !== null;
  const storedValue = shouldEncrypt && value ? encrypt(value) : value;

  await query(
    `INSERT INTO system_settings (category, key, value, is_encrypted, updated_by)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (category, key)
     DO UPDATE SET value = $3, is_encrypted = $4, updated_by = $5, updated_at = NOW()`,
    [category, key, storedValue, shouldEncrypt, userId]
  );
}

export async function setSettingsBulk(
  category: string,
  settings: Record<string, string | null>,
  userId: string
): Promise<void> {
  for (const [key, value] of Object.entries(settings)) {
    if (value === "••••••••") continue; // skip masked values
    await setSetting(category, key, value, userId);
  }
}

export async function deleteSettingsByCategory(
  category: string
): Promise<void> {
  await query(`DELETE FROM system_settings WHERE category = $1`, [category]);
}

// Email-specific helpers
export type EmailProvider = "smtp" | "sendgrid";

export interface EmailSettings {
  provider: EmailProvider;
  smtp_host?: string;
  smtp_port?: string;
  smtp_username?: string;
  smtp_password?: string;
  smtp_use_tls?: string;
  from_email?: string;
  from_name?: string;
  sendgrid_api_key?: string;
}

export async function getEmailSettings(): Promise<EmailSettings | null> {
  const settings = await getSettingsByCategory("email");
  if (Object.keys(settings).length === 0) return null;
  return settings as unknown as EmailSettings;
}

export async function getEmailSettingsMasked(): Promise<EmailSettings | null> {
  const settings = await getSettingsByCategoryMasked("email");
  if (Object.keys(settings).length === 0) return null;
  return settings as unknown as EmailSettings;
}

export async function saveEmailSettings(
  settings: EmailSettings,
  userId: string
): Promise<void> {
  await deleteSettingsByCategory("email");
  const entries = Object.entries(settings).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );
  for (const [key, value] of entries) {
    await setSetting("email", key, value as string, userId);
  }
}
