"use client";

import { LexicalContent } from "@/src/features/elearning/components/LexicalContent";
import { LessonSectionBlock } from "@/src/features/elearning/components/LessonSectionBlock";
import {
  normalizeLessonSections,
  type LessonSection,
} from "@/src/features/elearning/lesson-section-types";

type LessonContentViewProps = {
  intro?: string | null;
  sections?: unknown;
  content: Record<string, unknown> | null;
  onNavigateLesson?: (legacySlug: string) => void;
};

export function LessonContentView({
  intro,
  sections: sectionsRaw,
  content,
  onNavigateLesson,
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
            onNavigateLesson={onNavigateLesson}
          />
        ))}
      </div>
    );
  }

  return <LexicalContent content={content} />;
}
