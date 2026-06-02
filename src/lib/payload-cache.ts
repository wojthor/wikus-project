import config from "@payload-config";
import { getPayload, type Payload } from "payload";

type PayloadGlobal = { __wikusPayload?: Promise<Payload> };

/** Jedna instancja Payload na warm lambda — mniej połączeń do Postgres. */
export async function getCachedPayload(): Promise<Payload> {
  const g = globalThis as unknown as PayloadGlobal;
  if (g.__wikusPayload) return g.__wikusPayload;

  const promise = getPayload({ config });
  g.__wikusPayload = promise;

  try {
    return await promise;
  } catch (err) {
    delete g.__wikusPayload;
    throw err;
  }
}
