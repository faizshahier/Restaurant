import type { GalleryImage } from '../types'

const now = new Date().toISOString()

const mockGalleryImages: GalleryImage[] = [
  { id: 'img-dining-room', image_url: '', title: 'The Dining Room', created_at: now, updated_at: now },
  { id: 'img-open-kitchen', image_url: '', title: 'Our Open Kitchen', created_at: now, updated_at: now },
  { id: 'img-patio', image_url: '', title: 'Evenings on the Patio', created_at: now, updated_at: now },
  { id: 'img-plated-dish', image_url: '', title: 'A Freshly Plated Dish', created_at: now, updated_at: now },
]

export interface CreateGalleryRow {
  image_url: string
  title: string
}

/**
 * Data-access layer for the `gallery` table.
 *
 * TODO(supabase): Replace the in-memory array with real queries
 * (and store the actual files via StorageService / Supabase Storage).
 * - findAll  -> supabase.from('gallery').select('*').order('created_at', { ascending: false })
 * - findById -> supabase.from('gallery').select('*').eq('id', id).single()
 * - create   -> supabase.from('gallery').insert(data).select().single()
 * - update   -> supabase.from('gallery').update(data).eq('id', id).select().single()
 * - remove   -> supabase.from('gallery').delete().eq('id', id)
 */
export class GalleryRepository {
  static async findAll(): Promise<GalleryImage[]> {
    // TODO(supabase): supabase.from('gallery').select('*').order('created_at', { ascending: false })
    // Return a copy — a real query never hands back the same array reference,
    // and callers rely on that for React state updates to be detected.
    return [...mockGalleryImages]
  }

  static async findById(id: string): Promise<GalleryImage | null> {
    // TODO(supabase): supabase.from('gallery').select('*').eq('id', id).single()
    return mockGalleryImages.find((image) => image.id === id) ?? null
  }

  static async create(data: CreateGalleryRow): Promise<GalleryImage> {
    // TODO(supabase): supabase.from('gallery').insert(data).select().single()
    const timestamp = new Date().toISOString()
    const image: GalleryImage = {
      id: `img-${crypto.randomUUID()}`,
      created_at: timestamp,
      updated_at: timestamp,
      ...data,
    }
    mockGalleryImages.push(image)
    return image
  }

  static async update(id: string, data: Partial<CreateGalleryRow>): Promise<GalleryImage | null> {
    // TODO(supabase): supabase.from('gallery').update(data).eq('id', id).select().single()
    const index = mockGalleryImages.findIndex((image) => image.id === id)
    if (index === -1) return null
    mockGalleryImages[index] = { ...mockGalleryImages[index], ...data, updated_at: new Date().toISOString() }
    return mockGalleryImages[index]
  }

  static async remove(id: string): Promise<void> {
    // TODO(supabase): supabase.from('gallery').delete().eq('id', id)
    const index = mockGalleryImages.findIndex((image) => image.id === id)
    if (index !== -1) mockGalleryImages.splice(index, 1)
  }
}
