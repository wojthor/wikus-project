"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import type { offerDetails } from "@/data/content";

type OfferDetailsType = typeof offerDetails;
type Course = OfferDetailsType["courses"][number];

type CoursesCarouselProps = {
  courses: readonly Course[];
  offerDetails: OfferDetailsType;
};

function splitLines(text: string) {
  const lines = text.split("\n").filter(Boolean);
  return { title: lines[0] ?? "", items: lines.slice(1) };
}

function courseArticleClass(isUnschool: boolean) {
  return isUnschool
    ? "w-full overflow-hidden rounded-2xl border-2 border-[#7347f4] bg-gradient-to-r from-[#e8eeff]/90 via-white to-[#f8faff] p-4 shadow-[0_16px_48px_rgba(115,71,244,0.12)] sm:rounded-[28px] sm:p-6 md:p-8"
    : "w-full overflow-hidden rounded-2xl border-2 border-[#b9c5fe]/70 bg-gradient-to-r from-[#eef2ff]/80 via-white to-[#faf8ff] p-4 shadow-[0_8px_32px_rgba(115,71,244,0.06)] transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(115,71,244,0.1)] sm:rounded-[28px] sm:p-6 md:p-8";
}

function isUnschoolCourse(course: Course) {
  return course.id === "pakiet-unschool";
}

function courseTypeLabel(course: Course) {
  if (course.cta.type === "gumroad") return "Materiały online";
  if (course.cta.type === "email") return "Zajęcia grupowe";
  if (course.cta.type === "comingSoon") return "Już wkrótce";
  return "Kurs online";
}

