import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import { isPlatformAdmin } from "@/src/lib/platform-admin";

import config from "@payload-config";

function isDevSeedKeyAuthorized(request: Request): boolean {
  const devSeedKey = process.env.DEV_SEED_KEY?.trim();
  const headerKey = request.headers.get("x-dev-seed-key")?.trim();
  return Boolean(devSeedKey && headerKey && devSeedKey === headerKey);
}

/** Eksport legacySlug → videoUrl / videoTitle (do synchronizacji mockupu). */
export async function GET(request: Request) {
  const keyOk = isDevSeedKeyAuthorized(request);
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && !keyOk) {
    return NextResponse.json(
      { message: "Na produkcji wymagany nagłówek x-dev-seed-key." },
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

  const lessons = await payload.find({
    collection: "lessons",
    limit: 500,
    pagination: false,
    overrideAccess: true,
    depth: 0,
  });

  const videos: Record<string, { videoUrl: string; videoTitle: string | null }> = {};

  for (const doc of lessons.docs) {
    const slug = typeof doc.legacySlug === "string" ? doc.legacySlug.trim() : "";
    const videoUrl = typeof doc.videoUrl === "string" ? doc.videoUrl.trim() : "";
    if (!slug || !videoUrl) continue;

    videos[slug] = {
      videoUrl,
      videoTitle:
        typeof doc.videoTitle === "string" && doc.videoTitle.trim()
          ? doc.videoTitle.trim()
          : null,
    };
  }

  return NextResponse.json({
    ok: true,
    count: Object.keys(videos).length,
    videos,
  });
}
