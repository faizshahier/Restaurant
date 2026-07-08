# Restaurant Website

A production-quality, modular, and scalable restaurant website. Built chapter by chapter, ready for
Supabase integration.

## Tech Stack

- **React 19** + **TypeScript** — UI and type safety
- **Vite** — dev server and build tool
- **React Router 7** — client-side routing
- **Tailwind CSS 4** — utility-first styling, responsive by design
- **ESLint** + **Prettier** — linting and formatting
- Services layer designed for a future **Supabase** backend (auth, database, storage)

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
  services/         # Data-access layer (see below)
  lib/              # Shared clients/config (Supabase client lives here)
  types/            # Shared TypeScript domain types
```

## Services Layer

All data access goes through a service class in `src/services/`. Every service currently returns
in-memory mock data so the UI can be built chapter by chapter, and every method is marked with a
`TODO(supabase)` comment describing the exact Supabase call that will replace it once the project is
provisioned (see `src/lib/supabaseClient.ts` for setup steps).

| Service              | Responsibility                                |
| -------------------- | --------------------------------------------- |
| `AuthService`        | Sign in, sign up, sign out, current session   |
| `FoodService`        | Menu items (dishes/drinks)                    |
| `CategoryService`    | Menu categories                               |
| `ReservationService` | Table reservations                            |
| `GalleryService`     | Photo gallery                                 |
| `SettingsService`    | Restaurant name, address, contact info, hours |
| `UserService`        | User profile records                          |
| `StorageService`     | File uploads (menu photos, gallery images)    |

## Responsive Design

The layout is built mobile-first with Tailwind breakpoints:

- **Mobile** (`< 768px`): collapsed hamburger navigation
- **Tablet** (`>= 768px`) and **Desktop** (`>= 1024px`): full horizontal navigation

## Chapter Progress

- [x] **Chapter 1 — Foundation**: Vite + React + TypeScript scaffold, Tailwind CSS, ESLint/Prettier,
      responsive layout shell (Header/Footer/mobile nav), React Router skeleton with placeholder pages,
      and the 8 placeholder service classes.
- [ ] Chapter 2 — TBD (awaiting approval to proceed)

Each chapter is completed, documented, and committed before the next one begins.
