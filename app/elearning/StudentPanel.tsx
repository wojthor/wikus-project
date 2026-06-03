"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Lock, Menu, X } from "lucide-react";
import { MultidayChallenge } from "@/src/features/elearning/components/AudioRecorder";
import { LessonContentView } from "@/src/features/elearning/components/LessonContentView";
import { StudentSidebarContent } from "@/src/features/elearning/components/StudentSidebar";
import { VideoEmbed } from "@/src/features/elearning/components/VideoEmbed";
import { ModuleTag as Tag } from "@/src/features/elearning/components/ModuleTag";
import { LessonStatusPill, SubmissionStatusBanner } from "@/src/features/elearning/components/SubmissionStatusBanner";
import {
  canSubmitAnswer,
  canSupplementAnswer,
  SubmissionAnswerForm,
} from "@/src/features/elearning/components/SubmissionAnswerForm";
import { SubmissionSuccessModal } from "@/src/features/elearning/components/SubmissionSuccessModal";
import { TeacherFeedbackBlock } from "@/src/features/elearning/components/TeacherFeedbackBlock";
import { hasTeacherFeedback } from "@/src/features/elearning/lesson-status";
import {
  canAccessLesson,
  findLatestUnlockedLesson,
  getNextLessonRef,
  isLessonUnlocked,
  isModuleUnlocked,
} from "@/src/features/elearning/lesson-progression";
import { recordingFilename } from "@/src/features/elearning/browser-audio-recording";
import { resolveMediaId, resolveMediaPlaybackUrl, uploadMediaFile } from "@/src/features/elearning/media-api";
import {
  createSubmission,
  fetchSubmissionForLesson,
  fetchSubmissionsForStudent,
  getSubmissionLessonId,
  resolveMediaUrl,
  toPayloadRelationId,
  toPayloadStudentId,
  updateSubmission,
  type PayloadSubmission,
} from "@/src/features/elearning/submissions-api";
import {
  buildLessonNavigationIndex,
  type LessonRef,
} from "@/src/features/elearning/lesson-navigation";
import type { ElearningModule } from "@/src/features/elearning/types";
import { MODULE_ACCENTS } from "@/src/features/elearning/theme";

type StudentPanelProps = {
  modules: ElearningModule[];
  userId: number | string;
  isCourseAdmin: boolean;
};

