"use client";

import type { offerDetails } from "@/data/content";

type OfferClosing = typeof offerDetails.offerClosing;
type ClosingColumn = OfferClosing[number];
type ClosingBlock = ClosingColumn["blocks"][number];

const bodyClass = "text-slate-700 text-base sm:text-lg leading-relaxed";

function ClosingBlockView({ block }: { block: ClosingBlock }) {
  switch (block.kind) {
    case "p":
      return <p className={bodyClass}>{block.text}</p>;
    case "p-emphasis":
      return (
        <p className={bodyClass}>
          {block.before}
          <span className={block.emphasisClass}>{block.emphasis}</span>
          {block.after}
        </p>
      );
    case "ul":
      return (
        <ul className={`list-disc list-inside ${bodyClass} space-y-1`}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "ul-emphasis":
      return (
        <ul className={`list-disc list-inside ${bodyClass} space-y-1`}>
          <li>
            {block.before}
            <span className={block.emphasisClass}>{block.emphasis}</span>
            {block.after}
          </li>
        </ul>
      );
    case "btw":
      return (
        <p className="text-[#7347f4] text-sm sm:text-base leading-relaxed font-semibold">
          {block.before}
          <span className="font-extrabold">{block.strong}</span>
          {block.after}
        </p>
      );
  }
}

type ExtraInformationsProps = {
  columns: OfferClosing;
};

export function ExtraInformations({ columns }: ExtraInformationsProps) {
  return (
    <section
      aria-label="Dodatkowe informacje"
      className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-10 sm:pt-12 border-t border-[#b9c5fe]/40"
    >
      {columns.map((column) => (
        <div key={column.title} className="space-y-3">
          <h2 className="text-[#ffa515] font-bold text-xl sm:text-2xl">{column.title}</h2>
          {column.blocks.map((block, i) => (
            <ClosingBlockView key={`${column.title}-${block.kind}-${i}`} block={block} />
          ))}
        </div>
      ))}
    </section>
  );
}
