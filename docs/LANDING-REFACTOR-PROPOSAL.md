# Landing Page Refactor – Domain-Driven / Feature-Sliced Proposal

## 1. Current State

- **`app/page.tsx`** (~590 lines): Single `"use client"` component containing:
  - **AccentBrackets** – inline helper (parser for `[label]` text)
  - **State**: `courseModalId`, `menuOpen`, derived `activeCourse`
  - **Effects**: Escape key to close course modal
  - **Sections**: Navbar, Hero, Fakty (Facts), O mnie (About), Oferta (Offer: tutoring + courses + modal), Value blocks, Final CTA, Opinie (Testimonials), Footer

All sections and layout live in one file; no domain boundary.

---

## 2. Target Architecture

### 2.1 Domain and placement

- **Domain**: `landing` (home/landing page).
- **Base path**: `src/features/landing/`  
  (no flat `src/components/`; landing-specific code stays under the feature slice).

### 2.2 Proposed folder structure

```
src/
  features/
    landing/
      components/              # Public section components
        Navbar.tsx
        HeroSection.tsx
        FactsSection.tsx
        AboutSection.tsx
        OfferSection.tsx
        CourseDetailsModal.tsx
        FinalCtaSection.tsx
        TestimonialsSection.tsx
        Footer.tsx
      ui/                      # Small, landing-only presentational pieces
        AccentBrackets.tsx
      index.ts                 # Public API: re-export components
```

- **`components/`** – section-level building blocks of the page.
- **`ui/`** – small, reusable-in-landing-only UI (e.g. AccentBrackets).
- **`index.ts`** – re-exports so the app imports from `@/src/features/landing` (or a path alias).

---

## 3. Section Breakdown and Client vs Server

| Section | File | Client? | Reason |
|--------|------|--------|--------|
| **Navbar** | `Navbar.tsx` | Yes | `useState(menuOpen)`, hamburger and link `onClick` |
| **Hero** | `HeroSection.tsx` | No | Links + Image; no hooks or browser APIs |
| **Fakty** | `FactsSection.tsx` | No | Content + `AccentBrackets`; presentational |
| **O mnie** | `AboutSection.tsx` | No | Data + Image; presentational |
| **Oferta** | `OfferSection.tsx` | Yes | `courseModalId` state, “Szczegóły” `onClick`, modal visibility |
| **Course modal** | `CourseDetailsModal.tsx` | Yes | `onClick`, optional `useEffect` (e.g. escape) |
| **Value blocks** | Part of `OfferSection.tsx` | No | Static content (or separate Server component if preferred) |
| **Final CTA** | `FinalCtaSection.tsx` | No | Links + content |
| **Opinie** | `TestimonialsSection.tsx` | No | Static list |
| **Footer** | `Footer.tsx` | No | Links only |
| **AccentBrackets** | `ui/AccentBrackets.tsx` | No | Pure presentational |

- **Server by default**: only add `"use client"` where a component uses React state, effects, or browser APIs.
- **Client boundary**: `app/page.tsx` (or a thin `LandingPage` shell) stays Client because it owns shared state (`menuOpen`, `courseModalId`) and composes Navbar and OfferSection. Sections that are Server Components will be rendered by the App Router as server components when they are not children of a Client Component; where they are children of the client page, they still run in the client bundle unless we introduce a Server parent that passes them as `children` (see below).

---

## 4. Data and State Flow

- **Content**: Still from `@/data/content` (e.g. `offerDetails`, `pricingAndGuarantee`, `finalCta`, `storyAndAuthority`). The **page** (or a top-level Client shell) imports these and passes the needed slices as props into each section.
- **State**:
  - `menuOpen` – owned by page (or Navbar if we move state in); passed to `Navbar` as props or handled inside `Navbar` (Client).
  - `courseModalId` / `activeCourse` – owned by page (or OfferSection); `OfferSection` + `CourseDetailsModal` receive `courseModalId`, `setCourseModalId`, and optionally `activeCourse`, or encapsulate this state inside a single Client wrapper.

Recommended: keep **one** Client wrapper (the page or `LandingPage`) that:

- Imports content.
- Holds `menuOpen` and `courseModalId` (and derives `activeCourse`).
- Renders `<Navbar menuOpen={...} setMenuOpen={...} />`, `<OfferSection courseModalId={...} setCourseModalId={...} activeCourse={...} />`, and the rest of the sections with only props (no callbacks), so that Hero, Facts, About, FinalCta, Testimonials, Footer can remain Server Components if we later render them from a Server parent (e.g. by passing them as `children` from a Server `page.tsx`).

