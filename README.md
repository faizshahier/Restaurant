# Restaurant Website

A **production-ready, modular, and scalable restaurant website** built chapter by chapter and fully integrated with **Supabase** for authentication, database management, and file storage.

## Tech Stack

* **React 19 + TypeScript** — User interface development with strong type safety
* **Vite** — Development server and build tool
* **React Router 7** — Client-side routing
* **Tailwind CSS 4** — Utility-first, fully responsive styling
* **Zod** — Runtime validation at the service layer
* **ESLint + Prettier** — Code linting and formatting
* **@supabase/supabase-js** — The project's only backend, handling authentication, database operations, and storage with **no mock-data fallback**.

## Getting Started

```bash
npm install

npm run dev
# Start the development server (http://localhost:5173)

npm run build
# Build the production version

npm run preview
# Preview the production build

npm run lint
# Run ESLint

npm run format
# Format the codebase
```

## Supabase Setup

This project **requires a Supabase project** and does not provide any mock-data fallback.

The `src/lib/supabaseClient.ts` file immediately throws an error if the required environment variables are missing.

### Setup Steps

1. Create a new Supabase project.
2. Copy `.env.example` to `.env`.
3. Enter your project's URL and Anon Key.
4. Run `supabase/schema.sql` in the Supabase SQL Editor. This script automatically creates:

   * All database tables
   * Row-Level Security (RLS) policies
   * Triggers
   * PostgreSQL functions
   * Storage buckets
   * Initial settings
   * Sample data

## Project Structure

```text
src/

components/
    layout/
    form/
    auth/

context/

pages/

admin/

router/

services/

repositories/

validation/

lib/

types/
```

### Directory Overview

* **components** — Reusable UI components
* **layout** — Header, Footer, and shared layout components
* **form** — Shared form components
* **auth** — Route protection and authorization
* **context** — Authentication and global state management
* **pages** — Application pages
* **admin** — Administration panel
* **router** — React Router configuration
* **services** — Business logic layer
* **repositories** — Direct communication with Supabase
* **validation** — Zod validation schemas
* **lib** — Shared utilities and configuration
* **types** — TypeScript type definitions

## Restaurant Manager Role

The application is designed as a **single-tenant restaurant system**.

Therefore:

* There is **no `restaurants` table**.
* Object ownership (IDOR) protection is unnecessary in the current architecture.

If the project is expanded into a multi-restaurant platform in the future, it should introduce:

* A `restaurant_id` column
* Restaurant-based filtering in every repository
* Server-side ownership validation for all requests

## Project Architecture

The application follows a three-layer architecture.

### 1. Repository Layer

Responsible for communicating directly with Supabase.

Example:

```ts
supabase.from('foods').select('*')
```

### 2. Validation Layer

Uses **Zod** to validate data before it reaches the repositories.

### 3. Service Layer

Contains the application's business logic, including:

* Calculating order totals
* Applying discounts
* Checking menu item availability

## Services

* AuthService
* UserService
* FoodService
* CategoryService
* OrderService
* GalleryService
* SettingsService
* StorageService

## Design System

All application colors are centrally defined in:

```text
src/index.css
```

The design system includes:

* Primary color palette
* Secondary color palette
* Neutral colors
* Order status colors
* Availability status colors

## Final Features

The project includes:

* Full Supabase integration
* User registration and authentication
* 6-digit email OTP verification
* Role management (Admin, Customer, Restaurant Manager)
* Food ordering system
* Automatic order total calculation
* Food management
* Category management
* Order management
* Gallery management
* Restaurant settings management
* Image uploads using Supabase Storage
* Fully responsive design
* Three-layer architecture (Repository, Service, Validation)
* TypeScript and Zod integration
* Built with React 19, Vite, and Tailwind CSS 4
* No mock data; all data is read from and written directly to Supabase.

## Project Status

The project is **feature-complete**, meaning every feature defined in the original specification has been fully implemented. It is production-ready and follows a modular, scalable architecture suitable for real-world deployment.
# Restaurant
