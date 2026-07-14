// Canonical types mirroring the Supabase-ready database schema.
// Column names intentionally use snake_case to match the future Postgres tables 1:1.

// 'restaurant_manager' keeps its exact spec-mandated casing even though it differs from
// 'Admin'/'Customer' — the requirement was explicit that this value must be used verbatim.
export type UserRole = 'Admin' | 'Customer' | 'restaurant_manager'

export interface User {
  id: string
  name: string
  email: string
  // Only meaningful for restaurant_manager accounts; null for Admin/Customer.
  phone_number: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

// Historically this was `Omit<User, 'password'>` back when User carried a mock password
// field. Supabase Auth now owns credentials entirely in auth.users (see
// src/lib/supabaseClient.ts) — public.users never has a password column — so there's
// nothing left to omit. Kept as its own type so call sites that only ever want the
// safe-to-display shape don't need to change if that ever differs from User again.
export type PublicUser = User

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
  // Percentage off the listed price (0-100). 0 means no discount.
  discount_percentage: number
  image: string
  category_id: string
  available: boolean
  created_at: string
  updated_at: string
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Shipped' | 'Cancelled'

export interface OrderItem {
  food_id: string
  food_name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customer_name: string
  phone: string
  location: string
  items: OrderItem[]
  total: number
  notes: string | null
  status: OrderStatus
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
  // A defined delivery radius/description. A real geo-fenced delivery zone (polygon/radius on a
  // map) needs a mapping provider integration, which is out of scope for the mock data stage.
  delivery_zone: string
  opening_hours: Record<string, string>
  social_links: SocialLinks
}
