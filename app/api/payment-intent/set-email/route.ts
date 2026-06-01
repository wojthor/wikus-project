import { NextResponse } from "next/server";

import { getStripeServer } from "@/src/lib/stripe-server";

export const dynamic = "force-dynamic";

type SetPaymentIntentEmailBody = {
  paymentIntentId?: string;
  email?: string;
};

type SetPaymentIntentEmailSuccess = {
  success: true;
};

type SetPaymentIntentEmailError = {
  error: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(
  request: Request,
): Promise<NextResponse<SetPaymentIntentEmailSuccess | SetPaymentIntentEmailError>> {
  let body: SetPaymentIntentEmailBody;
  try {
    body = (await request.json()) as SetPaymentIntentEmailBody;
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane żądania." }, { status: 400 });
  }

  const paymentIntentId = body.paymentIntentId?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";

  if (!paymentIntentId) {
    return NextResponse.json({ error: "Brak paymentIntentId." }, { status: 400 });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Podaj poprawny adres e-mail." }, { status: 400 });
  }

  try {
    const stripe = getStripeServer();
    await stripe.paymentIntents.update(paymentIntentId, {
      receipt_email: email,
      metadata: {
        customerEmail: email,
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    const stripeMessage =
      err instanceof Error && "type" in err && (err as { type?: string }).type === "StripeInvalidRequestError"
        ? err.message
        : null;
    console.error("[set-payment-intent-email]", err);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development" && stripeMessage
            ? stripeMessage
            : "Nie udało się zaktualizować danych płatności.",
      },
      { status: 500 },
    );
  }
}
