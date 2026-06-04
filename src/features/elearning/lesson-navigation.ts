import type { LessonSection } from "@/src/features/elearning/lesson-section-types";
import type { ElearningModule } from "./types";

export type LessonRef = {
  modIndex: number;
  lessonIndex: number;
  title: string;
  legacySlug: string | null;
};

export type LessonNavigationIndex = {
  bySlug: Map<string, LessonRef>;
  byTitle: Map<string, LessonRef>;
  all: LessonRef[];
};

function normalizeTitle(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function buildLessonNavigationIndex(modules: ElearningModule[]): LessonNavigationIndex {
  const bySlug = new Map<string, LessonRef>();
  const byTitle = new Map<string, LessonRef>();
  const all: LessonRef[] = [];

  modules.forEach((mod, modIndex) => {
    mod.lessons.forEach((lesson, lessonIndex) => {
      const ref: LessonRef = {
        modIndex,
        lessonIndex,
        title: lesson.title,
        legacySlug: lesson.legacySlug?.trim() || null,
      };
      all.push(ref);
      if (ref.legacySlug) {
        bySlug.set(ref.legacySlug, ref);
      }
      byTitle.set(normalizeTitle(lesson.title), ref);
    });
  });

  return { bySlug, byTitle, all };
}

/** @deprecated Użyj buildLessonNavigationIndex */
export function buildLegacySlugLessonMap(modules: ElearningModule[]): Map<string, LessonRef> {
  return buildLessonNavigationIndex(modules).bySlug;
}

export function findLessonByLegacySlug(
  modules: ElearningModule[],
  legacySlug: string,
): LessonRef | null {
  return buildLessonNavigationIndex(modules).bySlug.get(legacySlug.trim()) ?? null;
}

/** Docelowa lekcja tylko z pola lessonLinks w adminie (slug w section.target). */
export function resolveLessonLinkRef(
  section: Pick<LessonSection, "content" | "target">,
  index: LessonNavigationIndex,
): LessonRef | null {
  const target = section.target?.trim();
  if (!target) return null;
  return index.bySlug.get(target) ?? null;
}
