import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import config from "@payload-config";

type RouteParams = { params: Promise<{ id: string }> };

async function loadMediaFile(id: string) {
  const payload = await getPayload({ config });
  const doc = await payload.findByID({
    collection: "media",
    id,
    overrideAccess: true,
  });

  const filename = typeof doc?.filename === "string" ? doc.filename : null;
  if (!filename) return null;

  const filePath = path.join(process.cwd(), "media", filename);
  const stat = await fs.stat(filePath).catch(() => null);
  if (!stat?.isFile()) return null;

  const buffer = await fs.readFile(filePath);
  let mime = typeof doc.mimeType === "string" ? doc.mimeType : "audio/webm";
  if (mime === "video/webm") mime = "audio/webm";

  return { buffer, mime, filename, size: stat.size };
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const file = await loadMediaFile(id);
  if (!file) {
    return NextResponse.json({ message: "Nie znaleziono pliku audio." }, { status: 404 });
  }

  const asDownload = new URL(request.url).searchParams.get("download") === "1";
  const disposition = asDownload ? "attachment" : "inline";

  return new NextResponse(file.buffer, {
    status: 200,
    headers: {
      "Content-Type": file.mime,
      "Content-Length": String(file.size),
      "Content-Disposition": `${disposition}; filename="${encodeURIComponent(file.filename)}"`,
      "Cache-Control": "private, max-age=3600",
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
    },
  });
}
