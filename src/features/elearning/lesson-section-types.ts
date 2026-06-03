export type LessonSectionType =
  | "insight"
  | "tip"
  | "reallife"
  | "warning"
  | "fun"
  | "quote"
  | "list"
  | "comparison"
  | "text"
  | "lessonlink";

export type LessonSection = {
  type: LessonSectionType | string;
  icon?: string;
  title?: string;
  content?: string;
  text?: string;
  author?: string;
  items?: string[];
  left?: { label?: string; items?: string[] };
  right?: { label?: string; items?: string[] };
  target?: string;
};

export function isLessonSection(value: unknown): value is LessonSection {
  return typeof value === "object" && value !== null && "type" in value;
}

export function normalizeLessonSections(raw: unknown): LessonSection[] {
  if (!Array.isArray(raw)) return [];
  return dedupeLessonLinkSections(
    filterRemovedLessonLinks(raw.filter(isLessonSection)),
  );
}

/** Usunięte z course.json — nie pokazuj nawet jeśli zostały w Lexical. */
const REMOVED_LESSON_LINK_CONTENT = new Set([
  "Wróć do lekcji 1-0 i przeczytaj co napisałeś na początku kursu.",
]);

function lessonLinkDedupeKey(section: LessonSection): string {
  const target = section.target?.trim() ?? "";
  const content = section.content?.trim() ?? "";
  return `${target}\n${content}`;
}

export function filterRemovedLessonLinks(sections: LessonSection[]): LessonSection[] {
  return sections.filter(
    (section) =>
      !(
        section.type === "lessonlink" &&
        REMOVED_LESSON_LINK_CONTENT.has(section.content?.trim() ?? "")
      ),
  );
}

/** Zostawia ostatnie odwołanie przy tym samym target/treści (usuwa górny duplikat). */
export function dedupeLessonLinkSections(sections: LessonSection[]): LessonSection[] {
  const lastIndexByKey = new Map<string, number>();

  sections.forEach((section, index) => {
    if (section.type === "lessonlink") {
      lastIndexByKey.set(lessonLinkDedupeKey(section), index);
    }
  });

  return sections.filter((section, index) => {
    if (section.type !== "lessonlink") return true;
    return lastIndexByKey.get(lessonLinkDedupeKey(section)) === index;
  });
}
