import { supabase } from '../lib/supabaseClient'
import type { Category } from '../types'

export interface CreateCategoryRow {
  name: string
}

/** Data-access layer for the `categories` table. */
export class CategoryRepository {
  static async findAll(): Promise<Category[]> {
    const { data, error } = await supabase.from('categories').select('*').order('name')
    if (error) throw error
    return data
  }

  static async findById(id: string): Promise<Category | null> {
    const { data, error } = await supabase.from('categories').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data
  }

  static async create(data: CreateCategoryRow): Promise<Category> {
    const { data: created, error } = await supabase.from('categories').insert(data).select().single()
    if (error) throw error
    return created
  }

  static async update(id: string, data: Partial<CreateCategoryRow>): Promise<Category | null> {
    const { data: updated, error } = await supabase
      .from('categories')
      .update(data)
      .eq('id', id)
      .select()
      .maybeSingle()
    if (error) throw error
    return updated
  }

  static async remove(id: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
  }
}
