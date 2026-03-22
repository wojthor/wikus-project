import type { factsSection } from "@/data/content";

type FactsData = typeof factsSection;

type FactsSectionProps = {
  data: FactsData;
};

export function FactsSection({ data }: FactsSectionProps) {
  return (
    <section
      id="fakty"
      className="min-h-[70vh] flex flex-col justify-center space-y-6 sm:space-y-8 py-8 sm:py-12"
    >
      <div className="text-center">
        <h2 className="text-[#7347f4] font-extrabold text-2xl sm:text-3xl mb-4">
          {data.sectionTitle}
        </h2>
        <div className="inline-flex justify-center bg-[#cfd8ff] text-[#3e57d6] rounded-full px-6 py-2.5 text-base sm:text-lg font-bold shadow-sm">
          {data.pillText}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start">
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-slate-600">
          <p className="text-slate-700">
            <span className="font-bold text-[#7347f4]">{data.introLead}</span>
            <br />
            {data.introLine1}
            <br />
            {data.introLine2}
          </p>
          <ul className="space-y-1 text-slate-700">
            {data.introBullets.map((item) => (
              <li key={item}>
                <span className="mr-2">{data.introBulletPrefix}</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="text-slate-700">
            <p>
              <span className="font-bold text-[#7347f4]">{data.conspiracyTitle}</span>
              <br />
              {data.conspiracyLead}
              <br />
              {data.conspiracyMid}
            </p>
            <p className="mt-[1em]">{data.conspiracyClosing}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {data.painPoints.map((text) => (
            <div
              key={text}
              className="bg-white border border-[#7347f4] rounded-2xl shadow-sm p-4 sm:p-5 flex items-start gap-4"
            >
              <div className="shrink-0 w-10 h-10 bg-[#cfd8ff] text-[#3e57d6] rounded-xl flex items-center justify-center">
                <span className="text-lg leading-none">{data.painCardIcon}</span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
