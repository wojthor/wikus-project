/** Lista „Co dostajesz?” — ten sam tekst co kafelek na /unschool */
export const UNSCHOOL_PRICING_FEATURES = [
  "35 lekcji z materiałami wideo i prawdziwymi przykładami",
  "Zadania głosowe lub tekstowe po każdej lekcji",

  "Personalny feedback ode mnie na każde zadanie",
  "Certyfikat ukończenia kursu po finale",
  "Dostęp bezterminowy – bez presji czasowej",
  "Działa na telefonie, tablecie i komputerze",
] as const;

/** Kafelek oferty z hero /unschool — współdzielony z Stripe Checkout */
export const UNSCHOOL_COURSE_OFFER = {
  stripeProductName: "Unschool Your English — Pełny Dostęp",
  brand: "Unschool Your English",
  levelLabel: "Kurs online · Poziom B1–B2",
  tileEyebrow: "Co dostajesz?",
  tileTitle: "Unschool Your English",
  tagline: "Przestań się uczyć, zacznij mówić.",
  tileSubtitle: "Z feedbackiem na każde zadanie – głosowe i tekstowe.",
  heroLead:
    "Znasz słówka. Rozumiesz filmy. A mimo to przy rozmowie coś się zacina. Ten kurs naprawia dokładnie to – bez podręcznika, bez teorii na zapas, z feedbackiem ode mnie na każde zadanie.",
  stats: [
    { value: "35", label: "lekcji wideo" },
    { value: "7", label: "modułów" },
    { value: "~3", label: "miesiące nauki" },
  ] as const,
  priceAmountCents: 200,
  priceDisplay: "2 zł",
  priceCompareDisplay: "697 zł",
  priceNote: "jednorazowo · dostęp bezterminowy · bez ukrytych opłat",
  promotionBadge: "🔥 Promocja",
} as const;
