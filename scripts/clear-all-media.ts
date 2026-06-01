import fs from "fs/promises";
import path from "path";
import { getPayload } from "payload";

import config from "../payload.config";

async function main() {
  const payload = await getPayload({ config });

  const submissions = await payload.find({
    collection: "submissions",
    limit: 2000,
    overrideAccess: true,
  });

  for (const doc of submissions.docs) {
    await payload.update({
      collection: "submissions",
      id: doc.id,
      data: { teacherAudio: null, studentAudio: null },
      overrideAccess: true,
    });
  }

  let totalDeleted = 0;
  let page = 1;
  while (true) {
    const batch = await payload.find({
      collection: "media",
      limit: 100,
      page,
      overrideAccess: true,
    });
    if (!batch.docs.length) break;
    for (const doc of batch.docs) {
      await payload.delete({ collection: "media", id: doc.id, overrideAccess: true });
      totalDeleted += 1;
    }
    if (!batch.hasNextPage) break;
    page += 1;
  }

  const mediaDir = path.join(process.cwd(), "media");
  try {
    const entries = await fs.readdir(mediaDir);
    for (const name of entries) {
      if (name === ".gitkeep") continue;
      await fs.rm(path.join(mediaDir, name), { force: true, recursive: true });
    }
  } catch {
    // ignore
  }

  // eslint-disable-next-line no-console
  console.log(
    `Gotowe: usunięto ${totalDeleted} rekordów Media, wyczyszczono audio na ${submissions.docs.length} zgłoszeniach.`,
  );

  process.exit(0);
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
