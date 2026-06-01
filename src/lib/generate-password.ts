import { randomBytes } from "crypto";

export function generateSecurePassword(length = 12): string {
  return randomBytes(length).toString("base64url").slice(0, length);
}
