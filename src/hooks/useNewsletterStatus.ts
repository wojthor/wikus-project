"use client";

import { useCallback, useEffect, useState } from "react";

const DEFAULT_OPEN_DELAY_MS = 5000;

/**
 * Opóźnione otwarcie newslettera + zapamiętanie zamknięcia / zapisu w localStorage.
 */
export function useNewsletterStatus(storageKey: string, openDelayMs = DEFAULT_OPEN_DELAY_MS) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(storageKey)) return;

    const timer = window.setTimeout(() => setIsOpen(true), openDelayMs);
    return () => window.clearTimeout(timer);
  }, [storageKey, openDelayMs]);

  const dismiss = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, "true");
    }
    setIsOpen(false);
  }, [storageKey]);

  /** Tylko zapis w localStorage – modal zostaje otwarty (np. ekran „Dziękujemy”). */
  const markSubscribed = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, "true");
    }
  }, [storageKey]);

  return { isOpen, dismiss, markSubscribed };
}
