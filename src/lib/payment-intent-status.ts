import { getStripeServer } from "@/src/lib/stripe-server";

export type PaymentOutcome = "succeeded" | "failed" | "pending" | "incomplete" | "missing";

export async function getPaymentOutcome(
  paymentIntentId: string | null | undefined,
): Promise<PaymentOutcome> {
  const id = paymentIntentId?.trim();
  if (!id) return "missing";

  const stripe = getStripeServer();
  const paymentIntent = await stripe.paymentIntents.retrieve(id);

  switch (paymentIntent.status) {
    case "succeeded":
      return "succeeded";
    case "processing":
      return "pending";
    case "requires_action":
    case "requires_confirmation":
      return "incomplete";
    case "canceled":
    case "requires_payment_method":
      return "failed";
    default:
      return "failed";
  }
}
