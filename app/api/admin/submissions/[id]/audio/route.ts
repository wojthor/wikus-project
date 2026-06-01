import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import {
  sqlGetMediaFilename,
  sqlGetSubmissionMediaId,
} from "@/src/lib/submissions-sql-fallback";
import { isPlatformAdmin } from "@/src/lib/platform-admin";

import config from "@payload-config";

type RouteParams = { params: Promise<{ id: string }> };

/** Metadane audio zgłoszenia dla panelu admin (studentAudio / teacherAudio). */
export async function GET(request: Request, { params }: RouteParams) {
  const { id: submissionId } = await params;
  const which = new URL(request.url).searchParams.get("which") ?? "student";

  if (which !== "student" && which !== "teacher") {
    return NextResponse.json({ message: "Parametr which=student|teacher" }, { status: 400 });
  }

  const payload = await getPayload({ config });
  const hdrs = await headers();
  const auth = await payload.auth({ headers: hdrs });

  if (!isPlatformAdmin(auth.user)) {
    return NextResponse.json({ message: "Wymagane konto administratora." }, { status: 401 });
  }

  const mediaId = await sqlGetSubmissionMediaId(
    submissionId,
    which === "student" ? "student" : "teacher",
  );

  if (mediaId == null) {
    return NextResponse.json({ mediaId: null, playbackUrl: null, filename: null });
  }

  const filename = (await sqlGetMediaFilename(mediaId)) ?? "nagranie.webm";

  return NextResponse.json({
    mediaId,
    filename,
    playbackUrl: `/api/media-playback/${mediaId}`,
    downloadUrl: `/api/media-playback/${mediaId}?download=1`,
  });
}
