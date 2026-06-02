import mockupCourse from "@/src/data/course-mockup/course.json";

import type { LessonSection } from "@/src/features/elearning/lesson-section-types";

type MockupLessonRef = {
  intro?: string;
  sections?: LessonSection[];
};

/** Fallback sekcji z course.json (gdy w DB brak contentSections). */
export function getMockupLessonByLegacySlug(legacySlug: string): MockupLessonRef | null {
  for (const mod of mockupCourse as { lessons: { id: string; intro?: string; sections?: LessonSection[] }[] }[]) {
    const lesson = mod.lessons.find((l) => l.id === legacySlug);
    if (lesson) {
      return { intro: lesson.intro, sections: lesson.sections };
    }
  }
  return null;
}
