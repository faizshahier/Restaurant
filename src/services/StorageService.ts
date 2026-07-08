const mockFileUrls = new Map<string, string>()

/**
 * Manages file uploads (menu photos, gallery images, avatars).
 *
 * TODO(supabase): Back this service with Supabase Storage.
 * - uploadFile     -> supabase.storage.from(bucket).upload(path, file)
 * - getPublicUrl   -> supabase.storage.from(bucket).getPublicUrl(path)
 * - deleteFile     -> supabase.storage.from(bucket).remove([path])
 */
export class StorageService {
  static async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    // TODO(supabase): supabase.storage.from(bucket).upload(path, file)
    const objectUrl = URL.createObjectURL(file)
    mockFileUrls.set(`${bucket}/${path}`, objectUrl)
    return objectUrl
  }

  static async getPublicUrl(bucket: string, path: string): Promise<string | null> {
    // TODO(supabase): supabase.storage.from(bucket).getPublicUrl(path)
    return mockFileUrls.get(`${bucket}/${path}`) ?? null
  }

  static async deleteFile(bucket: string, path: string): Promise<void> {
    // TODO(supabase): supabase.storage.from(bucket).remove([path])
    mockFileUrls.delete(`${bucket}/${path}`)
  }
}
