import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { resetUsersKeepAdmin } from "@/src/lib/reset-users-keep-admin";
import { isPlatformAdmin } from "@/src/lib/platform-admin";

/** Usuwa wszystkich użytkowników oprócz kontakt@wiktorszyszkowski.pl + zgłoszenia i media. Tylko dev. */
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "Niedostępne na produkcji." }, { status: 403 });
  }

  const devSeedKey = process.env.DEV_SEED_KEY?.trim();
  const headerKey = request.headers.get("x-dev-seed-key")?.trim();
  const keyOk = Boolean(devSeedKey && headerKey && devSeedKey === headerKey);

  const hdrs = await headers();
  const { getPayload } = await import("payload");
  const config = (await import("@payload-config")).default;
  const payload = await getPayload({ config });
  const auth = await payload.auth({ headers: hdrs });

  if (!keyOk && !isPlatformAdmin(auth.user)) {
    return NextResponse.json({ message: "Wymagane konto administratora." }, { status: 401 });
  }

  try {
    const result = await resetUsersKeepAdmin();
    return NextResponse.json({
      ok: true,
      message: `Zostało tylko konto ${result.adminEmail}.`,
      ...result,
    });
  } catch (err) {
    console.error("[reset-users]", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Błąd czyszczenia." },
      { status: 500 },
    );
  }
}
