const TESTIMONIALS = [
  {
    name: "Michał",
    result: "Zdana matura z punktu zera",
    quote:
      "Gorąco polecam zajęcia z Wiktorem. Zaczynałem tak naprawdę z punktu zera, a dzięki Wiktorowi udało mi się zdać maturę pisemną na poziomie 60%! I to nie koniec – ustna też poszła bez żadnych problemów! Cierpliwość oraz zaangażowanie Wiktora jest niesamowite. Nigdy nie miałem sytuacji, że nie był, w stanie mi czegoś wytłumaczyć lub pomóc. Jestem bardzo zadowolony ze współpracy i polecam każdemu nie zależnie od poziomu zaawansowania.",
  },
  {
    name: "Kacper",
    result: "2x lepsze oceny",
    quote:
      "Od pół roku uczestniczę w zajęciach Wiktora. Oceny w szkole są 2 razy lepsze, mega poprawa w rozumieniu i mówieniu po angielsku. Tok nauczania według potrzeb każdego ucznia. Bardzo bardzo polecam",
  },
  {
    name: "Karolina",
    result: "Rozwój konwersacji",
    quote: `Serdecznie polecam korepetycje z angielskiego prowadzone przez Wiktora!
Zajęcia prowadzone są zawsze w bardzo ciekawy sposób a atmosfera na zajęciach jest luźna i motywująca do nauki.
Wiktor świetnie tłumaczy zagadnienia gramatyczne, a przy tym dba o rozwój słownictwa i umiejętności konwersacyjnych.
Dzięki jego zaangażowaniu szybko zobaczyłam postępy. Idealny wybór zarówno dla początkujących jak i bardziej zaawansowanych. ☺️`,
  },
  {
    name: "Anna",
    result: "Przełamanie bariery i elastyczność",
    quote:
      "Też chciałabym ogólną opinię napisać bo jestem naprawdę bardzo zadowolona chociażby też z samej cierpliwości twojej i przemiłej atmosfery i przede wszystkim komfortu,możliwość elastyczności bo wiadomo jest jak jest nie zawsze mogę się połączyć przez pracę więc też się cieszę że wynalazłeś formę tych „zadań domowych” bo to bardzo ułatwia i w każdej wolnej chwili mogę się uczyć języka angielskiego i też faktycznie widzę progres bo na początku w ogóle bałam się odezwać po angielsku😅 także jeśli ktoś się zastanawia to gorąco polecam standardowe korepetycje jak i w formie takich zadanek",
  },
];

export function TestimonialsSection() {
  return (
    <section
      id="opinie"
      className="flex flex-col justify-center bg-[#f8faff] rounded-2xl sm:rounded-3xl shadow-[0_16px_32px_rgba(0,0,0,0.04)] p-6 sm:p-8 md:p-10 scroll-mt-1"
    >
      <h2 className="text-[#7347f4] font-extrabold text-2xl sm:text-3xl text-center mb-2">
        Opinie
      </h2>
      <p className="text-center text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-5 sm:mb-7">
        To nie kwestia &bdquo;talentu&rdquo;. Swoją metodę przetestowałem na dziesiątkach uczniów –
        od poprawy ocen po swobodne rozmowy w pracy i na wyjeździe.
      </p>

      <div className="flex flex-col gap-3 sm:gap-4">
        {TESTIMONIALS.map((review, i) => (
          <div
            key={i}
            className="bg-white/80 border border-[#e2e7ff] rounded-xl p-4 sm:p-4 shadow-none flex flex-col justify-between"
          >
            <div>
              <div className="font-semibold text-sm sm:text-base text-slate-900">{review.name}</div>
              <div className="text-[#ffa515] text-[11px] sm:text-xs font-semibold mb-1">
                {review.result}
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {review.quote}
              </div>
            </div>
            <div className="text-[#ffa515] text-sm sm:text-base mt-2">★★★★★</div>
          </div>
        ))}
      </div>
    </section>
  );
}
