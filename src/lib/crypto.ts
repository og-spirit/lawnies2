import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.SETTINGS_ENCRYPTION_KEY;
  if (!key) {
    throw new Error(
      "SETTINGS_ENCRYPTION_KEY environment variable is not set. " +
        "Generate one with: openssl rand -hex 32"
    );
  }
  // Key should be 32 bytes (64 hex characters) for AES-256
  if (key.length !== 64) {
    throw new Error(
      "SETTINGS_ENCRYPTION_KEY must be 64 hex characters (32 bytes)"
    );
  }
  return Buffer.from(key, "hex");
}

export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encryptedData (all hex encoded)
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decrypt(encryptedValue: string): string {
  const key = getEncryptionKey();
  const parts = encryptedValue.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted value format");
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export function isEncrypted(value: string): boolean {
  // Check if the value matches our encrypted format (iv:authTag:data)
  const parts = value.split(":");
  if (parts.length !== 3) return false;

  const [iv, authTag, data] = parts;
  // IV should be 32 hex chars (16 bytes), authTag should be 32 hex chars (16 bytes)
  return (
    iv.length === IV_LENGTH * 2 &&
    authTag.length === AUTH_TAG_LENGTH * 2 &&
    /^[0-9a-f]+$/i.test(iv) &&
    /^[0-9a-f]+$/i.test(authTag) &&
    /^[0-9a-f]+$/i.test(data)
  );
}
