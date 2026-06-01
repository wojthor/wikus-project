import type { ReactNode } from "react";

type LexicalNode = {
  type?: string;
  tag?: string;
  text?: string;
  format?: number;
  children?: LexicalNode[];
  listType?: string;
  value?: number;
};

function renderNode(node: LexicalNode, key: number): ReactNode {
  if (!node) return null;

  if (node.type === "text") {
    const text = node.text ?? "";
    if (node.format === 1) return <strong key={key}>{text}</strong>;
    if (node.format === 2) return <em key={key}>{text}</em>;
    return <span key={key}>{text}</span>;
  }

  const children = node.children?.map((child, i) => renderNode(child, i));

  switch (node.type) {
    case "paragraph":
      return (
        <p key={key} className="my-4 text-[15px] leading-relaxed text-slate-600">
          {children}
        </p>
      );
    case "heading": {
      const Tag = node.tag === "h3" ? "h3" : node.tag === "h1" ? "h1" : "h2";
      return (
        <Tag key={key} className="mt-6 mb-3 text-lg font-bold text-slate-900">
          {children}
        </Tag>
      );
    }
    case "list": {
      const ListTag = node.listType === "number" ? "ol" : "ul";
      return (
        <ListTag
          key={key}
          className={`my-4 ml-5 flex flex-col gap-2 text-[15px] leading-relaxed text-slate-600 ${
            node.listType === "number" ? "list-decimal" : "list-disc"
          }`}
        >
          {children}
        </ListTag>
      );
    }
    case "listitem":
      return (
        <li key={key} className="pl-1">
          {children}
        </li>
      );
    case "quote":
      return (
        <blockquote
          key={key}
          className="my-6 border-l-4 border-slate-300 pl-5 text-base italic text-slate-600"
        >
          {children}
        </blockquote>
      );
    case "linebreak":
      return <br key={key} />;
    case "link":
      return (
        <a
          key={key}
          href={(node as LexicalNode & { url?: string }).url}
          className="font-medium text-[#7347f4] underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    case "root":
      return <div key={key}>{children}</div>;
    default:
      return children ? <div key={key}>{children}</div> : null;
  }
}

export function LexicalContent({ content }: { content: Record<string, unknown> | null }) {
  if (!content) return null;

  const root = (content as { root?: LexicalNode }).root;
  if (!root?.children?.length) {
    return null;
  }

  return (
    <div className="lesson-rich-text">
      {root.children.map((child, i) => renderNode(child, i))}
    </div>
  );
}

export function lexicalToPlainText(content: Record<string, unknown> | null): string {
  if (!content) return "";

  const walk = (node: LexicalNode): string => {
    if (node.type === "text") return node.text ?? "";
    return (node.children ?? []).map(walk).join(" ");
  };

  const root = (content as { root?: LexicalNode }).root;
  return (root?.children ?? []).map(walk).join(" ").trim();
}
