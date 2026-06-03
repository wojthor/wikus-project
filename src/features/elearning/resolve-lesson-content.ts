import {
  expandLessonLinksInSections,
  hasLexicalBody,
  lexicalToLessonContent,
  stripEmbeddedLessonLinkLines,
} from "@/src/lib/lexical-to-sections";
import {
  dedupeLessonLinkSections,
  filterRemovedLessonLinks,
  normalizeLessonSections,
  type LessonSection,
} from "@/src/features/elearning/lesson-section-types";

type LessonContentSource = {
  content?: Record<string, unknown> | null;
  lessonIntro?: string | null;
  contentSections?: unknown;
};

function countLessonLinks(sections: LessonSection[]): number {
  return sections.filter((s) => s.type === "lessonlink").length;
}

/** Uzupełnia target (np. 1-3) z zapisanej struktury CMS, gdy w Lexical zniknął slug. */
function applyStoredLessonLinkTargets(
  sections: LessonSection[],
  stored: LessonSection[],
): LessonSection[] {
  const storedLinks = stored.filter(
    (s) => s.type === "lessonlink" && s.target?.trim(),
  );
  if (!storedLinks.length) return sections;

  let linkIdx = 0;
  return sections.map((section) => {
    if (section.type !== "lessonlink" || section.target?.trim()) {
      return section;
    }
    const storedLink = storedLinks[linkIdx++];
    if (!storedLink?.target) return section;
    return { ...section, target: storedLink.target };
  });
}

/**
 * Gdy parser Lexical wchłonął link do innego bloku — przywróć osobne lessonlink z contentSections
 * i zaktualizuj tekst pozostałych bloków z Lexical.
 */
function mergeParsedTextWithStoredStructure(
  parsed: LessonSection[],
  stored: LessonSection[],
): LessonSection[] {
  const nonLinkParsed = parsed
    .filter((s) => s.type !== "lessonlink")
    .map((s) =>
      s.content
        ? { ...s, content: stripEmbeddedLessonLinkLines(s.content) }
        : s,
    );

  let parsedIdx = 0;
  const parsedLinks = parsed.filter((s) => s.type === "lessonlink");

  const findParsedLinkForStored = (storedLink: LessonSection) => {
    const target = storedLink.target?.trim();
    if (target) {
      return parsedLinks.find((l) => l.target?.trim() === target);
    }
    const content = storedLink.content?.trim();
    if (content) {
      return parsedLinks.find((l) => l.content?.trim() === content);
    }
    return undefined;
  };

  return stored.map((storedSection) => {
    if (storedSection.type === "lessonlink") {
      const parsedLink = findParsedLinkForStored(storedSection);
      const parsedContent = parsedLink?.content?.trim();
      const parsedTarget = parsedLink?.target?.trim();
      const storedTarget = storedSection.target?.trim();
      const useParsedContent =
        Boolean(parsedContent) &&
        (!parsedTarget || !storedTarget || parsedTarget === storedTarget);

      return {
        ...storedSection,
        content: useParsedContent ? parsedContent : storedSection.content,
        target: storedTarget || parsedTarget || storedSection.target,
      };
    }

    const fromParsed = nonLinkParsed[parsedIdx++];
    if (!fromParsed) return storedSection;

    return {
      ...storedSection,
      ...(fromParsed.title ? { title: fromParsed.title } : {}),
      ...(fromParsed.content ? { content: fromParsed.content } : {}),
      ...(fromParsed.icon ? { icon: fromParsed.icon } : {}),
      ...(fromParsed.text ? { text: fromParsed.text } : {}),
      ...(fromParsed.author ? { author: fromParsed.author } : {}),
      ...(fromParsed.items ? { items: fromParsed.items } : {}),
      ...(fromParsed.left ? { left: fromParsed.left } : {}),
      ...(fromParsed.right ? { right: fromParsed.right } : {}),
    };
  });
}

function finalizeLessonSections(
  sections: LessonSection[],
  stored: LessonSection[],
): LessonSection[] {
  return filterRemovedLessonLinks(
    dedupeLessonLinkSections(
      applyStoredLessonLinkTargets(expandLessonLinksInSections(sections), stored),
    ),
  );
}

function finishLessonContent(
  intro: string | null,
  sections: LessonSection[],
  stored: LessonSection[],
): { intro: string | null; sections: LessonSection[] } {
  return {
    intro,
    sections: finalizeLessonSections(sections, stored),
  };
}

/**
 * Treść lekcji na e-learning — z Payload CMS (Lexical + contentSections).
 * course.json tylko do seeda, nie do wyświetlania.
 */
export function resolveLessonContentFromPayload(doc: LessonContentSource): {
  intro: string | null;
  sections: LessonSection[];
} {
  const stored = normalizeLessonSections(doc.contentSections);

  if (hasLexicalBody(doc.content)) {
    const parsed = lexicalToLessonContent(doc.content);
    const intro = parsed.intro ?? doc.lessonIntro?.trim() ?? null;

    const storedLinkCount = countLessonLinks(stored);

    if (storedLinkCount > 0) {
      return finishLessonContent(
        intro,
        mergeParsedTextWithStoredStructure(parsed.sections, stored),
        stored,
      );
    }

    return finishLessonContent(intro, parsed.sections, stored);
  }

  if (stored.length) {
    const intro = doc.lessonIntro?.trim() ?? null;
    return finishLessonContent(intro, stored, stored);
  }

  const intro = doc.lessonIntro?.trim() ?? null;
  return finishLessonContent(intro, [], []);
}
