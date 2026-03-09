"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Info, Mail, Phone, Facebook, Instagram, Menu, X } from "lucide-react";
import { offerDetails, pricingAndGuarantee, finalCta, storyAndAuthority } from "@/data/content";

// --- PARSER (Zachowany i dostosowany do kolorów z Figmy) ---
function AccentBrackets({ text, className = "" }: { text: string; className?: string }) {
  const parts: Array<{ type: "accent" | "normal"; text: string }> = [];
  let remaining = text;

  while (remaining.length > 0) {
    const open = remaining.indexOf("[");
    const close = remaining.indexOf("]");

    if (open === -1 || close === -1 || close < open) {
      if (remaining) parts.push({ type: "normal", text: remaining });
      break;
    }

    if (open > 0) {
      parts.push({ type: "normal", text: remaining.slice(0, open) });
    }

    parts.push({ type: "accent", text: remaining.slice(open + 1, close) });
    remaining = remaining.slice(close + 1);
  }

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.type === "accent" ? (
          <span key={i} className="font-bold text-[#ffa515]">
            [{part.text}]
          </span>
        ) : (
          part.text
        )
      )}
    </span>
  );
}

export default function Home() {
  const [courseModalId, setCourseModalId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeCourse = courseModalId
    ? offerDetails.courses.find((c) => c.id === courseModalId) ?? null
    : null;

  useEffect(() => {
    if (!courseModalId) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCourseModalId(null);
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [courseModalId]);

  return (
    <div id="top" className="min-h-screen bg-[#f8faff] text-black font-sans selection:bg-[#cfd8ff]">
      
      {/* ─── NAVBAR (wielkość jak app/page.tsx) ───────────────────────── */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg shadow-[0_1px_30px_rgba(0,0,0,0.15)]">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between">
          <Link href="#top" className="text-[#7347f4] font-extrabold text-base sm:text-lg tracking-wider hover:opacity-90 transition-opacity">
            SZYCHA
          </Link>
          <div className="hidden md:flex gap-1 sm:gap-2 text-[#7347f4] font-bold text-sm">
            <Link href="#fakty" className="rounded-full px-3 py-2 hover:bg-[#cfd8ff]/50 transition-colors">Fakty</Link>
            <Link href="#oferta" className="rounded-full px-3 py-2 hover:bg-[#cfd8ff]/50 transition-colors">Oferta</Link>
            <Link href="#o-mnie" className="rounded-full px-3 py-2 hover:bg-[#cfd8ff]/50 transition-colors">O mnie</Link>
            <Link href="#opinie" className="rounded-full px-3 py-2 hover:bg-[#cfd8ff]/50 transition-colors">Opinie</Link>
          </div>
          {/* Hamburger na mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-[#7347f4] hover:bg-[#cfd8ff]/50 transition-colors"
            aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {/* Rozwijane menu na mobile */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg border-t border-[#b9c5fe]/30">
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
              <Link href="#fakty" onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-[#7347f4] font-bold hover:bg-[#cfd8ff]/50 transition-colors">Fakty</Link>
              <Link href="#oferta" onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-[#7347f4] font-bold hover:bg-[#cfd8ff]/50 transition-colors">Oferta</Link>
              <Link href="#o-mnie" onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-[#7347f4] font-bold hover:bg-[#cfd8ff]/50 transition-colors">O mnie</Link>
              <Link href="#opinie" onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-[#7347f4] font-bold hover:bg-[#cfd8ff]/50 transition-colors">Opinie</Link>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 space-y-12 sm:space-y-16 overflow-hidden">
        
        {/* ─── HERO (min-h jak app/page.tsx; zdjęcie wypełnia tyle samo miejsca co treść obok) ─── */}
        <section className="min-h-[70vh] flex flex-col justify-center bg-[#f8faff] rounded-2xl sm:rounded-3xl shadow-[0_30px_50px_rgba(0,0,0,0.05)] border border-white p-6 sm:p-8 md:p-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:items-stretch">
            <div className="space-y-4 sm:space-y-6 flex flex-col justify-center">
              <div className="inline-flex items-center bg-[#cfd8ff] border border-[#b9c5fe] text-[#3e57d6] rounded-full px-4 py-1 text-xs sm:text-sm font-semibold tracking-wide">
                [Hook] 90% osób po kursach nadal boi się odezwać
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
                Chcesz swobodnie mówić po angielsku{" "}
                <span className="text-[#7347f4]">bez wkuwania regułek?</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Pokażę Ci, jak przełamać barierę językową i zacząć mówić pewnie w kilka miesięcy, korzystając z prostej, sprawdzonej metody.
              </p>
              <div className="flex flex-wrap gap-2 pt-1.5">
                <Link href="#oferta" className="rounded-lg bg-[#ffbd53] border border-[#ffa515] text-white px-4 py-2 text-xs sm:text-sm font-bold shadow-md hover:-translate-y-0.5 transition-transform">
                  Zobacz ofertę
                </Link>
                <Link href="#o-mnie" className="rounded-lg bg-white border border-[#ffa515] text-[#ffa515] px-4 py-2 text-xs sm:text-sm font-bold shadow-sm hover:-translate-y-0.5 transition-transform">
                  O mnie
                </Link>
              </div>
            </div>
            {/* Na lg zdjęcie wypełnia całą wysokość kolumny (ta sama co treść); na mniejszych ekranach stały rozmiar */}
            <div className="flex items-center justify-center min-h-0 lg:h-full">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:aspect-square lg:h-full lg:w-full lg:max-w-full overflow-hidden rounded-full bg-slate-200 shadow-xl mx-auto">
                <Image
                  src="/unnamed.jpeg"
                  alt="Wiktor Szycha"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 288px, (max-width: 768px) 320px, (max-width: 1024px) 384px, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── FAKTY / PROBLEM ─────────────────────────────── */}
        <section id="fakty" className="min-h-[70vh] flex flex-col justify-center space-y-6 sm:space-y-8 py-8 sm:py-12 scroll-mt-20">
          <div className="text-center">
            <h2 className="text-[#7347f4] font-extrabold text-2xl sm:text-3xl mb-4">Fakty</h2>
            <div className="inline-flex justify-center bg-[#cfd8ff] text-[#3e57d6] rounded-full px-6 py-2.5 text-base sm:text-lg font-bold shadow-sm">
              Dlaczego większości ludziom nie udaje się z angielskim?
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start">
            <div className="space-y-4 text-base sm:text-lg leading-relaxed text-slate-600">
              <p><AccentBrackets text={'[Agitacja niepowodzeń] Słyszysz, że angielski to must-have, a z drugiej strony – że lata w szkole i tak nic nie dają, że „trzeba mieć talent" albo wyjechać za granicę.'} /></p>
              <p><AccentBrackets text="[Identyfikacja problemu] Gdy sam przeszedłem od zera do swobodnej rozmowy, zrozumiałem, że problem nie leży w braku talentu. Brakowało mi metody: konkretnych kroków, regularnej praktyki mówienia i materiałów dopasowanych do celu." /></p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                "Uczenie się suchych słówek z list, których nigdy nie używasz w życiu.",
                "Skupianie się na gramatyce zamiast na komunikacji (strach przed błędem).",
                "Brak regularnego, prawdziwego mówienia na głos.",
                "Złe dopasowanie materiałów do Twojego poziomu i celu."
              ].map((text, i) => (
                <div key={i} className="bg-white border border-[#7347f4] rounded-2xl shadow-sm p-4 sm:p-5 flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#cfd8ff] text-[#3e57d6] rounded-xl flex items-center justify-center">
                    <Info className="w-5 h-5" />
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── O MNIE ─── */}
        <section id="o-mnie" className="min-h-[100dvh] snap-start scroll-mt-20 flex flex-col justify-center py-8 sm:py-10">
          <div className="text-center mb-5">
            <h2 className="text-[#7347f4] font-extrabold text-2xl sm:text-3xl mb-4">O mnie</h2>
          </div>
          <div className="bg-[#f8faff] rounded-2xl sm:rounded-3xl shadow-[0_16px_32px_rgba(0,0,0,0.04)]  p-4 sm:p-6 md:p-8 flex flex-col">

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:items-stretch">
              <div className="flex flex-col w-full max-w-[320px] lg:w-[280px] lg:max-w-none shrink-0 mx-auto lg:mx-0">
                <div className="relative aspect-[4/5] lg:aspect-auto lg:flex-1 lg:min-h-[320px] rounded-2xl overflow-hidden shadow-md border border-white">
                  <Image
                    src={storyAndAuthority.authorImagePlaceholder}
                    alt={storyAndAuthority.authorName}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 280px"
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-start text-center lg:text-left">
                <div className="space-y-4 sm:space-y-5">
                  <h4 className="text-3xl sm:text-4xl font-bold text-slate-900">{storyAndAuthority.authorName}</h4>
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {storyAndAuthority.authorBio}
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
                    {storyAndAuthority.credentials.map((cert, i) => (
                      <span key={i} className="bg-white border border-[#b9c5fe] rounded-full px-4 py-2 text-sm font-medium text-slate-700 inline-flex items-center gap-2 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-[#7347f4] shrink-0" />
                        {cert.label}{cert.detail ? ` — ${cert.detail}` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center py-3 sm:py-5">
              <span className="text-[#7347f4]/80" aria-hidden>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </span>
            </div>

            <div className="bg-white/60 border border-[#cfd8ff]/60 rounded-2xl p-4 sm:p-5 md:p-6">
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {[
                  { title: "Zbudowanie autorytetu", text: storyAndAuthority.authorityHeadline },
                  { title: "Historia początków", text: storyAndAuthority.originStory },
                  { title: storyAndAuthority.turningPointHeadline, text: storyAndAuthority.turningPointText },
                  { title: storyAndAuthority.newPathHeadline, text: storyAndAuthority.newPathText },
                  { title: storyAndAuthority.positiveEffectsHeadline, text: storyAndAuthority.positiveEffectsText },
                  { title: "Dodatkowe korzyści", text: storyAndAuthority.additionalBenefits },
                  { title: storyAndAuthority.costOfSolutionHeadline, text: storyAndAuthority.costOfSolutionText },
                ].map((b, i) => (
                  <span key={i}>
                    <span className="font-bold text-[#ffa515]">[{b.title}]</span> {b.text}{" "}
                  </span>
                ))}
              </p>
            </div>

          </div>
        </section>
        {/* ─── OFERTA ─── */}
        <section id="oferta" className="min-h-[70vh] flex flex-col justify-center space-y-6 sm:space-y-8 py-8 sm:py-12 scroll-mt-20">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            <span className="font-bold text-[#ffa515]">[Oferta]</span> – co dokładnie dostajesz
          </h2>

          <div>
            <span className="mb-2 inline-block font-bold text-[#ffa515]">[{offerDetails.tutoring.label}]</span>
            <a
              href={offerDetails.tutoring.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-white border-[0.5px] border-[#ffa515] rounded-2xl overflow-hidden shadow-md transition-all duration-500 hover:border-2 hover:shadow-lg"
            >
              <div className="relative h-36 w-full shrink-0 sm:h-40 bg-slate-200">
                <Image
                  src="https://images.unsplash.com/photo-1758612898181-d7c92f0e21d5?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Korepetycje z angielskiego – indywidualna nauka"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, 800px"
                />
              </div>
              <div className="p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">{offerDetails.tutoring.headline}</h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-1">{offerDetails.tutoring.description}</p>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap pt-1.5 sm:pt-0 sm:shrink-0">
                  <span className="text-[#7347f4] font-extrabold text-base sm:text-lg">{pricingAndGuarantee.tutoringHourlyRate}</span>
                  <span className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#ffbd53] border border-[#ffa515] text-white px-3.5 py-1.5 text-[11px] sm:text-xs font-bold hover:bg-[#f5ad3f] transition-colors">
                    {offerDetails.tutoring.ctaLabel}
                  </span>
                </div>
              </div>
            </a>
          </div>

          <div>
            <h3 className="mb-4 sm:mb-6 text-lg font-semibold text-slate-900">
              <span className="font-bold text-[#ffa515]">[Kursy]</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {offerDetails.courses.map((course, index) => {
              const courseImages = [
                "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80",
                "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
                "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
                "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80",
              ];
              const imgSrc = courseImages[index % courseImages.length];
              return (
              <article
                key={course.id}
                className="flex flex-col overflow-hidden rounded-2xl border-[0.5px] border-[#7347f4] hover:border-2 transition-all duration-500 bg-white shadow-sm hover:shadow-md"
              >
                <div className="relative h-36 w-full shrink-0 bg-slate-100 sm:h-40">
                  <Image src={imgSrc} alt={course.title} fill className="object-cover object-center" sizes="(max-width: 640px) 100vw, 50vw" />
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h4 className="mb-2 line-clamp-2 text-base font-semibold text-slate-900 sm:text-lg">{course.title}</h4>
                  <p className="mb-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-2">{course.shortDescription}</p>
                  <p className="mb-3 text-base font-bold text-[#7347f4] sm:mb-4 sm:text-lg">{course.price}</p>
                  <a
                    href={course.gumroadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gumroad-button flex w-full items-center justify-center gap-1 rounded-lg bg-[#ffbd53] border border-[#ffa515] py-2 text-[11px] sm:text-xs font-bold text-white transition hover:bg-[#f5ad3f] sm:py-2.5"
                  >
                    Kup przez 
                  </a>
                  <button
                    type="button"
                    onClick={() => setCourseModalId(course.id)}
                    className="mt-2 text-center text-xs text-[#7347f4] font-medium underline underline-offset-2 hover:text-[#ffa515] transition-colors"
                  >
                    Szczegóły
                  </button>
                </div>
              </article>
            );
            })}
            </div>
          </div>

          {activeCourse && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
              onClick={() => setCourseModalId(null)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="course-modal-title"
            >
              <div
                className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border-2 border-[#7347f4]  duration-500 bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <h2
                        id="course-modal-title"
                        className="text-xl font-bold text-slate-900 sm:text-2xl"
                      >
                        {activeCourse.title}
                      </h2>
                      <p className="mt-2 text-lg font-bold text-[#7347f4]">
                        {activeCourse.price}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCourseModalId(null)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#b9c5fe] text-[#7347f4] transition hover:bg-[#cfd8ff] hover:border-[#7347f4]"
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
                      <span className="text-xs font-bold uppercase tracking-wider text-[#ffa515]">
                        Format
                      </span>
                      <p className="mt-1 text-sm text-slate-700">
                        {activeCourse.format}
                      </p>
                    </div>
                  )}

                  {"duration" in activeCourse && activeCourse.duration && (
                    <div className="mb-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#ffa515]">
                        Czas dostępu
                      </span>
                      <p className="mt-1 text-sm text-slate-700">
                        {activeCourse.duration}
                      </p>
                    </div>
                  )}

                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#ffa515]">
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
                        <span className="text-xs font-bold uppercase tracking-wider text-[#ffa515]">
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

                <div className="flex shrink-0 flex-col gap-3 border-t-2 border-[#b9c5fe] bg-[#f8faff] p-6 sm:flex-row sm:justify-end sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setCourseModalId(null)}
                    className="order-2 w-full rounded-xl border-2 border-[#b9c5fe] bg-white px-5 py-3 text-sm font-bold text-[#7347f4] transition hover:bg-[#cfd8ff] sm:order-1 sm:w-auto"
                  >
                    Wróć
                  </button>
                  <a
                    href={activeCourse.gumroadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gumroad-button flex w-full items-center justify-center gap-1 rounded-lg bg-[#ffbd53] border border-[#ffa515] py-2 text-[11px] sm:text-xs font-bold text-white transition hover:bg-[#f5ad3f] sm:py-2.5"
                  >
                    Kup przez 
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-10 sm:pt-12 border-t border-[#b9c5fe]/40 mt-10 sm:mt-12">
            <div className="space-y-3">
              <h3 className="text-[#ffa515] font-bold text-xl sm:text-2xl">Zbudowanie wartości</h3>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                Tę wiedzę i strukturę zdobywa się latami – ja zebrałem to w kursy i lekcje, które możesz przerobić w swoim tempie. Bez dojazdów, bez sztywnego grafiku grupowego.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-[#ffa515] font-bold text-xl sm:text-2xl">Gwarancja</h3>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                Jestem pewny swojej metody – sprawdziłem ją na dziesiątkach uczniów. Jeśli w ciągu pierwszych zajęć uznasz, że to nie dla Ciebie, zwrócę Ci koszt lub zaproponuję inną formę.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-[#ffa515] font-bold text-xl sm:text-2xl">Deadline</h3>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                Miejsca na korepetycje i promocyjne ceny kursów są ograniczone. Warto zarezerwować termin lub kurs wcześniej.
              </p>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section id="final-cta" className="relative w-full px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-5 text-2xl font-bold tracking-tight text-[#7347f4] sm:text-3xl">
              {finalCta.emotionalCloseHeadline.replace(/^[^:]+:\s*/, "")}
            </h2>
            <div className="mb-6 space-y-3">
              <div className="rounded-2xl border-2 border-dashed border-[#b9c5fe] bg-white p-4 text-left sm:p-5">
                <p className="text-base text-slate-700 sm:text-lg">{finalCta.option1}</p>
              </div>
              <div className="rounded-2xl border-2 border-[#7347f4] bg-[#cfd8ff] p-4 text-left sm:p-5">
                <p className="text-base font-bold text-[#243cb5] sm:text-lg">{finalCta.option2}</p>
              </div>
            </div>
            <h3 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">
              {finalCta.afterPurchaseHeadline}
            </h3>
            <div className="mb-6 rounded-2xl border-2 border-dashed border-[#b9c5fe] bg-white p-4 text-left sm:p-5">
              <p className="mb-2 text-base text-slate-700 sm:text-lg">Po rezerwacji lub zakupie kursu dostaniesz:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-base text-slate-700 sm:text-lg">
                {finalCta.afterPurchaseSteps.map((step, i) => (
                  <li key={i}>{step.replace(/^Po rezerwacji lub zakupie kursu dostaniesz\s+/, "")}</li>
                ))}
              </ol>
            </div>
            <div className="mb-4 rounded-2xl border-2 border-dashed border-[#b9c5fe] bg-white px-4 py-3 sm:px-5 sm:py-4">
              <p className="text-center text-base font-bold text-slate-800 sm:text-lg">
                {finalCta.finalCtaHeadline.replace(/^CTA:\s*/, "").split("Ciebie").length > 1 ? (
                  <>
                    {finalCta.finalCtaHeadline.replace(/^CTA:\s*/, "").split("Ciebie")[0]}
                    <span className="underline decoration-2 decoration-[#ffa515]">Ciebie</span>
                    {finalCta.finalCtaHeadline.replace(/^CTA:\s*/, "").split("Ciebie")[1]}
                  </>
                ) : (
                  finalCta.finalCtaHeadline.replace(/^CTA:\s*/, "")
                )}
              </p>
            </div>
            <p className="mb-5 text-center text-sm text-slate-600 sm:text-base">
              {finalCta.finalCtaText}
            </p>
            <a
              href={finalCta.finalButtonAnchor}
              className="inline-block rounded-full bg-[#ffbd53] px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-[#f5ad3f] hover:shadow-lg"
            >
              {finalCta.finalButtonLabel}
            </a>
          </div>
        </section>

        {/* ─── OPINIE ─── */}
        <section id="opinie" className="min-h-[70vh] flex flex-col justify-center bg-[#f8faff] rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-6 sm:p-8 md:p-10 scroll-mt-20">
          <h2 className="text-[#7347f4] font-extrabold text-2xl sm:text-3xl text-center mb-3">Opinie</h2>
          <p className="text-center text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-6 sm:mb-8">
            To nie kwestia &bdquo;talentu&rdquo;. Swoją metodę przetestowałem na dziesiątkach uczniów – od poprawy ocen po swobodne rozmowy w pracy i na wyjeździe.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { name: "Lebron James", result: "Matura rozszerzona, wyjazd", quote: "„W końcu przestałem się bać mówić. Korepetycje i kurs dały mi strukturę i pewność.\"" },
              { name: "Maks Konkiel", result: "Angielski w pracy", quote: "„Konkretnie, bez lania wody. Polecam każdemu, kto chce w końcu ogarnąć angielski.\"" },
              { name: "Carcia Loncz", result: "Efekty w kilka miesięcy", quote: "„Na dziesiątkach uczniów – poprawa ocen, matury i pewność w mówieniu.\"" }
            ].map((review, i) => (
              <div key={i} className="bg-white border border-[#7347f4] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="font-bold text-base sm:text-lg">{review.name}</div>
                  <div className="text-[#ffa515] text-xs sm:text-sm font-semibold mb-3">{review.result}</div>
                  <div className="text-sm sm:text-base text-slate-700 leading-relaxed">{review.quote}</div>
                </div>
                <div className="text-[#ffa515] text-lg sm:text-xl mt-4">★★★★★</div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="border-t border-[#cfd8ff] bg-white mt-12 sm:mt-16">
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-4 sm:px-6 sm:pt-10 sm:pb-6 md:px-8 lg:px-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 space-y-2">
            <h4 className="text-[#3e57d6] font-extrabold text-lg sm:text-xl">Szycha</h4>
            <p className="text-slate-600 text-sm sm:text-base">Angielski, który w końcu otwiera drzwi</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-slate-500 uppercase tracking-wider text-xs">Nawigacja</h5>
            <div className="flex flex-col gap-1 text-sm sm:text-base font-medium text-slate-700">
              <Link href="#fakty">Fakty</Link>
              <Link href="#oferta">Oferta</Link>
              <Link href="#o-mnie">O mnie</Link>
              <Link href="#opinie">Opinie</Link>
            </div>
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-slate-500 uppercase tracking-wider text-xs">Kontakt</h5>
            <div className="flex items-center gap-2 text-sm text-slate-700"><Mail className="w-4 h-4 flex-shrink-0"/> kontakt@example.com</div>
            <div className="flex items-center gap-2 text-sm text-slate-700"><Phone className="w-4 h-4 flex-shrink-0"/> +48 000 000 000</div>
            <div className="flex gap-3 pt-1">
              <div className="w-9 h-9 rounded-full bg-[#cfd8ff] text-[#3e57d6] flex items-center justify-center"><Facebook className="w-4 h-4"/></div>
              <div className="w-9 h-9 rounded-full bg-[#cfd8ff] text-[#3e57d6] flex items-center justify-center"><Instagram className="w-4 h-4"/></div>
            </div>
          </div>
        </div>
        <div className="border-t border-[#e2e7ff]">
          <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6 sm:py-4 md:px-8 lg:px-12">
            <p className="text-center text-[11px] sm:text-xs text-slate-500 space-x-1">
              <span>
                Powered by{" "}
                <a
                  href="https://aniszewski-code.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#7347f4] hover:underline"
                >
                  Wojciech Aniszewski
                </a>{" "}
                © 2026
              </span>
              <span className="inline-block">·</span>
              <span>
                Visual concept by{" "}
                <a
                  href="mailto:wilczynska.visuals@gmail.com"
                  className="font-medium text-[#ffa515] hover:underline"
                >
                  wilczynska.visuals
                </a>
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
