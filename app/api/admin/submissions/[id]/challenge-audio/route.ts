import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import type { MediaRelation } from "@/src/features/elearning/media-api";
import { resolveMediaId } from "@/src/features/elearning/media-api";
import { sqlGetMediaFilename } from "@/src/lib/submissions-sql-fallback";
import { isPlatformAdmin } from "@/src/lib/platform-admin";

import config from "@payload-config";

type RouteParams = { params: Promise<{ id: string }> };

type ChallengeAudioItem = {
  day: number;
  mediaId: string | number;
  filename: string;
  playbackUrl: string;
  downloadUrl: string;
};

/** Lista nagrań 7-dniowego challenge dla panelu admin. */
export async function GET(_request: Request, { params }: RouteParams) {
  const { id: submissionId } = await params;

  const payload = await getPayload({ config });
  const hdrs = await headers();
  const auth = await payload.auth({ headers: hdrs });

  if (!isPlatformAdmin(auth.user)) {
    return NextResponse.json({ message: "Wymagane konto administratora." }, { status: 401 });
  }

  let doc;
  try {
    doc = await payload.findByID({
      collection: "submissions",
      id: submissionId,
      depth: 2,
      overrideAccess: true,
    });
  } catch {
    return NextResponse.json({ items: [] as ChallengeAudioItem[] });
  }

  const entries = Array.isArray(doc.studentChallengeAudios) ? doc.studentChallengeAudios : [];
  const items: ChallengeAudioItem[] = [];

  for (const entry of entries) {
    if (!entry || typeof entry !== "object") continue;
    const day = (entry as { day?: unknown }).day;
    const mediaId = resolveMediaId((entry as { audio?: MediaRelation }).audio);
    if (typeof day !== "number" || !mediaId) continue;

    const filename = (await sqlGetMediaFilename(mediaId)) ?? `dzien-${day}.webm`;
    items.push({
      day,
      mediaId,
      filename,
      playbackUrl: `/api/media-playback/${mediaId}`,
      downloadUrl: `/api/media-playback/${mediaId}?download=1`,
    });
  }

  items.sort((a, b) => a.day - b.day || String(a.mediaId).localeCompare(String(b.mediaId)));

  return NextResponse.json({ items });
}
