"use client";

import type { LessonRef } from "@/src/features/elearning/lesson-navigation";

type LessonLinkTileProps = {
  content: string;
  canNavigate: boolean;
  onNavigate?: (ref: LessonRef) => void;
  targetRef?: LessonRef;
};

export function LessonLinkTile({
  content,
  canNavigate,
  onNavigate,
  targetRef,
}: LessonLinkTileProps) {
  const tileClass =
    "my-4 w-full rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-[18px] py-3.5 text-left transition-all duration-150";
  const interactiveClass = canNavigate
    ? "cursor-pointer hover:scale-[1.02] active:scale-[0.99] hover:shadow-[0_2px_12px_rgba(29,78,216,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/35"
    : "";

  const tileBody = (
    <>
      <div className="mb-1 text-[11px] font-bold tracking-[0.1em] text-[#1D4ED8] uppercase">
        📎 Odwołanie do lekcji
      </div>
      <div className="text-sm leading-snug text-[#1E3A5F]">{content}</div>
    </>
  );

  if (canNavigate && targetRef && onNavigate) {
    return (
      <button
        type="button"
        onClick={() => onNavigate(targetRef)}
        className={`${tileClass} ${interactiveClass} border-0`}
      >
        {tileBody}
      </button>
    );
  }

  return <div className={tileClass}>{tileBody}</div>;
}
