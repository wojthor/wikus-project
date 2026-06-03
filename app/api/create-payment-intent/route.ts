import { NextResponse } from "next/server";

import { UNSCHOOL_COURSE_OFFER } from "@/src/features/unschool/course-offer";
import { STRIPE_PAYMENT_METHOD_TYPES } from "@/src/lib/stripe-payment-methods";
import { getStripeServer } from "@/src/lib/stripe-server";

export const dynamic = "force-dynamic";

type CreatePaymentIntentBody = {
  email?: string;
};

type CreatePaymentIntentSuccess = {
  clientSecret: string;
};

type CreatePaymentIntentError = {
  error: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(
  request: Request,
): Promise<NextResponse<CreatePaymentIntentSuccess | CreatePaymentIntentError>> {
  let body: CreatePaymentIntentBody;

  try {
    body = (await request.json()) as CreatePaymentIntentBody;
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane żądania." }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  if (email && !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Podaj poprawny adres e-mail." }, { status: 400 });
  }

  try {
    const stripe = getStripeServer();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: UNSCHOOL_COURSE_OFFER.priceAmountCents,
      currency: "pln",
      payment_method_types: [...STRIPE_PAYMENT_METHOD_TYPES],
      ...(email ? { receipt_email: email } : {}),
      description: UNSCHOOL_COURSE_OFFER.stripeProductName,
      metadata: {
        product: "unschool-course",
        customerEmail: email || "not-provided-yet",
      },
    });

    if (!paymentIntent.client_secret) {
      return NextResponse.json({ error: "Nie udało się utworzyć płatności." }, { status: 500 });
    }

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const stripeMessage =
      err instanceof Error && "type" in err && (err as { type?: string }).type === "StripeInvalidRequestError"
        ? err.message
        : null;
    console.error("[create-payment-intent]", err);
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
