import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function removeDir(target) {
  fs.rmSync(target, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 200,
  });
}

const entries = fs.readdirSync(root, { withFileTypes: true });
let removed = 0;

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  if (entry.name !== ".next" && !entry.name.startsWith(".next")) continue;

  const target = path.join(root, entry.name);
  try {
    removeDir(target);
    console.log(`Usunięto: ${entry.name}`);
    removed += 1;
  } catch (err) {
    console.error(`Nie udało się usunąć ${entry.name}:`, err instanceof Error ? err.message : err);
    console.error("Zatrzymaj `pnpm dev` (Ctrl+C) i uruchom ponownie: pnpm dev:clean");
    process.exit(1);
  }
}

if (removed === 0) {
  console.log("Brak folderu .next — cache już czysty.");
} else {
  console.log(`Wyczyszczono ${removed} folder(ów) cache Next.js.`);
}
