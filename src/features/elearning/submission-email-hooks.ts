import type { Payload } from "payload";

import { deferServerTask } from "@/src/lib/defer-server-task";
import {
  sendFeedbackReadyToStudentEmail,
  sendNewSubmissionToTeacherEmail,
} from "@/src/lib/email";
import { getPgPool } from "@/src/lib/pg-pool";

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

export type SubmissionEmailContext = {
  studentName?: string;
  lessonTitle?: string;
  studentEmail?: string;
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

async function loadEmailRow(studentId: string, lessonId: string) {
  const pool = await getPgPool();
  const result = await pool.query<{
    email: string | null;
    student_name: string | null;
    lesson_title: string | null;
  }>(
    `SELECT u.email,
            COALESCE(NULLIF(TRIM(u.full_name), ''), NULLIF(TRIM(CONCAT_WS(' ', u.first_name, u.last_name)), '')) AS student_name,
            l.title AS lesson_title
     FROM users u
     JOIN lessons l ON l.id = $2
     WHERE u.id = $1
     LIMIT 1`,
    [studentId, lessonId],
  );
  return result.rows[0] ?? null;
}

export async function sendTeacherNewSubmissionEmail(
  doc: SubmissionDoc,
  context?: SubmissionEmailContext,
): Promise<void> {
  const studentId = resolveRelationId(doc.student as string | number | { id: string | number } | null);
  const lessonId = resolveRelationId(doc.lesson as string | number | { id: string | number } | null);

  let studentName = context?.studentName?.trim();
  let lessonTitle = context?.lessonTitle?.trim();

  if ((!studentName || !lessonTitle) && studentId && lessonId) {
    try {
      const row = await loadEmailRow(studentId, lessonId);
      if (!studentName && row?.student_name) studentName = row.student_name;
      if (!lessonTitle && row?.lesson_title) lessonTitle = row.lesson_title;
    } catch (err) {
      console.error("[submission-email] load teacher mail context", err);
    }
  }

  if (typeof doc.student === "object" && doc.student !== null && !studentName) {
    studentName = formatStudentName(doc.student);
  }

  await sendNewSubmissionToTeacherEmail({
    submissionId: doc.id,
    studentName: studentName || (studentId ? `Uczeń #${studentId}` : "Uczeń"),
    lessonTitle: lessonTitle || (lessonId ? `Lekcja #${lessonId}` : "Lekcja"),
  });
}

export async function sendStudentFeedbackReadyEmail(
  doc: SubmissionDoc,
  context?: SubmissionEmailContext,
): Promise<void> {
  const studentId = resolveRelationId(doc.student as string | number | { id: string | number } | null);
  const lessonId = resolveRelationId(doc.lesson as string | number | { id: string | number } | null);

  let studentEmail = context?.studentEmail?.trim().toLowerCase() ?? null;
  let lessonTitle = context?.lessonTitle?.trim() ?? "lekcja";

  if (
    typeof doc.student === "object" &&
    doc.student !== null &&
    "email" in doc.student &&
    typeof (doc.student as { email?: string }).email === "string"
  ) {
    studentEmail = (doc.student as { email: string }).email.trim().toLowerCase();
  }

  if (typeof doc.lesson === "object" && doc.lesson !== null && "title" in doc.lesson) {
    const title = (doc.lesson as { title?: string }).title?.trim();
    if (title) lessonTitle = title;
  }

  if ((!studentEmail || lessonTitle === "lekcja") && studentId && lessonId) {
    try {
      const row = await loadEmailRow(studentId, lessonId);
      if (!studentEmail && row?.email?.trim()) {
        studentEmail = row.email.trim().toLowerCase();
      }
      if (lessonTitle === "lekcja" && row?.lesson_title?.trim()) {
        lessonTitle = row.lesson_title.trim();
      }
    } catch (err) {
      console.error("[submission-email] load student mail context", err);
    }
  }

  if (!studentEmail) {
    console.warn("[submission-email] Brak e-maila ucznia do powiadomienia o feedbacku.");
    return;
  }

  await sendFeedbackReadyToStudentEmail({
    to: studentEmail,
    lessonTitle,
  });
}

/** Po utworzeniu zgłoszenia — nie blokuje zapisu w bazie. */
export function scheduleTeacherNewSubmissionEmail(
  doc: SubmissionDoc,
  context?: SubmissionEmailContext,
): void {
  deferServerTask("teacher-new-submission-email", () => sendTeacherNewSubmissionEmail(doc, context));
}

/** Po dodaniu feedbacku — nie blokuje zapisu w panelu admin. */
export function scheduleStudentFeedbackReadyEmail(
  doc: SubmissionDoc,
  context?: SubmissionEmailContext,
): void {
  deferServerTask("student-feedback-email", () => sendStudentFeedbackReadyEmail(doc, context));
}

/** @deprecated Użyj scheduleTeacherNewSubmissionEmail */
export async function notifyTeacherOnNewSubmission(
  _payload: Payload,
  doc: SubmissionDoc,
  context?: SubmissionEmailContext,
): Promise<void> {
  await sendTeacherNewSubmissionEmail(doc, context);
}

/** @deprecated Użyj scheduleStudentFeedbackReadyEmail */
export async function notifyStudentOnFeedbackReviewed(
  _payload: Payload,
  doc: SubmissionDoc,
  context?: SubmissionEmailContext,
): Promise<void> {
  await sendStudentFeedbackReadyEmail(doc, context);
}
