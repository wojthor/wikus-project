"use client";

import { useCallback, useEffect, useState } from "react";
import type { UIFieldClientComponent } from "payload";

import { UnschoolAudioPlayer } from "./UnschoolAudioPlayer";
import { AdminFieldPlaceholder, useClientMounted } from "./useClientMounted";
import { useAdminSubmissionId } from "./useAdminSubmissionId";

type ChallengeAudioItem = {
  day: number;
  mediaId: string | number;
  filename: string;
  playbackUrl: string;
  downloadUrl: string;
};

export const AdminSubmissionChallengeAudioListenField: UIFieldClientComponent = () => {
  const mounted = useClientMounted();
  const submissionId = useAdminSubmissionId();
  const [items, setItems] = useState<ChallengeAudioItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const load = useCallback(async () => {
    if (!submissionId) return;
    setIsLoading(true);
    setIsError(false);

    try {
      const res = await fetch(`/api/admin/submissions/${submissionId}/challenge-audio`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("fetch failed");
      const data = (await res.json()) as { items?: ChallengeAudioItem[] };
      setItems(data.items ?? []);
    } catch {
      setIsError(true);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!mounted) return <AdminFieldPlaceholder />;
  if (!submissionId) return null;

  const grouped = items.reduce<Record<number, ChallengeAudioItem[]>>((acc, item) => {
    const list = acc[item.day] ?? [];
    list.push(item);
    acc[item.day] = list;
    return acc;
  }, {});

  const days = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="field-type" style={{ marginBottom: "1.5rem" }}>
      <label className="field-label">7-dniowy challenge — nagrania ucznia</label>
      <p className="field-description">Głosówki wysłane z platformy e-learning (po jednym dniu).</p>

      {isLoading && <p className="field-description">Ładowanie nagrań…</p>}

      {isError && (
        <p className="field-description" style={{ color: "var(--theme-error-500)" }}>
          Nie udało się wczytać nagrań challenge.{" "}
          <button
            type="button"
            className="btn btn--style-secondary btn--size-small"
            onClick={() => void load()}
          >
            Spróbuj ponownie
          </button>
        </p>
      )}

      {!isLoading && !isError && days.length === 0 && (
        <p className="field-description">Brak nagrań challenge w tym zgłoszeniu.</p>
      )}

      {days.map((day) => (
        <div key={day} style={{ marginTop: "1rem" }}>
          <p className="field-description" style={{ fontWeight: 600 }}>
            Dzień {day}
          </p>
          {grouped[day].map((item, index) => (
            <div key={`${item.mediaId}-${index}`} style={{ marginTop: "0.75rem" }}>
              <p className="field-description">
                Nagranie {index + 1}: {item.filename}
              </p>
              <UnschoolAudioPlayer
                key={String(item.mediaId)}
                src={item.playbackUrl}
                downloadHref={item.downloadUrl}
                filename={item.filename}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
