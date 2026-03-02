# Raport: strona „Projekt dla Wikusia”

## Co to jest

Landing page (strona wizytówkowa / VSL) promująca **kursy i korepetycje z angielskiego**. Jedna długa strona z sekcjami: Hero, Fakty (problem), O mnie, Opinie, Oferta, Final CTA.

---

## Technologie

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Lucide React** (ikony)
- Treści w jednym pliku: **`data/content.ts`** (łatwa edycja tekstów bez ruszania kodu)

---

## Struktura strony (z góry na dół)

### 1. Nawigacja (sticky)
- Linki: **Fakty** → #problem | **O mnie** → #o-mnie | **Opinie** → #opinie | **Oferta** → #oferta
- Styl: biała, rozmyte tło (backdrop blur), minimalistyczna

### 2. Hero (pełny ekran)
- **Hook** – zachęta („mówisz po angielsku / blokujesz się?”)
- **Pytanie + korzyść** – obietnica kursów/korepetycji dopasowanych do Ciebie
- **Obietnica** – konkret: korepetycje + kursy online (gramatyka, konwersacje, biznes)
- Przyciski: **Oferta**, **O mnie**
- Na dole: **strzałka w dół** (przewijanie do sekcji Fakty)

### 3. Fakty (Problem)
- Nagłówek: *„Dlaczego większość ludzi nie udaje się z angielskim?”*
- Krótka agitacja („must-have” vs „lata w szkole nic nie dają”)
- Identyfikacja problemu (brak metody, brak mówienia)
- **Odkrycie spisku** – większość uczy się bez mówienia; potrzeba: rozmowa + schematy
- Lista **4 punktów bólu** (np. lata nauki i pustka w głowie, brak planu)

### 4. O mnie
- **Zdjęcie** (np. Wiktor) + imię i nazwisko + tytuł (Nauczyciel angielskiego)
- **Certyfikaty i doświadczenie** (np. Grudziądzka Szkoła Biznesu, kurs metodyczny, 50+ lat w nauczaniu)
- **Bio** – kto jest, co robi (nauczyciel angielskiego, autor kursów, dziesiątki uczniów)
- **Bloki historii** z hasłami VSL w **[ ]** na czerwono: Zbudowanie autorytetu, Historia początków, Postanowienie zmiany, Nowa droga, Efekty, Dodatkowe korzyści, Dlaczego dzielę się wiedzą

### 5. Opinie (Dowód społeczny)
- Krótki wstęp (metoda przetestowana na dziesiątkach uczniów)
- **3 cytaty** z oceną 5★ (np. Lebron James, Maks Konkiel, Carcia Loncz) + krótki wynik (matura, praca, efekty w kilka miesięcy)

### 6. Oferta
- **Korepetycje** – indywidualne lekcje z angielskiego, przycisk „Umów lekcję” (link do Gumroad/Calendly)
- **Kursy** – 3 produkty w kartach:
  - *Gramatyka w mówieniu* (297 zł)
  - *Konwersacje po angielsku* (197 zł)
  - *E-book: Angielski w biznesie* (67 zł)
- Każda karta: tytuł, krótki opis, cena, przycisk **„Kup przez”** (Gumroad)
- **Zbudowanie wartości** – krótki tekst (wiedza w kursach/lekcjach, bez dojazdów)
- **Gwarancja** – zwrot / inna forma, jeśli nie pasuje
- **Deadline** – ograniczone miejsca / ceny promocyjne

### 7. Final CTA
- **Masz 2 opcje** – odkładać angielski vs umówić lekcję / wybrać kurs
- **Co się stanie po zakupie/rezerwacji** – 2 punkty (potwierdzenie, dostęp / termin)
- Zachęta + przycisk **„Zobacz ofertę”** → #oferta

---

## Konwencje na stronie

- **Hasła VSL** (np. Hook, Obietnica, Zbudowanie autorytetu) są wszędzie w formacie **[hasło]** – **czerwone, pogrubione**.
- **Smooth scroll** – klik w linki nawigacji / strzałkę przewija do odpowiedniej sekcji.
- **Gumroad** – skrypt w `layout.tsx`; przyciski „Kup przez” i „Umów lekcję” prowadzą do linków z `content.ts` (można podmienić na Calendly / Stripe).

---

## Gdzie co edytować

| Co | Gdzie |
|----|--------|
| Wszystkie teksty (hero, problem, o mnie, opinie, oferta, CTA) | `data/content.ts` |
| Układ sekcji, style, nawigacja | `app/page.tsx` |
| Tytuł i opis strony (SEO) | `app/layout.tsx` (metadata) |
| Zdjęcie w Hero / O mnie | `public/unnamed.jpeg` (lub zmiana ścieżki w `page.tsx`) |

---

## Podsumowanie

Strona to **landing pod kursy i korepetycje z angielskiego**: jedna długa strona z narracją VSL (hook → problem → autorytet → opinie → oferta → CTA). Oferta to **korepetycje** (umów lekcję) + **3 kursy online** (Gramatyka w mówieniu, Konwersacje, E-book biznes). Treści są po polsku, w jednym pliku; technicznie: Next.js, React, Tailwind, TypeScript.
