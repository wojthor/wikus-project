import config from "@payload-config";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

import { MetaPurchaseTracker } from "@/app/components/MetaPurchaseTracker";
import { getPaymentOutcome } from "@/src/lib/payment-intent-status";
import { provisionStudentFromPaymentIntent } from "@/src/lib/stripe-checkout-provision";
import { getStripeServer } from "@/src/lib/stripe-server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Płatność zakończona — Unschool Your English",
  robots: { index: false, follow: false },
};

type PaymentSuccessPageProps = {
  searchParams: Promise<{
    payment_intent?: string;
    redirect_status?: string;
  }>;
};

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const params = await searchParams;
  const paymentIntentId = params.payment_intent;
  const redirectStatus = params.redirect_status;

  if (redirectStatus === "failed") {
    redirect("/failed");
  }

  let outcome;
  try {
    outcome = await getPaymentOutcome(paymentIntentId);
  } catch (err) {
    console.error("[payment-success] Nie udało się zweryfikować płatności:", err);
    redirect("/failed");
  }

  if (outcome === "missing" || outcome === "failed" || outcome === "incomplete") {
    redirect("/failed");
  }

  let paidAmountZloty: number | null = null;
  if (outcome === "succeeded" && paymentIntentId) {
    try {
      const stripe = getStripeServer();
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ["latest_charge"],
      });
      paidAmountZloty = intent.amount / 100;
      const payload = await getPayload({ config });
      await provisionStudentFromPaymentIntent(payload, intent);
    } catch (err) {
      console.error("[payment-success] Zapasowe utworzenie konta po płatności:", err);
    }
  }

  if (outcome === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faff] px-4 py-12 font-sans text-slate-900 selection:bg-[#cfd8ff]">
        <div className="w-full max-w-lg rounded-3xl border border-[#b9c5fe] bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#cfd8ff] text-2xl">
            ⏳
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#7347f4]">
            Unschool Your English
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#7347f4] sm:text-3xl">
            Płatność w trakcie przetwarzania
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            Operator płatności jeszcze potwierdza transakcję (np. BLIK). Gdy płatność przejdzie,
            wyślemy mail z linkiem do ustawienia hasła. Odśwież tę stronę za chwilę.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`/success?payment_intent=${encodeURIComponent(paymentIntentId ?? "")}`}
              className="inline-flex items-center justify-center rounded-4xl border border-[#ffa515] bg-[#ffbd53] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5"
            >
              Odśwież status
            </Link>
            <Link
              href="/unschool"
              className="inline-flex items-center justify-center rounded-4xl border border-[#b9c5fe] bg-white px-6 py-3 text-sm font-bold text-[#7347f4] transition hover:bg-[#f8faff]"
            >
              Strona kursu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8faff] px-4 py-12 font-sans text-slate-900 selection:bg-[#cfd8ff]">
      {outcome === "succeeded" && paymentIntentId && paidAmountZloty ? (
        <MetaPurchaseTracker paymentIntentId={paymentIntentId} value={paidAmountZloty} />
      ) : null}
      <div className="w-full max-w-lg rounded-3xl border border-[#b9c5fe] bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#cfd8ff] text-2xl">
          🎉
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#7347f4]">
          Unschool Your English
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#7347f4] sm:text-3xl">
          Płatność zakończona sukcesem!
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          Na Twój e-mail wysłaliśmy{" "}
          <strong className="text-slate-800">link do ustawienia hasła</strong> (ważny 48 h).
          Po ustawieniu hasła zalogujesz się na platformę e-learningową. Sprawdź skrzynkę — także
          folder spam.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/elearning"
            className="inline-flex items-center justify-center rounded-4xl border border-[#ffa515] bg-[#ffbd53] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5"
          >
            Przejdź do platformy
          </Link>
          <Link
            href="/unschool"
            className="inline-flex items-center justify-center rounded-4xl border border-[#b9c5fe] bg-white px-6 py-3 text-sm font-bold text-[#7347f4] transition hover:bg-[#f8faff]"
          >
            Strona kursu
          </Link>
        </div>
      </div>
    </div>
  );
}
