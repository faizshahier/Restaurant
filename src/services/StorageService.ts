import { supabase } from '../lib/supabaseClient'

/**
 * Manages file uploads (menu photos, gallery images) via Supabase Storage.
 *
 * Buckets (`menu-photos`, `gallery-images`) and their storage.objects RLS policies
 * are created in supabase/schema.sql — public read, staff-only write.
 *
 * Note: no page currently calls this service. AdminFoodsPage/AdminCategoriesPage take
 * an image URL as plain text today; wiring a real file-picker to this service is a
 * follow-up UI change, not something this service needs to change for.
 */
export class StorageService {
  static async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    if (error) throw error
    const publicUrl = await StorageService.getPublicUrl(bucket, path)
    if (!publicUrl) throw new Error(`Uploaded ${path} but could not resolve its public URL.`)
    return publicUrl
  }

  static async getPublicUrl(bucket: string, path: string): Promise<string | null> {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl ?? null
  }

  static async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) throw error
  }
}
