import { Check, ShieldCheck } from "lucide-react";

import { CheckoutWrapper } from "@/app/payment/CheckoutWrapper";
import {
  UNSCHOOL_COURSE_OFFER,
  UNSCHOOL_PRICING_FEATURES,
} from "@/src/features/unschool/course-offer";

export const metadata = {
  title: "Płatność — Unschool Your English",
  robots: { index: false, follow: false },
};

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-[#f8faff] px-4 py-10 font-sans selection:bg-[#cfd8ff] sm:px-6 sm:py-14">
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-8">
        <section className="relative rounded-3xl border-2 border-[#7347f4] bg-linear-to-br from-[#cfd8ff]/80 via-white to-[#f8faff] p-6 shadow-[0_20px_50px_rgba(115,71,244,0.12)] ring-1 ring-[#7347f4]/20 sm:p-8">
          <span className="absolute -top-3 right-6 rounded-full bg-[#ffbd53] border border-[#ffa515] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            {UNSCHOOL_COURSE_OFFER.promotionBadge}
          </span>

          <p className="inline-flex items-center rounded-full border border-[#b9c5fe] bg-[#cfd8ff] px-4 py-1 text-xs font-semibold tracking-wide text-[#3e57d6]">
            {UNSCHOOL_COURSE_OFFER.levelLabel}
          </p>
          <h1 className="mt-3 text-2xl font-extrabold text-[#7347f4] sm:text-3xl">
            {UNSCHOOL_COURSE_OFFER.stripeProductName}
          </h1>
          <p className="mt-2 text-sm text-slate-600">{UNSCHOOL_COURSE_OFFER.tileSubtitle}</p>

          <ul className="mt-5 space-y-2.5">
            {UNSCHOOL_PRICING_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7347f4] text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-[#b9c5fe] bg-white/90 px-4 py-4 text-center">
            <div className="text-sm text-slate-400 line-through">
              {UNSCHOOL_COURSE_OFFER.priceCompareDisplay}
            </div>
            <div className="mt-1 text-4xl font-extrabold tracking-tight text-[#7347f4]">
              {UNSCHOOL_COURSE_OFFER.priceDisplay}
            </div>
            <p className="mt-2 text-xs font-medium text-slate-500">
              {UNSCHOOL_COURSE_OFFER.priceNote}
            </p>
          </div>

        </section>

        <section className="flex flex-col rounded-3xl border border-[#b9c5fe] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#7347f4]">Płatność</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            Dokończ zakup kursu
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Metody płatności są widoczne od razu. Podaj e-mail i potwierdź płatność.
          </p>

          <div className="mt-6">
            <CheckoutWrapper />
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-medium text-emerald-800">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Bezpieczna płatność online i natychmiastowa aktywacja konta po opłaceniu.
          </div>
        </section>
      </div>
    </main>
  );
}
