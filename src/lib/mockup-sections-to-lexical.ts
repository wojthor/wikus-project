/** Konwersja sekcji z mockupu JSX → JSON Lexical (Payload richText). */

type MockupSection = Record<string, unknown>;

function textNode(text: string, format = 0) {
  return { type: "text", text, format, mode: "normal", style: "", detail: 0, version: 1 };
}

function paragraph(...parts: ReturnType<typeof textNode>[]) {
  return {
    type: "paragraph",
    format: "",
    indent: 0,
    version: 1,
    children: parts.length ? parts : [textNode("")],
    direction: "ltr",
  };
}

function heading(tag: "h2" | "h3", text: string) {
  return {
    type: "heading",
    tag,
    format: "",
    indent: 0,
    version: 1,
    children: [textNode(text, 1)],
    direction: "ltr",
  };
}

function listItem(text: string) {
  return {
    type: "listitem",
    format: "",
    indent: 0,
    version: 1,
    value: 1,
    children: [textNode(text)],
    direction: "ltr",
  };
}

function bulletList(items: string[]) {
  return {
    type: "list",
    listType: "bullet",
    format: "",
    indent: 0,
    version: 1,
    start: 1,
    tag: "ul",
    children: items.map((item) => listItem(item)),
    direction: "ltr",
  };
}

function quoteBlock(text: string, author?: string) {
  const children = [paragraph(textNode(text))];
  if (author) {
    children.push(paragraph(textNode(author, 2)));
  }
  return {
    type: "quote",
    format: "",
    indent: 0,
    version: 1,
    children,
    direction: "ltr",
  };
}

function paragraphsFromText(content: string): ReturnType<typeof paragraph>[] {
  const chunks = content.split(/\n\n+/).map((s) => s.trim()).filter(Boolean);
  if (!chunks.length) return [paragraph(textNode(""))];
  return chunks.map((chunk) => paragraph(textNode(chunk)));
}

function sectionToNodes(section: MockupSection): unknown[] {
  const type = section.type as string;

  if (["insight", "tip", "reallife", "warning", "fun"].includes(type)) {
    const icon = typeof section.icon === "string" ? section.icon : "";
    const title = typeof section.title === "string" ? section.title : "";
    const content = typeof section.content === "string" ? section.content : "";
    const label = [icon, title].filter(Boolean).join(" ");
    return [heading("h3", label), ...paragraphsFromText(content)];
  }

  if (type === "text") {
    const content = typeof section.content === "string" ? section.content : "";
    return paragraphsFromText(content);
  }

  if (type === "quote") {
    const text = typeof section.text === "string" ? section.text : "";
    const author = typeof section.author === "string" ? section.author : undefined;
    return [quoteBlock(text, author)];
  }

  if (type === "list") {
    const title = typeof section.title === "string" ? section.title : "";
    const items = Array.isArray(section.items)
      ? section.items.filter((i): i is string => typeof i === "string")
      : [];
    const nodes: unknown[] = [];
    if (title) nodes.push(heading("h3", title));
    if (items.length) nodes.push(bulletList(items));
    return nodes;
  }

  if (type === "comparison") {
    const title = typeof section.title === "string" ? section.title : "";
    const nodes: unknown[] = [];
    if (title) nodes.push(heading("h3", title));

    for (const key of ["left", "right"] as const) {
      const side = section[key] as { label?: string; items?: string[] } | undefined;
      if (!side) continue;
      if (side.label) nodes.push(heading("h3", side.label));
      const items = Array.isArray(side.items)
        ? side.items.filter((i): i is string => typeof i === "string")
        : [];
      if (items.length) nodes.push(bulletList(items));
    }
    return nodes;
  }

  if (type === "lessonlink") {
    const content = typeof section.content === "string" ? section.content : "";
    const target = typeof section.target === "string" ? section.target : "";
    const text = target ? `📎 ${content} (lekcja ${target})` : `📎 ${content}`;
    return [paragraph(textNode(text, 1))];
  }

  return [];
}

export function sectionsToLexical(
  intro: string | undefined,
  sections: MockupSection[] | undefined,
): Record<string, unknown> {
  const children: unknown[] = [];

  if (intro?.trim()) {
    children.push(...paragraphsFromText(intro.trim()));
  }

  for (const section of sections ?? []) {
    children.push(...sectionToNodes(section));
  }

  if (!children.length) {
    children.push(paragraph(textNode("")));
  }

  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children,
    },
  };
}

export function buildModuleIntro(intro?: string, subtitle?: string): string | undefined {
  const parts = [subtitle?.trim(), intro?.trim()].filter(Boolean);
  return parts.length ? parts.join("\n\n") : undefined;
}

export function buildTaskPrompt(task: {
  type: string;
  prompt?: string;
  days?: { day: number; prompt: string }[];
}): { taskType: "text" | "audio" | "multiday"; taskPrompt: string; multidayDays?: { day: number; prompt: string }[] } {
  if (task.type === "multiday" && Array.isArray(task.days) && task.days.length) {
    const first = task.days[0]?.prompt ?? "7-dniowe wyzwanie mówienia";
    return {
      taskType: "multiday",
      taskPrompt: first,
      multidayDays: task.days,
    };
  }

  return {
    taskType: task.type === "audio" ? "audio" : "text",
    taskPrompt: typeof task.prompt === "string" ? task.prompt : "",
  };
}
