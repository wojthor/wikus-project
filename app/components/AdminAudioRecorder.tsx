"use client";

import type { UIFieldClientComponent } from "payload";
import { useEffect, useRef, useState } from "react";

import { getMediaPlaybackUrl } from "./admin-upload-value";
import { UnschoolAudioPlayer } from "./UnschoolAudioPlayer";
import { AdminFieldPlaceholder, useClientMounted } from "./useClientMounted";
import { useAdminMediaSource } from "./useAdminMediaSource";
import { useAdminSubmissionId } from "./useAdminSubmissionId";
import { usePayloadUploadField } from "./usePayloadUploadField";
import {
  beginRecording,
  finalizeRecording,
  openMicrophoneStream,
  parseMicrophoneError,
  recordingFilename,
  stopRecordingTracks,
} from "@/src/features/elearning/browser-audio-recording";
import { setTeacherAudioStaging } from "@/src/features/elearning/teacher-audio-staging";

const TEACHER_AUDIO_FIELD = "teacherAudio";

function resolveMediaId(value: unknown): string | number | null {
  if (value == null || value === "") return null;
  if (typeof value === "object" && "id" in value) {
    return resolveMediaId((value as { id: unknown }).id);
  }
  return value as string | number;
}

export const AdminAudioRecorderField: UIFieldClientComponent = () => {
  const mounted = useClientMounted();
  const submissionId = useAdminSubmissionId();
  const { value: formTeacherAudio, setValue: setTeacherAudio, disabled: formBusy } =
    usePayloadUploadField<string | number | null>(TEACHER_AUDIO_FIELD);

  const {
    mediaId: savedMediaId,
    playbackUrl: savedPlaybackUrl,
    isLoading: loadingMeta,
  } = useAdminMediaSource("teacher");

  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState(false);

  const sessionRef = useRef<ReturnType<typeof beginRecording> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingPreviewRef = useRef<string | null>(null);

  const formMediaId = resolveMediaId(formTeacherAudio);
  const publishedMediaId = savedMediaId;
  const stagedMediaId =
    pendingRemoval || formMediaId == null
      ? null
      : String(formMediaId) !== String(publishedMediaId ?? "")
        ? formMediaId
        : null;

  const hasUnsavedRecording = pendingRemoval || stagedMediaId != null;
  const hasRecording = !pendingRemoval && (stagedMediaId != null || publishedMediaId != null);

  const playbackSrc =
    pendingPreviewUrl ??
    savedPlaybackUrl ??
    (publishedMediaId != null && !pendingRemoval
      ? getMediaPlaybackUrl(publishedMediaId)
      : null);

  useEffect(() => {
    return () => {
      if (pendingPreviewRef.current) {
        URL.revokeObjectURL(pendingPreviewRef.current);
      }
    };
  }, []);

  const revokePendingPreview = () => {
    if (pendingPreviewRef.current) {
      URL.revokeObjectURL(pendingPreviewRef.current);
      pendingPreviewRef.current = null;
    }
    setPendingPreviewUrl(null);
  };

  const stageBlobForSave = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("file", blob, recordingFilename(blob.type, "feedback"));
    formData.append("alt", "Feedback głosowy (nauczyciel)");

    const res = await fetch("/api/admin/upload-audio", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = (await res.json().catch(() => ({}))) as {
      doc?: { id?: string | number };
      message?: string;
    };

    if (!res.ok) {
      throw new Error(data.message ?? `Błąd uploadu (${res.status})`);
    }

    const mediaId = resolveMediaId(data.doc?.id);
    if (mediaId == null) {
      throw new Error("Nie udało się przygotować nagrania do zapisu.");
    }

    if (pendingPreviewRef.current) {
      URL.revokeObjectURL(pendingPreviewRef.current);
    }
    const previewUrl = URL.createObjectURL(blob);
    pendingPreviewRef.current = previewUrl;
    setPendingPreviewUrl(previewUrl);

    setPendingRemoval(false);
    setTeacherAudio(mediaId);
    if (submissionId) {
      setTeacherAudioStaging(submissionId, { mediaId, remove: false });
    }
  };

  const clear = () => {
    revokePendingPreview();
    setPendingRemoval(true);
    setTeacherAudio(null);
    setError(null);
    if (submissionId) {
      setTeacherAudioStaging(submissionId, { mediaId: null, remove: true });
    }
  };

  const start = async () => {
    setError(null);
    revokePendingPreview();
    setPendingRemoval(false);
    setTeacherAudio(null);
    if (submissionId) {
      setTeacherAudioStaging(submissionId, null);
    }

    try {
      const stream = await openMicrophoneStream();
      const session = beginRecording(stream);
      sessionRef.current = session;
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (err: unknown) {
      setError(parseMicrophoneError(err));
    }
  };

  const stop = () => {
    const session = sessionRef.current;
    if (!session) return;

    session.recorder.onstop = () => {
      void (async () => {
        const blob = finalizeRecording(session);
        stopRecordingTracks(session);
        sessionRef.current = null;

        if (blob.size < 1) {
          setError("Nagranie jest puste — spróbuj ponownie.");
          return;
        }

        setBusy(true);
        try {
          await stageBlobForSave(blob);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : "Nie udało się przygotować nagrania.");
        } finally {
          setBusy(false);
        }
      })();
    };

    if (session.recorder.state !== "inactive") {
      session.recorder.stop();
    }

    setRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const label = "Feedback głosowy (nauczyciel)";

  if (!mounted) return <AdminFieldPlaceholder />;

  if (!submissionId) {
    return (
      <div className="field-type">
        <p className="field-description">Ładowanie formularza feedbacku…</p>
      </div>
    );
  }

  return (
    <div className="field-type upload">
      <label className="field-label">{label}</label>

      <p className="field-description">
        Po zatrzymaniu nagrania kliknij <strong>Zapisz</strong> u góry strony — wtedy uczeń zobaczy
        feedback na e-learningu i dostanie maila.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", margin: "0.75rem 0" }}>
        {!recording ? (
          <button
            type="button"
            onClick={() => void start()}
            disabled={busy || loadingMeta || formBusy}
            className="btn btn--style-primary btn--size-small"
          >
            {hasRecording || hasUnsavedRecording ? "Nagraj ponownie" : "Rozpocznij nagrywanie"}
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            className="btn btn--style-primary btn--size-small"
          >
            Zatrzymaj · {fmt(seconds)}
          </button>
        )}
        {(hasRecording || hasUnsavedRecording) && (
          <button
            type="button"
            onClick={clear}
            disabled={busy || recording || formBusy}
            className="btn btn--style-secondary btn--size-small"
          >
            Usuń nagranie
          </button>
        )}
      </div>

      {busy && <p className="field-description">Przygotowywanie nagrania…</p>}
      {error && (
        <p className="field-description" style={{ color: "var(--theme-error-500)" }}>
          {error}
        </p>
      )}
      {hasUnsavedRecording && !busy && !formBusy && !error && (
        <p className="field-description" style={{ color: "var(--theme-warning-800)" }}>
          Nagranie czeka na zapis — kliknij <strong>Zapisz</strong> u góry.
        </p>
      )}

      {playbackSrc && !busy && !loadingMeta && !pendingRemoval && (
        <UnschoolAudioPlayer
          key={String(stagedMediaId ?? publishedMediaId ?? playbackSrc)}
          src={playbackSrc}
          downloadHref={`${playbackSrc}?download=1`}
          filename="feedback.webm"
        />
      )}

      {!hasRecording && !hasUnsavedRecording && !busy && !loadingMeta && (
        <p className="field-description">Brak feedbacku głosowego.</p>
      )}
    </div>
  );
};
