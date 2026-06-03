"use client";

import { MODULE_ACCENTS, SECTION_BOX, type ModuleAccentId } from "../theme";

export function Tag({ children, accent = "brand" }: { children: React.ReactNode; accent?: ModuleAccentId }) {
  const a = MODULE_ACCENTS[accent];
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${a.tag}`}
    >
      {children}
    </span>
  );
}

export function VideoPlaceholder({ title }: { title: string }) {
  return (
    <div className="mb-7 w-full overflow-hidden rounded-2xl border border-[#b9c5fe] bg-slate-900 shadow-sm">
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 bg-linear-to-br from-slate-900 via-[#16213e] to-[#0f3460] p-6 sm:p-8">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-white/15 sm:h-16 sm:w-16">
          <div className="ml-1 h-0 w-0 border-y-14 border-y-transparent border-l-[22px] border-l-white border-r-0" />
        </div>
        <div className="max-w-md px-2 text-center">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/50 sm:text-xs">
            Wideo lekcja
          </p>
          <p className="text-sm font-semibold leading-snug text-white sm:text-base">{title}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1 border-t border-white/10 bg-slate-950 px-4 py-3 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <span>📎 Wideo zostanie dodane w platformie</span>
        <span className="text-white/30">MP4, max 500MB</span>
      </div>
    </div>
  );
}

type Section = {
  type: string;
  icon?: string;
  title?: string;
  content?: string;
  text?: string;
  author?: string;
  items?: string[];
  left?: { label: string; items: string[] };
  right?: { label: string; items: string[] };
  target?: string;
};

export function SectionBlock({
  section,
  onNavigate,
}: {
  section: Section;
  onNavigate?: (id: string) => void;
}) {
  if (["insight", "tip", "reallife", "warning", "fun"].includes(section.type)) {
    const s = SECTION_BOX[section.type];
    return (
      <div className={`my-5 rounded-xl border p-4 sm:p-5 ${s.box}`}>
        <div className="flex items-start gap-2.5">
          <span className="text-lg shrink-0">{section.icon}</span>
          <div className="min-w-0">
            <p className={`mb-1.5 text-sm font-bold ${s.title}`}>{section.title}</p>
            <p className={`text-sm leading-relaxed whitespace-pre-line ${s.body}`}>{section.content}</p>
          </div>
        </div>
      </div>
    );
  }

  if (section.type === "quote") {
    return (
      <blockquote className="my-6 border-l-4 border-slate-300 pl-5">
        <p className="text-base italic leading-relaxed text-slate-600">{section.text}</p>
        <footer className="mt-2 text-xs text-slate-500">{section.author}</footer>
      </blockquote>
    );
  }

  if (section.type === "list") {
    return (
      <div className="my-5">
        {section.title && (
          <p className="mb-3 text-sm font-bold text-slate-900">{section.title}</p>
        )}
        <ul className="flex flex-col gap-2">
          {section.items?.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl border border-[#dfe6ff] bg-white p-3 sm:p-3.5"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f8faff] text-[10px] font-bold text-slate-500">
                {i + 1}
              </span>
              <span className="min-w-0 text-sm leading-relaxed whitespace-pre-line text-slate-600">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (section.type === "comparison") {
    return (
      <div className="my-5">
        {section.title && (
          <p className="mb-3 text-sm font-bold text-slate-900">{section.title}</p>
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[section.left, section.right].map((side, si) =>
            side ? (
              <div
                key={si}
                className={`rounded-xl border p-4 ${
                  si === 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
                }`}
              >
                <p
                  className={`mb-2.5 text-sm font-bold ${si === 0 ? "text-red-800" : "text-green-800"}`}
                >
                  {side.label}
                </p>
                {side.items.map((item, i) => (
                  <p
                    key={i}
                    className={`pb-1 text-sm leading-relaxed ${si === 0 ? "text-red-900/90" : "text-green-900/90"}`}
                  >
                    {item}
                  </p>
                ))}
              </div>
            ) : null
          )}
        </div>
      </div>
    );
  }

  if (section.type === "text") {
    return (
      <p className="my-4 text-[15px] leading-relaxed text-slate-600">{section.content}</p>
    );
  }

  if (section.type === "lessonlink") {
    const canNavigate = Boolean(onNavigate && section.target?.trim());
    const tileClass =
      "my-4 w-full rounded-xl border border-[#b9c5fe] bg-[#eff6ff] p-4 text-left transition-transform";
    const interactiveClass = canNavigate
      ? "cursor-pointer hover:scale-[1.02] active:scale-[0.99]"
      : "";
    const tileBody = (
      <>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#3e57d6]">
          📎 Odwołanie do lekcji
        </p>
        <p className="text-sm leading-snug text-slate-800">{section.content}</p>
      </>
    );

    if (canNavigate) {
      return (
        <button
          type="button"
          onClick={() => onNavigate!(section.target!.trim())}
          className={`${tileClass} ${interactiveClass}`}
        >
          {tileBody}
        </button>
      );
    }

    return <div className={tileClass}>{tileBody}</div>;
  }

  return null;
}
