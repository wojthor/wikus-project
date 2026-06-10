import type { Payload } from "payload";
import type Stripe from "stripe";

import { generateSecurePassword } from "@/src/lib/generate-password";
import { sendWelcomeEmailToUser } from "@/src/lib/send-welcome-email-to-user";
import { getStripeServer } from "@/src/lib/stripe-server";

export function getCheckoutSessionEmail(session: Stripe.Checkout.Session): string | null {
  const fromSession = session.customer_email?.trim().toLowerCase();
  if (fromSession) return fromSession;

  const fromDetails = session.customer_details?.email?.trim().toLowerCase();
  return fromDetails ?? null;
}

export function isPaidCheckoutSession(session: Stripe.Checkout.Session): boolean {
  return session.payment_status === "paid";
}

export function getPaymentIntentEmail(intent: Stripe.PaymentIntent): string | null {
  const receiptEmail = intent.receipt_email?.trim().toLowerCase();
  if (receiptEmail) return receiptEmail;

  const metadataEmail = intent.metadata?.customerEmail?.trim().toLowerCase();
  if (metadataEmail && metadataEmail !== "not-provided-yet") return metadataEmail;

  const latestCharge = intent.latest_charge;
  if (latestCharge && typeof latestCharge === "object") {
    const fromBilling = latestCharge.billing_details?.email?.trim().toLowerCase();
    if (fromBilling) return fromBilling;
  }
  return null;
}

function isAlreadyProvisioned(metadata: Stripe.Metadata | null | undefined): boolean {
  return metadata?.provisioned === "true";
}

async function markCheckoutSessionProvisioned(sessionId: string): Promise<void> {
  const stripe = getStripeServer();
  await stripe.checkout.sessions.update(sessionId, {
    metadata: { provisioned: "true" },
  });
}

async function markPaymentIntentProvisioned(
  intent: Stripe.PaymentIntent,
): Promise<void> {
  const stripe = getStripeServer();
  await stripe.paymentIntents.update(intent.id, {
    metadata: {
      ...intent.metadata,
      provisioned: "true",
    },
  });
}

async function provisionStudentByEmail(
  payload: Payload,
  customerEmail: string,
): Promise<{ created: boolean; reason?: string; emailed?: boolean }> {
  if (!customerEmail) {
    return { created: false, reason: "no_email" };
  }

  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: customerEmail } },
    limit: 1,
    overrideAccess: true,
  });

  let userId: string | number;
  let created = false;

  if (existing.docs.length > 0) {
    userId = existing.docs[0].id;
  } else {
    const newUser = await payload.create({
      collection: "users",
      overrideAccess: true,
      data: {
        email: customerEmail,
        password: generateSecurePassword(24),
        firstName: "Kursant",
        lastName: "Nowy",
        admin: false,
        welcomeEmailSent: false,
      },
    });
    userId = newUser.id;
    created = true;
  }

  const emailResult = await sendWelcomeEmailToUser(payload, userId);

  if (emailResult.emailed) {
    return {
      created,
      reason: created ? undefined : "user_exists_resent",
      emailed: true,
    };
  }

  console.error("[stripe-webhook] Nie udało się wysłać maila powitalnego:", emailResult.reason);
  return {
    created,
    reason: created ? "email_failed" : "user_exists_email_failed",
    emailed: false,
  };
}

export async function provisionStudentFromCheckout(
  payload: Payload,
  session: Stripe.Checkout.Session,
): Promise<{ created: boolean; reason?: string }> {
  if (!isPaidCheckoutSession(session)) {
    return { created: false, reason: "payment_not_paid" };
  }

  if (isAlreadyProvisioned(session.metadata)) {
    return { created: false, reason: "already_provisioned" };
  }

  const customerEmail = getCheckoutSessionEmail(session);
  const result = await provisionStudentByEmail(payload, customerEmail ?? "");

  if (result.emailed !== false && session.id) {
    await markCheckoutSessionProvisioned(session.id);
  }

  return result;
}

export async function provisionStudentFromPaymentIntent(
  payload: Payload,
  intent: Stripe.PaymentIntent,
): Promise<{ created: boolean; reason?: string }> {
  if (intent.status !== "succeeded") {
    return { created: false, reason: "payment_not_paid" };
  }

  if (isAlreadyProvisioned(intent.metadata)) {
    return { created: false, reason: "already_provisioned" };
  }

  const customerEmail = getPaymentIntentEmail(intent);
  const result = await provisionStudentByEmail(payload, customerEmail ?? "");

  if (customerEmail && result.reason !== "no_email") {
    await markPaymentIntentProvisioned(intent);
  }

  return result;
}
