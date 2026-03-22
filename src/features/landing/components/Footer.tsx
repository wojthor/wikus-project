import Link from "next/link";
import { Mail, Phone, Facebook, Instagram } from "lucide-react";
import type { FooterData } from "@/data/content";

type FooterProps = {
  data: FooterData;
};

export function Footer({ data }: FooterProps) {
  return (
    <footer className="border-t border-[#cfd8ff] bg-white mt-12 sm:mt-16">
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4 sm:px-6 sm:pt-10 sm:pb-6 md:px-8 lg:px-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        <div className="sm:col-span-2 space-y-2">
          <h4 className="text-[#3e57d6] font-extrabold text-lg sm:text-xl">{data.name}</h4>
          <p className="text-slate-600 text-sm sm:text-base">{data.tagline}</p>
        </div>
        <div className="space-y-2">
          <h5 className="font-bold text-slate-500 uppercase tracking-wider text-xs">{data.navHeading}</h5>
          <div className="flex flex-col gap-1 text-sm sm:text-base font-medium text-slate-700">
            {data.navLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <h5 className="font-bold text-slate-500 uppercase tracking-wider text-xs">{data.contactHeading}</h5>
          <a
            href={`mailto:${data.email}`}
            className="flex items-center gap-2 text-sm text-slate-700 hover:underline"
          >
            <Mail className="w-4 h-4 shrink-0" />
            {data.email}
          </a>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <Phone className="w-4 h-4 shrink-0" aria-hidden />
            <span suppressHydrationWarning>{data.phoneDisplay}</span>
          </div>
          <div className="flex gap-3 pt-1">
            <a
              href={data.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={data.facebookAriaLabel}
              className="w-9 h-9 rounded-full bg-[#cfd8ff] text-[#3e57d6] flex items-center justify-center hover:bg-[#b9c5fe] transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={data.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={data.instagramAriaLabel}
              className="w-9 h-9 rounded-full bg-[#cfd8ff] text-[#3e57d6] flex items-center justify-center hover:bg-[#b9c5fe] transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-[#e2e7ff]">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6 sm:py-4 md:px-8 lg:px-12">
          <p className="text-center text-[11px] sm:text-xs text-slate-500 space-x-1">
            <span>
              {data.poweredByLead}{" "}
              <a
                href={data.poweredByUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#7347f4] hover:underline"
              >
                {data.poweredByName}
              </a>{" "}
              © {data.copyrightYear}
            </span>
            <span className="inline-block">{data.bottomSeparator}</span>
            <span>
              {data.visualConceptLead}{" "}
              <a
                href={data.visualConceptMailHref}
                className="font-medium text-[#ffa515] hover:underline"
              >
                {data.visualConceptLinkText}
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
