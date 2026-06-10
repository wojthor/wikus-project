"use client";

import { useEffect, useRef } from "react";

import { META_PURCHASE_CURRENCY, META_PURCHASE_VALUE } from "@/src/lib/meta-conversions-api";

type MetaPurchaseTrackerProps = {
  paymentIntentId: string;
};

export function MetaPurchaseTracker({ paymentIntentId }: MetaPurchaseTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current || !paymentIntentId) return;
    trackedRef.current = true;

    const storageKey = `meta-purchase-${paymentIntentId}`;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(storageKey)) return;

    if (window.fbq) {
      window.fbq(
        "track",
        "Purchase",
        { currency: META_PURCHASE_CURRENCY, value: META_PURCHASE_VALUE },
        { eventID: paymentIntentId },
      );
      sessionStorage.setItem(storageKey, "1");
    }
  }, [paymentIntentId]);

  return null;
}
