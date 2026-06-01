/** Nagrywanie audio w przeglądarce - Safari/iOS (mp4) + Chrome (webm). */

const RECORDER_MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/aac",
  "audio/ogg;codecs=opus",
  "audio/ogg",
] as const;

export function pickRecorderMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) {
    return undefined;
  }
  return RECORDER_MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type));
}

export function recordingFilename(mimeType: string, prefix = "nagranie"): string {
  const lower = mimeType.toLowerCase();
  const ext =
    lower.includes("mp4") || lower.includes("aac") || lower.includes("mpeg")
      ? "m4a"
      : lower.includes("ogg")
        ? "ogg"
        : "webm";
  return `${prefix}-${Date.now()}.${ext}`;
}

export function parseMicrophoneError(err: unknown): string {
  if (err instanceof Error) {
    if (err.message === "NO_MEDIA_API") {
      return "Twoja przeglądarka nie obsługuje nagrywania. Użyj aktualnego Safari lub Chrome.";
    }
    if (err.message === "NO_RECORD_API") {
      return "Ta przeglądarka nie obsługuje nagrywania głosu. Zaktualizuj system lub zmień przeglądarkę.";
    }
    if (err.message === "INSECURE_CONTEXT") {
      return "Nie udało się uruchomić mikrofonu. Sprawdź uprawnienia w ustawieniach przeglądarki.";
    }

    const name = err.name;
    if (name === "NotAllowedError" || name === "PermissionDeniedError") {
      return "Brak zgody na mikrofon. W ustawieniach telefonu i przeglądarki zezwól na mikrofon dla tej strony.";
    }
    if (name === "NotFoundError" || name === "DevicesNotFoundError") {
      return "Nie wykryto mikrofonu na tym urządzeniu.";
    }
    if (name === "NotReadableError" || name === "TrackStartError") {
      return "Mikrofon jest zajęty przez inną aplikację. Zamknij ją i spróbuj ponownie.";
    }
    if (name === "SecurityError" || name === "NotSupportedError") {
      return "Twoja przeglądarka nie obsługuje nagrywania głosu. Spróbuj Safari lub Chrome.";
    }
  }

  return "Nie udało się uruchomić mikrofonu. Sprawdź uprawnienia w ustawieniach urządzenia.";
}

export async function openMicrophoneStream(): Promise<MediaStream> {
  if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    throw new Error("NO_MEDIA_API");
  }
  if (!window.isSecureContext) {
    throw new Error("INSECURE_CONTEXT");
  }
  if (typeof MediaRecorder === "undefined") {
    throw new Error("NO_RECORD_API");
  }

  return navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      channelCount: { ideal: 1 },
    },
    video: false,
  });
}

export function createAudioMediaRecorder(stream: MediaStream): {
  recorder: MediaRecorder;
  mimeType: string;
} {
  const preferred = pickRecorderMimeType();
  const recorder = preferred
    ? new MediaRecorder(stream, { mimeType: preferred })
    : new MediaRecorder(stream);

  return {
    recorder,
    mimeType: recorder.mimeType || preferred || "audio/webm",
  };
}

export function buildRecordingBlob(chunks: BlobPart[], mimeType: string): Blob {
  const filtered = chunks.filter((c) => {
    if (c instanceof Blob) return c.size > 0;
    if (c instanceof ArrayBuffer) return c.byteLength > 0;
    return true;
  });
  return new Blob(filtered, { type: mimeType });
}

export type ActiveRecording = {
  stream: MediaStream;
  recorder: MediaRecorder;
  mimeType: string;
  chunks: BlobPart[];
};

export function beginRecording(stream: MediaStream): ActiveRecording {
  const { recorder, mimeType } = createAudioMediaRecorder(stream);
  const chunks: BlobPart[] = [];

  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  // Interwał pomaga iOS/Safari - bez tego czasem brak danych w onstop.
  recorder.start(500);

  return { stream, recorder, mimeType, chunks };
}

export function stopRecordingTracks(session: ActiveRecording): void {
  session.stream.getTracks().forEach((track) => track.stop());
}

export function finalizeRecording(session: ActiveRecording): Blob {
  return buildRecordingBlob(session.chunks, session.mimeType);
}
