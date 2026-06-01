import type { Payload } from "payload";

import {
  sendFeedbackReadyToStudentEmail,
  sendNewSubmissionToTeacherEmail,
} from "@/src/lib/email";

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
  const { student, lesson } = await loadContextFromRelations(payload, doc);

  if (!student || typeof student !== "object" || !student.email) {
    console.warn("[submission-email] Brak e-maila ucznia do powiadomienia o feedbacku.");
    return;
  }

  const lessonTitle =
    lesson && typeof lesson === "object" && lesson.title?.trim()
      ? lesson.title.trim()
      : "lekcja";

  await sendFeedbackReadyToStudentEmail({
    to: student.email.trim().toLowerCase(),
    lessonTitle,
  });
}
