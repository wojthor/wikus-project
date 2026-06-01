import { loadEnvConfig } from "@next/env";
import fs from "fs/promises";
import path from "path";
import { getPayload } from "payload";

import { PLATFORM_ADMIN_EMAIL } from "@/src/lib/platform-admin";

import config from "@payload-config";

loadEnvConfig(process.cwd());

async function deleteAllPages(collection: "submissions" | "media") {
  const payload = await getPayload({ config });
  let deleted = 0;

  while (true) {
    const batch = await payload.find({
      collection,
      limit: 100,
      pagination: true,
      overrideAccess: true,
    });
    if (!batch.docs.length) break;
    for (const doc of batch.docs) {
      await payload.delete({ collection, id: doc.id, overrideAccess: true });
      deleted += 1;
    }
  }

  return deleted;
}

async function clearLocalMediaDir() {
  const mediaDir = path.join(process.cwd(), "media");
  try {
    const entries = await fs.readdir(mediaDir);
    for (const name of entries) {
      if (name === ".gitkeep") continue;
      await fs.rm(path.join(mediaDir, name), { force: true, recursive: true });
    }
  } catch {
    // brak katalogu
  }
}

export async function resetUsersKeepAdmin(): Promise<{
  adminEmail: string;
  submissionsDeleted: number;
  mediaDeleted: number;
  usersDeleted: number;
  adminId: string | number | null;
  removedEmails: string[];
}> {
  const payload = await getPayload({ config });
  const adminEmail = PLATFORM_ADMIN_EMAIL;

  const submissionsDeleted = await deleteAllPages("submissions");
  const mediaDeleted = await deleteAllPages("media");
  await clearLocalMediaDir();

  const usersResult = await payload.find({
    collection: "users",
    limit: 500,
    pagination: false,
    overrideAccess: true,
  });

  let usersDeleted = 0;
  let adminId: string | number | null = null;
  const removedEmails: string[] = [];

  for (const user of usersResult.docs) {
    const email = typeof user.email === "string" ? user.email.trim().toLowerCase() : "";
    if (email === adminEmail) {
      adminId = user.id;
      await payload.update({
        collection: "users",
        id: user.id,
        data: {
          admin: true,
          registrationToken: null,
          tokenExpiration: null,
        },
        overrideAccess: true,
      });
      continue;
    }

    removedEmails.push(email || String(user.id));
    await payload.delete({ collection: "users", id: user.id, overrideAccess: true });
    usersDeleted += 1;
  }

  return {
    adminEmail,
    submissionsDeleted,
    mediaDeleted,
    usersDeleted,
    adminId,
    removedEmails,
  };
}
