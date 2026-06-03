import type { LessonSection } from "@/src/features/elearning/lesson-section-types";
import type { LessonRef } from "@/src/features/elearning/lesson-navigation";

const CALLOUT_STYLES = {
  insight: {
    box: "bg-[#EFF6FF] border-[#BFDBFE]",
    title: "text-[#1D4ED8]",
    text: "text-[#1E3A5F]",
  },
  tip: {
    box: "bg-[#FFFBEB] border-[#FDE68A]",
    title: "text-[#92400E]",
    text: "text-[#78350F]",
  },
  reallife: {
    box: "bg-[#F0FDF4] border-[#BBF7D0]",
    title: "text-[#15803D]",
    text: "text-[#14532D]",
  },
  warning: {
    box: "bg-[#FEF2F2] border-[#FECACA]",
    title: "text-[#B91C1C]",
    text: "text-[#7F1D1D]",
  },
  fun: {
    box: "bg-[#F0FDFA] border-[#99F6E4]",
    title: "text-[#0F766E]",
    text: "text-[#134E4A]",
  },
} as const;

type LessonSectionBlockProps = {
  section: LessonSection;
  onNavigateLesson?: (legacySlug: string) => void;
  lessonLinkTarget?: LessonRef;
};

export function LessonSectionBlock({
  section,
  onNavigateLesson,
  lessonLinkTarget,
}: LessonSectionBlockProps) {
  const type = section.type;

  if (
    type === "insight" ||
    type === "tip" ||
    type === "reallife" ||
    type === "warning" ||
    type === "fun"
  ) {
    const s = CALLOUT_STYLES[type];
    return (
      <div
        className={`my-5 rounded-xl border px-5 py-[18px] ${s.box}`}
      >
        <div className="flex items-start gap-2.5">
          {section.icon ? (
            <span className="text-xl leading-none" aria-hidden>
              {section.icon}
            </span>
          ) : null}
          <div className="min-w-0 flex-1">
            {section.title ? (
              <div className={`mb-1.5 text-sm font-bold ${s.title}`}>{section.title}</div>
            ) : null}
            {section.content ? (
              <div className={`whitespace-pre-line text-sm leading-[1.75] ${s.text}`}>
                {section.content}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (type === "quote") {
    return (
      <blockquote className="my-6 border-l-4 border-[#D1D5DB] pl-5">
        {section.text ? (
          <p className="text-base leading-relaxed text-[#444444] italic">{section.text}</p>
        ) : null}
        {section.author ? (
          <footer className="mt-2 text-xs text-[#888888]">{section.author}</footer>
        ) : null}
      </blockquote>
    );
  }

  if (type === "list") {
    const items = Array.isArray(section.items)
      ? section.items.filter((i): i is string => typeof i === "string")
      : [];
    return (
      <div className="my-5">
        {section.title ? (
          <div className="mb-3 text-sm font-bold text-[#111111]">{section.title}</div>
        ) : null}
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-[10px] border border-[#E8E6E0] bg-white px-3.5 py-3"
            >
              <div className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F0EEE8] text-[10px] font-bold text-[#888888]">
                {i + 1}
              </div>
              <div className="whitespace-pre-line text-sm leading-relaxed text-[#444444]">
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "comparison") {
    const sides = [
      { side: section.left, variant: "left" as const },
      { side: section.right, variant: "right" as const },
    ];
    return (
      <div className="my-5">
        {section.title ? (
          <div className="mb-3 text-sm font-bold text-[#111111]">{section.title}</div>
        ) : null}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {sides.map(({ side, variant }, si) => {
            if (!side) return null;
            const items = Array.isArray(side.items)
              ? side.items.filter((i): i is string => typeof i === "string")
              : [];
            const isLeft = variant === "left";
            return (
              <div
                key={si}
                className={`rounded-xl border p-4 ${
                  isLeft
                    ? "border-[#FECACA] bg-[#FEF2F2]"
                    : "border-[#BBF7D0] bg-[#F0FDF4]"
                }`}
              >
                {side.label ? (
                  <div
                    className={`mb-2.5 text-[13px] font-bold ${
                      isLeft ? "text-[#B91C1C]" : "text-[#15803D]"
                    }`}
                  >
                    {side.label}
                  </div>
                ) : null}
                {items.map((item, i) => (
                  <div
                    key={i}
                    className={`pb-1 text-[13px] leading-[1.7] ${
                      isLeft ? "text-[#7F1D1D]" : "text-[#14532D]"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === "text" && section.content) {
    return (
      <p className="my-4 text-[15px] leading-[1.75] text-[#444444]">{section.content}</p>
    );
  }

  if (type === "lessonlink") {
    const canNavigate =
      Boolean(onNavigateLesson && section.target?.trim() && lessonLinkTarget);
    const tileClass =
      "my-4 w-full rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-[18px] py-3.5 text-left transition-transform";
    const interactiveClass = canNavigate
      ? "cursor-pointer hover:scale-[1.02] active:scale-[0.99]"
      : "";

    const tileBody = (
      <>
        <div className="mb-1 text-[11px] font-bold tracking-[0.1em] text-[#1D4ED8] uppercase">
          📎 Odwołanie do lekcji
        </div>
        {section.content ? (
          <div className="text-sm leading-snug text-[#1E3A5F]">{section.content}</div>
        ) : null}
      </>
    );

    if (canNavigate) {
      return (
        <button
          type="button"
          onClick={() => onNavigateLesson!(section.target!.trim())}
          className={`${tileClass} ${interactiveClass} border-0`}
        >
          {tileBody}
        </button>
      );
    }

    return <div className={tileClass}>{tileBody}</div>;
  }

  return null;
}
