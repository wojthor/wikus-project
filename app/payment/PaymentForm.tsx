"use client";

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useMemo, useState } from "react";

import { STRIPE_PAYMENT_ELEMENT_OPTIONS } from "@/src/lib/stripe-payment-methods";

type PaymentFormProps = {
  amountLabel: string;
  email: string;
  clientSecret: string;
};

function getPaymentIntentIdFromClientSecret(clientSecret: string): string {
  return clientSecret.split("_secret")[0] ?? "";
}

export function PaymentForm({ amountLabel, email, clientSecret }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymentElementOptions = useMemo(
    () => ({
      ...STRIPE_PAYMENT_ELEMENT_OPTIONS,
      defaultValues: {
        billingDetails: {
          email: email.trim() || undefined,
        },
      },
      fields: {
        billingDetails: {
          email: "never" as const,
        },
      },
    }),
    [email],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const normalizedEmail = email.trim();

    if (!stripe || !elements) {
      setError("Formularz płatności jeszcze się ładuje. Spróbuj ponownie za chwilę.");
      return;
    }

    if (!normalizedEmail) {
      setError("Podaj adres e-mail, aby kontynuować.");
      return;
    }

    const paymentIntentId = getPaymentIntentIdFromClientSecret(clientSecret);
    if (!paymentIntentId) {
      setError("Nie udało się przygotować płatności. Odśwież stronę i spróbuj ponownie.");
      return;
    }

    setSubmitting(true);

    try {
      const updateIntentRes = await fetch("/api/payment-intent/set-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId,
          email: normalizedEmail,
        }),
      });

      if (!updateIntentRes.ok) {
        const updateError = (await updateIntentRes.json().catch(() => ({}))) as { error?: string };
        setError(updateError.error ?? "Nie udało się zapisać adresu e-mail do płatności.");
        setSubmitting(false);
        return;
      }

      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message ?? "Uzupełnij dane płatności.");
        setSubmitting(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
          payment_method_data: {
            billing_details: {
              email: normalizedEmail,
            },
          },
        },
        redirect: "if_required",
      });

      if (confirmError) {
        setError(confirmError.message ?? "Nie udało się dokończyć płatności.");
        setSubmitting(false);
        return;
      }

      if (!paymentIntent) {
        return;
      }

      if (paymentIntent.status === "succeeded" || paymentIntent.status === "processing") {
        window.location.assign(
          `${window.location.origin}/success?payment_intent=${encodeURIComponent(paymentIntentId)}`,
        );
        return;
      }

      if (paymentIntent.status === "requires_action") {
        setError("Potwierdź płatność w aplikacji banku. Bez potwierdzenia transakcja nie przejdzie.");
        setSubmitting(false);
        return;
      }

      setError("Płatność nie została zakończona. Spróbuj ponownie.");
      setSubmitting(false);
    } catch {
      setError("Wystąpił błąd podczas płatności. Spróbuj ponownie.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
      <div className="stripe-payment-list rounded-2xl border border-[#b9c5fe] bg-[#f8faff] p-4">
        <PaymentElement options={paymentElementOptions} />
      </div>

      <button
        type="submit"
        disabled={!stripe || submitting}
        className="inline-flex w-full items-center justify-center rounded-xl bg-[#7347f4] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Przetwarzanie..." : `Zapłać ${amountLabel}`}
      </button>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
    </form>
  );
}
