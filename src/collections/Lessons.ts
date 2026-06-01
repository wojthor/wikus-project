import type { CollectionConfig } from "payload";

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
      name: "content",
      type: "richText",
      label: "Treść lekcji",
      admin: {
        description: "Główna treść lekcji wyświetlana uczniowi.",
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
};
