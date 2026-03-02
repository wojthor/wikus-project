"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  Target,
  TrendingDown,
  Clock,
  Star,
  Quote,
  Shield,
  ChevronDown,
  Mail,
PhoneCall,
  Instagram,
} from "lucide-react";
import { content } from "../data/content";
import { Story } from "@/components/Story";
import { CoursesGrid } from "@/components/CoursesGrid";

const PAIN_ICONS = [AlertCircle, Target, TrendingDown, Clock];

const NAV_LINKS = [
  { label: "Fakty", href: "#problem" },
  { label: "O mnie", href: "#o-mnie" },
  { label: "Opinie", href: "#opinie" },
  { label: "Oferta", href: "#oferta" },
];

const LABEL_COLOR = "text-sky-600 font-bold";

function Haslo({ children }: { children: string }) {
  return <span className="text-sky-600 font-bold">[{children}]</span>;
}

function LabeledText({
  text,
  className = "",
  labelClassName = LABEL_COLOR,
}: {
  text: string;
  className?: string;
  labelClassName?: string;
}) {
  const idx = text.indexOf(": ");
  if (idx === -1) return <span className={className}>{text}</span>;
  const label = text.slice(0, idx);
  const rest = text.slice(idx + 2);
  return (
    <span className={className}>
      <span className={labelClassName}>[{label}]</span>{" "}
      {rest}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} z 5 gwiazdek`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? "fill-blue-500 text-blue-500" : "text-slate-300"}`}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const c = content;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">{/* ─── NAV (Apple style: sticky, blur, minimal) ───────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-end px-4 py-4 sm:px-6 md:px-8 lg:px-12">
          
          <ul className="flex items-center gap-1 sm:gap-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:px-4"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ─── HERO (responsywny: mobile scroll, desktop pełny ekran) ────────── */}
      <section className="relative w-full min-h-[70vh] overflow-hidden">
        {/* Delikatny gradient w tle nawiązujący do stylu Apple */}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-stone-100 to-stone-50" />

        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-10 md:grid-cols-2 md:gap-16 md:py-16 lg:py-20">
          {/* LEWA KOLUMNA: Teksty i Przyciski */}
          <div className="z-10 space-y-6 text-left">
            {/* Hook jako mała pastylka */}
            <div className="inline-block rounded-full bg-sky-100 px-4 py-1 text-xs font-semibold tracking-wide text-sky-700 sm:text-sm">
              90% osób po kursach nadal boi się odezwać
            </div>

            {/* Pytanie + korzyść */}
            <h1 className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Chcesz swobodnie mówić po angielsku{" "}
              <span className="block text-sky-600">bez wkuwania regułek?</span>
            </h1>

            {/* Obietnica */}
            <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Pokażę Ci, jak przełamać barierę językową i zacząć mówić pewnie w kilka miesięcy, korzystając z prostej, sprawdzonej metody.
            </p>

            {/* Przyciski (CTA) */}
            <div className="flex flex-row flex-wrap items-center gap-3 pt-2">
              <Link
                href="#oferta"
                className="rounded-xl bg-blue-600 px-6 py-3 text-center text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-blue-700 sm:text-base"
              >
                Zobacz ofertę
              </Link>
              <Link
                href="#o-mnie"
                className="rounded-xl border border-stone-300 bg-white px-6 py-3 text-center text-sm font-bold text-slate-700 transition hover:border-stone-400 sm:text-base"
              >
                O mnie
              </Link>
            </div>
          </div>

          {/* PRAWA KOLUMNA: Zdjęcie */}
          <div className="relative w-full h-72 overflow-hidden rounded-3xl bg-slate-200 shadow-2xl sm:h-80 md:h-96 lg:h-[420px]">
            <Image
              src="/unnamed.jpeg"
              alt="Wiktor - Nauczyciel Angielskiego"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* ─── PROBLEM ────────────────────────────────────────────────────── */}
      <section
        id="problem"
        className="relative w-full bg-sky-50 px-4 py-20 sm:px-6 sm:py-24 md:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl lg:aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="mb-5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {c.problemAgitation.headline}
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-slate-600">
                <LabeledText text={c.problemAgitation.subheadline} />
              </p>
              <p className="max-w-xl text-slate-600 leading-relaxed">
                <LabeledText text={c.problemAgitation.problemIntro} />
              </p>
            </div>
            
          </div>

          <ul className="mt-16 grid gap-4 sm:grid-cols-2 sm:gap-5">
            {c.problemAgitation.painPoints.map((point, i) => {
              const Icon = PAIN_ICONS[i % PAIN_ICONS.length];
              return (
                <li
                  key={i}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-100 p-5 sm:p-6"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-slate-600 sm:text-base leading-relaxed">{point}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-14 rounded-3xl border border-indigo-200 bg-indigo-50 p-8 sm:p-10">
            <h3 className="mb-3 text-xl font-semibold sm:text-2xl">
              <Haslo>{c.problemAgitation.conspiracyHeadline}</Haslo>
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              {c.problemAgitation.conspiracyText}
            </p>
          </div>
        </div>
      </section>

      
      <div>
      <Story content={c.storyAndAuthority} />
      </div>

      {/* ─── OPINIE ──────────────────────────────────────────────────────── */}
      <section
        id="opinie"
        className="relative w-full bg-sky-50 px-4 py-20 sm:px-6 sm:py-24 md:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            <Haslo>{c.testimonials.sectionTitle}</Haslo>
          </h2>
          <p className="mb-12 text-lg text-slate-600">
            <LabeledText text={c.testimonials.subheadline} />
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {c.testimonials.items.map((item, i) => (
              <article
                key={i}
                className="flex flex-col rounded-3xl border border-slate-200 bg-slate-100 p-6 sm:p-8"
              >
                <Quote className="mb-4 h-8 w-8 text-indigo-400" />
                <p className="mb-5 flex-1 text-slate-600 leading-relaxed">
                  „{item.quote}”
                </p>
                <StarRating rating={item.rating} />
                <p className="mt-4 font-semibold text-slate-900">{item.author}</p>
                <p className="text-sm text-indigo-600">{item.result}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OFERTA (Korepetycje + Kursy w stylu Gumroad) ─────────────────── */}
      <section
        id="oferta"
        className="relative w-full bg-sky-50 px-4 py-20 sm:px-6 sm:py-24 md:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            <Haslo>Oferta</Haslo> – co dokładnie dostajesz
          </h2>

          {/* Korepetycje – krótki opis + umówienie wizyty */}
          <div className="mb-14 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <span className="mb-2 inline-block">
              <Haslo>{c.offerDetails.tutoring.label}</Haslo>
            </span>
            <h3 className="mb-3 text-xl font-semibold text-slate-900">
              {c.offerDetails.tutoring.headline}
            </h3>
            <p className="mb-6 max-w-2xl text-slate-600 leading-relaxed">
              {c.offerDetails.tutoring.description}
            </p>
            <a
              href={c.offerDetails.tutoring.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-medium text-white transition hover:bg-blue-700"
            >
              {c.offerDetails.tutoring.ctaLabel}
            </a>
          </div>

          {/* Kursy – prostokąty w stylu Gumroad z przyciskiem Kup przez + modal ze szczegółami */}
          <h3 className="mb-6 text-lg font-semibold text-slate-900">
            <Haslo>Kursy</Haslo>
          </h3>
          <CoursesGrid courses={[...c.offerDetails.courses]} />

          <div className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-8">
            <h3 className="mb-2 text-lg font-semibold">
              <Haslo>{c.offerDetails.valueBuildUpHeadline}</Haslo>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {c.offerDetails.valueBuildUpText}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-start sm:gap-8 sm:p-8">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
              <Shield className="h-6 w-6" />
            </span>
            <div>
              <h4 className="mb-2 text-lg font-semibold text-slate-900">
                <Haslo>{c.pricingAndGuarantee.guaranteeHeadline}</Haslo>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {c.pricingAndGuarantee.guaranteeText}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <Clock className="h-6 w-6" />
            </span>
            <div>
              <h4 className="mb-1 text-lg font-semibold text-slate-900">
                <Haslo>{c.pricingAndGuarantee.urgencyHeadline}</Haslo>
              </h4>
              <p className="text-slate-600">{c.pricingAndGuarantee.urgencyText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ───────────────────────────────────────────────────── */}
      <section
        id="final-cta"
        className="relative w-full px-4 py-20 sm:px-6 sm:py-24 md:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-10 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            <LabeledText text={c.finalCta.emotionalCloseHeadline} className="text-inherit" />
          </h2>
          <div className="mb-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white/60 p-6 text-left">
              <p className="text-slate-500">{c.finalCta.option1}</p>
            </div>
            <div className="rounded-3xl border-2 border-blue-300 bg-blue-50 p-6 text-left">
              <p className="font-medium text-blue-600">{c.finalCta.option2}</p>
            </div>
          </div>
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            <Haslo>{c.finalCta.afterPurchaseHeadline}</Haslo>
          </h3>
          <ul className="mb-12 space-y-2 text-slate-600">
            {c.finalCta.afterPurchaseSteps.map((step, i) => (
              <li key={i} className="flex items-center justify-center gap-2">
                <span className="text-blue-600">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ul>
          <p className="mb-4 text-lg font-semibold text-slate-900">
            <LabeledText text={c.finalCta.finalCtaHeadline} className="text-inherit" />
          </p>
          <p className="mb-10 text-slate-600">{c.finalCta.finalCtaText}</p>
          <a
            href={c.finalCta.finalButtonAnchor}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-10 py-4 text-lg font-medium text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            {c.finalCta.finalButtonLabel}
            <ChevronDown className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-sky-50 px-4 py-10 text-slate-700 sm:px-6 sm:py-12 md:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-base font-semibold text-slate-900">{c.site.name}</p>
            <p className="mt-1 max-w-xs text-sm text-slate-500">{c.site.tagline}</p>
          </div>
          <nav className="text-base">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Nawigacja
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-600 transition hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
          <div className="space-y-4 text-base">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Kontakt
              </p>
              <a
                href="mailto:kontakt@example.com"
                className="flex items-center gap-2 text-slate-700 transition hover:text-slate-900"
              >
                <Mail className="h-4 w-4 shrink-0" />
                kontakt@example.com
              </a>
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <PhoneCall className="h-4 w-4 shrink-0" />
                +48 604 200 200
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Social
              </p>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-200 bg-white text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-900"
                  aria-label="Facebook"
                >
                  <span className="text-sm font-semibold">f</span>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-200 bg-white text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-900"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-6 flex max-w-6xl justify-end">
          <p className="text-sm text-slate-500">
            Powered by{" "}
            <a
              href="https://aniszewski-code.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-700 underline decoration-slate-400 underline-offset-4 transition hover:text-slate-900 hover:decoration-slate-600"
            >
              Wojciech Aniszewski
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