function ComingSoonTeaser({ badge, quote }: { badge: string; quote: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full rounded-xl border border-[#ffa515]/50 bg-[#ffbd53] px-4 py-3.5 select-none sm:px-5"
    >
      <div className="flex flex-col gap-1.5">
        <span className="flex items-center justify-center gap-1.5 text-[#4a2d9e]">
          <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
          <span className="text-[10px] font-bold uppercase tracking-[0.14em]">{badge}</span>
        </span>

        <p className="w-full text-center text-lg font-bold leading-snug tracking-tight text-white sm:text-[1.35rem]">
          {quote}
        </p>
      </div>
    </div>
  );
}



function CourseCtaBlock({
  course,
  offerDetails,
}: {
  course: Course;
  offerDetails: OfferDetailsType;
}) {
  const cta = course.cta;

  if (cta.type === "email") {
    return (
      <a
        href={cta.href}
        className="inline-flex w-full items-center justify-center rounded-xl bg-[#7347f4] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
      >
        {cta.label}
      </a>
    );
  }

  if (cta.type === "comingSoon") {
    return (
      <ComingSoonTeaser badge={offerDetails.courseComingSoonBadge} quote={cta.label} />
    );
  }


  return (
    <a
      href={cta.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center rounded-xl bg-[#e8e8e8] px-4 py-3 text-sm font-medium text-black transition hover:bg-[#ff90e8] gumroad-button"
    >
      {offerDetails.gumroadPurchaseLabel}
    </a>
  );
}

function CourseOfferTile({
  course,
  offerDetails,
}: {
  course: Course;
  offerDetails: OfferDetailsType;
}) {
  const isUnschool = isUnschoolCourse(course);
  const priceCompare = "priceCompare" in course ? course.priceCompare : undefined;
  const priceNote = "priceNote" in course ? course.priceNote : undefined;
  const tagline = "tagline" in course ? course.tagline : undefined;

  const { title: formatTitle, items: formatItems } = splitLines(course.format);
  const durationRaw = "duration" in course ? course.duration : "";
  const { title: durationTitle, items: durationItems } = splitLines(durationRaw);

  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-stretch md:gap-8">
      <div
        className={`flex shrink-0 flex-col md:w-[34%] md:min-w-[220px] md:max-w-[320px] md:pr-7 ${
          isUnschool ? "md:border-r md:border-[#b9c5fe]/60" : "md:border-r md:border-[#7347f4]/15"
        }`}
      >
        {isUnschool ? (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#3e57d6]">
            Kurs online
          </p>
        ) : (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#7347f4]/80">
            {courseTypeLabel(course)}
          </p>
        )}

        <h3
          className={
            isUnschool
              ? "text-xl font-extrabold leading-tight text-[#7347f4] sm:text-2xl"
              : "text-xl font-bold leading-tight text-[#7347f4] sm:text-2xl"
          }
        >
          {course.title}
        </h3>

        {tagline && isUnschool && (
          <p className="mt-1 text-sm font-semibold text-[#3e57d6]">{tagline}</p>
        )}

        <div className="my-3">
          {isUnschool ? (
            <div className="flex flex-wrap items-baseline gap-2">
              {priceCompare && (
                <span className="text-sm font-semibold text-slate-400 line-through">
                  {priceCompare}
                </span>
              )}
              <span className="text-2xl font-extrabold text-[#7347f4] sm:text-3xl">
                {course.price}
              </span>
              {priceNote && (
                <span className="w-full text-xs font-medium text-slate-500">{priceNote}</span>
              )}
            </div>
          ) : (
            <p className="text-2xl font-extrabold text-[#7347f4] sm:text-3xl">{course.price}</p>
          )}
        </div>

        {isUnschool && (
          <ul className="mb-3 flex flex-wrap gap-1.5">
            {["7 modułów", "34 lekcje", "Feedback 1:1"].map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-[#b9c5fe] bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-[#3e57d6]"
              >
                {chip}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-3 md:pt-4">
          <CourseCtaBlock course={course} offerDetails={offerDetails} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <p className="mb-4 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          {course.shortDescription}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
              {formatTitle.replace(/^✔️\s*/, "")}
            </p>
            <ul className="space-y-1.5 text-sm text-slate-600">
              {formatItems.map((item) => (
                <li key={item} className="flex items-start gap-2 leading-snug">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7347f4]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {durationItems.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                {durationTitle.replace(/^👉\s*/, "")}
              </p>
              <ul className="space-y-1.5 text-sm text-slate-600">
                {durationItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 leading-snug">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffa515]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 24 : -24,
  }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -24 : 24,
  }),
};

function NavButton({
  direction,
  onClick,
  label,
  className = "",
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
  className?: string;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#b9c5fe] bg-white text-[#7347f4] shadow-sm transition hover:border-[#7347f4]/40 hover:bg-[#f8faff] sm:h-11 sm:w-11 ${className}`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

export function CoursesCarousel({ courses, offerDetails }: CoursesCarouselProps) {
  const prefersReducedMotion = useReducedMotion();

  const orderedCourses = useMemo(() => {
    const unschool = courses.filter((c) => isUnschoolCourse(c));
    const rest = courses.filter((c) => !isUnschoolCourse(c));
    return [...unschool, ...rest];
  }, [courses]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = orderedCourses.length;
  const activeCourse = orderedCourses[activeIndex];

  const wrap = useCallback((index: number) => ((index % count) + count) % count, [count]);

  const goTo = useCallback(
    (index: number, dir: number) => {
      setDirection(dir);
      setActiveIndex(wrap(index));
    },
    [wrap]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1, 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1, -1), [activeIndex, goTo]);

  useEffect(() => {
    if (prefersReducedMotion || paused) return;
    const mq = window.matchMedia("(min-width: 640px)");
    if (!mq.matches) return;

    const timer = setInterval(goNext, 7000);
    return () => clearInterval(timer);
  }, [activeIndex, goNext, paused, prefersReducedMotion]);

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 320, damping: 34 };

  const isUnschoolActive = isUnschoolCourse(activeCourse);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      {/* Desktop: ta sama szerokość co korepetycje, strzałki na zewnątrz */}
      <div className="relative hidden w-full sm:block">
        <NavButton
          direction="prev"
          onClick={goPrev}
          label="Poprzednia oferta"
          className="absolute left-0 top-1/2 z-10 -translate-x-[calc(100%+0.75rem)] -translate-y-1/2"
        />

        <article className={courseArticleClass(isUnschoolActive)}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeCourse.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
            >
              <CourseOfferTile course={activeCourse} offerDetails={offerDetails} />
            </motion.div>
          </AnimatePresence>
        </article>

        <NavButton
          direction="next"
          onClick={goNext}
          label="Następna oferta"
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-[calc(100%+0.75rem)]"
        />
      </div>

      {/* Mobile: lista wszystkich kursów */}
      <ul className="flex flex-col gap-4 sm:hidden">
        {orderedCourses.map((course) => {
          const isUnschool = isUnschoolCourse(course);
          return (
            <li key={course.id}>
              <article className={courseArticleClass(isUnschool)}>
                <CourseOfferTile course={course} offerDetails={offerDetails} />
              </article>
            </li>
          );
        })}
      </ul>

      {/* Wskaźniki (karuzela — tylko desktop) */}
      <div className="mt-5 hidden flex-wrap items-center justify-center gap-2 sm:flex">
        {orderedCourses.map((course, index) => {
          const isActive = index === activeIndex;
          const isUnschool = isUnschoolCourse(course);
          return (
            <button
              key={course.id}
              type="button"
              onClick={() => goTo(index, index > activeIndex ? 1 : index < activeIndex ? -1 : 0)}
              aria-label={`Pokaż: ${course.title}`}
              aria-current={isActive ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                isActive
                  ? isUnschool
                    ? "w-8 bg-[#ffbd53]"
                    : "w-8 bg-[#7347f4]"
                  : "w-2 bg-[#cfd8ff] hover:bg-[#b9c5fe]"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
