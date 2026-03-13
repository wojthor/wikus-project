"use client";

type Course = {
  id: string;
  title: string;
  shortDescription: string;
  price: string;
  gumroadUrl: string;
  ctaLabel: string;
  format?: string;
  duration?: string;
  details?: string;
  whatYouGet?: readonly string[];
};

type CourseDetailsModalProps = {
  isOpen: boolean;
  course: Course | null;
  onClose: () => void;
};

export function CourseDetailsModal({ isOpen, course, onClose }: CourseDetailsModalProps) {
  if (!isOpen || !course) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border-2 border-[#7347f4] duration-500 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 id="course-modal-title" className="text-xl font-bold text-slate-900 sm:text-2xl">
                {course.title}
              </h2>
              <p className="mt-2 text-lg font-bold text-[#7347f4]">{course.price}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#b9c5fe] text-[#7347f4] transition hover:bg-[#cfd8ff] hover:border-[#7347f4]"
              aria-label="Zamknij"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>

          <p className="mb-6 text-slate-700 leading-relaxed">{course.shortDescription}</p>

          {"format" in course && course.format && (
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ffa515]">Format</span>
              <p className="mt-1 text-sm text-slate-700">{course.format}</p>
            </div>
          )}

          {"duration" in course && course.duration && (
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ffa515]">Czas dostępu</span>
              <p className="mt-1 text-sm text-slate-700">{course.duration}</p>
            </div>
          )}

          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ffa515]">Opis</span>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {"details" in course && course.details
                ? course.details
                : "Ten kurs zawiera wszystkie materiały, których potrzebujesz, aby zrobić kolejny krok w nauce angielskiego."}
            </p>
          </div>

          {"whatYouGet" in course && Array.isArray(course.whatYouGet) && course.whatYouGet.length > 0 && (
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ffa515]">Co dostajesz</span>
              <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-slate-600">
                {course.whatYouGet.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t-2 border-[#b9c5fe] bg-[#f8faff] p-6 sm:flex-row sm:justify-end sm:gap-4">
          <button
            type="button"
            onClick={onClose}
            className="order-2 w-full rounded-xl border-2 border-[#b9c5fe] bg-white px-5 py-3 text-sm font-bold text-[#7347f4] transition hover:bg-[#cfd8ff] sm:order-1 sm:w-auto"
          >
            Wróć
          </button>
          <a
            href={course.gumroadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-1 rounded-lg bg-[#ffbd53] border border-[#ffa515] py-2 text-[11px] sm:text-xs font-bold text-white transition hover:bg-[#f5ad3f] sm:py-2.5"
          >
            {course.ctaLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
