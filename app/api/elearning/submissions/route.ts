import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createLocalReq } from "payload";

import { notifyTeacherOnNewSubmission } from "@/src/features/elearning/submission-email-hooks";
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

  if (lessonId == null) {
    return NextResponse.json({ message: "Brak lekcji (lesson)." }, { status: 400 });
  }

  if (!textContent && studentAudioId == null) {
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

  const req = await createLocalReq({ user: auth.user }, payload);

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
    }

    const refreshed =
      studentAudioId != null
        ? await payload.findByID({
            collection: "submissions",
            id: doc.id,
            depth: 0,
            req,
            overrideAccess: true,
          })
        : doc;

    return NextResponse.json({ doc: refreshed });
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

    try {
      await notifyTeacherOnNewSubmission(payload, doc);
    } catch (emailErr) {
      console.error("[elearning/submissions] email hook", emailErr);
    }

    return NextResponse.json({ doc });
  }
}
