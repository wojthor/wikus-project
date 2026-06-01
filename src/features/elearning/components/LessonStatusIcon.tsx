import { CheckCircle2, Circle, Clock, Lock, PlayCircle } from "lucide-react";

import type { LessonProgressStatus } from "../lesson-status";

const STATUS_TITLE: Record<LessonProgressStatus, string> = {
  locked: "Zablokowana - wyślij zadanie z poprzedniej lekcji",
  not_started: "Nie rozpoczęta",
  in_progress: "W trakcie",
  awaiting_feedback: "Oczekuje na feedback",
  completed: "Ukończona",
};

export function LessonStatusIcon({ status }: { status: LessonProgressStatus }) {
  const title = STATUS_TITLE[status];

  switch (status) {
    case "locked":
      return (
        <Lock
          className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
          strokeWidth={2.25}
          aria-label={title}
        />
      );
    case "completed":
      return (
        <CheckCircle2
          className="mt-0.5 h-4 w-4 shrink-0 text-green-600"
          strokeWidth={2.25}
          aria-label={title}
        />
      );
    case "awaiting_feedback":
      return (
        <Clock
          className="mt-0.5 h-4 w-4 shrink-0 text-[#3e57d6]"
          strokeWidth={2.25}
          aria-label={title}
        />
      );
    case "in_progress":
      return (
        <PlayCircle
          className="mt-0.5 h-4 w-4 shrink-0 text-[#7347f4]"
          strokeWidth={2.25}
          aria-label={title}
        />
      );
    default:
      return (
        <Circle
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300"
          strokeWidth={2}
          aria-label={title}
        />
      );
  }
}
