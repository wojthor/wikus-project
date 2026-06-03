import {
  normalizeLessonSections,
  type LessonSection,
} from "@/src/features/elearning/lesson-section-types";

type LexicalNode = {
  type?: string;
  tag?: string;
  text?: string;
  children?: LexicalNode[];
  listType?: string;
};

const ICON_TO_TYPE: Record<string, LessonSection["type"]> = {
  "👋": "insight",
  "💡": "insight",
  "✈️": "reallife",
  "🌍": "reallife",
  "😤": "warning",
  "🎯": "tip",
  "😶": "fun",
  "🔄": "insight",
  "📱": "reallife",
  "🎓": "insight",
};

function collectText(node: LexicalNode | undefined): string {
  if (!node) return "";
  if (node.type === "text" && typeof node.text === "string") {
    return node.text;
  }
  if (!Array.isArray(node.children)) return "";
  return node.children.map(collectText).join("");
}

function paragraphText(node: LexicalNode): string {
  if (node.type !== "paragraph") return "";
  return collectText(node).trim();
}

function splitIconTitle(label: string): { icon?: string; title: string } {
  const trimmed = label.trim();
  const match = trimmed.match(/^(\p{Extended_Pictographic})\s*(.*)$/u);
  if (!match) return { title: trimmed };
  const icon = match[1];
  const title = match[2]?.trim() || trimmed;
  return { icon, title };
}

function typeFromIcon(icon?: string): LessonSection["type"] {
  if (!icon) return "insight";
  return ICON_TO_TYPE[icon] ?? "insight";
}

function listItems(node: LexicalNode): string[] {
  if (node.type !== "list" || !Array.isArray(node.children)) return [];
  return node.children
    .map((item) => collectText(item).trim())
    .filter(Boolean);
}

function parseLessonLinkParagraph(text: string): LessonSection | null {
  const match = text.match(/^📎\s*(.+?)\s*\(lekcja\s+([^)]+)\)\s*$/);
  if (!match) return null;
  return {
    type: "lessonlink",
    content: match[1].trim(),
    target: match[2].trim(),
  };
}

function parseQuote(node: LexicalNode): LessonSection {
  const parts = (node.children ?? [])
    .map(paragraphText)
    .filter(Boolean);
  const text = parts[0] ?? "";
  const author = parts[1];
  return {
    type: "quote",
    text,
    ...(author ? { author } : {}),
  };
}

function parseH3Block(
  children: LexicalNode[],
  start: number,
): { section: LessonSection; nextIndex: number } {
  const heading = children[start];
  const label = collectText(heading).trim();
  let i = start + 1;
  const body: string[] = [];

  while (i < children.length) {
    const node = children[i];
    if (node.type === "heading" && node.tag === "h3") break;
    if (node.type === "quote") break;
    if (node.type === "list") break;
    if (node.type === "paragraph") {
      const text = paragraphText(node);
      const link = parseLessonLinkParagraph(text);
      if (link) {
        return { section: link, nextIndex: i + 1 };
      }
      if (text) body.push(text);
    }
    i++;
  }

  const { icon, title } = splitIconTitle(label);
  return {
    section: {
      type: typeFromIcon(icon),
      ...(icon ? { icon } : {}),
      title,
      content: body.join("\n\n"),
    },
    nextIndex: i,
  };
}

function parseComparison(
  children: LexicalNode[],
  start: number,
): { section: LessonSection; nextIndex: number } {
  const title = collectText(children[start]).trim();
  let i = start + 1;
  const left: { label?: string; items?: string[] } = {};
  const right: { label?: string; items?: string[] } = {};

  for (const side of [left, right] as const) {
    if (i >= children.length) break;
    const node = children[i];
    if (node.type !== "heading" || node.tag !== "h3") break;
    side.label = collectText(node).trim();
    i++;
    if (i < children.length && children[i].type === "list") {
      side.items = listItems(children[i]);
      i++;
    }
  }

  return {
    section: {
      type: "comparison",
      title,
      left,
      right,
    },
    nextIndex: i,
  };
}

export function hasLexicalBody(content: Record<string, unknown> | null | undefined): boolean {
  const root = content?.root as LexicalNode | undefined;
  return Array.isArray(root?.children) && root.children.length > 0;
}

/** Konwersja Lexical (pole „Treść lekcji” w adminie) → intro + kolorowe sekcje e-learningu. */
export function lexicalToLessonContent(
  content: Record<string, unknown> | null | undefined,
): { intro: string | null; sections: LessonSection[] } {
  const root = content?.root as LexicalNode | undefined;
  const children = Array.isArray(root?.children) ? root.children : [];
  if (!children.length) {
    return { intro: null, sections: [] };
  }

  const introParts: string[] = [];
  const sections: LessonSection[] = [];
  let i = 0;

  while (i < children.length) {
    const node = children[i];

    if (node.type === "paragraph") {
      const text = paragraphText(node);
      const link = parseLessonLinkParagraph(text);
      if (link) {
        sections.push(link);
        i++;
        continue;
      }
      if (!sections.length && text) {
        introParts.push(text);
        i++;
        continue;
      }
    }

    if (node.type === "heading" && node.tag === "h3") {
      const label = collectText(node).trim();
      const next = children[i + 1];
      if (next?.type === "heading" && next.tag === "h3" && label.includes(" vs ")) {
        const comparison = parseComparison(children, i);
        sections.push(comparison.section);
        i = comparison.nextIndex;
        continue;
      }

      if (next?.type === "list") {
        sections.push({ type: "list", title: label, items: listItems(next) });
        i += 2;
        continue;
      }

      const block = parseH3Block(children, i);
      sections.push(block.section);
      i = block.nextIndex;
      continue;
    }

    if (node.type === "list") {
      sections.push({ type: "list", items: listItems(node) });
      i++;
      continue;
    }

    if (node.type === "quote") {
      sections.push(parseQuote(node));
      i++;
      continue;
    }

    i++;
  }

  return {
    intro: introParts.length ? introParts.join("\n\n") : null,
    sections: normalizeLessonSections(sections),
  };
}
