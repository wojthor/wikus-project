import type { CollectionConfig } from "payload";

import { isPlatformAdmin } from "@/src/lib/platform-admin";
import { getMediaStorageDir } from "@/src/lib/media-storage";

const useBlobOnServer =
  Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()) ||
  Boolean(process.env.VERCEL);

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    ...(useBlobOnServer
      ? { disableLocalStorage: true }
      : { staticDir: getMediaStorageDir() }),
    mimeTypes: ["audio/*", "video/webm", "application/octet-stream"],
    imageSizes: [],
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
    {
      name: "blobUrl",
      type: "text",
      label: "URL (Vercel Blob)",
      admin: { hidden: true },
    },
    {
      name: "blobPathname",
      type: "text",
      label: "Ścieżka (Vercel Blob)",
      admin: { hidden: true },
    },
  ],
};
