import { supabase } from '../lib/supabaseClient'
import { toAppError } from '../lib/errors'
import type { GalleryImage } from '../types'

export interface CreateGalleryRow {
  image_url: string
  title: string
}

/** Data-access layer for the `gallery` table. */
export class GalleryRepository {
  static async findAll(): Promise<GalleryImage[]> {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw toAppError(error)
    return data
  }

  static async findById(id: string): Promise<GalleryImage | null> {
    const { data, error } = await supabase.from('gallery').select('*').eq('id', id).maybeSingle()
    if (error) throw toAppError(error)
    return data
  }

  static async create(data: CreateGalleryRow): Promise<GalleryImage> {
    const { data: created, error } = await supabase.from('gallery').insert(data).select().single()
    if (error) throw toAppError(error)
    return created
  }

  static async update(id: string, data: Partial<CreateGalleryRow>): Promise<GalleryImage | null> {
    const { data: updated, error } = await supabase
      .from('gallery')
      .update(data)
      .eq('id', id)
      .select()
      .maybeSingle()
    if (error) throw toAppError(error)
    return updated
  }

  static async remove(id: string): Promise<void> {
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) throw toAppError(error)
  }
}
