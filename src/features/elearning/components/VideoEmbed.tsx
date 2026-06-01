"use client";

import { parseVideoEmbedUrl } from "../video-embed-url";

const PORTRAIT_FRAME =
  "mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-[#b9c5fe] bg-slate-900 shadow-sm sm:max-w-[320px] md:max-w-[360px]";

const LANDSCAPE_FRAME =
  "mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[#b9c5fe] bg-slate-900 shadow-sm";

export function VideoEmbed({
  videoUrl,
  videoTitle,
}: {
  videoUrl: string | null;
  videoTitle: string | null;
}) {
  const parsed = videoUrl ? parseVideoEmbedUrl(videoUrl) : null;
  const portrait = parsed?.portrait ?? true;
  const frameClass = portrait ? PORTRAIT_FRAME : LANDSCAPE_FRAME;
  const aspectClass = portrait ? "relative aspect-[9/16] w-full" : "relative aspect-video w-full";

  if (parsed) {
    return (
      <div className={`mb-7 ${frameClass}`}>
        <div className={aspectClass}>
          <iframe
            src={parsed.embedUrl}
            title={videoTitle ?? "Wideo lekcji"}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {videoTitle && (
          <p className="border-t border-[#dfe6ff] bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
            {videoTitle}
          </p>
        )}
      </div>
    );
  }

  return null;
}
