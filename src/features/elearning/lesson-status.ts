import { lexicalToPlainText } from "@/src/features/elearning/components/LexicalContent";
import { resolveMediaId } from "@/src/features/elearning/media-api";

import type { PayloadSubmission } from "./submissions-api";

export type LessonProgressStatus =
  | "locked"
  | "not_started"
  | "in_progress"
  | "awaiting_feedback"
  | "completed";

function hasTextTeacherFeedback(submission: PayloadSubmission | null | undefined): boolean {
  if (!submission?.teacherFeedback) return false;
  return lexicalToPlainText(submission.teacherFeedback).trim().length > 0;
}

export function hasTeacherFeedback(submission: PayloadSubmission | null | undefined): boolean {
  if (!submission) return false;
  if (submission.isReviewed) return true;
  if (resolveMediaId(submission.teacherAudio)) return true;
  return hasTextTeacherFeedback(submission);
}

export function getLessonProgressStatus(
  submission: PayloadSubmission | null | undefined,
  isActiveLesson: boolean,
  isUnlocked = true,
): LessonProgressStatus {
  if (!isUnlocked) return "locked";
  if (!submission) {
    return isActiveLesson ? "in_progress" : "not_started";
  }
  if (hasTeacherFeedback(submission)) return "completed";
  return "awaiting_feedback";
}

export const LESSON_STATUS_LABELS: Record<LessonProgressStatus, string> = {
  locked: "Zablokowana",
  not_started: "Nie rozpoczęta",
  in_progress: "W trakcie",
  awaiting_feedback: "Weryfikacja",
  completed: "Ukończona",
};
