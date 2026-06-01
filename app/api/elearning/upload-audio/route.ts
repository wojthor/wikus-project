import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createLocalReq, getPayload } from "payload";

import config from "@payload-config";
import { createAudioMediaDocument } from "@/src/lib/create-audio-media";

/** Wgrywanie nagrania ucznia (stabilniejsze niż POST /api/media przez REST Drizzle). */
export async function POST(request: Request) {
  const payload = await getPayload({ config });
  const hdrs = await headers();
  const auth = await payload.auth({ headers: hdrs });

  if (!auth.user) {
    return NextResponse.json({ message: "Wymagane logowanie." }, { status: 401 });
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

  const buffer = Buffer.from(await file.arrayBuffer());
  const name =
    (typeof formData.get("filename") === "string" && formData.get("filename")) ||
    file.name?.trim() ||
    `nagranie-${Date.now()}.webm`;

  const req = await createLocalReq({ user: auth.user }, payload);

  try {
    const doc = await createAudioMediaDocument(payload, {
      alt: "Nagranie głosowe (uczeń)",
      buffer,
      name: String(name),
      mimetype: file.type || "audio/webm",
      req,
      overrideAccess: false,
    });

    return NextResponse.json({ doc });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Nie udało się wgrać nagrania.";
    console.error("[elearning/upload-audio]", err);
    return NextResponse.json({ message }, { status: 500 });
  }
}
