import { getCachedPayload } from "@/src/lib/payload-cache";

import { resolveLessonContentFromPayload } from "@/src/features/elearning/resolve-lesson-content";

import type { ElearningLesson, ElearningModule, LessonTaskType } from "./types";
import { type ModuleAccentId } from "./theme";

const ACCENT_CYCLE: ModuleAccentId[] = [
  "brand",
  "teal",
  "green",
  "violet",
  "rose",
  "orange",
];

const DEFAULT_MULTIDAY_DAYS = 7;

type PayloadModule = {
  id: number | string;
  title: string;
  tag?: string | null;
  emoji?: string | null;
  order: number;
};

type PayloadLesson = {
  id: number | string;
  title: string;
  module: number | string | PayloadModule;
  order: number;
  duration?: string | null;
  videoTitle?: string | null;
  videoUrl?: string | null;
  content?: Record<string, unknown> | null;
  taskType: LessonTaskType;
  taskPrompt: string;
  multidayDays?: { day: number; prompt: string }[] | null;
  legacySlug?: string | null;
  lessonIntro?: string | null;
  contentSections?: unknown;
  lessonLinks?: {
    label?: string | null;
    targetLesson?:
      | number
      | string
      | { id?: number | string; legacySlug?: string | null }
      | null;
  }[] | null;
};

function resolveModuleId(module: PayloadLesson["module"]): string | number {
  if (typeof module === "object" && module !== null && "id" in module) {
    return module.id;
  }
  return module;
}

function mapLesson(doc: PayloadLesson): ElearningLesson {
  const taskType = doc.taskType;
  const task: ElearningLesson["task"] = {
    type: taskType,
    prompt: doc.taskPrompt,
  };

  if (taskType === "multiday") {
    const days = Array.isArray(doc.multidayDays) ? doc.multidayDays : null;
    if (days?.length) {
      task.days = days.map((d) => ({
        day: d.day,
        prompt: d.prompt,
      }));
    } else {
      task.days = Array.from({ length: DEFAULT_MULTIDAY_DAYS }, (_, i) => ({
        day: i + 1,
        prompt: doc.taskPrompt,
      }));
    }
  }

  const videoUrl = doc.videoUrl?.trim() || null;
  const videoTitle = videoUrl ? doc.videoTitle?.trim() || null : null;

  const { intro, sections } = resolveLessonContentFromPayload(doc);

  return {
    id: doc.id,
    legacySlug: doc.legacySlug?.trim() || null,
    order: doc.order,
    title: doc.title,
    duration: doc.duration?.trim() || null,
    hasVideo: Boolean(videoUrl),
    videoTitle,
    videoUrl,
    intro,
    sections,
    content: doc.content ?? null,
    task,
  };
}

export async function fetchElearningModules(): Promise<ElearningModule[]> {
  const payload = await getCachedPayload();

  const [modulesResult, lessonsResult] = await Promise.all([
    payload.find({
      collection: "modules",
      sort: "order",
      limit: 100,
      depth: 0,
      pagination: false,
    }),
    payload.find({
      collection: "lessons",
      sort: "order",
      limit: 500,
      depth: 1,
      pagination: false,
    }),
  ]);

  const lessonsByModule = new Map<string | number, ElearningLesson[]>();

  for (const doc of lessonsResult.docs as PayloadLesson[]) {
    const moduleId = resolveModuleId(doc.module);
    const lesson = mapLesson(doc);
    const list = lessonsByModule.get(moduleId) ?? [];
    list.push(lesson);
    lessonsByModule.set(moduleId, list);
  }

  return (modulesResult.docs as PayloadModule[]).map((mod, index) => {
    const id = mod.id;
    const lessons = (lessonsByModule.get(id) ?? []).sort((a, b) => a.order - b.order);

    return {
      id,
      title: mod.title,
      tag: mod.tag?.trim() || `Moduł ${index + 1}`,
      emoji: mod.emoji?.trim() || "📘",
      order: mod.order,
      accent: ACCENT_CYCLE[index % ACCENT_CYCLE.length],
      lessons,
    };
  });
}
