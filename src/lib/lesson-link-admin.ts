import type { Payload } from "payload";

import {
  dedupeLessonLinkSections,
  type LessonSection,
} from "@/src/features/elearning/lesson-section-types";
import {
  hasLexicalBody,
  lexicalToLessonContent,
} from "@/src/lib/lexical-to-sections";

export type LessonLinkAdminRow = {
  label?: string | null;
  targetLesson?: number | string | { id?: number | string; legacySlug?: string | null } | null;
};

function relationshipId(value: LessonLinkAdminRow["targetLesson"]): string | number | null {
  if (value == null) return null;
  if (typeof value === "number" || typeof value === "string") return value;
  if (typeof value === "object" && value.id != null) return value.id;
  return null;
}

export function hasValidLessonTarget(row: LessonLinkAdminRow | null | undefined): boolean {
  return relationshipId(row?.targetLesson) != null;
}

/** Slug z wiersza admina (gdy relationship jest już załadowany, depth ≥ 1). */
export function legacySlugFromLessonLinkRow(
  row: LessonLinkAdminRow | undefined,
): string | null {
  const target = row?.targetLesson;
  if (target == null) return null;
  if (
    typeof target === "object" &&
    "legacySlug" in target &&
    typeof target.legacySlug === "string"
  ) {
    const slug = target.legacySlug.trim();
    return slug || null;
  }
  return null;
}

/** Jedna pozycja na każdy akapit 📎 w Lexical — bez starych wierszy z bazy. */
export function lessonLinksRowsFromLexical(
  content: Record<string, unknown> | null | undefined,
  existing: LessonLinkAdminRow[] | null | undefined,
): LessonLinkAdminRow[] {
  if (!hasLexicalBody(content)) return [];

  const parsed = lexicalToLessonContent(content);
  const links = parsed.sections.filter((s) => s.type === "lessonlink");
  const prev = Array.isArray(existing) ? existing : [];

  return links.map((link, index) => ({
    label: link.content?.trim() || null,
    targetLesson: prev[index]?.targetLesson ?? null,
  }));
}

/** Nakłada docelowe lekcje z pola lessonLinks (kolejność = kolejność 📎). */
export function applyLessonLinkTargetsFromRows(
  sections: LessonSection[],
  rows: LessonLinkAdminRow[] | null | undefined,
): LessonSection[] {
  const configs = Array.isArray(rows) ? rows : [];
  let linkIdx = 0;

  return sections.map((section) => {
    if (section.type !== "lessonlink") return section;

    const slug = legacySlugFromLessonLinkRow(configs[linkIdx++]);
    if (!slug) return { ...section, target: undefined };

    return { ...section, target: slug };
  });
}

export async function resolveLessonLegacySlug(
  payload: Payload,
  targetLesson: LessonLinkAdminRow["targetLesson"],
): Promise<string | null> {
  const id = relationshipId(targetLesson);
  if (id == null) return null;

  try {
    const doc = await payload.findByID({
      collection: "lessons",
      id,
      depth: 0,
      overrideAccess: true,
    });
    const slug = typeof doc.legacySlug === "string" ? doc.legacySlug.trim() : "";
    return slug || null;
  } catch {
    return null;
  }
}

export async function applyLessonLinkTargetsFromAdmin(
  payload: Payload,
  sections: LessonSection[],
  rows: LessonLinkAdminRow[] | null | undefined,
): Promise<LessonSection[]> {
  const configs = Array.isArray(rows) ? rows : [];
  let linkIdx = 0;

  const updated = await Promise.all(
    sections.map(async (section) => {
      if (section.type !== "lessonlink") return section;

      const row = configs[linkIdx++];
      const slug = await resolveLessonLegacySlug(payload, row?.targetLesson);
      if (!slug) return { ...section, target: undefined };

      return { ...section, target: slug };
    }),
  );

  return dedupeLessonLinkSections(updated);
}

export async function syncLessonFromLexical(
  payload: Payload,
  content: Record<string, unknown> | null | undefined,
  lessonLinks: LessonLinkAdminRow[] | null | undefined,
): Promise<{
  lessonIntro: string | null;
  contentSections: LessonSection[];
  lessonLinks: LessonLinkAdminRow[];
} | null> {
  if (!hasLexicalBody(content)) return null;

  const parsed = lexicalToLessonContent(content);
  const rows = lessonLinksRowsFromLexical(content, lessonLinks);
  const withTargets = await applyLessonLinkTargetsFromAdmin(
    payload,
    parsed.sections,
    rows,
  );

  return {
    lessonIntro: parsed.intro,
    contentSections: withTargets,
    lessonLinks: rows,
  };
}
