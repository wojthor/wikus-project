## Raport projektu – „Projekt dla Wikusia”

Ten dokument opisuje aktualny stan projektu, strukturę plików oraz logikę aplikacji.

---

## 1. Cel projektu

- **Strona typu landing page** dla korepetycji / kursów z języka angielskiego („Projekt dla Wikusia”).
- **Główne zadanie**: przekonać użytkownika do kontaktu / zakupu zajęć, poprzez:
  - historię nauczyciela,
  - jasną ofertę (korepetycje + pakiety),
  - sekcję faktów/problemów,
  - dowód społeczny (opinie),
  - finalne mocne CTA.

Strona jest zbudowana jako **jedna główna strona** (`/`), bez dodatkowego routingu publicznego.

---

## 2. Architektura i stos technologiczny

- **Framework**: Next.js (App Router, `app/`).
- **Język**: TypeScript + React.
- **Styling**: Tailwind-like utility classes (klasy używane bezpośrednio w JSX, bez osobnych modułów CSS; globalne style w `app/globals.css`).
- **UI**:
  - ikony z `lucide-react`,
  - komponenty z `next/image` i `next/link`.
- **Newsletter / akcje serwerowe**:
  - prosty endpoint/akcja w `app/actions/newsletter.ts` wywoływany z `NewsletterModal`.

---

## 3. Struktura katalogów (wysoki poziom)

- `app/`
  - `layout.tsx` – główny layout aplikacji (HTML, `<body>`, wspólne wrappery, globalne style).
  - `page.tsx` – **główna strona landingowa**, która składa całą stronę z mniejszych sekcji.
  - `globals.css` – globalne style (reset, podstawowe ustawienia).
  - `favicon.ico` – ikona strony.
  - `actions/`
    - `newsletter.ts` – akcja serwerowa do zapisu do newslettera (wykorzystywana w `NewsletterModal`).

- `src/features/landing/`
  - `index.ts` – **publiczny „re-export”** głównych komponentów landing page:
    - `Navbar`
    - `HeroSection`
    - `FactsSection`
    - `AboutSection`
    - `OfferSection`
    - `FinalCtaSection`
    - `TestimonialsSection`
    - `Footer`
  - `components/`
    - `Navbar.tsx` – sticky pasek nawigacji z linkami do sekcji (`#fakty`, `#oferta`, `#o-mnie`, `#opinie`).
    - `HeroSection.tsx` – pierwsza sekcja „bohater” z hookiem, nagłówkiem, krótkim opisem i zdjęciem autora (`/wikus4.png`).
    - `FactsSection.tsx` – sekcja „Fakty”, opisująca typowe problemy z nauką angielskiego, używa komponentu `AccentBrackets`.
    - `AboutSection.tsx` – sekcja „O mnie”, pokazująca:
      - dane autora (`storyAndAuthority` z `data/content.ts`),
      - zdjęcie autora (`authorImagePlaceholder` = `/wikus3.png`),
      - listę certyfikatów,
      - kapsuły historii (autorytet, początki, punkt zwrotny).
    - `OfferSection.tsx` – sekcja oferty:
      - duża karta dla korepetycji 1:1 (cena, opis, lista korzyści, CTA `mailto:`),
      - karty dla poszczególnych pakietów kursów (`offerDetails.courses`),
      - przycisk zakupu kierujący na zewnętrzny URL (`gumroadUrl`) z logotypem `gumaroad.png`,
      - dodatkowe bloki: „Zbudowanie wartości”, „Gwarancja”, „Deadline” bazujące na `pricingAndGuarantee`.
    - `FinalCtaSection.tsx` – końcowa sekcja CTA oparta o `finalCta` z `data/content.ts`:
      - emocjonalne zamknięcie („Masz 2 opcje”),
      - dwie opcje (pozostanie bez działania vs. rozpoczęcie nauki),
      - opis, co się dzieje po zakupie,
      - finalny przycisk prowadzący z powrotem do oferty.
    - `TestimonialsSection.tsx` – sekcja z opiniami (`Opinie`):
      - kilka statycznie osadzonych opinii,
      - prosty layout kart z imieniem, rezultatem, treścią i oceną (★★★★★).
    - `Footer.tsx` – stopka:
      - nazwa marki i tagline,
      - nawigacja skrótowa (linki do sekcji),
      - dane kontaktowe (mail, telefon),
      - ikony social media (Facebook, Instagram),
      - linijka „Powered by…” i „Visual concept by…”.
  - `ui/`
    - `AccentBrackets.tsx` – mały komponent narzędziowy:
      - przyjmuje tekst z fragmentami w nawiasach `[...]`,
      - dzieli tekst na części „zwykłe” i „akcentowane”,
      - renderuje fragmenty w nawiasach w formie wyróżnionej (`font-bold`, kolor).

