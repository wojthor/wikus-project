/**
 * Jedna instancja pg.Pool dla całej aplikacji (Payload + zapytania SQL).
 * Bez tego na Vercel/Supabase szybko kończy się limit połączeń (session mode).
 */

import pg from "pg";

type PgGlobal = { __wikusPgSingleton?: pg.Pool };

function isServerlessRuntime(): boolean {
  return Boolean(process.env.VERCEL) || process.env.NODE_ENV === "production";
}

function normalizeDatabaseUri(uri: string): string {
  try {
    const url = new URL(uri);
    if (url.hostname.includes("pooler.supabase.com") && url.port === "6543") {
      if (!url.searchParams.has("pgbouncer")) {
        url.searchParams.set("pgbouncer", "true");
      }
    }
    return url.toString();
  } catch {
    return uri;
  }
}

function defaultPoolOptions(): pg.PoolConfig {
  const raw = process.env.DATABASE_URI;
  if (!raw) {
    throw new Error("Brak DATABASE_URI.");
  }

  return {
    connectionString: normalizeDatabaseUri(raw),
    max: isServerlessRuntime() ? 1 : 10,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 20_000,
    allowExitOnIdle: true,
  };
}

/** Współdzielona pula — używana przez media-sql, submissions-sql i Payload. */
export function getSharedPgPool(): pg.Pool {
  const g = globalThis as unknown as PgGlobal;
  if (g.__wikusPgSingleton) return g.__wikusPgSingleton;

  g.__wikusPgSingleton = new pg.Pool(defaultPoolOptions());
  return g.__wikusPgSingleton;
}

/**
 * Payload woła `new pg.Pool(poolOptions)` — zwracamy zawsze tę samą pulę.
 */
export function createPgModuleWithSharedPool(): typeof pg {
  return {
    ...pg,
    Pool: function SharedPool(
      this: unknown,
      options?: pg.PoolConfig,
    ): pg.Pool {
      const g = globalThis as unknown as PgGlobal;
      if (!g.__wikusPgSingleton) {
        g.__wikusPgSingleton = new pg.Pool(options ?? defaultPoolOptions());
      }
      return g.__wikusPgSingleton;
    } as unknown as typeof pg.Pool,
  };
}
