"use client";

import { useState } from "react";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

type SubmissionAudioPlayerProps = {
  src: string;
  label: string;
  className?: string;
};

export function SubmissionAudioPlayer({
  src,
  label,
  className = "",
}: SubmissionAudioPlayerProps) {
  const [duration, setDuration] = useState<number | null>(null);

  return (
    <div
      className={`w-full overflow-hidden rounded-xl border border-[#dfe6ff] bg-[#f8faff] p-3 sm:p-4 ${className}`}
    >
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
        {duration != null && (
          <span className="ml-2 font-normal normal-case tracking-normal text-slate-400">
            · {formatDuration(duration)}
          </span>
        )}
      </p>
      <audio
        controls
        src={src}
        className="w-full accent-[#7347f4]"
        preload="none"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      >
        Twoja przeglądarka nie obsługuje odtwarzacza audio.
      </audio>
      {duration == null && (
        <p className="mt-1.5 text-[10px] text-slate-400">
          Naciśnij ▶, żeby załadować nagranie
        </p>
      )}
    </div>
  );
}
