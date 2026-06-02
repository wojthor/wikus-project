# Raport projektu – Wiktor Szyszkowski / Unschool Your English

Platforma łączy stronę marketingową, sprzedaż kursu (Stripe), CMS (Payload) i e-learning z zadaniami głosowymi/tekstowymi oraz feedbackiem nauczyciela.

**Stack:** Next.js 16 · React 19 · Payload CMS 3.85 · PostgreSQL · Stripe · Resend · Tailwind CSS 4 · pnpm

---

## Uruchomienie

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Produkcja: `pnpm build` → `pnpm start`

---

## Zmienne środowiskowe (`.env.local`)

| Zmienna | Opis |
|---------|------|
| `PAYLOAD_SECRET` | Secret Payload CMS |
| `DATABASE_URI` | PostgreSQL — na Vercel **Supabase „Transaction” pooler (port 6543)**, nie session (5432) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (nagrania głosowe na produkcji) |
| `RESEND_API_KEY` | Wysyłka maili (Resend) |
| `RESEND_FROM_EMAIL` | Adres nadawcy |
| `TEACHER_EMAIL` | Email Wiktora (powiadomienia o zadaniach) |
| `PLATFORM_ADMIN_EMAIL` | Jedyny admin platformy (domyślnie `kontakt@wiktorszyszkowski.pl`) |
| `STRIPE_SECRET_KEY` | Stripe secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable |
| `STRIPE_WEBHOOK_SECRET` | Webhook produkcyjny |
| `STRIPE_WEBHOOK_SECRET_CLI` | Webhook Stripe CLI (dev) |
| `STRIPE_AMOUNT_CENTS` | Cena kursu w groszach (np. `200` = 2 zł test) |
| `NEXT_PUBLIC_SITE_URL` | URL produkcyjny (np. `https://wiktorszyszkowski.pl`) |
| `UNSCHOOL_USER` / `UNSCHOOL_PASSWORD` | Basic auth na `/unschool` (middleware) |
| `DEV_SEED_KEY` | Opcjonalny klucz do seeda kursu bez logowania admina |
| `BREVO_API_KEY` / `BREVO_LIST_ID` | Newsletter (landing) |

---

## Struktura aplikacji

### Strony publiczne – `app/(site)/`

| Ścieżka | Plik | Opis |
|---------|------|------|
| `/` | `page.tsx` | Landing (hero, oferta, korepetycje, newsletter) |
| `/unschool` | `unschool/page.tsx` | Strona sprzedaży kursu |
| `/payment` | `payment/page.tsx` | Płatność Stripe (Payment Intent) |
| `/success` / `/failed` | | Po płatności |
| `/elearning` | `elearning/page.tsx` | Re-export platformy e-learning |
| `/ustaw-haslo` | | Ustawienie hasła po zakupie |

Treść landing page: `data/content.ts`  
Oferta Unschool (cena, lista benefitów): `src/features/unschool/course-offer.ts`

### E-learning – `app/elearning/`

| Komponent | Rola |
|-----------|------|
| `ElearningPage.tsx` | Server: auth + fetch modułów |
| `StudentPanel.tsx` | Główny UI ucznia/admina |
| `LoginForm.tsx` | Logowanie Payload |
| `ElearningHeader.tsx` | Navbar (linki, hamburger mobile) |
| `ElearningMobileMenu.tsx` | Menu mobilne |

Logika kursu: `src/features/elearning/`

- **Postęp:** `lesson-progression.ts` – odblokowanie lekcji/modułów po wysłaniu zadań
- **Status lekcji:** `lesson-status.ts`
- **API zgłoszeń:** `submissions-api.ts`, `media-api.ts`
- **Auth:** `auth.ts` – sesja Payload, `displayName`, flaga admina
- **Kurs z CMS:** `fetch-course.ts` – moduły, lekcje, akcenty kolorów

UI ucznia: sidebar modułów, treść Lexical, wideo (YouTube Shorts / watch), formularz zadania (tekst + głosówka), feedback nauczyciela.

### Payload CMS – `app/(payload)/` + `payload.config.ts`

