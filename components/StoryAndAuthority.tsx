"use client";

import type { storyAndAuthority as StoryContent } from "@/data/content";

interface StoryAndAuthorityProps {
  content: typeof StoryContent;
}

export function StoryAndAuthority({ content }: StoryAndAuthorityProps) {
  return (
    <section
      id="o-mnie"
      className="relative w-full bg-zinc-950 px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-10 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          {content.sectionTitle}
        </h2>

        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
          {/* Author image placeholder */}
          <div className="shrink-0 lg:w-80">
            {/* Replace with next/image when author photo is available at content.authorImagePlaceholder */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-800 ring-1 ring-zinc-700/50 flex items-center justify-center">
              <span className="text-center text-sm text-zinc-500 px-4">
                Zdjęcie: {content.authorName}
              </span>
            </div>
            <p className="mt-3 text-lg font-semibold text-white">
              {content.authorName}
            </p>
            <p className="text-sm text-amber-400/90">{content.authorTitle}</p>
          </div>

          {/* Timeline-style content */}
          <div className="flex-1 space-y-8">
            <div>
              <h3 className="mb-2 text-lg font-bold text-amber-400">
                {content.authorityHeadline}
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                {content.originStory}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-bold text-amber-400">
                {content.turningPointHeadline}
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                {content.turningPointText}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-bold text-amber-400">
                {content.newPathHeadline}
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                {content.newPathText}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-bold text-amber-400">
                {content.positiveEffectsHeadline}
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                {content.positiveEffectsText}
              </p>
            </div>

            <p className="rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-4 text-zinc-300 sm:p-5">
              {content.additionalBenefits}
            </p>

            <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-5 sm:p-6">
              <h3 className="mb-2 text-lg font-bold text-white">
                {content.costOfSolutionHeadline}
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                {content.costOfSolutionText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
