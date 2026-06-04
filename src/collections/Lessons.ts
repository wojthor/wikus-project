import type { CollectionConfig } from "payload";

import {
  lessonLinksRowsFromLexical,
  syncLessonFromLexical,
} from "@/src/lib/lesson-link-admin";

export const Lessons: CollectionConfig = {
  slug: "lessons",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "module", "order", "duration", "taskType", "updatedAt"],
  },
  defaultSort: "order",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Tytuł lekcji",
    },
    {
      name: "module",
      type: "relationship",
      relationTo: "modules",
      required: true,
      label: "Moduł",
    },
    {
      name: "order",
      type: "number",
      required: true,
      label: "Kolejność w module",
    },
    {
      name: "duration",
      type: "text",
      label: "Czas trwania",
      admin: {
        description: 'Np. "10 min"',
      },
    },
    {
      name: "videoTitle",
      type: "text",
      label: "Tytuł wideo",
    },
    {
      name: "videoUrl",
      type: "text",
      label: "URL wideo",
      admin: {
        description:
          "YouTube (watch, Shorts: youtube.com/shorts/ID), youtu.be lub Vimeo. Shorts = pionowa ramka.",
      },
    },
    {
      name: "lessonIntro",
      type: "textarea",
      label: "Wstęp lekcji (e-learning)",
      admin: {
        description:
          "Tekst nad kolorowymi blokami. Uzupełnia się automatycznie przy zapisie z pola „Treść lekcji” poniżej.",
      },
    },
    {
      name: "contentSections",
      type: "json",
      label: "Kolorowe sekcje (e-learning)",
      admin: {
        description:
          "Kopia techniczna po zapisie (podgląd). Na e-learningu liczy się wyłącznie „Treść lekcji” + „Odwołania do lekcji” powyżej.",
        readOnly: true,
      },
    },
    {
      name: "lessonLinks",
      type: "array",
      label: "Odwołania do lekcji — dokąd prowadzą",
      admin: {
        description:
          "Wybierz docelową lekcję dla każdego akapitu 📎 z „Treści lekcji” (ta sama kolejność). Po zapisie liczba wierszy = liczba 📎 w treści — stare wiersze znikają.",
        initCollapsed: false,
      },
      fields: [
        {
          name: "label",
          type: "textarea",
          label: "Tekst kafelka (podgląd)",
          admin: {
            readOnly: true,
            description:
              "Podgląd z „Treści lekcji” po zapisie. Tekst kafelka edytuj tylko w akapicie 📎 poniżej.",
          },
        },
        {
          name: "targetLesson",
          type: "relationship",
          relationTo: "lessons",
          label: "Docelowa lekcja",
          admin: {
            description: "Dokąd ma prowadzić klik — wybierz z listy (wymagane, żeby link działał).",
          },
        },
      ],
    },
    {
      name: "content",
      type: "richText",
      label: "Treść lekcji",
      admin: {
        description:
          "Kolorowe bloki jak zwykle. Odwołanie = osobny akapit zaczynający się od 📎 (reszta to treść kafelka). Dokąd prowadzi — tylko w polu „Odwołania do lekcji” powyżej.",
      },
    },
    {
      name: "taskType",
      type: "select",
      required: true,
      label: "Typ zadania",
      options: [
        { label: "Tekst", value: "text" },
        { label: "Audio", value: "audio" },
        { label: "Wielodniowe", value: "multiday" },
      ],
      defaultValue: "text",
    },
    {
      name: "taskPrompt",
      type: "textarea",
      required: true,
      label: "Polecenie zadania",
    },
    {
      name: "multidayDays",
      type: "json",
      label: "Dni wyzwania (multiday)",
      admin: {
        description: 'Tablica: [{ "day": 1, "prompt": "..." }, ...] — tylko dla typu wielodniowe.',
        condition: (_, siblingData) => siblingData?.taskType === "multiday",
      },
    },
    {
      name: "legacySlug",
      type: "text",
      label: "ID z mockupu",
      admin: {
        description: 'Np. "1-3" — do orientacji przy migracji.',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, originalDoc, req }) => {
        if (!data || typeof data !== "object") return data;

        const content = (data.content ?? originalDoc?.content) as
          | Record<string, unknown>
          | undefined;

        const lessonLinks = lessonLinksRowsFromLexical(
          content,
          data.lessonLinks as import("@/src/lib/lesson-link-admin").LessonLinkAdminRow[] | undefined,
        );

        return { ...data, lessonLinks };
      },
    ],
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        if (!data || typeof data !== "object") return data;

        const content = (data.content ?? originalDoc?.content) as
          | Record<string, unknown>
          | undefined;

        const lessonLinks = (data.lessonLinks ?? originalDoc?.lessonLinks) as
          | import("@/src/lib/lesson-link-admin").LessonLinkAdminRow[]
          | undefined;

        const synced = await syncLessonFromLexical(req.payload, content, lessonLinks);
        if (!synced) return data;

        return {
          ...data,
          lessonIntro: synced.lessonIntro,
          contentSections: synced.contentSections,
          lessonLinks: synced.lessonLinks,
        };
      },
    ],
  },
};
