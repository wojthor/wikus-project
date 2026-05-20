import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "E-learning – Wiktor Szyszkowski",
  description:
    "Unschool Your English – kurs online już wkrótce. Mówienie od pierwszego dnia, feedback na każde zadanie, poziom B1–B2.",
};

export default function ElearningPage() {
  return (
    <main className="min-h-screen bg-[#f8faff] text-slate-900">
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#7347f4]">
          E-learning
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#7347f4] sm:text-4xl">
          Unschool Your English
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          Kurs online z mówieniem od pierwszego dnia i personalnym feedbackiem na każde zadanie.
        </p>

        <div
          role="status"
          aria-live="polite"
          className="mt-8 w-full rounded-xl border border-[#ffa515]/50 bg-[#ffbd53] px-4 py-3.5 sm:px-5"
        >
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center justify-center gap-1.5 text-[#4a2d9e]">
              <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
                Już wkrótce
              </span>
            </span>
            <p className="w-full text-center text-lg font-bold leading-snug tracking-tight text-white sm:text-[1.35rem]">
              Szukajcie, a znajdziecie
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-6 text-sm font-semibold text-[#7347f4] hover:underline"
        >
          Strona główna
        </Link>
      </div>
    </main>
  );
}