- `components/`
  - `NewsletterModal.tsx` – niezależny komponent modalny:
    - **„use client”** – komponent kliencki.
    - Wyświetla modal po kilku sekundach od wejścia na stronę (o ile użytkownik wcześniej go nie odrzucił – zapis w `localStorage`).
    - Formularz z polem e-mail, obsługą stanu (`idle` / `loading` / `success` / `error`).
    - Wysyła dane do `subscribeToNewsletter` z `app/actions/newsletter.ts`.
    - Po sukcesie pokazuje animowaną ikonę „check” i tekst potwierdzenia.
    - Używa zdjęcia autora z `public/wikus.jpg`.

- `data/`
  - `content.ts` – **centralne źródło treści** (copywriting) dla landing page:
    - `site` – nazwa i tagline projektu.
    - `hero` – teksty do hero (hook, pytanie, benefit, obietnica, CTA).
    - `problemAgitation` – sekcja problemów i „spisku”.
    - `storyAndAuthority` – biografia, historia, autorytet, efekty, certyfikaty, zdjęcie autora.
    - `testimonials` – dane tekstowe opinii (częściowo wykorzystywane w sekcjach).
    - `offerDetails` – struktura oferty:
      - opis korepetycji (`tutoring`),
      - lista kursów (`courses`, każdy z `id`, `title`, `price`, `gumroadUrl`, itd.).
    - `pricingAndGuarantee` – dane o cenach, gwarancji i deadline.
    - `finalCta` – teksty do finalnej sekcji CTA.
    - `content` / `Content` – zgrupowany eksport wszystkich powyższych + typ.

- `public/`
  - `wikus.jpg` – zdjęcie autora używane w `NewsletterModal`.
  - `wikus3.png` – zdjęcie autora używane w `AboutSection`.
  - `wikus4.png` – zdjęcie autora używane w `HeroSection`.
  - `gumaroad.png` – logo używane w przycisku zakupu kursu w `OfferSection`.

- Pliki konfiguracyjne / narzędziowe:
  - `package.json`, `package-lock.json` – zależności Node / Next / React / TypeScript / Tailwind itp.
  - `tsconfig.json` – konfiguracja TypeScript (ścieżki aliasów, np. `@/data/content`).
  - `next.config.ts` – konfiguracja Next.js (jeśli potrzeba, np. `images.domains`).
  - `postcss.config.mjs` – konfiguracja PostCSS dla styli.
  - `.env.local` – zmienne środowiskowe (np. klucze do newslettera / integracji – zawartość prywatna).
  - `.gitignore` – ignorowane pliki w repo.

---

## 4. Przepływ użytkownika na stronie

1. **Wejście na `/`**:
   - Renderuje się `app/page.tsx` złożony z:
     - `Navbar`
     - `HeroSection`
     - `FactsSection`
     - `AboutSection`
     - `OfferSection`
     - `FinalCtaSection`
     - `TestimonialsSection`
     - `Footer`
     - `NewsletterModal`

2. **Nawigacja**:
   - Linki w `Navbar` oraz w przyciskach `Link` kierują do sekcji na tej samej stronie (`#fakty`, `#oferta`, `#o-mnie`, `#opinie`).

3. **Sekcja Hero**:
   - Użytkownik widzi główny nagłówek, hook oraz zdjęcie autora.
   - Główne CTA prowadzi do sekcji oferty.

4. **Sekcja Fakty**:
   - Wyjaśnia, dlaczego standardowe podejście do nauki angielskiego nie działa,
   - Buduje napięcie i pokazuje punkty bólu.

5. **Sekcja O mnie**:
   - Prezentuje sylwetkę nauczyciela, jego drogę i doświadczenie,
   - Buduje zaufanie poprzez historię i certyfikaty.

6. **Sekcja Oferta**:
   - Wyjaśnia dokładnie, co klient dostaje:
     - korepetycje 1:1 (opis, cena, CTA „Umów lekcję” – mailto),
     - pakiety kursów/koncepcje zajęć (karty z opisem, ceną, listą cech, linkiem do zakupu przez zewnętrzną platformę).

