import fs from "fs/promises";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import config from "@payload-config";
import { readPrivateAudioBlob } from "@/src/lib/audio-blob-storage";
import { resolveMediaFilePath } from "@/src/lib/media-storage";

type RouteParams = { params: Promise<{ id: string }> };

type MediaFile =
  | { kind: "stream"; stream: ReadableStream<Uint8Array>; mime: string; filename: string; size: number }
  | { kind: "buffer"; buffer: Buffer; mime: string; filename: string; size: number };

async function loadMediaFile(id: string): Promise<MediaFile | null> {
  const payload = await getPayload({ config });
  const doc = await payload.findByID({
    collection: "media",
    id,
    overrideAccess: true,
  });

  const blobPathname =
    (typeof doc?.blobPathname === "string" && doc.blobPathname.trim()) ||
    (typeof doc?.blobUrl === "string" && doc.blobUrl.includes(".private.blob.")
      ? doc.blobUrl
      : "");

  if (blobPathname) {
    const privateBlob = await readPrivateAudioBlob(blobPathname);
    if (privateBlob) {
      let mime = privateBlob.mime;
      if (mime === "video/webm") mime = "audio/webm";
      return {
        kind: "stream",
        stream: privateBlob.stream,
        mime,
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
      let mime = typeof doc.mimeType === "string" ? doc.mimeType : "audio/webm";
      if (mime === "video/webm") mime = "audio/webm";
      return { kind: "buffer", buffer, mime, filename, size: buffer.length };
    }
  }

  const filename = typeof doc?.filename === "string" ? doc.filename : null;
  if (!filename) return null;

  const filePath = resolveMediaFilePath(filename);
  const stat = await fs.stat(filePath).catch(() => null);
  if (!stat?.isFile()) return null;

  const buffer = await fs.readFile(filePath);
  let mime = typeof doc.mimeType === "string" ? doc.mimeType : "audio/webm";
  if (mime === "video/webm") mime = "audio/webm";

  return { kind: "buffer", buffer, mime, filename, size: stat.size };
}

function playbackHeaders(file: MediaFile, asDownload: boolean) {
  const disposition = asDownload ? "attachment" : "inline";
  return {
    "Content-Type": file.mime,
    "Content-Length": String(file.size),
    "Content-Disposition": `${disposition}; filename="${encodeURIComponent(file.filename)}"`,
    "Cache-Control": "private, no-cache",
    "X-Content-Type-Options": "nosniff",
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const file = await loadMediaFile(id);
  if (!file) {
    return NextResponse.json({ message: "Nie znaleziono pliku audio." }, { status: 404 });
  }

  const asDownload = new URL(request.url).searchParams.get("download") === "1";

  if (file.kind === "stream") {
    return new NextResponse(file.stream, {
      status: 200,
      headers: playbackHeaders(file, asDownload),
    });
  }

  return new NextResponse(new Uint8Array(file.buffer), {
    status: 200,
    headers: playbackHeaders(file, asDownload),
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
