"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { content, type FooterData } from "@/data/content";
import { Footer } from "@/src/features/landing";

const FORMSPREE_URL = "https://formspree.io/f/TWOJ_KOD";

const PRICING_FEATURES = [
  "34 lekcje wideo + pełne materiały pisemne",
  "Zadania głosowe – nagrywasz się w platformie",
  "Zadania tekstowe po każdej lekcji",
  "Personalny feedback ode mnie na każde zadanie",
  "Dostęp bezterminowy – bez presji czasowej",
  "Działa na telefonie, tablecie i komputerze",
] as const;

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
const h2 = "text-[#7347f4] font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight";
const sub = "text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl";
const card = "bg-white border border-[#b9c5fe] rounded-2xl shadow-sm p-4 sm:p-5";
const panel =
  "bg-[#f8faff] rounded-2xl sm:rounded-3xl shadow-[0_30px_50px_rgba(0,0,0,0.05)] border border-white p-6 sm:p-8 md:p-10";
const btnPrimary =
  "inline-flex items-center justify-center rounded-4xl bg-[#ffbd53] border border-[#ffa515] text-white px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold shadow-md hover:-translate-y-0.5 transition-transform cursor-pointer";
const btnSecondary =
  "inline-flex items-center justify-center rounded-4xl bg-white border border-[#ffa515] text-[#ffa515] px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold shadow-sm hover:-translate-y-0.5 transition-transform";
const input =
  "w-full px-3.5 py-2.5 border border-[#b9c5fe] rounded-xl text-sm text-slate-900 outline-none transition-colors focus:border-[#7347f4] focus:ring-2 focus:ring-[#cfd8ff]";

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

