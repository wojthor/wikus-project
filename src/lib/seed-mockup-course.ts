import type { Payload } from "payload";

import mockupCourse from "@/src/data/course-mockup/course.json";
import {
  buildModuleIntro,
  buildTaskPrompt,
  sectionsToLexical,
} from "@/src/lib/mockup-sections-to-lexical";

type ExistingLessonVideo = {
  videoUrl?: string | null;
  videoTitle?: string | null;
};

export type MockupLesson = {
  id: string;
  title: string;
  duration?: string;
  hasVideo?: boolean;
  videoTitle?: string;
  /** Gdy brak — przy update zostaje URL z bazy (nie kasujemy linków z CMS). */
  videoUrl?: string | null;
  intro?: string;
  sections?: Record<string, unknown>[];
  task: {
    type: string;
    prompt?: string;
    days?: { day: number; prompt: string }[];
  };
};

export type MockupModule = {
  id: number;
  emoji: string;
  tag: string;
  title: string;
  subtitle?: string;
  intro?: string;
  lessons: MockupLesson[];
};

export type SeedMockupCourseResult = {
  ok: true;
  reset: boolean;
  modules: number;
  modulesCreated: number;
  lessonsCreated: number;
  lessonsUpdated: number;
  lessonsSkipped: number;
  submissionsDeletedOnReset: boolean;
  message: string;
};

export type SeedMockupCourseOptions = {
  reset?: boolean;
};

function resolveLessonVideoFields(
  lesson: MockupLesson,
  existing?: ExistingLessonVideo | null,
): { videoUrl: string | null; videoTitle: string | null } {
  if (lesson.hasVideo === false) {
    return { videoUrl: null, videoTitle: null };
  }

  const mockUrl =
    typeof lesson.videoUrl === "string" ? lesson.videoUrl.trim() || null : null;
  const mockTitle = lesson.videoTitle?.trim() || null;

  if (mockUrl) {
    return { videoUrl: mockUrl, videoTitle: mockTitle };
  }

  const existingUrl =
    typeof existing?.videoUrl === "string" ? existing.videoUrl.trim() || null : null;
  const existingTitle =
    typeof existing?.videoTitle === "string" ? existing.videoTitle.trim() || null : null;

  if (existingUrl) {
    return {
      videoUrl: existingUrl,
      videoTitle: mockTitle || existingTitle,
    };
  }

  return {
    videoUrl: null,
    videoTitle: lesson.hasVideo ? mockTitle : null,
  };
}

/** Importuje 7 modułów i 35 lekcji z `src/data/course-mockup/course.json` do Payload. */
export async function seedMockupCourse(
  payload: Payload,
  options: SeedMockupCourseOptions = {},
): Promise<SeedMockupCourseResult> {
  const reset = Boolean(options.reset);
  const modules = mockupCourse as MockupModule[];

  if (reset) {
    const submissions = await payload.find({
      collection: "submissions",
      limit: 5000,
      pagination: false,
      overrideAccess: true,
    });
    for (const doc of submissions.docs) {
      await payload.delete({ collection: "submissions", id: doc.id, overrideAccess: true });
    }

    const lessons = await payload.find({
      collection: "lessons",
      limit: 500,
      pagination: false,
      overrideAccess: true,
    });
    for (const doc of lessons.docs) {
      await payload.delete({ collection: "lessons", id: doc.id, overrideAccess: true });
    }

    const mods = await payload.find({
      collection: "modules",
      limit: 100,
      pagination: false,
      overrideAccess: true,
    });
    for (const doc of mods.docs) {
      await payload.delete({ collection: "modules", id: doc.id, overrideAccess: true });
    }
  }

  let modulesCreated = 0;
  let lessonsCreated = 0;
  let lessonsUpdated = 0;
  let lessonsSkipped = 0;

  for (const [modIndex, mod] of modules.entries()) {
    const existingMod = await payload.find({
      collection: "modules",
      where: { tag: { equals: mod.tag } },
      limit: 1,
      overrideAccess: true,
    });

    const moduleIntro = buildModuleIntro(mod.intro, mod.subtitle);
    let moduleId: number | string;

    if (existingMod.docs[0]) {
      moduleId = existingMod.docs[0].id;
      if (reset) {
        await payload.update({
          collection: "modules",
          id: moduleId,
          overrideAccess: true,
          data: {
            title: mod.title,
            tag: mod.tag,
            emoji: mod.emoji,
            order: modIndex + 1,
            intro: moduleIntro,
          },
        });
      }
    } else {
      const created = await payload.create({
        collection: "modules",
        overrideAccess: true,
        data: {
          title: mod.title,
          tag: mod.tag,
          emoji: mod.emoji,
          order: modIndex + 1,
          intro: moduleIntro,
        },
      });
      moduleId = created.id;
      modulesCreated += 1;
    }

    for (const [lessonIndex, lesson] of mod.lessons.entries()) {
      const existingLesson = await payload.find({
        collection: "lessons",
        where: {
          and: [
            { module: { equals: moduleId } },
            { legacySlug: { equals: lesson.id } },
          ],
        },
        limit: 1,
        overrideAccess: true,
      });

      const { taskType, taskPrompt, multidayDays } = buildTaskPrompt(lesson.task);
      const content = sectionsToLexical(lesson.intro, lesson.sections);

      const existingDoc = existingLesson.docs[0] as ExistingLessonVideo | undefined;
      const { videoUrl, videoTitle } = resolveLessonVideoFields(lesson, existingDoc);

      const lessonData = {
        title: lesson.title,
        module: moduleId,
        order: lessonIndex + 1,
        duration: lesson.duration ?? null,
        videoTitle,
        videoUrl,
        content,
        taskType,
        taskPrompt,
        multidayDays: multidayDays ?? null,
        legacySlug: lesson.id,
      };

      if (existingLesson.docs[0]) {
        await payload.update({
          collection: "lessons",
          id: existingLesson.docs[0].id,
          overrideAccess: true,
          data: lessonData,
        });
        lessonsUpdated += 1;
      } else {
        await payload.create({
          collection: "lessons",
          overrideAccess: true,
          data: lessonData,
        });
        lessonsCreated += 1;
      }
    }
  }

  return {
    ok: true,
    reset,
    modules: modules.length,
    modulesCreated,
    lessonsCreated,
    lessonsUpdated,
    lessonsSkipped,
    submissionsDeletedOnReset: reset,
    message: `Zaimportowano kurs: ${modules.length} modułów, ${lessonsCreated} nowych lekcji, ${lessonsUpdated} zaktualizowanych, ${lessonsSkipped} bez zmian.`,
  };
}
