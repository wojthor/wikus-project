"use client";

import { useActionState, useEffect } from "react";
import Image from "next/image";
import { subscribeNewsletterFormAction } from "@/app/actions/newsletter";
import { NEWSLETTER_FORM_INITIAL_STATE } from "@/lib/newsletter-form-state";
import type { NewsletterData } from "@/data/content";

type NewsletterFormProps = {
  data: NewsletterData;
  onDismiss: () => void;
  onSubscribeSuccess: () => void;
};

export function NewsletterForm({ data, onDismiss, onSubscribeSuccess }: NewsletterFormProps) {
  const [state, formAction, isPending] = useActionState(
    subscribeNewsletterFormAction,
    NEWSLETTER_FORM_INITIAL_STATE
  );

  useEffect(() => {
    if (state.status === "success") {
      onSubscribeSuccess();
    }
  }, [state.status, onSubscribeSuccess]);

  const showSuccess = state.status === "success";

  return (
    <>
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-4 right-4 text-slate-600 hover:text-slate-800 transition-colors"
        aria-label={data.closeAriaLabel}
      >
        ×
      </button>

      <div className="flex justify-center">
        <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-lg shrink-0">
          <Image
            src={data.portraitSrc}
            alt={data.portraitAlt}
            fill
            className="object-cover rounded-full"
            sizes="80px"
          />
        </div>
      </div>

      <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
        {data.title}
      </h2>

      <p className="text-sm sm:text-base leading-relaxed text-slate-700">
        {data.introLead}
        <span className="font-semibold text-red-600">{data.introHighlight}</span>
        {data.introMiddle}
        <span className="font-semibold text-red-600">{data.introAccentLine}</span>
      </p>

      {showSuccess ? (
        <div className="flex flex-col items-center gap-4 py-4 animate-in fade-in zoom-in duration-300">
          <div className="relative inline-flex h-16 w-16 items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/40 animate-ping" />
            <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white text-2xl">
              ✓
            </span>
          </div>
          <p className="text-base font-semibold text-slate-900">{data.successTitle}</p>
          <p className="text-sm text-slate-600 max-w-sm">{data.successDescription}</p>
        </div>
      ) : (
        <form action={formAction} className="flex flex-col gap-4">
          <label className="text-left text-sm font-medium text-slate-700">
            {data.emailLabel}
            <input
              name="email"
              type="email"
              required
              placeholder={data.emailPlaceholder}
              disabled={isPending}
              className="mt-2 w-full border-0 border-b border-stone-300 bg-transparent px-0 py-2 text-base text-slate-900 placeholder:text-stone-600 focus:border-indigo-600 focus:outline-none focus:ring-0 disabled:opacity-60"
            />
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-indigo-600 text-white rounded-xl py-3 sm:py-4 text-base font-bold tracking-wide shadow-sm hover:bg-indigo-700 hover:shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? data.submitLoading : data.submitButton}
          </button>

          {state.status === "error" && state.message ? (
            <p className="text-sm text-red-600 text-center" role="alert">
              {state.message}
            </p>
          ) : null}
        </form>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        {data.bullets.map((bullet) => (
          <span
            key={bullet}
            className="rounded-full border border-stone-200 text-stone-600 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium"
          >
            {bullet}
          </span>
        ))}
      </div>

      <p className="text-xs leading-relaxed text-slate-600">{data.consent}</p>
    </>
  );
}
