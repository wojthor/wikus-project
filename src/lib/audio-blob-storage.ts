import { get, put } from "@vercel/blob";

export type AudioBlobRef = {
  url: string;
  pathname: string;
};

/** Trwały zapis na Vercel Blob (private store). Lokalnie zwraca null. */
export async function uploadAudioToBlob(
  buffer: Buffer,
  filename: string,
): Promise<AudioBlobRef | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return null;
  }

  const safeName = filename.replace(/[^\w.-]+/g, "_").slice(0, 120);
  const blob = await put(`audio/${Date.now()}-${safeName}`, buffer, {
    access: "private",
    addRandomSuffix: true,
    contentType:
      filename.endsWith(".webm") || filename.includes("webm")
        ? "audio/webm"
        : "application/octet-stream",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return { url: blob.url, pathname: blob.pathname };
}

/** Odczyt nagrania z private Blob (tylko server-side, z tokenem). */
export async function readPrivateAudioBlob(pathnameOrUrl: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return null;
  }

  const result = await get(pathnameOrUrl, { access: "private" });
  if (result?.statusCode !== 200 || !result.stream) {
    return null;
  }

  return {
    stream: result.stream,
    mime: result.blob.contentType || "audio/webm",
    size: result.blob.size,
    filename: pathnameOrUrl.split("/").pop() ?? "nagranie.webm",
  };
}

/**
 * Odczyt nagrania z private Blob z obsługą Range requests.
 * Zamiast buforować cały plik, przekazuje Range header bezpośrednio do Vercel Blob CDN.
 */
export async function fetchPrivateAudioBlobWithRange(
  pathnameOrUrl: string,
  rangeHeader: string | null,
): Promise<{
  response: Response;
  mime: string;
  filename: string;
  size: number;
} | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) return null;

  // Najpierw pobierz metadane żeby dostać URL i rozmiar
  const meta = await get(pathnameOrUrl, { access: "private" });
  if (!meta || meta.statusCode !== 200) return null;

  // Teraz fetch bezpośrednio z Range header — Vercel Blob CDN to obsługuje
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
  if (rangeHeader) headers["Range"] = rangeHeader;

  // Użyj URL z metadanych (prywatny URL z tokenem)
  const blobFetch = await fetch(meta.url, { headers });

  return {
    response: blobFetch,
    mime: meta.blob.contentType || "audio/webm",
    filename: pathnameOrUrl.split("/").pop() ?? "nagranie.webm",
    size: meta.blob.size,
  };
}
