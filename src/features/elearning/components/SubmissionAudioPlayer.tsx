type SubmissionAudioPlayerProps = {
  src: string;
  label: string;
  className?: string;
};

export function SubmissionAudioPlayer({
  src,
  label,
  className = "",
}: SubmissionAudioPlayerProps) {
  return (
    <div
      className={`w-full overflow-hidden rounded-xl border border-[#dfe6ff] bg-[#f8faff] p-3 sm:p-4 ${className}`}
    >
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <audio controls src={src} className="w-full accent-[#7347f4]" preload="none">
        Twoja przeglądarka nie obsługuje odtwarzacza audio.
      </audio>
    </div>
  );
}
