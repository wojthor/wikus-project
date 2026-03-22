"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { NavbarData } from "@/data/content";

type NavbarProps = {
  data: NavbarData;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Navbar({ data, menuOpen, setMenuOpen }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg shadow-[0_1px_30px_rgba(0,0,0,0.15)]">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between">
        <Link
          href={data.brand.href}
          className="text-[#7347f4] font-extrabold text-base sm:text-lg tracking-wider hover:opacity-90 transition-opacity"
        >
          {data.brand.label}
        </Link>
        <div className="hidden md:flex gap-1 sm:gap-2 text-[#7347f4] font-bold text-sm">
          {data.linksDesktop.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 hover:bg-[#cfd8ff]/50 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden p-2 rounded-lg text-[#7347f4] hover:bg-[#cfd8ff]/50 transition-colors"
          aria-label={menuOpen ? data.ariaCloseMenu : data.ariaOpenMenu}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg border-t border-[#b9c5fe]/30">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            {data.linksMobile.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-[#7347f4] font-bold hover:bg-[#cfd8ff]/50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
