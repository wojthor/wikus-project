"use client";

type UnschoolAudioPlayerProps = {
  src: string;
  downloadHref?: string;
  filename?: string;
  className?: string;
};

/** Prosty odtwarzacz — bez pobierania blobem (unika znikania przy odtwarzaniu). */
export function UnschoolAudioPlayer({
  src,
  downloadHref,
  filename = "nagranie.webm",
  className = "",
}: UnschoolAudioPlayerProps) {
  const download = downloadHref ?? src;

  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <audio controls preload="metadata" src={src} style={{ width: "100%" }}>
        Twoja przeglądarka nie obsługuje odtwarzania audio.
      </audio>
      <a href={download} download={filename} target="_blank" rel="noopener noreferrer">
        Pobierz nagranie
      </a>
    </div>
  );
}
