"use client";

import type { UIFieldClientComponent } from "payload";

import { UnschoolAudioPlayer } from "./UnschoolAudioPlayer";
import { AdminFieldPlaceholder, useClientMounted } from "./useClientMounted";
import { useAdminMediaSource } from "./useAdminMediaSource";
import { useAdminSubmissionId } from "./useAdminSubmissionId";

export const AdminSubmissionAudioListenField: UIFieldClientComponent = () => {
  const mounted = useClientMounted();
  const submissionId = useAdminSubmissionId();
  const {
    mediaId,
    filename,
    playbackUrl,
    downloadUrl,
    isLoading,
    isError,
    isEmpty,
    reload,
  } = useAdminMediaSource("student");

  if (!mounted) return <AdminFieldPlaceholder />;

  if (!submissionId) {
    return null;
  }

  return (
    <div className="field-type" style={{ marginBottom: "1.5rem" }}>
      <label className="field-label">Odpowiedź głosowa ucznia</label>
      <p className="field-description">Nagranie wysłane z platformy e-learning.</p>

      {isLoading && <p className="field-description">Ładowanie nagrania…</p>}

      {isEmpty && !isError && !isLoading && (
        <p className="field-description">Brak odpowiedzi głosowej w tym zadaniu.</p>
      )}

      {isError && (
        <p className="field-description" style={{ color: "var(--theme-error-500)" }}>
          Nie udało się wczytać nagrania.{" "}
          <button
            type="button"
            className="btn btn--style-secondary btn--size-small"
            onClick={() => void reload()}
          >
            Spróbuj ponownie
          </button>
        </p>
      )}

      {playbackUrl && !isLoading && (
        <>
          <p className="field-description">Plik: {filename}</p>
          <UnschoolAudioPlayer
            key={String(mediaId ?? playbackUrl)}
            src={playbackUrl}
            downloadHref={downloadUrl ?? playbackUrl}
            filename={filename}
          />
          <p style={{ marginTop: "0.5rem" }}>
            <a
              href={playbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--style-secondary btn--size-small"
            >
              Otwórz nagranie w nowej karcie
            </a>
          </p>
        </>
      )}
    </div>
  );
};
