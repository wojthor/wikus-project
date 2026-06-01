/**
 * Wywołuje POST /api/dev/reset-users (dev server musi działać).
 * Klucz: DEV_SEED_KEY w .env.local LUB zalogowany admin (cookie w przeglądarce).
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

loadEnvLocal();

const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const key = process.env.DEV_SEED_KEY?.trim();

const headers = { "Content-Type": "application/json" };
if (key) headers["x-dev-seed-key"] = key;

const res = await fetch(`${base}/api/dev/reset-users`, { method: "POST", headers });

let body;
try {
  body = await res.json();
} catch {
  body = { message: await res.text() };
}

console.log(JSON.stringify(body, null, 2));

if (!res.ok) {
  if (!key) {
    console.error(
      "\nBrak DEV_SEED_KEY — dodaj do .env.local albo wywołaj jako admin:\n" +
        `fetch("${base}/api/dev/reset-users", { method: "POST" })`,
    );
  }
  process.exit(1);
}

process.exit(0);
