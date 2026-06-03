import { inferLessonLinkTarget } from "@/src/lib/lexical-to-sections";
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

/**
 * Znajduje lekcję dla kafelka lessonlink: pole target, slug w tekście (1-3)
 * lub tytuł w cudzysłowie / w treści odwołania.
 */
export function resolveLessonLinkRef(
  section: Pick<LessonSection, "content" | "target">,
  index: LessonNavigationIndex,
): LessonRef | null {
  const target = section.target?.trim() ?? inferLessonLinkTarget(section.content ?? "");
  if (target) {
    const byTarget = index.bySlug.get(target);
    if (byTarget) return byTarget;
  }

  const content = section.content?.trim() ?? "";
  if (!content) return null;

  const slugInText = content.match(/lekcj[ięa]?\s+([0-9]+-[0-9]+)/i);
  if (slugInText) {
    const bySlug = index.bySlug.get(slugInText[1]);
    if (bySlug) return bySlug;
  }

  const quotedTitle =
    content.match(/lekcj[ięa]?\s+['"„]([^'""”]+)['"”]/i) ??
    content.match(/lekcj[ięa]?\s+['']([^'']+)['']/i);
  if (quotedTitle) {
    const byTitle = index.byTitle.get(normalizeTitle(quotedTitle[1]));
    if (byTitle) return byTitle;
  }

  // „Wróć do lekcji Błędy są Twoim przyjacielem i posłuchaj…”
  const afterLekcji = content.match(/lekcj[ięa]?\s+(.+?)(?:\s+i\s+|\s+oraz\s+|$)/i);
  if (afterLekcji) {
    const fragment = afterLekcji[1].replace(/^['"„]|['"”]$/g, "").trim();
    const byTitle = index.byTitle.get(normalizeTitle(fragment));
    if (byTitle) return byTitle;
  }

  for (const ref of index.all) {
    if (content.toLowerCase().includes(ref.title.toLowerCase())) {
      return ref;
    }
  }

  return null;
}