7. **Finalne CTA**:
   - Emocjonalne domknięcie („Masz 2 opcje…”),
   - Wyraźne zachęcenie do wykonania działania (rezerwacja lub zakup).

8. **Opinie**:
   - Sekcja z konkretnymi, rozbudowanymi opiniami,
   - Podbija wiarygodność i redukuje obawy.

9. **Stopka**:
   - Dane kontaktowe, nawigacja, linki do twórców (dev + visual).

10. **Newsletter Modal**:
    - Po kilku sekundach pokazuje się popup,
    - Użytkownik może zostawić mail (plan nauki + materiały),
    - Decyzja o zamknięciu modala zapamiętywana w `localStorage`.

---

## 5. Główne punkty integracji i logika

- **Actions / newsletter** (`app/actions/newsletter.ts`):
  - Funkcja `subscribeToNewsletter(email: string)` (nazwa przykładowa) przyjmuje adres e-mail z formularza w modalu,
  - Zwraca `{ success: boolean; error?: string }`,
  - W `NewsletterModal`:
    - przy kliknięciu „Wyślij” > stan ustawiany na `loading`,
    - po odpowiedzi serwera:
      - jeśli `success` – stan zmienia się na `success`, a modal pokazuje ekran potwierdzenia i zapisuje „dismissed” w `localStorage`,
      - jeśli błąd – komunikat błędu i powrót do stanu `idle`.

- **Źródła treści**:
  - Cały copywriting i dane (teksty, nagłówki, ceny, CTA, itp.) trzymane są w `data/content.ts`,
  - Komponenty (np. `OfferSection`, `AboutSection`, `FinalCtaSection`) przyjmują odpowiednie fragmenty danych przez propsy,
  - To ułatwia zmianę tekstów bez dotykania layoutu / logiki.

---

## 6. Założenia projektowe

- **Jednostronicowy flow** – wszystko dzieje się na jednej stronie, sekcje są modularyzowane jako osobne komponenty.
- **Silne copy** – struktura plików i komponentów odzwierciedla klasyczny VSL / sales letter:
  - hook, problem, autorytet, oferta, dowód społeczny, CTA, domknięcie.
- **Responsywność** – layout komponentów korzysta z klas typu `sm:`, `md:`, `lg:` aby dobrze działać na mobile i desktopie.
- **Łatwość edycji**:
  - Teksty i dane: `data/content.ts`,
  - Struktura sekcji i ich kolejność: `app/page.tsx`,
  - Styl i zachowanie poszczególnych sekcji: pliki w `src/features/landing/components`.

---

## 7. Jak modyfikować projekt

- **Zmiana tekstów / cen / nazw kursów**:
  - Edytuj `data/content.ts`:
    - `hero` – teksty w sekcji hero,
    - `offerDetails` – opisy, ceny, szczegóły korepetycji i kursów,
    - `pricingAndGuarantee` – nagłówki i treść o cenach / gwarancji / deadline,
    - `finalCta` – copy w ostatniej sekcji,
    - `storyAndAuthority` – sekcja „O mnie”.

- **Zmiana kolejności lub widoczności sekcji**:
  - Edytuj `app/page.tsx` i zmień kolejność użycia komponentów lub usuń/dodaj sekcje.

- **Zmiana zdjęć**:
  - Podmień pliki w `public/` (zachowując ścieżki lub aktualizując `src` w komponentach, które z nich korzystają).

- **Zmiana logiki newslettera**:
  - Zaktualizuj `app/actions/newsletter.ts` i ewentualnie obsługę odpowiedzi w `components/NewsletterModal.tsx`.

---

## 8. Podsumowanie

Repozytorium jest obecnie uproszczone do **minimalnego, ale kompletnego** zestawu plików potrzebnych do działania landing page’a:

- jeden główny entrypoint (`app/page.tsx`),
- zestaw komponentów w `src/features/landing` odpowiedzialnych za poszczególne sekcje,
- jeden komponent modala newslettera,
- jedno źródło treści (`data/content.ts`),
- tylko te assety graficzne, które faktycznie są używane.

Taka struktura ułatwia dalszy rozwój (dodawanie sekcji, A/B testy, integracje) i jednocześnie utrzymuje czystość kodu po ostatnim sprzątaniu nieużywanych plików.

