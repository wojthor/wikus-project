"use client";

import { MODULE_ACCENTS, type ModuleAccentId } from "../theme";

export function ModuleTag({
  children,
  accent = "brand",
}: {
  children: React.ReactNode;
  accent?: ModuleAccentId;
}) {
  const a = MODULE_ACCENTS[accent];
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${a.tag}`}
    >
      {children}
    </span>
  );
}
