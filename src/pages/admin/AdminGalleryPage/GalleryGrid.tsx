import type { GalleryImage } from '../../../types'

interface GalleryGridProps {
  images: GalleryImage[]
  onEdit: (image: GalleryImage) => void
  onDelete: (id: string) => void
}

export function GalleryGrid({ images, onEdit, onDelete }: GalleryGridProps) {
  if (images.length === 0) {
    return <p className="mt-10 text-charcoal-100">No photos have been added yet.</p>
  }

  return (
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
          <div className="flex justify-center gap-3 pb-3 text-sm">
            <button type="button" onClick={() => onEdit(image)} className="text-primary-300 hover:underline">
              Edit
            </button>
            <button type="button" onClick={() => onDelete(image.id)} className="text-red-400 hover:underline">
              Delete
            </button>
          </div>
        </figure>
      ))}
    </div>
  )
}
