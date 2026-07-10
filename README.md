# Restaurant Website

A production-quality, modular, and scalable restaurant website. Built chapter by chapter, fully
connected to Supabase (auth, database, storage — see "Supabase Setup" below).

## Tech Stack

- **React 19** + **TypeScript** — UI and type safety
- **Vite** — dev server and build tool
- **React Router 7** — client-side routing
- **Tailwind CSS 4** — utility-first styling, responsive by design
- **Zod** — runtime validation at the service boundary
- **ESLint** + **Prettier** — linting and formatting
- **@supabase/supabase-js** — the app's only backend. Auth, every repository, and file storage all
  query it directly; there is no mock-data fallback — see "Supabase Setup" below

## Getting Started

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # type-check and build for production
npm run preview   # preview the production build locally
npm run lint      # run ESLint
npm run format    # format the codebase with Prettier
```

## Supabase Setup

**A Supabase project is required** — there is no mock-data fallback. `src/lib/supabaseClient.ts`
throws immediately on startup if the env vars below aren't set, rather than degrading silently.

1. Create a project at [supabase.com](https://supabase.com) (or use an existing one).
2. Copy `.env.example` to `.env` and fill in your project's URL and anon key (Project Settings → API).
3. Open the Supabase SQL Editor and run [`supabase/schema.sql`](supabase/schema.sql) — one paste,
   creates every table, RLS policy, trigger, function, and storage bucket, plus a required `settings`
   row and optional sample menu/gallery data. It's idempotent, so re-run it any time the file changes
   (e.g. after pulling an update that added a new function or policy) — safe to run repeatedly.
4. Sign up through the app (or Supabase Studio → Authentication), then promote that account:
   ```sql
   update public.users set role = 'Admin' where email = 'you@example.com';
   ```
5. By default, Supabase projects require email confirmation before a session exists. For local
   development, either confirm via the email Supabase sends, or turn it off under Authentication →
   Providers → Email → "Confirm email" in the dashboard.

## Project Structure

```
src/
  components/
    layout/        # Header, Footer, Layout shell, shared page primitives
    form/           # Shared form primitives (Field, inputClasses)
    auth/           # Route guards (RequireRole)
  context/          # React context providers (AuthContext / useAuth)
  pages/            # One component per route
    admin/           # Admin/manager pages, gated by RequireRole
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

| Table         | Columns                                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `users`       | `id, name, email, phone_number, role (Admin \| Customer \| restaurant_manager), created_at, updated_at`                    |
| `categories`  | `id, name, created_at, updated_at`                                                                                         |
| `foods`       | `id, name, description, price, discount_percentage, image, category_id, available, created_at, updated_at`                 |
| `orders`      | `id, user_id, customer_name, phone, total, notes, status (Pending\|Preparing\|Shipped\|Cancelled), created_at, updated_at` |
| `order_items` | `id, order_id, food_id, food_name, quantity, price, created_at`                                                            |
| `gallery`     | `id, image_url, title, created_at, updated_at`                                                                             |
| `settings`    | `restaurant_name, logo, phone, email, address, delivery_zone, opening_hours, social_links` (single row)                    |

> `users` has no `password` column — Supabase Auth owns credentials entirely in `auth.users`
> (which the client never queries directly); `public.users` is profile data, kept in sync via the
> `handle_new_user()` trigger. `orders`/`order_items` are properly normalized (not a JSON column) —
> `OrderRepository.create()` calls the `create_order_with_items` Postgres function (in
> `supabase/schema.sql`) so both inserts commit as one atomic transaction.

### Restaurant manager role & single-tenant scope

`restaurant_manager` keeps its exact spec-mandated snake_case value even though it differs from the
`Admin`/`Customer` casing elsewhere — that value was an explicit requirement. There is deliberately
**no `restaurants` table and no IDOR/object-ownership checks**: the app models a single restaurant
(the existing singleton `settings` row), so there is nothing to enumerate or tamper across tenants.
If this ever becomes a multi-restaurant platform, every restaurant-scoped table would need a
`restaurant_id` column and every repository method would need to filter by the caller's
`restaurant_id`, validated server-side on every request — that's the point at which IDOR protection
becomes meaningful rather than dead code.

