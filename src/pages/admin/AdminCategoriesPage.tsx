import { useEffect, useState, type FormEvent } from 'react'
import { Container } from '../../components/layout/Container'
import { Field, inputClasses } from '../../components/form/Field'
import { CategoryService, FoodService } from '../../services'
import { createCategorySchema, type CreateCategoryInput } from '../../validation/schemas'
import type { Category } from '../../types'

const emptyForm: CreateCategoryInput = { name: '' }

type FormErrors = Partial<Record<keyof CreateCategoryInput, string>>

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<CreateCategoryInput>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    CategoryService.getAllCategories().then((allCategories) => {
      setCategories(allCategories)
      setIsLoading(false)
    })
  }, [])

  async function refreshCategories() {
    const allCategories = await CategoryService.getAllCategories()
    setCategories(allCategories)
  }

  function startEdit(category: Category) {
    setEditingId(category.id)
    setForm({ name: category.name })
    setErrors({})
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = createCategorySchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateCategoryInput
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      if (editingId) {
        await CategoryService.updateCategory(editingId, result.data)
      } else {
        await CategoryService.createCategory(result.data)
      }
      await refreshCategories()
      cancelEdit()
    } finally {
      setIsSubmitting(false)
    }
  }

  async function deleteCategory(category: Category) {
    setDeleteError(null)
    const itemsInCategory = await FoodService.getItemsByCategory(category.id)
    if (itemsInCategory.length > 0) {
      setDeleteError(
        `Cannot delete "${category.name}" — ${itemsInCategory.length} food item(s) still use it.`,
      )
      return
    }
    await CategoryService.deleteCategory(category.id)
    await refreshCategories()
  }

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Categories</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">Manage the categories dishes are grouped under.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex max-w-md flex-col gap-4 rounded-lg border border-charcoal-700 bg-charcoal-800 p-6"
        noValidate
      >
        <Field label="Name" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm({ name: event.target.value })}
            className={inputClasses}
          />
        </Field>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-brand-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving…' : editingId ? 'Save Changes' : 'Add Category'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm font-medium text-charcoal-100 hover:text-brand-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {deleteError && <p className="mt-4 text-sm text-red-400">{deleteError}</p>}

      {isLoading ? (
        <p className="mt-10 text-charcoal-100">Loading categories…</p>
      ) : (
        <ul className="mt-8 divide-y divide-charcoal-700 rounded-lg border border-charcoal-700">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between px-4 py-3">
              <span className="text-charcoal-50">{category.name}</span>
              <div className="flex gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => startEdit(category)}
                  className="text-brand-300 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void deleteCategory(category)}
                  className="text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Container>
  )
}
