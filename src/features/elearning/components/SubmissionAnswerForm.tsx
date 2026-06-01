"use client";

import { AudioRecorder } from "./AudioRecorder";
import { SubmissionAudioPlayer } from "./SubmissionAudioPlayer";
import { TeacherFeedbackBlock } from "./TeacherFeedbackBlock";
import type { PayloadSubmission } from "../submissions-api";
import { resolveMediaId, resolveMediaPlaybackUrl } from "../submissions-api";
import { lexicalToPlainText } from "./LexicalContent";

type SubmissionAnswerFormProps = {
  textValue: string;
  onTextChange: (value: string) => void;
  voicePreviewUrl: string | null;
  onVoiceRecording: (blob: Blob, previewUrl: string) => void;
  disabled: boolean;
  hasSubmission: boolean;
  canSupplement: boolean;
  submission: PayloadSubmission | null;
  showTeacherFeedback: boolean;
};

export function SubmissionAnswerForm({
  textValue,
  onTextChange,
  voicePreviewUrl,
  onVoiceRecording,
  disabled,
  hasSubmission,
  canSupplement,
  submission,
  showTeacherFeedback,
}: SubmissionAnswerFormProps) {
  const submittedAudioUrl = resolveMediaPlaybackUrl(submission?.studentAudio);
  const hasSubmittedText = Boolean(submission?.textContent?.trim());
  const hasSubmittedVoice = Boolean(submittedAudioUrl ?? resolveMediaId(submission?.studentAudio));

  const teacherAudioUrl = resolveMediaPlaybackUrl(submission?.teacherAudio);
  const hasTextFeedback =
    showTeacherFeedback &&
    Boolean(
      submission?.teacherFeedback &&
        lexicalToPlainText(submission.teacherFeedback).trim().length > 0,
    );

  const showTextInput = !hasSubmission || (canSupplement && !hasSubmittedText);
  const showVoiceInput = !hasSubmission || (canSupplement && !hasSubmittedVoice);
  const inputsDisabled = disabled || (hasSubmission && !canSupplement);

  return (
    <div className="flex flex-col gap-4">
      {!hasSubmission && (
        <p className="text-xs text-slate-500 sm:text-sm">
          Możesz wysłać sam tekst, samą głosówkę albo oba naraz.
        </p>
      )}

      {canSupplement && !hasSubmittedText && hasSubmittedVoice && (
        <p className="text-xs text-slate-500 sm:text-sm">
          Masz już głosówkę - możesz dodać jeszcze odpowiedź tekstową przed feedbackiem Wiktora.
        </p>
      )}

      {canSupplement && hasSubmittedText && !hasSubmittedVoice && (
        <p className="text-xs text-slate-500 sm:text-sm">
          Masz już tekst - możesz dodać jeszcze głosówkę przed feedbackiem Wiktora.
        </p>
      )}

      {showTextInput && (
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Odpowiedź tekstowa
          </p>
          <textarea
            value={textValue}
            onChange={(e) => onTextChange(e.target.value)}
            disabled={inputsDisabled}
            placeholder="Wpisz swoją odpowiedź"
            className="box-border min-h-28 w-full resize-y rounded-xl border border-[#b9c5fe] bg-white px-3.5 py-3 text-sm leading-relaxed text-slate-800 outline-none transition focus:border-[#7347f4] focus:ring-2 focus:ring-[#cfd8ff] disabled:bg-[#f8faff] sm:px-4"
          />
        </div>
      )}

      {showVoiceInput && (
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Odpowiedź głosowa
          </p>
          <AudioRecorder
            saved={voicePreviewUrl}
            disabled={inputsDisabled}
            onRecording={onVoiceRecording}
          />
        </div>
      )}

      {hasSubmittedText && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-3.5 sm:p-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Twoja odpowiedź · tekst
          </p>
          <div className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
            {submission?.textContent}
          </div>
        </div>
      )}

      {hasSubmittedVoice && submittedAudioUrl && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-3.5 sm:p-4">
          <SubmissionAudioPlayer src={submittedAudioUrl} label="Twoja odpowiedź · głos" />
        </div>
      )}

      {showTeacherFeedback && (teacherAudioUrl || hasTextFeedback) && (
        <TeacherFeedbackBlock
          content={submission?.teacherFeedback}
          audioUrl={teacherAudioUrl}
        />
      )}
    </div>
  );
}

export function canSubmitAnswer(textValue: string, voiceBlob: Blob | null | undefined): boolean {
  return Boolean(textValue.trim()) || voiceBlob != null;
}

export function canSupplementAnswer(
  submission: PayloadSubmission | null,
  textValue: string,
  voiceBlob: Blob | null | undefined,
): boolean {
  if (!submission) return false;

  const hasText = Boolean(submission.textContent?.trim());
  const hasVoice = Boolean(resolveMediaId(submission.studentAudio));
  const addingText = !hasText && Boolean(textValue.trim());
  const addingVoice = !hasVoice && voiceBlob != null;

  return addingText || addingVoice;
}
