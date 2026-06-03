import type { ModuleAccentId } from "./theme";
import type { LessonSection } from "./lesson-section-types";

export type LessonTaskType = "text" | "audio" | "multiday";

export type MultidayDay = {
  day: number;
  prompt: string;
};

export type ElearningLesson = {
  /** ID dokumentu lekcji w Payload (Postgres) - nie slug typu "1-1" */
  id: number | string;
  /** Id z course.json (np. "1-3") — odwołania lessonlink w treści */
  legacySlug?: string | null;
  order: number;
  title: string;
  duration: string | null;
  hasVideo: boolean;
  videoTitle: string | null;
  videoUrl: string | null;
  intro: string | null;
  sections: LessonSection[];
  content: Record<string, unknown> | null;
  task: {
    type: LessonTaskType;
    prompt: string;
    days?: MultidayDay[];
  };
};

export type ElearningModule = {
  id: number | string;
  title: string;
  tag: string;
  emoji: string;
  order: number;
  accent: ModuleAccentId;
  lessons: ElearningLesson[];
};
