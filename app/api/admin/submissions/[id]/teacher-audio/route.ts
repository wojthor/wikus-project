import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createLocalReq, getPayload, type PayloadRequest } from "payload";

import { createAudioMediaDocument } from "@/src/lib/create-audio-media";
import { isPlatformAdmin } from "@/src/lib/platform-admin";
import { sqlLinkTeacherAudio } from "@/src/lib/submissions-sql-fallback";

import config from "@payload-config";

type RouteParams = { params: Promise<{ id: string }> };

function toRelationId(value: unknown): number | string | null {
  if (value == null || value === "") return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return /^\d+$/.test(trimmed) ? Number(trimmed) : trimmed;
  }
  if (typeof value === "object" && value !== null && "id" in value) {
    return toRelationId((value as { id: unknown }).id);
  }
  return null;
}

async function saveTeacherAudioOnSubmission(
  submissionId: string,
  mediaId: number | string | null,
  req: PayloadRequest,
) {
  const payload = req.payload;
  const remove = mediaId == null;

  const ok = await sqlLinkTeacherAudio(submissionId, mediaId ?? 0, remove);
  if (!ok) {
    throw new Error("Nie udało się zapisać feedbacku głosowego w bazie.");
  }

  try {
    return await payload.findByID({
      collection: "submissions",
      id: submissionId,
      depth: 0,
      req,
      overrideAccess: true,
    });
  } catch {
    return {
      id: submissionId,
      teacherAudio: mediaId,
      isReviewed: !remove,
    };
  }
}

/** Wgrywa feedback głosowy i od razu zapisuje go na zgłoszeniu (jeden krok). */
export async function POST(request: Request, { params }: RouteParams) {
  const { id: submissionId } = await params;
  const payload = await getPayload({ config });
  const hdrs = await headers();
  const auth = await payload.auth({ headers: hdrs });

  if (!isPlatformAdmin(auth.user)) {
    return NextResponse.json({ message: "Wymagane konto administratora." }, { status: 401 });
  }

  const formData = await request.formData();
  const remove = formData.get("remove") === "1";
  const linkMediaIdRaw = formData.get("mediaId");

  try {
    if (remove) {
      const req = await createLocalReq({ user: auth.user ?? undefined }, payload);
      const doc = await saveTeacherAudioOnSubmission(submissionId, null, req);
      return NextResponse.json({ ok: true, doc, mediaId: null });
    }

    const linkMediaId = toRelationId(linkMediaIdRaw);
    if (linkMediaId != null && !(formData.get("file") instanceof File)) {
      const req = await createLocalReq({ user: auth.user ?? undefined }, payload);
      const doc = await saveTeacherAudioOnSubmission(submissionId, linkMediaId, req);
      return NextResponse.json({ ok: true, mediaId: linkMediaId, doc });
    }

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ message: "Brak pliku audio." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const name = file.name?.trim() || `feedback-${Date.now()}.webm`;

    const req = await createLocalReq({ user: auth.user ?? undefined }, payload);

    const media = await createAudioMediaDocument(payload, {
      alt: "Feedback głosowy (nauczyciel)",
      buffer,
      name,
      mimetype: file.type || "audio/webm",
      req,
      overrideAccess: true,
    });

    const mediaId = toRelationId(media.id);
    if (mediaId == null) {
      throw new Error("Brak ID po utworzeniu pliku media.");
    }

    const doc = await saveTeacherAudioOnSubmission(submissionId, mediaId, req);

    return NextResponse.json({
      ok: true,
      mediaId,
      doc,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Nie udało się zapisać feedbacku.";
    console.error("[teacher-audio]", err);
    return NextResponse.json({ message }, { status: 500 });
  }
}
