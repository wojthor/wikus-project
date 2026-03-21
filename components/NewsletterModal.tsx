"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

const STORAGE_KEY = "newsletter_dismissed";
type SubmitStatus = "idle" | "loading" | "success" | "error";

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

export function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value?.trim();
    if (!email) return;

    setStatus("loading");
    const result = await subscribeToNewsletter(email);

    if (result.success) {
      setStatus("success");
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, "true");
      }
    } else {
      setStatus("error");
      setErrorMessage(result.error ?? "Wystąpił błąd. Spróbuj ponownie.");
      setStatus("idle");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 bg-slate-900/40 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto"
      onClick={dismiss}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="max-w-xl w-full mx-auto mt-2 sm:mt-0 p-5 sm:p-12 bg-white rounded-[33px] shadow-sm border border-slate-100 flex flex-col gap-4 sm:gap-6 text-center relative max-h-[92dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors"
          aria-label="Zamknij okno newslettera"
        >
          ×
        </button>

        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-lg shrink-0">
            <Image
              src="/wikus.jpg"
              alt="Autor newslettera"
              fill
              className="object-cover rounded-full"
              sizes="80px"
            />
          </div>
        </div>

        <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Odbierz darmowy plan nauki angielskiego (bez chaosu)
        </h2>

        <p className="text-sm sm:text-base leading-relaxed text-slate-700">
          Zapisz się i otrzymaj{" "}
          <span className="font-semibold text-red-600">prosty plan + krótkie zadania</span>
          , dzięki którym w końcu ruszysz z angielskim. Nawet jeśli masz mało{" "}
          <AccentBrackets text="[czasu]." />
        </p>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-4 animate-in fade-in zoom-in duration-300">
            <div className="relative inline-flex h-16 w-16 items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/40 animate-ping" />
              <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white text-2xl">
                ✓
              </span>
            </div>
            <p className="text-base font-semibold text-slate-900">
              Dziękujemy za zapis!
            </p>
            <p className="text-sm text-slate-600 max-w-sm">
              W ciągu chwili dostaniesz pierwszy mail z planem nauki. Sprawdź też folder spam/oferty.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="text-left text-sm font-medium text-slate-700">
              Adres e-mail
              <input
                name="email"
                type="email"
                required
                placeholder="np. imie@twojmail.pl"
                disabled={status === "loading"}
                className="mt-2 w-full border-0 border-b border-stone-200 bg-transparent px-0 py-2 text-base text-slate-900 placeholder:text-stone-400 focus:border-indigo-600 focus:outline-none focus:ring-0 disabled:opacity-60"
              />
            </label>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-indigo-600 text-white rounded-xl py-3 sm:py-4 text-base font-bold tracking-wide shadow-sm hover:bg-indigo-700 hover:shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Wysyłanie…" : "ODBIERAM PLAN!"}
            </button>

            {errorMessage && (
              <p className="text-sm text-red-600 text-center" role="alert">
                {errorMessage}
              </p>
            )}
          </form>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <span className="rounded-full border border-stone-200 text-stone-600 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium">
            1 mail tygodniowo
          </span>
          <span className="rounded-full border border-stone-200 text-stone-600 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium">
            krótkie zadania ze speakingu
          </span>
          <span className="rounded-full border border-stone-200 text-stone-600 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium">
            powiększenie słownictwa
          </span>
        </div>

        <p className="text-xs leading-relaxed text-slate-400">
          Wyrażam zgodę na otrzymywanie maili związanych z nauką angielskiego. Mogę wypisać się w każdej chwili.
        </p>
      </div>
    </div>
  );
}
