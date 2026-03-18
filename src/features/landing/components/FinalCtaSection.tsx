import { finalCta } from "@/data/content";

type FinalCtaSectionProps = { data: typeof finalCta };

export function FinalCtaSection({ data }: FinalCtaSectionProps) {
  const headline = data.emotionalCloseHeadline.replace(/^[^:]+:\s*/, "");
  const ctaHeadline = data.finalCtaHeadline.replace(/^CTA:\s*/, "");
  const ctaParts = ctaHeadline.split("Ciebie");

  return (
    <section id="final-cta" className="relative w-full px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-5 text-2xl font-bold tracking-tight text-[#7347f4] sm:text-3xl">{headline}</h2>
        <div className="mb-6 space-y-3">
          <div className="rounded-2xl border-2 border-dashed border-[#b9c5fe] bg-white p-4 text-left sm:p-5">
            <p className="text-base text-slate-700 sm:text-lg">{data.option1}</p>
          </div>
          <div className="rounded-2xl border-2 border-[#7347f4] bg-[#cfd8ff] p-4 text-left sm:p-5">
            <p className="text-base font-bold text-[#243cb5] sm:text-lg">{data.option2}</p>
          </div>
        </div>
        <h3 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">{data.afterPurchaseHeadline}</h3>
        <div className="mb-6 rounded-2xl border-2 border-dashed border-[#b9c5fe] bg-white p-4 text-left sm:p-5">
          <p className="mb-2 text-base text-slate-700 sm:text-lg">Po rezerwacji lub zakupie kursu dostaniesz:</p>
          <ol className="list-decimal list-inside space-y-1.5 text-base text-slate-700 sm:text-lg">
            {data.afterPurchaseSteps.map((step, i) => (
              <li key={i}>{step.replace(/^Po rezerwacji lub zakupie kursu dostaniesz\s+/, "")}</li>
            ))}
          </ol>
        </div>
        <div className="mb-4 rounded-2xl border-2 border-dashed border-[#b9c5fe] bg-white px-4 py-3 sm:px-5 sm:py-4">
          <p className="text-center text-base font-bold text-slate-800 sm:text-lg">
            {ctaParts.length > 1 ? (
              <>
                {ctaParts[0]}
                <span className="underline decoration-2 decoration-[#ffa515]">Ciebie</span>
                {ctaParts[1]}
              </>
            ) : (
              ctaHeadline
            )}
          </p>
        </div>
        <p className="mb-5 text-center text-sm text-slate-600 sm:text-base">{data.finalCtaText}</p>
        <a
          href={data.finalButtonAnchor}
          className="inline-block rounded-4xl bg-[#ffbd53] px-8 py-5 text-lg sm:px-10 sm:py-5 sm:text-xl font-bold text-white shadow-md transition hover:bg-[#f5ad3f] hover:shadow-lg"
        >
          {data.finalButtonLabel}
        </a>
      </div>
    </section>
  );
}
