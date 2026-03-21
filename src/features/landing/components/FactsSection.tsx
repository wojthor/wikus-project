const PAIN_POINTS = [
  "Nauka „na zapas” zamiast używania języka. Znasz teorię, ale nie potrafisz jej użyć.",
  "Czekanie aż „będę gotowy, żeby mówić”. Spoiler: ten moment nigdy nie przychodzi.",
  "Brak regularnego kontaktu z językiem. Angielski pojawia się tylko od czasu do czasu.",
  "Chaos w nauce: trochę aplikacji, trochę filmów, trochę notatek, ale bez kierunku.",
];

export function FactsSection() {
  return (
    <section
      id="fakty"
      className="min-h-[70vh] flex flex-col justify-center space-y-6 sm:space-y-8 py-8 sm:py-5 scroll-mt-24"
    >
      <div className="text-center">
        <h2 className="text-[#7347f4] font-extrabold text-2xl sm:text-3xl mb-4">Fakty</h2>
        <div className="inline-flex justify-center bg-[#cfd8ff] text-[#3e57d6] rounded-full px-6 py-2.5 text-base sm:text-lg font-bold shadow-sm">
          Dlaczego mimo lat nauki nadal trudno mówić po angielsku?
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start">
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-slate-600">
          <p className="text-slate-700">
            <span className="font-bold text-[#7347f4]">Mimo lat nauki coś nie idzie</span>
            <br />
            Masz wrażenie, że coś tu nie gra?
            <br />
            Uczyłeś się angielskiego przez lata: w szkole, z aplikacji, z kursów... a mimo to:
          </p>
          <ul className="space-y-1 text-slate-700">
            <li>
              <span className="mr-2">👉</span>dalej trudno Ci się odezwać
            </li>
            <li>
              <span className="mr-2">👉</span>blokujesz się przy prostych zdaniach
            </li>
            <li>
              <span className="mr-2">👉</span>czujesz, że &quot;powinieneś umieć więcej&quot;
            </li>
          </ul>

          <div className="text-slate-700">
            <p>
              <span className="font-bold text-[#7347f4]">W czym tkwi Twój problem?</span>
              <br />
              To nie jest kwestia braku zdolności.
              <br />
              Problem jest prosty: uczysz się w sposób, który nie przygotowuje Cię do mówienia.
            </p>
            <p className="mt-[1em]">
              I dlatego możesz znać słówka, ale nie używać ich w rozmowie, rozumieć dużo, ale nie
              potrafić odpowiedzieć i uczyć się miesiącami bez realnego efektu.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {PAIN_POINTS.map((text, i) => (
            <div
              key={i}
              className="bg-white border border-[#7347f4] rounded-2xl shadow-sm p-4 sm:p-5 flex items-start gap-4"
            >
              <div className="shrink-0 w-10 h-10 bg-[#cfd8ff] text-[#3e57d6] rounded-xl flex items-center justify-center">
                <span className="text-lg leading-none">❌</span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
