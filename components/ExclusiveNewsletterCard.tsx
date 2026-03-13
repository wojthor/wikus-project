"use client";

import Image from "next/image";

// Simple parser: wraps [bracketed] text in accent styling.
function AccentBrackets({ text }: { text: string }) {
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
    <span>
      {parts.map((part, i) =>
        part.type === "accent" ? (
          <span key={i} className="font-semibold text-red-500">
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </span>
  );
}

export function ExclusiveNewsletterCard() {
  return (
    <section className="w-full bg-stone-50 py-12 px-4">
      <div className="max-w-xl mx-auto p-12 bg-white rounded-[33px] shadow-sm border border-slate-100 flex flex-col gap-6 text-center">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-lg">
            <Image
              src="/wikus.jpg"
              alt="Autor newslettera"
              fill
              unoptimized
              className="object-cover rounded-full"
            />
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Odbierz darmowy plan nauki angielskiego!
        </h2>

        {/* Prose */}
        <p className="text-base leading-relaxed text-slate-700">
          <AccentBrackets text="Zapisz się, aby otrzymać krótkie wskazówki i materiały, które pomogą Ci ruszyć z angielskim bez [chaos]." />
        </p>

        {/* Input + button */}
        <form className="mt-2 flex flex-col gap-4">
          <label className="text-left text-sm font-medium text-slate-700">
            Adres e-mail
            <input
              type="email"
              required
              placeholder="np. imie@twojmail.pl"
              className="mt-2 w-full border-0 border-b border-stone-200 bg-transparent px-0 py-2 text-base text-slate-900 placeholder:text-stone-400 focus:border-indigo-600 focus:outline-none focus:ring-0"
            />
          </label>

          <button
            type="submit"
            className="mt-2 w-full bg-indigo-600 text-white rounded-xl py-4 text-base font-bold tracking-wide shadow-sm hover:bg-indigo-700 hover:shadow-md transition-colors"
          >
            ODBIERAM PLAN!
          </button>
        </form>

        {/* Pills */}
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <span className="rounded-full border border-stone-200 text-stone-600 px-5 py-2.5 text-sm font-medium">
            1 mail tygodniowo
          </span>
          <span className="rounded-full border border-stone-200 text-stone-600 px-5 py-2.5 text-sm font-medium">
            Konkretne mini-zadania speaking
          </span>
          <span className="rounded-full border border-stone-200 text-stone-600 px-5 py-2.5 text-sm font-medium">
            Gwarancja braku spamu
          </span>
        </div>

        {/* Consent */}
        <p className="mt-4 text-xs leading-relaxed text-slate-400">
          Wyrażam zgodę na otrzymywanie maili związanych z nauką angielskiego. Mogę wypisać się w każdej chwili.
        </p>
      </div>
    </section>
  );
}

