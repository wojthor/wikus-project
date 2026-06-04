/** Treści landing page – edytuj tutaj copy. */

export const hero = {
  hook: "Dla aż 70% osób mówienie po angielsku to czysty stres",
  headline: "Mimo że znają słówka i rozumieją więcej, niż im się wydaje.",
  benefit: "Pokażę Ci, jak zacząć mówić pewnie:",
  promise: "bez chaosu, bez szkolnego podejścia, w ludzki sposób.",
  ctaLabel: "Zobacz ofertę",
  ctaAnchor: "#oferta",
  secondaryCtaLabel: "O mnie",
  secondaryCtaAnchor: "#o-mnie",
  portraitSrc: "/wikus4.png",
  portraitAlt: "Wiktor Szycha",
} as const;

export const factsSection = {
  sectionTitle: "Fakty",
  pillText: "Dlaczego mimo lat nauki nadal trudno mówić po angielsku?",
  introLead: "Mimo lat nauki coś nie idzie",
  introLine1: "Masz wrażenie, że coś tu nie gra?",
  introLine2: "Uczyłeś się angielskiego przez lata: w szkole, z aplikacji, z kursów... a mimo to:",
  introBulletPrefix: "👉",
  introBullets: [
    "dalej trudno Ci się odezwać",
    "blokujesz się przy prostych zdaniach",
    "czujesz, że „powinieneś umieć więcej”",
  ],
  conspiracyTitle: "W czym tkwi Twój problem?",
  conspiracyLead: "To nie jest kwestia braku zdolności.",
  conspiracyMid:
    "Problem jest prosty: uczysz się w sposób, który nie przygotowuje Cię do mówienia.",
  conspiracyClosing:
    "I dlatego możesz znać słówka, ale nie używać ich w rozmowie, rozumieć dużo, ale nie potrafić odpowiedzieć i uczyć się miesiącami bez realnego efektu.",
  painCardIcon: "❌",
  painPoints: [
    "Nauka „na zapas” zamiast używania języka. Znasz teorię, ale nie potrafisz jej użyć.",
    "Czekanie aż „będę gotowy, żeby mówić”. Spoiler: ten moment nigdy nie przychodzi.",
    "Brak regularnego kontaktu z językiem. Angielski pojawia się tylko od czasu do czasu.",
    "Chaos w nauce: trochę aplikacji, trochę filmów, trochę notatek, ale bez kierunku.",
  ],
} as const;

export const storyAndAuthority = {
  sectionTitle: "O mnie",
  historyCapsuleLabel: "HISTORIA",
  breakthroughCapsuleLabel: "PRZEŁOM",
  scrollMoreHint: "Przewiń, by zobaczyć więcej",
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
  authorName: "Wiktor Szyszkowski",
  authorImagePlaceholder: "/wikus3.png",
  credentials: [
    { label: "ponad 4-letnie doświadczenie", detail: "" },
    { label: "0 uczniów, którzy zrezygnowali z zajęć ze mną", detail: "" },
    { label: "ukończone studia z filologii angielskiej", detail: "" },
  ],
} as const;

export type StoryAndAuthorityData = typeof storyAndAuthority;

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

export type TestimonialsData = typeof testimonials;

