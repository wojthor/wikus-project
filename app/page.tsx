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
} from "lucide-react";
import { content } from "../data/content";

const PAIN_ICONS = [AlertCircle, Target, TrendingDown, Clock];

const NAV_LINKS = [
  { label: "Fakty", href: "#problem" },
  { label: "O mnie", href: "#o-mnie" },
  { label: "Opinie", href: "#opinie" },
  { label: "Oferta", href: "#oferta" },
];

const LABEL_COLOR = "text-red-600 font-bold";

function Haslo({ children }: { children: string }) {
  return <span className="text-red-600 font-bold">[{children}]</span>;
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

      {/* ─── HERO (pełny ekran, bez przewijania + strzałka w dół) ───────────── */}
      <section
        id="hero"
        className="relative flex h-[calc(100dvh-3.5rem)] min-h-0 w-full flex-col overflow-hidden border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6 sm:py-6 md:px-8 lg:px-12"
      >
        <div className="mx-auto flex min-h-0 max-w-6xl flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
          
          <div className="flex min-h-0 flex-1 flex-col justify-center lg:overflow-auto lg:py-2">
            <p className="mb-1">
              <Haslo>Hook</Haslo>
            </p>
            <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              {c.hero.hook.replace(/^Hook:\s*/i, "")}
            </p>
            <p className="mb-1">
              <Haslo>Pytanie + korzyść</Haslo>
            </p>
            <h1 className="mb-5 text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">
              {c.hero.question.replace(/^[^:]+:\s*/i, "")} {c.hero.benefit}
            </h1>
            <p className="mb-1">
              <Haslo>Obietnica</Haslo>
            </p>
            <p className="mb-8 text-sm leading-relaxed text-slate-600">
              {c.hero.promise.replace(/^Obietnica:\s*/i, "")}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#oferta"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Oferta
              </a>
              <a
                href="#o-mnie"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                O mnie
              </a>
            </div>
          </div>
          <div className="relative  w-full h-full shrink-0 overflow-hidden rounded-xl bg-slate-200 shadow-lg lg:w-[44%]  lg:aspect-auto ">
            <div className="relative h-full w-full">
              <Image
                src="/unnamed.jpeg"
                alt=""
                fill
                className="object-cover w-full h-full object-top"
                
                priority
              />
            </div>
          </div>
        </div>
        <a
          href="#fakty"
          className="absolute bottom-3 left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 text-slate-400 transition hover:text-slate-600"
          aria-label="Przewiń w dół"
        >
          <span className="text-[10px] font-medium uppercase tracking-wider">W dół</span>
          <ChevronDown className="h-7 w-7 animate-bounce" />
        </a>
      </section>

      {/* ─── PROBLEM ────────────────────────────────────────────────────── */}
      <section
        id="problem"
        className="relative w-full bg-white px-4 py-20 sm:px-6 sm:py-24 md:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
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
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl lg:aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
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
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-slate-600 sm:text-base leading-relaxed">{point}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-14 rounded-3xl border border-blue-200 bg-blue-50 p-8 sm:p-10">
            <h3 className="mb-3 text-xl font-semibold sm:text-2xl">
              <Haslo>{c.problemAgitation.conspiracyHeadline}</Haslo>
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              {c.problemAgitation.conspiracyText}
            </p>
          </div>
        </div>
      </section>

      {/* ─── O MNIE ──────────────────────────────────────────────────────── */}
      <section
        id="o-mnie"
        className="relative w-full bg-slate-50/80 px-4 py-20 sm:px-6 sm:py-24 md:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-left text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            <Haslo>{c.storyAndAuthority.sectionTitle}</Haslo>
          </h2>

          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-14">
            <div className="w-full shrink-0 lg:w-[340px]">
              <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl bg-slate-200 shadow-lg">
                <Image
                  src="/unnamed.jpeg"
                  alt={c.storyAndAuthority.authorName}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 340px"
                />
              </div>
              <div className="mt-5 text-center lg:text-left">
                <p className="text-xl font-semibold tracking-tight text-slate-900">
                  {c.storyAndAuthority.authorName}
                </p>
                <p className="mt-0.5 text-sm font-medium text-slate-500">
                  {c.storyAndAuthority.authorTitle}
                </p>
              </div>
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {c.storyAndAuthority.credentialsHeadline}
                </p>
                <ul className="space-y-2.5">
                  {c.storyAndAuthority.credentials.map((item, i) => (
                    <li key={i} className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-slate-800">{item.label}</span>
                      <span className="text-xs text-slate-500">{item.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex-1 space-y-8">
              <p className="text-lg leading-relaxed text-slate-700 sm:text-xl">
                {c.storyAndAuthority.authorBio}
              </p>

              <div className="space-y-6 border-l-2 border-slate-200 pl-6">
                <p className="text-slate-600 leading-relaxed">
                  <Haslo>Zbudowanie autorytetu</Haslo> {c.storyAndAuthority.authorityHeadline}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  <Haslo>Historia początków</Haslo> {c.storyAndAuthority.originStory}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  <Haslo>{c.storyAndAuthority.turningPointHeadline}</Haslo> {c.storyAndAuthority.turningPointText}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  <Haslo>{c.storyAndAuthority.newPathHeadline}</Haslo> {c.storyAndAuthority.newPathText}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  <Haslo>{c.storyAndAuthority.positiveEffectsHeadline}</Haslo> {c.storyAndAuthority.positiveEffectsText}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  <Haslo>Dodatkowe korzyści</Haslo> {c.storyAndAuthority.additionalBenefits}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  <Haslo>{c.storyAndAuthority.costOfSolutionHeadline}</Haslo> {c.storyAndAuthority.costOfSolutionText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── OPINIE ──────────────────────────────────────────────────────── */}
      <section
        id="opinie"
        className="relative w-full bg-white px-4 py-20 sm:px-6 sm:py-24 md:px-8 lg:px-12"
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
                <Quote className="mb-4 h-8 w-8 text-blue-400" />
                <p className="mb-5 flex-1 text-slate-600 leading-relaxed">
                  „{item.quote}”
                </p>
                <StarRating rating={item.rating} />
                <p className="mt-4 font-semibold text-slate-900">{item.author}</p>
                <p className="text-sm text-blue-600">{item.result}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OFERTA (Korepetycje + Kursy w stylu Gumroad) ─────────────────── */}
      <section
        id="oferta"
        className="relative w-full bg-slate-50 px-4 py-20 sm:px-6 sm:py-24 md:px-8 lg:px-12"
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
              className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-6 py-3.5 text-base font-medium text-white transition hover:bg-teal-500"
            >
              {c.offerDetails.tutoring.ctaLabel}
            </a>
          </div>

          {/* Kursy – 3 prostokąty w stylu Gumroad z przyciskiem Kup przez */}
          <h3 className="mb-6 text-lg font-semibold text-slate-900">
            <Haslo>Kursy</Haslo>
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {c.offerDetails.courses.map((course) => (
              <article
                key={course.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-40 w-full shrink-0 bg-slate-200">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                    Okładka kursu
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h4 className="mb-2 font-semibold text-slate-900 line-clamp-2">
                    {course.title}
                  </h4>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-2">
                    {course.shortDescription}
                  </p>
                  <p className="mb-4 text-lg font-bold text-slate-900">{course.price}</p>
                  <a
                    href={course.gumroadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gumroad-button flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    <span>Kup przez</span>
                    
                    
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-8">
            <h3 className="mb-2 text-lg font-semibold">
              <Haslo>{c.offerDetails.valueBuildUpHeadline}</Haslo>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {c.offerDetails.valueBuildUpText}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-start sm:gap-8 sm:p-8">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600">
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
    </div>
  );
}