## Architecture: Repositories + Services + Validation

Data flows through three layers:

1. **Repositories** (`src/repositories/`) — one per table, each querying Supabase directly
   (`supabase.from('foods').select('*')`, etc.) via the client in `src/lib/supabaseClient.ts`.
   `UserRepository` has no `create()` — new rows there come exclusively from the
   `handle_new_user()` auth trigger, never a direct insert.
2. **Validation** (`src/validation/schemas.ts`) — Zod schemas that validate data before a repository
   writes it, mirroring the constraints RLS/Postgres additionally enforce server-side.
3. **Services** (`src/services/`) — the public API the UI calls. They validate input, delegate to a
   repository, and add business logic (e.g. `FoodService.getAvailableItems()` filters by
   `available`; `OrderService.createOrder()` computes `total` server-side, never trusting a
   client-supplied value).

| Service           | Repository           | Responsibility                                                                                          |
| ----------------- | -------------------- | ------------------------------------------------------------------------------------------------------- |
| `AuthService`     | `UserRepository`     | Sign in, sign up, sign out, current session                                                             |
| `UserService`     | `UserRepository`     | User profile records (password never exposed)                                                           |
| `FoodService`     | `FoodRepository`     | Menu items (dishes/drinks), including discounts                                                         |
| `CategoryService` | `CategoryRepository` | Menu categories                                                                                         |
| `OrderService`    | `OrderRepository`    | Food orders and status transitions (computes `total` server-side, never trusts a client-supplied total) |
| `GalleryService`  | `GalleryRepository`  | Photo gallery                                                                                           |
| `SettingsService` | `SettingsRepository` | Restaurant name, logo, contact info, delivery zone, hours                                               |
| `StorageService`  | —                    | File uploads (menu photos, gallery images)                                                              |

## Design System: Color Tokens

All color is defined once, in `src/index.css`, as Tailwind v4 `@theme` CSS variables — no hex codes
scattered through components. Tailwind auto-generates `bg-*`/`text-*`/`border-*` utilities (and their
opacity modifiers, e.g. `bg-status-pending/20`) for every token below.

| Category                     | Tokens                                                                     | Use                                                          |
| ---------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Brand — Primary**          | `primary-50` … `primary-900` (warm orange/red)                             | Primary actions — buttons, links, headline accents           |
| **Brand — Secondary**        | `secondary-50` … `secondary-900` (herb green)                              | Fresh/positive accents that shouldn't compete with primary   |
| **Neutral / Surface**        | `charcoal-50` … `charcoal-900`                                             | Backgrounds, borders, body text — the dark UI's base palette |
| **Status — Order lifecycle** | `status-pending`, `status-preparing`, `status-shipped`, `status-cancelled` | One color per `OrderStatus`, for order badges                |
| **Status — Availability**    | `available`, `out-of-stock`                                                | A dish's stock status or the restaurant's open/closed state  |

`status-cancelled` and `out-of-stock` both alias `charcoal-400` (muted/inactive), and `available`
aliases `secondary-400` (fresh = available) — composed from existing tokens rather than new raw hex
values, so a future palette change only touches one line.

**Usage in components** (see `FoodCard.tsx`, `AdminOrdersPage.tsx`, `Header.tsx` for real examples):

```tsx
// A primary action button
<button className="bg-primary-400 text-charcoal-900 hover:bg-primary-300">Place Order</button>

// A status badge — soft background at 20% opacity, solid text
<span className={`rounded-full px-2 py-1 text-xs ${
  order.status === 'Shipped' ? 'bg-status-shipped/20 text-status-shipped' : '...'
}`}>
  {order.status}
</span>

// An availability badge
<span className={food.available ? 'bg-available/20 text-available' : 'bg-out-of-stock/20 text-out-of-stock'}>
  {food.available ? 'Available' : 'Hidden'}
</span>
```

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
- [x] **Chapter 5 — Gallery Page**: responsive photo grid (2/3/4 columns across mobile, tablet,
      desktop) pulling from `GalleryService.getAllImages()`, with seeded sample gallery mock data
      and a placeholder tile for entries without a photo yet.
