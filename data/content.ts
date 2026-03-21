/**
 * Strona kursów i korepetycji z angielskiego – treści VSL.
 * Format: [hasło ze skryptu]: Tekst
 */

export const site = {
  name: "Szycha",
  tagline: "Od „umiem coś” do „mówię normalnie”.",
} as const;

// ─── 1. Hook, 2. Pytanie + korzyść, 4. Obietnica ───────────────────────────
export const hero = {
  hook: "Dla aż 70% osób mówienie po angielsku to czysty stres",
  question: "…mimo że znają słówka i rozumieją więcej, niż im się wydaje",
  benefit: "Pokażę Ci, jak zacząć mówić pewnie:",
  promise: "bez chaosu, bez szkolnego podejścia, w ludzki sposób.",
  ctaLabel: "Zobacz ofertę",
  ctaAnchor: "#oferta",
  videoPlaceholderLabel: "Odtwórz wideo",
} as const;

// ─── 3. Agitacja niepowodzeń, 9. Identyfikacja problemu, 10. Odkrycie spisku ─
export const problemAgitation = {
  headline: "Dlaczego mimo lat nauki nadal trudno mówić po angielsku?",
  subheadline:
    "Masz wrażenie, że coś tu nie gra? Uczyłeś się angielskiego przez lata: w szkole, z aplikacji, z kursów… a mimo to: 👉 dalej trudno Ci się odezwać 👉 blokujesz się przy prostych zdaniach 👉 czujesz, że „powinieneś umieć więcej”",
  problemIntro:
    "To nie jest kwestia braku zdolności. Problem jest prosty: uczysz się w sposób, który nie przygotowuje Cię do mówienia",
  conspiracyHeadline: "W czym tkwi Twój problem?",
  conspiracyText:
    "I dlatego możesz: znać słówka, ale nie używać ich w rozmowie, rozumieć dużo, ale nie potrafić odpowiedzieć, uczyć się miesiącami… bez realnego efektu.",
  painPoints: [
    "❌ Nauka „na zapas” zamiast używania języka. Znasz teorię, ale nie potrafisz jej użyć.",
    "❌ Czekanie aż „będę gotowy, żeby mówić”. Spoiler: ten moment nigdy nie przychodzi.",
    "❌ Brak regularnego kontaktu z językiem. Angielski pojawia się tylko „od czasu do czasu”.",
    "❌ Chaos w nauce. Trochę aplikacji, trochę filmów, trochę notatek… ale bez konkretnego kierunku.",
  ],
} as const;

// ─── 5. Autorytet, 6. Historia początków, 7. Postanowienie, 8. Nowa droga, 11. Efekty, 13. Dodatkowe korzyści, 15. Koszt rozwiązania ─
export const storyAndAuthority = {
  sectionTitle: "O MNIE",
  authorBio:
    "Pomagam osobom takim jak Ty w końcu zacząć mówić po angielsku: bez stresu, bez chaosu i bez „szkolnego podejścia”. Nie uczę tylko języka. Pokazuję, jak go używać w praktyce.",
  authorityHeadline:
    "Z angielskim zawsze było u mnie dobrze. Rozumiałem dużo, ogarniałem teorię, uczyłem się szybko. Ale kiedy przychodziło do mówienia?\n👉 stres\n👉 blokada\n👉 overthinking\nI to mimo tego, że „powinienem umieć”.",
  originStory:
    "Z czasem ogarnąłem jedną rzecz:\n👉 znajomość języka ≠ umiejętność mówienia\nTo są dwie różne rzeczy. I jeśli uczysz się tylko teorii, to możesz rozumieć wszystko i dalej nie potrafić się odezwać.",
  turningPointHeadline: "CO ZROBIŁEM INACZEJ?",
  turningPointText:
    "Zacząłem skupiać się na tym, co faktycznie działa: mówienie od początku, realne użycie języka i regularność zamiast „zrywów”. I wtedy wszystko zaczęło się układać.",
  newPathHeadline: "DZIŚ",
  newPathText:
    "Dziś uczę tego samego innych. Pomagam osobom, które „coś umieją”, ale nie mówią, czują blokadę i mają chaos w nauce, w końcu zacząć używać angielskiego w praktyce.",
  positiveEffectsHeadline: "",
  positiveEffectsText: "",
  additionalBenefits: "",
  costOfSolutionHeadline: "",
  costOfSolutionText: "",
  authorName: "Wiktor Szyszkowski",
  authorImagePlaceholder: "/wikus3.png",
  authorTitle: "Nauczyciel angielskiego",
  credentialsHeadline: "TO PO PRAWEJ",
  planHeadline: "Prosty plan",
  planTasks: [
    "Mów od pierwszych zajęć — bez czekania na „idealny moment”.",
    "Jasny kierunek zamiast chaosu w materiałach.",
    "Regularność: krótko, ale często.",
    "Ćwicz to, co realnie użyjesz w rozmowie.",
  ],
  credentials: [
    { label: "ponad 4-letnie doświadczenie", detail: "" },
    { label: "0 uczniów, którzy zrezygnowali z zajęć ze mną", detail: "" },
    { label: "ukończone studia z filologii angielskiej", detail: "" },
  ],
} as const;