Admin: **`/admin`** (tylko `PLATFORM_ADMIN_EMAIL`)

Kolekcje (`src/collections/`):

| Kolekcja | Zawartość |
|----------|-----------|
| **Users** | Uczniowie + admin; auth e-learning |
| **Modules** | 7 modułów (tag, emoji, intro, kolejność) |
| **Lessons** | Lekcje: richText, wideo URL, typ zadania, prompt |
| **Submissions** | Zgłoszenia uczniów + feedback (tekst/audio) |
| **Media** | Pliki audio (nagrania uczniów i feedback Wiktora) |

Custom pola admina (`app/components/`):

- `AdminAudioRecorder` – nagrywanie feedbacku głosowego
- `AdminSubmissionAudioListen` – odsłuch nagrania ucznia
- `AdminTeacherFeedbackHeader` – nagłówek sekcji feedbacku

### API (produkcja)

| Endpoint | Opis |
|----------|------|
| `POST /api/create-payment-intent` | Stripe Payment Intent |
| `POST /api/payment-intent/set-email` | Email przed płatnością |
| `POST /api/webhooks/stripe` | Zakup → konto użytkownika + mail powitalny |
| `POST /api/auth/set-password` | Ustawienie hasła z linku |
| `GET/POST /api/elearning/submissions` | Zgłoszenia ucznia |
| `PATCH /api/elearning/submissions/[id]` | Aktualizacja zgłoszenia |
| `POST /api/elearning/upload-audio` | Upload nagrania ucznia |
| `POST /api/admin/submissions/[id]/teacher-audio` | Feedback audio admina |
| `GET /api/media-playback/[id]` | Stream pliku z Media |

### Basic auth /unschool

`proxy.ts` – ochrona `/unschool` (Next.js 16 proxy; env: `UNSCHOOL_USER`, `UNSCHOOL_PASSWORD`).

---

## Płatność i onboarding

1. Użytkownik na `/unschool` → checkout → `/payment`
2. Stripe Payment Intent (`CheckoutWrapper` + `PaymentForm`)
3. **Webhook** `payment_intent.succeeded` → `/api/webhooks/stripe` → konto + mail z hasłem
4. Tworzy użytkownika Payload, wysyła mail z linkiem `/ustaw-haslo?token=…` (Resend)
5. Po ustawieniu hasła → logowanie na `/elearning`

### Stripe webhook (dev i produkcja — ta sama ścieżka)

Konto + mail z hasłem **tylko** przez webhook `/api/webhooks/stripe`. Strona `/success` nic nie tworzy (unikamy duplikatów maili).

**Produkcja (raz):**

1. Stripe Dashboard → Webhooks → endpoint  
   `https://wiktorszyszkowski.pl/api/webhooks/stripe`  
   zdarzenie: `payment_intent.succeeded`
2. Signing secret → `STRIPE_WEBHOOK_SECRET` (stały, nie zmienia się)

**Lokalnie — uruchom w drugim terminalu przed testem płatności:**

```bash
pnpm stripe:listen
```

Skopiuj wyświetlony `whsec_…` → `.env.local`:

```
STRIPE_WEBHOOK_SECRET_CLI=whsec_...
```

Zrestartuj `pnpm dev`. Przy **każdym nowym** `stripe listen` secret się zmienia — to normalne dla CLI.

Idempotencja: ta sama płatność nie wyśle maila drugi raz (`metadata.provisioned` na Payment Intent).

### Ręczny test maila (dev, bez płatności)

```bash
curl -X POST http://localhost:3000/api/dev/test-welcome-email \
  -H "Content-Type: application/json" \
  -d '{"email":"twoj@email.pl"}'
```


---

## E-learning – przepływ ucznia

1. Logowanie (email + hasło Payload)
2. Sidebar: moduły z kolorami, kłódka na zablokowanych
3. Lekcja: tytuł → wideo (opcjonalnie) → treść (Lexical) → zadanie
4. Zadanie: tekst i/lub nagranie w przeglądarce (`AudioRecorder`)
5. Po wysłaniu: status „oczekuje na feedback”; modal sukcesu
6. Admin dodaje feedback w `/admin` → uczeń widzi + mail opcjonalnie
7. Po zadaniu odblokowuje się następna lekcja; po wszystkich w module – następny moduł
8. **Admin** (`isCourseAdmin`) – pełny dostęp bez blokad

