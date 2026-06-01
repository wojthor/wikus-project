import type { CollectionConfig } from "payload";

import { isPlatformAdmin } from "@/src/lib/platform-admin";
import {
  sqlGetSubmissionMediaId,
  sqlLinkTeacherAudio,
} from "@/src/lib/submissions-sql-fallback";
import {
  feedbackWasAdded,
  notifyStudentOnFeedbackReviewed,
  notifyTeacherOnNewSubmission,
  submissionHasFeedback,
} from "@/src/features/elearning/submission-email-hooks";

function hasMeaningfulText(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasMeaningfulText);
  if (!value || typeof value !== "object") return false;
  return Object.values(value).some(hasMeaningfulText);
}

function hasRelationValue(value: unknown): boolean {
  if (value == null || value === "") return false;
  if (typeof value === "object" && "id" in value) return Boolean(value.id);
  return true;
}

function resolveRelationId(value: unknown): string | number | null {
  if (value == null || value === "") return null;
  if (typeof value === "object" && "id" in value) {
    return resolveRelationId((value as { id: unknown }).id);
  }
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  return null;
}

function isAutosaveRequest(req: { query?: Record<string, unknown> }): boolean {
  const autosave = req.query?.autosave;
  return autosave === true || autosave === "true";
}

async function syncTeacherAudioFromForm(
  submissionId: string | number,
  data: Record<string, unknown>,
): Promise<void> {
  const explicitRemoval = data.teacherAudio === null;
  const nextAudioId = hasRelationValue(data.teacherAudio)
    ? resolveRelationId(data.teacherAudio)
    : null;

  if (nextAudioId == null && !explicitRemoval) return;

  const currentAudioId = await sqlGetSubmissionMediaId(submissionId, "teacher");
  if (String(nextAudioId ?? "") === String(currentAudioId ?? "")) return;

  await sqlLinkTeacherAudio(submissionId, nextAudioId, explicitRemoval);

  if (nextAudioId != null) {
    data.teacherAudio = nextAudioId;
  } else if (explicitRemoval) {
    data.teacherAudio = null;
  }
}

