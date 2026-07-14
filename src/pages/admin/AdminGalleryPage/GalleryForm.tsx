import type { FormEvent } from 'react'
import { Field, inputClasses } from '../../../components/form/Field'
import type { CreateGalleryInput } from '../../../validation/schemas'

type FormErrors = Partial<Record<keyof CreateGalleryInput, string>>

interface GalleryFormProps {
  form: CreateGalleryInput
  errors: FormErrors
  editingId: string | null
  isSubmitting: boolean
  onChange: <K extends keyof CreateGalleryInput>(field: K, value: CreateGalleryInput[K]) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export function GalleryForm({
  form,
  errors,
  editingId,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
}: GalleryFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 grid gap-4 rounded-lg border border-charcoal-700 bg-charcoal-800 p-6 sm:grid-cols-2"
      noValidate
    >
      <Field label="Title" error={errors.title}>
        <input
          type="text"
          value={form.title}
          onChange={(event) => onChange('title', event.target.value)}
          className={inputClasses}
        />
      </Field>

      <Field label="Image URL" error={errors.image_url}>
        <input
          type="text"
          value={form.image_url}
          onChange={(event) => onChange('image_url', event.target.value)}
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
            onClick={onCancel}
            className="text-sm font-medium text-charcoal-100 hover:text-primary-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
