import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import { seedMockupCourse } from "@/src/lib/seed-mockup-course";
import { isPlatformAdmin } from "@/src/lib/platform-admin";

import config from "@payload-config";

function isDevSeedKeyAuthorized(request: Request): boolean {
  const devSeedKey = process.env.DEV_SEED_KEY?.trim();
  const headerKey = request.headers.get("x-dev-seed-key")?.trim();
  return Boolean(devSeedKey && headerKey && devSeedKey === headerKey);
}

/** Importuje moduły i lekcje z mockupu do Payload (dev: admin; prod: tylko x-dev-seed-key). */
export async function POST(request: Request) {
  const keyOk = isDevSeedKeyAuthorized(request);
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && !keyOk) {
    return NextResponse.json(
      {
        message:
          "Na produkcji wymagany nagłówek x-dev-seed-key zgodny z DEV_SEED_KEY w env.",
      },
      { status: 403 },
    );
  }

  const payload = await getPayload({ config });

  if (!keyOk) {
    const hdrs = await headers();
    const auth = await payload.auth({ headers: hdrs });
    if (!isPlatformAdmin(auth.user)) {
      return NextResponse.json({ message: "Wymagane konto administratora." }, { status: 401 });
    }
  }

  let reset = false;
  try {
    const body = (await request.json()) as { reset?: boolean };
    reset = Boolean(body.reset);
  } catch {
    // domyślnie bez resetu
  }

  try {
    const result = await seedMockupCourse(payload, { reset });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[seed-course]", err);
    const message = err instanceof Error ? err.message : "Import nie powiódł się.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