Typy zadań: `text`, `audio`, `multiday` (7 dni – challenge w module 7).

Wideo: `VideoEmbed` + `video-embed-url.ts` – obsługa YouTube (watch, Shorts `/shorts/ID`), Vimeo.

---

## Seed kursu (mockup — „jakby co”)

Źródło treści: `src/data/course-mockup/course.json` (7 modułów, 34 lekcje) — opis w `src/data/course-mockup/README.md`

```bash
# Wymaga działającego serwera (pnpm dev lub produkcja):
pnpm seed:course              # dopina brakujące lekcje
pnpm seed:course -- --reset   # kasuje moduły/lekcje/zgłoszenia i importuje od zera
```

Używa `NEXT_PUBLIC_SITE_URL` i opcjonalnie `DEV_SEED_KEY` z `.env.local`.

**API** `POST /api/dev/seed-course`:

- **Dev:** zalogowany admin w `/admin` albo nagłówek `x-dev-seed-key`
- **Produkcja:** tylko `x-dev-seed-key` = `DEV_SEED_KEY` (ustaw w Vercel)

```bash
curl -X POST https://wiktorszyszkowski.pl/api/dev/seed-course \
  -H "Content-Type: application/json" \
  -H "x-dev-seed-key: TWOJ_DEV_SEED_KEY" \
  -d '{"reset":false}'
```

W konsoli admina (dev):

```js
fetch("/api/dev/seed-course", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ reset: false }),
}).then((r) => r.json()).then(console.log);
```

Konwersja sekcji mockup → Lexical: `src/lib/mockup-sections-to-lexical.ts`

---

## Skrypty npm

| Skrypt | Opis |
|--------|------|
| `pnpm dev` | Dev server (webpack) |
| `pnpm build` / `start` | Produkcja |
| `pnpm payload` | CLI Payload |
| `pnpm generate:importmap` | Po zmianie custom komponentów admina |
| `pnpm clear:media` | Usuwa wszystkie pliki z kolekcji Media |
| `pnpm reset:users` | Zostawia tylko `kontakt@wiktorszyszkowski.pl` (+ czyści zgłoszenia/media) |
| `pnpm stripe:listen` | Tunel webhook Stripe → localhost (dev) |

---

## Dev API (tylko development)

| Endpoint | Opis |
|----------|------|
| `POST /api/dev/seed-course` | Import mockup → Payload |
| `POST /api/dev/test-welcome-email` | Test maila powitalnego |
| `POST /api/dev/reset-users` | Usuwa uczniów testowych, zostawia admina |

---

## Newsletter

Landing: `NewsletterForm` / `NewsletterModal` → `app/actions/newsletter.ts` → Brevo API.

---

## Kluczowe pliki konfiguracyjne

- `next.config.ts` – Next + Payload
- `payload.config.ts` – CMS, Postgres, Resend
- `tsconfig.json` – alias `@/` → root, `@payload-config`
- `eslint.config.mjs`, `.prettierrc`

---

## Co usunięto przy czyszczeniu repo

- Katalog `docs/` (stare raporty — dokumentacja projektu: `RAPORT.md` w korzeniu)
- `public/gumaroad.png` (przyciski Gumroad bez logo w UI)
- Martwy kod: `AdminAudioPlayer`, `stripe-checkout-redirect`, `unschool-brand`, `scripts/clear-all-media.mjs`
- Mockup kursu: `src/data/course-mockup/course.json` + `README.md` (import: `pnpm seed:course`)

---

## Deploy – checklist

1. PostgreSQL + env na hostingu
2. Stripe webhook → `/api/webhooks/stripe`
3. `NEXT_PUBLIC_SITE_URL` ustawiony
4. `pnpm build` bez błędów
5. Payload admin dostępny tylko dla admina
6. Seed kursu na produkcji przez admin panel (ręcznie) lub jednorazowy import

---

*Ostatnia aktualizacja raportu: maj 2026*