// ─── 12. Dowód społeczny ───────────────────────────────────────────────────
export const testimonials = {
  sectionTitle: "Opinie",
  subheadline:
    "To nie kwestia „talentu”. Swoją metodę przetestowałem na dziesiątkach uczniów – od poprawy ocen po swobodne rozmowy w pracy i na wyjeździe.",
  items: [
    {
      quote:
        "Gorąco polecam zajęcia z Wiktorem. Zaczynałem tak naprawdę z punktu zera, a dzięki Wiktorowi udało mi się zdać maturę pisemną na poziomie 60%! I to nie koniec – ustna też poszła bez żadnych problemów! Cierpliwość oraz zaangażowanie Wiktora jest niesamowite. Nigdy nie miałem sytuacji, że nie był, w stanie mi czegoś wytłumaczyć lub pomóc. Jestem bardzo zadowolony ze współpracy i polecam każdemu nie zależnie od poziomu zaawansowania.",
      author: "Marcel",
      result: "Zdana matura z punktu zera",
      rating: 5,
    },
    {
      quote:
        "Od pół roku uczestniczę w zajęciach Wiktora. Oceny w szkole są 2 razy lepsze, mega poprawa w rozumieniu i mówieniu po angielsku. Tok nauczania według potrzeb każdego ucznia. Bardzo bardzo polecam",
      author: "Maks",
      result: "2x lepsze oceny",
      rating: 5,
    },
    {
      quote: `Serdecznie polecam korepetycje z angielskiego prowadzone przez Wiktora!
Zajęcia prowadzone są zawsze w bardzo ciekawy sposób a atmosfera na zajęciach jest luźna i motywująca do nauki.
Wiktor świetnie tłumaczy zagadnienia gramatyczne, a przy tym dba o rozwój słownictwa i umiejętności konwersacyjnych.
Dzięki jego zaangażowaniu szybko zobaczyłam postępy. Idealny wybór zarówno dla początkujących jak i bardziej zaawansowanych. ☺️`,
      author: "Martyna",
      result: "Rozwój konwersacji",
      rating: 5,
    },
    {
      quote:
        "Też chciałabym ogólną opinię napisać bo jestem naprawdę bardzo zadowolona chociażby też z samej cierpliwości twojej i przemiłej atmosfery i przede wszystkim komfortu,możliwość elastyczności bo wiadomo jest jak jest nie zawsze mogę się połączyć przez pracę więc też się cieszę że wynalazłeś formę tych „zadań domowych” bo to bardzo ułatwia i w każdej wolnej chwili mogę się uczyć języka angielskiego i też faktycznie widzę progres bo na początku w ogóle bałam się odezwać po angielsku😅 także jeśli ktoś się zastanawia to gorąco polecam standardowe korepetycje jak i w formie takich zadanek",
      author: "Wiktoria",
      result: "Przełamanie bariery i elastyczność",
      rating: 5,
    },
  ],
} as const;

