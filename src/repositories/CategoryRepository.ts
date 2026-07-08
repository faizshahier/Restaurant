import type { Category } from '../types'

const now = new Date().toISOString()

const mockCategories: Category[] = [
  { id: 'cat-starters', name: 'Starters', created_at: now, updated_at: now },
  { id: 'cat-mains', name: 'Main Courses', created_at: now, updated_at: now },
  { id: 'cat-desserts', name: 'Desserts', created_at: now, updated_at: now },
  { id: 'cat-drinks', name: 'Drinks', created_at: now, updated_at: now },
]

export interface CreateCategoryRow {
  name: string
}

/**
 * Data-access layer for the `categories` table.
 *
 * TODO(supabase): Replace the in-memory array with real queries.
 * - findAll  -> supabase.from('categories').select('*').order('name')
 * - findById -> supabase.from('categories').select('*').eq('id', id).single()
 * - create   -> supabase.from('categories').insert(data).select().single()
 * - update   -> supabase.from('categories').update(data).eq('id', id).select().single()
 * - remove   -> supabase.from('categories').delete().eq('id', id)
 */
export class CategoryRepository {
  static async findAll(): Promise<Category[]> {
    // TODO(supabase): supabase.from('categories').select('*').order('name')
    // Return a copy — a real query never hands back the same array reference,
    // and callers rely on that for React state updates to be detected.
    return [...mockCategories]
  }

  static async findById(id: string): Promise<Category | null> {
    // TODO(supabase): supabase.from('categories').select('*').eq('id', id).single()
    return mockCategories.find((category) => category.id === id) ?? null
  }

  static async create(data: CreateCategoryRow): Promise<Category> {
    // TODO(supabase): supabase.from('categories').insert(data).select().single()
    const timestamp = new Date().toISOString()
    const category: Category = {
      id: `cat-${crypto.randomUUID()}`,
      created_at: timestamp,
      updated_at: timestamp,
      ...data,
    }
    mockCategories.push(category)
    return category
  }

  static async update(id: string, data: Partial<CreateCategoryRow>): Promise<Category | null> {
    // TODO(supabase): supabase.from('categories').update(data).eq('id', id).select().single()
    const index = mockCategories.findIndex((category) => category.id === id)
    if (index === -1) return null
    mockCategories[index] = { ...mockCategories[index], ...data, updated_at: new Date().toISOString() }
    return mockCategories[index]
  }

  static async remove(id: string): Promise<void> {
    // TODO(supabase): supabase.from('categories').delete().eq('id', id)
    const index = mockCategories.findIndex((category) => category.id === id)
    if (index !== -1) mockCategories.splice(index, 1)
  }
}
