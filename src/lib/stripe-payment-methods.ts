import type { StripePaymentElementOptions } from "@stripe/stripe-js";

/** Jawna lista — Payment Intent i Checkout Session (bez Klarny). */
export const STRIPE_PAYMENT_METHOD_TYPES = ["card", "blik", "p24"] as const;

export type StripePaymentMethodType = (typeof STRIPE_PAYMENT_METHOD_TYPES)[number];

/** Tekst marketingowy na stronach płatności i FAQ */
export const STRIPE_PAYMENT_METHODS_LABEL =
  "karta, Apple Pay, Google Pay, BLIK lub Przelewy24";

/**
 * Lista metod (accordion + radio) — wszystkie pozycje widoczne,
 * nic nie jest rozwinięte na starcie; użytkownik wybiera jedną.
 */
export const STRIPE_PAYMENT_ELEMENT_OPTIONS: StripePaymentElementOptions = {
  layout: {
    type: "accordion",
    radios: "always",
    defaultCollapsed: true,
    spacedAccordionItems: true,
  },
  paymentMethodOrder: ["blik", "p24", "card"],
  wallets: {
    applePay: "auto",
    googlePay: "auto",
  },
};