export function StudentPanel({ modules, userId, isCourseAdmin }: StudentPanelProps) {
  const [activeMod, setActiveMod] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [voiceBlobs, setVoiceBlobs] = useState<Record<string, Blob>>({});
  const [voicePreviews, setVoicePreviews] = useState<Record<string, string>>({});
  const [recordings, setRecordings] = useState<Record<string, string | string[]>>({});
  const [submissionsByLesson, setSubmissionsByLesson] = useState<
    Record<string, PayloadSubmission>
  >({});
  const [currentSubmission, setCurrentSubmission] = useState<PayloadSubmission | null>(null);
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<"sent" | "supplemented" | null>(null);
  const [pendingNextLesson, setPendingNextLesson] = useState<{
    modIndex: number;
    lessonIndex: number;
  } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const lessonScrollAnchorRef = useRef<HTMLDivElement>(null);

  const safeModIndex = modules.length ? Math.min(activeMod, modules.length - 1) : 0;
  const mod = modules[safeModIndex];
  const lessons = mod?.lessons ?? [];
  const safeLessonIndex = lessons.length ? Math.min(activeLesson, lessons.length - 1) : 0;
  const lesson = lessons[safeLessonIndex];

  const accent = mod?.accent ?? "brand";
  const a = MODULE_ACCENTS[accent];
  const lessonDbId = lesson?.id;
  const answerKey = lessonDbId != null ? String(lessonDbId) : "";
  const hasSubmission = currentSubmission !== null;

  const canAccessCurrent = useMemo(
    () =>
      modules.length
        ? canAccessLesson(
            modules,
            submissionsByLesson,
            safeModIndex,
            safeLessonIndex,
            isCourseAdmin,
          )
        : true,
    [modules, submissionsByLesson, safeModIndex, safeLessonIndex, isCourseAdmin],
  );

  const moduleUnlockedForStudents = useMemo(
    () =>
      modules.length
        ? isModuleUnlocked(modules, submissionsByLesson, safeModIndex)
        : true,
    [modules, submissionsByLesson, safeModIndex],
  );

  const showUnlockOnSuccess =
    submitSuccess === "sent" && pendingNextLesson != null;

  const lessonNavIndex = useMemo(() => buildLessonNavigationIndex(modules), [modules]);

  const navigateToLessonRef = useCallback((ref: LessonRef) => {
    setActiveMod(ref.modIndex);
    setActiveLesson(ref.lessonIndex);
    setSidebarOpen(false);
    setSubmitError(null);
    setSubmitSuccess(null);
    setPendingNextLesson(null);
  }, []);

  const { done, total, pct } = useMemo(() => {
    const all = modules.flatMap((m) => m.lessons);
    const completed = all.filter((l) =>
      hasTeacherFeedback(submissionsByLesson[String(l.id)]),
    ).length;
    return {
      done: completed,
      total: all.length,
      pct: all.length ? Math.round((completed / all.length) * 100) : 0,
    };
  }, [modules, submissionsByLesson]);

  const refreshSubmissions = useCallback(async () => {
    try {
      const docs = await fetchSubmissionsForStudent(userId);
      const byLesson: Record<string, PayloadSubmission> = {};
      for (const doc of docs) {
        const lessonId = getSubmissionLessonId(doc);
        if (lessonId) byLesson[lessonId] = doc;
      }
      setSubmissionsByLesson(byLesson);
    } catch {
      // Postęp w sidebarze jest opcjonalny - nie blokuj widoku lekcji
    }
  }, [userId]);

  useEffect(() => {
    void refreshSubmissions();
  }, [refreshSubmissions]);

  useEffect(() => {
    if (!modules.length || isCourseAdmin) return;
    if (canAccessCurrent) return;
    const fallback = findLatestUnlockedLesson(modules, submissionsByLesson);
    setActiveMod(fallback.modIndex);
    setActiveLesson(fallback.lessonIndex);
  }, [modules, submissionsByLesson, canAccessCurrent, isCourseAdmin]);

  useEffect(() => {
    const scrollToTop = () => {
      lessonScrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    };
    requestAnimationFrame(scrollToTop);
  }, [safeModIndex, safeLessonIndex]);

  useEffect(() => {
    if (lessonDbId == null || lessonDbId === "") {
      setCurrentSubmission(null);
      setLoadError(null);
      return;
    }

    let cancelled = false;
    setLoadingSubmission(true);
    setLoadError(null);
    setSubmitError(null);
    setCurrentSubmission(null);

    fetchSubmissionForLesson(userId, lessonDbId)
      .then((doc) => {
        if (cancelled) return;
        setCurrentSubmission(doc);
        if (doc?.textContent) {
          setAnswers((p) => ({ ...p, [answerKey]: doc.textContent ?? "" }));
        }
        if (doc) {
          const audioUrl = resolveMediaUrl(doc.studentAudio);
          if (audioUrl) {
            setVoicePreviews((p) => ({ ...p, [answerKey]: audioUrl }));
          }
        }
        if (doc) {
          setSubmissionsByLesson((prev) => ({ ...prev, [answerKey]: doc }));
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : "Nie udało się załadować zadania.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSubmission(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, lessonDbId, answerKey]);

  const selectLesson = (mi: number, li: number) => {
    if (!canAccessLesson(modules, submissionsByLesson, mi, li, isCourseAdmin)) return;
    setActiveMod(mi);
    setActiveLesson(li);
    setSidebarOpen(false);
    setSubmitError(null);
    setSubmitSuccess(null);
    setPendingNextLesson(null);
  };

  const handleSubmit = async () => {
    if (!lesson || submitting) return;

    if (lesson.task.type === "multiday") {
      setSubmitError("Wysyłanie 7-dniowego challenge przez API będzie dostępne wkrótce.");
      return;
    }

    const textContent = answers[answerKey]?.trim() ?? "";
    const blob = voiceBlobs[answerKey];
    const canSupplement = hasSubmission && !hasTeacherFeedback(currentSubmission);

    if (hasSubmission && !canSupplement) return;

    if (!hasSubmission && !canSubmitAnswer(textContent, blob)) {
      setSubmitError("Dodaj odpowiedź tekstową, nagraj głosówkę albo oba.");
      return;
    }

    if (hasSubmission && !canSupplementAnswer(currentSubmission, textContent, blob)) {
      setSubmitError("Dodaj brakującą część odpowiedzi (tekst lub głosówkę).");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const isSupplement = hasSubmission && Boolean(currentSubmission);

    try {
      let studentAudio: number | string | undefined;
      if (blob) {
        const media = await uploadMediaFile(blob, recordingFilename(blob.type));
        studentAudio = media.id;
        if (media.url) {
          setVoicePreviews((p) => ({ ...p, [answerKey]: media.url! }));
        }
      }

      if (isSupplement && currentSubmission) {
        const patch: { textContent?: string; studentAudio?: number | string } = {};
        if (textContent && !currentSubmission.textContent?.trim()) {
          patch.textContent = textContent;
        }
        if (studentAudio != null && !resolveMediaId(currentSubmission.studentAudio)) {
          patch.studentAudio = studentAudio;
        }

        const doc = await updateSubmission(currentSubmission.id, patch);
        const refreshed = await fetchSubmissionForLesson(userId, lesson.id);
        setCurrentSubmission(refreshed ?? doc);
        setSubmissionsByLesson((prev) => ({ ...prev, [answerKey]: refreshed ?? doc }));
        setVoiceBlobs((p) => {
          const next = { ...p };
          delete next[answerKey];
          return next;
        });
        setSubmitSuccess("supplemented");
        return;
      }

      const payloadLessonId = toPayloadRelationId(lesson.id);
      const student = toPayloadStudentId(userId);

      const doc = await createSubmission({
        lesson: payloadLessonId,
        student,
        ...(textContent ? { textContent } : {}),
        ...(studentAudio != null ? { studentAudio } : {}),
      });

      const refreshed = await fetchSubmissionForLesson(userId, lesson.id);
      setCurrentSubmission(refreshed ?? doc);
      setSubmissionsByLesson((prev) => ({ ...prev, [answerKey]: refreshed ?? doc }));
      const next = getNextLessonRef(modules, safeModIndex, safeLessonIndex);
      setPendingNextLesson(
        next ? { modIndex: next.modIndex, lessonIndex: next.lessonIndex } : null,
      );
      setSubmitSuccess("sent");
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Nie udało się wysłać zadania.");
    } finally {
      setSubmitting(false);
    }
  };

  const sidebarProps = {
    modules,
    pct,
    done,
    total,
    activeMod: safeModIndex,
    activeLesson: safeLessonIndex,
    submissionsByLesson,
    isCourseAdmin,
    selectLesson,
    setActiveMod,
    setActiveLesson,
  };

  if (!modules.length) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6 py-16 text-center">
        <div className="max-w-md rounded-2xl border border-[#b9c5fe] bg-white p-8 shadow-sm">
          <p className="text-lg font-bold text-slate-900">Kurs w przygotowaniu</p>
          <p className="mt-2 text-sm text-slate-600">
            Brak modułów w CMS. Dodaj moduły i lekcje w panelu Payload (/admin).
          </p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] w-full">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[248px] shrink-0 flex-col overflow-y-auto border-r border-[#b9c5fe] bg-white md:flex">
          <StudentSidebarContent {...sidebarProps} />
        </aside>
        <div className="flex flex-1 items-center justify-center p-8 text-slate-600">
          Ten moduł nie ma jeszcze lekcji. Dodaj lekcje w panelu CMS.
        </div>
      </div>
    );
  }

  const showTeacherFeedback = hasTeacherFeedback(currentSubmission);
  const awaitingFeedback = hasSubmission && !showTeacherFeedback;
  const canSupplement = hasSubmission && awaitingFeedback;

  const canSubmitNew =
    (lesson.task.type === "text" || lesson.task.type === "audio") &&
    !hasSubmission &&
    !loadingSubmission &&
    canSubmitAnswer(answers[answerKey] ?? "", voiceBlobs[answerKey]);

  const canSubmitSupplement =
    (lesson.task.type === "text" || lesson.task.type === "audio") &&
    canSupplement &&
    !loadingSubmission &&
    canSupplementAnswer(currentSubmission, answers[answerKey] ?? "", voiceBlobs[answerKey]);

  const showSubmitButton = canSubmitNew || canSubmitSupplement;

  const navBtn =
    "rounded-xl border px-3 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:text-sm";

  const isFirstLesson = safeModIndex === 0 && safeLessonIndex === 0;
  const nextLessonRef = useMemo(
    () => getNextLessonRef(modules, safeModIndex, safeLessonIndex),
    [modules, safeModIndex, safeLessonIndex],
  );

  const canGoToNextLesson = Boolean(
    nextLessonRef &&
      (isCourseAdmin ||
        (hasSubmission &&
          canAccessLesson(
            modules,
            submissionsByLesson,
            nextLessonRef.modIndex,
            nextLessonRef.lessonIndex,
            false,
          ))),
  );

  const canGoToPrevLesson = useMemo(() => {
    if (isFirstLesson) return false;
    if (isCourseAdmin) return true;
    if (safeLessonIndex > 0) {
      return canAccessLesson(
        modules,
        submissionsByLesson,
        safeModIndex,
        safeLessonIndex - 1,
        false,
      );
    }
    if (safeModIndex > 0) {
      const prevMod = modules[safeModIndex - 1];
      const lastLi = prevMod.lessons.length - 1;
      return canAccessLesson(modules, submissionsByLesson, safeModIndex - 1, lastLi, false);
    }
    return false;
  }, [
    isFirstLesson,
    isCourseAdmin,
    safeLessonIndex,
    safeModIndex,
    modules,
    submissionsByLesson,
  ]);

  const closeSuccessModal = () => {
    setSubmitSuccess(null);
    setPendingNextLesson(null);
  };

  const continueToNextLesson = () => {
    if (pendingNextLesson) {
      selectLesson(pendingNextLesson.modIndex, pendingNextLesson.lessonIndex);
    } else {
      closeSuccessModal();
    }
  };

  return (
    <>
      <SubmissionSuccessModal
        open={submitSuccess != null}
        variant={submitSuccess ?? "sent"}
        showUnlock={showUnlockOnSuccess}
        onClose={closeSuccessModal}
        onContinue={showUnlockOnSuccess ? continueToNextLesson : undefined}
      />
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full">
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[248px] shrink-0 flex-col overflow-y-auto border-r border-[#b9c5fe] bg-white md:flex">
        <StudentSidebarContent {...sidebarProps} />
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Zamknij menu"
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-14 bottom-0 left-0 z-50 flex w-[min(100%,18rem)] flex-col overflow-y-auto border-r border-[#b9c5fe] bg-white shadow-xl transition-transform duration-300 ease-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#dfe6ff] px-4 py-3">
          <span className="text-sm font-bold text-slate-900">Spis lekcji</span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Zamknij spis lekcji"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-[#cfd8ff]/50 hover:text-[#7347f4]"
          >
            <X className="h-6 w-6" strokeWidth={2} />
          </button>
        </div>
        <StudentSidebarContent {...sidebarProps} />
      </aside>

      <div className="min-w-0 flex-1 overflow-x-hidden">
        <div className="mx-auto w-full max-w-3xl px-4 py-5 pb-20 sm:px-6 sm:py-8 md:px-10">
          <div
            ref={lessonScrollAnchorRef}
            className="scroll-mt-14"
            aria-hidden
          />
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#b9c5fe] bg-white p-3 sm:p-4 md:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Otwórz spis lekcji"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#7347f4] hover:bg-[#cfd8ff]/50"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="min-w-0 flex-1">
              <p className={`text-[10px] font-bold uppercase tracking-widest ${a.text}`}>
                {mod.tag}
              </p>
              <p className="truncate text-sm font-semibold text-slate-900">{lesson.title}</p>
            </div>
            <span className="shrink-0 text-[11px] text-slate-500">
              {safeLessonIndex + 1}/{lessons.length}
            </span>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
            <Tag accent={accent}>{mod.tag}</Tag>
            <span className="text-slate-500">
              › Lekcja {safeLessonIndex + 1} z {lessons.length}
            </span>
            {lesson.duration && <span className="text-slate-400">· {lesson.duration}</span>}
            {hasSubmission && (
              <LessonStatusPill
                variant={
                  showTeacherFeedback
                    ? "feedback_ready"
                    : awaitingFeedback
                      ? "awaiting_feedback"
                      : "submitted"
                }
              />
            )}
            {loadingSubmission && (
              <span className="text-slate-400">Ładowanie zadania…</span>
            )}
          </div>

          {loadError && (
            <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {loadError}
            </p>
          )}

          {!canAccessCurrent ? (
            <div className="rounded-2xl border border-[#b9c5fe] bg-white p-8 text-center shadow-sm sm:p-10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f3ff]">
                <Lock className="h-8 w-8 text-[#7347f4]" strokeWidth={2.25} aria-hidden />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {!moduleUnlockedForStudents ? "Moduł zablokowany" : "Lekcja zablokowana"}
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
                {!moduleUnlockedForStudents
                  ? `Wyślij wszystkie zadania w ${safeModIndex > 0 ? modules[safeModIndex - 1]?.tag : "poprzednim module"} - wtedy odblokujesz ten moduł.`
                  : "Wyślij zadanie z poprzedniej lekcji - wtedy odblokujesz dostęp do tej lekcji."}
              </p>
            </div>
          ) : (
            <>
          {hasSubmission && showTeacherFeedback && (
            <div className="mb-6">
              <SubmissionStatusBanner variant="feedback_ready" />
            </div>
          )}

          {hasSubmission && awaitingFeedback && (
            <div className="mb-6">
              <SubmissionStatusBanner variant="awaiting_feedback" />
            </div>
          )}

          <h1 className="mb-7 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {lesson.title}
          </h1>

          {lesson.videoUrl && (
            <VideoEmbed videoUrl={lesson.videoUrl} videoTitle={lesson.videoTitle} />
          )}

          <LessonContentView
            intro={lesson.intro}
            sections={lesson.sections}
            content={lesson.content}
            onNavigateToLesson={navigateToLessonRef}
            lessonNavIndex={lessonNavIndex}
          />

          <div className="mt-9 rounded-2xl border border-[#b9c5fe] bg-white p-5 shadow-sm sm:p-6 md:p-7">
            <div className="mb-4 flex gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg ${a.bgSoft}`}
              >
                ✏️
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                  Zadanie do wykonania
                </h2>
                <p className="text-xs text-slate-500 sm:text-sm">
                  {lesson.task.type === "multiday"
                    ? "7-dniowy challenge głosowy"
                    : "Tekst i/lub głosówka"}{" "}
                  · dostaniesz feedback
                </p>
              </div>
            </div>

            {lesson.task.type !== "multiday" && (
              <div className="mb-4 w-full rounded-xl border border-[#f8faff] bg-[#f8faff] p-3.5 text-sm leading-relaxed whitespace-pre-line text-slate-600 sm:p-4">
                {lesson.task.prompt}
              </div>
            )}

            {(lesson.task.type === "text" || lesson.task.type === "audio") && (
              <SubmissionAnswerForm
                textValue={answers[answerKey] || ""}
                onTextChange={(v) => setAnswers((p) => ({ ...p, [answerKey]: v }))}
                voicePreviewUrl={voicePreviews[answerKey] ?? null}
                onVoiceRecording={(blob, previewUrl) => {
                  setVoiceBlobs((p) => ({ ...p, [answerKey]: blob }));
                  setVoicePreviews((p) => ({ ...p, [answerKey]: previewUrl }));
                }}
                disabled={loadingSubmission || submitting}
                hasSubmission={hasSubmission}
                canSupplement={canSupplement}
                submission={currentSubmission}
                showTeacherFeedback={showTeacherFeedback}
              />
            )}

            {lesson.task.type === "multiday" && lesson.task.days && (
              <>
                <MultidayChallenge
                  lessonKey={answerKey}
                  days={lesson.task.days}
                  accent={accent}
                  recordings={recordings}
                  setRecordings={setRecordings}
                />
                {showTeacherFeedback && (
                  <TeacherFeedbackBlock
                    content={currentSubmission?.teacherFeedback}
                    audioUrl={resolveMediaPlaybackUrl(currentSubmission?.teacherAudio)}
                  />
                )}
              </>
            )}

            {submitError && (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {submitError}
              </p>
            )}

            <div className="mt-4">
              {showSubmitButton && (
                <button
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={submitting}
                  className={`rounded-xl px-5 py-3 text-sm font-bold transition ${a.btn} disabled:opacity-40`}
                >
                  {submitting
                    ? "Wysyłanie…"
                    : hasSubmission
                      ? "Zapisz uzupełnienie →"
                      : "Wyślij zadanie →"}
                </button>
              )}
            </div>

          </div>
            </>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => {
                if (safeLessonIndex > 0) {
                  selectLesson(safeModIndex, safeLessonIndex - 1);
                } else if (safeModIndex > 0) {
                  const prevMod = modules[safeModIndex - 1];
                  selectLesson(safeModIndex - 1, prevMod.lessons.length - 1);
                }
              }}
              disabled={!canGoToPrevLesson}
              className={`${navBtn} ${a.btnOutline} bg-white`}
            >
              ← Poprzednia
            </button>
            <button
              type="button"
              onClick={() => {
                if (nextLessonRef) selectLesson(nextLessonRef.modIndex, nextLessonRef.lessonIndex);
              }}
              disabled={!canGoToNextLesson}
              className={`${navBtn} ${a.btn}`}
            >
              Następna →
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
