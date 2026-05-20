import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { StoryAndAuthorityData } from "@/data/content";

export function AboutSection({ data }: { data: StoryAndAuthorityData }) {
  return (
    <section id="o-mnie" className="flex flex-col py-6 sm:py-8">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-[#7347f4] font-extrabold text-2xl sm:text-3xl">
          {data.sectionTitle}
        </h2>
      </div>

      <div className="bg-[#f8faff] rounded-2xl sm:rounded-3xl shadow-[0_30px_50px_rgba(0,0,0,0.05)] border border-white px-4 pt-6 pb-6 sm:px-8 sm:pt-8 sm:pb-3 md:px-10 md:pt-8 md:pb-3">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] items-stretch">
          <div className="flex flex-col gap-4 order-1 lg:order-0 lg:col-start-1 lg:row-start-1">
            <div className="text-left">
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                {data.authorName}
              </h3>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl whitespace-pre-line">
                {data.authorBio}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-6 lg:h-full order-2 lg:order-0 lg:col-start-2 lg:row-span-2">
            <div className="relative w-full aspect-3/4 lg:h-full lg:aspect-auto rounded-3xl overflow-hidden shadow-md border border-white">
              <Image
                src={data.authorImagePlaceholder}
                alt={data.authorName}
                fill
                className="object-cover object-top w-full h-full"
                sizes="(max-width: 1024px) 100vw, 320px"
              />
            </div>

            <ul className="w-full max-w-sm space-y-3">
              {data.credentials.map((cert, i) => (
                <li
                  key={i}
                  className="bg-white border border-[#b9c5fe] rounded-full px-4 py-2 text-sm font-medium text-slate-700 flex items-center gap-2 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[#7347f4] shrink-0" />
                  <span>
                    {cert.label}
                    {cert.detail ? ` – ${cert.detail}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative order-3 lg:order-0 lg:col-start-1 lg:row-start-2 lg:mt-4">
            <div className="flex flex-col gap-4 max-h-[45vh] sm:max-h-[320px] overflow-y-auto pr-1 sm:pr-2 scroll-smooth">
              <div className="relative rounded-2xl border border-[#ffa515]/60 bg-white/90 px-5 py-4 shadow-sm">
                <span className="absolute left-4 top-4 h-6 w-[3px] rounded-full bg-[#ffa515]" />
                <p className="pl-4 text-xs font-semibold uppercase tracking-wide text-[#ffa515] mb-1.5">
                  {data.historyCapsuleLabel}
                </p>
                <p className="pl-4 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                  {data.authorityHeadline}
                </p>
              </div>

              <div className="relative rounded-2xl border border-[#ffa515]/60 bg-white/90 px-5 py-4 shadow-sm">
                <span className="absolute left-4 top-4 h-6 w-[3px] rounded-full bg-[#ffa515]" />
                <p className="pl-4 text-xs font-semibold uppercase tracking-wide text-[#ffa515] mb-1.5">
                  {data.breakthroughCapsuleLabel}
                </p>
                <p className="pl-4 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                  {data.originStory}
                </p>
              </div>

              <div className="relative rounded-2xl border border-[#ffa515]/60 bg-white/90 px-5 py-4 shadow-sm">
                <span className="absolute left-4 top-4 h-6 w-[3px] rounded-full bg-[#ffa515]" />
                <p className="pl-4 text-xs font-semibold uppercase tracking-wide text-[#ffa515] mb-1.5">
                  {data.turningPointHeadline}
                </p>
                <p className="pl-4 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                  {data.turningPointText}
                </p>
              </div>
              <div className="relative rounded-2xl border border-[#ffa515]/60 bg-white/90 px-5 py-4 shadow-sm">
                <span className="absolute left-4 top-4 h-6 w-[3px] rounded-full bg-[#ffa515]" />
                <p className="pl-4 text-xs font-semibold uppercase tracking-wide text-[#ffa515] mb-1.5">
                  {data.newPathHeadline}
                </p>
                <p className="pl-4 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                  {data.newPathText}
                </p>
              </div>
            </div>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-600">
              <ChevronDown className="w-3.5 h-3.5 text-slate-600" strokeWidth={2.5} />
              <span>
                {data.scrollMoreHint}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
