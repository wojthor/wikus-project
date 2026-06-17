import { NextResponse } from "next/server";

import { UNSCHOOL_COURSE_OFFER } from "@/src/features/unschool/course-offer";
import { getStripeServer } from "@/src/lib/stripe-server";

export const dynamic = "force-dynamic";

type ValidateCouponBody = {
  code: string;
};

export type ValidateCouponSuccess = {
  valid: true;
  discountLabel: string;
  finalAmountCents: number;
  finalAmountDisplay: string;
};

export type ValidateCouponError = {
  valid: false;
  error: string;
};

export type ValidateCouponResponse = ValidateCouponSuccess | ValidateCouponError;

export async function POST(
  request: Request,
): Promise<NextResponse<ValidateCouponResponse>> {
  let body: ValidateCouponBody;
  try {
    body = (await request.json()) as ValidateCouponBody;
  } catch {
    return NextResponse.json({ valid: false, error: "Nieprawidłowe dane." });
  }

  const code = body.code?.trim();
  if (!code) {
    return NextResponse.json({ valid: false, error: "Podaj kod rabatowy." });
  }

  try {
    const stripe = getStripeServer();
    const promos = await stripe.promotionCodes.list({ code, active: true, limit: 1 });
    const promo = promos.data[0];

    if (!promo) {
      return NextResponse.json({ valid: false, error: "Nieprawidłowy lub nieaktywny kod rabatowy." });
    }

    const coupon = promo.coupon;
    const baseAmount = Number(
      process.env.STRIPE_AMOUNT_CENTS ?? String(UNSCHOOL_COURSE_OFFER.priceAmountCents),
    );

    let finalAmountCents: number;
    let discountLabel: string;

    if (coupon.percent_off != null) {
      const discount = Math.round((baseAmount * coupon.percent_off) / 100);
      finalAmountCents = baseAmount - discount;
      discountLabel = `-${coupon.percent_off}%`;
    } else if (coupon.amount_off != null) {
      finalAmountCents = Math.max(50, baseAmount - coupon.amount_off);
      discountLabel = `-${(coupon.amount_off / 100).toFixed(0)} zł`;
    } else {
      return NextResponse.json({ valid: false, error: "Nieobsługiwany typ kuponu." });
    }

    const finalAmountDisplay =
      (finalAmountCents / 100) % 1 === 0
        ? `${finalAmountCents / 100} zł`
        : `${(finalAmountCents / 100).toFixed(2).replace(".", ",")} zł`;

    return NextResponse.json({
      valid: true,
      discountLabel,
      finalAmountCents,
      finalAmountDisplay,
    });
  } catch (err) {
    console.error("[validate-coupon]", err);
    return NextResponse.json({ valid: false, error: "Błąd weryfikacji kodu. Spróbuj ponownie." });
  }
}