// ─── 14. Wstęp do oferty, 16. Korzyści, 17. Podsumowanie oferty, 18. Zbudowanie wartości ─
export const offerDetails = {
  sectionTitle: "Oferta – co dokładnie dostajesz?",
  introHeadline: "",
  introText: "",
  keyBenefitsHeadline: "Korzyści",
  offerSummaryHeadline: "Podsumowanie oferty",
  valueBuildUpHeadline: "Zbudowanie wartości->CO DOSTAJESZ?",
  valueBuildUpText:
    "Tego nie uczysz się z jednej książki czy kursu. Przez lata obserwowałem nauczycieli i korepetytorów. Brałem to, co działa… i odrzucałem to, co tylko zabiera czas. Dlatego na zajęciach: 👉 skupiamy się na mówieniu i realnym użyciu języka 👉 nie robimy rzeczy „bo tak się zawsze robiło” 👉 masz jasny system, bez chaosu i zgadywania",

  tutoring: {
    label: "Indywidualne zajęcia 1:1",
    headline: "Indywidualne zajęcia 1:1",
    description:
      "Uczysz się dokładnie tego, czego potrzebujesz, żeby w końcu zacząć mówić, a nie tylko „rozumieć”. Bez chaosu, bez zgadywania, co robić dalej.",
    ctaLabel: "🔥 Zarezerwuj miejsce w grafiku",
    gumroadUrl45: "https://wiktorszyszkowski.gumroad.com/l/eleuh",
    gumroadUrl60: "https://wiktorszyszkowski.gumroad.com/l/rmrkjf",
  },
  courses: [
    {
      id: "pakiet-1",
      title: "Kurs offline (10 lekcji)",
      shortDescription:
        "Kompletny “plan treningowy” angielskiego. Nie masz czasu na regularne lekcje? Nie ma problemu. Dzięki kursowi dostaniesz ode mnie praktyczne zadania, które pomogą Ci mówić pewnie – w swoim własnym zakresie. Uczysz się, kiedy tylko masz na to czas.",
      price: "57 zł",
      gumroadUrl: "https://wiktorszyszkowski.gumroad.com/l/rmrkjf",
      ctaLabel: "🔥 Zarezerwuj miejsce w grafiku",
      format:
        "✔️ Co dostajesz:\njasną strukturę nauki\nmini zadania pod speaking\nmateriały i narzędzia, które faktycznie działają\nmentoring i feedback po wykonaniu zadań",
      duration: "👉 idealne, jeśli:\nnie masz czasu na regularne lekcje\nchcesz mieć system nauki",
    },
    {
      id: "pakiet-2",
      title: "Indywidualny plan nauki (offline)",
      shortDescription:
        "Dla osób, które chcą działać samodzielnie, ale bez chaosu i bez zastanawiania się „co dalej”.",
      price: "150 zł",
      gumroadUrl:
        "https://wiktorszyszkowski.gumroad.com/l/wtjdpa?_gl=1*g5azfz*_ga*MjAzMjA1NzEyOS4xNzczNTk2MTE5*_ga_6LJN6D94N6*czE3NzM1OTYxMTkkbzEkZzEkdDE3NzM1OTcxMTIkajYwJGwwJGgw",
      ctaLabel: "🔥 Zarezerwuj miejsce w grafiku",
      format:
        "✔️ Co dostajesz:\nplan dopasowany do Twojego poziomu i celu\njasną strukturę (co robić dzień po dniu)\nmini zadania pod speaking\nmateriały i narzędzia, które faktycznie działają\nmentoring i feedback po wykonaniu zadań",
      duration: "👉 idealne, jeśli:\nnie masz czasu na regularne lekcje\nchcesz mieć system nauki.",
    },
    {
      id: "pakiet-3",
      title: "Zajęcia grupowe w parach (Speaking)",
      shortDescription:
        "Konwersacje w 2-osobowej grupie (45 min). Ja moderuję dyskusję i poprawiam błędy na bieżąco.",
      price: "120 zł (60 zł / osobę)",
      gumroadUrl: "https://wiktorszyszkowski.gumroad.com/l/wtjdpa",
      ctaLabel: "Kup przez",
      format:
        "✔️ Co dostajesz:\nZajęcia w 2-osobowej grupie (45 min)\nJa moderuję dyskusję i poprawiam błędy na bieżąco\nWięcej czasu na mówienie niż na notatki",
    },
    {
      id: "pakiet-4",
      title: "Zajęcia grupowe w trójkach (Speaking)",
      shortDescription:
        "Konwersacje w 3-osobowej grupie (45 min). Ja moderuję dyskusję i upewniam się, że każdy mówi.",
      price: "135 zł (45 zł / osobę)",
      gumroadUrl: "https://wiktorszyszkowski.gumroad.com/l/wtjdpa",
      ctaLabel: "Kup przez",
      format:
        "✔️ Co dostajesz:\nZajęcia w 3-osobowej grupie (45 min)\nDbam o to, żeby każdy mówił w równym stopniu\nIdealne dla osób, które lubią uczyć się w grupie",
    },
  ],
} as const;

