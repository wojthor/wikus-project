/** Jedna pula pg na instancję serverless — unika EMAXCONNSESSION na Supabase (session mode). */

import type { Pool } from "pg";

type PgGlobal = { __wikusPgPool?: Pool };

function isServerlessRuntime(): boolean {
  return Boolean(process.env.VERCEL) || process.env.NODE_ENV === "production";
}

export async function getPgPool(): Promise<Pool> {
  const g = globalThis as unknown as PgGlobal;
  if (g.__wikusPgPool) return g.__wikusPgPool;

  const uri = process.env.DATABASE_URI;
  if (!uri) {
    throw new Error("Brak DATABASE_URI.");
  }

  const { Pool: PgPool } = await import("pg");
  const pool = new PgPool({
    connectionString: uri,
    max: isServerlessRuntime() ? 1 : 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    allowExitOnIdle: true,
  });

  g.__wikusPgPool = pool;
  return pool;
}
