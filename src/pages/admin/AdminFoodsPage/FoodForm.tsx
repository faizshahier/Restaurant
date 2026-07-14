import type { FormEvent } from 'react'
import { Field, inputClasses } from '../../../components/form/Field'
import type { CreateFoodInput } from '../../../validation/schemas'
import type { Category } from '../../../types'

type FormErrors = Partial<Record<keyof CreateFoodInput, string>>

interface FoodFormProps {
  form: CreateFoodInput
  errors: FormErrors
  categories: Category[]
  editingId: string | null
  isSubmitting: boolean
  onChange: <K extends keyof CreateFoodInput>(field: K, value: CreateFoodInput[K]) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export function FoodForm({
  form,
  errors,
  categories,
  editingId,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
}: FoodFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 grid gap-4 rounded-lg border border-charcoal-700 bg-charcoal-800 p-6 sm:grid-cols-2"
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

      <Field label="Category" error={errors.category_id}>
        <select
          value={form.category_id}
          onChange={(event) => onChange('category_id', event.target.value)}
          className={inputClasses}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Price" error={errors.price}>
        <input
          type="number"
          step="0.01"
          min={0}
          value={form.price}
          onChange={(event) => onChange('price', Number(event.target.value))}
          className={inputClasses}
        />
      </Field>

      <Field label="Discount %" error={errors.discount_percentage}>
        <input
          type="number"
          min={0}
          max={100}
          value={form.discount_percentage}
          onChange={(event) => onChange('discount_percentage', Number(event.target.value))}
          className={inputClasses}
        />
      </Field>

      <Field label="Image URL" error={errors.image}>
        <input
          type="text"
          value={form.image}
          onChange={(event) => onChange('image', event.target.value)}
          className={inputClasses}
        />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Description" error={errors.description}>
          <textarea
            value={form.description}
            onChange={(event) => onChange('description', event.target.value)}
            rows={2}
            className={inputClasses}
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-charcoal-100">
        <input
          type="checkbox"
          checked={form.available}
          onChange={(event) => onChange('available', event.target.checked)}
        />
        Available on the public menu
      </label>

      <div className="flex items-end gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-primary-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving…' : editingId ? 'Save Changes' : 'Add Food'}
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
