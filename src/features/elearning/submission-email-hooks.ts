import type { Payload } from "payload";

import {
  sendFeedbackReadyToStudentEmail,
  sendNewSubmissionToTeacherEmail,
} from "@/src/lib/email";
import { sqlLoadSubmissionEmailContext } from "@/src/lib/submissions-sql-fallback";

type SubmissionDoc = {
  id: string | number;
  student?:
    | string
    | number
    | { id: string | number; email?: string; fullName?: string; firstName?: string; lastName?: string }
    | null;
  lesson?: string | number | { id: string | number; title?: string } | null;
  isReviewed?: boolean;
  teacherFeedback?: unknown;
  teacherAudio?: unknown;
};

function hasMeaningfulText(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasMeaningfulText);
  if (!value || typeof value !== "object") return false;
  return Object.values(value).some(hasMeaningfulText);
}

function hasRelationValue(value: unknown): boolean {
  if (value == null || value === "") return false;
  if (typeof value === "object" && "id" in value) return Boolean((value as { id: unknown }).id);
  return true;
}

export function submissionHasFeedback(doc: SubmissionDoc): boolean {
  return hasMeaningfulText(doc.teacherFeedback) || hasRelationValue(doc.teacherAudio);
}

export function feedbackWasAdded(previousDoc: SubmissionDoc, doc: SubmissionDoc): boolean {
  const textAdded =
    !hasMeaningfulText(previousDoc.teacherFeedback) && hasMeaningfulText(doc.teacherFeedback);
  const audioAdded =
    !hasRelationValue(previousDoc.teacherAudio) && hasRelationValue(doc.teacherAudio);
  return textAdded || audioAdded;
}

function resolveRelationId(
  value: string | number | { id: string | number } | null | undefined,
): string | null {
  if (value == null) return null;
  if (typeof value === "object" && "id" in value) return String(value.id);
  return String(value);
}

function formatStudentName(student: unknown): string {
  if (!student || typeof student !== "object") return "Uczeń";
  const s = student as { fullName?: string; firstName?: string; lastName?: string };
  if (s.fullName?.trim()) return s.fullName.trim();
  const name = [s.firstName, s.lastName].filter(Boolean).join(" ");
  return name || "Uczeń";
}

type LoadedContext = {
  student: { id: string | number; email?: string; fullName?: string; firstName?: string; lastName?: string } | null;
  lesson: { id: string | number; title?: string } | null;
};

async function loadContextFromRelations(payload: Payload, doc: SubmissionDoc): Promise<LoadedContext> {
  const studentId = resolveRelationId(doc.student as string | number | { id: string | number } | null);
  const lessonId = resolveRelationId(doc.lesson as string | number | { id: string | number } | null);

  if (!studentId || !lessonId) {
    return { student: null, lesson: null };
  }

  if (
    typeof doc.student === "object" &&
    doc.student !== null &&
    typeof doc.lesson === "object" &&
    doc.lesson !== null
  ) {
    return {
      student: doc.student as LoadedContext["student"],
      lesson: doc.lesson as LoadedContext["lesson"],
    };
  }

  const [student, lesson] = await Promise.all([
    payload.findByID({
      collection: "users",
      id: studentId,
      depth: 0,
      overrideAccess: true,
    }) as Promise<LoadedContext["student"]>,
    payload.findByID({
      collection: "lessons",
      id: lessonId,
      depth: 0,
      overrideAccess: true,
    }) as Promise<LoadedContext["lesson"]>,
  ]);

  return { student, lesson };
}

export async function notifyTeacherOnNewSubmission(
  payload: Payload,
  doc: SubmissionDoc,
): Promise<void> {
  const studentId = resolveRelationId(doc.student as string | number | { id: string | number } | null);
  const lessonId = resolveRelationId(doc.lesson as string | number | { id: string | number } | null);

  if (studentId && lessonId) {
    const fromSql = await sqlLoadSubmissionEmailContext(studentId, lessonId);
    if (fromSql) {
      await sendNewSubmissionToTeacherEmail({
        submissionId: doc.id,
        studentName: fromSql.studentName,
        lessonTitle: fromSql.lessonTitle,
      });
      return;
    }
  }

  const { student, lesson } = await loadContextFromRelations(payload, doc);

  if (!student || typeof student !== "object" || !lesson || typeof lesson !== "object") {
    console.warn("[submission-email] Brak danych student/lesson do maila dla Wiktora.");
    return;
  }

  await sendNewSubmissionToTeacherEmail({
    submissionId: doc.id,
    studentName: formatStudentName(student),
    lessonTitle: lesson.title?.trim() || `Lekcja #${resolveRelationId(lesson.id)}`,
  });
}

export async function notifyStudentOnFeedbackReviewed(
  payload: Payload,
  doc: SubmissionDoc,
): Promise<void> {
  const studentId = resolveRelationId(doc.student as string | number | { id: string | number } | null);
  const lessonId = resolveRelationId(doc.lesson as string | number | { id: string | number } | null);

  let studentEmail: string | null = null;
  let lessonTitle = "lekcja";

  if (
    typeof doc.student === "object" &&
    doc.student !== null &&
    "email" in doc.student &&
    typeof (doc.student as { email?: string }).email === "string"
  ) {
    studentEmail = (doc.student as { email: string }).email;
  }

  if (typeof doc.lesson === "object" && doc.lesson !== null && "title" in doc.lesson) {
    const title = (doc.lesson as { title?: string }).title?.trim();
    if (title) lessonTitle = title;
  }

  if ((!studentEmail || lessonTitle === "lekcja") && studentId && lessonId) {
    const pool = await import("@/src/lib/pg-pool").then((m) => m.getPgPool()).catch(() => null);
    if (pool) {
      try {
        const result = await pool.query<{ email: string | null; lesson_title: string | null }>(
          `SELECT u.email, l.title AS lesson_title
           FROM users u
           JOIN lessons l ON l.id = $2
           WHERE u.id = $1
           LIMIT 1`,
          [studentId, lessonId],
        );
        const row = result.rows[0];
        if (!studentEmail && row?.email?.trim()) {
          studentEmail = row.email.trim();
        }
        if (lessonTitle === "lekcja" && row?.lesson_title?.trim()) {
          lessonTitle = row.lesson_title.trim();
        }
      } catch (err) {
        console.error("[submission-email] sql student context", err);
      }
    }
  }

  if (!studentEmail) {
    const { student, lesson } = await loadContextFromRelations(payload, doc);
    if (!student || typeof student !== "object" || !student.email) {
      console.warn("[submission-email] Brak e-maila ucznia do powiadomienia o feedbacku.");
      return;
    }
    studentEmail = student.email.trim().toLowerCase();
    if (lesson && typeof lesson === "object" && lesson.title?.trim()) {
      lessonTitle = lesson.title.trim();
    }
  }

  const to = studentEmail?.trim().toLowerCase();
  if (!to) {
    console.warn("[submission-email] Brak e-maila ucznia do powiadomienia o feedbacku.");
    return;
  }

  await sendFeedbackReadyToStudentEmail({
    to,
    lessonTitle,
  });
}
