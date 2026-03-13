export function AccentBrackets({ text, className = "" }: { text: string; className?: string }) {
  const parts: Array<{ type: "accent" | "normal"; text: string }> = [];
  let remaining = text;

  while (remaining.length > 0) {
    const open = remaining.indexOf("[");
    const close = remaining.indexOf("]");

    if (open === -1 || close === -1 || close < open) {
      if (remaining) parts.push({ type: "normal", text: remaining });
      break;
    }

    if (open > 0) {
      parts.push({ type: "normal", text: remaining.slice(0, open) });
    }

    parts.push({ type: "accent", text: remaining.slice(open + 1, close) });
    remaining = remaining.slice(close + 1);
  }

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.type === "accent" ? (
          <span key={i} className="font-bold text-[#ffa515]">
            [{part.text}]
          </span>
        ) : (
          part.text
        )
      )}
    </span>
  );
}
