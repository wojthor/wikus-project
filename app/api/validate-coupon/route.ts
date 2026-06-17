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
    const promos = await stripe.promotionCodes.list({
      code,
      active: true,
      limit: 1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expand: ["data.coupon"] as any,
    });
    const promo = promos.data[0];

    if (!promo) {
      return NextResponse.json({ valid: false, error: "Nieprawidłowy lub nieaktywny kod rabatowy." });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawCoupon = (promo as any).coupon;
    console.log("[validate-coupon] rawCoupon type:", typeof rawCoupon, "value:", JSON.stringify(rawCoupon));

    let percentOff: number | null = null;
    let amountOff: number | null = null;

    if (typeof rawCoupon === "string") {
      // Still an ID despite expand — retrieve explicitly
      const full = await stripe.coupons.retrieve(rawCoupon);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      percentOff = (full as any).percent_off ?? null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      amountOff = (full as any).amount_off ?? null;
    } else if (rawCoupon && typeof rawCoupon === "object") {
      percentOff = rawCoupon.percent_off ?? null;
      amountOff = rawCoupon.amount_off ?? null;
    }

    console.log("[validate-coupon] percentOff:", percentOff, "amountOff:", amountOff);

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
      console.error("[validate-coupon] neither percentOff nor amountOff found, rawCoupon:", JSON.stringify(rawCoupon));
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
