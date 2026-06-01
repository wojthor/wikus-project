"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { LogoutButton } from "@/app/elearning/LogoutButton";

const NAV_LINKS = [
  { href: "/", label: "Strona główna" },
  { href: "/unschool", label: "Unschool" },
  { href: "/elearning", label: "Platforma e-learning" },
] as const;

type ElearningMobileMenuProps = {
  user?: {
    displayName: string;
    isCourseAdmin: boolean;
  } | null;
};

export function ElearningMobileMenu({ user }: ElearningMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const menuPortal =
    open && mounted
      ? createPortal(
          <>
            <button
              type="button"
              className="fixed inset-0 z-[200] bg-slate-900/50 backdrop-blur-sm"
              aria-label="Zamknij menu"
              onClick={() => setOpen(false)}
            />
            <div className="fixed top-0 right-0 z-[210] flex h-full w-[min(100%,280px)] flex-col border-l border-[#b9c5fe] bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#dfe6ff] bg-[#f8faff] px-4 py-3">
                <span className="text-sm font-bold text-[#7347f4]">Menu</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-800"
                  aria-label="Zamknij menu"
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>

              <nav
                className="flex flex-1 flex-col gap-1 bg-white p-3"
                aria-label="Nawigacja mobilna"
              >
                {NAV_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-[#f8faff] px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-[#eef2ff] hover:text-[#7347f4]"
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              {user && (
                <div className="border-t border-[#dfe6ff] bg-[#f8faff] p-4">
                  <p className="mb-3 truncate text-sm font-medium text-slate-600">
                    {user.isCourseAdmin ? `${user.displayName} (admin)` : user.displayName}
                  </p>
                  <LogoutButton />
                </div>
              )}
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#b9c5fe] bg-white text-slate-700 transition hover:border-[#7347f4] hover:text-[#7347f4]"
        aria-label="Otwórz menu"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" strokeWidth={2} />
      </button>
      {menuPortal}
    </div>
  );
}
