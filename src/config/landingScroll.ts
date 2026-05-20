import type { CSSProperties } from "react";

/**
 * Przewijanie do kotwic (`#fakty`, `#o-mnie`, …) – **edytuj tylko `top`**.
 * Ta sama wartość trafia na `scroll-padding-top` w `app/layout.tsx` oraz do opcjonalnego `scroll-margin` sekcji.
 */
export const landingAnchorScroll = {
  top: "calc(5rem + 8px)",
} as const;

/**
 * Pierwszy ekran (`#top`): minimalna wysokość hero, żeby **nie wystawała** sekcja „Fakty”.
 * `100svh` = stabilna wysokość okna (mobile); odejmij więcej (np. `7rem`), jeśli nadal coś widać.
 */
export const landingHeroFirstScreen = {
  minHeight: "calc(100svh - 6.5rem)",
} as const;

/** Kotwice sekcji zgodne z `id` w komponentach i `href` w `data/content.ts` (navbar / footer). */
export const LANDING_ANCHOR_IDS = {
  top: "top",
  fakty: "fakty",
  oMnie: "o-mnie",
  oferta: "oferta",
  opinie: "opinie",
  finalCta: "final-cta",
} as const;

/** Opcjonalnie: `style` na `<section id="…">` – ta sama wartość co `landingAnchorScroll.top`. */
export function landingSectionAnchorStyle(): CSSProperties {
  return { scrollMarginTop: landingAnchorScroll.top };
}
