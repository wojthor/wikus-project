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
  return raw.filter(isLessonSection);
}
