# Restaurant Website

A production-quality, modular, and scalable restaurant website. Built chapter by chapter, ready for
Supabase integration.

## Tech Stack

- **React 19** + **TypeScript** — UI and type safety
- **Vite** — dev server and build tool
- **React Router 7** — client-side routing
- **Tailwind CSS 4** — utility-first styling, responsive by design
- **Zod** — runtime validation at the service boundary
- **ESLint** + **Prettier** — linting and formatting
- Repository + service layers designed for a future **Supabase** backend (auth, database, storage)

## Getting Started

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # type-check and build for production
npm run preview   # preview the production build locally
npm run lint      # run ESLint
npm run format    # format the codebase with Prettier
```

## Project Structure

```
src/
  components/
    layout/        # Header, Footer, Layout shell, shared page primitives
  pages/            # One component per route (placeholders until their chapter)
  router/           # React Router route definitions
  services/         # Business logic layer (see below)
  repositories/      # Data-access layer, one per table (see below)
  validation/        # Zod schemas for data entering the services layer
  lib/              # Shared clients/config (Supabase client lives here)
  types/            # Schema-accurate TypeScript types (src/types/database.ts)
```

## Database Schema

The app is modeled around a Supabase-ready Postgres schema. Types in `src/types/database.ts` mirror
the tables 1:1 (snake_case columns included) so no mapping layer is needed once Supabase is wired up.

| Table          | Columns                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `users`        | `id, name, email, password, role (Admin \| Customer), created_at, updated_at`                                                                          |
| `categories`   | `id, name, created_at, updated_at`                                                                                                                     |
| `foods`        | `id, name, description, price, image, category_id, available, created_at, updated_at`                                                                  |
| `reservations` | `id, customer_name, phone, guests, reservation_date, reservation_time, notes, status (Pending\|Approved\|Rejected\|Cancelled), created_at, updated_at` |
| `gallery`      | `id, image_url, title, created_at, updated_at`                                                                                                         |
| `settings`     | `restaurant_name, logo, phone, email, address, opening_hours, social_links` (single row)                                                               |

> `users.password` is part of the schema as given, but once Supabase Auth is wired up, credentials
> move to `supabase.auth.*` and this table becomes profile data only — see the `TODO(supabase)`
> comments in `AuthService` and `UserRepository`.

## Architecture: Repositories + Services + Validation

Data flows through three layers, each replaceable independently:

1. **Repositories** (`src/repositories/`) — one per table, holding the in-memory mock data today.
   Every method carries a `TODO(supabase)` comment with the exact Supabase call that replaces it
   (e.g. `supabase.from('foods').select('*')`).
2. **Validation** (`src/validation/schemas.ts`) — Zod schemas that validate data before it's written
   through a repository, mirroring the constraints a real Postgres schema/RLS policy would enforce.
3. **Services** (`src/services/`) — the public API the UI calls. They validate input, delegate to a
   repository, and add business logic (e.g. `FoodService.getAvailableItems()` filters by
   `available`). Nothing outside `src/services/` and `src/repositories/` should change when Supabase
   is finally connected.

| Service              | Repository              | Responsibility                                      |
| -------------------- | ----------------------- | --------------------------------------------------- |
| `AuthService`        | `UserRepository`        | Sign in, sign up, sign out, current session         |
| `UserService`        | `UserRepository`        | User profile records (password never exposed)       |
| `FoodService`        | `FoodRepository`        | Menu items (dishes/drinks)                          |
| `CategoryService`    | `CategoryRepository`    | Menu categories                                     |
| `ReservationService` | `ReservationRepository` | Table reservations and status transitions           |
| `GalleryService`     | `GalleryRepository`     | Photo gallery                                       |
| `SettingsService`    | `SettingsRepository`    | Restaurant name, logo, contact info, hours, socials |
| `StorageService`     | —                       | File uploads (menu photos, gallery images)          |

## Responsive Design

The layout is built mobile-first with Tailwind breakpoints:

- **Mobile** (`< 768px`): collapsed hamburger navigation
- **Tablet** (`>= 768px`) and **Desktop** (`>= 1024px`): full horizontal navigation

## Chapter Progress

- [x] **Chapter 1 — Foundation**: Vite + React + TypeScript scaffold, Tailwind CSS, ESLint/Prettier,
      responsive layout shell (Header/Footer/mobile nav), React Router skeleton with placeholder pages,
      and the 8 placeholder service classes.
- [x] **Database Schema Foundation**: adopted the Supabase-ready schema for `users`, `categories`,
      `foods`, `reservations`, `gallery`, and `settings`. Added a repository layer per table, Zod
      validation at the service boundary, and rewired every service and mock dataset to match.
- [x] **Chapter 2 — Home Page**: full landing page built on top of the service layer — hero with
      calls to action, a Featured Dishes section pulling live data from `FoodService` and
      `CategoryService`, a highlights section, a reservation call-to-action banner, and an about
      teaser.
- [x] **Chapter 3 — Menu Page**: full menu built on `FoodService.getAvailableItems()` and
      `CategoryService.getAllCategories()`, with category filter pills (All + one per category)
      and a responsive dish grid reusing the `FoodCard` component from Chapter 2.
- [x] **Chapter 4 — Reservations Page**: booking form (name, phone, guests, date, time, notes)
      validated client-side with the shared `createReservationSchema` Zod schema, submitted via
      `ReservationService.createReservation()`, with inline field errors and a confirmation screen
      showing the reservation's `Pending` status.
- [ ] Chapter 5 — TBD (awaiting approval to proceed)

Each chapter is completed, documented, and committed before the next one begins.
