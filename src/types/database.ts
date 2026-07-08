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
