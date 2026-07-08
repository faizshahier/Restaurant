export interface AppUser {
  id: string
  email: string
  displayName: string
  role: 'admin' | 'staff' | 'customer'
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  sortOrder: number
}

export interface MenuItem {
  id: string
  categoryId: string
  name: string
  description: string
  price: number
  imageUrl: string
  isAvailable: boolean
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Reservation {
  id: string
  customerName: string
  email: string
  phone: string
  partySize: number
  date: string
  time: string
  status: ReservationStatus
  notes?: string
}

export interface GalleryImage {
  id: string
  url: string
  caption: string
  sortOrder: number
}

export interface RestaurantSettings {
  id: string
  restaurantName: string
  address: string
  phone: string
  email: string
  openingHours: Record<string, string>
}
