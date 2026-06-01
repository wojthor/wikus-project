"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/(site)/elearning/elearning.module.css";
import { MODULE_ACCENTS, type ModuleAccentId } from "../theme";
import {
  beginRecording,
  finalizeRecording,
  openMicrophoneStream,
  parseMicrophoneError,
  stopRecordingTracks,
} from "../browser-audio-recording";

const btnBase =
  "inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:px-4 sm:text-sm";

export type AudioRecorderProps = {
  saved?: string | null;
  disabled?: boolean;
  onPreview?: (previewUrl: string) => void;
  onRecording?: (blob: Blob, previewUrl: string) => void;
};

export function AudioRecorder({
  saved,
  disabled = false,
  onPreview,
  onRecording,
}: AudioRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(saved || null);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<ReturnType<typeof beginRecording> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setAudioURL(saved ?? null);
  }, [saved]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (sessionRef.current) stopRecordingTracks(sessionRef.current);
    };
  }, []);

  const start = async () => {
    if (disabled) return;
    setError(null);

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
      const blob = finalizeRecording(session);
      stopRecordingTracks(session);
      sessionRef.current = null;

      if (blob.size < 1) {
        setError("Nagranie jest puste - spróbuj ponownie i mów bliżej mikrofonu.");
        return;
      }

      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      onPreview?.(url);
      onRecording?.(blob, url);
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

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-wrap items-center gap-2">
        {!recording ? (
          <button
            type="button"
            onClick={() => void start()}
            disabled={disabled}
            className={`${btnBase} border border-[#b9c5fe] bg-white text-slate-800 hover:bg-[#f8faff] disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <span className="text-base">🎙️</span>
            <span className="text-left">
              {audioURL ? "Nagraj ponownie" : "Rozpocznij nagrywanie"}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            className={`${btnBase} bg-red-50 text-red-700`}
          >
            <span className={`inline-block h-2.5 w-2.5 shrink-0 rounded-sm bg-red-600 ${styles.pulse}`} />
            <span>Zatrzymaj · {fmt(seconds)}</span>
          </button>
        )}
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs leading-relaxed text-red-800 sm:text-sm">
          {error}
        </p>
      )}

      {audioURL && (
        <div className="w-full rounded-xl border border-[#dfe6ff] bg-[#f8faff] p-3 sm:p-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Twoje nagranie
          </p>
          <audio controls src={audioURL} className="w-full accent-[#7347f4]" playsInline />
        </div>
      )}
    </div>
  );
}

function SingleRecorder({ onSave, label }: { onSave: (url: string) => void; label: string }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<ReturnType<typeof beginRecording> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = async () => {
    setError(null);
    try {
      const stream = await openMicrophoneStream();
      sessionRef.current = beginRecording(stream);
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
      const blob = finalizeRecording(session);
      stopRecordingTracks(session);
      sessionRef.current = null;
      if (blob.size > 0) {
        onSave(URL.createObjectURL(blob));
      }
      setSeconds(0);
    };

    if (session.recorder.state !== "inactive") {
      session.recorder.stop();
    }

    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (!recording) {
    return (
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => void start()}
          className={`${btnBase} border border-[#b9c5fe] bg-white text-slate-800`}
        >
          <span>🎙️</span>
          <span>{label}</span>
        </button>
        {error && (
          <p className="text-xs leading-relaxed text-red-700">{error}</p>
        )}
      </div>
    );
  }

  return (
    <button type="button" onClick={stop} className={`${btnBase} bg-red-50 text-red-700`}>
      <span className={`h-2 w-2 shrink-0 rounded-sm bg-red-600 ${styles.pulse}`} />
      <span>Zatrzymaj · {fmt(seconds)}</span>
    </button>
  );
}

export function MultidayChallenge({
  lessonKey,
  days,
  accent,
  recordings,
  setRecordings,
}: {
  lessonKey: string;
  days: { day: number; prompt: string }[];
  accent: ModuleAccentId;
  recordings: Record<string, string | string[]>;
  setRecordings: React.Dispatch<React.SetStateAction<Record<string, string | string[]>>>;
}) {
  const a = MODULE_ACCENTS[accent];
  const getDayRecs = (day: number): string[] => {
    const v = recordings[`${lessonKey}-day${day}`];
    return Array.isArray(v) ? v : v ? [v] : [];
  };
  const addRec = (day: number, url: string) => {
    setRecordings((p) => ({
      ...p,
      [`${lessonKey}-day${day}`]: [...(p[`${lessonKey}-day${day}`] || []), url],
    }));
  };

  return (
    <div className="flex flex-col gap-3.5">
      <p className="rounded-xl border border-[#dfe6ff] bg-[#f8faff] p-3 text-sm leading-relaxed text-slate-600 sm:p-4">
        Nagrywaj codziennie przez 7 dni - każdy dzień osobno. Możesz dodawać kolejne nagrania do
        każdego dnia.
      </p>
      {days.map((d) => {
        const recs = getDayRecs(d.day);
        const done = recs.length > 0;
        return (
          <div
            key={d.day}
            className={`rounded-xl border p-4 transition-colors ${
              done ? "border-green-200 bg-green-50" : "border-[#dfe6ff] bg-white"
            }`}
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className={`text-sm font-bold ${a.text}`}>Dzień {d.day}</span>
              {done && (
                <span className="text-[11px] font-bold text-green-700">
                  ✓ {recs.length} {recs.length === 1 ? "nagranie" : "nagrania"}
                </span>
              )}
            </div>
            <p className="mb-3 text-sm leading-relaxed whitespace-pre-line text-slate-600">
              {d.prompt}
            </p>
            {recs.length > 0 && (
              <div className="mb-3 flex flex-col gap-2">
                {recs.map((url, i) => (
                  <div key={i} className="rounded-lg bg-white p-2.5 sm:p-3">
                    <p className="mb-1 text-[10px] font-semibold text-slate-500">
                      Nagranie {i + 1}
                    </p>
                    <audio controls src={url} className="h-8 w-full accent-[#7347f4]" playsInline />
                  </div>
                ))}
              </div>
            )}
            <SingleRecorder
              onSave={(url) => addRec(d.day, url)}
              label={done ? "Dodaj kolejne nagranie" : `Nagraj dzień ${d.day}`}
            />
          </div>
        );
      })}
    </div>
  );
}
