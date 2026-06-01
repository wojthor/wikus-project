import type { CollectionConfig } from "payload";

export const Modules: CollectionConfig = {
  slug: "modules",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "tag", "emoji", "order", "updatedAt"],
  },
  defaultSort: "order",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Tytuł modułu",
    },
    {
      name: "tag",
      type: "text",
      label: "Tag",
      admin: {
        description: 'Np. "Moduł 1"',
      },
    },
    {
      name: "emoji",
      type: "text",
      label: "Emoji",
    },
    {
      name: "intro",
      type: "textarea",
      label: "Wstęp modułu",
      admin: {
        description: "Krótki opis modułu widoczny w CMS (opcjonalnie).",
      },
    },
    {
      name: "order",
      type: "number",
      required: true,
      label: "Kolejność",
      admin: {
        description: "Niższa wartość = wyżej na liście.",
      },
    },
  ],
};
