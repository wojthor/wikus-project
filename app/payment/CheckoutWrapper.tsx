"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useMemo, useRef, useState } from "react";

import { PaymentForm } from "@/app/payment/PaymentForm";
import { UNSCHOOL_COURSE_OFFER } from "@/src/features/unschool/course-offer";

type CreatePaymentIntentSuccess = {
  clientSecret: string;
};

type CreatePaymentIntentError = {
  error: string;
};

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export function CheckoutWrapper() {
  const [email, setEmail] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loadingIntent, setLoadingIntent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasPreparedIntentRef = useRef(false);

  const options = useMemo(
    () => ({
      clientSecret,
      locale: "pl" as const,
      appearance: {
        theme: "stripe" as const,
        variables: {
          colorPrimary: "#7347f4",
          colorBackground: "#ffffff",
          colorText: "#0f172a",
          colorDanger: "#b91c1c",
          borderRadius: "8px",
          spacingUnit: "4px",
        },
      },
    }),
    [clientSecret],
  );

  const preparePaymentIntent = async (force = false) => {
    if (!force && hasPreparedIntentRef.current) {
      return;
    }
    hasPreparedIntentRef.current = true;
    setError(null);

    setLoadingIntent(true);
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = (await response.json()) as CreatePaymentIntentSuccess | CreatePaymentIntentError;
      if (!response.ok || !("clientSecret" in data)) {
        const message =
          "error" in data ? data.error : "Nie udało się przygotować formularza płatności.";
        setError(message);
        return;
      }

      setClientSecret(data.clientSecret);
    } catch {
      setError("Wystąpił błąd połączenia. Spróbuj ponownie.");
    } finally {
      setLoadingIntent(false);
    }
  };

  useEffect(() => {
    if (!stripePromise) return;
    void preparePaymentIntent();
  }, []);

  if (!publishableKey || !stripePromise) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
        Brak konfiguracji Stripe (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).
      </p>
    );
  }

  if (loadingIntent) {
    return (
      <div className="space-y-3">
        <div className="h-11 animate-pulse rounded-xl bg-[#f1f5ff]" />
        <div className="h-60 animate-pulse rounded-2xl bg-[#f1f5ff]" />
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="space-y-4">
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={() => void preparePaymentIntent(true)}
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#7347f4] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-95"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
          Adres e-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="np. jan.kowalski@gmail.com"
          className="box-border w-full rounded-xl border border-[#b9c5fe] bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#7347f4] focus:ring-2 focus:ring-[#cfd8ff]"
        />
      </div>

      <Elements stripe={stripePromise} options={options}>
        <PaymentForm
          amountLabel={UNSCHOOL_COURSE_OFFER.priceDisplay}
          email={email}
          clientSecret={clientSecret}
        />
      </Elements>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
