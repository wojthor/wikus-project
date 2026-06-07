import type { MediaRelation } from "./media-api";
import { resolveMediaId, resolveMediaPlaybackUrl } from "./media-api";
import type { PayloadSubmission } from "./submissions-api";

export type ChallengeAudioEntry = {
  day: number;
  audio: MediaRelation;
  id?: string | number | null;
};

export type DayRecording = {
  url: string;
  blob: Blob | null;
  mediaId?: string | number | null;
};

export function challengeDayKey(lessonKey: string, day: number): string {
  return `${lessonKey}-day${day}`;
}

export function getDayRecordings(
  recordings: Record<string, DayRecording[]>,
  lessonKey: string,
  day: number,
): DayRecording[] {
  return recordings[challengeDayKey(lessonKey, day)] ?? [];
}

export function dayHasRecording(
  recordings: Record<string, DayRecording[]>,
  lessonKey: string,
  day: number,
): boolean {
  return getDayRecordings(recordings, lessonKey, day).some(
    (r) => r.blob != null || r.mediaId != null,
  );
}

/** Wymaga co najmniej jednego nagrania na każdy dzień challenge'u. */
export function canSubmitMultidayChallenge(
  days: { day: number }[],
  recordings: Record<string, DayRecording[]>,
  lessonKey: string,
): boolean {
  if (!days.length) return false;
  return days.every((d) => dayHasRecording(recordings, lessonKey, d.day));
}

export function countMissingChallengeDays(
  days: { day: number }[],
  recordings: Record<string, DayRecording[]>,
  lessonKey: string,
): number {
  return days.filter((d) => !dayHasRecording(recordings, lessonKey, d.day)).length;
}

export function collectNewChallengeUploads(
  recordings: Record<string, DayRecording[]>,
  lessonKey: string,
  days: { day: number }[],
): Array<{ day: number; blob: Blob; key: string }> {
  const uploads: Array<{ day: number; blob: Blob; key: string }> = [];

  for (const { day } of days) {
    const key = challengeDayKey(lessonKey, day);
    const recs = recordings[key] ?? [];
    recs.forEach((rec, index) => {
      if (rec.blob && !rec.mediaId) {
        uploads.push({ day, blob: rec.blob, key: `${key}-${index}` });
      }
    });
  }

  return uploads;
}

export function submissionHasChallengeAudios(
  submission: PayloadSubmission | null | undefined,
): boolean {
  return Boolean(submission?.studentChallengeAudios?.length);
}

export function hydrateChallengeRecordingsFromSubmission(
  submission: PayloadSubmission | null | undefined,
  lessonKey: string,
): Record<string, DayRecording[]> {
  const next: Record<string, DayRecording[]> = {};
  const entries = submission?.studentChallengeAudios ?? [];

  for (const entry of entries) {
    const day = entry.day;
    const mediaId = resolveMediaId(entry.audio);
    const url = resolveMediaPlaybackUrl(entry.audio);
    if (!mediaId || !url) continue;

    const key = challengeDayKey(lessonKey, day);
    const list = next[key] ?? [];
    list.push({ url, blob: null, mediaId });
    next[key] = list;
  }

  return next;
}

export function mergeChallengeEntries(
  existing: ChallengeAudioEntry[] | null | undefined,
  uploaded: Array<{ day: number; audio: number | string }>,
): Array<{ day: number; audio: number | string }> {
  const merged = [...(existing ?? [])]
    .map((entry) => ({
      day: entry.day,
      audio: resolveMediaId(entry.audio) ?? entry.audio,
    }))
    .filter((entry) => entry.audio != null) as Array<{ day: number; audio: number | string }>;

  for (const item of uploaded) {
    merged.push(item);
  }

  return merged;
}
