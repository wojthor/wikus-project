"use client";

import Image from "next/image";
import type { storyAndAuthority } from "@/data/content";

const ACCENT = "text-sky-600";

// Renders text with any [bracketed] segment in bold accent; rest remains normal.
function AccentBrackets({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
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
          <span key={i} className={`font-bold ${ACCENT}`}>
            {part.text}
          </span>
        ) : (
          part.text
        )
      )}
    </span>
  );
}

export function Story({ content }: { content: typeof storyAndAuthority }) {
  // Pełniejsza historia – bio + wszystkie bloki VSL.
  const paragraphs: string[] = [
    content.authorBio,
    `[Zbudowanie autorytetu] ${content.authorityHeadline}`,
    `[Historia początków] ${content.originStory}`,
    `[${content.turningPointHeadline}] ${content.turningPointText}`,
    `[${content.newPathHeadline}] ${content.newPathText}`,
    `[${content.positiveEffectsHeadline}] ${content.positiveEffectsText}`,
    `[Dodatkowe korzyści] ${content.additionalBenefits}`,
    `[${content.costOfSolutionHeadline}] ${content.costOfSolutionText}`,
  ];

  return (
    <section id="o-mnie" className="w-full py-20 px-4">
      <div className="mx-auto grid max-w-6xl items-start gap-12 md:grid-cols-[4fr_7fr]">
        {/* Left column – sticky profile */}
        <div className="md:sticky md:top-24 md:self-start h-fit flex flex-col gap-4">
          <div className="relative w-full aspect-3/4 overflow-hidden rounded-3xl bg-slate-100 shadow-xl">
            <Image
              src={content.authorImagePlaceholder}
              alt={content.authorName}
              fill
              className="h-full w-full object-cover object-top"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>

          <div className="mt-2 flex flex-col gap-1">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              {content.authorName}
            </h2>
            <p className="text-lg text-slate-500">{content.authorTitle}</p>
          </div>

          <ul className="mt-4 list-disc list-inside space-y-2 text-sm text-slate-600">
            {content.credentials.map((item, index) => (
              <li key={index}>
                <span className="font-medium">{item.label}</span>
                {item.detail ? ` — ${item.detail}` : null}
              </li>
            ))}
          </ul>
        </div>

        {/* Right column – long prose */}
        <div className="space-y-6 text-lg leading-relaxed text-slate-700">
          {paragraphs.map((text, index) => (
            <p key={index}>
              <AccentBrackets text={text} />
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

