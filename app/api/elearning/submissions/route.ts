import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createLocalReq } from "payload";

import { scheduleTeacherNewSubmissionEmail } from "@/src/features/elearning/submission-email-hooks";
import { getCachedPayload } from "@/src/lib/payload-cache";
import {
  sqlCreateSubmission,
  sqlGetSubmissionMediaId,
  sqlLinkStudentAudio,
} from "@/src/lib/submissions-sql-fallback";

function toRelationId(value: unknown): number | string | null {
  if (value == null || value === "") return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return /^\d+$/.test(trimmed) ? Number(trimmed) : trimmed;
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

function resolveMediaId(value: unknown): string | number | null {
  if (value == null || value === "") return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "id" in value) {
    return toRelationId((value as { id: unknown }).id);
  }
  return null;
}

async function ensureStudentAudioLinked(
  submissionId: string | number,
  studentAudioId: string | number,
): Promise<void> {
  const linked = await sqlGetSubmissionMediaId(submissionId, "student");
  if (linked != null) return;
  await sqlLinkStudentAudio(submissionId, studentAudioId);
}

/** Tworzenie zgłoszenia z e-learningu (obejście błędu Drizzle na POST /api/submissions). */
export async function POST(request: Request) {
  const payload = await getCachedPayload();
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

  const lessonId = toRelationId(body.lesson);
  const textContent = typeof body.textContent === "string" ? body.textContent.trim() : "";
  const studentAudioId = toRelationId(body.studentAudio);
  const studentChallengeAudios = parseChallengeAudios(body.studentChallengeAudios);

  if (lessonId == null) {
    return NextResponse.json({ message: "Brak lekcji (lesson)." }, { status: 400 });
  }

  if (!textContent && studentAudioId == null && studentChallengeAudios.length === 0) {
    return NextResponse.json(
      { message: "Dodaj odpowiedź tekstową, nagraj głosówkę albo oba." },
      { status: 400 },
    );
  }

  const data: Record<string, unknown> = {
    student: auth.user.id,
    lesson: lessonId,
  };
  if (textContent) data.textContent = textContent;
  if (studentAudioId != null) data.studentAudio = studentAudioId;
  if (studentChallengeAudios.length) data.studentChallengeAudios = studentChallengeAudios;

  const req = await createLocalReq(
    { user: auth.user, context: { skipSubmissionEmails: true } },
    payload,
  );

  const studentName = [auth.user.firstName, auth.user.lastName]
    .filter((part) => typeof part === "string" && part.trim())
    .join(" ")
    .trim() || auth.user.email;

  try {
    const doc = await payload.create({
      collection: "submissions",
      data,
      req,
      overrideAccess: false,
      depth: 0,
    });

    if (studentAudioId != null && resolveMediaId(doc.studentAudio) == null) {
      await ensureStudentAudioLinked(doc.id, studentAudioId);
      doc.studentAudio = studentAudioId;
    }

    scheduleTeacherNewSubmissionEmail(doc, { studentName });

    return NextResponse.json({ doc });
  } catch (createErr) {
    console.error("[elearning/submissions] payload.create failed, SQL fallback", createErr);

    const newId = await sqlCreateSubmission({
      studentId: auth.user.id,
      lessonId,
      textContent: textContent || null,
      studentAudioId,
    });

    if (newId == null) {
      const message =
        createErr instanceof Error ? createErr.message : "Nie udało się zapisać zgłoszenia.";
      return NextResponse.json({ message }, { status: 500 });
    }

    const doc = await payload.findByID({
      collection: "submissions",
      id: newId,
      depth: 0,
      req,
      overrideAccess: true,
    });

    scheduleTeacherNewSubmissionEmail(doc, { studentName });

    return NextResponse.json({ doc });
  }
}