export const Submissions: CollectionConfig = {
  slug: "submissions",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["id", "student", "lesson", "isReviewed", "updatedAt"],
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false;
      if (isPlatformAdmin(req.user)) return true;
      return { student: { equals: req.user.id } };
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => isPlatformAdmin(req.user),
    delete: ({ req }) => isPlatformAdmin(req.user),
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (!data || operation !== "create") return data;

        const hasText =
          typeof data.textContent === "string" && data.textContent.trim().length > 0;
        const hasAudio = hasRelationValue(data.studentAudio);

        if (!hasText && !hasAudio) {
          throw new Error("Dodaj odpowiedź tekstową, nagraj głosówkę albo oba.");
        }

        return data;
      },
    ],
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        if (!data) return data;

        if (
          operation === "update" &&
          originalDoc?.id &&
          isPlatformAdmin(req.user) &&
          !isAutosaveRequest(req)
        ) {
          await syncTeacherAudioFromForm(
            originalDoc.id,
            data as Record<string, unknown>,
          );
        }

        // Autosave panelu nie wysyła pól z custom komponentów — nie kasuj istniejącego audio.
        if (operation === "update" && originalDoc) {
          if (!hasRelationValue(data.studentAudio) && hasRelationValue(originalDoc.studentAudio)) {
            data.studentAudio = originalDoc.studentAudio;
          }
          if (!hasRelationValue(data.teacherAudio) && hasRelationValue(originalDoc.teacherAudio)) {
            data.teacherAudio = originalDoc.teacherAudio;
          }
          if (
            !hasMeaningfulText(data.teacherFeedback) &&
            hasMeaningfulText(originalDoc.teacherFeedback)
          ) {
            data.teacherFeedback = originalDoc.teacherFeedback;
          }
        }

        if (!isPlatformAdmin(req.user)) return data;

        if (!isAutosaveRequest(req)) {
          let hasFeedback =
            hasMeaningfulText(data.teacherFeedback) || hasRelationValue(data.teacherAudio);

          if (
            !hasFeedback &&
            operation === "update" &&
            originalDoc?.id
          ) {
            const sqlAudioId = await sqlGetSubmissionMediaId(originalDoc.id, "teacher");
            if (sqlAudioId != null) {
              hasFeedback = true;
            }
          }

          data.isReviewed = hasFeedback;
        }

        return data;
      },
    ],
    afterChange: [
      async ({ doc, data, operation, previousDoc, req }) => {
        if (!req.payload) return doc;

        try {
          if (operation === "create") {
            await notifyTeacherOnNewSubmission(req.payload, doc);
          }

          if (
            operation === "update" &&
            previousDoc &&
            !isAutosaveRequest(req)
          ) {
            const sqlAudioId = doc.id
              ? await sqlGetSubmissionMediaId(doc.id, "teacher")
              : null;

            const mergedDoc = {
              ...doc,
              teacherFeedback: doc.teacherFeedback ?? data?.teacherFeedback,
              teacherAudio: sqlAudioId ?? doc.teacherAudio ?? data?.teacherAudio,
              isReviewed: doc.isReviewed ?? data?.isReviewed,
            };

            if (feedbackWasAdded(previousDoc, mergedDoc) && submissionHasFeedback(mergedDoc)) {
              await notifyStudentOnFeedbackReviewed(req.payload, mergedDoc);
            }
          }
        } catch (err) {
          console.error("[submissions afterChange email]", err);
        }

        return doc;
      },
    ],
  },
  fields: [
    {
      name: "student",
      type: "relationship",
      relationTo: "users",
      required: true,
      label: "Uczeń",
    },
    {
      name: "lesson",
      type: "relationship",
      relationTo: "lessons",
      required: true,
      label: "Lekcja",
    },
    {
      name: "textContent",
      type: "textarea",
      label: "Odpowiedź tekstowa (uczeń)",
      required: false,
      admin: {
        readOnly: true,
        description: "Tekst wysłany przez ucznia z platformy e-learning.",
      },
    },
    {
      name: "listenStudentAudio",
      type: "ui",
      admin: {
        components: {
          Field:
            "@/app/components/AdminSubmissionAudioListen#AdminSubmissionAudioListenField",
        },
      },
    },
    {
      name: "studentAudio",
      type: "upload",
      relationTo: "media",
      label: "Odpowiedź głosowa (uczeń)",
      required: false,
      admin: { hidden: true },
    },
    {
      name: "teacherFeedbackHeader",
      type: "ui",
      admin: {
        components: {
          Field:
            "@/app/components/AdminTeacherFeedbackHeader#AdminTeacherFeedbackHeaderField",
        },
      },
    },
    {
      name: "teacherFeedback",
      type: "richText",
      label: "Feedback tekstowy",
      admin: {
        description: "Opcjonalny komentarz tekstowy — można łączyć z nagraniem głosowym.",
      },
    },
    {
      name: "teacherAudio",
      type: "upload",
      relationTo: "media",
      label: "Feedback głosowy (nauczyciel)",
      required: false,
      admin: {
        hidden: true,
      },
    },
    {
      name: "teacherAudioRecorder",
      type: "ui",
      admin: {
        components: {
          Field: "@/app/components/AdminAudioRecorder#AdminAudioRecorderField",
        },
      },
    },
    {
      name: "flushTeacherAudioOnSave",
      type: "ui",
      admin: {
        components: {
          Field:
            "@/app/components/AdminFlushTeacherAudioOnSave#AdminFlushTeacherAudioOnSaveField",
        },
      },
    },
    {
      name: "isReviewed",
      type: "checkbox",
      label: "Sprawdzone",
      defaultValue: false,
      admin: {
        hidden: true,
      },
    },
  ],
};