export const offerDetails = {
  sectionTitleAccent: "Oferta",
  sectionTitleRest: " – co dokładnie dostajesz?",
  coursesSubheading: "Kursy i zajęcia grupowe",
  tutoringBenefitsHeading: "✔️ Co dostajesz:",
  gumroadPurchaseLabel: "Kup przez",
  gumroadLogoAlt: "Gumroad",

  tutoring: {
    headline: "Indywidualne zajęcia 1:1",
    description:
      "Uczysz się dokładnie tego, czego potrzebujesz, żeby w końcu zacząć mówić, a nie tylko „rozumieć”. Bez chaosu, bez zgadywania, co robić dalej.",
    ctaLabel: "🔥 Zarezerwuj miejsce w grafiku",
    benefits: [
      "zajęcia dopasowane do Twojego poziomu i celu",
      "realne mówienie + poprawki na bieżąco",
      "konkretne materiały po każdej lekcji",
      "stałe miejsce w grafiku (zero szukania terminów)",
    ],
    durationLabel45: "45 min",
    durationLabel60: "60 min",
    bookLessonCta: "Umów lekcję",
    gumroadUrl45: "tel:+48796151334",
    gumroadUrl60: "tel:+48796151334",
  },

  offerClosing: [
    {
      title: "Co dostajesz?",
      blocks: [
        {
          kind: "p-emphasis" as const,
          before:
            "Tego nie uczysz się z jednej książki czy kursu. Przez lata obserwowałem nauczycieli i korepetytorów. Brałem to, co ",
          emphasis: "działa",
          after: ", i odrzucałem to, co tylko zabiera czas.",
          emphasisClass: "text-slate-700",
        },
        { kind: "p" as const, text: "Dlatego na zajęciach:" },
        {
          kind: "ul" as const,
          items: [
            "skupiamy się na mówieniu i realnym użyciu języka",
            "nie robimy rzeczy „bo tak się zawsze robiło”",
            "masz jasny system, bez chaosu i zgadywania",
          ],
        },
      ],
    },
    {
      title: "Pierwsza lekcja",
      blocks: [
        {
          kind: "p-emphasis" as const,
          before: "Nie zapisujesz się w ciemno. Pierwsza lekcja jest ",
          emphasis: "darmowa",
          after: ", żebyś mógł sprawdzić, czy ten styl nauki Ci odpowiada.",
          emphasisClass: "font-extrabold text-[#7347f4]",
        },
        { kind: "p" as const, text: "Podczas niej:" },
        {
          kind: "ul" as const,
          items: [
            "poznajemy Twój poziom i cel",
            "robimy pierwszą rozmowę",
            "pokazuję Ci, jak pracujemy",
          ],
        },
        { kind: "p" as const, text: "I dopiero wtedy decydujesz, czy chcesz iść dalej." },
        {
          kind: "btw" as const,
          before: "BTW: Do tej pory ",
          strong: "100% osób",
          after: " zostało po pierwszej lekcji.",
        },
      ],
    },
    {
      title: "Miejsca są ograniczone!",
      blocks: [
        {
          kind: "p" as const,
          text: "Pracuję na ograniczonej liczbie miejsc. Zależy mi na jakości, nie ilości.",
        },
        {
          kind: "p-emphasis" as const,
          before: "Dlatego nie przyjmuję ",
          emphasis: "więcej osób",
          after: ", niż jestem w stanie dobrze poprowadzić.",
          emphasisClass: "font-semibold text-[#7347f4]",
        },
        {
          kind: "ul-emphasis" as const,
          before: "Jeśli mam ",
          emphasis: "wolny termin",
          after: ", warto go zarezerwować wcześniej",
          emphasisClass: "font-semibold text-[#7347f4]",
        },
      ],
    },
  ],
  courses: [
    {
      id: "pakiet-unschool",
      title: "Unschool Your English",
      tagline: "Od rozumienia do swobodnej rozmowy – bez podręcznika na zapas.",
      shortDescription:
        "Rozumiesz filmy i teksty, ale przy rozmowie coś się zacina? 35 lekcji, mówienie od pierwszego dnia i mój feedback na każde zadanie – bez podręcznika i bez teorii na zapas.",
      price: "2 zł",
      priceCompare: "697 zł",
      priceNote: "jednorazowo · dostęp bezterminowy",
      featured: true,
      cta: { type: "internal", href: "/unschool", label: "Przejdź na stronę kursu" },
      format:
        "✔️ Co dostajesz:\n35 lekcji z materiałami wideo i prawdziwymi przykładami\nzadania głosowe lub tekstowe po każdej lekcji\npersonalny feedback na każde zadanie\ncertyfikat ukończenia kursu po finale\ndostęp bezterminowy – uczysz się we własnym tempie",
      duration:
        "👉 Idealne, jeśli:\njesteś na poziomie B1–B2\nchcesz w końcu przełamać barierę mówienia\npotrzebujesz systemu, nie kolejnej aplikacji",
    },
    {
      id: "pakiet-2",
      title: "Indywidualny plan nauki (offline)",
      shortDescription:
        "Dla osób, które chcą działać samodzielnie, ale bez chaosu i bez zastanawiania się „co dalej”.",
      price: "150 zł",
      cta: {
        type: "gumroad",
        url: "https://wiktorszyszkowski.gumroad.com/l/wtjdpa?_gl=1*g5azfz*_ga*MjAzMjA1NzEyOS4xNzczNTk2MTE5*_ga_6LJN6D94N6*czE3NzM1OTYxMTkkbzEkZzEkdDE3NzM1OTcxMTIkajYwJGwwJGgw",
      },
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
      cta: {
        type: "email",
        href: "tel:+48796151334",
        label: "Napisz do mnie",
      },
      format:
        "✔️ Co dostajesz:\nZajęcia w 2-osobowej grupie (45 min)\nJa moderuję dyskusję i poprawiam błędy na bieżąco\nWięcej czasu na mówienie niż na notatki",
    },
    {
      id: "pakiet-4",
      title: "Zajęcia grupowe w trójkach (Speaking)",
      shortDescription:
        "Konwersacje w 3-osobowej grupie (45 min). Ja moderuję dyskusję i upewniam się, że każdy mówi.",
      price: "135 zł (45 zł / osobę)",
      cta: {
        type: "email",
        href: "tel:+48796151334",
        label: "Napisz do mnie",
      },
      format:
        "✔️ Co dostajesz:\nZajęcia w 3-osobowej grupie (45 min)\nDbam o to, żeby każdy mówił w równym stopniu\nIdealne dla osób, które lubią uczyć się w grupie",
    },
  ],
} as const;

