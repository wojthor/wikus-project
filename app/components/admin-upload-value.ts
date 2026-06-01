export type UploadFieldValue = unknown;

export type ParsedUploadValue = {
  id: string | number | null;
  url: string | null;
  mimeType: string | null;
  filename: string | null;
};

export function isNumericMediaId(id: string | number | null | undefined): boolean {
  if (id == null) return false;
  if (typeof id === "number") return Number.isFinite(id);
  return /^\d+$/.test(id.trim());
}

export function getMediaPlaybackUrl(id: string | number): string {
  return `/api/media-playback/${id}`;
}

/** Obsługa ID, obiektu Media, { relationTo, value } i zagnieżdżonych dokumentów. */
export function parseUploadFieldValue(value: UploadFieldValue): ParsedUploadValue {
  if (value == null || value === "") {
    return { id: null, url: null, mimeType: null, filename: null };
  }

  if (typeof value === "string" || typeof value === "number") {
    if (isNumericMediaId(value)) {
      return { id: value, url: null, mimeType: null, filename: null };
    }
    if (typeof value === "string" && value.includes(".")) {
      return { id: null, url: null, mimeType: null, filename: value };
    }
    return { id: value, url: null, mimeType: null, filename: null };
  }

  if (typeof value !== "object") {
    return { id: null, url: null, mimeType: null, filename: null };
  }

  const obj = value as Record<string, unknown>;

  if ("relationTo" in obj && "value" in obj) {
    return parseUploadFieldValue(obj.value);
  }

  const url = typeof obj.url === "string" ? obj.url : null;
  const mimeType = typeof obj.mimeType === "string" ? obj.mimeType : null;
  const filename = typeof obj.filename === "string" ? obj.filename : null;

  let id: string | number | null = null;
  if (typeof obj.id === "string" || typeof obj.id === "number") {
    id = isNumericMediaId(obj.id) ? obj.id : null;
  } else if (obj.id && typeof obj.id === "object") {
    const nested = parseUploadFieldValue(obj.id);
    id = nested.id;
    if (!url && nested.url) {
      return {
        id,
        url: nested.url,
        mimeType: mimeType ?? nested.mimeType,
        filename: filename ?? nested.filename,
      };
    }
  }

  if (id != null || url || filename) {
    return { id, url, mimeType, filename };
  }

  return { id: null, url: null, mimeType: null, filename: null };
}

export function extractMediaFromApiResponse(data: unknown): ParsedUploadValue {
  if (!data || typeof data !== "object") {
    return { id: null, url: null, mimeType: null, filename: null };
  }

  const record = data as Record<string, unknown>;
  if ("doc" in record) {
    return parseUploadFieldValue(record.doc);
  }

  if ("docs" in record && Array.isArray(record.docs) && record.docs[0]) {
    return parseUploadFieldValue(record.docs[0]);
  }

  return parseUploadFieldValue(data);
}

/** Względne ścieżki Payload → pełny URL w przeglądarce. */
export function toPlayableMediaUrl(url: string | null): string | null {
  if (!url) return null;
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}${url.startsWith("/") ? url : `/${url}`}`;
  }

  return url;
}
