import type { CollectionConfig } from "payload";

import { isPlatformAdmin } from "@/src/lib/platform-admin";
import {
  feedbackWasAdded,
  scheduleStudentFeedbackReadyEmail,
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

function isAutosaveRequest(req: { query?: Record<string, unknown> }): boolean {
  const autosave = req.query?.autosave;
  return autosave === true || autosave === "true";
}

function submissionHasFeedbackFromData(
  data: Record<string, unknown>,
  originalDoc?: Record<string, unknown> | null,
): boolean {
  if (hasMeaningfulText(data.teacherFeedback) || hasRelationValue(data.teacherAudio)) {
    return true;
  }
  if (!originalDoc) return false;
  return (
    hasMeaningfulText(originalDoc.teacherFeedback) ||
    hasRelationValue(originalDoc.teacherAudio)
  );
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
      ({ data, operation, originalDoc, req }) => {
        if (!data) return data;

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
          data.isReviewed = submissionHasFeedbackFromData(
            data as Record<string, unknown>,
            originalDoc as Record<string, unknown> | null,
          );
        }

        return data;
      },
    ],
    afterChange: [
      ({ doc, data, operation, previousDoc, req }) => {
        if (!req.payload) return doc;

        const skipEmails = Boolean(
          (req.context as { skipSubmissionEmails?: boolean } | undefined)?.skipSubmissionEmails,
        );

        if (operation === "create" && !skipEmails) {
          // E-mail dla nauczyciela planuje route /api/elearning/submissions (ma kontekst ucznia).
        }

        if (
          operation === "update" &&
          previousDoc &&
          !isAutosaveRequest(req) &&
          !skipEmails
        ) {
          const mergedDoc = {
            ...doc,
            teacherFeedback: doc.teacherFeedback ?? data?.teacherFeedback,
            teacherAudio: doc.teacherAudio ?? data?.teacherAudio,
            isReviewed: doc.isReviewed ?? data?.isReviewed,
          };

          if (feedbackWasAdded(previousDoc, mergedDoc) && submissionHasFeedback(mergedDoc)) {
            scheduleStudentFeedbackReadyEmail(mergedDoc);
          }
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
