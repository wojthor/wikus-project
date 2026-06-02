import type { Pool } from "pg";

import { getSharedPgPool } from "@/src/lib/pg-singleton";

export async function getPgPool(): Promise<Pool> {
  return getSharedPgPool();
}
