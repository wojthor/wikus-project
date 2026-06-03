"use client";

import { LexicalContent } from "@/src/features/elearning/components/LexicalContent";
import { LessonSectionBlock } from "@/src/features/elearning/components/LessonSectionBlock";
import {
  normalizeLessonSections,
  type LessonSection,
} from "@/src/features/elearning/lesson-section-types";
import {
  resolveLessonLinkRef,
  type LessonNavigationIndex,
  type LessonRef,
} from "@/src/features/elearning/lesson-navigation";

type LessonContentViewProps = {
  intro?: string | null;
  sections?: unknown;
  content: Record<string, unknown> | null;
  onNavigateToLesson?: (ref: LessonRef) => void;
  lessonNavIndex?: LessonNavigationIndex;
};

export function LessonContentView({
  intro,
  sections: sectionsRaw,
  content,
  onNavigateToLesson,
  lessonNavIndex,
}: LessonContentViewProps) {
  const sections = normalizeLessonSections(sectionsRaw);

  if (sections.length > 0) {
    return (
      <div className="lesson-sections">
        {intro?.trim() ? (
          <p className="mb-7 border-b border-[#F0EEE8] pb-7 text-base leading-relaxed text-[#444444]">
            {intro.trim()}
          </p>
        ) : null}
        {sections.map((section: LessonSection, index) => (
          <LessonSectionBlock
            key={`${section.type}-${index}`}
            section={section}
            onNavigateToLesson={onNavigateToLesson}
            lessonLinkTarget={
              section.type === "lessonlink" && lessonNavIndex
                ? (resolveLessonLinkRef(section, lessonNavIndex) ?? undefined)
                : undefined
            }
          />
        ))}
      </div>
    );
  }

  return <LexicalContent content={content} />;
}
