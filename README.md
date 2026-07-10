# Dom z Piernika

Strona wizytówka domku wakacyjnego w Szczawnie-Zdroju, połączona z przewodnikiem po okolicy (restauracje, atrakcje, zamki, szlaki, wycieczki).

## Stack

- [Astro](https://astro.build) (SSR) + adapter Vercel
- [Upstash Redis](https://upstash.com) (REST) — przechowuje edytowalne dane (link do rezerwacji, kontakt, notatki w przewodniku)
- 5 języków: PL, EN, DE, CS, FR

## Konfiguracja

1. Skopiuj `.env.example` do `.env` i uzupełnij:
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — dane z darmowej bazy na [upstash.com](https://upstash.com) (Redis → REST API)
   - `ADMIN_PASSWORD` — hasło do panelu `/admin`
   - `ADMIN_SESSION_SECRET` — losowy długi ciąg (np. `openssl rand -hex 32`)
2. `npm install`
3. `npm run dev` — uruchamia stronę na `http://localhost:4321`

Bez skonfigurowanego Upstash strona działa i pokazuje domyślne dane z `src/data/house.ts` (bez możliwości edycji w panelu).

## Struktura treści

- `src/data/house.ts` — fakty o domu (adres, udogodnienia, link do Booking.com domyślny)
- `src/data/guide/categories.ts` — 10 kategorii przewodnika
- `src/data/guide/pois.ts` — ~90 miejsc: odległości, linki do map/stron, zdjęcia (dane niezależne od języka)
- `src/i18n/locales/*.ts` — teksty UI i opis domu w każdym języku
- `src/i18n/guide/*.ts` — opisy miejsc w przewodniku w każdym języku (klucz = `id` z `pois.ts`)
- `src/views/*.astro` — układ stron (wspólny dla wszystkich języków)
- `src/pages/{lang}/...` — cienkie strony per język

### Dodawanie zdjęcia do miejsca w przewodniku

1. Wrzuć plik do `public/images/guide/`.
2. W `src/data/guide/pois.ts` dopisz `image: '/images/guide/nazwa-pliku.jpg'` do wybranego miejsca.

### Dodawanie/zmiana zdjęć domu

Wrzuć plik do `public/images/house/` i dopisz go w `src/data/photos.ts`.

## Panel administratora

`/admin` — logowanie hasłem (`ADMIN_PASSWORD`), sesja w podpisanym ciasteczku.
`/admin/dashboard`:
- link do rezerwacji (Booking.com) i e-mail kontaktowy — zapisuje się w Redis, widoczne od razu na stronie,
- notatka „godziny / ceny” dla każdego miejsca w przewodniku — nadpisuje domyślny tekst (przydatne, gdy coś się zmieni sezonowo).

## Wdrożenie na Vercel

1. Wypchnij repo na GitHub i zaimportuj w Vercel.
2. Ustaw zmienne środowiskowe (jak w `.env`) w ustawieniach projektu Vercel.
3. Zaktualizuj domenę w `astro.config.mjs` (`site`) i `public/robots.txt`, jeśli inna niż `domekzpiernika.com`.

## SEO

- Każdy język ma własny URL (`/pl/`, `/en/`, …), `hreflang` i `canonical`.
- Dane strukturalne JSON-LD: `LodgingBusiness`, `CollectionPage`, `ItemList`, `BreadcrumbList`.
- `sitemap-index.xml` generowany automatycznie (z wykluczeniem `/admin`).
