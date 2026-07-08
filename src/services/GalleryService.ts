import { GalleryRepository } from '../repositories'
import {
  createGallerySchema,
  updateGallerySchema,
  type CreateGalleryInput,
  type UpdateGalleryInput,
} from '../validation/schemas'
import type { GalleryImage } from '../types'

/**
 * Manages the photo gallery shown on the public site.
 *
 * TODO(supabase): This service is transport-agnostic; once Supabase is wired up
 * only GalleryRepository needs to change. Store the actual files via
 * StorageService / Supabase Storage and keep `image_url` as the public URL.
 */
export class GalleryService {
  static async getAllImages(): Promise<GalleryImage[]> {
    return GalleryRepository.findAll()
  }

  static async addImage(input: CreateGalleryInput): Promise<GalleryImage> {
    const data = createGallerySchema.parse(input)
    return GalleryRepository.create(data)
  }

  static async updateImage(id: string, input: UpdateGalleryInput): Promise<GalleryImage | null> {
    const data = updateGallerySchema.parse(input)
    return GalleryRepository.update(id, data)
  }

  static async removeImage(id: string): Promise<void> {
    return GalleryRepository.remove(id)
  }
}
