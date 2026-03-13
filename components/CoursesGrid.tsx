"use client";

import { useState, useEffect } from "react";
import type { Content } from "@/data/content";

type Course = Content["offerDetails"]["courses"][number];

interface CoursesGridProps {
  courses: readonly Course[];
}

export function CoursesGrid({ courses }: CoursesGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeCourse = activeId
    ? courses.find((course) => course.id === activeId) ?? null
    : null;

  useEffect(() => {
    if (!activeId) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [activeId]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:gap-8">
        {courses.map((course) => (
          <article
            key={course.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative h-36 w-full shrink-0 bg-slate-100 sm:h-40">
              <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
                Okładka kursu
              </div>
            </div>
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <h4 className="mb-2 line-clamp-2 text-base font-semibold text-slate-900 sm:text-lg">
                {course.title}
              </h4>
              <p className="mb-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-2 sm:mb-4">
                {course.shortDescription}
              </p>
              <p className="mb-3 text-base font-bold text-slate-900 sm:mb-4 sm:text-lg">
                {course.price}
              </p>
              <a
                href={course.gumroadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-1.5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-blue-700 sm:mb-2 sm:py-3.5"
              >
                Kup przez Gumroad
              </a>
              <button
                type="button"
                onClick={() => setActiveId(course.id)}
                className="text-center text-sm font-medium text-sky-600 underline decoration-sky-600/60 underline-offset-2 hover:text-sky-700 hover:decoration-sky-700"
              >
                Szczegóły
              </button>
            </div>
          </article>
        ))}
      </div>

      {activeCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
          onClick={() => setActiveId(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-modal-title"
        >
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="course-modal-title"
                    className="text-xl font-semibold text-slate-900 sm:text-2xl"
                  >
                    {activeCourse.title}
                  </h2>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {activeCourse.price}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  className="shrink-0 rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                  aria-label="Zamknij"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>

              <p className="mb-6 text-slate-700 leading-relaxed">
                {activeCourse.shortDescription}
              </p>

              {"format" in activeCourse && activeCourse.format && (
                <div className="mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Format
                  </span>
                  <p className="mt-1 text-sm text-slate-700">
                    {activeCourse.format}
                  </p>
                </div>
              )}

              {"duration" in activeCourse && activeCourse.duration && (
                <div className="mb-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Czas dostępu
                  </span>
                  <p className="mt-1 text-sm text-slate-700">
                    {activeCourse.duration}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Opis
                </span>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {"details" in activeCourse && activeCourse.details
                    ? activeCourse.details
                    : "Ten kurs zawiera wszystkie materiały, których potrzebujesz, aby zrobić kolejny krok w nauce angielskiego."}
                </p>
              </div>

              {"whatYouGet" in activeCourse &&
                Array.isArray(activeCourse.whatYouGet) &&
                activeCourse.whatYouGet.length > 0 && (
                  <div className="mb-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Co dostajesz
                    </span>
                    <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-slate-600">
                      {activeCourse.whatYouGet.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>

            <div className="flex shrink-0 flex-col gap-3 border-t border-slate-100 bg-slate-50/80 p-6 sm:flex-row sm:justify-end sm:gap-4 sm:p-6">
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="order-2 w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:order-1 sm:w-auto"
              >
                Wróć
              </button>
              <a
                href={activeCourse.gumroadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="order-1 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:order-2 sm:w-auto"
              >
                Kup przez Gumroad
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