- [x] **Chapter 6 — About & Contact Pages**: both driven entirely by `SettingsService` (no new
      schema entity). About adds a story section, a values grid, and a full weekly hours listing.
      Contact adds clickable phone/email links, the full weekly hours, social links (hidden when
      none are set), and a map placeholder.
- [x] **Chapter 7 — Authentication**: Sign In and Sign Up pages validated with new `signInSchema` /
      `signUpSchema` Zod schemas and wired to `AuthService`. Added an `AuthContext` (`useAuth` hook)
      providing global session state, and updated the Header to show a `Sign In` link when logged
      out or the user's name and a `Sign Out` button when logged in (both desktop and mobile nav).
      Extracted the shared `Field`/`inputClasses` form primitives out of the Reservations page into
      `src/components/form/Field.tsx` for reuse across all three forms.
- [x] **Chapter 8 — Admin Dashboard (Reservations)**: `RequireAdmin` route guard (redirects
      unauthenticated visitors to sign-in, shows an access-denied message for signed-in non-admins),
      and an `/admin/reservations` page with status filter pills and Approve/Reject/Cancel actions
      wired to `ReservationService`. Seeded a demo admin login (`admin@example.com` /
      `AdminPass123!`, mock data only) and two sample reservations for testing. The Header shows an
      `Admin` link for `Admin`-role users. Foods/Categories admin management is left for a future
      chapter.
- [x] **Chapter 9 — Admin Dashboard (Foods & Categories)**: added `/admin/foods` (create/edit form,
      availability toggle, delete, all wired to `FoodService`/`CategoryService`) and
      `/admin/categories` (create/edit/delete, with a guard that blocks deleting a category still
      used by a food item). Introduced `AdminLayout` with a shared tab nav (Reservations / Foods /
      Categories) now that there are three admin pages, and nested all `/admin/*` routes under a
      single `RequireAdmin` instead of gating each page individually.

  **Bug fix while building this chapter:** `CategoryRepository.findAll`, `FoodRepository.findAll`,
  `GalleryRepository.findAll`, and `UserRepository.findAll` returned the same in-memory array
  reference on every call. Since React's `useState` setter bails out of re-rendering when given a
  value that's referentially identical (`Object.is`) to the current state, refreshing a list after
  an update/create/delete silently failed to re-render even though the underlying data had changed
  — first caught as the Foods availability toggle not visibly updating. Fixed by returning a shallow
  copy (`[...mockX]`) from each `findAll`, matching how a real Supabase query always returns a fresh
  array. `ReservationRepository.findAll` was unaffected since it already used `.filter()`.

- [x] **Chapter 10 — Restaurant Manager Panel**: added the `restaurant_manager` role (plus
      `phone_number` on `users`) and a role-aware `RequireRole` guard (replacing `RequireAdmin`).
      `AdminLayout`'s tabs are now filtered by role — a manager sees Orders/Foods/Analytics, an
      admin additionally sees Categories, and `/admin/categories` is independently gated so a
      manager can't reach it by URL even with the tab hidden. Seeded a demo manager login
      (`manager@example.com` / `ManagerPass123!`, mock data only, alongside the existing admin
      account).

  **Reservations → Orders.** Per explicit direction, the dine-in reservation system was replaced
  (not extended) by a food-order system with the new `Pending → Preparing → Shipped/Cancelled`
  status flow: `Order`/`OrderStatus`/`OrderItem` types, `OrderRepository`, `OrderService` (computes
  `total` server-side from `items`, never trusting a client-supplied total), the public `/order`
  page (quantity picker over available foods instead of a date/guests booking form), and
  `/admin/orders` (status filter pills + Start Preparing/Mark Shipped/Cancel actions). Chapters 4
  and 8 above describe the reservation system as it existed before this change.

  **Also added:** `discount_percentage` on `foods` (shown as a struck-through price + badge on
  `FoodCard`, editable in `/admin/foods`), `delivery_zone` on `settings` (shown on the Contact
  page), and a computed real-time Open/Closed badge in the Header (`src/lib/hours.ts`, derived from
  `opening_hours` — never persisted).

  **Scope note:** no `restaurants` table or IDOR/ownership checks were added — see "Restaurant
  manager role & single-tenant scope" above for why, and what changes if this becomes multi-tenant.

