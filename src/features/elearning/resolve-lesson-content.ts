import {
  applyLessonLinkTargetsFromRows,
  type LessonLinkAdminRow,
} from "@/src/lib/lesson-link-admin";
import {
  expandLessonLinksInSections,
  hasLexicalBody,
  lexicalToLessonContent,
} from "@/src/lib/lexical-to-sections";
import {
  dedupeLessonLinkSections,
  filterRemovedLessonLinks,
  normalizeLessonSections,
  type LessonSection,
} from "@/src/features/elearning/lesson-section-types";

export type LessonContentSource = {
  content?: Record<string, unknown> | null;
  lessonIntro?: string | null;
  contentSections?: unknown;
  lessonLinks?: LessonLinkAdminRow[] | null;
};

function finalizeSections(sections: LessonSection[]): LessonSection[] {
  return filterRemovedLessonLinks(
    dedupeLessonLinkSections(expandLessonLinksInSections(sections)),
  );
}

/**
 * Treść na e-learning — wyłącznie z Payload.
 * Źródło prawdy: pole „Treść lekcji” (Lexical); cele linków z lessonLinks.
 * contentSections to kopia techniczna po zapisie, nie nadpisuje Lexical przy wyświetlaniu.
 */
export function resolveLessonContentFromPayload(doc: LessonContentSource): {
  intro: string | null;
  sections: LessonSection[];
} {
  if (hasLexicalBody(doc.content)) {
    const parsed = lexicalToLessonContent(doc.content);
    const intro = parsed.intro ?? doc.lessonIntro?.trim() ?? null;
    const withTargets = applyLessonLinkTargetsFromRows(
      parsed.sections,
      doc.lessonLinks,
    );

    return {
      intro,
      sections: finalizeSections(withTargets),
    };
  }

  const stored = normalizeLessonSections(doc.contentSections);
  const intro = doc.lessonIntro?.trim() ?? null;

  if (stored.length) {
    const withTargets = applyLessonLinkTargetsFromRows(stored, doc.lessonLinks);
    return { intro, sections: finalizeSections(withTargets) };
  }

  return { intro, sections: [] };
}
