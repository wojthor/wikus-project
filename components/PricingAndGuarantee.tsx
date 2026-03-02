"use client";

import { Shield, Clock } from "lucide-react";
import type { pricingAndGuarantee as PricingContent } from "@/data/content";

interface PricingAndGuaranteeProps {
  content: typeof PricingContent;
}

export function PricingAndGuarantee({ content }: PricingAndGuaranteeProps) {
  return (
    <section
      id="pricing"
      className="relative w-full bg-zinc-900 px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-10 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          {content.sectionTitle}
        </h2>

        <h3 className="mb-6 text-xl font-bold text-amber-400">
          {content.pricePresentationHeadline}
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Digital product price */}
          <div className="rounded-xl border-2 border-amber-500/50 bg-zinc-800 p-6 sm:p-8">
            <p className="mb-1 text-sm font-medium uppercase tracking-wider text-zinc-400">
              {content.digitalProductLabel}
            </p>
            <p className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              {content.digitalProductPrice}
            </p>
        <a
          href={content.gumroadDigitalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
              {content.buyDigitalLabel}
            </a>
          </div>

          {/* Tutoring hourly rate */}
          <div className="rounded-xl border border-zinc-600 bg-zinc-800 p-6 sm:p-8">
            <p className="mb-1 text-sm font-medium uppercase tracking-wider text-zinc-400">
              {content.tutoringLabel}
            </p>
            <p className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              {content.tutoringHourlyRate}
            </p>
        <a
          href={content.gumroadTutoringUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
              {content.buyTutoringLabel}
            </a>
          </div>
        </div>

        {/* Guarantee */}
        <div className="mt-10 flex flex-col gap-6 rounded-xl border border-zinc-600 bg-zinc-800/50 p-6 sm:mt-12 sm:flex-row sm:items-start sm:gap-8 sm:p-8">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-500">
            <Shield className="h-6 w-6" />
          </span>
          <div>
            <h4 className="mb-2 text-lg font-bold text-white">
              {content.guaranteeHeadline}
            </h4>
            <p className="text-zinc-300 leading-relaxed">
              {content.guaranteeText}
            </p>
          </div>
        </div>

        {/* Urgency / Deadline */}
        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 sm:mt-8 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
            <Clock className="h-6 w-6" />
          </span>
          <div>
            <h4 className="mb-1 text-lg font-bold text-amber-400">
              {content.urgencyHeadline}
            </h4>
            <p className="text-zinc-300">{content.urgencyText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
