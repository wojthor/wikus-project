import type { Payload, PayloadRequest, User } from "payload";

import { uploadAudioToBlob } from "@/src/lib/audio-blob-storage";
import { ensureMediaStorageDir } from "@/src/lib/media-storage";
import { sqlCreateBlobMedia } from "@/src/lib/media-sql";

type CreateAudioMediaOptions = {
  alt: string;
  buffer: Buffer;
  name: string;
  mimetype: string;
  req?: PayloadRequest;
  user?: User | null;
  overrideAccess?: boolean;
};

function formatUploadError(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  return "Nie udało się zapisać nagrania.";
}

function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

/** Zapis nagrania: Vercel Blob + SQL (prod) lub Payload + dysk (dev). */
export async function createAudioMediaDocument(
  payload: Payload,
  options: CreateAudioMediaOptions,
) {
  if (useBlobStorage()) {
    const blobRef = await uploadAudioToBlob(options.buffer, options.name);
    if (!blobRef) {
      throw new Error("Brak połączenia z Vercel Blob (BLOB_READ_WRITE_TOKEN).");
    }

    const sqlDoc = await sqlCreateBlobMedia({
      alt: options.alt,
      filename: options.name,
      mimeType: options.mimetype.startsWith("audio/") || options.mimetype === "video/webm"
        ? "audio/webm"
        : options.mimetype,
      filesize: options.buffer.length,
      blobUrl: blobRef.url,
      blobPathname: blobRef.pathname,
    });

    return {
      id: sqlDoc.id,
      filename: sqlDoc.filename,
      mimeType: sqlDoc.mimeType,
      blobUrl: sqlDoc.blobUrl,
      blobPathname: sqlDoc.blobPathname,
      url: `/api/media-playback/${sqlDoc.id}`,
    };
  }

  await ensureMediaStorageDir();

  try {
    return await payload.create({
      collection: "media",
      data: { alt: options.alt },
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
  } catch (err) {
    console.error("[create-audio-media] Payload create failed:", err);
    throw new Error(formatUploadError(err));
  }
}
