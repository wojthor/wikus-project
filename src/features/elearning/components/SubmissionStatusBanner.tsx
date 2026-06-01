import { CheckCircle2, Clock, MessageCircle } from "lucide-react";

type SubmissionStatusBannerProps = {
  variant: "awaiting_feedback" | "feedback_ready";
};

export function SubmissionStatusBanner({ variant }: SubmissionStatusBannerProps) {
  if (variant === "awaiting_feedback") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-[#b9c5fe] bg-[#f8faff] p-4 ring-1 ring-[#cfd8ff]/60">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7347f4]/15 text-[#7347f4]">
          <Clock className="h-5 w-5" strokeWidth={2.25} />
        </span>
        <div>
          <p className="text-sm font-extrabold text-[#3e57d6]">Zadanie wysłane - oczekuje na feedback</p>
          <p className="mt-0.5 text-sm leading-relaxed text-slate-600">
            Wiktor sprawdzi Twoją odpowiedź w sekcji zadania poniżej. Status zmieni się na
            „ukończona”, gdy doda komentarz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 ring-1 ring-emerald-100">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
        <MessageCircle className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <div>
        <p className="text-sm font-extrabold text-emerald-900">Feedback od Wiktora jest gotowy</p>
        <p className="mt-0.5 text-sm leading-relaxed text-emerald-800/80">
          Przeczytaj komentarz w sekcji zadania poniżej. Możesz przejść do kolejnej lekcji, gdy
          będziesz gotowy.
        </p>
      </div>
    </div>
  );
}

export function LessonStatusPill({
  variant,
}: {
  variant: "awaiting_feedback" | "feedback_ready" | "submitted";
}) {
  if (variant === "awaiting_feedback") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[#b9c5fe] bg-[#f8faff] px-2.5 py-0.5 text-[11px] font-bold text-[#3e57d6]">
        <Clock className="h-3 w-3" strokeWidth={2.5} />
        Oczekuje na feedback
      </span>
    );
  }
  if (variant === "feedback_ready") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
        <MessageCircle className="h-3 w-3" strokeWidth={2.5} />
        Feedback gotowy
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
      <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
      Wysłane
    </span>
  );
}
