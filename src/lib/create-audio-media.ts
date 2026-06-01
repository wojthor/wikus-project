import type { Payload, PayloadRequest, User } from "payload";

import { uploadAudioToBlob } from "@/src/lib/audio-blob-storage";
import { ensureMediaStorageDir } from "@/src/lib/media-storage";

type CreateAudioMediaOptions = {
  alt: string;
  buffer: Buffer;
  name: string;
  mimetype: string;
  req?: PayloadRequest;
  user?: User | null;
  overrideAccess?: boolean;
};

/** Zapis nagrania w Payload + opcjonalnie Vercel Blob (produkcja). */
export async function createAudioMediaDocument(
  payload: Payload,
  options: CreateAudioMediaOptions,
) {
  await ensureMediaStorageDir();

  const blob = await uploadAudioToBlob(options.buffer, options.name);

  return payload.create({
    collection: "media",
    data: {
      alt: options.alt,
      ...(blob
        ? { blobUrl: blob.url, blobPathname: blob.pathname }
        : {}),
    },
    file: {
      data: options.buffer,
      mimetype: options.mimetype,
      name: options.name,
      size: options.buffer.length,
    },
    req: options.req,
    user: options.user ?? undefined,
    overrideAccess: options.overrideAccess ?? false,
    depth: 0,
  });
}
