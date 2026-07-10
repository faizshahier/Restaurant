import { useEffect, useState, type FormEvent } from 'react'
import { Container } from '../../components/layout/Container'
import { Field, inputClasses } from '../../components/form/Field'
import { GalleryService } from '../../services'
import { createGallerySchema, type CreateGalleryInput } from '../../validation/schemas'
import type { GalleryImage } from '../../types'

const emptyForm: CreateGalleryInput = { image_url: '', title: '' }

type FormErrors = Partial<Record<keyof CreateGalleryInput, string>>

export function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [form, setForm] = useState<CreateGalleryInput>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    GalleryService.getAllImages().then((allImages) => {
      setImages(allImages)
      setIsLoading(false)
    })
  }, [])

  async function refreshImages() {
    const allImages = await GalleryService.getAllImages()
    setImages(allImages)
  }

  function updateField<K extends keyof CreateGalleryInput>(field: K, value: CreateGalleryInput[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function startEdit(image: GalleryImage) {
    setEditingId(image.id)
    setForm({ image_url: image.image_url, title: image.title })
    setErrors({})
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = createGallerySchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateGalleryInput
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      if (editingId) {
        await GalleryService.updateImage(editingId, result.data)
      } else {
        await GalleryService.addImage(result.data)
      }
      await refreshImages()
      cancelEdit()
    } finally {
      setIsSubmitting(false)
    }
  }

  async function deleteImage(id: string) {
    await GalleryService.removeImage(id)
    await refreshImages()
  }

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Gallery</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">Manage the photos shown on the public gallery page.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-4 rounded-lg border border-charcoal-700 bg-charcoal-800 p-6 sm:grid-cols-2"
        noValidate
      >
        <Field label="Title" error={errors.title}>
          <input
            type="text"
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            className={inputClasses}
          />
        </Field>

        <Field label="Image URL" error={errors.image_url}>
          <input
            type="text"
            value={form.image_url}
            onChange={(event) => updateField('image_url', event.target.value)}
            className={inputClasses}
          />
        </Field>

        <div className="flex items-end gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-primary-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-primary-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving…' : editingId ? 'Save Changes' : 'Add Photo'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm font-medium text-charcoal-100 hover:text-primary-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

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
              <div className="flex justify-center gap-3 pb-3 text-sm">
                <button
                  type="button"
                  onClick={() => startEdit(image)}
                  className="text-primary-300 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void deleteImage(image.id)}
                  className="text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </figure>
          ))}
        </div>
      )}
    </Container>
  )
}
