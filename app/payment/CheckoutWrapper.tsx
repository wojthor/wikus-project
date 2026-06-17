"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useMemo, useRef, useState } from "react";

import { PaymentForm } from "@/app/payment/PaymentForm";
import type { DiscountInfo } from "@/app/payment/PaymentPageClient";
import { UNSCHOOL_COURSE_OFFER } from "@/src/features/unschool/course-offer";
import type { ValidateCouponResponse } from "@/app/api/validate-coupon/route";

type CreatePaymentIntentSuccess = { clientSecret: string };
type CreatePaymentIntentError = { error: string };

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

type CheckoutWrapperProps = {
  discount: DiscountInfo | null;
  onDiscountChange: (d: DiscountInfo | null) => void;
};

export function CheckoutWrapper({ discount, onDiscountChange }: CheckoutWrapperProps) {
  const [email, setEmail] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loadingIntent, setLoadingIntent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasPreparedIntentRef = useRef(false);

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

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
    [clientSecret]
  );

  const preparePaymentIntent = async (force = false, finalAmountCents?: number) => {
    if (!force && hasPreparedIntentRef.current) return;
    hasPreparedIntentRef.current = true;
    setError(null);
    setLoadingIntent(true);
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          finalAmountCents
            ? { finalAmountCents, couponCode: discount?.code }
            : {},
        ),
      });
      const data = (await response.json()) as CreatePaymentIntentSuccess | CreatePaymentIntentError;
      if (!response.ok || !("clientSecret" in data)) {
        setError("error" in data ? data.error : "Nie udało się przygotować formularza płatności.");
        return;
      }
      setClientSecret(data.clientSecret);
    } catch {
      setError("Wystąpił błąd połączenia. Spróbuj ponownie.");
    } finally {
      setLoadingIntent(false);
    }
  };

  const applyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = (await res.json()) as ValidateCouponResponse;
      if (!data.valid) {
        setCouponError(data.error);
        return;
      }
      onDiscountChange({
        code,
        label: data.discountLabel,
        finalAmountCents: data.finalAmountCents,
        finalAmountDisplay: data.finalAmountDisplay,
      });
      hasPreparedIntentRef.current = false;
      await preparePaymentIntent(true, data.finalAmountCents);
    } catch {
      setCouponError("Błąd weryfikacji kodu. Spróbuj ponownie.");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = async () => {
    onDiscountChange(null);
    setCouponInput("");
    setCouponError(null);
    hasPreparedIntentRef.current = false;
    await preparePaymentIntent(true);
  };

  useEffect(() => {
    if (!stripePromise) return;
    void preparePaymentIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const amountLabel = discount ? discount.finalAmountDisplay : UNSCHOOL_COURSE_OFFER.priceDisplay;

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

      {discount ? (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="text-base">🎉</span>
            <div>
              <p className="text-xs font-bold text-emerald-800">
                Kod <span className="font-mono">{discount.code}</span>
              </p>
              <p className="text-[11px] text-emerald-600 mt-0.5">
                Rabat {discount.label} · Do zapłaty:{" "}
                <span className="font-bold text-emerald-700">{discount.finalAmountDisplay}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void removeCoupon()}
            className="ml-3 shrink-0 text-xs text-slate-400 hover:text-slate-600 transition"
            title="Usuń kod"
          >
            ✕
          </button>
        </div>
      ) : (
        <div>
          <label htmlFor="coupon" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Kod rabatowy
          </label>
          <div className="flex gap-2">
            <input
              id="coupon"
              type="text"
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value);
                setCouponError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void applyCoupon();
                }
              }}
              placeholder="np. SUMMER20"
              className="box-border flex-1 rounded-xl border border-[#b9c5fe] bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#7347f4] focus:ring-2 focus:ring-[#cfd8ff] uppercase placeholder:normal-case"
            />
            <button
              type="button"
              disabled={couponLoading || !couponInput.trim()}
              onClick={() => void applyCoupon()}
              className="rounded-xl bg-[#7347f4] px-4 py-3 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {couponLoading ? "…" : "Zastosuj"}
            </button>
          </div>
          {couponError && <p className="mt-1.5 text-xs text-red-600">{couponError}</p>}
        </div>
      )}

      <Elements stripe={stripePromise} options={options}>
        <PaymentForm amountLabel={amountLabel} email={email} clientSecret={clientSecret} />
      </Elements>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
