import type { CollectionConfig } from "payload";

import { isPlatformAdmin } from "@/src/lib/platform-admin";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticDir: "media",
    mimeTypes: ["audio/*", "video/webm", "application/octet-stream"],
  },
  admin: {
    hidden: true,
    useAsTitle: "filename",
    description: "Magazyn plików audio — edytuj feedback w Zgłoszeniach (Submissions).",
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => isPlatformAdmin(req.user),
    delete: ({ req }) => isPlatformAdmin(req.user),
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Opis (alt)",
    },
  ],
};
