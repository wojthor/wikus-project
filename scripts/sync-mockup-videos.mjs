/**
 * Kopiuje linki wideo z bazy (Payload) do src/data/course-mockup/course.json.
 *
 *   pnpm dev   # w osobnym terminalu
 *   pnpm sync:mockup-videos
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const coursePath = path.join(root, "src/data/course-mockup/course.json");

function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] == null) process.env[key] = val;
  }
}

async function main() {
  loadEnvLocal();

  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
  const headers = { Accept: "application/json" };
  const devSeedKey = process.env.DEV_SEED_KEY?.trim();
  if (devSeedKey) headers["x-dev-seed-key"] = devSeedKey;

  const url = `${base}/api/dev/export-lesson-videos`;
  console.log(`GET ${url} …`);

  const res = await fetch(url, { headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error(data.message ?? `HTTP ${res.status}`);
    if (res.status === 401 && !devSeedKey) {
      console.error("Ustaw DEV_SEED_KEY w .env.local albo wywołaj jako zalogowany admin w przeglądarce.");
    }
    process.exit(1);
  }

  const videos = data.videos ?? {};
  const course = JSON.parse(fs.readFileSync(coursePath, "utf8"));

  let merged = 0;
  let cleared = 0;

  for (const mod of course) {
    for (const lesson of mod.lessons ?? []) {
      const fromDb = videos[lesson.id];
      if (fromDb?.videoUrl) {
        lesson.hasVideo = true;
        lesson.videoUrl = fromDb.videoUrl;
        if (fromDb.videoTitle) lesson.videoTitle = fromDb.videoTitle;
        merged += 1;
      } else if (lesson.hasVideo === false) {
        delete lesson.videoUrl;
        cleared += 1;
      }
    }
  }

  fs.writeFileSync(coursePath, `${JSON.stringify(course, null, 2)}\n`, "utf8");

  console.log(
    `Zapisano ${coursePath}: ${merged} lekcji z linkiem wideo z bazy, ${cleared} bez wideo (hasVideo: false).`,
  );
  console.log(`W bazie było ${data.count ?? 0} lekcji z videoUrl.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