export const pricingAndGuarantee = {
  oneOnOne45Price: "70 zł",
  digitalProductLabel: "Szybka, konkretna sesja (idealna przy napiętym grafiku)",
  tutoringHourlyRate: "80 zł",
  tutoringLabel: "Pełna lekcja: konwersacja + wyjaśnienia + feedback",
} as const;

export const finalCta = {
  emotionalCloseHeadline: "Masz 2 opcje",
  option1: "Opcja 1: Możesz dalej odkładać angielski i blokować się przy każdej rozmowie.",
  option2: "Opcja 2: Albo zacząć działać już teraz i w końcu ogarnąć mówienie bez stresu.",
  afterPurchaseHeadline: "Co się stanie dalej?",
  afterPurchaseIntro: "Po rezerwacji lub zakupie kursu dostaniesz:",
  afterPurchaseSteps: [
    "👉 dostajesz dostęp / link do spotkania lub materiałów",
    "👉 ustalamy szczegóły i zaczynamy działać",
    "👉 nic nie jest „na ślepo” – wszystko masz jasno rozpisane",
  ],
  finalCtaHeadline:
    "Jeśli chcesz w końcu mówić po angielsku, to nie potrzebujesz więcej teorii. Potrzebujesz zacząć, a pierwszy krok jest bardzo prosty.",
  finalButtonLabel: "Umów pierwszą lekcję!",
  finalButtonAnchor: "#oferta",
} as const;

export type FinalCtaData = typeof finalCta;

export const navbar = {
  brand: { label: "SZYSZKOWSKI", href: "#top" },
  linksDesktop: [
    { label: "Fakty", href: "#fakty" },
    { label: "O mnie", href: "#o-mnie" },
    { label: "Oferta", href: "#oferta" },
    { label: "Opinie", href: "#opinie" },
  ],
  linksMobile: [
    { label: "Fakty", href: "#fakty" },
    { label: "Oferta", href: "#oferta" },
    { label: "O mnie", href: "#o-mnie" },
    { label: "Opinie", href: "#opinie" },
  ],
  ariaOpenMenu: "Otwórz menu",
  ariaCloseMenu: "Zamknij menu",
} as const;

export type NavbarData = typeof navbar;

export const footer = {
  name: "Wiktor Szyszkowski",
  tagline: "Od „umiem coś” do „mówię normalnie”.",
  navHeading: "Nawigacja",
  contactHeading: "Kontakt",
  navLinks: [
    { label: "Fakty", href: "#fakty" },
    { label: "O mnie", href: "#o-mnie" },
    { label: "Oferta", href: "#oferta" },

    { label: "Opinie", href: "#opinie" },
  ],
  phoneHref: "tel:+48796151334",
  phoneDisplay: "796 151 334",
  email: "kontakt@wiktorszyszkowski.pl",
  emailHref: "mailto:kontakt@wiktorszyszkowski.pl",
  facebookUrl: "https://www.facebook.com/profile.php?id=61587249547968",
  instagramUrl: "https://www.instagram.com/szycha_/",
  facebookAriaLabel: "Facebook",
  instagramAriaLabel: "Instagram",
  poweredByLead: "Powered by",
  poweredByName: "Wojciech Aniszewski",
  poweredByUrl: "https://aniszewski-code.pl",
  copyrightYear: "2026",
  visualConceptLead: "Visual concept by",
  visualConceptLinkText: "wilczynska.visuals",
  visualConceptMailHref: "mailto:wilczynska.visuals@gmail.com",
  bottomSeparator: "·",
} as const;

export type FooterData = typeof footer;

export const newsletter = {
  storageKey: "newsletter_dismissed",
  portraitSrc: "/wikus.jpg",
  portraitAlt: "Autor newslettera",
  title: "Odbierz darmowy plan nauki angielskiego (bez chaosu)",
  introLead: "Zapisz się i otrzymaj ",
  introHighlight: "prosty plan + krótkie zadania",
  introMiddle: ", dzięki którym w końcu ruszysz z angielskim. Nawet jeśli masz mało ",
  introAccentLine: "czasu.",
  successTitle: "Dziękujemy za zapis!",
  successDescription:
    "W ciągu chwili dostaniesz pierwszy mail z planem nauki. Sprawdź też folder spam/oferty.",
  emailLabel: "Adres e-mail",
  emailPlaceholder: "np. imie@twojmail.pl",
  submitButton: "ODBIERAM PLAN!",
  submitLoading: "Wysyłanie…",
  consent:
    "Wyrażam zgodę na otrzymywanie maili związanych z nauką angielskiego. Mogę wypisać się w każdej chwili.",
  bullets: ["1 mail tygodniowo", "krótkie zadania ze speakingu", "powiększenie słownictwa"],
  closeAriaLabel: "Zamknij okno newslettera",
} as const;

export type NewsletterData = typeof newsletter;

export const content = {
  hero,
  factsSection,
  storyAndAuthority,
  testimonials,
  offerDetails,
  pricingAndGuarantee,
  finalCta,
  navbar,
  footer,
  newsletter,
} as const;

export type Content = typeof content;
