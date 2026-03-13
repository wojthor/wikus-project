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
    "Indywidualne spotkania 1:1 dopasowane do Twoich potrzeb",
    "Płatność z góry co miesiąc i stałe miejsce w grafiku",
    "Prezentacje i materiały wysyłane po każdych zajęciach",
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
      className="min-h-[70vh] flex flex-col justify-center space-y-6 sm:space-y-8 py-8 sm:py-12 scroll-mt-20"
    >
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        <span className="font-bold text-[#ffa515]">[Oferta]</span> – co dokładnie dostajesz
      </h2>

      {/* Duża karta dla korepetycji 1:1 */}
      <div className="mb-6 sm:mb-8">
        <article className="relative bg-white rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 border-[0.5px] hover:border-2 border-[#ffa515] shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex-1">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#ffa515]">
              {offerDetails.tutoring.label}
            </div>
            <h3 className="text-slate-900 font-bold text-2xl md:text-3xl">
              {offerDetails.tutoring.headline}
            </h3>
            <div className="my-4 space-y-1.5">
              <div className="text-[#7347f4] font-extrabold text-3xl md:text-4xl">
                {pricingAndGuarantee.tutoringHourlyRate}
              </div>
              <div className="text-sm md:text-base text-slate-600">
                lub <span className="font-semibold">70 zł / 45 min</span>
              </div>
            </div>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-3">
              {offerDetails.tutoring.description}
            </p>
          </div>

          <div className="flex-1 space-y-2">
            <ul className="space-y-1.5 text-sm text-slate-600">
              {PACKAGE_FEATURES.tutoring.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7347f4] mt-[3px]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href={offerDetails.tutoring.ctaUrl}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#ffbd53] px-5 py-2.5 text-sm sm:text-base font-bold text-white transition-colors hover:bg-[#f5ad3f]"
            >
              {offerDetails.tutoring.ctaLabel}
            </a>
          </div>
        </article>
      </div>

      {/* Karty kursów / zajęć w jednym rzędzie bez wrap (na desktopie) */}
      <div>
        <h3 className="mb-4 sm:mb-6 text-lg font-semibold text-slate-900">
          <span className="font-bold text-[#ffa515]">[Kursy i zajęcia grupowe]</span>
        </h3>
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-nowrap lg:gap-2 overflow-x-auto lg:overflow-visible pr-2">
          {offerDetails.courses.map((course) => {
            const features = PACKAGE_FEATURES[course.id] ?? [];
            return (
              <article
                key={course.id}
                className="bg-white rounded-[32px] p-6 flex flex-col border-[0.5px] hover:border-2 border-[#7347f4] shadow-sm hover:shadow-lg transition-all duration-500 min-w-[230px] lg:flex-1"
              >
                <h3 className="text-slate-900 font-bold text-xl">{course.title}</h3>

                <div className="text-[#7347f4] font-extrabold text-2xl sm:text-2xl   my-3">
                  {course.price}
                </div>

                <div className="flex-1 flex flex-col">
                  <p className="text-slate-600 text-sm leading-relaxed mb-3">
                    {course.shortDescription}
                  </p>

                  {features.length > 0 && (
                    <ul className="mt-1 space-y-1.5 text-sm text-slate-600">
                      {features.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#7347f4] mt-[3px]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto pt-3 flex justify-start">
                    <a
                      href={course.gumroadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center  bg-[#e8e8e8] text-black px-3 py-3 w-full font-sans border border-transparent hover:bg-[#ff90e8] hover:shadow-[3px_3px_0px_0px_#d4d4d4] transition-all duration-200 cursor-pointer"
                    >
                      <span className="text-[15px] leading-none font-medium whitespace-nowrap">
                        Kup przez
                      </span>
                      <span className="flex ">
                        <Image
                          src="/gumaroad.png"
                          alt="Gumroad"
                          width={80}
                          height={20}
                          className="h-6 w-auto object-contain"
                        />
                      </span>
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
          <h3 className="text-[#ffa515] font-bold text-xl sm:text-2xl">Zbudowanie wartości</h3>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            Tę wiedzę i strukturę zdobywa się latami – ja zebrałem to w kursy i lekcje, które możesz
            przerobić w swoim tempie. Bez dojazdów, bez sztywnego grafiku grupowego.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-[#ffa515] font-bold text-xl sm:text-2xl">Gwarancja</h3>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            Jestem pewny swojej metody – sprawdziłem ją na dziesiątkach uczniów. Jeśli w ciągu
            pierwszych zajęć uznasz, że to nie dla Ciebie, zwrócę Ci koszt lub zaproponuję inną
            formę.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-[#ffa515] font-bold text-xl sm:text-2xl">Deadline</h3>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            Miejsca na korepetycje i promocyjne ceny kursów są ograniczone. Warto zarezerwować
            termin lub kurs wcześniej.
          </p>
        </div>
      </div>
    </section>
  );
}
