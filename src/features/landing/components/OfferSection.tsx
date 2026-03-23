"use client";

import type { offerDetails, pricingAndGuarantee } from "@/data/content";
import { Check } from "lucide-react";

type OfferDetailsType = typeof offerDetails;
type PricingType = typeof pricingAndGuarantee;
type Course = OfferDetailsType["courses"][number];

type OfferSectionProps = {
  offerDetails: OfferDetailsType;
  pricingAndGuarantee: PricingType;
};

function splitLines(text: string) {
  const lines = text.split("\n").filter(Boolean);
  return { title: lines[0] ?? "", items: lines.slice(1) };
}

function CourseDetailLists({ course }: { course: Course }) {
  const { title: formatTitle, items: formatItems } = splitLines(course.format);
  const durationRaw = "duration" in course ? course.duration : "";
  const { title: durationTitle, items: durationItems } = splitLines(durationRaw);

  return (
    <div className="mt-1 space-y-2 text-sm text-slate-600">
      <p className="font-semibold text-slate-700">{formatTitle}</p>
      {formatItems.length > 0 && (
        <ul className="list-disc list-inside space-y-1">
          {formatItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {durationTitle ? <p className="font-semibold text-slate-700">{durationTitle}</p> : null}
      {durationItems.length > 0 && (
        <ul className="list-disc list-inside space-y-1">
          {durationItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function OfferSection({ offerDetails, pricingAndGuarantee }: OfferSectionProps) {
  const { tutoring } = offerDetails;

  return (
    <section
      id="oferta"
      className="min-h-[70vh] flex flex-col justify-center space-y-6 sm:space-y-8 py-8 sm:py-12"
    >
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        <span className="font-bold text-[#ffa515]">{offerDetails.sectionTitleAccent}</span>
        {offerDetails.sectionTitleRest}
      </h2>

      <div className="mb-6 sm:mb-8">
        <article className="relative bg-white rounded-2xl sm:rounded-[28px] p-4 sm:p-6 md:p-8 border-[0.5px] hover:border-2 border-[#ffa515] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-5 sm:gap-6">
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-900 font-bold text-xl sm:text-2xl md:text-3xl mb-2">
                {tutoring.headline}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">{tutoring.description}</p>
              <p className="text-sm font-semibold text-slate-800 mb-2">
                {offerDetails.tutoringBenefitsHeading}
              </p>
              <ul className="space-y-1.5 text-sm text-slate-600">
                {tutoring.benefits.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#7347f4] mt-[2px] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-5 lg:gap-6 lg:flex-1 lg:min-w-0 lg:max-w-[520px] [&>div]:min-w-0 [&>div]:w-full">
              <p className="col-span-2 text-center text-sm sm:text-base font-extrabold text-[#7347f4]">
                {tutoring.ctaLabel}
              </p>
              <div className="flex flex-col rounded-2xl border-2 border-[#ffa515]/40 bg-[#f8faff]/60 p-4 sm:p-5 aspect-auto sm:aspect-square w-full min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wide text-[#ffa515] mb-1">
                  {tutoring.durationLabel45}
                </div>
                <div className="text-[#7347f4] font-extrabold text-2xl sm:text-3xl mb-2">
                  {pricingAndGuarantee.oneOnOne45Price}
                </div>
                <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 flex-1 min-h-0">
                  {pricingAndGuarantee.digitalProductLabel}
                </p>
                <a
                  href={tutoring.gumroadUrl45}
                  className="mt-auto inline-flex w-full items-center justify-center rounded-xl bg-[#ffa515] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffa515]"
                >
                  {tutoring.bookLessonCta}
                </a>
              </div>
              <div className="flex flex-col rounded-2xl border-2 border-[#7347f4]/40 bg-[#f8faff]/60 p-4 sm:p-5 aspect-auto sm:aspect-square w-full min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wide text-[#7347f4] mb-1">
                  {tutoring.durationLabel60}
                </div>
                <div className="text-[#7347f4] font-extrabold text-2xl sm:text-3xl mb-2">
                  {pricingAndGuarantee.tutoringHourlyRate}
                </div>
                <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 flex-1 min-h-0">
                  {pricingAndGuarantee.tutoringLabel}
                </p>
                <a
                  href={tutoring.gumroadUrl60}
                  className="mt-auto inline-flex w-full items-center justify-center rounded-xl bg-[#7347f4] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7347f4]"
                >
                  {tutoring.bookLessonCta}
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div>
        <h3 className="mb-4 sm:mb-6 text-lg font-semibold text-slate-900">
          <span className="font-bold text-[#ffa515]">{offerDetails.coursesSubheading}</span>
        </h3>
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-nowrap lg:gap-2 overflow-visible lg:overflow-x-auto lg:overflow-visible lg:pr-2">
          {offerDetails.courses.map((course) => (
            <article
              key={course.id}
              className="bg-white rounded-[32px] p-6 flex flex-col border-[0.5px] border-[#7347f4] shadow-sm hover:shadow-lg transition-all duration-500 w-full min-w-0 lg:min-w-[230px] lg:flex-1"
            >
              <h3 className="text-slate-900 font-bold text-xl">{course.title}</h3>
              <div className="text-[#7347f4] font-extrabold text-2xl sm:text-2xl my-3">
                {course.price}
              </div>
              <div className="flex-1 flex flex-col">
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  {course.shortDescription}
                </p>
                <CourseDetailLists course={course} />
                <div className="mt-auto pt-3 flex justify-start">
                  <a
                    href={course.gumroadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap bg-[#e8e8e8] text-black px-3 py-3 font-sans border border-transparent hover:bg-[#ff90e8] hover:shadow-[3px_3px_0px_0px_#d4d4d4] transition-all duration-200 cursor-pointer sm:gap-2 gumroad-button text-[15px] leading-none font-medium"
                  >
                    <span>{offerDetails.gumroadPurchaseLabel}</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
