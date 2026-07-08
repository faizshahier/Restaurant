// Canonical types mirroring the Supabase-ready database schema.
// Column names intentionally use snake_case to match the future Postgres tables 1:1.

export type UserRole = 'Admin' | 'Customer'

export interface User {
  id: string
  name: string
  email: string
  // TODO(supabase): Supabase Auth owns credentials once wired up (see src/lib/supabaseClient.ts).
  // This field mirrors the schema's `password` column but must never hold a real plaintext
  // password outside of local mock data.
  password: string
  role: UserRole
  created_at: string
  updated_at: string
}

/** User shape safe to expose to the UI/API layer (never includes the password). */
export type PublicUser = Omit<User, 'password'>

export interface Category {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Food {
  id: string
  name: string
  description: string
  price: number
  image: string
  category_id: string
  available: boolean
  created_at: string
  updated_at: string
}

export type ReservationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'

export interface Reservation {
  id: string
  customer_name: string
  phone: string
  guests: number
  reservation_date: string
  reservation_time: string
  notes: string | null
  status: ReservationStatus
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  image_url: string
  title: string
  created_at: string
  updated_at: string
}

export interface SocialLinks {
  facebook?: string
  instagram?: string
  twitter?: string
  tiktok?: string
}

export interface Settings {
  // A real Postgres table needs a primary key even though the schema only lists these
  // columns; this models a single-row settings table.
  id: string
  restaurant_name: string
  logo: string
  phone: string
  email: string
  address: string
  opening_hours: Record<string, string>
  social_links: SocialLinks
}
