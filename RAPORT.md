# Raport projektu – Wiktor Szyszkowski / Unschool Your English

**Wersja raportu:** czerwiec 2026 (po stabilizacji produkcji)  
**Domena produkcyjna:** [wiktorszyszkowski.pl](https://wiktorszyszkowski.pl)  
**Repozytorium:** monorepo Next.js + Payload CMS (jeden deploy na Vercel)

---

## Spis treści

1. [Cel projektu i produkt](#1-cel-projektu-i-produkt)
2. [Stack technologiczny](#2-stack-technologiczny)
3. [Paleta barw i design system](#3-paleta-barw-i-design-system)
4. [Architektura aplikacji](#4-architektura-aplikacji)
5. [Każda strona — szczegółowy opis](#5-każda-strona--szczegółowy-opis)
6. [Panel administracyjny Payload](#6-panel-administracyjny-payload)
7. [Platforma e-learning — pełny przepływ](#7-platforma-e-learning--pełny-przepływ)
8. [Płatności Stripe — pełny przepływ](#8-płatności-stripe--pełny-przepływ)
9. [Maile i zdarzenia (eventy)](#9-maile-i-zdarzenia-eventy)
10. [Baza danych i pliki (audio)](#10-baza-danych-i-pliki-audio)
11. [Mobile i responsywność](#11-mobile-i-responsywność)
12. [Wydajność i czasy działania](#12-wydajność-i-czasy-dziaiania)
13. [Problemy produkcyjne i jak je naprawiliśmy](#13-problemy-produkcyjne-i-jak-je-naprawiliśmy)
14. [Utrzymanie — co robić na co dzień](#14-utrzymanie--co-robić-na-co-dzień)
15. [Szacunkowe koszty utrzymania](#15-szacunkowe-koszty-utrzymania)
16. [Zmienne środowiskowe](#16-zmienne-środowiskowe)
17. [Skrypty i narzędzia developerskie](#17-skrypty-i-narzędzia-developerskie)
18. [Deploy i checklist produkcyjny](#18-deploy-i-checklist-produkcyjny)
19. [Historia commitów (skrót)](#19-historia-commitów-skrót)
20. [Co dalej (backlog)](#20-co-dalej-backlog)

---

## 1. Cel projektu i produkt

### 1.1 Misja biznesowa

**Unschool Your English** to kurs online angielskiego (poziom B1–B2) autorstwa **Wiktora Szyszkowskiego** — korepetytora i absolwenta filologii angielskiej. Kurs adresowany jest do osób, które **rozumieją** angielski (filmy, teksty), ale **blokują się przy mówieniu**.

Strona **wiktorszyszkowski.pl** pełni trzy role:

| Rola | Opis |
|------|------|
| **Marketing** | Landing z ofertą korepetycji 1:1, opiniami, newsletterem |
| **Sprzedaż kursu** | Dedykowana strona `/unschool` + checkout Stripe |
| **Platforma kursu** | `/elearning` — lekcje, zadania, feedback nauczyciela |

### 1.2 Model produktu

- **Jednorazowa płatność** (Stripe Payment Intent) → **dostęp bezterminowy**
- **~34–35 lekcji** w **7 modułach** (~3 miesiące nauki przy 2–3 lekcjach/tydz.)
- Po każdej lekcji: **zadanie tekstowe i/lub głosowe**
- **Personalny feedback** od Wiktora (tekst + opcjonalnie nagranie głosowe)
- **Progresja liniowa** — kolejna lekcja odblokowuje się po wysłaniu zadania (admin omija blokady)

### 1.3 Użytkownicy systemu

| Typ | Dostęp | Identyfikacja |
|-----|--------|---------------|
| **Gość** | `/`, `/unschool` (z Basic Auth), `/payment` | — |
| **Kursant** | `/elearning` po zakupie | Konto Payload `users`, email + hasło |
| **Admin (Wiktor)** | `/admin`, pełny `/elearning` | Email = `PLATFORM_ADMIN_EMAIL` (domyślnie `kontakt@wiktorszyszkowski.pl`) |

---

## 2. Stack technologiczny

### 2.1 Frontend i framework

| Technologia | Wersja | Rola |
|-------------|--------|------|
| **Next.js** | 16.1.6 | App Router, SSR, API routes, deploy Vercel |
| **React** | 19.2.3 | UI komponentów |
| **TypeScript** | 5.x | Typowanie całego projektu |
| **Tailwind CSS** | 4.x | Style utility-first |
| **Framer Motion** | 12.x | Animacje (landing, `/unschool`, FAQ) |
| **Lucide React** | 0.574 | Ikony (menu, UI) |

Build produkcyjny używa **webpack** (`next build --webpack`) — wymagane m.in. przez Payload CMS i stabilność na Vercel.

### 2.2 Backend i CMS

| Technologia | Wersja | Rola |
|-------------|--------|------|
| **Payload CMS** | 3.85.0 | Headless CMS, auth użytkowników, admin panel |
| **@payloadcms/db-postgres** | 3.85.0 | Adapter PostgreSQL (Drizzle ORM pod spodem) |
| **@payloadcms/richtext-lexical** | 3.85.0 | Edytor rich text w lekcjach i feedbacku |
| **PostgreSQL (Supabase)** | — | Baza produkcyjna |
| **pg** | 8.16 | Bezpośrednie zapytania SQL (obejścia serverless) |

### 2.3 Integracje zewnętrzne

| Usługa | Rola |
|--------|------|
| **Stripe** | Płatności kartą / BLIK (Przelewy24) |
| **Resend** | Transakcyjne maile (hasło, powiadomienia) |
| **Vercel Blob** | Prywatne pliki audio na produkcji |
| **Brevo** | Newsletter na landingu |
| **Vercel** | Hosting, serverless functions, Blob storage |
| **Supabase** | Managed PostgreSQL |

### 2.4 Struktura katalogów (skrót)

```
wikus-project/
├── app/
│   ├── (site)/          # Strony publiczne (landing, unschool, payment, elearning)
│   ├── (payload)/       # Admin Payload + REST API /api/*
│   ├── elearning/       # Komponenty platformy (StudentPanel, LoginForm…)
│   ├── payment/         # Stripe Payment Element
│   ├── api/             # Custom API (webhooks, upload audio, submissions)
│   └── components/      # Custom pola admina (nagrywanie, odsłuch)
├── src/
│   ├── collections/     # Schemat Payload (Users, Lessons, Submissions…)
│   ├── features/
│   │   ├── elearning/   # Logika kursu, theme, progression, maile
│   │   ├── landing/     # Sekcje strony głównej
│   │   └── unschool/    # Copy oferty kursu
│   ├── lib/             # Stripe, email, pg pool, Blob, seed
│   └── data/course-mockup/  # JSON źródłowy treści lekcji (mockup)
├── data/content.ts      # Copy landingu głównego
├── payload.config.ts    # Konfiguracja CMS
├── proxy.ts             # Basic Auth na /unschool
└── RAPORT.md            # Ten dokument
```

---

## 3. Paleta barw i design system

### 3.1 Marka główna (Unschool + landing kursu)

Projekt opiera się na **fioletowo-niebieskiej** tożsamości z **pomarańczowymi** akcentami CTA (przyciski „Kup”, „Chcę ten kurs”).

| Token | Hex | Użycie |
|-------|-----|--------|
| **Brand purple** | `#7347f4` | Nagłówki, logo, główne akcenty |
| **Brand blue** | `#3e57d6` | Podtytuły, tagi, linki |
| **Lavender bg** | `#f8faff` | Tło stron (unschool, elearning, success) |
| **Lavender panel** | `#cfd8ff` | Tagi, selection highlight, obramowania miękkie |
| **Border lavender** | `#b9c5fe` | Ramki kart, separatory |
| **CTA orange** | `#ffbd53` | Tło przycisku primary |
| **CTA orange border** | `#ffa515` | Obramowanie CTA, secondary outline |
| **Text primary** | `slate-900` / `#0f172a` | Treść główna |
| **Text muted** | `slate-600` / `#475569` | Opisy, leady |

### 3.2 Landing główny (`/`)

- Tło sekcji naprzemiennie: białe / jasne fioletowe (`#f8faff`)
- Akcent sekcji „Oferta”: `#7347f4`
- CTA główne: gradient i przyciski zgodne z resztą marki
- Zdjęcia Wiktora: `/wikus.jpg`, `/wikus3.png`, `/wikus4.png` w `public/`

### 3.3 Strona `/unschool`

Spójna paleta z e-learningiem:

- **Hero:** tag pill `#cfd8ff` / tekst `#3e57d6`
- **H1:** czarny + fioletowy akcent na słowie „mówisz”
- **Kafelek ceny:** ramka `#7347f4`, badge promocji `#ffbd53`
- **Sekcja ciemna** („Prawda której nikt Ci nie powie”): `bg-slate-900`, akcent `#b9c5fe`
- **FAQ:** Framer Motion stagger, fioletowe nagłówki

### 3.4 Platforma e-learning — akcenty modułów

Każdy moduł ma przypisany **akcent kolorystyczny** (`src/features/elearning/theme.ts`):

| ID | Kolory | Moduł (przykład) |
|----|--------|------------------|
| `brand` | `#7347f4`, `#3e57d6`, `#cfd8ff` | Moduł 1 — Mindset |
| `teal` | teal-600/700, teal-50 | Moduł 2 |
| `green` | green-600/700, green-50 | Moduł 3 |
| `violet` | violet-600/700, violet-50 | Moduł 4 |
| `rose` | rose-600/700, rose-50 | Moduł 5 |
| `orange` | `#ffa515`, `#c2410c`, orange-50 | Moduł 6–7 |

Sidebar modułu: kolorowa kropka, pasek postępu, obramowanie aktywnej lekcji.

### 3.5 Bloki treści lekcji (mockup → UI)

Kolorowe sekcje w lekcjach (`LessonSectionBlock.tsx`):

| Typ | Tło | Znaczenie |
|-----|-----|-----------|
| `insight` | `#EFF6FF` / `#BFDBFE` | Kluczowy wniosek |
| `tip` | `#FFFBEB` / `#FDE68A` | Wskazówka praktyczna |
| `reallife` | `#F0FDF4` / `#BBF7D0` | Angielski z życia |
| `warning` | `#FEF2F2` / `#FECACA` | Pułapka / błąd |
| `fun` | `#F0FDFA` / `#99F6E4` | Lżejszy akcent |

Treść pochodzi z `src/data/course-mockup/course.json` (pole `legacySlug` na lekcji w Payload).

### 3.6 Admin Payload

- Custom branding: `AdminBranding/CustomLogo.tsx`, `CustomIcon.tsx`
- Kolory Payload domyślne + fiolet marki w dashboardzie
- Quick links do `/elearning` i kolekcji

### 3.7 Typografia

- **Sans:** Geist (via Next.js font) + fallback Arial/Helvetica w `globals.css`
- **Nagłówki:** `font-extrabold`, `tracking-tight`
- **Eyebrow / tagi:** `text-xs`, `uppercase`, `tracking-widest` lub `tracking-wide`

---

## 4. Architektura aplikacji

### 4.1 Dwa „światy” Next.js

```
┌─────────────────────────────────────────────────────────────┐
│  app/(site)/          — strony marketingowe + elearning URL │
│  app/(payload)/       — Payload admin + REST /api/users…   │
│  app/api/*            — custom endpoints (Stripe, audio)   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Payload CMS  ←→  PostgreSQL (Supabase, pooler :6543)      │
│  Vercel Blob  ←→  pliki audio (prod)                       │
│  Resend       ←→  maile                                      │
│  Stripe       ←→  płatności + webhooks                       │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Połączenie z bazą (krytyczne na produkcji)

**Jedna współdzielona pula PostgreSQL** (`src/lib/pg-singleton.ts`):

- Payload i zapytania SQL używają **tej samej instancji** `pg.Pool`
- URI normalizowane: `?pgbouncer=true` dla Supabase Transaction pooler (port **6543**)
- Na serverless: **`max: 3`** (Payload przy init rezerwuje 1 połączenie — patrz sekcja 13)
- Cache Payload: `getCachedPayload()` — jedna instancja na warm lambdę

### 4.3 Ochrona tras

| Trasa | Ochrona |
|-------|---------|
| `/unschool` | Basic Auth (`proxy.ts`, env `UNSCHOOL_USER` / `UNSCHOOL_PASSWORD`) |
| `/elearning` | Sesja Payload (cookie) |
| `/admin` | Payload admin — tylko użytkownik z `admin: true` |
| `/api/webhooks/stripe` | Sygnatura Stripe (`stripe-signature`) |
| `/api/dev/*` | Tylko development lub `x-dev-seed-key` |

---

## 5. Każda strona — szczegółowy opis

### 5.1 `/` — Landing główny

**Plik:** `app/(site)/page.tsx`  
**Treść:** `data/content.ts`  
**Komponenty:** `src/features/landing/`

| Sekcja | ID / anchor | Zawartość |
|--------|-------------|-----------|
| Navbar | — | Linki do sekcji, logo |
| Hero | — | Hook, headline, CTA „Zobacz ofertę”, zdjęcie Wiktora |
| Fakty | `#fakty` | Dlaczego trudno mówić mimo lat nauki |
| O mnie | `#o-mnie` | Historia Wiktora, credentials |
| Oferta | `#oferta` | Korepetycje 1:1 + kafelek kursu Unschool (coming soon / link) |
| Cennik / gwarancja | — | Szczegóły pakietów |
| Opinie | `#opinie` | Karuzela testimoniali (Marcel, Maks, Martyna, Wiktoria) |
| Final CTA | — | Wezwanie do kontaktu |
| Footer | — | Linki, social |
| Newsletter modal | — | Brevo API |

**SEO:** `app/sitemap.ts`, `app/robots.ts`, metadata w layoutcie `(site)`.

---

### 5.2 `/unschool` — Strona sprzedaży kursu

**Plik:** `app/(site)/unschool/page.tsx` (~900 linii, client component)  
**Oferta/cena:** `src/features/unschool/course-offer.ts`  
**Ochrona:** Basic Auth (przed publicznym launch — można wyłączyć usuwając matcher w `proxy.ts`)

#### Struktura sekcji (scroll)

1. **Sticky nav** — linki: Dla kogo, Program, O mnie, Opinie, Kup kurs
2. **Hero** — tag „Kurs online · B1–B2”, „Unschool Your English”, H1 trzyliniowy „Rozumiesz. / Ale nadal / nie mówisz.”, CTA Stripe, statystyki (34 lekcje, 7 modułów, ~3 mies.)
3. **Kafelek ceny** — cena z `UNSCHOOL_COURSE_OFFER`, lista `UNSCHOOL_PRICING_FEATURES`, `CheckoutButton`
4. **Dla kogo** — 3 karty bólu (wiesz co powiedzieć po polsku, blokada, brak systemu)
5. **Prawda o szkole** — sekcja ciemna, kontrast szkoła vs kurs
6. **Jak działa kurs** — 4 kroki (wideo, materiał, zadanie, feedback)
7. **Program 7 modułów** — siatka z listami lekcji
8. **O Wiktorze** — autorytet, porównanie korki vs kurs
9. **Opinie** — te same historie co landing
10. **Cennik / FAQ** — accordion, pytania o płatność, poziom, certyfikat
11. **Footer** — nawigacja kotwicowa

**CTA:** `CheckoutButton` → tworzy Payment Intent → `/payment`

---

### 5.3 `/payment` — Płatność Stripe

**Pliki:** `app/(site)/payment/page.tsx`, `app/payment/CheckoutWrapper.tsx`, `app/payment/PaymentForm.tsx`

Przepływ:

1. Klient wchodzi z kwotą / intentem z sesji
2. Formularz email (opcjonalnie przed kartą) → `POST /api/payment-intent/set-email`
3. **Stripe Payment Element** — karta, BLIK (Przelewy24)
4. Po sukcesie → redirect `/success?payment_intent=pi_…`
5. Po błędzie → `/failed`

---

### 5.4 `/success` i `/failed`

**`/success`** (`app/(site)/success/page.tsx`):

- Weryfikuje status Payment Intent w Stripe
- Stany: `succeeded`, `pending` (BLIK), `failed` → redirect
- **Fallback provision:** jeśli webhook nie zdążył — tworzy konto + mail (idempotentnie przez `metadata.provisioned`)
- Linki: ustaw hasło, powrót na unschool

**`/failed`:** komunikat o nieudanej płatności, ponowna próba.

---

### 5.5 `/ustaw-haslo` — Onboarding hasła

**Pliki:** `app/(site)/ustaw-haslo/page.tsx`, `app/ustaw-haslo/SetPasswordForm.tsx`  
**API:** `POST /api/auth/set-password`

1. Użytkownik klika link z maila: `/ustaw-haslo?token=…`
2. Token z pól `registrationToken` + `tokenExpiration` w Payload Users
3. Ustawia hasło → może się zalogować na `/elearning`
4. Redirect z banerem sukcesu (`PasswordSetSuccessBanner`)

---

### 5.6 `/elearning` — Platforma kursu

**Pliki:**

- `app/(site)/elearning/page.tsx` → re-export `app/elearning/ElearningPage.tsx`
- `ElearningPage.tsx` — server component: auth + fetch modułów
- `StudentPanel.tsx` — główny UI (~600+ linii)
- `LoginForm.tsx` — logowanie Payload REST
- `ElearningHeader.tsx` + `ElearningMobileMenu.tsx`

#### Stan niezalogowany

- Header z menu mobilnym
- Formularz email + hasło → `POST /api/users/login` (Payload)
- Banner po ustawieniu hasła (`?passwordSet=1`)

#### Stan zalogowany

- **Sidebar (desktop)** / **drawer (mobile):** moduły, postęp, kłódki
- **Główny panel:** treść lekcji, wideo, zadanie, feedback
- Admin widzi wszystko bez blokad

---

### 5.7 `/admin` — Payload CMS

**URL:** `/admin`  
**Dostęp:** tylko `PLATFORM_ADMIN_EMAIL`

Kolekcje opisane w sekcji 6.

---

## 6. Panel administracyjny Payload

### 6.1 Kolekcje

| Kolekcja | Plik | Opis |
|----------|------|------|
| **users** | `Users.ts` | Kursanci + admin; auth; `welcomeEmailSent`, token rejestracji |
| **modules** | `Modules.ts` | 7 modułów: tytuł, tag, emoji, kolejność |
| **lessons** | `Lessons.ts` | Lekcje: richText, videoUrl, taskType, taskPrompt, legacySlug |
| **submissions** | `Submissions.ts` | Zgłoszenia uczniów + feedback |
| **media** | `Media.ts` | Metadane plików audio (Blob na prod) |

### 6.2 Custom komponenty admina

| Komponent | Rola |
|-----------|------|
| `AdminAudioRecorder` | Nagrywanie feedbacku głosowego w przeglądarce |
| `AdminSubmissionAudioListen` | Odsłuch nagrania ucznia |
| `AdminTeacherFeedbackHeader` | Nagłówek sekcji feedbacku |
| `AdminFlushTeacherAudioOnSave` | Przed zapisem formularza — flush audio do API |
| `AdminWelcomeEmailPanel` | Ręczna wysyłka maila powitalnego |
| `AdminWelcomeEmailSentCell` | Kolumna statusu maila w liście users |

### 6.3 Przepływ feedbacku w adminie

1. Wiktor otwiera **Submissions** → wybiera zgłoszenie
2. Odsłuchuje audio ucznia (`AdminSubmissionAudioListen` → `/api/media-playback/[id]`)
3. Pisze feedback tekstowy (Lexical) **lub** nagrywa głos (`AdminAudioRecorder`)
4. Nagranie głosowe idzie przez `POST /api/admin/submissions/[id]/teacher-audio` (Blob + SQL)
5. Przy „Save” — PATCH Payload aktualizuje `teacherFeedback`, `isReviewed`
6. Uczeń dostaje mail (deferred) + widzi feedback w `/elearning`

---

## 7. Platforma e-learning — pełny przepływ

### 7.1 Diagram przepływu ucznia

```
Logowanie (email/hasło)
        │
        ▼
┌───────────────────┐
│ Pobranie modułów  │  fetchElearningModules() → Payload DB
│ + zgłoszeń        │  submissions-api (REST / custom API)
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ Wybór lekcji      │  canAccessLesson() — kłódka jeśli zablokowane
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ Treść lekcji      │  LessonContentView:
│                   │  • intro + sekcje z course.json (legacySlug)
│                   │  • fallback: Lexical z Payload
│                   │  • VideoEmbed (YouTube / Shorts / Vimeo)
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ Zadanie           │  text / audio / multiday (7 dni)
│                   │  AudioRecorder → upload-audio → Blob
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ POST submissions  │  /api/elearning/submissions
│                   │  → Payload create (+ SQL fallback)
│                   │  → mail do Wiktora (deferred)
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ Status: oczekuje  │  lesson-status.ts
│ na feedback       │
└─────────┬─────────┘
          ▼
   [Wiktor sprawdza w /admin]
          ▼
┌───────────────────┐
│ Feedback widoczny │  tekst Lexical + UnschoolAudioPlayer
│ Następna lekcja   │  lesson-progression.ts odblokowuje
└───────────────────┘
```

### 7.2 Progresja i blokady

**Plik:** `src/features/elearning/lesson-progression.ts`

- **Moduł 1, lekcja 1** — zawsze otwarta
- **Kolejna lekcja** — odblokowana gdy istnieje **Submission** (wysłane zadanie) dla poprzedniej
- **Kolejny moduł** — gdy wszystkie lekcje poprzedniego modułu mają submission
- **Admin** (`isCourseAdmin`) — pełny dostęp, bez kłódek

### 7.3 Typy zadań

| taskType | UI | Opis |
|----------|-----|------|
| `text` | Textarea | Odpowiedź pisemna |
| `audio` | AudioRecorder | Nagranie w przeglądarce (WebM) |
| `multiday` | 7 pól / dni | Challenge (moduł 7) |

### 7.4 Upload audio ucznia

1. `AudioRecorder` nagrywa WebM w przeglądarce
2. `POST /api/elearning/upload-audio` (FormData, max 60s)
3. `createAudioMediaDocument()`:
   - **Prod:** Vercel Blob (private) + INSERT do `media` via SQL
   - **Dev:** Payload Media + folder `media/` na dysku
4. Zwraca `{ doc: { id, url: '/api/media-playback/…' } }`
5. ID media trafia do `studentAudio` w submission

### 7.5 Odtwarzanie audio

**Endpoint:** `GET /api/media-playback/[id]`

- Odczyt metadanych z SQL (`blob_pathname`)
- Stream z Vercel Blob (private) lub fallback Payload/dysk
- Nagłówki: `Content-Type: audio/webm`, `Accept-Ranges`

---

## 8. Płatności Stripe — pełny przepływ

### 8.1 Diagram

```
/unschool → CheckoutButton
        │
        ▼
POST /api/create-payment-intent
        │  (kwota: STRIPE_AMOUNT_CENTS, metadata)
        ▼
/payment — Payment Element
        │
        ├── set-email → /api/payment-intent/set-email
        │
        ▼
Stripe potwierdza płatność
        │
        ├──────────────────────────────┐
        ▼                              ▼
POST /api/webhooks/stripe      /success?payment_intent=…
payment_intent.succeeded              │
        │                      fallback provision
        ▼                              │
provisionStudentFromPaymentIntent      │
        │                              │
        ├─ find/create User (Payload)  │
        ├─ registrationToken           │
        ├─ sendWelcomeSetPasswordEmail │
        └─ metadata.provisioned=true   │
        │                              │
        └──────────────┬───────────────┘
                       ▼
              Mail: /ustaw-haslo?token=…
                       ▼
              Uczeń ustawia hasło
                       ▼
              Logowanie /elearning
```

### 8.2 Zdarzenia Stripe obsługiwane przez webhook

| Event | Akcja |
|-------|-------|
| `payment_intent.succeeded` | Provision użytkownika + mail |
| `checkout.session.completed` | Provision (alternatywna ścieżka) |
| `checkout.session.async_payment_succeeded` | Provision (płatności opóźnione) |

Inne eventy → `{ received: true, ignored: … }`

### 8.3 Idempotencja

- Pole `metadata.provisioned = "true"` na Payment Intent po sukcesie
- Powtórny webhook / odświeżenie `/success` **nie tworzy duplikatu** ani nie wysyła drugiego maila (jeśli już provisioned)

### 8.4 BLIK / płatności wymagające akcji

- Status `requires_action` → użytkownik kończy w banku
- `/success` pokazuje **„Płatność w trakcie przetwarzania”** dopóki Stripe nie zwróci `succeeded`
- Webhook lub ponowne wejście na success kończy provision

### 8.5 Konfiguracja Stripe (produkcja)

1. Dashboard → Webhooks → endpoint:  
   `https://www.wiktorszyszkowski.pl/api/webhooks/stripe`
2. Event: `payment_intent.succeeded` (+ opcjonalnie checkout events)
3. Signing secret → `STRIPE_WEBHOOK_SECRET` na Vercel

### 8.6 Dev — Stripe CLI

```bash
pnpm stripe:listen
# Skopiuj whsec_… → STRIPE_WEBHOOK_SECRET_CLI w .env.local
pnpm dev
```

---

## 9. Maile i zdarzenia (eventy)

### 9.1 Szablony (Resend)

**Plik:** `src/lib/email.ts`  
Layout HTML: fioletowy gradient header, biała karta, stopka.

| Mail | Trigger | Odbiorca | Temat (przykład) |
|------|---------|----------|------------------|
| **Welcome / set password** | Po płatności (webhook / success) | Kursant | Link `/ustaw-haslo?token=…` |
| **Nowe zadanie** | Po wysłaniu submission przez ucznia | `TEACHER_EMAIL` | „Nowe zadanie: [lekcja]” |
| **Feedback gotowy** | Po dodaniu feedbacku przez admina | Email ucznia | „Wiktor sprawdził Twoje zadanie” |

### 9.2 Kiedy wysyłane (po stabilizacji czerwiec 2026)

| Zdarzenie | Mechanizm |
|-----------|-----------|
| Nowe zadanie ucznia | `scheduleTeacherNewSubmissionEmail()` w `/api/elearning/submissions` — **po** odpowiedzi HTTP (`after()`) |
| Feedback dla ucznia | `scheduleStudentFeedbackReadyEmail()` w hooku Submissions (update) **lub** route `teacher-audio` |
| Hasło po zakupie | Synchronicznie w webhook (krytyczne — musi wyjść od razu) |

### 9.3 Wymagane env mailowe

```
RESEND_API_KEY=re_…
RESEND_FROM_EMAIL=kontakt@wiktorszyszkowski.pl
TEACHER_EMAIL=kontakt@wiktorszyszkowski.pl
```

**Ważne:** domena `wiktorszyszkowski.pl` musi być **zweryfikowana w Resend** (DNS SPF/DKIM).

### 9.4 Newsletter (osobny pipeline)

- `NewsletterForm` / `NewsletterModal` → Server Action `app/actions/newsletter.ts` → **Brevo API**
- Niezależny od Payload/Stripe

---

## 10. Baza danych i pliki (audio)

### 10.1 Supabase PostgreSQL

- **Produkcja:** Transaction pooler, port **6543**, host `*.pooler.supabase.com`
- **Plan:** Nano (domyślnie ~15 połączeń do klastra, 200 klientów poolera)
- **Tabele Payload:** `users`, `users_sessions`, `lessons`, `modules`, `submissions`, `media`, `payload_locked_documents`, …

### 10.2 Vercel Blob

- **Env:** `BLOB_READ_WRITE_TOKEN`
- Pliki **prywatne** (`.private.blob.vercel-storage.com`)
- Metadane: kolumny `blob_url`, `blob_pathname` w tabeli `media` (SQL fallback)

### 10.3 Dev vs prod — media

| Środowisko | Storage |
|------------|---------|
| Local | Folder `media/` + Payload upload |
| Vercel | Blob + SQL insert (bez zapisu na dysk serverless) |

### 10.4 Seed kursu

**Źródło:** `src/data/course-mockup/course.json` (7 modułów, 34+ lekcji)

```bash
pnpm seed:course              # dopina brakujące
pnpm seed:course -- --reset   # pełny reimport (UWAGA: kasuje moduły/lekcje/submissions)
```

**Produkcja:** tylko z nagłówkiem `x-dev-seed-key: DEV_SEED_KEY` — **nie odpala się przy deployu automatycznie**.

### 10.5 Co jest w bazie vs w kodzie

| Dane | Gdzie edytowane | Gdzie wyświetlane |
|------|-----------------|-------------------|
| Moduły, tytuły lekcji, zadania, wideo URL | Payload admin | `/elearning` |
| Kolorowe bloki treści lekcji | `course.json` (legacySlug) | `/elearning` (mockup lookup) |
| Zgłoszenia, feedback | Payload admin + API | `/elearning`, admin |
| Copy `/unschool`, landing | **Kod** (`page.tsx`, `content.ts`) | Strony statyczne |
| Użytkownicy | Stripe provision + admin | auth |

**Wiktor edytując treść lekcji w adminie (Lexical)** — może **nie widać** zmiany, jeśli lekcja ma `legacySlug` i UI bierze mockup z JSON.

---

## 11. Mobile i responsywność

### 11.1 Podejście ogólne

- **Mobile-first** Tailwind: `sm:`, `md:`, `lg:` breakpointy wszędzie
- Touch-friendly: min. ~44px na przyciskach, `rounded-xl` kart
- `scroll-behavior: smooth` na `html`

### 11.2 `/unschool`

- Hamburger nav → drawer linków
- Hero: jedna kolumna → dwie na `lg:`
- Program modułów: 1 kolumna → 2 → 3 na desktop
- FAQ: pełna szerokość, duże obszary kliku

### 11.3 `/elearning`

**Desktop:**

- Sidebar ~280px z modułami + lista lekcji
- Treść lekcji obok

**Mobile:**

- Sidebar ukryty — wybór modułu/lekcji przez **drawer / overlay**
- `ElearningMobileMenu` — portal React, `z-index` 200+, blokada scrolla body
- `AudioRecorder` — działa na iOS/Android (WebM; Safari może wymagać fallback MIME)
- Wideo YouTube Shorts — pionowa ramka na mobile

### 11.4 `/payment`

- Stripe Payment Element — responsywny natywnie
- Formularz wyśrodkowany, `max-w-lg`

### 11.5 Admin Payload

- Panel Payload ma własny responsive UI (tablet/desktop zalecane do nagrywania feedbacku)

---

## 12. Wydajność i czasy działania

### 12.1 Po stabilizacji (czerwiec 2026)

| Operacja | Typowy czas | Uwagi |
|----------|-------------|-------|
| Logowanie `/elearning` | **1–3 s** | Wcześniej 40 s timeout (naprawione) |
| Załadowanie listy modułów | **1–2 s** | SSR + 2 zapytania Payload |
| Wysłanie zadania (tekst) | **2–4 s** | Payload create + deferred mail |
| Upload głosówki | **3–8 s** | Blob upload + SQL insert |
| Odsłuch audio | **< 1 s** start stream | Zależy od sieci |
| Admin zapis feedbacku | **2–5 s** | PATCH Payload |
| Płatność Stripe | **5–30 s** | BLIK dłużej — pending state |
| Cold start Vercel | **+1–3 s** | Pierwsze wejście po bezczynności |

### 12.2 Serverless — co wpływa na czas

- **Cold start** — nowa lambda, init Payload + pool Postgres
- **Warm lambda** — `getCachedPayload()` + singleton pool → znacznie szybciej
- **Supabase pooler** — kolejka przy bardzo dużym ruchu (mało prawdopodobne na start)

### 12.3 Limity techniczne

| Limit | Wartość |
|-------|---------|
| `maxDuration` upload audio | 60 s (Vercel function) |
| Rozmiar nagrania | Praktycznie do ~10 MB WebM |
| Payload request | Domyślne limity Vercel (4.5 MB body na Hobby) |

---

## 13. Problemy produkcyjne i jak je naprawiliśmy

Ta sekcja dokumentuje **rzeczywiste** problemy z testów produkcyjnych i ich rozwiązania.

### 13.1 Płatność OK, brak użytkownika i maila

**Objawy:** Stripe pokazuje sukces, brak usera w admin, brak maila powitalnego.

**Przyczyny:**

1. Webhook nie doszedł (zły `STRIPE_WEBHOOK_SECRET`, BLIK = `requires_action` zamiast od razu `succeeded`)
2. Webhook padł w trakcie provision (błąd DB/email)

**Naprawa:**

- Fallback na `/success` — provision gdy PI = `succeeded`
- Pełne pobranie PI z `expand: latest_charge` dla emaila
- `metadata.provisioned` — idempotencja
- Oznaczenie `welcomeEmailSent` nawet przy częściowym błędzie maila (retry ręczny z admin)

---

### 13.2 Głosówki — ENOENT `media/`, brak w Supabase

**Objawy:** Upload „OK”, pliki w Vercel Blob, ale **0 rekordów** `media` z `blob_pathname` w SQL.

**Przyczyna:** Upload do Blob się udawał, INSERT do Postgres **padał** (connection pool / Drizzle) → orphan blobs.

**Naprawa:**

- `sqlCreateBlobMedia()` — bezpośredni INSERT SQL
- `ensureMediaBlobColumns()` — migracja kolumn Blob
- `/api/media-playback/[id]` — odczyt SQL + private Blob `get()`

---

### 13.3 EMAXCONNSESSION — max 15 klientów Postgres

**Objawy:**

```
(EMAXCONNSESSION) max clients reached in session mode - pool_size: 15
timeout exceeded when trying to connect
```

**Przyczyny (warstwa po warstwie):**

1. **Zły URI** — Direct/Session (5432) zamiast Transaction pooler (6543)
2. **Wiele pul `pg`** — Payload + osobny `new Pool()` przy każdym uploadzie + `pool.end()`
3. **`max: 1` na puli** + Payload init **trzyma 1 połączenie bez release** (`connectWithReconnect`) → **zero wolnych slotów na login**
4. **Hooki Submissions** — dodatkowe SQL w trakcie zapisu → deadlock na połączeniach
5. **Maile w hookach** — czekały na DB w środku requestu

**Naprawa (commits `72d9375` → `e3167ea`):**

| Zmiana | Plik |
|--------|------|
| Transaction pooler + `pgbouncer=true` | env + `pg-singleton.ts` |
| Jedna współdzielona pula | `pg-singleton.ts`, `payload.config.ts` |
| `max: 3` na serverless | `buildPgPoolConfig()` |
| Cache Payload | `payload-cache.ts`, `auth.ts`, API routes |
| Usunięcie SQL z hooków | `Submissions.ts` |
| Maile deferred (`after()`) | `defer-server-task.ts`, `submission-email-hooks.ts` |
| `disableLocalStorage` media na Vercel | `Media.ts` |

**Jedno zdanie podsumowania:** Serverless otwierał za dużo połączeń do Postgres, a przy `max: 1` sam Payload blokował pulę po starcie — stąd 40 s timeout na logowaniu i 500 na uploadzie.

---

### 13.4 Admin „Something went wrong”, feedback częściowy

**Objawy:** Głos zapisany, tekst nie; admin nie wchodzi w submission; maile nie wychodzą.

**Przyczyna:** Ten sam problem puli + SQL w hookach podczas PATCH + query `payload_locked_documents`.

**Po naprawie:** Zapis szybki, feedback tekstowy + głosowy działa, maile wychodzą po deferred task.

---

### 13.5 Lekcje — płaski tekst zamiast kolorowych bloków

**Objaw:** Lekcje wyglądały jak zwykły Lexical, nie jak mockup JSX.

**Naprawa:** `LessonContentView` + `LessonSectionBlock` + `mockup-lesson-lookup.ts` — wyświetlanie sekcji z `course.json` po `legacySlug` **bez zmian w schemacie DB**.

---

## 14. Utrzymanie — co robić na co dzień

### 14.1 Wiktor (content + pedagogy)

| Zadanie | Gdzie |
|---------|-------|
| Sprawdzać zadania uczniów | `/admin` → Submissions |
| Nagrywać / pisać feedback | Formularz submission |
| Edytować tytuły lekcji, URL wideo, polecenia | `/admin` → Lessons |
| Edytować moduły | `/admin` → Modules |
| Ręcznie wysłać mail powitalny | User → przycisk welcome email |
| **Nie** polegać na Lexical do kolorowych bloków | Edycja `course.json` + deploy (jeśli zmiana treści mockup) |

### 14.2 Developer / deploy

| Zadanie | Częstotliwość |
|---------|---------------|
| `git push` → Vercel auto-deploy | Po każdej zmianie kodu |
| Sprawdzenie env na Vercel | Po rotacji secretów |
| Stripe webhook logs | Po problemach z płatnością |
| Vercel function logs | Po 500 / timeout |
| Supabase → Database → connection pooler | URI zawsze 6543 |
| **Nie** uruchamiać `seed:course --reset` na prod | Tylko świadomie z kluczem |

### 14.3 Backup i bezpieczeństwo

- **Supabase:** automatyczne backupy (zależne od planu)
- **Rotacja secretów:** po wycieku (DATABASE_URI, RESEND, STRIPE, PAYLOAD_SECRET)
- **Basic Auth `/unschool`:** wyłączyć przed publicznym launch (usunąć/zmienić `proxy.ts`)
- **Admin:** tylko jeden email admina w `PLATFORM_ADMIN_EMAIL`

### 14.4 Monitoring (zalecane)

- Vercel Analytics / Logs
- Stripe Dashboard → Webhooks (delivery success rate)
- Resend Dashboard → delivered / bounced
- Supabase → Database health

---

## 15. Szacunkowe koszty utrzymania

> Kwoty orientacyjne na czerwiec 2026 — zweryfikuj w panelach billingowych.

| Usługa | Plan typowy | Szacunek/mies. | Uwagi |
|--------|-------------|----------------|-------|
| **Vercel** | Pro ~$20 | $0–20+ | Hobby możliwy na start; Pro dla komercji |
| **Supabase** | Free / Pro | $0–25 | Nano free tier; Pro przy większej bazie |
| **Stripe** | Pay-as-you-go | ~2,9% + 0,25€ / transakcja | Brak abonamentu |
| **Resend** | Free → Pro | $0–20 | Free: 3k maili/mies.; potem Pro |
| **Vercel Blob** | Usage | $0–5 | Mało plików audio na start |
| **Brevo** | Free | $0 | Newsletter do limitu kontaktów |
| **Domena** | Rocznie | ~50–100 PLN/rok | u registrara |
| **Cursor / dev** | — | — | Koszt developmentu osobno |

**Przy małej liczbie kursantów (np. <50):** realistycznie **$0–30/mies.** infrastruktury + prowizje Stripe od sprzedaży.

**Skalowanie:** większy ruch audio → Vercel Blob + egress; więcej maili → Resend Pro; więcej DB → Supabase Pro.

---

## 16. Zmienne środowiskowe

### 16.1 Pełna lista

| Zmienna | Wymagane | Opis |
|---------|----------|------|
| `PAYLOAD_SECRET` | ✅ | Secret sesji Payload |
| `DATABASE_URI` | ✅ | Postgres — **pooler :6543** na prod |
| `BLOB_READ_WRITE_TOKEN` | ✅ prod | Vercel Blob |
| `RESEND_API_KEY` | ✅ | API Resend |
| `RESEND_FROM_EMAIL` | ✅ | Nadawca (zweryfikowana domena) |
| `TEACHER_EMAIL` | ✅ | Powiadomienia o zadaniach |
| `PLATFORM_ADMIN_EMAIL` | ✅ | Jedyny admin |
| `STRIPE_SECRET_KEY` | ✅ | Stripe secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe public |
| `STRIPE_WEBHOOK_SECRET` | ✅ prod | Webhook signing |
| `STRIPE_WEBHOOK_SECRET_CLI` | dev | Stripe CLI tunnel |
| `STRIPE_AMOUNT_CENTS` | ✅ | Cena w groszach (200 = 2 zł test) |
| `NEXT_PUBLIC_SITE_URL` | ✅ | `https://www.wiktorszyszkowski.pl` |
| `UNSCHOOL_USER` / `UNSCHOOL_PASSWORD` | opcjonalne | Basic Auth `/unschool` |
| `DEV_SEED_KEY` | opcjonalne | Seed/API dev na prod |
| `BREVO_API_KEY` / `BREVO_LIST_ID` | opcjonalne | Newsletter |

### 16.2 Przykład DATABASE_URI (produkcja)

```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
```

Kod automatycznie dodaje `?pgbouncer=true` jeśli brak.

---

## 17. Skrypty i narzędzia developerskie

| Skrypt | Polecenie | Opis |
|--------|-----------|------|
| Dev | `pnpm dev` | localhost:3000, webpack |
| Dev clean | `pnpm dev:clean` | Czyści `.next` |
| Build | `pnpm build` | Produkcja |
| Start | `pnpm start` | Serwer po build |
| Payload CLI | `pnpm payload` | Migracje, typy |
| Import map | `pnpm generate:importmap` | Po zmianie komponentów admina |
| Seed kursu | `pnpm seed:course` | Mockup → DB |
| Sync wideo | `pnpm sync:mockup-videos` | URL wideo z mockup |
| Clear media | `pnpm clear:media` | Kasuje media Payload |
| Reset users | `pnpm reset:users` | Zostawia admina |
| Stripe listen | `pnpm stripe:listen` | Webhook → localhost |

### 17.1 Dev API

| Endpoint | Opis |
|----------|------|
| `POST /api/dev/seed-course` | Import kursu |
| `POST /api/dev/test-welcome-email` | Test maila |
| `POST /api/dev/reset-users` | Czyszczenie uczniów testowych |

---

## 18. Deploy i checklist produkcyjny

### 18.1 Pipeline

```
git push main → Vercel build (pnpm build) → deploy → env z panelu Vercel
```

### 18.2 Checklist przed launch / po zmianach

- [ ] `DATABASE_URI` = Transaction pooler **6543**
- [ ] `BLOB_READ_WRITE_TOKEN` ustawiony
- [ ] Stripe webhook → 200 OK w logach
- [ ] Resend — domena verified
- [ ] `NEXT_PUBLIC_SITE_URL` poprawny (www vs non-www)
- [ ] Test E2E: płatność → mail → hasło → login → lekcja → głosówka → admin feedback
- [ ] Logi Vercel — brak timeout Postgres

### 18.3 Po deployu Wiktor edytuje w Payload

- Zmiany w **lekcjach/modułach/submissions** → **zostają** (baza)
- Zmiany w **copy `/unschool`** → wymagają **commit + deploy** (kod)
- **Seed reset** → **nadpisuje** lekcje — nie uruchamiać bez potrzeby

---

## 19. Historia commitów (skrót)

| Commit | Opis |
|--------|------|
| `1038670` | Finalizacja landingu |
| `16eb301` | Strona `/unschool` + Basic Auth |
| `56d3628` / `79f64b5` | Platforma `/elearning` |
| `51f6437` | Major update — Payload, Stripe, pełny kurs |
| `28945cc` | Płatności prod + Blob private |
| `4984396` | Voice upload Blob + SQL fallback |
| `bde3082` | Kolorowe bloki lekcji |
| `72d9375` → `e3167ea` | Naprawa Postgres pool (login, upload, admin) |
| `33946d6` | Deferred maile, lżejsze hooki |

---

## 20. Co dalej (backlog)

| Priorytet | Zadanie |
|-----------|---------|
| Wysoki | Publiczny launch `/unschool` (wyłączyć Basic Auth) |
| Wysoki | Copy `/unschool` — 35 lekcji, poprawki Wiktora (osobny deploy) |
| Średni | `@payloadcms/storage-vercel-blob` — oficjalny adapter (warning Payload) |
| Średni | Edycja kolorowych bloków w adminie (zamiast JSON mockup) |
| Średni | Certyfikat ukończenia kursu (PDF) |
| Niski | Panel postępu % dla ucznia |
| Niski | Powiadomienia push / przypomnienia mailowe |
| Niski | Analytics (PostHog / Plausible) |

---

## Appendix A — Mapa API (produkcja)

| Metoda | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/create-payment-intent` | public |
| POST | `/api/payment-intent/set-email` | public |
| POST | `/api/webhooks/stripe` | Stripe signature |
| POST | `/api/auth/set-password` | token |
| GET/POST | `/api/elearning/submissions` | sesja ucznia |
| PATCH | `/api/elearning/submissions/[id]` | sesja ucznia |
| POST | `/api/elearning/upload-audio` | sesja ucznia |
| POST | `/api/admin/submissions/[id]/teacher-audio` | admin |
| GET | `/api/media-playback/[id]` | public (id znane) |
| * | `/api/users/login` | Payload REST |
| * | `/admin/*` | Payload admin |

---

## Appendix B — Diagram encji (uproszczony)

```
Users ─────┬──── Submissions ──── Lessons ──── Modules
           │           │
           │           ├── textContent (uczeń)
           │           ├── studentAudio → Media
           │           ├── teacherFeedback (Lexical)
           │           └── teacherAudio → Media
           │
           └── auth sessions (users_sessions)

Media ─── blob_url, blob_pathname (Vercel Blob prod)
```

---

## Appendix C — Testowany scenariusz E2E (checklista QA)

Scenariusz używany przy testach produkcyjnych czerwiec 2026:

1. [ ] Wejście na `/unschool` (Basic Auth)
2. [ ] Klik „Kup kurs” → `/payment`
3. [ ] Płatność testowa Stripe (2 zł)
4. [ ] Redirect `/success` — komunikat sukcesu
5. [ ] Mail powitalny z linkiem `/ustaw-haslo`
6. [ ] Ustawienie hasła
7. [ ] Logowanie `/elearning` — **szybko (<3 s)**
8. [ ] Otwarcie lekcji 1 — kolorowe bloki, wideo
9. [ ] Wysłanie zadania tekstowego + głosówki
10. [ ] Mail do Wiktora o nowym zadaniu
11. [ ] Admin → submission → odsłuch audio
12. [ ] Feedback głosowy + tekstowy → zapis **bez** „Something went wrong”
13. [ ] Uczeń widzi feedback; mail do ucznia
14. [ ] Odblokowanie lekcji 2

---

*Raport utworzony i utrzymywany jako główna dokumentacja techniczno-produktowa projektu Wiktor Szyszkowski / Unschool Your English. Ostatnia aktualizacja: czerwiec 2026.*
