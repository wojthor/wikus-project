/**
 * Strona kursów i korepetycji z angielskiego – treści VSL.
 * Format: [hasło ze skryptu]: Tekst
 */

export const site = {
  name: "Projekt dla Wikusia",
  tagline: "Angielski, który w końcu otwiera drzwi",
} as const;

// ─── 1. Hook, 2. Pytanie + korzyść, 4. Obietnica ───────────────────────────
export const hero = {
  hook: "Hook: Tysiące osób codziennie swobodnie mówi po angielsku w pracy i podróżach. A Ty wciąż blokujesz się przed rozmową lub wkuwasz gramatykę w kółko?",
  question:
    "Pytanie + korzyść: Jeśli chcesz w końcu mówić po angielsku pewnie – bez wstydu, bez godzin nad podręcznikiem",
  benefit:
    "– to zostań na chwilę. Pokażę Ci, jak kursy i korepetycje dopasowane do Ciebie zmieniają podejście do języka.",
  promise:
    "Obietnica: Za chwilę zobaczysz konkretną ofertę: indywidualne korepetycje i kursy online (gramatyka, konwersacje, biznes). Możesz zacząć od jednej lekcji lub od kursu – wszystko bez wychodzenia z domu, w swoim tempie.",
  ctaLabel: "Zobacz ofertę",
  ctaAnchor: "#oferta",
  videoPlaceholderLabel: "Odtwórz wideo",
} as const;

// ─── 3. Agitacja niepowodzeń, 9. Identyfikacja problemu, 10. Odkrycie spisku ─
export const problemAgitation = {
  headline: "Dlaczego większość ludzi nie udaje się z angielskim?",
  subheadline:
    "Agitacja niepowodzeń: Słyszysz, że angielski to must-have, a z drugiej strony – że lata w szkole i tak nic nie dają, że „trzeba mieć talent” albo wyjechać za granicę.",
  problemIntro:
    "Identyfikacja problemu: Gdy sam przeszedłem od zera do swobodnej rozmowy, zrozumiałem, że problem nie leży w braku talentu. Brakowało mi metody: konkretnych kroków, regularnej praktyki mówienia i materiałów dopasowanych do celu, a nie do podręcznika.",
  conspiracyHeadline: "Odkrycie spisku",
  conspiracyText:
    "Większość osób, które „nie umieją angielskiego”, po prostu nigdy nie uczyła się pod kątem mówienia. Wkuwały regułki i listy słówek bez użycia w zdaniach. Wystarczy zmienić podejście: mniej teorii w nieskończoność, więcej rozmowy i powtarzalnych schematów – wtedy angielski w końcu zaczyna „wchodzić”.",
  painPoints: [
    "Lata nauki w szkole, a w rozmowie pustka w głowie lub strach przed błędem.",
    "Przekonanie, że angielski to „tylko dla zdolnych” albo że trzeba wyjechać za granicę.",
    "Godziny nad gramatyką bez przełożenia na to, co mówisz na co dzień.",
    "Brak jasnego planu: co robić krok po kroku, żeby w końcu mówić.",
  ],
} as const;

