"use client";

import Image from "next/image";
import type { offerDetails, pricingAndGuarantee } from "@/data/content";
import { Check } from "lucide-react";

type OfferDetailsType = typeof offerDetails;
type PricingType = typeof pricingAndGuarantee;

type OfferSectionProps = {
  offerDetails: OfferDetailsType;
  pricingAndGuarantee: PricingType;
};

const PACKAGE_FEATURES: {
  tutoring: string[];
  [id: string]: string[];
} = {
  tutoring: [
    "zajęcia dopasowane do Twojego poziomu i celu",
    "realne mówienie + poprawki na bieżąco",
    "konkretne materiały po każdej lekcji",
    "stałe miejsce w grafiku (zero szukania terminów)",
  ],
  "pakiet-1": [
    "10 praktycznych lekcji stacjonarnych",
    "Nacisk na mówienie i realne sytuacje",
    "Kamery, książki i ćwiczenia w jednym programie",
  ],
  "pakiet-2": [
    "Plan nauki dopasowany do poziomu i celu",
    "Miesięczna struktura z jasno wyznaczonymi krokami",
    "Proste zadania do zrobienia między spotkaniami",
  ],
  "pakiet-3": [
    "Zajęcia w 2-osobowej grupie (45 min)",
    "Ja moderuję dyskusję i poprawiam błędy na bieżąco",
    "Więcej czasu na mówienie niż na notatki",
  ],
  "pakiet-4": [
    "Zajęcia w 3-osobowej grupie (45 min)",
    "Dbam o to, żeby każdy mówił w równym stopniu",
    "Idealne dla osób, które lubią uczyć się w grupie",
  ],
};

