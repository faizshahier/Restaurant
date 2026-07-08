import type { Category } from '../types'

const mockCategories: Category[] = [
  { id: 'cat-starters', name: 'Starters', slug: 'starters', sortOrder: 1 },
  { id: 'cat-mains', name: 'Main Courses', slug: 'mains', sortOrder: 2 },
  { id: 'cat-desserts', name: 'Desserts', slug: 'desserts', sortOrder: 3 },
  { id: 'cat-drinks', name: 'Drinks', slug: 'drinks', sortOrder: 4 },
]

/**
 * Manages menu categories (e.g. Starters, Mains, Desserts).
 *
 * TODO(supabase): Back this service with a `categories` table.
 * - getAllCategories -> supabase.from('categories').select('*').order('sortOrder')
 * - getCategoryById  -> supabase.from('categories').select('*').eq('id', id).single()
 * - createCategory   -> supabase.from('categories').insert(data)
 * - updateCategory   -> supabase.from('categories').update(data).eq('id', id)
 * - deleteCategory   -> supabase.from('categories').delete().eq('id', id)
 */
export class CategoryService {
  static async getAllCategories(): Promise<Category[]> {
    // TODO(supabase): supabase.from('categories').select('*').order('sortOrder')
    return [...mockCategories].sort((a, b) => a.sortOrder - b.sortOrder)
  }

  static async getCategoryById(id: string): Promise<Category | null> {
    // TODO(supabase): supabase.from('categories').select('*').eq('id', id).single()
    return mockCategories.find((category) => category.id === id) ?? null
  }

  static async createCategory(data: Omit<Category, 'id'>): Promise<Category> {
    // TODO(supabase): supabase.from('categories').insert(data)
    const category: Category = { id: `cat-${crypto.randomUUID()}`, ...data }
    mockCategories.push(category)
    return category
  }

  static async updateCategory(id: string, data: Partial<Category>): Promise<Category | null> {
    // TODO(supabase): supabase.from('categories').update(data).eq('id', id)
    const index = mockCategories.findIndex((category) => category.id === id)
    if (index === -1) return null
    mockCategories[index] = { ...mockCategories[index], ...data }
    return mockCategories[index]
  }

  static async deleteCategory(id: string): Promise<void> {
    // TODO(supabase): supabase.from('categories').delete().eq('id', id)
    const index = mockCategories.findIndex((category) => category.id === id)
    if (index !== -1) mockCategories.splice(index, 1)
  }
}