- [x] **Design System — Centralized Color Tokens**: renamed the ad-hoc `brand-*` scale to `primary-*`,
      added a `secondary-*` (herb green) brand scale, and introduced named `status-*`/availability
      tokens (see "Design System: Color Tokens" above) so order-status and availability badges no
      longer hardcode raw Tailwind palette colors (`yellow-400`, `green-300`, etc.).
- [x] **Supabase Project Setup**: installed `@supabase/supabase-js` and implemented
      `src/lib/supabaseClient.ts` (warns and falls back to mock data if env vars are missing, rather
      than crashing). Added `.env.example` / `.gitignore` coverage for real credentials, and
      `supabase/schema.sql` — a complete, idempotent, copy-paste-ready script covering every table,
      foreign key, RLS policy, and trigger described in "Database Schema" above, including a
      `users` table linked 1:1 to `auth.users` (auto-created via trigger on sign-up, no password
      column), and a role-escalation guard so a non-admin can't grant themselves a higher role.
      Repositories are not yet wired to query it — that's the next step, one repository at a time.
- [x] **Schema correction — `profiles` → `users`**: re-analyzed the repository/service layer against
      the SQL and found every `TODO(supabase)` comment already says `supabase.from('users')`, never
      `profiles` — the app's own code had already settled on that name. Renamed the table (and every
      FK, RLS policy, and helper function referencing it) to match, rather than impose the generic
      Supabase-convention name over the project's existing naming.
- [x] **Full Supabase wiring**: every repository, `AuthService`, and `StorageService` now query the
      real Supabase project — no mock-data fallback remains anywhere. Specifically:
  - `AuthService` uses real `supabase.auth.signUp/signInWithPassword/signOut/getUser`;
    `AuthContext` subscribes to `onAuthStateChange` instead of polling once on load.
  - `UserRepository`'s `create()` was removed (not stubbed) — `public.users` has no INSERT policy
    for any client role by design, since rows are only ever created by the `handle_new_user()`
    trigger. `User`/`PublicUser` lost the mock-only `password` field to match.
  - `CategoryRepository`, `FoodRepository`, `GalleryRepository`, `SettingsRepository` are thin
    `supabase.from(table)` wrappers.
  - `OrderRepository.create()` calls a new `create_order_with_items` Postgres function (added to
    `schema.sql`) instead of two sequential `insert` calls, so the order and its line items commit
    atomically — a mid-request failure can no longer leave an order with no items.
  - `StorageService` uses real `supabase.storage`; `schema.sql` now also creates the `menu-photos`
    and `gallery-images` buckets with public-read/staff-write policies. No page has a file-upload
    UI yet, so this is wired but unused.
  - **The demo admin/manager credentials from Chapters 8 and 10 no longer work** — they were only
    ever rows in the old mock `UserRepository`, never real Supabase Auth accounts. Sign up through
    the app and promote via SQL instead (see "Supabase Setup" above).
  - **Verified live** against the real project: Home/Menu/Gallery/Contact render real seeded data
    (including the `discount_percentage` badge on Margherita Pizza); sign-up round-trips to real
    Supabase Auth (correctly blocked by email confirmation, a project setting, not a bug). Order
    placement is wired but fails until `schema.sql` is re-run in the SQL Editor to pick up the new
    `create_order_with_items` function — the script is idempotent, so re-running it is safe.
- [x] **Chapter 11 — Closing: Gallery & Settings Admin (final chapter)**: the last two entities with
      full-CRUD services but no admin UI. `/admin/gallery` (add/edit/delete photos, reusing the
      `FoodCard`-style photo tile pattern from the public Gallery page) and `/admin/settings` (one
      form covering restaurant info, all 7 days of opening hours, and social links, wired to
      `SettingsService.updateSettings()`). Both gated Admin-only in `AdminLayout` and the router,
      matching Categories. This completes admin coverage for every entity in the schema: Orders,
      Foods, Categories, Gallery, Settings, plus Analytics.

Each chapter is completed, documented, and committed before the next one begins. The project is now
feature-complete against the original schema: every table has a public-facing view where relevant, a
service/repository pair wired to real Supabase, and admin management where the spec called for it.
