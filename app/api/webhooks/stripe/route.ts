export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import config from "@payload-config";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getPayload } from "payload";

import {
  provisionStudentFromCheckout,
  provisionStudentFromPaymentIntent,
} from "@/src/lib/stripe-checkout-provision";
import { constructStripeEvent } from "@/src/lib/stripe-webhook-verify";

export const runtime = "nodejs";

const CHECKOUT_PROVISION_EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "payment_intent.succeeded",
]);

export async function POST(req: Request): Promise<NextResponse> {
  // Nagłówek z oryginalnego Request (nie headers() z next/headers — ważne dla sygnatury Stripe)
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature." }, { status: 400 });
  }

  const bodyBuffer = await req.arrayBuffer();
  const rawBody = Buffer.from(bodyBuffer);

  if (rawBody.length === 0) {
    return NextResponse.json({ error: "Empty request body." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = constructStripeEvent(rawBody, signature);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[stripe-webhook] Invalid signature:", message);
    if (process.env.NODE_ENV === "development") {
      console.error(
        "[stripe-webhook] Dev hint: po każdym uruchomieniu `stripe listen` skopiuj NOWY whsec_ do STRIPE_WEBHOOK_SECRET (lub STRIPE_WEBHOOK_SECRET_CLI).",
      );
    }
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (!CHECKOUT_PROVISION_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  try {
    const payload = await getPayload({ config });
    const result =
      event.type === "payment_intent.succeeded"
        ? await provisionStudentFromPaymentIntent(payload, event.data.object as Stripe.PaymentIntent)
        : await provisionStudentFromCheckout(payload, event.data.object as Stripe.Checkout.Session);

    if (result.reason === "no_email") {
      const objectWithId = event.data.object as { id?: string };
      console.error("[stripe-webhook] Brak e-maila w obiekcie płatności:", objectWithId.id);
    }

    return NextResponse.json({ received: true, ...result });
  } catch (err) {
    console.error("[stripe-webhook] Provision failed:", err);
    return NextResponse.json({ error: "User creation failed." }, { status: 500 });
  }
}
