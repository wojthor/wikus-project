import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { UNSCHOOL_COURSE_OFFER } from "@/src/features/unschool/course-offer";
import { STRIPE_PAYMENT_METHOD_TYPES } from "@/src/lib/stripe-payment-methods";
import { getRequestBaseUrl } from "@/src/lib/site-url";
import { getStripeServer } from "@/src/lib/stripe-server";

export const dynamic = "force-dynamic";

type CheckoutSessionCreateParams = NonNullable<
  Parameters<Stripe["checkout"]["sessions"]["create"]>[0]
>;

type CheckoutPaymentMethodType = NonNullable<
  CheckoutSessionCreateParams["payment_method_types"]
>[number];

type CheckoutLineItem = NonNullable<CheckoutSessionCreateParams["line_items"]>[number];

type CheckoutProductData = NonNullable<
  NonNullable<NonNullable<CheckoutLineItem["price_data"]>["product_data"]>
>;

type CheckoutSuccessResponse = {
  sessionId: string;
  url: string | null;
};

type CheckoutErrorResponse = {
  error: string;
};

/** card = karty + Apple Pay / Google Pay; blik i p24 = popularne metody w PL (bez Klarny) */
const PAYMENT_METHOD_TYPES =
  STRIPE_PAYMENT_METHOD_TYPES satisfies readonly CheckoutPaymentMethodType[];

function buildProductData(): CheckoutProductData {
  return {
    name: UNSCHOOL_COURSE_OFFER.stripeProductName,
  };
}

function buildLineItems(): CheckoutLineItem[] {
  const priceId = process.env.STRIPE_PRICE_ID;
  if (priceId) {
    // Przy STRIPE_PRICE_ID ustaw nazwę, opis i zdjęcie produktu w panelu Stripe.
    return [{ price: priceId, quantity: 1 }];
  }

  const amountCents = Number(
    process.env.STRIPE_AMOUNT_CENTS ?? String(UNSCHOOL_COURSE_OFFER.priceAmountCents),
  );
  return [
    {
      price_data: {
        currency: "pln",
        unit_amount: amountCents,
        product_data: buildProductData(),
      },
      quantity: 1,
    },
  ];
}

export async function POST(
  request: Request,
): Promise<NextResponse<CheckoutSuccessResponse | CheckoutErrorResponse>> {
  try {
    const baseUrl = getRequestBaseUrl(request);
    const stripe = getStripeServer();

    const sessionParams: CheckoutSessionCreateParams = {
      mode: "payment",
      payment_method_types: [...PAYMENT_METHOD_TYPES],
      line_items: buildLineItems(),
      locale: "pl",
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/failed`,
      metadata: {
        product: "unschool-course",
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.id) {
      return NextResponse.json(
        { error: "Nie udało się utworzyć sesji płatności." },
        { status: 500 },
      );
    }

    return NextResponse.json({ sessionId: session.id, url: session.url ?? null });
  } catch (err) {
    const stripeMessage =
      err instanceof Error && "type" in err && (err as { type?: string }).type === "StripeInvalidRequestError"
        ? err.message
        : null;
    console.error("[checkout]", err);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development" && stripeMessage
            ? stripeMessage
            : "Wystąpił błąd podczas tworzenia płatności. Spróbuj ponownie.",
      },
      { status: 500 },
    );
  }
}
