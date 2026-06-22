import fs from "fs/promises";
import { NextResponse } from "next/server";
import { readPrivateAudioBlob } from "@/src/lib/audio-blob-storage";
import { getCachedPayload } from "@/src/lib/payload-cache";
import { resolveMediaFilePath } from "@/src/lib/media-storage";
import { sqlGetMediaBlobMeta } from "@/src/lib/media-sql";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ id: string }> };

type MediaFile =
  | { kind: "stream"; stream: ReadableStream<Uint8Array>; mime: string; filename: string; size: number }
  | { kind: "buffer"; buffer: Buffer; mime: string; filename: string; size: number };

function normalizePlaybackMime(mime: string | null | undefined): string {
  if (!mime || mime === "video/webm") return "audio/webm";
  return mime;
}

async function loadMediaFile(id: string): Promise<MediaFile | null> {
  const sqlMeta = await sqlGetMediaBlobMeta(id).catch((err) => {
    console.error("[media-playback] sqlGetMediaBlobMeta", err);
    return null;
  });

  const blobPathname =
    sqlMeta?.blobPathname?.trim() ||
    (sqlMeta?.blobUrl?.includes(".private.blob.") ? sqlMeta.blobUrl.trim() : "");

  if (blobPathname) {
    const privateBlob = await readPrivateAudioBlob(blobPathname);
    if (privateBlob) {
      return {
        kind: "stream",
        stream: privateBlob.stream,
        mime: normalizePlaybackMime(privateBlob.mime),
        filename: sqlMeta?.filename ?? privateBlob.filename,
        size: privateBlob.size,
      };
    }
    console.error("[media-playback] Blob read failed for", blobPathname);
  }

  const payload = await getCachedPayload();
  const doc = await payload.findByID({
    collection: "media",
    id,
    overrideAccess: true,
  });

  const docPathname =
    (typeof doc?.blobPathname === "string" && doc.blobPathname.trim()) ||
    (typeof doc?.blobUrl === "string" && doc.blobUrl.includes(".private.blob.")
      ? doc.blobUrl.trim()
      : "");

  if (docPathname && docPathname !== blobPathname) {
    const privateBlob = await readPrivateAudioBlob(docPathname);
    if (privateBlob) {
      return {
        kind: "stream",
        stream: privateBlob.stream,
        mime: normalizePlaybackMime(privateBlob.mime),
        filename: typeof doc.filename === "string" ? doc.filename : privateBlob.filename,
        size: privateBlob.size,
      };
    }
  }

  const blobUrl = typeof doc?.blobUrl === "string" ? doc.blobUrl.trim() : "";
  if (blobUrl && !blobUrl.includes(".private.blob.")) {
    const remote = await fetch(blobUrl);
    if (remote.ok) {
      const buffer = Buffer.from(await remote.arrayBuffer());
      const filename = typeof doc.filename === "string" ? doc.filename : "nagranie.webm";
      return {
        kind: "buffer",
        buffer,
        mime: normalizePlaybackMime(doc.mimeType as string | undefined),
        filename,
        size: buffer.length,
      };
    }
  }

  const filename = typeof doc?.filename === "string" ? doc.filename : sqlMeta?.filename;
  if (!filename) return null;

  const filePath = resolveMediaFilePath(filename);
  const stat = await fs.stat(filePath).catch(() => null);
  if (!stat?.isFile()) return null;

  const buffer = await fs.readFile(filePath);
  return {
    kind: "buffer",
    buffer,
    mime: normalizePlaybackMime(doc.mimeType as string | undefined),
    filename,
    size: stat.size,
  };
}

function parseRangeHeader(
  rangeHeader: string | null,
  totalSize: number,
): { start: number; end: number } | null {
  if (!rangeHeader) return null;
  const match = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
  if (!match) return null;
  const start = match[1] ? parseInt(match[1], 10) : 0;
  const end = match[2] ? parseInt(match[2], 10) : totalSize - 1;
  const safeStart = Math.max(0, Math.min(start, totalSize - 1));
  const safeEnd = Math.max(safeStart, Math.min(end, totalSize - 1));
  return { start: safeStart, end: safeEnd };
}

function baseHeaders(file: MediaFile, asDownload: boolean) {
  const disposition = asDownload ? "attachment" : "inline";
  return {
    "Content-Type": file.mime,
    "Content-Disposition": `${disposition}; filename="${encodeURIComponent(file.filename)}"`,
    "Cache-Control": "private, no-cache",
    "X-Content-Type-Options": "nosniff",
    "Accept-Ranges": "bytes",
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const asDownload = searchParams.get("download") === "1";
  const rangeHeader = request.headers.get("range");

  const file = await loadMediaFile(id);
  if (!file) {
    return NextResponse.json({ message: "Nie znaleziono pliku audio." }, { status: 404 });
  }

  const buffer =
    file.kind === "buffer"
      ? file.buffer
      : await (async () => {
          const reader = file.stream.getReader();
          const chunks: Uint8Array[] = [];
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) chunks.push(value);
          }
          return Buffer.concat(chunks);
        })();

  const totalSize = buffer.length;
  const range = parseRangeHeader(rangeHeader, totalSize);

  // iOS Safari sends a Range: bytes=0-1 probe to discover file size, then immediately
  // starts "playing" those 2 bytes (silence) before requesting the real content.
  // Responding with the full file on probe requests eliminates the silent first play.
  const isProbe = range && range.start === 0 && range.end === 1;

  if (range && !isProbe) {
    const { start, end } = range;
    const chunkSize = end - start + 1;
    const sliced = buffer.subarray(start, end + 1);
    return new NextResponse(new Uint8Array(sliced), {
      status: 206,
      headers: {
        ...baseHeaders(file, asDownload),
        "Content-Length": String(chunkSize),
        "Content-Range": `bytes ${start}-${end}/${totalSize}`,
      },
    });
  }

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      ...baseHeaders(file, asDownload),
      "Content-Length": String(totalSize),
    },
  });
}

export async function HEAD(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const file = await loadMediaFile(id);
  if (!file) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(null, {
    status: 200,
    headers: {
      "Content-Type": file.mime,
      "Content-Length": String(file.size),
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, no-cache",
    },
  });
}
