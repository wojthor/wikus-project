import {
  UNSCHOOL_TESTIMONIALS,
  type UnschoolTestimonial,
  type UnschoolVideoTestimonial,
} from "@/src/features/unschool/testimonials";

/** Dopasowane do wysokości karty wideo: slot filmu + stopka + padding. */
const CARD_HEIGHT_CLASS = "h-full min-h-[34rem] sm:min-h-[36.5rem]";

const cardClass = `flex flex-col overflow-hidden rounded-2xl border border-[#dfe6ff] bg-white shadow-[0_12px_40px_rgba(115,71,244,0.06)] sm:rounded-3xl ${CARD_HEIGHT_CLASS}`;

const cardBodyClass = "flex h-full flex-col px-5 py-5 sm:px-6 sm:py-6";

const mainClass = "flex h-full min-h-0 flex-col";

/** Wysokość kontenera filmu — bez zmiany proporcji telefonu wewnątrz. */
const VIDEO_SLOT_CLASS = "h-[28rem] w-full shrink-0 sm:h-[30rem]";

function Stars() {
  return <div className="text-sm tracking-wider text-[#ffbd53]">★★★★★</div>;
}

function TestimonialFooter({ author }: { author: string }) {
  return (
    <div className="shrink-0 pt-3">
      <Stars />
      <p className="mt-2 font-bold text-[#7347f4]">{author}</p>
    </div>
  );
}

function PhoneVideoFrame({ video }: { video: UnschoolVideoTestimonial["video"] }) {
  return (
    <div className="flex h-full min-h-0 w-full items-start justify-center">
      <div className="relative mx-auto h-full max-h-full w-auto max-w-full overflow-hidden rounded-[1.85rem] border-[3px] border-slate-900/90 bg-slate-950 shadow-[0_16px_32px_rgba(15,23,42,0.2)] ring-1 ring-white/10 aspect-[9/16] sm:rounded-[2rem]">
        <div className="pointer-events-none absolute left-1/2 top-2.5 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-slate-800/90" />
        <video
          className="h-full w-full object-cover"
          src={video.src}
          poster={video.poster ?? undefined}
          controls
          playsInline
          preload="metadata"
        />
      </div>
    </div>
  );
}

function TextTestimonialCard({ item }: { item: Extract<UnschoolTestimonial, { kind: "text" }> }) {
  return (
    <article className={cardClass}>
      <div className={cardBodyClass}>
        <div className={mainClass}>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 sm:text-[15px]">
              {item.text}
            </p>
          </div>
          <TestimonialFooter author={item.author} />
        </div>
      </div>
    </article>
  );
}

function VideoTestimonialCard({ item }: { item: Extract<UnschoolTestimonial, { kind: "video" }> }) {
  return (
    <article className={cardClass}>
      <div className={cardBodyClass}>
        <div className={mainClass}>
          <div className={VIDEO_SLOT_CLASS}>
            <PhoneVideoFrame video={item.video} />
          </div>
          <TestimonialFooter author={item.author} />
        </div>
      </div>
    </article>
  );
}

function TestimonialCard({ item }: { item: UnschoolTestimonial }) {
  if (item.kind === "text") {
    return <TextTestimonialCard item={item} />;
  }
  return <VideoTestimonialCard item={item} />;
}

export function UnschoolTestimonialsSection() {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10">
      {UNSCHOOL_TESTIMONIALS.map((item) => (
        <TestimonialCard key={item.id} item={item} />
      ))}
    </div>
  );
}