export function OfferSection({ offerDetails, pricingAndGuarantee }: OfferSectionProps) {
  return (
    <section
      id="oferta"
      className="min-h-[70vh] flex flex-col justify-center space-y-6 sm:space-y-8 py-8 sm:py-12 scroll-mt-24"
    >
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        <span className="font-bold text-[#ffa515]">Oferta</span> – co dokładnie dostajesz?
      </h2>

      {/* Karta korepetycji 1:1 – dwa warianty: 45 min i 60 min */}
      <div className="mb-6 sm:mb-8">
        <article className="relative bg-white rounded-2xl sm:rounded-[28px] p-4 sm:p-6 md:p-8 border-[0.5px] hover:border-2 border-[#ffa515] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-5 sm:gap-6">
            {/* Lewa kolumna: opis i korzyści */}
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-900 font-bold text-xl sm:text-2xl md:text-3xl mb-2">
                {offerDetails.tutoring.headline}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {offerDetails.tutoring.description}
              </p>
              <p className="text-sm font-semibold text-slate-800 mb-2">✔️ Co dostajesz:</p>
              <ul className="space-y-1.5 text-sm text-slate-600">
                {PACKAGE_FEATURES.tutoring.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#7347f4] mt-[2px] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prawa kolumna: dwa warianty cenowe – ten sam rozmiar (kwadraty) */}
            <div className="grid grid-cols-2 gap-5 lg:gap-6 lg:flex-1 lg:min-w-0 lg:max-w-[520px] [&>div]:min-w-0 [&>div]:w-full">
              <p className="col-span-2 text-center text-sm sm:text-base font-extrabold text-[#7347f4]">
                {offerDetails.tutoring.ctaLabel}
              </p>
              <div className="flex flex-col rounded-2xl border-2 border-[#ffa515]/40 bg-[#f8faff]/60 p-4 sm:p-5 aspect-auto sm:aspect-square w-full min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wide text-[#ffa515] mb-1">
                  45 min
                </div>
                <div className="text-[#7347f4] font-extrabold text-2xl sm:text-3xl mb-2">70 zł</div>
                <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 flex-1 min-h-0">
                  Szybka, konkretna sesja (idealna przy napiętym grafiku)
                </p>
                <a
                  href={offerDetails.tutoring.gumroadUrl45}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:hidden inline-flex flex-col items-center justify-center gap-0.5 bg-[#e8e8e8] text-black px-3 py-2.5 w-full font-sans font-medium text-xs border border-transparent hover:bg-[#ff90e8] hover:shadow-[3px_3px_0px_0px_#d4d4d4] transition-all duration-200 cursor-pointer"
                >
                  <span>Kup przez</span>
                  <Image
                    src="/gumaroad.png"
                    alt="Gumroad"
                    width={70}
                    height={18}
                    className="h-4 w-auto object-contain"
                  />
                </a>
                <a
                  href={offerDetails.tutoring.gumroadUrl45}
                  className="hidden sm:inline-flex gumroad-button items-center! justify-center! gap-2! whitespace-nowrap! bg-[#e8e8e8]! text-black! px-4! py-3! w-full! font-sans! font-medium! text-sm! border! border-transparent! hover:bg-[#ff90e8]! hover:shadow-[3px_3px_0px_0px_#d4d4d4]! transition-all! duration-200! cursor-pointer!"
                >
                  <span>Kup przez</span>
                </a>
              </div>
              <div className="flex flex-col rounded-2xl border-2 border-[#7347f4]/40 bg-[#f8faff]/60 p-4 sm:p-5 aspect-auto sm:aspect-square w-full min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wide text-[#7347f4] mb-1">
                  60 min
                </div>
                <div className="text-[#7347f4] font-extrabold text-2xl sm:text-3xl mb-2">
                  {pricingAndGuarantee.tutoringHourlyRate}
                </div>
                <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 flex-1 min-h-0">
                  Pełna lekcja: konwersacja + wyjaśnienia + feedback
                </p>
                <a
                  href={offerDetails.tutoring.gumroadUrl60}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:hidden inline-flex flex-col items-center justify-center gap-0.5 bg-[#e8e8e8] text-black px-3 py-2.5 w-full font-sans font-medium text-xs border border-transparent hover:bg-[#ff90e8] hover:shadow-[3px_3px_0px_0px_#d4d4d4] transition-all duration-200 cursor-pointer"
                >
                  <span>Kup przez</span>
                  <Image
                    src="/gumaroad.png"
                    alt="Gumroad"
                    width={70}
                    height={18}
                    className="h-4 w-auto object-contain"
                  />
                </a>
                <a
                  href={offerDetails.tutoring.gumroadUrl60}
                  className="hidden sm:inline-flex gumroad-button items-center! justify-center! gap-2! whitespace-nowrap! bg-[#e8e8e8]! text-black! px-4! py-3! w-full! font-sans! font-medium! text-sm! border! border-transparent! hover:bg-[#ff90e8]! hover:shadow-[3px_3px_0px_0px_#d4d4d4]! transition-all! duration-200! cursor-pointer!"
                >
                  <span>Kup przez</span>
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* Karty kursów / zajęć w jednym rzędzie bez wrap (na desktopie) */}
      <div>
        <h3 className="mb-4 sm:mb-6 text-lg font-semibold text-slate-900">
          <span className="font-bold text-[#ffa515]">Kursy i zajęcia grupowe</span>
        </h3>
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-nowrap lg:gap-2 overflow-visible lg:overflow-x-auto lg:overflow-visible lg:pr-2">
          {offerDetails.courses.map((course) => {
            const features = PACKAGE_FEATURES[course.id] ?? [];
            const isDetailedCourse =
              course.id === "pakiet-1" ||
              course.id === "pakiet-2" ||
              course.id === "pakiet-3" ||
              course.id === "pakiet-4";
            return (
              <article
                key={course.id}
                className="bg-white rounded-[32px] p-6 flex flex-col border-[0.5px] border-[#7347f4] shadow-sm hover:shadow-lg transition-all duration-500 w-full min-w-0 lg:min-w-[230px] lg:flex-1"
              >
                <h3 className="text-slate-900 font-bold text-xl">{course.title}</h3>

                <div className="text-[#7347f4] font-extrabold text-2xl sm:text-2xl   my-3">
                  {course.price}
                </div>

                <div className="flex-1 flex flex-col">
                  <p className="text-slate-600 text-sm leading-relaxed mb-3">
                    {course.shortDescription}
                  </p>

                  {isDetailedCourse ? (
                    <div className="mt-1 space-y-2 text-sm text-slate-600">
                      {(() => {
                        const formatLines: string[] = course.format.split("\n").filter(Boolean);
                        const durationRaw = "duration" in course ? course.duration : "";
                        const durationLines: string[] = durationRaw.split("\n").filter(Boolean);
                        const formatTitle = formatLines[0] ?? "";
                        const formatItems = formatLines.slice(1);
                        const durationTitle = durationLines[0] ?? "";
                        const durationItems = durationLines.slice(1);

                        return (
                          <>
                            <p className="font-semibold text-slate-700">{formatTitle}</p>
                            {formatItems.length > 0 && (
                              <ul className="list-disc list-inside space-y-1">
                                {formatItems.map((item: string, i: number) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            )}
                            {durationTitle && (
                              <p className="font-semibold text-slate-700">{durationTitle}</p>
                            )}
                            {durationItems.length > 0 && (
                              <ul className="list-disc list-inside space-y-1">
                                {durationItems.map((item: string, i: number) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    features.length > 0 && (
                      <ul className="mt-1 space-y-1.5 text-sm text-slate-600">
                        {features.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[#7347f4] mt-[3px]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  )}

                  <div className="mt-auto pt-3 flex justify-start">
                    <a
                      href={course.gumroadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sm:hidden inline-flex items-center justify-center gap-1 whitespace-nowrap bg-[#e8e8e8] text-black px-3 py-3 w-full font-sans border border-transparent hover:bg-[#ff90e8] hover:shadow-[3px_3px_0px_0px_#d4d4d4] transition-all duration-200 cursor-pointer"
                    >
                      <span className="text-[15px] leading-none font-medium">Kup przez</span>
                      <Image
                        src="/gumaroad.png"
                        alt="Gumroad"
                        width={76}
                        height={18}
                        className="h-4 w-auto object-contain"
                      />
                    </a>
                    <a
                      href={course.gumroadUrl}
                      className="hidden sm:inline-flex gumroad-button items-center! justify-center! gap-2! whitespace-nowrap! bg-[#e8e8e8]! text-black! px-3! py-3! w-full! font-sans! border! border-transparent! hover:bg-[#ff90e8]! hover:shadow-[3px_3px_0px_0px_#d4d4d4]! transition-all! duration-200! cursor-pointer!"
                    >
                      <span className="text-[15px]! leading-none! font-medium!">Kup przez</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-10 sm:pt-12 border-t border-[#b9c5fe]/40 mt-10 sm:mt-12">
        <div className="space-y-3">
          <h3 className="text-[#ffa515] font-bold text-xl sm:text-2xl">Co dostajesz?</h3>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            Tego nie uczysz się z jednej książki czy kursu. Przez lata obserwowałem nauczycieli i
            korepetytorów. Brałem to, co <span className=" text-slate-700">działa</span>, i
            odrzucałem to, co tylko zabiera czas.
          </p>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            Dlatego na zajęciach:
          </p>
          <ul className="list-disc list-inside text-slate-700 text-base sm:text-lg leading-relaxed space-y-1">
            <li>skupiamy się na mówieniu i realnym użyciu języka</li>
            <li>nie robimy rzeczy „bo tak się zawsze robiło”</li>
            <li>masz jasny system, bez chaosu i zgadywania</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="text-[#ffa515] font-bold text-xl sm:text-2xl">Pierwsza lekcja</h3>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            Nie zapisujesz się w ciemno. Pierwsza lekcja jest{" "}
            <span className="font-extrabold text-[#7347f4]">darmowa</span>, żebyś mógł sprawdzić,
            czy ten styl nauki Ci odpowiada.
          </p>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">Podczas niej:</p>
          <ul className="list-disc list-inside text-slate-700 text-base sm:text-lg leading-relaxed space-y-1">
            <li>poznajemy Twój poziom i cel</li>
            <li>robimy pierwszą rozmowę</li>
            <li>pokazuję Ci, jak pracujemy</li>
          </ul>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            I dopiero wtedy decydujesz, czy chcesz iść dalej.
          </p>
          <p className="text-[#7347f4] text-sm sm:text-base leading-relaxed font-semibold">
            BTW: Do tej pory <span className="font-extrabold">100% osób</span> zostało po pierwszej
            lekcji.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-[#ffa515] font-bold text-xl sm:text-2xl">Miejsca są ograniczone!</h3>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            Pracuję na ograniczonej liczbie miejsc. Zależy mi na jakości, nie ilości.
          </p>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            Dlatego nie przyjmuję <span className="font-semibold text-[#7347f4]">więcej osób</span>,
            niż jestem w stanie dobrze poprowadzić.
          </p>
          <ul className="list-disc list-inside text-slate-700 text-base sm:text-lg leading-relaxed space-y-1">
            <li>
              Jeśli mam <span className="font-semibold text-[#7347f4]">wolny termin</span>, warto go
              zarezerwować wcześniej
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
