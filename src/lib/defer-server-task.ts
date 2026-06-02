import { after } from "next/server";

/** Uruchamia pracę po wysłaniu odpowiedzi HTTP (maile, dodatkowe zapytania). */
export function deferServerTask(label: string, task: () => Promise<void>): void {
  after(async () => {
    try {
      await task();
    } catch (err) {
      console.error(`[${label}]`, err);
    }
  });
}
