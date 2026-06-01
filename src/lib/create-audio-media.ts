import type { Payload, PayloadRequest, User } from "payload";

import { uploadAudioToBlob } from "@/src/lib/audio-blob-storage";
import { ensureMediaStorageDir } from "@/src/lib/media-storage";
import { ensureMediaBlobColumns, sqlCreateBlobMedia } from "@/src/lib/media-sql";

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

/** Zapis nagrania: Vercel Blob + SQL (prod) lub Payload + dysk (dev). */
export async function createAudioMediaDocument(
  payload: Payload,
  options: CreateAudioMediaOptions,
) {
  await ensureMediaBlobColumns();

  let blobRef: Awaited<ReturnType<typeof uploadAudioToBlob>> = null;
  try {
    blobRef = await uploadAudioToBlob(options.buffer, options.name);
  } catch (err) {
    console.error("[create-audio-media] Blob upload failed:", err);
    if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
      throw new Error(
        `Vercel Blob: ${formatUploadError(err)}. Sprawdź, czy store jest podłączony do projektu.`,
      );
    }
  }

  if (blobRef) {
    const sqlDoc = await sqlCreateBlobMedia({
      alt: options.alt,
      filename: options.name,
      mimeType: options.mimetype,
      filesize: options.buffer.length,
      blobUrl: blobRef.url,
      blobPathname: blobRef.pathname,
    });

    if (sqlDoc) {
      return {
        id: sqlDoc.id,
        filename: sqlDoc.filename,
        mimeType: sqlDoc.mimeType,
        blobUrl: sqlDoc.blobUrl,
        blobPathname: sqlDoc.blobPathname,
        url: null,
      };
    }

    console.warn(
      "[create-audio-media] SQL insert failed — fallback do Payload (może nie działać na Vercel).",
    );
  }

  await ensureMediaStorageDir();

  try {
    return await payload.create({
      collection: "media",
      data: {
        alt: options.alt,
        ...(blobRef
          ? { blobUrl: blobRef.url, blobPathname: blobRef.pathname }
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
  } catch (err) {
    console.error("[create-audio-media] Payload create failed:", err);
    throw new Error(formatUploadError(err));
  }
}