// ─── 5. Autorytet, 6. Historia początków, 7. Postanowienie, 8. Nowa droga, 11. Efekty, 13. Dodatkowe korzyści, 15. Koszt rozwiązania ─
export const storyAndAuthority = {
  sectionTitle: "O mnie",
  authorBio:
    "Nauczyciel angielskiego i autor kursów online. Pomagam dorosłym i młodzieży przełamać barierę w mówieniu i zbudować pewność – metodę sprawdziłem na dziesiątkach uczniów.",
  authorityHeadline:
    "Sam zaczynałem od zera – wstyd przed mówieniem, chaos w głowie. Dziś uczę innych; moi uczniowie zdają maturę, wyjeżdżają do pracy i swobodnie rozmawiają po angielsku.",
  originStory:
    "W szkole angielski był dla mnie koszmarem. Bałem się odezwać, żeby nie wyjść na głupka. W wieku nastu lat czułem, że „to nie dla mnie”.",
  turningPointHeadline: "Postanowienie zmiany",
  turningPointText:
    "Postanowiłem uczyć się inaczej: mniej suchych reguł, więcej mówienia i słuchania. Znalazłem sposób, który działa bez wyjazdu za granicę.",
  newPathHeadline: "Nowa droga",
  newPathText:
    "Przetestowałem dziesiątki metod i kursów. Połączyłem to, co naprawdę buduje umiejętność mówienia: konwersacje, powtarzalne schematy i materiał dopasowany do celu.",
  positiveEffectsHeadline: "Efekty",
  positiveEffectsText:
    "Gdy w końcu postawiłem na mówienie, przestałem się blokować. Dziś prowadzę lekcje i kursy – i widzę ten sam przełom u innych.",
  additionalBenefits:
    "Angielski dał mi nie tylko oceny i certyfikaty – otworzył drzwi do pracy, podróży i codziennego kontaktu z językiem.",
  costOfSolutionHeadline: "Dlaczego dzielę się wiedzą",
  costOfSolutionText:
    "Straciłem mnóstwo czasu na metodę, która nie działa. Gdybym wcześniej wiedział to, co teraz wdrażam z uczniami, zaoszczędziłbym lata – dlatego uczę innych tą drogą.",
  authorName: "Wiktor Szycha",
  authorImagePlaceholder: "/wikus3.png",
  authorTitle: "Nauczyciel angielskiego",
  credentialsHeadline: "Certyfikaty i doświadczenie",
  credentials: [
    { label: "Grudziądzka Szkoła Biznesu", detail: "język angielski" },
    { label: "Kurs metodyczny dla nauczycieli", detail: "nauczanie języka" },
    { label: "50+ lat w nauczaniu", detail: "korepetycje i kursy" },
  ],
} as const;

// ─── 12. Dowód społeczny ───────────────────────────────────────────────────
export const testimonials = {
  sectionTitle: "Dowód społeczny",
  subheadline:
    "To nie kwestia „talentu”. Swoją metodę przetestowałem na dziesiątkach uczniów – od poprawy ocen po swobodne rozmowy w pracy i na wyjeździe.",
  items: [
    {
      quote: "W końcu przestałem się bać mówić. Korepetycje i kurs dały mi strukturę i pewność.",
      author: "Lebron James",
      result: "Matura rozszerzona, wyjazd na studia",
      rating: 5,
    },
    {
      quote: "Konkretnie, bez lania wody. Polecam każdemu, kto chce w końcu ogarnąć angielski.",
      author: "Maks Konkiel",
      result: "Angielski w pracy na co dzień",
      rating: 5,
    },
    {
      quote: "Na dziesiątkach uczniów – poprawa ocen, matury i pewność w mówieniu.",
      author: "Carcia Loncz ",
      result: "Efekty w kilka miesięcy",
      rating: 5,
    },
  ],
} as const;

// ─── 14. Wstęp do oferty, 16. Korzyści, 17. Podsumowanie oferty, 18. Zbudowanie wartości ─
export const offerDetails = {
  sectionTitle: "Oferta – co dokładnie dostajesz",
  introHeadline: "Wstęp do oferty",
  introText:
    "Prowadzę korepetycje indywidualne i kursy online z angielskiego. Możesz wybrać lekcje „na żywo” dopasowane do Ciebie albo gotowe kursy (gramatyka, konwersacje, biznes).",
  keyBenefitsHeadline: "Korzyści",
  offerSummaryHeadline: "Podsumowanie oferty",
  valueBuildUpHeadline: "Zbudowanie wartości",
  valueBuildUpText:
    "Tę wiedzę i strukturę zdobywa się latami – ja zebrałem to w kursy i lekcje, które możesz przerobić w swoim tempie. Bez dojazdów, bez sztywnego grafiku grupowego.",

  tutoring: {
    label: "Korepetycje",
    headline: "Standardowe korepetycje (1:1)",
    description:
      "Indywidualne spotkania dopasowane w 100% do Twoich potrzeb – płatność z góry co miesiąc, stałe miejsce w grafiku i prezentacje oraz materiały wysyłane po każdych zajęciach.",
    ctaLabel: "Umów lekcję",
    ctaUrl: "mailto:kontakt@example.com?subject=Umówienie%20korepetycji%20z%20angielskiego",
  },
  courses: [
    {
      id: "pakiet-1",
      title: "Kurs offline (10 lekcji)",
      shortDescription: "Kompletny kurs stacjonarny składający się z 10 praktycznych lekcji.",
      price: "57 zł",
      gumroadUrl: "https://www.youtube.com/watch?v=E7XQR4dd3u8",
      ctaLabel: "Kup przez",
      format: "10 spotkań stacjonarnych skupionych na praktycznym użyciu języka.",
      duration: "Czas trwania: 10 lekcji.",
    },
    {
      id: "pakiet-2",
      title: "Indywidualny plan nauczania offline",
      shortDescription: "Spersonalizowany plan nauki dopasowany do Twojego poziomu i celów.",
      price: "150 zł / miesiąc",
      gumroadUrl: "https://www.youtube.com/watch?v=E7XQR4dd3u8",
      ctaLabel: "Kup przez",
      format: "Plan nauki przygotowany indywidualnie na każdy miesiąc.",
      duration: "Rozliczenie miesięczne.",
    },
    {
      id: "pakiet-3",
      title: "Zajęcia grupowe w parach (Speaking)",
      shortDescription:
        "Konwersacje w 2-osobowej grupie (45 min). Ja moderuję dyskusję i poprawiam błędy na bieżąco.",
      price: "120 zł (60 zł / osobę)",
      gumroadUrl: "https://www.youtube.com/watch?v=E7XQR4dd3u8",
      ctaLabel: "Kup przez",
      format: "Zajęcia konwersacyjne w parach, 45 minut.",
    },
    {
      id: "pakiet-4",
      title: "Zajęcia grupowe w trójkach (Speaking)",
      shortDescription:
        "Konwersacje w 3-osobowej grupie (45 min). Ja moderuję dyskusję i upewniam się, że każdy mówi.",
      price: "135 zł (45 zł / osobę)",
      gumroadUrl: "https://www.youtube.com/watch?v=E7XQR4dd3u8",
      ctaLabel: "Kup przez",
      format: "Zajęcia konwersacyjne w 3-osobowych grupach, 45 minut.",
    },
  ],
} as const;

