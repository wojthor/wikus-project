const DEFAULT_PLATFORM_ADMIN_EMAIL = "kontakt@wiktorszyszkowski.pl";

export const PLATFORM_ADMIN_EMAIL = (
  process.env.PLATFORM_ADMIN_EMAIL ?? DEFAULT_PLATFORM_ADMIN_EMAIL
)
  .trim()
  .toLowerCase();

type PlatformAdminUser =
  | {
      email?: string | null;
    }
  | null
  | undefined;

export function isPlatformAdmin(user: PlatformAdminUser): boolean {
  if (!user?.email) return false;
  return user.email.trim().toLowerCase() === PLATFORM_ADMIN_EMAIL;
}

export function resolveAdminFlag(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === PLATFORM_ADMIN_EMAIL;
}