---

## 5. Refactoring Steps (order of work)

1. **Scaffold domain**
   - Create `src/features/landing/` with `components/`, `ui/`, and `index.ts`.

2. **Extract shared UI**
   - Move `AccentBrackets` to `src/features/landing/ui/AccentBrackets.tsx` (no `"use client"`).

3. **Extract Server-capable sections (no state)**
   - `HeroSection.tsx` – props: none or minimal (e.g. image src/alt if we want to make it configurable).
   - `FactsSection.tsx` – props: pain points list + copy for Agitacja/Identyfikacja; uses `AccentBrackets`.
   - `AboutSection.tsx` – props: `storyAndAuthority` (or its fields).
   - `FinalCtaSection.tsx` – props: `finalCta`.
   - `TestimonialsSection.tsx` – props: testimonials list (or inline for now).
   - `Footer.tsx` – props: optional (or hardcoded links/credits).

4. **Extract Client sections**
   - `Navbar.tsx` – `"use client"`; props: `menuOpen`, `setMenuOpen` (or internal state).
   - `OfferSection.tsx` – `"use client"`; props: `offerDetails`, `pricingAndGuarantee`, and either:
     - `courseModalId`, `setCourseModalId`, `activeCourse` (state in page), or
     - encapsulate modal state inside `OfferSection` and pass only content.
   - `CourseDetailsModal.tsx` – `"use client"`; props: `isOpen`, `course`, `onClose`, and optionally `onPurchase` (link).

5. **Wire content and state in the page**
   - In `app/page.tsx`: import content once; keep `useState` / `useEffect` for modal and nav; render only feature components and pass props/callbacks so that `app/page.tsx` is a thin composition (~50–80 lines).

6. **Public API**
   - `src/features/landing/index.ts` – re-export all section and UI components so the app can do:
     - `import { Navbar, HeroSection, ... } from '@/src/features/landing'` (or configured alias, e.g. `@/features/landing`).

7. **Path alias (optional)**
   - In `tsconfig.json`, add e.g. `"@/features/*": ["./src/features/*"]` so imports are `@/features/landing` instead of `@/src/features/landing`.

---

## 6. Resulting `app/page.tsx` (target shape)

```tsx
"use client";

import { useState, useEffect } from "react";
import { offerDetails, pricingAndGuarantee, finalCta, storyAndAuthority } from "@/data/content";
import {
  Navbar,
  HeroSection,
  FactsSection,
  AboutSection,
  OfferSection,
  FinalCtaSection,
  TestimonialsSection,
  Footer,
} from "@/src/features/landing"; // or @/features/landing

export default function Home() {
  const [courseModalId, setCourseModalId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeCourse = courseModalId
    ? offerDetails.courses.find((c) => c.id === courseModalId) ?? null
    : null;

  useEffect(() => {
    if (!courseModalId) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCourseModalId(null);
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [courseModalId]);

  return (
    <div id="top" className="min-h-screen bg-[#f8faff] text-black font-sans selection:bg-[#cfd8ff]">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 space-y-12 sm:space-y-16 overflow-hidden">
        <HeroSection />
        <FactsSection />
        <AboutSection data={storyAndAuthority} />
        <OfferSection
          offerDetails={offerDetails}
          pricingAndGuarantee={pricingAndGuarantee}
          courseModalId={courseModalId}
          setCourseModalId={setCourseModalId}
          activeCourse={activeCourse}
        />
        <FinalCtaSection data={finalCta} />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
```

---

## 7. Summary

- **No flat structure**: all landing-specific UI and sections live under `src/features/landing/`.
- **Domain folders**: `src/features/landing/components/` (sections) and `ui/` (AccentBrackets).
- **Sections**: Navbar, Hero, Facts, About, Offer (with modal), Final CTA, Testimonials, Footer – each in its own file.
- **Server by default**: only Navbar, OfferSection, and CourseDetailsModal use `"use client"`; the rest stay presentational and can be treated as Server Components when composed from a Server parent.
- **Clean page**: `app/page.tsx` becomes a short composition of feature components and shared state.

If you want, next step is to implement this step-by-step (scaffold → ui → sections → page wiring).
