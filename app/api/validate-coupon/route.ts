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

    // Step 1: find the promotion code ID by human-readable code
    const promos = await stripe.promotionCodes.list({ code, active: true, limit: 1 });
    const promoId = promos.data[0]?.id;

    if (!promoId) {
      return NextResponse.json({ valid: false, error: "Nieprawidłowy lub nieaktywny kod rabatowy." });
    }

    // Step 2: retrieve full promo (newer Stripe API stores coupon under promo.promotion.coupon)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promo = await (stripe.promotionCodes.retrieve as any)(promoId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promoData = promo as any;

    // Support both old structure (promo.coupon) and new structure (promo.promotion.coupon)
    const couponId: string | undefined =
      typeof promoData?.promotion?.coupon === "string"
        ? promoData.promotion.coupon
        : typeof promoData?.coupon === "string"
          ? promoData.coupon
          : undefined;

    if (!couponId) {
      return NextResponse.json({ valid: false, error: "Nie udało się odczytać kuponu." });
    }

    const couponObj = await stripe.coupons.retrieve(couponId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coupon = couponObj as any;

    let percentOff: number | null = coupon.percent_off ?? null;
    let amountOff: number | null = coupon.amount_off ?? null;

    const baseAmount = Number(
      process.env.STRIPE_AMOUNT_CENTS ?? String(UNSCHOOL_COURSE_OFFER.priceAmountCents),
    );

    let finalAmountCents: number;
    let discountLabel: string;

    if (percentOff != null) {
      const discount = Math.round((baseAmount * percentOff) / 100);
      finalAmountCents = baseAmount - discount;
      discountLabel = `-${percentOff}%`;
    } else if (amountOff != null) {
      finalAmountCents = Math.max(50, baseAmount - amountOff);
      discountLabel = `-${(amountOff / 100).toFixed(0)} zł`;
    } else {
      console.error("[validate-coupon] neither percentOff nor amountOff found, couponId:", couponId);
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
