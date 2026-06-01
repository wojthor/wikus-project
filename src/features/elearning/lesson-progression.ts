import type { PayloadSubmission } from "./submissions-api";
import type { ElearningModule } from "./types";

export type FlatLessonRef = {
  modIndex: number;
  lessonIndex: number;
  lessonId: number | string;
};

export function flattenLessons(modules: ElearningModule[]): FlatLessonRef[] {
  const flat: FlatLessonRef[] = [];
  modules.forEach((m, modIndex) => {
    m.lessons.forEach((lesson, lessonIndex) => {
      flat.push({ modIndex, lessonIndex, lessonId: lesson.id });
    });
  });
  return flat;
}

export function hasSubmittedTask(
  submission: PayloadSubmission | null | undefined,
): boolean {
  return submission != null;
}

export function isModuleComplete(
  modules: ElearningModule[],
  submissionsByLesson: Record<string, PayloadSubmission>,
  modIndex: number,
): boolean {
  const lessons = modules[modIndex]?.lessons ?? [];
  if (!lessons.length) return true;
  return lessons.every((lesson) =>
    hasSubmittedTask(submissionsByLesson[String(lesson.id)]),
  );
}

export function isModuleUnlocked(
  modules: ElearningModule[],
  submissionsByLesson: Record<string, PayloadSubmission>,
  modIndex: number,
): boolean {
  if (modIndex <= 0) return true;
  return isModuleComplete(modules, submissionsByLesson, modIndex - 1);
}

export function canAccessModule(
  modules: ElearningModule[],
  submissionsByLesson: Record<string, PayloadSubmission>,
  modIndex: number,
  isCourseAdmin: boolean,
): boolean {
  if (isCourseAdmin) return true;
  return isModuleUnlocked(modules, submissionsByLesson, modIndex);
}

export function canAccessLesson(
  modules: ElearningModule[],
  submissionsByLesson: Record<string, PayloadSubmission>,
  modIndex: number,
  lessonIndex: number,
  isCourseAdmin: boolean,
): boolean {
  if (isCourseAdmin) return true;
  return (
    isModuleUnlocked(modules, submissionsByLesson, modIndex) &&
    isLessonUnlocked(modules, submissionsByLesson, modIndex, lessonIndex)
  );
}

export function getModuleSubmissionProgress(
  modules: ElearningModule[],
  submissionsByLesson: Record<string, PayloadSubmission>,
  modIndex: number,
): { submitted: number; total: number } {
  const lessons = modules[modIndex]?.lessons ?? [];
  const submitted = lessons.filter((lesson) =>
    hasSubmittedTask(submissionsByLesson[String(lesson.id)]),
  ).length;
  return { submitted, total: lessons.length };
}

export function isLessonUnlocked(
  modules: ElearningModule[],
  submissionsByLesson: Record<string, PayloadSubmission>,
  modIndex: number,
  lessonIndex: number,
): boolean {
  const flat = flattenLessons(modules);
  const idx = flat.findIndex(
    (ref) => ref.modIndex === modIndex && ref.lessonIndex === lessonIndex,
  );
  if (idx <= 0) return true;

  const prev = flat[idx - 1];
  return hasSubmittedTask(submissionsByLesson[String(prev.lessonId)]);
}

export function getFirstUnlockedLessonIndex(
  modules: ElearningModule[],
  submissionsByLesson: Record<string, PayloadSubmission>,
  modIndex: number,
): number {
  const lessons = modules[modIndex]?.lessons ?? [];
  for (let lessonIndex = 0; lessonIndex < lessons.length; lessonIndex++) {
    if (isLessonUnlocked(modules, submissionsByLesson, modIndex, lessonIndex)) {
      return lessonIndex;
    }
  }
  return 0;
}

export function getNextLessonRef(
  modules: ElearningModule[],
  modIndex: number,
  lessonIndex: number,
): FlatLessonRef | null {
  const flat = flattenLessons(modules);
  const idx = flat.findIndex(
    (ref) => ref.modIndex === modIndex && ref.lessonIndex === lessonIndex,
  );
  if (idx < 0 || idx >= flat.length - 1) return null;
  return flat[idx + 1];
}

export function findLatestUnlockedLesson(
  modules: ElearningModule[],
  submissionsByLesson: Record<string, PayloadSubmission>,
): FlatLessonRef {
  const flat = flattenLessons(modules);
  if (!flat.length) {
    return { modIndex: 0, lessonIndex: 0, lessonId: 0 };
  }

  let lastUnlocked = flat[0];
  for (const ref of flat) {
    if (
      isModuleUnlocked(modules, submissionsByLesson, ref.modIndex) &&
      isLessonUnlocked(modules, submissionsByLesson, ref.modIndex, ref.lessonIndex)
    ) {
      lastUnlocked = ref;
    } else {
      break;
    }
  }
  return lastUnlocked;
}
