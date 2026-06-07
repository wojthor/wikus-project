import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createLocalReq, getPayload } from "payload";

import { hasTeacherFeedback } from "@/src/features/elearning/lesson-status";
import { mergeChallengeEntries } from "@/src/features/elearning/multiday-submission";
import type { PayloadSubmission } from "@/src/features/elearning/submissions-api";
import { sqlGetSubmissionMediaId, sqlUpdateStudentAnswer } from "@/src/lib/submissions-sql-fallback";

import config from "@payload-config";

type RouteParams = { params: Promise<{ id: string }> };

function toRelationId(value: unknown): number | string | null {
  if (value == null || value === "") return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return /^\d+$/.test(trimmed) ? Number(trimmed) : trimmed;
  }
  return null;
}

function resolveStudentId(value: unknown): string | number | null {
  if (value == null) return null;
  if (typeof value === "number" || typeof value === "string") return value;
  if (typeof value === "object" && "id" in value) {
    return toRelationId((value as { id: unknown }).id);
  }
  return null;
}

function parseChallengeAudios(value: unknown): Array<{ day: number; audio: number | string }> {
  if (!Array.isArray(value)) return [];

  const parsed: Array<{ day: number; audio: number | string }> = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const day = (entry as { day?: unknown }).day;
    const audio = toRelationId((entry as { audio?: unknown }).audio);
    if (typeof day !== "number" || !Number.isFinite(day) || audio == null) continue;
    parsed.push({ day, audio });
  }

  return parsed;
}

/** Uczeń uzupełnia własne zgłoszenie (tekst / głos / challenge) przed feedbackiem nauczyciela. */
export async function PATCH(request: Request, { params }: RouteParams) {
  const { id: submissionId } = await params;
  const payload = await getPayload({ config });
  const hdrs = await headers();
  const auth = await payload.auth({ headers: hdrs });

  if (!auth.user) {
    return NextResponse.json({ message: "Wymagane logowanie." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Nieprawidłowe JSON." }, { status: 400 });
  }

  const textContent = typeof body.textContent === "string" ? body.textContent.trim() : null;
  const studentAudioId = toRelationId(body.studentAudio);
  const newChallengeAudios = parseChallengeAudios(body.studentChallengeAudios);

  if (!textContent && studentAudioId == null && newChallengeAudios.length === 0) {
    return NextResponse.json({ message: "Brak danych do zapisania." }, { status: 400 });
  }

  let doc;
  try {
    doc = await payload.findByID({
      collection: "submissions",
      id: submissionId,
      depth: 2,
      user: auth.user,
      overrideAccess: false,
    });
  } catch {
    return NextResponse.json({ message: "Nie znaleziono zgłoszenia." }, { status: 404 });
  }

  const ownerId = resolveStudentId(doc.student);
  if (ownerId == null || String(ownerId) !== String(auth.user.id)) {
    return NextResponse.json({ message: "Brak dostępu." }, { status: 403 });
  }

  if (hasTeacherFeedback(doc as PayloadSubmission)) {
    return NextResponse.json(
      { message: "Nie można edytować odpowiedzi po otrzymaniu feedbacku." },
      { status: 409 },
    );
  }

  const req = await createLocalReq({ user: auth.user }, payload);

  if (newChallengeAudios.length > 0) {
    const merged = mergeChallengeEntries(doc.studentChallengeAudios, newChallengeAudios);

    try {
      const updated = await payload.update({
        collection: "submissions",
        id: submissionId,
        data: { studentChallengeAudios: merged },
        req,
        overrideAccess: true,
        depth: 2,
      });
      return NextResponse.json({ doc: updated });
    } catch (err) {
      console.error("[elearning/submissions PATCH] challenge update failed", err);
      return NextResponse.json({ message: "Nie udało się zapisać nagrań challenge." }, { status: 500 });
    }
  }

  const hasText = typeof doc.textContent === "string" && doc.textContent.trim().length > 0;
  const hasAudio = (await sqlGetSubmissionMediaId(submissionId, "student")) != null;

  const textToSave = textContent && !hasText ? textContent : null;
  const audioToSave = studentAudioId != null && !hasAudio ? studentAudioId : null;

  if (!textToSave && audioToSave == null) {
    return NextResponse.json(
      { message: "Ta część odpowiedzi jest już zapisana." },
      { status: 409 },
    );
  }

  const ok = await sqlUpdateStudentAnswer({
    submissionId,
    ...(textToSave ? { textContent: textToSave } : {}),
    ...(audioToSave != null ? { studentAudioId: audioToSave } : {}),
  });

  if (!ok) {
    return NextResponse.json({ message: "Nie udało się zapisać uzupełnienia." }, { status: 500 });
  }

  try {
    const updated = await payload.findByID({
      collection: "submissions",
      id: submissionId,
      depth: 2,
      req,
      overrideAccess: true,
    });
    return NextResponse.json({ doc: updated });
  } catch {
    return NextResponse.json({
      doc: {
        ...doc,
        ...(textToSave ? { textContent: textToSave } : {}),
        ...(audioToSave != null ? { studentAudio: audioToSave } : {}),
      },
    });
  }
}
