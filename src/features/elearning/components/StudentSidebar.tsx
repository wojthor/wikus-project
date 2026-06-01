"use client";

import { Lock } from "lucide-react";

import type { LessonProgressStatus } from "../lesson-status";
import { getLessonProgressStatus, LESSON_STATUS_LABELS } from "../lesson-status";
import {
  canAccessLesson,
  canAccessModule,
  getFirstUnlockedLessonIndex,
  isLessonUnlocked,
  isModuleUnlocked,
} from "../lesson-progression";
import type { PayloadSubmission } from "../submissions-api";
import type { ElearningModule } from "../types";
import { MODULE_ACCENTS } from "../theme";
import { LessonStatusIcon } from "./LessonStatusIcon";

type SidebarProps = {
  modules: ElearningModule[];
  pct: number;
  done: number;
  total: number;
  activeMod: number;
  activeLesson: number;
  submissionsByLesson: Record<string, PayloadSubmission>;
  isCourseAdmin: boolean;
  selectLesson: (mi: number, li: number) => void;
  setActiveMod: (mi: number) => void;
  setActiveLesson: (li: number) => void;
};

const LEGEND: LessonProgressStatus[] = [
  "locked",
  "not_started",
  "in_progress",
  "awaiting_feedback",
  "completed",
];

export function StudentSidebarContent({
  modules,
  pct,
  done,
  total,
  activeMod,
  activeLesson,
  submissionsByLesson,
  isCourseAdmin,
  selectLesson,
  setActiveMod,
  setActiveLesson,
}: SidebarProps) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-[#dfe6ff] px-4 py-3.5 sm:px-5">
        <div className="mb-1.5 flex justify-between text-xs text-slate-500">
          <span>Postęp kursu</span>
          <span className="font-bold text-slate-900">{pct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#f8faff]">
          <div
            className="h-full rounded-full bg-[#7347f4] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          {done} z {total} ukończonych
        </p>
      </div>
      {modules.map((m, mi) => {
        const a = MODULE_ACCENTS[m.accent];
        const isActiveMod = activeMod === mi;
        const moduleUnlocked = isModuleUnlocked(modules, submissionsByLesson, mi);
        const canOpenModule = canAccessModule(modules, submissionsByLesson, mi, isCourseAdmin);
        const isModuleLocked = !moduleUnlocked;
        const prevModTag = mi > 0 ? modules[mi - 1]?.tag : undefined;

        return (
          <div key={m.id}>
            <button
              type="button"
              disabled={!canOpenModule}
              onClick={() => {
                if (!canOpenModule) return;
                setActiveMod(mi);
                setActiveLesson(
                  isCourseAdmin ? 0 : getFirstUnlockedLessonIndex(modules, submissionsByLesson, mi)
                );
              }}
              title={
                moduleUnlocked
                  ? undefined
                  : `Wyślij wszystkie zadania w ${prevModTag ?? "poprzednim module"}`
              }
              className={`flex w-full items-start gap-2 border-l-[3px] px-4 py-2.5 text-left transition sm:px-5 ${
                canOpenModule ? "cursor-pointer" : "cursor-not-allowed opacity-55"
              } ${
                isActiveMod
                  ? `${a.borderL} ${a.bgSoft}`
                  : isModuleLocked
                    ? `${a.bgSoft}`
                    : "border-l-transparent hover:bg-[#f8faff]/80"
              }`}
            >
              {isModuleLocked && (
                <Lock
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                  strokeWidth={2.25}
                  aria-label="Moduł zablokowany"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className={`mb-0.5 text-[10px] font-bold uppercase tracking-widest ${a.text}`}>
                  {m.tag}
                </p>
                <p
                  className={`text-sm ${
                    isActiveMod ? "font-bold text-slate-900" : "font-medium text-slate-600"
                  }`}
                >
                  {m.emoji} {m.title}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">{m.lessons.length} lekcji</p>
              </div>
            </button>
            {isActiveMod && canOpenModule && (
              <div className="border-b border-[#f8faff] bg-[#fafbff]">
                {m.lessons.map((l, li) => {
                  const lessonKey = String(l.id);
                  const isActiveLesson = activeLesson === li;
                  const unlocked = isLessonUnlocked(modules, submissionsByLesson, mi, li);
                  const status = getLessonProgressStatus(
                    submissionsByLesson[lessonKey],
                    isActiveLesson,
                    unlocked
                  );
                  const canSelect = canAccessLesson(
                    modules,
                    submissionsByLesson,
                    mi,
                    li,
                    isCourseAdmin
                  );

                  return (
                    <button
                      key={l.id}
                      type="button"
                      disabled={!canSelect}
                      onClick={() => {
                        if (canSelect) selectLesson(mi, li);
                      }}
                      title={
                        unlocked ? undefined : "Wyślij zadanie z poprzedniej lekcji, aby odblokować"
                      }
                      className={`flex w-full items-start gap-2 border-l-[3px] py-2 pl-4 pr-3 text-left sm:pl-5 ${
                        canSelect ? "cursor-pointer" : "cursor-not-allowed opacity-55"
                      } ${
                        isActiveLesson
                          ? `${a.borderL} bg-white`
                          : "border-l-transparent hover:bg-white/70"
                      }`}
                    >
                      <LessonStatusIcon status={status} />
                      <span
                        className={`min-w-0 flex-1 text-xs leading-snug ${
                          isActiveLesson ? "font-semibold text-slate-900" : "text-slate-600"
                        }`}
                      >
                        {l.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      <div className="mt-auto border-t border-[#dfe6ff] px-4 py-3 sm:px-5">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Legenda
        </p>
        <ul className="space-y-1.5">
          {LEGEND.map((key) => (
            <li key={key} className="flex items-center gap-2 text-[10px] text-slate-500">
              <LessonStatusIcon status={key} />
              <span>{LESSON_STATUS_LABELS[key]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
