export type PayloadMedia = {
  id: string | number;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
};

type PayloadErrorResponse = {
  message?: string;
  errors?: Array<{ message?: string }>;
};

function parseApiError(payload: PayloadErrorResponse, status: number): string {
  if (payload.errors?.length) {
    return payload.errors.map((e) => e.message).filter(Boolean).join(" · ") || `Błąd API (${status})`;
  }
  if (payload.message) return payload.message;
  return `Błąd API (${status})`;
}

function resolveMediaUploadUrl(): string {
  if (typeof window === "undefined") return "/api/elearning/upload-audio";
  if (window.location.pathname.startsWith("/admin")) {
    return "/api/admin/upload-audio";
  }
  return "/api/elearning/upload-audio";
}

/** Wgrywa nagranie do kolekcji Media (admin → dedykowany endpoint serwerowy). */
export async function uploadMediaFile(
  blob: Blob,
  filename = "nagranie.webm",
): Promise<PayloadMedia> {
  const file =
    blob instanceof File
      ? blob
      : new File([blob], filename, { type: blob.type || "audio/webm" });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("alt", "Nagranie głosowe");

  const uploadUrl = resolveMediaUploadUrl();
  if (!uploadUrl.includes("/elearning/") && !uploadUrl.includes("/admin/")) {
    formData.append("_payload", JSON.stringify({ alt: "Nagranie głosowe" }));
  }

  const res = await fetch(uploadUrl, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = (await res.json().catch(() => ({}))) as ({ doc?: PayloadMedia } & PayloadMedia) &
    PayloadErrorResponse;

  if (!res.ok) {
    throw new Error(parseApiError(data, res.status));
  }

  const doc = "doc" in data && data.doc ? data.doc : (data as PayloadMedia);
  if (!doc?.id) {
    throw new Error("Brak ID pliku po wgraniu nagrania.");
  }
  return doc;
}

export async function fetchMediaById(
  id: string | number,
): Promise<PayloadMedia | null> {
  const res = await fetch(`/api/media/${id}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
  });

  if (res.status === 404) return null;

  const data = (await res.json().catch(() => ({}))) as PayloadMedia & PayloadErrorResponse;

  if (!res.ok) {
    throw new Error(parseApiError(data, res.status));
  }

  return data;
}

export type MediaRelation = string | number | PayloadMedia | null | undefined;

export function resolveMediaId(value: MediaRelation): string | null {
  if (value == null) return null;
  if (typeof value === "object" && "id" in value) return String(value.id);
  return String(value);
}

export function resolveMediaUrl(value: MediaRelation): string | null {
  if (value == null) return null;
  if (typeof value === "object" && "url" in value && value.url) {
    return value.url;
  }
  return null;
}

/** URL do odtwarzania w przeglądarce (obejście problemu HEAD na /api/media/file/...). */
export function resolveMediaPlaybackUrl(value: MediaRelation): string | null {
  const id = resolveMediaId(value);
  if (!id) return null;
  if (typeof id === "string" && !/^\d+$/.test(id.trim())) return null;
  return `/api/media-playback/${id}`;
}
