import config from "@payload-config";
import { headers } from "next/headers";
import { getPayload } from "payload";

import { isPlatformAdmin } from "@/src/lib/platform-admin";

export type ElearningUser = {
  id: number | string;
  email: string;
  displayName: string;
  isCourseAdmin: boolean;
};

function buildDisplayName(user: {
  email: string;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}): string {
  const fullName = user.fullName?.trim();
  if (fullName) return fullName;

  const fromParts = [user.firstName?.trim(), user.lastName?.trim()].filter(Boolean).join(" ");
  if (fromParts) return fromParts;

  return user.email;
}

export async function getElearningUser(): Promise<ElearningUser | null> {
  const payload = await getPayload({ config });
  const headerList = await headers();
  const { user } = await payload.auth({ headers: headerList });

  if (!user?.id || !user.email) {
    return null;
  }

  const email = user.email;

  return {
    id: user.id,
    email,
    displayName: buildDisplayName({
      email,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
    }),
    isCourseAdmin: isPlatformAdmin(user),
  };
}
