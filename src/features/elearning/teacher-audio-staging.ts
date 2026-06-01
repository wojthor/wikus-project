export type TeacherAudioStaging = {
  mediaId: string | number | null;
  remove: boolean;
};

const stagingBySubmission = new Map<string, TeacherAudioStaging>();

function key(submissionId: string | number): string {
  return String(submissionId);
}

export function setTeacherAudioStaging(
  submissionId: string | number,
  state: TeacherAudioStaging | null,
): void {
  const id = key(submissionId);
  if (!state || (!state.remove && state.mediaId == null)) {
    stagingBySubmission.delete(id);
    return;
  }
  stagingBySubmission.set(id, state);
}

export function peekTeacherAudioStaging(
  submissionId: string | number,
): TeacherAudioStaging | null {
  return stagingBySubmission.get(key(submissionId)) ?? null;
}

export function consumeTeacherAudioStaging(
  submissionId: string | number,
): TeacherAudioStaging | null {
  const id = key(submissionId);
  const state = stagingBySubmission.get(id) ?? null;
  stagingBySubmission.delete(id);
  return state;
}

export function clearTeacherAudioStaging(submissionId: string | number): void {
  stagingBySubmission.delete(key(submissionId));
}

let flushHookCount = 0;
let nativeFetch: typeof fetch | null = null;

function isAutosavePatch(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    const autosave = parsed.searchParams.get("autosave");
    return autosave === "true" || autosave === "1";
  } catch {
    return url.includes("autosave=true") || url.includes("autosave=1");
  }
}

function parseSubmissionPatchId(url: string): string | null {
  try {
    const parsed = new URL(url, window.location.origin);
    const match = parsed.pathname.match(/\/api\/submissions\/([^/]+)$/);
    return match?.[1] ?? null;
  } catch {
    const match = url.match(/\/api\/submissions\/([^/?]+)/);
    return match?.[1] ?? null;
  }
}

async function flushTeacherAudio(
  submissionId: string,
  staging: TeacherAudioStaging,
): Promise<void> {
  const formData = new FormData();
  if (staging.remove) {
    formData.append("remove", "1");
  } else if (staging.mediaId != null) {
    formData.append("mediaId", String(staging.mediaId));
  } else {
    return;
  }

  const res = await fetch(`/api/admin/submissions/${submissionId}/teacher-audio`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = (await res.json().catch(() => ({}))) as { message?: string };
  if (!res.ok) {
    throw new Error(data.message ?? `Nie udało się zapisać feedbacku głosowego (${res.status})`);
  }
}

async function patchedFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  if (!nativeFetch) {
    throw new Error("Teacher audio fetch hook is not initialized.");
  }

  const url =
    typeof input === "string"
      ? input
      : input instanceof Request
        ? input.url
        : input.toString();
  const method = (
    init?.method ?? (input instanceof Request ? input.method : "GET")
  ).toUpperCase();

  if (method === "PATCH" && !isAutosavePatch(url)) {
    const submissionId = parseSubmissionPatchId(url);
    if (submissionId) {
      const staging = peekTeacherAudioStaging(submissionId);
      if (staging) {
        await flushTeacherAudio(submissionId, staging);
        consumeTeacherAudioStaging(submissionId);
      }
    }
  }

  return nativeFetch(input, init);
}

export function installTeacherAudioFetchFlush(): () => void {
  flushHookCount += 1;

  if (flushHookCount === 1) {
    nativeFetch = window.fetch.bind(window);
    window.fetch = patchedFetch;
  }

  return () => {
    flushHookCount -= 1;
    if (flushHookCount <= 0 && nativeFetch) {
      window.fetch = nativeFetch;
      nativeFetch = null;
      flushHookCount = 0;
    }
  };
}
