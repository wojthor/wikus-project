import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import config from "@payload-config";
import { isPlatformAdmin } from "@/src/lib/platform-admin";

/** Stabilne wgrywanie nagrań z panelu admin (omija błąd REST /api/media). */
export async function POST(request: Request) {
  const payload = await getPayload({ config });
  const hdrs = await headers();
  const auth = await payload.auth({ headers: hdrs });

  if (!isPlatformAdmin(auth.user)) {
    return NextResponse.json({ message: "Wymagane konto administratora." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Nieprawidłowe dane formularza." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "Brak pliku audio." }, { status: 400 });
  }

  const alt =
    (typeof formData.get("alt") === "string" && formData.get("alt")) ||
    "Nagranie głosowe";

  const buffer = Buffer.from(await file.arrayBuffer());
  const name =
    file.name?.trim() ||
    `nagranie-${Date.now()}.webm`;

  try {
    const doc = await payload.create({
      collection: "media",
      data: { alt },
      file: {
        data: buffer,
        mimetype: file.type || "audio/webm",
        name,
        size: buffer.length,
      },
      user: auth.user,
      overrideAccess: false,
    });

    return NextResponse.json({ doc });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Nie udało się zapisać nagrania w bazie.";
    console.error("[upload-audio]", err);
    return NextResponse.json({ message }, { status: 500 });
  }
}
