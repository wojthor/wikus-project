import Link from "next/link";

import { ElearningMobileMenu } from "@/app/elearning/ElearningMobileMenu";
import { LogoutButton } from "@/app/elearning/LogoutButton";

const NAV_LINKS = [
  { href: "/", label: "Strona główna" },
  { href: "/unschool", label: "Unschool" },
] as const;

const linkClass =
  "rounded-md px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-[#f8faff] hover:text-[#7347f4]";

function BrandLink() {
  return (
    <Link href="/elearning" className="flex min-w-0 items-center gap-2 transition hover:opacity-90 sm:gap-2.5">
      <div className="min-w-0 leading-tight">
        <span className="block truncate text-xs font-extrabold tracking-tight text-[#7347f4] sm:text-sm">
          Wiktor Szyszkowski
        </span>
        <span className="block truncate text-[10px] font-medium text-slate-500 sm:text-xs">
          Unschool Your English
        </span>
      </div>
      <span className="shrink-0 rounded-full border border-[#b9c5fe] bg-[#f8faff] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#3e57d6] sm:px-2 sm:text-[9px]">
        E-learning
      </span>
    </Link>
  );
}

type ElearningHeaderProps = {
  user?: {
    displayName: string;
    isCourseAdmin: boolean;
  } | null;
};

export function ElearningHeader({ user }: ElearningHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#b9c5fe] bg-white/90 backdrop-blur-lg">
      <div className="flex h-14 w-full items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <BrandLink />

          <nav
            className="hidden shrink-0 items-center gap-1 border-l border-[#dfe6ff] pl-4 sm:flex"
            aria-label="Nawigacja"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={linkClass}>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {user && (
            <>
              <span
                className="hidden max-w-[14rem] truncate text-sm font-medium text-slate-600 md:block"
                title={user.isCourseAdmin ? `${user.displayName} (admin)` : user.displayName}
              >
                {user.isCourseAdmin ? `${user.displayName} (admin)` : user.displayName}
              </span>
              <div className="hidden sm:block">
                <LogoutButton />
              </div>
            </>
          )}
          <ElearningMobileMenu user={user} />
        </div>
      </div>
    </header>
  );
}
