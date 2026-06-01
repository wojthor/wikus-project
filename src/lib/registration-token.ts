import { randomUUID } from "crypto";

const TOKEN_VALIDITY_MS = 48 * 60 * 60 * 1000;

export function createRegistrationToken(): { token: string; expiration: string } {
  return {
    token: randomUUID(),
    expiration: new Date(Date.now() + TOKEN_VALIDITY_MS).toISOString(),
  };
}

export function isRegistrationTokenValid(expiration: string | Date | null | undefined): boolean {
  if (!expiration) return false;
  const expiresAt = expiration instanceof Date ? expiration : new Date(expiration);
  if (Number.isNaN(expiresAt.getTime())) return false;
  return expiresAt.getTime() > Date.now();
}
