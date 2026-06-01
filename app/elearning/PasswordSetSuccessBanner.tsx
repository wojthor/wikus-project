"use client";

import { useSearchParams } from "next/navigation";

export function PasswordSetSuccessBanner() {
  const searchParams = useSearchParams();
  if (searchParams.get("hasloUstawione") !== "1") return null;

  return (
    <div className="mx-auto mb-4 max-w-md rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-900">
      Hasło zostało ustawione. Zaloguj się poniżej, aby wejść na platformę.
    </div>
  );
}
