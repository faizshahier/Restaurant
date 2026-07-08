import { z } from 'zod'

// Validation schemas for data entering the services layer. Services run these
// before writing through a repository, mirroring the checks a real Supabase
// setup would additionally enforce via Postgres constraints / RLS policies.

export const userRoleSchema = z.enum(['Admin', 'Customer'])

export const createUserSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: userRoleSchema.default('Customer'),
})
export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateUserSchema = createUserSchema.partial()
export type UpdateUserInput = z.infer<typeof updateUserSchema>

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Category name is required'),
})
export type CreateCategoryInput = z.infer<typeof createCategorySchema>

export const updateCategorySchema = createCategorySchema.partial()
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>

export const createFoodSchema = z.object({
  name: z.string().trim().min(1, 'Food name is required'),
  description: z.string().trim().min(1, 'Description is required'),
  price: z.number().positive('Price must be greater than zero'),
  image: z.string().trim().min(1, 'Image is required'),
  category_id: z.string().trim().min(1, 'Category is required'),
  available: z.boolean().default(true),
})
export type CreateFoodInput = z.infer<typeof createFoodSchema>

export const updateFoodSchema = createFoodSchema.partial()
export type UpdateFoodInput = z.infer<typeof updateFoodSchema>

export const reservationStatusSchema = z.enum(['Pending', 'Approved', 'Rejected', 'Cancelled'])

export const createReservationSchema = z.object({
  customer_name: z.string().trim().min(1, 'Name is required'),
  phone: z.string().trim().min(1, 'Phone number is required'),
  guests: z.number().int().positive('Party size must be at least 1'),
  reservation_date: z.string().trim().min(1, 'Date is required'),
  reservation_time: z.string().trim().min(1, 'Time is required'),
  notes: z.string().trim().nullable().optional(),
})
export type CreateReservationInput = z.infer<typeof createReservationSchema>

export const updateReservationStatusSchema = z.object({
  status: reservationStatusSchema,
})
export type UpdateReservationStatusInput = z.infer<typeof updateReservationStatusSchema>

export const createGallerySchema = z.object({
  image_url: z.string().trim().min(1, 'Image URL is required'),
  title: z.string().trim().min(1, 'Title is required'),
})
export type CreateGalleryInput = z.infer<typeof createGallerySchema>

export const updateGallerySchema = createGallerySchema.partial()
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>

export const socialLinksSchema = z.object({
  facebook: z.url().optional(),
  instagram: z.url().optional(),
  twitter: z.url().optional(),
  tiktok: z.url().optional(),
})

export const updateSettingsSchema = z.object({
  restaurant_name: z.string().trim().min(1).optional(),
  logo: z.string().trim().min(1).optional(),
  phone: z.string().trim().min(1).optional(),
  email: z.email().optional(),
  address: z.string().trim().min(1).optional(),
  opening_hours: z.record(z.string(), z.string()).optional(),
  social_links: socialLinksSchema.optional(),
})
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>
