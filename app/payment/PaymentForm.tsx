"use client";

import {
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeExpressCheckoutElementConfirmEvent } from "@stripe/stripe-js";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  STRIPE_EXPRESS_CHECKOUT_OPTIONS,
  STRIPE_PAYMENT_ELEMENT_OPTIONS,
} from "@/src/lib/stripe-payment-methods";

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
  const [expressWalletsVisible, setExpressWalletsVisible] = useState(true);
  const initiateCheckoutTracked = useRef(false);

  useEffect(() => {
    if (!stripe || !elements || initiateCheckoutTracked.current) return;
    initiateCheckoutTracked.current = true;
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "InitiateCheckout");
    }
  }, [stripe, elements]);

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

  const persistEmailOnIntent = async (normalizedEmail: string): Promise<string | null> => {
    const paymentIntentId = getPaymentIntentIdFromClientSecret(clientSecret);
    if (!paymentIntentId) {
      return "Nie udało się przygotować płatności. Odśwież stronę i spróbuj ponownie.";
    }

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
      return updateError.error ?? "Nie udało się zapisać adresu e-mail do płatności.";
    }

    return null;
  };

  const finalizePayment = async (
    normalizedEmail: string,
    options?: { skipElementSubmit?: boolean },
  ): Promise<string | null> => {
    if (!stripe || !elements) {
      return "Formularz płatności jeszcze się ładuje. Spróbuj ponownie za chwilę.";
    }

    const emailError = await persistEmailOnIntent(normalizedEmail);
    if (emailError) {
      return emailError;
    }

    if (!options?.skipElementSubmit) {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        return submitError.message ?? "Uzupełnij dane płatności.";
      }
    }

    const paymentIntentId = getPaymentIntentIdFromClientSecret(clientSecret);
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
      return confirmError.message ?? "Nie udało się dokończyć płatności.";
    }

    if (!paymentIntent) {
      return null;
    }

    if (
      paymentIntent.status === "succeeded" ||
      paymentIntent.status === "processing" ||
      paymentIntent.status === "requires_action"
    ) {
      window.location.assign(
        `${window.location.origin}/success?payment_intent=${encodeURIComponent(paymentIntentId)}`,
      );
      return null;
    }

    return "Płatność nie została zakończona. Spróbuj ponownie.";
  };

  const handleExpressConfirm = async (event: StripeExpressCheckoutElementConfirmEvent) => {
    setError(null);
    const walletEmail = event.billingDetails?.email?.trim() ?? "";
    const normalizedEmail = email.trim() || walletEmail;

    if (!normalizedEmail) {
      const message = "Podaj adres e-mail powyżej przed płatnością portfelem.";
      setError(message);
      event.paymentFailed({ reason: "invalid_payment_data", message });
      return;
    }

    setSubmitting(true);
    const paymentError = await finalizePayment(normalizedEmail, { skipElementSubmit: true });
    if (paymentError) {
      setError(paymentError);
      event.paymentFailed({ reason: "fail", message: paymentError });
      setSubmitting(false);
    }
  };

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

    setSubmitting(true);

    try {
      const paymentError = await finalizePayment(normalizedEmail);
      if (paymentError) {
        setError(paymentError);
        setSubmitting(false);
        return;
      }
    } catch {
      setError("Wystąpił błąd podczas płatności. Spróbuj ponownie.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
      <div className="min-h-[52px] rounded-2xl border border-[#b9c5fe] bg-[#f8faff] p-3">
        <ExpressCheckoutElement
          options={STRIPE_EXPRESS_CHECKOUT_OPTIONS}
          onAvailablePaymentMethodsChange={(event) => {
            const methods = event.paymentMethods;
            setExpressWalletsVisible(
              Boolean(methods?.applePay?.available || methods?.googlePay?.available),
            );
          }}
          onReady={(event) => {
            const methods = event.availablePaymentMethods;
            if (methods) {
              setExpressWalletsVisible(
                Boolean(methods.applePay || methods.googlePay),
              );
            }
          }}
          onClick={(event) => {
            if (!email.trim()) {
              setError("Podaj adres e-mail powyżej przed płatnością portfelem.");
              event.reject();
              return;
            }
            event.resolve();
          }}
          onConfirm={(event) => void handleExpressConfirm(event)}
        />
      </div>

      {expressWalletsVisible && (
        <p className="text-center text-xs text-slate-500">
          Apple Pay działa w Safari na urządzeniach Apple; Google Pay — w Chrome i na Androidzie.
        </p>
      )}

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
