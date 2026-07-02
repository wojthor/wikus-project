"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";

import { CheckoutButton } from "@/app/components/CheckoutButton";
import { content, type FooterData } from "@/data/content";
import { Footer } from "@/src/features/landing";
import { UnschoolTestimonialsSection } from "@/src/features/unschool/components/UnschoolTestimonialsSection";
import {
  UNSCHOOL_COURSE_OFFER,
  UNSCHOOL_PRICING_FEATURES,
} from "@/src/features/unschool/course-offer";
import { STRIPE_PAYMENT_METHODS_LABEL } from "@/src/lib/stripe-payment-methods";

const kursFooter = {
  ...content.footer,
  navLinks: [
    { label: "Strona główna", href: "https://wiktorszyszkowski.pl" },
    { label: "Dla kogo", href: "#dla-kogo" },
    { label: "Program", href: "#program" },
    { label: "O mnie", href: "#o-mnie" },
    { label: "Opinie", href: "#opinie" },
    { label: "Cennik", href: "#cennik" },
    { label: "FAQ", href: "#faq" },
  ],
};

const tag =
  "inline-flex items-center bg-[#cfd8ff] border border-[#b9c5fe] text-[#3e57d6] rounded-full px-4 py-1 text-xs sm:text-sm font-semibold tracking-wide";
const sectionEyebrow =
  "text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-snug";
const lessonPill =
  "flex items-start gap-2 text-xs sm:text-sm text-slate-700 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-white to-[#f8faff]/90 border border-[#dfe6ff] shadow-[0_1px_3px_rgba(115,71,244,0.06)]";
const h2 =
  "text-[#7347f4] font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight";
const sub = "text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl";
const card = "bg-white border border-[#b9c5fe] rounded-2xl shadow-sm p-4 sm:p-5";
const panel =
  "bg-[#f8faff] rounded-2xl sm:rounded-3xl shadow-[0_30px_50px_rgba(0,0,0,0.05)] border border-white p-6 sm:p-8 md:p-10";
const btnPrimary =
  "inline-flex items-center justify-center rounded-4xl bg-[#ffbd53] border border-[#ffa515] text-white px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold shadow-md hover:-translate-y-0.5 transition-transform cursor-pointer";
const btnSecondary =
  "inline-flex items-center justify-center rounded-4xl bg-white border border-[#ffa515] text-[#ffa515] px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold shadow-sm hover:-translate-y-0.5 transition-transform";
const faqListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const faqItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const COMPARISON_ROWS = [
  ["Certyfikat = dowód że umie uczyć", "Filologia + własna droga przez mówienie"],
  ["Nauka z podręcznika", "Nauka przez prawdziwy content"],
  ["Ciągłe ćwiczenia z lukami do uzupełnienia", "Mówienie od pierwszego dnia"],
  ["Uczysz się bo musisz", "Uczysz się bo chcesz i widzisz sens"],
] as const;

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`py-12 sm:py-16 md:py-20 px-4 sm:px-6 ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

export default function UnschoolPage() {
  return <UnschoolLanding />;
}

function UnschoolLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "#dla-kogo", label: "Dla kogo" },
    { href: "#program", label: "Program" },
    { href: "#o-mnie", label: "O mnie" },
    { href: "#opinie", label: "Opinie" },
  ];

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-900 font-sans selection:bg-[#cfd8ff]">
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg shadow-[0_1px_30px_rgba(0,0,0,0.15)]">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 md:px-8 flex items-center justify-between">
          <Link
            href="https://wiktorszyszkowski.pl"
            className="text-[#7347f4] font-extrabold text-base sm:text-lg tracking-wider hover:opacity-90 transition-opacity"
          >
            SZYSZKOWSKI <span className="font-bold text-slate-500">/ unschool</span>
          </Link>
          <div className="hidden md:flex items-center gap-1 text-[#7347f4] font-bold text-sm">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 hover:bg-[#cfd8ff]/50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <CheckoutButton
              label="Kup kurs →"
              className="ml-2 shrink-0"
              buttonClassName="inline-flex items-center justify-center rounded-4xl bg-[#ffbd53] border border-[#ffa515] text-white px-4 py-2 text-sm font-bold shadow-md hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:hover:translate-y-0"
            />
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-[#7347f4] hover:bg-[#cfd8ff]/50 transition-colors"
            aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg border-t border-[#b9c5fe]/30">
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-[#7347f4] font-bold hover:bg-[#cfd8ff]/50 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <CheckoutButton
                label="Kup kurs →"
                className="mt-2"
                buttonClassName="inline-flex w-full items-center justify-center rounded-4xl bg-[#ffbd53] border border-[#ffa515] text-white px-4 py-3 text-sm font-bold shadow-md transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              />
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-5 sm:space-y-6">
            <div className={tag}>
              <span className="w-2 h-2 rounded-full bg-[#3e57d6] mr-2" />
              Kurs online · Poziom B1–B2
            </div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#3e57d6]">
              Unschool Your English
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
              Rozumiesz, ale nadal nie{" "}
              <em className="text-[#7347f4] not-italic font-extrabold">mówisz?</em>
            </h1>
            <p className={sub}>
              Znasz słówka. Rozumiesz filmy. A mimo to przy rozmowie coś się zacina. Ten kurs
              naprawia dokładnie to – bez podręcznika, bez teorii na zapas, z feedbackiem ode mnie
              na każde zadanie.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <CheckoutButton
                buttonClassName={`${btnPrimary} disabled:opacity-50 disabled:hover:translate-y-0`}
              />
              <Link href="#program" className={btnSecondary}>
                Zobacz program
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 sm:gap-10 pt-2">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#7347f4]">35</div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">lekcji wideo</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#7347f4]">7</div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">modułów</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#7347f4]">~3</div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">miesiące nauki</div>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-[#b9c5fe] bg-[#f8faff] px-4 py-3 text-sm text-slate-600 leading-relaxed">
              35 lekcji u przeciętnego korepetytora?{" "}
              <span className="font-bold text-slate-500">Licz 3&nbsp;500&nbsp;zł.</span>
              <br />
              35 lekcji tutaj? <span className="font-extrabold text-[#7347f4]">597&nbsp;zł.</span>
            </div>
          </div>

          <div className="relative rounded-3xl border-2 border-[#7347f4] bg-gradient-to-br from-[#cfd8ff]/80 via-white to-[#f8faff] p-6 shadow-[0_20px_50px_rgba(115,71,244,0.12)] ring-1 ring-[#7347f4]/20">
            <span className="absolute -top-3 right-5 rounded-full bg-[#ffbd53] border border-[#ffa515] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              {UNSCHOOL_COURSE_OFFER.promotionBadge}
            </span>
            <div className={tag}>{UNSCHOOL_COURSE_OFFER.tileEyebrow}</div>
            <h2 className="mt-2 text-2xl font-extrabold text-[#7347f4] leading-tight">
              {UNSCHOOL_COURSE_OFFER.tileTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">
              {UNSCHOOL_COURSE_OFFER.tileSubtitle}
            </p>
            <ul className="mt-4 space-y-2.5 text-left">
              {UNSCHOOL_PRICING_FEATURES.map((feature) => (
                <li key={feature} className="flex gap-2.5 items-start text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7347f4] text-[10px] font-bold text-white">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-xl border border-[#b9c5fe] bg-white/90 px-4 py-3 text-center">
              <div className="text-xs text-slate-400 line-through">
                {UNSCHOOL_COURSE_OFFER.priceCompareDisplay}
              </div>
              <span className="text-3xl font-extrabold text-[#7347f4] tracking-tight">
                {UNSCHOOL_COURSE_OFFER.priceDisplay}
              </span>
              <p className="mt-1 text-[11px] text-slate-500 font-medium">
                {UNSCHOOL_COURSE_OFFER.priceNote}
              </p>
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#b9c5fe] bg-[#f8faff] px-3 py-3">
              <span className="text-sm leading-none mt-0.5">🔒</span>
              <div>
                <p className="text-xs font-bold text-[#7347f4]">Gwarancja satysfakcji – 30 dni</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                  Nie chcę żebyś kupował w ciemno. Dlatego jeśli przerobiłeś pierwsze 2 moduły,
                  wysłałeś zadania i nadal czujesz że to nie dla Ciebie – piszesz do mnie i zwracam
                  całą kwotę. Zero ryzyka z Twojej strony.
                </p>
              </div>
            </div>
            <CheckoutButton
              className="mt-4 w-full"
              buttonClassName={`${btnPrimary} w-full text-base disabled:opacity-50 disabled:hover:translate-y-0`}
            />
          </div>
        </div>
      </main>

      <UspMentoringSection />

      <Section id="dla-kogo" className="bg-white/50">
        <div className={tag}>Brzmi znajomo?</div>
        <h2 className={`${h2} mt-4 mb-4`}>
          Uczysz się latami.
          <br />A mimo to nie mówisz.
        </h2>
        <p className={`${sub} mb-8 sm:mb-10`}>
          Coś tu nie gra – i pewnie to czujesz. Znasz słówka, rozumiesz dużo, a mimo to przy
          rozmowie się blokujesz. To nie przypadek.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: "😶",
              title: "Wiesz co powiedzieć – po polsku",
              text: "Masz myśl w głowie. Wiesz, o czym chcesz mówić. Ale gdy przychodzi moment – cisza. Mózg się zawiesza. I nic.",
            },
            {
              icon: "📚",
              title: "Uczyłeś się latami i nadal za mało",
              text: "Szkoła, korepetycje, aplikacje, kursy online. Sporo czasu i pieniędzy – a rozmowa po angielsku nadal wywołuje stres.",
            },
            {
              icon: "🤔",
              title: "Rozumiesz filmy, ale nie speakerów",
              text: "Lektor mówił wyraźnie i wolno. Prawdziwy Amerykanin mówi inaczej – i nagle nic nie rozumiesz. Jakby to był inny język.",
            },
            {
              icon: "🔄",
              title: "Zaczynasz i rzucasz. Znowu.",
              text: "Kurs, aplikacja, YouTube po angielsku – przez tydzień. Potem nic przez miesiąc. I tak w kółko. Bez systemu nie ma efektów.",
            },
          ].map((item) => (
            <div key={item.title} className={card}>
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-bold text-[#7347f4] mb-2 text-sm sm:text-base">{item.title}</div>
              <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="opinie">
        <div className={tag}>Dowód, że to działa</div>
        <h2 className={`${h2} mt-4 mb-4`}>
          Uczniowie mówią
          <br />
          sami za siebie.
        </h2>
        <p className={`${sub} mb-8 sm:mb-10`}>
          Nie sprzedaję Ci obietnic. Sprzedaję Ci metodę, która działa i mam na to dowody.
        </p>
        <UnschoolTestimonialsSection />
      </Section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#b9c5fe] mb-4">
            Prawda, której nikt Ci nie powie
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-6">
            Szkoła nie uczyła Cię mówić.
            <br />
            <em className="text-[#7347f4] not-italic">I to był plan.</em>
          </h2>
          <p className="text-sm sm:text-base text-white/65 leading-relaxed mb-4">
            System edukacji jest zoptymalizowany pod testy i oceny – nie pod komunikację. Nauczyciel
            może sprawdzić, czy wiesz jak zbudować zdanie w Past Perfect. Nie może sprawdzić, czy
            potrafisz się dogadać na lotnisku.
          </p>
          <p className="text-sm sm:text-base text-white/65 leading-relaxed mb-10">
            Więc uczą tego co się da ocenić. A Ty po 12 latach nauki stoisz i nie możesz zamówić
            kawy w Londynie. Korepetytorzy z certyfikatami robią to samo – tyle że drożej.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            <div className="rounded-2xl bg-white/10 p-5 sm:p-6">
              <div className="text-xl mb-2">❌</div>
              <div className="font-bold text-sm mb-2">Co robiła szkoła</div>
              <p className="text-sm text-white/50 leading-relaxed">
                Ciągłe ćwiczenia z lukami do uzupełnienia. Gramatyka dla gramatyki. Testy. Oceny.
                Zero prawdziwego mówienia.
              </p>
            </div>
            <div className="rounded-2xl bg-[#7347f4]/20 border border-[#7347f4]/30 p-5 sm:p-6">
              <div className="text-xl mb-2">✅</div>
              <div className="font-bold text-sm mb-2">Co robi mentoring 1:1</div>
              <p className="text-sm text-white/70 leading-relaxed">
                Mówisz od pierwszej lekcji. Uczysz się przez prawdziwy content. Dostajesz feedback
                od człowieka.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section id="co-dostajesz">
        <div className={tag}>Dlaczego tak jest</div>
        <h2 className={`${h2} mt-4 mb-4`}>
          System Cię nauczył
          <br />
          wszystkiego oprócz mówienia.
        </h2>
        <p className={`${sub} mb-8 sm:mb-10`}>
          Szkoła, podręczniki, Duolingo – uczą Cię zdawać testy. Nie uczą Cię rozmawiać. To nie jest
          Twoja wina. To jest zepsuty system.
          <br />
          <br />
          Ten kurs działa inaczej. Mówisz od pierwszej lekcji, dostajesz feedback na każde zadanie i
          uczysz się przez to, co i tak robisz na co dzień.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: "🎬",
              title: "Wideo lekcje",
              text: "Większość lekcji ma film, gdzie tłumaczę temat, tak jak na normalnej lekcji. Każda lekcja ma też pełny materiał pisemny z przykładami – do czytania, wracania i powtarzania.",
            },
            {
              icon: "🎙️",
              title: "Zadania głosowe",
              text: "Nagrywasz się bezpośrednio w platformie. Nie musisz nic instalować – klikasz, mówisz, wysyłasz.",
            },
            {
              icon: "✏️",
              title: "Zadania tekstowe",
              text: "Opisujesz, tłumaczysz, piszesz po angielsku. Realne sytuacje, nie podręcznikowe ćwiczenia.",
            },
            {
              icon: "♾️",
              title: "Dostęp bezterminowy",
              text: "Kupujesz raz, masz na zawsze. Możesz wracać do lekcji, kiedy chcesz. Spokojne tempo – 2–3 lekcje tygodniowo – bez presji.",
            },
            {
              icon: "📱",
              title: "Działa na telefonie",
              text: "Platforma działa na każdym urządzeniu. Możesz robić lekcje w przerwie w pracy albo wieczorem na kanapie.",
            },
            {
              icon: "🎓",
              title: "Certyfikat ukończenia",
              text: "Po ukończeniu finału kursu dostajesz certyfikat ukończenia Unschool Your English – potwierdzenie, że przeszedłeś cały program.",
            },
          ].map((item) => (
            <div key={item.title} className={`${card} flex gap-4`}>
              <div className="text-2xl shrink-0">{item.icon}</div>
              <div>
                <div className="font-bold text-[#7347f4] mb-1 text-sm sm:text-base">
                  {item.title}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}

          {/* Personalny feedback — pełna szerokość z mockupem */}
          <div className={`${card} sm:col-span-2 flex flex-col gap-4`}>
            <div className="flex gap-4">
              <div className="text-2xl shrink-0">💬</div>
              <div>
                <div className="font-bold text-[#7347f4] mb-1 text-sm sm:text-base">
                  Personalny feedback
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Odsłuchuję każde nagranie i czytam każdą odpowiedź. Komentuję co poszło dobrze i
                  co poprawić. Nie dostajesz automatycznych odpowiedzi, dostajesz feedback od
                  gościa, który wie, czemu szkolna nauka nie działa.
                </p>
              </div>
            </div>

            {/* Dwa screenshoty obok siebie (docelowo prawy = filmik) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="min-w-0">
                <div className="overflow-hidden rounded-xl border border-[#dfe6ff] shadow-[0_8px_28px_rgba(115,71,244,0.10)]">
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 border-b border-[#dfe6ff]">
                    <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                    <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                    <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                    <span className="ml-1.5 text-[10px] text-slate-400 font-medium">
                      Feedback tekstowy{" "}
                    </span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/feedback2-new.png"
                    alt="Panel ucznia z zadaniem i feedbackiem"
                    className="w-full h-auto block"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-medium text-center">
                  Feedback tekstowy
                </p>
              </div>
              <div className="min-w-0">
                <div className="overflow-hidden rounded-xl border border-[#dfe6ff] shadow-[0_8px_28px_rgba(115,71,244,0.10)]">
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 border-b border-[#dfe6ff]">
                    <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                    <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                    <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                    <span className="ml-1.5 text-[10px] text-slate-400 font-medium">
                      Feedback głosowy{" "}
                    </span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <video
                    src="/feedback-new.mov"
                    controls
                    playsInline
                    className="w-full h-auto block"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-medium text-center">
                  Feedback głosowy
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="program" className="bg-[#cfd8ff]/20">
        <div className={tag}>Program kursu</div>
        <h2 className={`${h2} mt-4 mb-4`}>
          7 modułów,
          <br />
          35 lekcji.
        </h2>
        <p className={`${sub} mb-8 sm:mb-10`}>
          Zaczynamy od głowy – bo to tam jest problem. Potem speaking, listening, wymowa i gramatyka
          której naprawdę potrzebujesz. Bez zbędnego wypełniacza.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              num: "Moduł 1",
              title: "🧠 Mindset",
              sub: "Zacznij z właściwym nastawieniem",
              lessons: [
                "Czemu ten kurs jest inny niż inne",
                "Błędy są Twoim przyjacielem",
                "Szkoła Cię nie przygotowała – i to nie Twoja wina",
                "Dlaczego aplikacje do nauki nie wystarczą",
                "Jak ułożyć naukę – system, który działa",
                "Think in English – przestań tłumaczyć w głowie",
              ],
            },
            {
              num: "Moduł 2",
              title: "🏫 Szkoła vs Prawdziwy Angielski",
              sub: "Czego Cię uczono – a jak to brzmi naprawdę",
              lessons: [
                'Must vs Have to – Amerykanie nie mówią "must"',
                "Shall – słowo, którego nikt nie używa",
                "Podręcznikowe zwroty, których NIKT nie używa",
                'Contractions – dlaczego "I am" brzmi dziwnie',
                "Gonna, wanna, kinda – naturalny angielski",
                "Fałszywi przyjaciele - słowa, które brzmią znajomo ale nie znaczą tego co myślisz",
              ],
            },
            {
              num: "Moduł 3",
              title: "🗣️ Speaking & Bariera",
              sub: "Mów mimo że się boisz",
              lessons: [
                "Dlaczego się blokujesz – neurologia strachu",
                "Gap-fillers – jak zyskać czas i brzmieć naturalnie",
                "Opisuj zamiast szukać słowa – circumlocution",
                "Wyrażanie opinii bez bycia kategorycznym",
                "Small talk – sztuka mówienia o niczym",
                "Question tags – isn't it? right?",
                "Jak zadawać pytania naturalnie — błędy których nie znasz",
              ],
            },
            {
              num: "Moduł 4",
              title: "👂 Listening",
              sub: "Słuchaj jak native",
              lessons: [
                "Dlaczego nie rozumiesz native speakerów",
                "Jak oglądać seriale, żeby się uczyć",
                "Akcent brytyjski vs amerykański",
                "Podcasty jako narzędzie nauki",
              ],
            },
            {
              num: "Moduł 5",
              title: "📖 Gramatyka",
              sub: "Tylko to, co naprawdę potrzebne",
              lessons: [
                "80% gramatyki, której nie potrzebujesz",
                "Past Simple vs Present Perfect – raz na zawsze",
                "Conditionals – tylko 2, które musisz znać",
                "Modal verbs – nie tylko can i should",
              ],
            },
            {
              num: "Moduł 6",
              title: "🎙️ Wymowa",
              sub: "Kluczowe głoski, nie perfekcyjny akcent",
              lessons: [
                "TH, długie/krótkie samogłoski, głoska NI",
                "Californian English – głoska O i 6 wersji T",
                "Intonacja – jak nie brzmieć jak robot",
                "Wymowa liczb, dat i cen",
              ],
            },
            {
              num: "Moduł 7",
              title: "🚀 Fluency Sprint",
              sub: "Finał kursu – na końcu certyfikat ukończenia",
              lessons: [
                "7-Day Speaking Challenge – finał kursu",
                "Twoje nagranie – przed i po",
                "Co dalej po kursie – jak utrzymać postęp",
                "Refleksja końcowa + certyfikat ukończenia 🎓",
              ],
            },
          ].map((mod, index) => {
            const isFeatured = index === 6;
            return (
              <div
                key={mod.num}
                className={
                  isFeatured
                    ? "sm:col-span-2 lg:col-span-3 bg-white border-2 border-[#7347f4] rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_12px_32px_rgba(115,71,244,0.1)] ring-1 ring-[#7347f4]/20"
                    : "group bg-white border border-[#dfe6ff] rounded-2xl p-4 shadow-[0_4px_18px_rgba(115,71,244,0.06)] hover:border-[#7347f4]/30 hover:shadow-[0_8px_24px_rgba(115,71,244,0.1)] transition-all duration-200 h-full"
                }
              >
                {isFeatured && (
                  <span className="inline-block mb-3 rounded-full bg-[#ffbd53] border border-[#ffa515] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Finał kursu
                  </span>
                )}
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-[#3e57d6]">
                  {mod.num}
                </div>
                <div
                  className={`font-extrabold mb-1 text-[#7347f4] ${isFeatured ? "text-lg sm:text-xl" : "text-base sm:text-lg"}`}
                >
                  {mod.title}
                </div>
                <p className={`mb-3 text-xs text-slate-500 ${isFeatured ? "sm:text-sm" : ""}`}>
                  {mod.sub}
                </p>
                <div className={`grid gap-1.5 ${isFeatured ? "sm:grid-cols-2" : ""}`}>
                  {mod.lessons.map((lesson) => (
                    <div key={lesson} className={lessonPill}>
                      <span
                        className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7347f4]/12 text-[10px] font-bold text-[#7347f4]"
                        aria-hidden
                      >
                        ✓
                      </span>
                      <span className="leading-snug">{lesson}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section id="jak-dziala">
        <div className={tag}>Jak to działa</div>
        <h2 className={`${h2} mt-4 mb-4`}>
          Uczysz się.
          <br />
          Mówisz. Dostajesz feedback.
        </h2>
        <p className={`${sub} mb-8 sm:mb-10`}>
          Zero skomplikowanych systemów. Każda lekcja ma materiał i zadanie do wykonania – głosowe
          albo tekstowe. Większość ma też wideo. Wysyłasz, ja sprawdzam, daję feedback. I tak 35
          razy.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              num: "01",
              title: "Przerabiasz lekcję",
              text: "Materiał pisemny z przykładami i insightami. W większości lekcji masz też wideo, gdzie tłumaczę temat ludzkim językiem.",
            },
            {
              num: "02",
              title: "Czytasz materiał",
              text: "Każda lekcja ma treść z przykładami, insightami i ćwiczeniami do przeanalizowania.",
            },
            {
              num: "03",
              title: "Robisz zadanie",
              text: "Nagrywasz się albo piszesz odpowiedź – bezpośrednio w platformie. Wysyłasz jednym kliknięciem.",
            },
            {
              num: "04",
              title: "Dostajesz feedback",
              text: "Odsłuchuję, czytam i komentuję. Wiesz co robisz dobrze i co konkretnie poprawić.",
            },
          ].map((step) => (
            <div key={step.num} className={panel}>
              <div className="text-3xl font-extrabold text-[#cfd8ff] mb-2">{step.num}</div>
              <div className="font-bold text-[#7347f4] mb-2">{step.title}</div>
              <p className="text-sm text-slate-600 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="o-mnie" className="bg-white/50">
        <motion.div
          className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
        >
          <div className={`${panel} flex flex-col`}>
            <p className={sectionEyebrow}>Czemu warto mnie słuchać?</p>
            <h2 className={`${h2} mt-3 mb-4`}>
              Skończyłem filologię.
              <br />I właśnie dlatego uczę inaczej.
            </h2>
            <p className={`${sub} mb-4 lg:mb-5`}>
              Mam wykształcenie językowe i na własne oczy zobaczyłem, jak bardzo akademickie metody
              są oderwane od tego, jak ludzie naprawdę zaczynają mówić. Dlatego nie uczę Cię teorii
              o języku – uczę Cię go używać.
            </p>
            <div className="flex-1 flex flex-col gap-3 min-h-0">
              {[
                {
                  icon: "✈️",
                  title: "Sam nauczyłem się przez życie, nie przez szkołę",
                  text: "Wyjazdy za granicę, Erasmus, oglądanie rzeczy po angielsku, a nie lekcje. Blokada przy mówieniu? Miałem ją. Wiem, jak to naprawić. Większość uczniów ma ją tak samo.",
                },
                {
                  icon: "👁️",
                  title: "Od liceum obserwowałem, co działa, a co nie",
                  text: "Chodziłem do korepetytorów i wyłapywałem co ma sens, a co jest tylko marnowaniem czasu. Filologia dała mi narzędzia i potwierdziła moje podejrzenia.",
                },
                {
                  icon: "🎯",
                  title: "Uczę zawodowo od 4 lat",
                  text: "Pracowałem z dziesiątkami uczniów na różnych poziomach – od kompletnych początkujących po osoby przygotowujące się do rozmów rekrutacyjnych po angielsku.",
                },
              ].map((fact) => (
                <div key={fact.title} className={`${card} flex flex-1 gap-3 py-3 min-h-[4.5rem]`}>
                  <span className="text-xl shrink-0">{fact.icon}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-[#7347f4] text-sm sm:text-base mb-1">
                      {fact.title}
                    </div>
                    <p className="text-sm text-slate-600 leading-snug">{fact.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${panel} flex flex-col`}>
            <p className={sectionEyebrow}>Moje podejście vs typowy korepetytor</p>
            <h2 className={`${h2} mt-3 mb-4`}>
              Ten sam cel.
              <br />
              Inna metoda.
            </h2>
            <p className={`${sub} mb-4 lg:mb-5`}>
              Co daje ten kurs, a co znajdziesz gdzieś indziej?
            </p>

            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 flex flex-col rounded-2xl border border-[#b9c5fe] overflow-hidden bg-white">
                <div className="grid grid-cols-2 text-[11px] sm:text-xs font-bold border-b border-[#b9c5fe] shrink-0">
                  <div className="px-3 sm:px-4 py-2.5 text-slate-500 bg-slate-50 border-r border-[#b9c5fe] flex items-center">
                    😴 Typowy korepetytor
                  </div>
                  <div className="px-3 sm:px-4 py-2.5 bg-[#7347f4] text-white flex flex-col justify-center gap-0.5">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#ffbd53] font-bold leading-none">
                      Lepszy wybór
                    </span>
                    <span className="text-xs sm:text-sm leading-tight">✅ Ten kurs</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col divide-y divide-[#b9c5fe]/50 min-h-0">
                  {COMPARISON_ROWS.map(([bad, good]) => (
                    <div key={bad} className="grid grid-cols-2 flex-1 min-h-[3.25rem]">
                      <div className="flex gap-2 items-center px-3 sm:px-4 py-2 text-slate-500 bg-slate-50/90 border-r border-[#b9c5fe]/50">
                        <span className="shrink-0 text-slate-300 font-bold text-xs" aria-hidden>
                          ✕
                        </span>
                        <span className="text-[11px] sm:text-xs leading-snug">{bad}</span>
                      </div>
                      <div className="flex gap-2 items-center px-3 sm:px-4 py-2 font-semibold text-[#243cb5] bg-[#cfd8ff]/45 shadow-[inset_3px_0_0_0_#7347f4]">
                        <span className="shrink-0 text-[#7347f4] font-bold text-xs" aria-hidden>
                          ✓
                        </span>
                        <span className="text-[11px] sm:text-xs leading-snug">{good}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 shrink-0 rounded-xl border border-[#7347f4]/15 bg-[#cfd8ff]/30 px-3 sm:px-4 py-3 shadow-[0_2px_8px_rgba(115,71,244,0.05)]">
                <p className="text-xs sm:text-sm text-slate-700 italic leading-snug">
                  &quot;Większość korepetytorów uczy tak samo jak szkoła – tylko drożej. Dlatego
                  efekty są takie same.&quot;
                </p>
                <p className="text-xs sm:text-sm font-bold text-[#7347f4] mt-1.5">
                  – Wiktor Szyszkowski
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      <Section id="cennik">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className={tag}>Inwestycja</div>
          <h2 className={`${h2} mt-4 mb-4`}>Masz dwie opcje.</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
          <div className="rounded-2xl sm:rounded-3xl border-2 border-dashed border-[#b9c5fe] bg-white p-6 sm:p-8 flex flex-col justify-center text-left">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Opcja 1
            </p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-700 mb-4">
              Zostajesz przy starym systemie
            </h3>
            <p className={`${sub} !max-w-none mb-5`}>
              Możesz dalej uczyć się metodami, które nie działają. Albo możesz spróbować czegoś
              innego.
            </p>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li className="flex gap-2">
                <span className="text-slate-300">✕</span> Ta sama blokada przy mówieniu
              </li>
              <li className="flex gap-2">
                <span className="text-slate-300">✕</span> Kolejna aplikacja albo podręcznik
              </li>
              <li className="flex gap-2">
                <span className="text-slate-300">✕</span> Zero feedbacku od człowieka
              </li>
              <li className="flex gap-2">
                <span className="text-slate-300">✕</span> „Kiedyś” zacznę mówić
              </li>
            </ul>
          </div>
          <div className="relative rounded-3xl border-2 border-[#7347f4] bg-gradient-to-br from-[#cfd8ff]/90 via-white to-[#f8faff] p-6 sm:p-10 shadow-[0_24px_60px_rgba(115,71,244,0.18)] ring-2 ring-[#7347f4]/15">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#ffbd53] border border-[#ffa515] px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm whitespace-nowrap">
              🔥 Promocja
            </span>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#3e57d6] mb-2 text-center">
              Pełny dostęp · bezterminowy
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#7347f4] text-center mb-1">
              Unschool Your English
            </h3>
            <p className="text-sm text-[#3e57d6] font-semibold text-center mb-1">
              Przestań się uczyć, zacznij mówić.
            </p>
            <p className="text-sm text-slate-600 text-center mb-6">
              Z feedbackiem na każde zadanie – głosowe i tekstowe.
            </p>
            <ul className="text-left space-y-2.5 mb-6 text-sm text-slate-700">
              {UNSCHOOL_PRICING_FEATURES.map((li) => (
                <li key={li} className="flex gap-2 items-start">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7347f4] text-[10px] font-bold text-white">
                    ✓
                  </span>
                  {li}
                </li>
              ))}
            </ul>
            <div className="rounded-2xl border border-[#b9c5fe] bg-white/90 px-4 py-4 text-center mb-6">
              <div className="text-base text-slate-400 line-through">
                {UNSCHOOL_COURSE_OFFER.priceCompareDisplay}
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold text-[#7347f4] tracking-tight">
                {UNSCHOOL_COURSE_OFFER.priceDisplay}
              </div>
              <p className="text-xs text-slate-500 mt-2">{UNSCHOOL_COURSE_OFFER.priceNote}</p>
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#b9c5fe] bg-[#f8faff] px-3 py-3">
              <span className="text-base leading-none mt-0.5">🔒</span>
              <div>
                <p className="text-xs font-bold text-[#7347f4]">Gwarancja satysfakcji – 30 dni</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                  Nie chcę żebyś kupował w ciemno. Dlatego jeśli przerobiłeś pierwsze 2 moduły,
                  wysłałeś zadania i nadal czujesz że to nie dla Ciebie – piszesz do mnie i zwracam
                  całą kwotę. Zero ryzyka z Twojej strony.
                </p>
              </div>
            </div>
            <CheckoutButton
              className="w-full mt-4"
              buttonClassName={`${btnPrimary} w-full text-base sm:text-lg disabled:opacity-50 disabled:hover:translate-y-0`}
            />
            <p className="text-xs text-slate-500 mt-4 text-center leading-relaxed">
              Bezpieczna płatność przez Stripe ({STRIPE_PAYMENT_METHODS_LABEL}). Po opłaceniu konto
              na platformie tworzy się automatycznie.
            </p>
          </div>
        </div>
      </Section>
      <Section id="faq">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
        >
          <div className={tag}>FAQ</div>
          <h2 className={`${h2} mt-4 mb-6`}>Najczęstsze pytania</h2>
        </motion.div>
        <motion.div
          className="space-y-3 max-w-3xl"
          variants={faqListVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {[
            {
              q: "Dla kogo jest ten kurs?",
              a: "Dla dorosłych  i młodzieży na poziomie B1–B2, którzy rozumieją angielski ale mają problem z mówieniem. Znasz słówka, rozumiesz filmy – ale przy rozmowie coś się zacina. To jest dokładnie ta sytuacja, na którą ten kurs odpowiada.",
            },
            {
              q: "Jak wygląda dostęp do kursu?",
              a: "Po zakupie dostajesz link do platformy online. Wszystko działa w przeglądarce – na telefonie, tablecie i komputerze. Nie musisz nic instalować.",
            },
            {
              q: "Jak długo mam dostęp?",
              a: "Dostęp jest bezterminowy. Kupujesz raz i masz na zawsze. Możesz wracać do lekcji, kiedy chcesz, we własnym tempie.",
            },
            {
              q: "Jak działa personalny feedback?",
              a: "Po każdej lekcji wysyłasz zadanie – nagranie głosowe lub odpowiedź tekstową. Odsłuchuję każde nagranie i czytam każdą odpowiedź osobiście. Komentuję, co poszło dobrze i co konkretnie poprawić. To nie są automatyczne odpowiedzi.",
            },
            {
              q: "Ile czasu dziennie muszę poświęcać?",
              a: "Kurs jest zaprojektowany na 2–3 lekcje tygodniowo, co daje około 20–30 minut dziennie w dni nauki. Łącznie to około 3 miesiące w spokojnym tempie. Możesz iść wolniej – dostęp nie wygasa.",
            },
            {
              q: "Czy kurs zastępuje indywidualne lekcje?",
              a: "To są dwa różne produkty i oba mają sens. Kurs daje Ci strukturę, narzędzia i feedback na zadania, bez ustalania godzin i w swoim tempie. W dłuższej perspektywie wychodzi też znacznie taniej niż regularne lekcje 1:1. Jeśli po kursie chcesz pracować dalej nad konkretnymi problemami – zapraszam na lekcje indywidualne. Możemy to połączyć.",
            },
            {
              q: "Jak kupić kurs?",
              a: `Kliknij przycisk „Chcę ten kurs” – przejdziesz na bezpieczną bramkę płatności Stripe (${STRIPE_PAYMENT_METHODS_LABEL}). Po opłaceniu konto na platformie tworzy się automatycznie, a hasło dostaniesz e-mailem w ciągu kilku minut.`,
            },
          ].map((item) => (
            <motion.details
              key={item.q}
              variants={faqItemVariants}
              className="group rounded-2xl border border-[#b9c5fe] bg-white overflow-hidden hover:border-[#7347f4]/40 hover:shadow-sm transition-[border-color,box-shadow]"
            >
              <summary className="cursor-pointer list-none px-4 sm:px-5 py-4 font-bold text-[#7347f4] text-sm sm:text-base flex items-center justify-between gap-2 hover:bg-[#f8faff] transition-colors duration-200 [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="text-[#3e57d6] text-lg shrink-0 transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <motion.p
                initial={false}
                className="px-4 sm:px-5 pb-4 text-sm text-slate-600 leading-relaxed"
              >
                {item.a}
              </motion.p>
            </motion.details>
          ))}
        </motion.div>
      </Section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
            Moment &quot;kiedy będę gotowy&quot;
            <br />
            nigdy nie przychodzi.
          </h2>
          <p className="text-sm sm:text-base text-white/60 mb-8 max-w-xl mx-auto leading-relaxed">
            Jedyny sposób żeby zacząć mówić – to zacząć mówić. Mam dla Ciebie system który sprawia,
            że to działa.
          </p>
          <CheckoutButton
            className="inline-flex"
            buttonClassName={`${btnPrimary} text-base sm:text-lg px-8 disabled:opacity-50 disabled:hover:translate-y-0`}
          />
        </div>
      </section>

      <Footer data={kursFooter as unknown as FooterData} />
    </div>
  );
}

function UspMentoringSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#b9c5fe] mb-4">
          To nie jest kolejny kurs, gdzie przeklikujesz sobie lekcje
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-6">
          Każde zadanie sprawdzam ja. <em className="text-[#ffbd53] not-italic">Osobiście.</em>
        </h2>
        <p className="text-sm sm:text-base text-white/65 leading-relaxed mb-8">
          Nie bot. Nie automatyczna ocena. Nagrywasz się lub piszesz odpowiedź. A ja – korepetytor z
          4-letnim doświadczeniem i filolog angielski – Ci na nie odpowiadam. Także nie jest to
          zwykły kurs, a mentoring 1:1.
        </p>
        <div className="max-w-xl mx-auto">
          <div className="rounded-2xl bg-[#7347f4]/20 border border-[#7347f4]/30 px-6 py-5 text-center">
            <p className="text-base sm:text-lg font-bold text-white leading-snug">
              597&nbsp;zł ÷ 35 zadań z feedbackiem to{" "}
              <span className="text-[#ffbd53]">~17&nbsp;zł</span> za sprawdzone zadanie przez
              doświadczonego filologa
            </p>
          </div>
          <p className="text-xs sm:text-sm text-white/50 mt-3 text-center">
            Dla porównania – godzina korepetycji 1:1 kosztuje 80–150 zł.
          </p>
        </div>
      </div>
    </section>
  );
}
