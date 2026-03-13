import Link from "next/link";
import { Mail, Phone, Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#cfd8ff] bg-white mt-12 sm:mt-16">
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4 sm:px-6 sm:pt-10 sm:pb-6 md:px-8 lg:px-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        <div className="sm:col-span-2 space-y-2">
          <h4 className="text-[#3e57d6] font-extrabold text-lg sm:text-xl">Szycha</h4>
          <p className="text-slate-600 text-sm sm:text-base">Angielski, który w końcu otwiera drzwi</p>
        </div>
        <div className="space-y-2">
          <h5 className="font-bold text-slate-500 uppercase tracking-wider text-xs">Nawigacja</h5>
          <div className="flex flex-col gap-1 text-sm sm:text-base font-medium text-slate-700">
            <Link href="#fakty">Fakty</Link>
            <Link href="#oferta">Oferta</Link>
            <Link href="#o-mnie">O mnie</Link>
            <Link href="#opinie">Opinie</Link>
          </div>
        </div>
        <div className="space-y-2">
          <h5 className="font-bold text-slate-500 uppercase tracking-wider text-xs">Kontakt</h5>
          <div className="flex items-center gap-2 text-sm text-slate-700"><Mail className="w-4 h-4 flex-shrink-0"/> kontakt@example.com</div>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <Phone className="w-4 h-4 flex-shrink-0" aria-hidden />
            <span suppressHydrationWarning>+48 000 000 000</span>
          </div>
          <div className="flex gap-3 pt-1">
            <div className="w-9 h-9 rounded-full bg-[#cfd8ff] text-[#3e57d6] flex items-center justify-center"><Facebook className="w-4 h-4"/></div>
            <div className="w-9 h-9 rounded-full bg-[#cfd8ff] text-[#3e57d6] flex items-center justify-center"><Instagram className="w-4 h-4"/></div>
          </div>
        </div>
      </div>
      <div className="border-t border-[#e2e7ff]">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6 sm:py-4 md:px-8 lg:px-12">
          <p className="text-center text-[11px] sm:text-xs text-slate-500 space-x-1">
            <span>
              Powered by{" "}
              <a
                href="https://aniszewski-code.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#7347f4] hover:underline"
              >
                Wojciech Aniszewski
              </a>{" "}
              © 2026
            </span>
            <span className="inline-block">·</span>
            <span>
              Visual concept by{" "}
              <a
                href="mailto:wilczynska.visuals@gmail.com"
                className="font-medium text-[#ffa515] hover:underline"
              >
                wilczynska.visuals
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
