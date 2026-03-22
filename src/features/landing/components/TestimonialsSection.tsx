import type { TestimonialsData } from "@/data/content";

function Stars({ rating }: { rating: number }) {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span aria-label={`Ocena: ${safeRating} na 5`}>
      {"★".repeat(safeRating)}
      {"☆".repeat(5 - safeRating)}
    </span>
  );
}

type TestimonialsSectionProps = {
  data: TestimonialsData;
};

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  return (
    <section
      id="opinie"
      className="flex flex-col justify-center bg-[#f8faff] rounded-2xl sm:rounded-3xl shadow-[0_16px_32px_rgba(0,0,0,0.04)] p-6 sm:p-8 md:p-10"
    >
      <h2 className="text-[#7347f4] font-extrabold text-2xl sm:text-3xl text-center mb-2">
        {data.sectionTitle}
      </h2>
      <p className="text-center text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-5 sm:mb-7">
        {data.subheadline}
      </p>

      <div className="flex flex-col gap-3 sm:gap-4">
        {data.items.map((review, i) => (
          <div
            key={i}
            className="bg-white/80 border border-[#e2e7ff] rounded-xl p-4 sm:p-4 shadow-none flex flex-col justify-between"
          >
            <div>
              <div className="font-semibold text-sm sm:text-base text-slate-900">
                {review.author}
              </div>
              <div className="text-[#ffa515] text-[11px] sm:text-xs font-semibold mb-1">
                {review.result}
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {review.quote}
              </div>
            </div>
            <div className="text-[#ffa515] text-sm sm:text-base mt-2">
              <Stars rating={review.rating} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
