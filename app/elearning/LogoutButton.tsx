"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={loading}
      className="rounded-lg border border-[#b9c5fe] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-[#7347f4] hover:text-[#7347f4] disabled:opacity-50 sm:px-3 sm:text-xs"
    >
      {loading ? "Wylogowywanie…" : "Wyloguj"}
    </button>
  );
}
