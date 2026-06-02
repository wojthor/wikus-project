/**
 * Jedna instancja pg.Pool dla całej aplikacji (Payload + zapytania SQL).
 * Supabase Transaction pooler (port 6543) + Vercel serverless.
 */

import pg from "pg";

type PgGlobal = { __wikusPgSingleton?: pg.Pool };

function isServerlessRuntime(): boolean {
  return Boolean(process.env.VERCEL) || process.env.NODE_ENV === "production";
}

/** Transaction pooler Supabase wymaga tego parametru dla Drizzle/Payload. */
export function normalizeDatabaseUri(uri: string): string {
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

/**
 * Payload przy init woła pool.connect() i nie zwalnia klienta (connectWithReconnect).
 * Przy max: 1 każde kolejne zapytanie czeka w nieskończoność → login 500.
 * Na serverless: max >= 3.
 */
export function buildPgPoolConfig(): pg.PoolConfig {
  const raw = process.env.DATABASE_URI;
  if (!raw) {
    throw new Error("Brak DATABASE_URI.");
  }

  return {
    connectionString: normalizeDatabaseUri(raw),
    max: isServerlessRuntime() ? 3 : 10,
    min: 0,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 15_000,
    allowExitOnIdle: true,
  };
}

/** Współdzielona pula — używana przez media-sql, submissions-sql i Payload. */
export function getSharedPgPool(): pg.Pool {
  const g = globalThis as unknown as PgGlobal;
  if (g.__wikusPgSingleton) return g.__wikusPgSingleton;

  g.__wikusPgSingleton = new pg.Pool(buildPgPoolConfig());
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
        const config = options?.connectionString
          ? {
              ...buildPgPoolConfig(),
              ...options,
              connectionString: normalizeDatabaseUri(String(options.connectionString)),
            }
          : buildPgPoolConfig();
        g.__wikusPgSingleton = new pg.Pool(config);
      }
      return g.__wikusPgSingleton;
    } as unknown as typeof pg.Pool,
  };
}
