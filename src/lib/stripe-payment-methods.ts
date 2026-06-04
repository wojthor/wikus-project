import type {
  StripeExpressCheckoutElementOptions,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";

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
/**
 * Przyciski Apple Pay / Google Pay nad formularzem (Payment Element ukrywa portfele, żeby nie dublować).
 * `always` — m.in. Apple Pay w Chrome na macOS (ograniczenie Stripe/Apple).
 */
export const STRIPE_EXPRESS_CHECKOUT_OPTIONS: StripeExpressCheckoutElementOptions = {
  paymentMethods: {
    applePay: "always",
    googlePay: "always",
    link: "never",
    amazonPay: "never",
    paypal: "never",
    klarna: "never",
  },
  buttonType: {
    applePay: "buy",
    googlePay: "buy",
  },
  layout: {
    maxColumns: 2,
    maxRows: 1,
  },
};

export const STRIPE_PAYMENT_ELEMENT_OPTIONS: StripePaymentElementOptions = {
  layout: {
    type: "accordion",
    radios: "always",
    defaultCollapsed: true,
    spacedAccordionItems: true,
  },
  paymentMethodOrder: ["card", "blik"],
  wallets: {
    applePay: "never",
    googlePay: "never",
  },
};
