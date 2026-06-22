"use client";

import Image from "next/image";
import { useState } from "react";

import { lexicalToPlainText, LexicalContent } from "./LexicalContent";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function TeacherAudioPlayer({ src }: { src: string }) {
  const [duration, setDuration] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-[#7347f4]/15 bg-white/60 p-3">
      <audio
        controls
        src={src}
        className="w-full accent-[#7347f4]"
        preload="none"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      >
        Twoja przeglądarka nie obsługuje odtwarzacza audio.
      </audio>
      <p className="mt-2 text-[11px] text-slate-400">
        {duration != null
          ? `Czas nagrania: ${formatDuration(duration)}`
          : "Naciśnij ▶, żeby załadować i odsłuchać feedback"}
        {" · "}
        Czasem trzeba kliknąć dwa razy lub chwilę poczekać.{" "}
        Jeśli dalej nie działa — napisz do Wiktora.
      </p>
    </div>
  );
}

type TeacherFeedbackBlockProps = {
  content?: Record<string, unknown> | null;
  audioUrl?: string | null;
};

export function TeacherFeedbackBlock({ content, audioUrl }: TeacherFeedbackBlockProps) {
  const hasText = Boolean(content && lexicalToPlainText(content).trim().length > 0);
  const hasAudio = Boolean(audioUrl);

  if (!hasText && !hasAudio) return null;

  return (
    <article
      className="mt-6 overflow-hidden rounded-2xl border border-[#7347f4]/20 bg-gradient-to-b from-[#f6f2ff] to-white p-5 shadow-[0_10px_40px_rgba(115,71,244,0.1)] sm:p-6"
      role="region"
      aria-label="Feedback od Wiktora"
    >
      <header className="mb-5 flex items-center gap-3.5">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#7347f4]/25">
          <Image src="/wikus.jpg" alt="Wiktor" fill sizes="48px" className="object-cover" />
        </div>
        <div>
          <p className="text-base font-extrabold text-[#5a32c9]">Wiktor</p>
          <p className="text-xs text-slate-600">Feedback do tego zadania</p>
        </div>
      </header>

      {hasAudio && audioUrl && <TeacherAudioPlayer src={audioUrl} />}

      {hasAudio && hasText && <div className="my-4 h-px bg-[#7347f4]/12" aria-hidden="true" />}

      {hasText && content && (
        <div className="text-sm leading-relaxed text-slate-800 [&_.lesson-rich-text_p:first-child]:mt-0 [&_.lesson-rich-text_p:last-child]:mb-0">
          <LexicalContent content={content} />
        </div>
      )}
    </article>
  );
}
