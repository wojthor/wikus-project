import type { ElearningModule } from "./types";

export type LessonRef = {
  modIndex: number;
  lessonIndex: number;
  title: string;
};

export function buildLegacySlugLessonMap(
  modules: ElearningModule[],
): Map<string, LessonRef> {
  const map = new Map<string, LessonRef>();
  modules.forEach((mod, modIndex) => {
    mod.lessons.forEach((lesson, lessonIndex) => {
      const slug = lesson.legacySlug?.trim();
      if (slug) {
        map.set(slug, { modIndex, lessonIndex, title: lesson.title });
      }
    });
  });
  return map;
}

export function findLessonByLegacySlug(
  modules: ElearningModule[],
  legacySlug: string,
): LessonRef | null {
  return buildLegacySlugLessonMap(modules).get(legacySlug.trim()) ?? null;
}
