import type { GalleryImage } from '../types'

const mockGalleryImages: GalleryImage[] = []

/**
 * Manages the photo gallery shown on the public site.
 *
 * TODO(supabase): Back this service with a `gallery_images` table
 * (and store the actual files via StorageService / Supabase Storage).
 * - getAllImages   -> supabase.from('gallery_images').select('*').order('sortOrder')
 * - addImage       -> supabase.from('gallery_images').insert(data)
 * - removeImage    -> supabase.from('gallery_images').delete().eq('id', id)
 * - reorderImages  -> supabase.from('gallery_images').upsert(orderedUpdates)
 */
export class GalleryService {
  static async getAllImages(): Promise<GalleryImage[]> {
    // TODO(supabase): supabase.from('gallery_images').select('*').order('sortOrder')
    return [...mockGalleryImages].sort((a, b) => a.sortOrder - b.sortOrder)
  }

  static async addImage(data: Omit<GalleryImage, 'id'>): Promise<GalleryImage> {
    // TODO(supabase): supabase.from('gallery_images').insert(data)
    const image: GalleryImage = { id: `img-${crypto.randomUUID()}`, ...data }
    mockGalleryImages.push(image)
    return image
  }

  static async removeImage(id: string): Promise<void> {
    // TODO(supabase): supabase.from('gallery_images').delete().eq('id', id)
    const index = mockGalleryImages.findIndex((image) => image.id === id)
    if (index !== -1) mockGalleryImages.splice(index, 1)
  }

  static async reorderImages(orderedIds: string[]): Promise<GalleryImage[]> {
    // TODO(supabase): supabase.from('gallery_images').upsert(orderedIds.map((id, sortOrder) => ({ id, sortOrder })))
    orderedIds.forEach((id, sortOrder) => {
      const image = mockGalleryImages.find((item) => item.id === id)
      if (image) image.sortOrder = sortOrder
    })
    return GalleryService.getAllImages()
  }
}
