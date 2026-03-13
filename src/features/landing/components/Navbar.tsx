"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";

type NavbarProps = {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Navbar({ menuOpen, setMenuOpen }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg shadow-[0_1px_30px_rgba(0,0,0,0.15)]">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between">
        <Link href="#top" className="text-[#7347f4] font-extrabold text-base sm:text-lg tracking-wider hover:opacity-90 transition-opacity">
          SZYCHA
        </Link>
        <div className="hidden md:flex gap-1 sm:gap-2 text-[#7347f4] font-bold text-sm">
          <Link href="#fakty" className="rounded-full px-3 py-2 hover:bg-[#cfd8ff]/50 transition-colors">Fakty</Link>
          <Link href="#oferta" className="rounded-full px-3 py-2 hover:bg-[#cfd8ff]/50 transition-colors">Oferta</Link>
          <Link href="#o-mnie" className="rounded-full px-3 py-2 hover:bg-[#cfd8ff]/50 transition-colors">O mnie</Link>
          <Link href="#opinie" className="rounded-full px-3 py-2 hover:bg-[#cfd8ff]/50 transition-colors">Opinie</Link>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden p-2 rounded-lg text-[#7347f4] hover:bg-[#cfd8ff]/50 transition-colors"
          aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg border-t border-[#b9c5fe]/30">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            <Link href="#fakty" onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-[#7347f4] font-bold hover:bg-[#cfd8ff]/50 transition-colors">Fakty</Link>
            <Link href="#oferta" onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-[#7347f4] font-bold hover:bg-[#cfd8ff]/50 transition-colors">Oferta</Link>
            <Link href="#o-mnie" onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-[#7347f4] font-bold hover:bg-[#cfd8ff]/50 transition-colors">O mnie</Link>
            <Link href="#opinie" onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-[#7347f4] font-bold hover:bg-[#cfd8ff]/50 transition-colors">Opinie</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
