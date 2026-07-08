import { useEffect, useState } from 'react'
import { Container } from '../components/layout/Container'
import { GalleryService } from '../services'
import type { GalleryImage } from '../types'

export function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    GalleryService.getAllImages().then((allImages) => {
      setImages(allImages)
      setIsLoading(false)
    })
  }, [])

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Gallery</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">A look at the room, the kitchen, and the food.</p>

      {isLoading ? (
        <p className="mt-10 text-charcoal-100">Loading gallery…</p>
      ) : images.length === 0 ? (
        <p className="mt-10 text-charcoal-100">No photos have been added yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <figure
              key={image.id}
              className="overflow-hidden rounded-lg border border-charcoal-700 bg-charcoal-800"
            >
              <div className="flex aspect-square items-center justify-center bg-charcoal-700 text-xs text-charcoal-400">
                {image.image_url ? (
                  <img src={image.image_url} alt={image.title} className="h-full w-full object-cover" />
                ) : (
                  <span>Photo coming soon</span>
                )}
              </div>
              <figcaption className="p-2 text-center text-sm text-charcoal-100">{image.title}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </Container>
  )
}