// ─── 19. Cena, 20. Gwarancja, 21. Deadline ─────────────────────────────────
export const pricingAndGuarantee = {
  sectionTitle: "Cennik i gwarancja",
  pricePresentationHeadline: "Cena",
  digitalProductPrice: "od 67 zł",
  digitalProductLabel: "Kursy online",
  tutoringHourlyRate: "80 zł / 60 min",
  tutoringLabel: "Korepetycje – opcjonalnie",
  guaranteeHeadline: "Gwarancja",
  guaranteeText:
    "Jestem pewny swojej metody – sprawdziłem ją na dziesiątkach uczniów. Jeśli w ciągu pierwszych zajęć uznasz, że to nie dla Ciebie, zwrócę Ci koszt lub zaproponuję inną formę.",
  urgencyHeadline: "Deadline",
  urgencyText:
    "Miejsca na korepetycje i promocyjne ceny kursów są ograniczone. Warto zarezerwować termin lub kurs wcześniej.",
  buyDigitalLabel: "Kup kurs",
  buyTutoringLabel: "Umów korepetycje",
  gumroadDigitalUrl: "https://www.youtube.com/watch?v=E7XQR4dd3u8",
  gumroadTutoringUrl: "https://www.youtube.com/watch?v=E7XQR4dd3u8",
} as const;

// ─── 22. Emocjonalne zamknięcie, 23. Po zakupie, 24. CTA ───────────────────
export const finalCta = {
  emotionalCloseHeadline: "Emocjonalne zamknięcie: Masz 2 opcje",
  option1: "Możesz dalej odkładać angielski i wciąż się blokować przy każdej rozmowie.",
  option2: "Albo już dziś umówić lekcję lub wybrać kurs i w końcu ruszyć z miejsca.",
  afterPurchaseHeadline: "Co się stanie po zakupie / rezerwacji",
  afterPurchaseSteps: [
    "Po rezerwacji lub zakupie kursu dostaniesz potwierdzenie i link do materiałów lub kalendarza.",
    "Korepetycje – ustalimy termin. Kursy – od razu masz dostęp i możesz zaczynać.",
  ],
  finalCtaHeadline:
    "CTA: Jeśli naprawdę chcesz w końcu mówić po angielsku, umów lekcję lub wybierz kurs. Pierwszy krok zależy od Ciebie.",
  finalCtaText: "Kliknij przycisk poniżej i przejdź do oferty – wybierz korepetycje lub kurs.",
  finalButtonLabel: "Zobacz ofertę",
  finalButtonAnchor: "#oferta",
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
} as const;

export type Content = typeof content;
