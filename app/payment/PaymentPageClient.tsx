"use client";

import { Check, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { CheckoutWrapper } from "@/app/payment/CheckoutWrapper";
import {
  UNSCHOOL_COURSE_OFFER,
  UNSCHOOL_PRICING_FEATURES,
} from "@/src/features/unschool/course-offer";
import { STRIPE_PAYMENT_METHODS_LABEL } from "@/src/lib/stripe-payment-methods";

export type DiscountInfo = {
  code: string;
  label: string;
  finalAmountCents: number;
  finalAmountDisplay: string;
};

export function PaymentPageClient() {
  const [discount, setDiscount] = useState<DiscountInfo | null>(null);

  const displayPrice = discount
    ? discount.finalAmountDisplay
    : UNSCHOOL_COURSE_OFFER.priceDisplay;

  const strikePrice = discount
    ? UNSCHOOL_COURSE_OFFER.priceDisplay
    : UNSCHOOL_COURSE_OFFER.priceCompareDisplay;

  return (
    <div className="mx-auto grid w-full max-w-6xl items-start gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-8">
      {/* Left — product summary */}
      <section className="relative rounded-3xl border-2 border-[#7347f4] bg-linear-to-br from-[#cfd8ff]/80 via-white to-[#f8faff] p-5 shadow-[0_20px_50px_rgba(115,71,244,0.12)] ring-1 ring-[#7347f4]/20 sm:p-6">
        <span className="absolute -top-3 right-5 rounded-full bg-[#ffbd53] border border-[#ffa515] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
          {UNSCHOOL_COURSE_OFFER.promotionBadge}
        </span>

        <p className="inline-flex items-center rounded-full border border-[#b9c5fe] bg-[#cfd8ff] px-3 py-0.5 text-[11px] font-semibold tracking-wide text-[#3e57d6]">
          {UNSCHOOL_COURSE_OFFER.levelLabel}
        </p>
        <h1 className="mt-2 text-xl font-extrabold text-[#7347f4] sm:text-2xl">
          {UNSCHOOL_COURSE_OFFER.stripeProductName}
        </h1>
        <p className="mt-1 text-xs text-slate-600">{UNSCHOOL_COURSE_OFFER.tileSubtitle}</p>

        <ul className="mt-4 space-y-1.5">
          {UNSCHOOL_PRICING_FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-xs text-slate-700">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7347f4] text-white">
                <Check className="h-2.5 w-2.5" />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-4 rounded-xl border border-[#b9c5fe] bg-white/90 px-4 py-3 text-center">
          <div className="text-xs text-slate-400 line-through">{strikePrice}</div>
          <div className="mt-0.5 text-3xl font-extrabold tracking-tight text-[#7347f4]">
            {displayPrice}
          </div>
          {discount && (
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5">
              <span className="text-[10px] font-bold text-emerald-700">
                Rabat {discount.label}
              </span>
            </div>
          )}
          <p className="mt-1 text-[11px] font-medium text-slate-500">
            {UNSCHOOL_COURSE_OFFER.priceNote}
          </p>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#b9c5fe] bg-[#f8faff] px-3 py-3">
          <span className="text-sm leading-none mt-0.5">🔒</span>
          <div>
            <p className="text-[11px] font-bold text-[#7347f4]">Gwarancja satysfakcji – 30 dni</p>
            <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
              Nie chcę żebyś kupował w ciemno. Dlatego jeśli przerobiłeś pierwsze 2 moduły,
              wysłałeś zadania i nadal czujesz że to nie dla Ciebie – piszesz do mnie i zwracam
              całą kwotę. Zero ryzyka z Twojej strony.
            </p>
          </div>
        </div>
      </section>

      {/* Right — checkout form */}
      <section className="flex flex-col rounded-3xl border border-[#b9c5fe] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#7347f4]">Płatność</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
          Dokończ zakup kursu
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Metody płatności są widoczne od razu. Podaj e-mail i potwierdź płatność.
        </p>

        <div className="mt-6">
          <CheckoutWrapper discount={discount} onDiscountChange={setDiscount} />
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-medium text-emerald-800">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          Bezpieczna płatność przez Stripe ({STRIPE_PAYMENT_METHODS_LABEL}). Po opłaceniu konto na
          platformie tworzy się automatycznie.
        </div>
      </section>
    </div>
  );
}
