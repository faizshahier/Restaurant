import { z } from 'zod'

// Validation schemas for data entering the services layer. Services run these
// before writing through a repository, mirroring the checks a real Supabase
// setup would additionally enforce via Postgres constraints / RLS policies.

export const userRoleSchema = z.enum(['Admin', 'Customer', 'restaurant_manager'])

// Admin-facing profile update (via UserService). There's no createUserSchema: new
// `users` rows are provisioned exclusively by the handle_new_user() trigger on
// auth.users, never by a direct client-side insert (see UserRepository).
export const updateUserSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').optional(),
  email: z.email('Enter a valid email address').optional(),
  role: userRoleSchema.optional(),
  phone_number: z.string().trim().min(1).nullable().optional(),
})
export type UpdateUserInput = z.infer<typeof updateUserSchema>

// Public-facing auth schemas. Kept separate from updateUserSchema (which is for
// admin user-management via UserService) since self-registration should never
// let a caller set their own `role`.
export const signUpSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export type SignUpInput = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})
export type SignInInput = z.infer<typeof signInSchema>

// The 6-digit code Supabase emails after sign-up when "Confirm email" is enabled.
export const verifyEmailOtpSchema = z.object({
  email: z.email('Enter a valid email address'),
  token: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit code from your email'),
})
export type VerifyEmailOtpInput = z.infer<typeof verifyEmailOtpSchema>

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
  discount_percentage: z.number().min(0).max(100).default(0),
  image: z.string().trim().min(1, 'Image is required'),
  category_id: z.string().trim().min(1, 'Category is required'),
  available: z.boolean().default(true),
})
export type CreateFoodInput = z.infer<typeof createFoodSchema>

export const updateFoodSchema = createFoodSchema.partial()
export type UpdateFoodInput = z.infer<typeof updateFoodSchema>

export const orderStatusSchema = z.enum(['Pending', 'Preparing', 'Shipped', 'Cancelled'])

export const orderItemSchema = z.object({
  food_id: z.string().trim().min(1),
  food_name: z.string().trim().min(1),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  price: z.number().nonnegative(),
})

export const createOrderSchema = z.object({
  customer_name: z.string().trim().min(1, 'Name is required'),
  phone: z.string().trim().min(1, 'Phone number is required'),
  items: z.array(orderItemSchema).min(1, 'Select at least one item'),
  notes: z.string().trim().nullable().optional(),
})
export type CreateOrderInput = z.infer<typeof createOrderSchema>

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
})
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>

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
  delivery_zone: z.string().trim().min(1).optional(),
  opening_hours: z.record(z.string(), z.string()).optional(),
  social_links: socialLinksSchema.optional(),
})
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>
