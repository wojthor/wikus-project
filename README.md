# Unschool Your English – wikus-project

Platforma Wiktor Szyszkowski: landing, sprzedaż kursu, CMS i e-learning.

## Szybki start

```bash
pnpm install
cp .env.local   # skopiuj i uzupełnij zmienne (patrz RAPORT.md)
pnpm dev
```

- Strona: [http://localhost:3000](http://localhost:3000)
- E-learning: [http://localhost:3000/elearning](http://localhost:3000/elearning)
- Admin CMS: [http://localhost:3000/admin](http://localhost:3000/admin)

## Dokumentacja

Pełny opis architektury, API, env, przepływów płatności i e-learningu:

**→ [RAPORT.md](./RAPORT.md)**

## Skrypty

| Polecenie | Opis |
|-----------|------|
| `pnpm dev` | Serwer deweloperski |
| `pnpm build` | Build produkcyjny |
| `pnpm clear:media` | Czyści pliki audio w Payload |
| `pnpm stripe:listen` | Webhook Stripe na localhost (dev) |
| `pnpm generate:importmap` | Po zmianach komponentów w adminie |

Manager pakietów: **pnpm** (`pnpm-lock.yaml`).
