import { createHash } from "crypto";

import type Stripe from "stripe";

import { UNSCHOOL_COURSE_OFFER } from "@/src/features/unschool/course-offer";

export const META_PURCHASE_CURRENCY = "PLN";
export const META_PURCHASE_VALUE = UNSCHOOL_COURSE_OFFER.priceAmountCents / 100;

function hashEmail(email: string): string {
  const normalized = email.trim().toLowerCase().replace(/\s+/g, "");
  return createHash("sha256").update(normalized).digest("hex");
}

/** Wysyła zdarzenie Purchase do Meta Conversions API (deduplikacja przez event_id = Payment Intent). */
export async function sendMetaPurchaseConversion(
  paymentIntent: Stripe.PaymentIntent,
  email: string | null,
): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const accessToken = process.env.META_CAPI_TOKEN?.trim();

  if (!pixelId || !accessToken) {
    console.warn("[meta-capi] Brak NEXT_PUBLIC_META_PIXEL_ID lub META_CAPI_TOKEN — pomijam CAPI.");
    return;
  }

  const userData: Record<string, string> = {};
  if (email) {
    userData.em = hashEmail(email);
  }

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_id: paymentIntent.id,
        user_data: userData,
        custom_data: {
          currency: META_PURCHASE_CURRENCY,
          value: META_PURCHASE_VALUE,
        },
      },
    ],
  };

  const testEventCode = process.env.META_TEST_EVENT_CODE?.trim();
  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("[meta-capi] Meta API error:", response.status, body);
    }
  } catch (err) {
    console.error("[meta-capi] Nie udało się wysłać Purchase:", err);
  }
}
