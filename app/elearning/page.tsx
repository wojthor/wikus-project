import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "E-learning – Wiktor Szyszkowski",
  description:
    "Kursy angielskiego online z feedbackiem. Unschool Your English – mówienie od pierwszego dnia, poziom B1–B2.",
};

export default function ElearningPage() {
  return (
    <main className="min-h-screen bg-[#f8faff] text-slate-900">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center sm:py-24">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#7347f4]">
          E-learning
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#7347f4] sm:text-4xl">
          Unschool Your English
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          Kurs online z mówieniem od pierwszego dnia i personalnym feedbackiem na każde zadanie.
        </p>
        <Link
          href="/unschool"
          className="mt-8 inline-flex items-center justify-center rounded-xl border border-[#ffa515] bg-[#ffbd53] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-95"
        >
          Zobacz program kursu
        </Link>
        <Link
          href="/"
          className="mt-4 text-sm font-semibold text-[#7347f4] hover:underline"
        >
          Strona główna
        </Link>
      </div>
    </main>
  );
}
