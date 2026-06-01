"use client";

import { useEffect, useState } from "react";

/** Unika błędów hydratacji w custom polach Payload (SSR vs klient po HMR). */
export function useClientMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

/** Pusty placeholder zgodny między SSR a pierwszym renderem klienta. */
export function AdminFieldPlaceholder(): null {
  return null;
}