export default function Kurs2Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const openModal = () => {
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setIsSuccess(true);
        form.reset();
      } else {
        setSubmitError("Coś poszło nie tak – spróbuj jeszcze raz");
      }
    } catch {
      setSubmitError("Błąd połączenia – spróbuj jeszcze raz");
    } finally {
      setIsSubmitting(false);
    }
  }

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
            <button
              type="button"
              onClick={openModal}
              className="ml-2 rounded-4xl bg-[#ffbd53] border border-[#ffa515] text-white px-4 py-2 text-sm font-bold shadow-md hover:-translate-y-0.5 transition-transform"
            >
              Kup kurs →
            </button>
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
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openModal();
                }}
                className="mt-2 rounded-4xl bg-[#ffbd53] border border-[#ffa515] text-white px-4 py-3 text-sm font-bold shadow-md"
              >
                Kup kurs →
              </button>
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
              Rozumiesz.
              <br />
              Ale nadal
              <br />
              nie <em className="text-[#7347f4] not-italic font-extrabold">mówisz.</em>
            </h1>
            <p className={sub}>
              Znasz słówka. Rozumiesz filmy. A mimo to przy rozmowie coś się zacina. Ten kurs naprawia
              dokładnie to – bez podręcznika, bez teorii na zapas, z feedbackiem ode mnie na każde
              zadanie.
            </p>
            <div className="flex flex-wrap gap-3">
              <button type="button" className={btnPrimary} onClick={openModal}>
                Chcę w końcu mówić →
              </button>
              <Link href="#program" className={btnSecondary}>
                Zobacz program
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 sm:gap-10 pt-2">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#7347f4]">34</div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">lekcje wideo</div>
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
          </div>

          <div className="relative rounded-3xl border-2 border-[#7347f4] bg-gradient-to-br from-[#cfd8ff]/80 via-white to-[#f8faff] p-6 sm:p-8 shadow-[0_20px_50px_rgba(115,71,244,0.12)] ring-1 ring-[#7347f4]/20">
            <span className="absolute -top-3 right-6 rounded-full bg-[#ffbd53] border border-[#ffa515] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              🔥 Promocja
            </span>
            <div className={tag}>Co dostajesz?</div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#7347f4] leading-tight">
              Unschool Your English
            </h2>
            <p className="mt-1 text-sm sm:text-base font-semibold text-[#3e57d6]">
              Przestań się uczyć, zacznij mówić.
            </p>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Z feedbackiem na każde zadanie – głosowe i tekstowe.
            </p>
            <ul className="mt-5 space-y-2.5 text-left">
              {PRICING_FEATURES.map((feature) => (
                <li key={feature} className="flex gap-2.5 items-start text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7347f4] text-[10px] font-bold text-white">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl border border-[#b9c5fe] bg-white/90 px-4 py-4 text-center">
              <div className="text-sm text-slate-400 line-through">697 zł</div>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#7347f4] tracking-tight">
                  597 zł
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500 font-medium">
                jednorazowo · dostęp bezterminowy · bez ukrytych opłat
              </p>
            </div>
            <button type="button" className={`${btnPrimary} w-full mt-5 text-base`} onClick={openModal}>
              Chcę ten kurs →
            </button>
          </div>
        </div>
      </main>

      <Section id="dla-kogo" className="bg-white/50">
        <div className={tag}>Brzmi znajomo?</div>
        <h2 className={`${h2} mt-4 mb-4`}>
          Uczysz się latami.
          <br />
          A mimo to nie mówisz.
        </h2>
        <p className={`${sub} mb-8 sm:mb-10`}>
          Coś tu nie gra – i pewnie to czujesz. Znasz słówka, rozumiesz dużo, a mimo to przy rozmowie
          się blokujesz. To nie przypadek.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: "😶",
              title: "Wiesz co powiedzieć – po polsku",
              text: "Masz myśl w głowie. Wiesz o czym chcesz mówić. Ale gdy przychodzi moment – cisza. Mózg się zawiesza. I nic.",
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

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#b9c5fe] mb-4">
            Prawda której nikt Ci nie powie
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-6">
            Szkoła nie uczyła Cię mówić.
            <br />
            <em className="text-[#7347f4] not-italic">I to był plan.</em>
          </h2>
          <p className="text-sm sm:text-base text-white/65 leading-relaxed mb-4">
            System edukacji jest zoptymalizowany pod testy i oceny – nie pod komunikację. Nauczyciel
            może sprawdzić czy wiesz jak zbudować zdanie w Past Perfect. Nie może sprawdzić czy potrafisz
            się dogadać na lotnisku.
          </p>
          <p className="text-sm sm:text-base text-white/65 leading-relaxed mb-10">
            Więc uczą tego co się da ocenić. A Ty po 12 latach nauki stoisz i nie możesz zamówić kawy w
            Londynie. Korepetytorzy z certyfikatami robią to samo – tyle że drożej.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            <div className="rounded-2xl bg-white/10 p-5 sm:p-6">
              <div className="text-xl mb-2">❌</div>
              <div className="font-bold text-sm mb-2">Co robiła szkoła</div>
              <p className="text-sm text-white/50 leading-relaxed">
                Ćwiczenia z luki. Gramatyka dla gramatyki. Testy. Oceny. Zero prawdziwego mówienia.
              </p>
            </div>
            <div className="rounded-2xl bg-[#7347f4]/20 border border-[#7347f4]/30 p-5 sm:p-6">
              <div className="text-xl mb-2">✅</div>
              <div className="font-bold text-sm mb-2">Co robi ten kurs</div>
              <p className="text-sm text-white/70 leading-relaxed">
                Mówisz od pierwszej lekcji. Uczysz się przez prawdziwy content. Dostajesz feedback od
                człowieka.
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
          uczysz się przez to co i tak robisz na co dzień.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: "🎬",
              title: "Wideo lekcje",
              text: "Każdy temat tłumaczę na żywo – bez czytania z kartki, bez nudnego lektora. Mówię do Ciebie tak jak na normalnej lekcji.",
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
              icon: "💬",
              title: "Personalny feedback",
              text: "Odsłuchuję każde nagranie i czytam każdą odpowiedź. Komentuję co poszło dobrze i co poprawić. Nie dostajesz automatycznych odpowiedzi.",
            },
            {
              icon: "♾️",
              title: "Dostęp bezterminowy",
              text: "Kupujesz raz, masz na zawsze. Możesz wracać do lekcji kiedy chcesz. Spokojne tempo – 2-3 lekcje tygodniowo – bez presji.",
            },
            {
              icon: "📱",
              title: "Działa na telefonie",
              text: "Platforma działa na każdym urządzeniu. Możesz robić lekcje w przerwie w pracy albo wieczorem na kanapie.",
            },
          ].map((item) => (
            <div key={item.title} className={`${card} flex gap-4`}>
              <div className="text-2xl shrink-0">{item.icon}</div>
              <div>
                <div className="font-bold text-[#7347f4] mb-1 text-sm sm:text-base">{item.title}</div>
                <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="program" className="bg-[#cfd8ff]/20">
        <div className={tag}>Program kursu</div>
        <h2 className={`${h2} mt-4 mb-4`}>
          7 modułów,
          <br />
          34 lekcje.
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
                "Szkoła Cię nie przygotowała – i to nie Twoja wina",
                "Dlaczego Duolingo nie wystarczy",
                "Jak ułożyć naukę – system który działa",
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
              sub: "Wszystko razem w praktyce",
              lessons: ["7-Day Speaking Challenge – finał kursu", "Twoje nagranie – przed i po"],
            },
          ].map((mod, index) => {
            const isFeatured = index === 6;
            return (
              <div
                key={mod.num}
                className={
                  isFeatured
                    ? "sm:col-span-2 lg:col-span-3 bg-white border-2 border-[#7347f4] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_16px_40px_rgba(115,71,244,0.12)] ring-2 ring-[#7347f4]/15"
                    : "bg-white border border-[#7347f4]/30 rounded-2xl p-4 sm:p-5 shadow-sm h-full"
                }
              >
                {isFeatured && (
                  <span className="inline-block mb-3 rounded-full bg-[#ffbd53] border border-[#ffa515] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Finał kursu
                  </span>
                )}
                <div
                  className="text-[10px] font-bold uppercase tracking-wider mb-1 text-[#3e57d6]"
                >
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
                <div className={`grid gap-2 ${isFeatured ? "sm:grid-cols-2" : ""}`}>
                  {mod.lessons.map((lesson) => (
                    <div
                      key={lesson}
                      className="text-xs sm:text-sm text-slate-700 py-1.5 px-2 rounded-lg bg-[#f8faff] border border-[#b9c5fe]/40"
                    >
                      {lesson}
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
          Zero skomplikowanych systemów. Każda lekcja to wideo, materiał i zadanie do wykonania – głosowe
          albo tekstowe. Wysyłasz, ja sprawdzam, daję feedback. I tak 34 razy.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              num: "01",
              title: "Oglądasz wideo",
              text: "Krótkie, konkretne nagranie gdzie tłumaczę temat – tak jak na normalnej lekcji.",
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
            <div className={tag}>Czemu warto mnie posłuchać</div>
            <h2 className={`${h2} mt-4 mb-4`}>
              Mam filologię.
              <br />I wiem, że to za mało.
            </h2>
            <p className={`${sub} mb-5`}>
              Skończyłem filologię angielską. Mam papiery. I właśnie dlatego wiem, że same papiery nie
              robią z nikogo dobrego nauczyciela – bo widziałem z bliska jak uczą ci z certyfikatami.
            </p>
            <div className="space-y-3 flex-1">
              {[
                {
                  icon: "✈️",
                  title: "Sam nauczyłem się przez życie, nie przez szkołę",
                  text: "Wyjazdy za granicę, Erasmus, oglądanie rzeczy po angielsku – nie lekcje. Blokada przy mówieniu? Miałem ją. Wiem jak to naprawić.",
                },
                {
                  icon: "👁️",
                  title: "Od liceum obserwowałem co działa, a co nie",
                  text: "Chodziłem do korepetytorów i wyłapywałem co ma sens, a co jest tylko marnowaniem czasu. Filologia dała mi narzędzia – i potwierdziła moje podejrzenia.",
                },
                {
                  icon: "🎯",
                  title: "Uczę od 2022 roku i nikt nie odszedł",
                  text: "Pracowałem z dziesiątkami uczniów na różnych poziomach. Maturę pisałem w 2022 – pamiętam jak to jest być po drugiej stronie.",
                },
              ].map((fact) => (
                <div key={fact.title} className={`${card} flex gap-3 py-3`}>
                  <span className="text-xl shrink-0">{fact.icon}</span>
                  <div>
                    <div className="font-bold text-[#7347f4] text-sm sm:text-base mb-1">{fact.title}</div>
                    <p className="text-sm text-slate-600 leading-relaxed">{fact.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border-2 border-[#7347f4]/30 bg-white shadow-[0_16px_40px_rgba(115,71,244,0.08)] flex flex-col overflow-hidden">
            <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3 border-b border-[#b9c5fe]/60 bg-[#f8faff]">
              <div className={tag}>Moje podejście vs typowy korepetytor</div>
            </div>

            <div className="grid grid-cols-2 text-xs sm:text-sm font-bold border-b border-[#b9c5fe]/60">
              <div className="px-3 sm:px-4 py-2.5 text-slate-500 bg-slate-50 border-r border-[#b9c5fe]/60">
                😴 Typowy korepetytor
              </div>
              <div className="px-3 sm:px-4 py-2.5 bg-[#7347f4] text-white border-r-0">
                <span className="block text-[10px] uppercase tracking-wider text-[#ffbd53] font-bold mb-0.5">
                  Lepszy wybór
                </span>
                <span className="block">✅ Ten kurs</span>
              </div>
            </div>

            {[
              ["Certyfikat = dowód że umie uczyć", "Filologia + własna droga przez mówienie"],
              ["Nauka z podręcznika", "Nauka przez prawdziwy content"],
              ["Ćwiczenia z luki i testy", "Mówienie od pierwszego dnia"],
              ["Uczysz się bo musisz", "Uczysz się bo chcesz i widzisz sens"],
            ].map(([bad, good]) => (
              <div
                key={bad}
                className="grid grid-cols-2 text-xs sm:text-sm border-b border-[#b9c5fe]/40 last:border-b-0"
              >
                <div className="flex gap-2 items-center px-3 sm:px-4 py-2.5 text-slate-500 bg-slate-50/80 border-r border-[#b9c5fe]/40">
                  <span className="shrink-0 text-slate-300 font-bold" aria-hidden>
                    ✕
                  </span>
                  <span className="leading-snug">{bad}</span>
                </div>
                <div className="flex gap-2 items-center px-3 sm:px-4 py-2.5 font-semibold text-[#243cb5] bg-[#cfd8ff]/50 shadow-[inset_3px_0_0_0_#7347f4]">
                  <span className="shrink-0 text-[#7347f4] font-bold" aria-hidden>
                    ✓
                  </span>
                  <span className="leading-snug">{good}</span>
                </div>
              </div>
            ))}

            <div className="mt-auto px-4 sm:px-5 py-4 bg-[#cfd8ff]/40 border-t border-[#7347f4]/20">
              <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed mb-1.5">
                &quot;Większość korepetytorów uczy tak samo jak szkoła – tylko drożej. Dlatego efekty są
                takie same.&quot;
              </p>
              <p className="text-sm font-bold text-[#7347f4]">– Wiktor Szyszkowski</p>
            </div>
          </div>
        </motion.div>
      </Section>

      <Section id="opinie">
        <div className={tag}>Dowód że to działa</div>
        <h2 className={`${h2} mt-4 mb-4`}>
          Uczniowie mówią
          <br />
          sami za siebie.
        </h2>
        <p className={`${sub} mb-8 sm:mb-10`}>
          Nie sprzedaję Ci snu. Sprzedaję Ci metodę, która działa – i mam na to dowody.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              text: "Gorąco polecam zajęcia z Wiktorem. Zaczynałem tak naprawdę z punktu zera, a dzięki Wiktorowi udało mi się zdać maturę pisemną na poziomie 60%! Cierpliwość oraz zaangażowanie jest niesamowite. Nigdy nie miałem sytuacji, że nie był w stanie mi czegoś wytłumaczyć lub pomóc.",
              author: "Marcel",
              meta: "Zdana matura z punktu zera",
            },
            {
              text: "Od pół roku uczestniczę w zajęciach Wiktora. Oceny w szkole są 2 razy lepsze, mega poprawa w rozumieniu i mówieniu po angielsku. Tok nauczania według potrzeb każdego ucznia. Bardzo polecam.",
              author: "Maks",
              meta: "2x lepsze oceny",
            },
            {
              text: "Serdecznie polecam! Zajęcia prowadzone są zawsze w bardzo ciekawy sposób, a atmosfera jest luźna i motywująca. Dzięki zaangażowaniu Wiktora szybko zobaczyłam postępy. Idealny wybór zarówno dla początkujących jak i bardziej zaawansowanych.",
              author: "Martyna",
              meta: "Rozwój konwersacji",
            },
            {
              text: "Bardzo zadowolona chociażby z cierpliwości i przemiłej atmosfery. Na początku w ogóle bałam się odezwać po angielsku – teraz faktycznie widzę progres. Jeśli ktoś się zastanawia – gorąco polecam.",
              author: "Wiktoria",
              meta: "Przełamanie bariery językowej",
            },
          ].map((review) => (
            <div key={review.author} className={panel}>
              <div className="text-[#ffbd53] text-sm mb-3 tracking-wider">★★★★★</div>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">{review.text}</p>
              <div className="font-bold text-[#7347f4]">{review.author}</div>
              <div className="text-xs text-slate-500 mt-1">{review.meta}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="cennik">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className={tag}>Inwestycja</div>
          <h2 className={`${h2} mt-4 mb-4`}>Masz dwie opcje.</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
          <div className="rounded-2xl sm:rounded-3xl border-2 border-dashed border-[#b9c5fe] bg-white p-6 sm:p-8 flex flex-col justify-center text-left">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Opcja 1</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-700 mb-4">Zostajesz przy starym systemie</h3>
            <p className={`${sub} !max-w-none mb-5`}>
              Możesz dalej uczyć się metodami które nie działają. Albo możesz spróbować czegoś innego.
            </p>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li className="flex gap-2"><span className="text-slate-300">✕</span> Ta sama blokada przy mówieniu</li>
              <li className="flex gap-2"><span className="text-slate-300">✕</span> Kolejna aplikacja albo podręcznik</li>
              <li className="flex gap-2"><span className="text-slate-300">✕</span> Zero feedbacku od człowieka</li>
              <li className="flex gap-2"><span className="text-slate-300">✕</span> „Kiedyś” zacznę mówić</li>
            </ul>
          </div>
          <div className="relative rounded-3xl border-2 border-[#7347f4] bg-gradient-to-br from-[#cfd8ff]/90 via-white to-[#f8faff] p-6 sm:p-10 shadow-[0_24px_60px_rgba(115,71,244,0.18)] ring-2 ring-[#7347f4]/15">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#ffbd53] border border-[#ffa515] px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm whitespace-nowrap">
              🔥 Promocja
            </span>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#3e57d6] mb-2 text-center">
              Pełny dostęp · bezterminowy
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#7347f4] text-center mb-1">Unschool Your English</h3>
            <p className="text-sm text-[#3e57d6] font-semibold text-center mb-1">Przestań się uczyć, zacznij mówić.</p>
            <p className="text-sm text-slate-600 text-center mb-6">
              Z feedbackiem na każde zadanie – głosowe i tekstowe.
            </p>
            <ul className="text-left space-y-2.5 mb-6 text-sm text-slate-700">
              {PRICING_FEATURES.map((li) => (
                <li key={li} className="flex gap-2 items-start">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7347f4] text-[10px] font-bold text-white">✓</span>
                  {li}
                </li>
              ))}
            </ul>
            <div className="rounded-2xl border border-[#b9c5fe] bg-white/90 px-4 py-4 text-center mb-6">
              <div className="text-base text-slate-400 line-through">697 zł</div>
              <div className="text-4xl sm:text-5xl font-extrabold text-[#7347f4] tracking-tight">
                <sup className="text-xl align-super">zł</sup>597
              </div>
              <p className="text-xs text-slate-500 mt-2">cena brutto · jednorazowo · bez ukrytych opłat</p>
            </div>
            <button type="button" className={`${btnPrimary} w-full text-base sm:text-lg`} onClick={openModal}>
              Chcę w końcu mówić →
            </button>
            <p className="text-xs text-slate-500 mt-4 text-center leading-relaxed">
              Wypełniasz formularz, odezwę się w ciągu 24h z linkiem do płatności. Po opłaceniu dostajesz dostęp.
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
              a: "Dla dorosłych na poziomie B1–B2, którzy rozumieją angielski ale mają problem z mówieniem. Znasz słówka, rozumiesz filmy – ale przy rozmowie coś się zacina. To jest dokładnie ta sytuacja, na którą ten kurs odpowiada.",
            },
            {
              q: "Jak wygląda dostęp do kursu?",
              a: "Po zakupie dostajesz link do platformy online. Wszystko działa w przeglądarce – na telefonie, tablecie i komputerze. Nie musisz nic instalować.",
            },
            {
              q: "Jak długo mam dostęp?",
              a: "Dostęp jest bezterminowy. Kupujesz raz i masz na zawsze. Możesz wracać do lekcji kiedy chcesz, we własnym tempie.",
            },
            {
              q: "Jak działa personalny feedback?",
              a: "Po każdej lekcji wysyłasz zadanie – nagranie głosowe lub odpowiedź tekstową. Odsłuchuję każde nagranie i czytam każdą odpowiedź osobiście. Komentuję co poszło dobrze i co konkretnie poprawić. To nie są automatyczne odpowiedzi.",
            },
            {
              q: "Ile czasu dziennie muszę poświęcać?",
              a: "Kurs jest zaprojektowany na 2–3 lekcje tygodniowo, co daje około 20–30 minut dziennie w dni nauki. Łącznie to około 3 miesiące w spokojnym tempie. Możesz iść wolniej – dostęp nie wygasa.",
            },
            {
              q: "Czy kurs zastępuje indywidualne lekcje?",
              a: "To są dwa różne produkty. Kurs daje Ci strukturę, materiał i feedback na zadania. Indywidualne lekcje 1:1 to bezpośrednia rozmowa i praca nad konkretnymi problemami. Jeśli chcesz oboje – napisz do mnie, możemy to połączyć.",
            },
            {
              q: "Jak kupić kurs?",
              a: 'Kliknij dowolny przycisk "Chcę w końcu mówić" – pojawi się formularz. Wypełniasz dane do faktury, wysyłasz. Odezwę się w ciągu 24h z linkiem do płatności przez Useme. Dopiero po opłaceniu dostajesz dostęp.',
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
            Jedyny sposób żeby zacząć mówić – to zacząć mówić. Mam dla Ciebie system który sprawia, że to
            działa.
          </p>
          <button type="button" className={`${btnPrimary} text-base sm:text-lg px-8`} onClick={openModal}>
            Zaczynam teraz →
          </button>
        </div>
      </section>

      <Footer data={kursFooter as unknown as FooterData} />

      <div
        className={`fixed inset-0 z-[100] items-center justify-center p-4 ${isModalOpen ? "flex" : "hidden"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
      >
        <button
          type="button"
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={closeModal}
          aria-label="Zamknij"
        />
        <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-[#b9c5fe] p-6 sm:p-8">
          <button
            type="button"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:bg-[#cfd8ff]/50 transition-colors"
            onClick={closeModal}
            aria-label="Zamknij"
          >
            ✕
          </button>

          {!isSuccess ? (
            <>
              <div className="mb-6 pr-6">
                <div className={tag}>Zamówienie kursu</div>
                <h3 id="order-modal-title" className={`${h2} mt-3 mb-4 text-xl sm:text-2xl`}>
                  Unschool Your English
                </h3>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="text-sm text-slate-400 line-through">697 zł</div>
                    <div className="text-2xl font-extrabold text-[#7347f4]">597 zł</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ffbd53] text-white px-2 py-0.5 rounded-full">
                      PROMOCJA
                    </span>
                    <p className="text-xs text-slate-500 mt-1">jednorazowo · dostęp bezterminowy</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="produkt" value="Unschool Your English – 597 zł" />

                <div>
                  <label className="block text-xs font-bold text-[#7347f4] mb-1.5" htmlFor="imie_nazwisko">
                    Imię i nazwisko *
                  </label>
                  <input
                    id="imie_nazwisko"
                    type="text"
                    name="imie_nazwisko"
                    required
                    placeholder="Jan Kowalski"
                    className={input}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7347f4] mb-1.5" htmlFor="email">
                    Adres e-mail *
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="jan@email.com"
                    className={input}
                  />
                </div>

                <div className="flex gap-3 rounded-xl bg-[#cfd8ff]/40 border border-[#b9c5fe] p-3">
                  <span className="text-lg shrink-0">🔒</span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">Dlaczego pytam o adres?</strong>
                    <br />
                    Dane adresowe są potrzebne wyłącznie do wystawienia faktury przez Useme. Nie będę ich
                    używać do żadnych innych celów.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7347f4] mb-1.5" htmlFor="ulica">
                    Ulica i numer *
                  </label>
                  <input
                    id="ulica"
                    type="text"
                    name="ulica"
                    required
                    placeholder="ul. Kwiatowa 5/10"
                    className={input}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#7347f4] mb-1.5" htmlFor="kod_pocztowy">
                      Kod pocztowy *
                    </label>
                    <input
                      id="kod_pocztowy"
                      type="text"
                      name="kod_pocztowy"
                      required
                      placeholder="00-000"
                      className={input}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#7347f4] mb-1.5" htmlFor="miasto">
                      Miasto *
                    </label>
                    <input
                      id="miasto"
                      type="text"
                      name="miasto"
                      required
                      placeholder="Warszawa"
                      className={input}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7347f4] mb-1.5" htmlFor="nip">
                    NIP{" "}
                    <span className="font-normal text-slate-400">
                      (opcjonalnie – tylko jeśli chcesz fakturę na firmę)
                    </span>
                  </label>
                  <input
                    id="nip"
                    type="text"
                    name="nip"
                    placeholder="000-000-00-00"
                    className={input}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7347f4] mb-1.5" htmlFor="uwagi">
                    Dodatkowe uwagi <span className="font-normal text-slate-400">(opcjonalnie)</span>
                  </label>
                  <textarea
                    id="uwagi"
                    name="uwagi"
                    rows={2}
                    placeholder="Coś do dodania..."
                    className={`${input} resize-y min-h-[4rem]`}
                  />
                </div>

                <button
                  type="submit"
                  className={`${btnPrimary} w-full disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Wysyłam..." : submitError ?? "Wyślij zamówienie →"}
                </button>

                <p className="text-xs text-slate-500 text-center leading-relaxed">
                  Po wysłaniu odezwę się w ciągu 24h z linkiem do płatności.
                  <br />
                  Dane służą wyłącznie do faktury – nic więcej.
                </p>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✅</div>
              <h3 className={`${h2} mb-3`}>Gotowe!</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dostałem Twoje dane – odezwę się w ciągu 24h z linkiem do płatności.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
