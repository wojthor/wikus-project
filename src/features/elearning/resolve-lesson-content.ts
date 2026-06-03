import {
  hasLexicalBody,
  lexicalToLessonContent,
} from "@/src/lib/lexical-to-sections";
import {
  normalizeLessonSections,
  type LessonSection,
} from "@/src/features/elearning/lesson-section-types";

type LessonContentSource = {
  content?: Record<string, unknown> | null;
  lessonIntro?: string | null;
  contentSections?: unknown;
};

/**
 * Treść lekcji na e-learning — wyłącznie z Payload CMS.
 * course.json służy tylko do seeda (backup), nie do wyświetlania.
 */
export function resolveLessonContentFromPayload(doc: LessonContentSource): {
  intro: string | null;
  sections: LessonSection[];
} {
  if (hasLexicalBody(doc.content)) {
    const parsed = lexicalToLessonContent(doc.content);
    // Zawsze treść z admina (Lexical). Jeśli parser nie zbuduje bloków, UI pokaże surowy richText.
    return {
      intro: parsed.intro ?? doc.lessonIntro?.trim() ?? null,
      sections: parsed.sections,
    };
  }

  const sections = normalizeLessonSections(doc.contentSections);
  if (sections.length) {
    return {
      intro: doc.lessonIntro?.trim() ?? null,
      sections,
    };
  }

  return {
    intro: doc.lessonIntro?.trim() ?? null,
    sections: [],
  };
}
