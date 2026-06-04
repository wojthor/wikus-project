import type { StripePaymentElementOptions } from "@stripe/stripe-js";

/**
 * Jawna lista — Payment Intent i Checkout Session (bez Klarny).
 * P24 dodaj dopiero gdy w Stripe Dashboard status ≠ Ineligible (lista prohibited business).
 * Apple Pay / Google Pay nie są osobnym typem — działają przy "card" (wallets poniżej).
 */
export const STRIPE_PAYMENT_METHOD_TYPES = ["card", "blik"] as const;

export type StripePaymentMethodType = (typeof STRIPE_PAYMENT_METHOD_TYPES)[number];

/** Tekst marketingowy — zgodny z metodami faktycznie dostępnymi na koncie */
export const STRIPE_PAYMENT_METHODS_LABEL =
  "karta (Apple Pay, Google Pay), BLIK";

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
  paymentMethodOrder: ["card", "blik"],
  wallets: {
    applePay: "auto",
    googlePay: "auto",
  },
};
