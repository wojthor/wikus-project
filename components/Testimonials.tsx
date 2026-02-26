"use client";

import { Star, Quote } from "lucide-react";
import type { testimonials as TestimonialsContent } from "../data/content";

interface TestimonialsProps {
  content: typeof TestimonialsContent;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} z 5 gwiazdek`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-zinc-600"}`}
        />
      ))}
    </div>
  );
}

export function Testimonials({ content }: TestimonialsProps) {
  return (
    <section
      id="opinie"
      className="relative w-full bg-zinc-900 px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          {content.sectionTitle}
        </h2>
        <p className="mb-10 text-lg text-zinc-400 sm:mb-12">
          {content.subheadline}
        </p>

        {/* Masonry-style grid on desktop, stacked on mobile */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, i) => (
            <article
              key={i}
              className="flex flex-col rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-5 shadow-lg sm:p-6"
            >
              <Quote className="mb-3 h-8 w-8 text-amber-500/40" />
              <p className="mb-4 flex-1 text-zinc-300 leading-relaxed">
                „{item.quote}”
              </p>
              <StarRating rating={item.rating} />
              <p className="mt-3 font-semibold text-white">{item.author}</p>
              <p className="text-sm font-medium text-amber-400/90">
                {item.result}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import Script from 'next/script';


