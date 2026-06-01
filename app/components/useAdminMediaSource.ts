"use client";

import { useCallback, useEffect, useState } from "react";

import { useAdminSubmissionId } from "./useAdminSubmissionId";

type AudioMeta = {
  mediaId: string | number | null;
  filename: string;
  playbackUrl: string | null;
  downloadUrl: string | null;
};

const emptyMeta: AudioMeta = {
  mediaId: null,
  filename: "nagranie.webm",
  playbackUrl: null,
  downloadUrl: null,
};

export function useAdminMediaSource(which: "student" | "teacher" = "student") {
  const submissionId = useAdminSubmissionId();

  const [meta, setMeta] = useState<AudioMeta>(emptyMeta);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const load = useCallback(async () => {
    if (!submissionId) {
      setMeta(emptyMeta);
      setIsError(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      const res = await fetch(
        `/api/admin/submissions/${submissionId}/audio?which=${which}`,
        { credentials: "include", cache: "no-store" },
      );
      const data = (await res.json().catch(() => ({}))) as AudioMeta & { message?: string };

      if (!res.ok) {
        throw new Error(data.message ?? `Błąd ${res.status}`);
      }

      setMeta({
        mediaId: data.mediaId ?? null,
        filename: data.filename ?? "nagranie.webm",
        playbackUrl: data.playbackUrl ?? null,
        downloadUrl: data.downloadUrl ?? null,
      });
    } catch {
      setIsError(true);
      setMeta(emptyMeta);
    } finally {
      setIsLoading(false);
    }
  }, [submissionId, which]);

  useEffect(() => {
    void load();
  }, [load]);

  const isEmpty = !isLoading && !isError && meta.mediaId == null;

  return {
    submissionId,
    mediaId: meta.mediaId,
    filename: meta.filename,
    playbackUrl: meta.playbackUrl,
    downloadUrl: meta.downloadUrl,
    isLoading,
    isError,
    isEmpty,
    reload: load,
  };
}
