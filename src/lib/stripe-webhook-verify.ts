import type Stripe from "stripe";

import { getStripeServer } from "@/src/lib/stripe-server";

function collectWebhookSecrets(): string[] {
  const candidates = [
    process.env.STRIPE_WEBHOOK_SECRET,
    process.env.STRIPE_WEBHOOK_SECRET_CLI,
  ];

  const secrets = candidates
    .map((value) => value?.trim().replace(/^["']|["']$/g, "") ?? "")
    .filter((value): value is string => value.length > 0 && !value.startsWith("tutaj_"));

  return [...new Set(secrets)];
}

/** Weryfikacja sygnatury na surowym buforze (bez parsowania JSON). */
export function constructStripeEvent(rawBody: Buffer, signature: string): Stripe.Event {
  const stripe = getStripeServer();
  const secrets = collectWebhookSecrets();

  if (secrets.length === 0) {
    throw new Error("Brak STRIPE_WEBHOOK_SECRET w zmiennych środowiskowych.");
  }

  let lastError: unknown;
  for (const secret of secrets) {
    try {
      return stripe.webhooks.constructEvent(rawBody, signature, secret);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}