// ─── 19. Cena, 20. Gwarancja, 21. Deadline ─────────────────────────────────
export const pricingAndGuarantee = {
  sectionTitle: "Cennik i gwarancja",
  pricePresentationHeadline: "Cena",
  digitalProductPrice: "45 min – 70 zł",
  digitalProductLabel: "👉 Szybka, konkretna sesja (idealna przy napiętym grafiku)",
  tutoringHourlyRate: "80 zł",
  tutoringLabel: "👉 Pełna lekcja: konwersacja + wyjaśnienia + feedback",
  guaranteeHeadline: "Pierwsza lekcja (zamiast „gwarancji”)",
  guaranteeText:
    "Nie zapisujesz się w ciemno. Pierwsza lekcja jest darmowa. Żebyś mógł sprawdzić, czy ten styl nauki Ci odpowiada. Podczas niej: 👉 poznajemy Twój poziom i cel 👉 robimy pierwszą rozmowę 👉 pokazuję Ci, jak pracujemy. I dopiero wtedy decydujesz, czy chcesz iść dalej. BTW: Do tej pory 100% osób zostało po pierwszej lekcji.",
  urgencyHeadline: "Deadline->Miejsca są ograniczone!",
  urgencyText:
    "Pracuję na ograniczonej liczbie miejsc. Zależy mi na jakości, nie ilości. Dlatego nie przyjmuję więcej osób, niż jestem w stanie dobrze poprowadzić. 👉 Jeśli widzisz wolny termin, warto go zarezerwować wcześniej",
  buyDigitalLabel: "Kup kurs",
  buyTutoringLabel: "Umów korepetycje",
  gumroadDigitalUrl: "https://www.youtube.com/watch?v=E7XQR4dd3u8",
  gumroadTutoringUrl: "https://www.youtube.com/watch?v=E7XQR4dd3u8",
} as const;

// ─── 22. Emocjonalne zamknięcie, 23. Po zakupie, 24. CTA ───────────────────
export const finalCta = {
  emotionalCloseHeadline: "Masz 2 opcje",
  option1: "Opcja 1: Możesz dalej odkładać angielski i blokować się przy każdej rozmowie.",
  option2: "Opcja 2: Albo zacząć działać już teraz i w końcu ogarnąć mówienie bez stresu.",
  afterPurchaseHeadline: "Co się stanie dalej?",
  afterPurchaseSteps: [
    "👉 dostajesz dostęp / link do spotkania lub materiałów",
    "👉 ustalamy szczegóły i zaczynamy działać",
    "👉 nic nie jest „na ślepo” – wszystko masz jasno rozpisane",
  ],
  finalCtaHeadline:
    "Jeśli chcesz w końcu mówić po angielsku, to nie potrzebujesz więcej teorii. Potrzebujesz zacząć, a pierwszy krok jest bardzo prosty.",
  finalCtaText: "",
  finalButtonLabel: "Umów pierwszą lekcję!",
  finalButtonAnchor: "#oferta",
} as const;

// ─── Dodatkowe elementy od Wikusia (niewystępujące w starym pliku) ─────────
export const popup = {
  title: "Odbierz darmowy plan nauki angielskiego (bez chaosu)",
  description:
    "Zapisz się i otrzymaj prosty plan + krótkie zadania, dzięki którym w końcu ruszysz z angielskim. Nawet jeśli masz mało czasu.",
  bullets: ["1 mail tygodniowo", "krótkie zadania ze speakingu", "powiększenie słownictwa"],
} as const;

export const footer = {
  name: "Wiktor Szyszkowski",
  tagline: "Od „umiem coś” do „mówię normalnie”.",
  contact: "796 151 334 | wiktorszyszkowski@outlook.com",
  facebook: "https://www.facebook.com/profile.php?id=61587249547968",
  instagram: "https://www.instagram.com/szycha_/",
} as const;

// Export all as one object for convenience
export const content = {
  site,
  hero,
  problemAgitation,
  storyAndAuthority,
  testimonials,
  offerDetails,
  pricingAndGuarantee,
  finalCta,
  popup,
  footer,
} as const;

export type Content = typeof content;
