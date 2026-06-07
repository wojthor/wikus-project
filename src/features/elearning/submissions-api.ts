import type { MediaRelation, PayloadMedia } from "./media-api";
import { resolveMediaId, resolveMediaPlaybackUrl, resolveMediaUrl } from "./media-api";
import type { ChallengeAudioEntry } from "./multiday-submission";

export type PayloadSubmission = {
  id: string | number;
  student: string | number | { id: string | number };
  lesson: string | number | { id: string | number };
  textContent?: string | null;
  studentAudio?: MediaRelation;
  studentChallengeAudios?: ChallengeAudioEntry[] | null;
  teacherFeedback?: Record<string, unknown> | null;
  teacherAudio?: MediaRelation;
  isReviewed?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ChallengeAudioPayload = {
  day: number;
  audio: number | string;
};

export { resolveMediaId, resolveMediaPlaybackUrl, resolveMediaUrl };
export type { PayloadMedia };

type PayloadFindResponse<T> = {
  docs: T[];
  totalDocs: number;
};

type PayloadErrorResponse = {
  message?: string;
  errors?: Array<{ message?: string; data?: unknown }>;
};

function resolveRelationId(
  value: string | number | { id: string | number } | null | undefined,
): string | null {
  if (value == null) return null;
  if (typeof value === "object" && "id" in value) return String(value.id);
  return String(value);
}

/** Konwertuje ID dokumentu Payload (Postgres) na wartość akceptowaną przez relacje REST */
export function toPayloadRelationId(id: string | number): number | string {
  if (typeof id === "number") return id;
  const trimmed = id.trim();
  if (/^\d+$/.test(trimmed)) return Number(trimmed);
  if (trimmed.includes("-")) {
    throw new Error(
      `Nieprawidłowe ID lekcji "${id}". Odśwież stronę - używamy wyłącznie ID z bazy CMS.`,
    );
  }
  return trimmed;
}

export function toPayloadStudentId(userId: string | number): number | string {
  return toPayloadRelationId(userId);
}

export function getSubmissionLessonId(submission: PayloadSubmission): string | null {
  return resolveRelationId(submission.lesson);
}

function parseApiError(payload: PayloadErrorResponse, status: number): string {
  if (payload.errors?.length) {
    return payload.errors.map((e) => e.message).filter(Boolean).join(" · ") || `Błąd API (${status})`;
  }
  if (payload.message) return payload.message;
  return `Błąd API (${status})`;
}

function buildWhereParams(filters: Record<string, string | number>): string {
  const params = new URLSearchParams();
  for (const [field, value] of Object.entries(filters)) {
    params.set(`where[${field}][equals]`, String(value));
  }
  params.set("limit", "1");
  params.set("depth", "2");
  return params.toString();
}

export async function fetchSubmissionForLesson(
  studentId: string | number,
  lessonId: string | number,
): Promise<PayloadSubmission | null> {
  const student = toPayloadStudentId(studentId);
  const lesson = toPayloadRelationId(lessonId);
  const query = buildWhereParams({ student, lesson });

  const res = await fetch(`/api/submissions?${query}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
  });

  const data = (await res.json().catch(() => ({}))) as PayloadFindResponse<PayloadSubmission> &
    PayloadErrorResponse;

  if (!res.ok) {
    throw new Error(parseApiError(data, res.status));
  }

  return data.docs?.[0] ?? null;
}

export async function fetchSubmissionsForStudent(
  studentId: string | number,
): Promise<PayloadSubmission[]> {
  const student = toPayloadStudentId(studentId);
  const params = new URLSearchParams();
  params.set("where[student][equals]", String(student));
  params.set("limit", "500");
  params.set("depth", "1");

  const res = await fetch(`/api/submissions?${params.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
  });

  const data = (await res.json().catch(() => ({}))) as PayloadFindResponse<PayloadSubmission> &
    PayloadErrorResponse;

  if (!res.ok) {
    throw new Error(parseApiError(data, res.status));
  }

  return data.docs ?? [];
}

/** Pola zgodne z collections/Submissions.ts */
export type CreateSubmissionBody = {
  lesson: number | string;
  student: number | string;
  textContent?: string;
  studentAudio?: number | string;
  studentChallengeAudios?: ChallengeAudioPayload[];
};

export type UpdateSubmissionBody = {
  textContent?: string;
  studentAudio?: number | string;
  studentChallengeAudios?: ChallengeAudioPayload[];
};

export async function updateSubmission(
  id: string | number,
  body: UpdateSubmissionBody,
): Promise<PayloadSubmission> {
  const payload: Record<string, unknown> = {};
  if (body.textContent?.trim()) payload.textContent = body.textContent.trim();
  if (body.studentAudio != null) payload.studentAudio = body.studentAudio;
  if (body.studentChallengeAudios?.length) {
    payload.studentChallengeAudios = body.studentChallengeAudios;
  }

  const res = await fetch(`/api/elearning/submissions/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => ({}))) as ({ doc?: PayloadSubmission } & PayloadSubmission) &
    PayloadErrorResponse;

  if (!res.ok) {
    throw new Error(parseApiError(data, res.status));
  }

  return "doc" in data && data.doc ? data.doc : (data as PayloadSubmission);
}

export async function createSubmission(
  body: CreateSubmissionBody,
): Promise<PayloadSubmission> {
  const payload: Record<string, unknown> = {
    lesson: body.lesson,
    student: body.student,
  };

  if (body.textContent?.trim()) {
    payload.textContent = body.textContent.trim();
  }
  if (body.studentAudio != null) {
    payload.studentAudio = body.studentAudio;
  }
  if (body.studentChallengeAudios?.length) {
    payload.studentChallengeAudios = body.studentChallengeAudios;
  }

  const res = await fetch("/api/elearning/submissions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      lesson: payload.lesson,
      textContent: payload.textContent,
      studentAudio: payload.studentAudio,
      studentChallengeAudios: payload.studentChallengeAudios,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as ({ doc?: PayloadSubmission } & PayloadSubmission) &
    PayloadErrorResponse;

  if (!res.ok) {
    throw new Error(parseApiError(data, res.status));
  }

  return "doc" in data && data.doc ? data.doc : (data as PayloadSubmission);
}
