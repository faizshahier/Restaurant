import type { FormEvent } from 'react'
import { Field, inputClasses } from '../../../components/form/Field'
import type { CreateCategoryInput } from '../../../validation/schemas'

type FormErrors = Partial<Record<keyof CreateCategoryInput, string>>

interface CategoryFormProps {
  form: CreateCategoryInput
  errors: FormErrors
  editingId: string | null
  isSubmitting: boolean
  onChange: <K extends keyof CreateCategoryInput>(field: K, value: CreateCategoryInput[K]) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export function CategoryForm({
  form,
  errors,
  editingId,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 flex max-w-md flex-col gap-4 rounded-lg border border-charcoal-700 bg-charcoal-800 p-6"
      noValidate
    >
      <Field label="Name" error={errors.name}>
        <input
          type="text"
          value={form.name}
          onChange={(event) => onChange('name', event.target.value)}
          className={inputClasses}
        />
      </Field>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-primary-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving…' : editingId ? 'Save Changes' : 'Add Category'}
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
