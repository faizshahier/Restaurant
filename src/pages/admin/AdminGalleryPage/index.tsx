import { Container } from '../../../components/layout/Container'
import { useAdminCrud } from '../../../hooks/useAdminCrud'
import { GalleryService } from '../../../services'
import { createGallerySchema, type CreateGalleryInput } from '../../../validation/schemas'
import type { GalleryImage } from '../../../types'
import { GalleryForm } from './GalleryForm'
import { GalleryGrid } from './GalleryGrid'

const emptyForm: CreateGalleryInput = { image_url: '', title: '' }

function toFormState(image: GalleryImage): CreateGalleryInput {
  return { image_url: image.image_url, title: image.title }
}

export function AdminGalleryPage() {
  const crud = useAdminCrud<GalleryImage, CreateGalleryInput>({
    emptyForm,
    schema: createGallerySchema,
    list: GalleryService.getAllImages,
    create: GalleryService.addImage,
    update: GalleryService.updateImage,
    toFormState,
    getId: (image) => image.id,
  })

  async function deleteImage(id: string) {
    await GalleryService.removeImage(id)
    await crud.refresh()
  }

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Gallery</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">Manage the photos shown on the public gallery page.</p>

      <GalleryForm
        form={crud.form}
        errors={crud.errors}
        editingId={crud.editingId}
        isSubmitting={crud.isSubmitting}
        onChange={crud.updateField}
        onSubmit={crud.handleSubmit}
        onCancel={crud.cancelEdit}
      />

      {crud.isLoading ? (
        <p className="mt-10 text-charcoal-100">Loading gallery…</p>
      ) : (
        <GalleryGrid images={crud.items} onEdit={crud.startEdit} onDelete={(id) => void deleteImage(id)} />
      )}
    </Container>
  )
}
