/**
 * Import mockupu kursu przez API (serwer musi działać: pnpm dev lub produkcja).
 *
 *   pnpm seed:course
 *   pnpm seed:course -- --reset
 *
 * W .env.local: NEXT_PUBLIC_SITE_URL, opcjonalnie DEV_SEED_KEY (prod wymaga klucza).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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

  const reset = process.argv.includes("--reset");
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
  const devSeedKey = process.env.DEV_SEED_KEY?.trim();

  const headers = { "Content-Type": "application/json" };
  if (devSeedKey) {
    headers["x-dev-seed-key"] = devSeedKey;
  }

  const url = `${base}/api/dev/seed-course`;
  console.log(`POST ${url}${reset ? " (reset)" : ""} …`);

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ reset }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error(data.message ?? `Błąd HTTP ${res.status}`);
    if (res.status === 401 && !devSeedKey) {
      console.error(
        "Podpowiedź: ustaw DEV_SEED_KEY w .env.local albo uruchom fetch z konsoli /admin (zalogowany admin).",
      );
    }
    process.exit(1);
  }

  console.log(data.message ?? "OK");
  console.log(JSON.stringify(data, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
