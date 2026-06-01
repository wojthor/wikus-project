# Mockup kursu Unschool (źródło treści)

Plik **`course.json`** — pełna treść kursu offline: **7 modułów**, **34 lekcje** (tekst, sekcje, zadania, flagi wideo).

## Import do Payload / Supabase

```bash
pnpm dev                    # w drugim terminalu
pnpm seed:course            # dopina / aktualizuje lekcje
pnpm seed:course -- --reset # usuwa moduły, lekcje i zgłoszenia, potem import od zera
```

Na produkcji: `POST /api/dev/seed-course` z nagłówkiem `x-dev-seed-key` (wartość z `DEV_SEED_KEY`).

Logika importu: `src/lib/seed-mockup-course.ts` · konwersja sekcji → Lexical: `src/lib/mockup-sections-to-lexical.ts`.

## Linki do wideo

Mockup może zawierać pole **`videoUrl`** przy lekcji. Jeśli go nie ma, `pnpm seed:course` **nie kasuje** linków już ustawionych w CMS.

Żeby **skopiować linki z bazy do pliku** (jednorazowo lub po dodaniu filmów w adminie):

```bash
pnpm dev   # osobny terminal
pnpm sync:mockup-videos
```

## Edycja treści

Zmieniasz **`course.json`**, potem `pnpm seed:course` (bez `--reset`, jeśli nie chcesz kasować zgłoszeń uczniów).

Lekcje z `"hasVideo": false` — bez wideo; seed wyczyści też URL w bazie.
