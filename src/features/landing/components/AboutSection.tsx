import Image from "next/image";
import { storyAndAuthority } from "@/data/content";

type StoryAndAuthority = typeof storyAndAuthority;

export function AboutSection({ data }: { data: StoryAndAuthority }) {
  return (
    <section
      id="o-mnie"
      className="min-h-dvh scroll-mt-20 flex flex-col justify-center py-8 sm:py-12"
    >
      <div className="text-center mb-8 sm:mb-5">
        <h2 className="text-[#7347f4] font-extrabold text-2xl sm:text-3xl">
          O mnie
        </h2>
      </div>

      <div className="bg-[#f8faff] rounded-2xl sm:rounded-3xl shadow-[0_12px_28px_rgba(0,0,0,0.03)] border border-white px-4 py-6 sm:px-8 sm:py-10 md:px-10 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] items-stretch">
          {/* 1. Imię i bio – zawsze jako pierwsze */}
          <div className="flex flex-col gap-4 order-1 lg:order-0 lg:col-start-1 lg:row-start-1">
            <div className="text-left">
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                {data.authorName}
              </h3>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {data.authorBio}
              </p>
            </div>
          </div>

          {/* 2. Zdjęcie + 3. Certyfikaty – na mobile zaraz po bio, na desktopie prawa kolumna (span 2 wiersze) */}
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
                    {cert.detail ? ` — ${cert.detail}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Kapsuły historii – na mobile pod zdjęciem i certyfikatami, na desktopie pod bio (lewa kolumna, drugi wiersz) */}
          <div className="flex flex-col gap-4 max-h-[320px] overflow-y-auto pr-1 sm:pr-2 lg:mt-4 order-3 lg:order-0 lg:col-start-1 lg:row-start-2">
            <div className="relative rounded-2xl border border-[#ffa515]/60 bg-white/90 px-5 py-4 shadow-sm">
              <span className="absolute left-4 top-4 h-6 w-[3px] rounded-full bg-[#ffa515]" />
              <p className="pl-4 text-xs font-semibold uppercase tracking-wide text-[#ffa515] mb-1.5">
                Zbudowanie autorytetu
              </p>
              <p className="pl-4 text-sm sm:text-base text-slate-700 leading-relaxed">
                {data.authorityHeadline}
              </p>
            </div>

            <div className="relative rounded-2xl border border-[#ffa515]/60 bg-white/90 px-5 py-4 shadow-sm">
              <span className="absolute left-4 top-4 h-6 w-[3px] rounded-full bg-[#ffa515]" />
              <p className="pl-4 text-xs font-semibold uppercase tracking-wide text-[#ffa515] mb-1.5">
                Historia początków
              </p>
              <p className="pl-4 text-sm sm:text-base text-slate-700 leading-relaxed">
                {data.originStory}
              </p>
            </div>

            <div className="relative rounded-2xl border border-[#ffa515]/60 bg-white/90 px-5 py-4 shadow-sm">
              <span className="absolute left-4 top-4 h-6 w-[3px] rounded-full bg-[#ffa515]" />
              <p className="pl-4 text-xs font-semibold uppercase tracking-wide text-[#ffa515] mb-1.5">
                {data.turningPointHeadline}
              </p>
              <p className="pl-4 text-sm sm:text-base text-slate-700 leading-relaxed">
                {data.turningPointText}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

