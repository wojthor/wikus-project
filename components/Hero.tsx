"use client";

import { Play } from "lucide-react";
import type { hero as HeroContent } from "../data/content";

interface HeroProps {
  content: typeof HeroContent;
  ctaAnchor: string;
}

export function Hero({ content, ctaAnchor }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-zinc-950 px-4 pt-16 pb-20 sm:px-6 sm:pt-24 md:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-4xl">
        {/* Hook */}
        <p className="mb-4 text-base font-medium uppercase tracking-widest text-amber-400/90 sm:text-lg">
          {content.hook}
        </p>

        {/* Question + Benefit */}
        <h1 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl md:leading-tight">
          <span className="block">{content.question}</span>
          <span className="mt-2 block bg-linear-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
            {content.benefit}
          </span>
        </h1>

        {/* Video placeholder */}
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-xl bg-zinc-800 shadow-2xl ring-1 ring-zinc-700/50 sm:mb-12">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-900/80">
            <button
              type="button"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-zinc-950 shadow-lg transition hover:scale-105 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
              aria-label={content.videoPlaceholderLabel}
            >
              <Play className="h-8 w-8 fill-current pl-1" />
            </button>
            <span className="text-sm font-medium text-zinc-300 sm:text-base">
              {content.videoPlaceholderLabel}
            </span>
          </div>
        </div>

        {/* Promise */}
        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl sm:leading-relaxed">
          {content.promise}
        </p>

        {/* CTA */}
        <a
          href={ctaAnchor}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
        >
          {content.ctaLabel}
        </a>
      </div>
    </section>
  );
}
