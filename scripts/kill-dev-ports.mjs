import { execSync } from "node:child_process";

for (const port of [3000, 3001, 3002]) {
  try {
    execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null`, { stdio: "ignore" });
  } catch {
    // port wolny
  }
}

console.log("Porty dev 3000–3002 zwolnione (jeśli były zajęte).");
