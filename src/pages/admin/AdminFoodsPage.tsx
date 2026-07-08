import { useEffect, useState, type FormEvent } from 'react'
import { Container } from '../../components/layout/Container'
import { Field, inputClasses } from '../../components/form/Field'
import { formatPrice } from '../../lib/format'
import { CategoryService, FoodService } from '../../services'
import { createFoodSchema, type CreateFoodInput } from '../../validation/schemas'
import type { Category, Food } from '../../types'

const emptyForm: CreateFoodInput = {
  name: '',
  description: '',
  price: 0,
  discount_percentage: 0,
  image: '',
  category_id: '',
  available: true,
}

type FormErrors = Partial<Record<keyof CreateFoodInput, string>>

export function AdminFoodsPage() {
  const [foods, setFoods] = useState<Food[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<CreateFoodInput>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([FoodService.getAllItems(), CategoryService.getAllCategories()]).then(
      ([allFoods, allCategories]) => {
        setFoods(allFoods)
        setCategories(allCategories)
        setIsLoading(false)
      },
    )
  }, [])

  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]))

  function updateField<K extends keyof CreateFoodInput>(field: K, value: CreateFoodInput[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function startEdit(food: Food) {
    setEditingId(food.id)
    setForm({
      name: food.name,
      description: food.description,
      price: food.price,
      discount_percentage: food.discount_percentage,
      image: food.image,
      category_id: food.category_id,
      available: food.available,
    })
    setErrors({})
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
  }

  async function refreshFoods() {
    const allFoods = await FoodService.getAllItems()
    setFoods(allFoods)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = createFoodSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateFoodInput
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      if (editingId) {
        await FoodService.updateItem(editingId, result.data)
      } else {
        await FoodService.createItem(result.data)
      }
      await refreshFoods()
      cancelEdit()
    } finally {
      setIsSubmitting(false)
    }
  }

  async function toggleAvailability(food: Food) {
    await FoodService.updateItem(food.id, { available: !food.available })
    await refreshFoods()
  }

  async function deleteFood(id: string) {
    await FoodService.deleteItem(id)
    await refreshFoods()
  }

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Foods</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">Manage the dishes shown on the public menu.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-4 rounded-lg border border-charcoal-700 bg-charcoal-800 p-6 sm:grid-cols-2"
        noValidate
      >
        <Field label="Name" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            className={inputClasses}
          />
        </Field>

        <Field label="Category" error={errors.category_id}>
          <select
            value={form.category_id}
            onChange={(event) => updateField('category_id', event.target.value)}
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
            onChange={(event) => updateField('price', Number(event.target.value))}
            className={inputClasses}
          />
        </Field>

        <Field label="Discount %" error={errors.discount_percentage}>
          <input
            type="number"
            min={0}
            max={100}
            value={form.discount_percentage}
            onChange={(event) => updateField('discount_percentage', Number(event.target.value))}
            className={inputClasses}
          />
        </Field>

        <Field label="Image URL" error={errors.image}>
          <input
            type="text"
            value={form.image}
            onChange={(event) => updateField('image', event.target.value)}
            className={inputClasses}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Description" error={errors.description}>
            <textarea
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              rows={2}
              className={inputClasses}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm text-charcoal-100">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(event) => updateField('available', event.target.checked)}
          />
          Available on the public menu
        </label>

        <div className="flex items-end gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-brand-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving…' : editingId ? 'Save Changes' : 'Add Food'}
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

      {isLoading ? (
        <p className="mt-10 text-charcoal-100">Loading foods…</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg border border-charcoal-700">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-charcoal-800 text-charcoal-100">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium">Available</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-700">
              {foods.map((food) => (
                <tr key={food.id}>
                  <td className="px-4 py-3 text-charcoal-50">{food.name}</td>
                  <td className="px-4 py-3 text-charcoal-100">
                    {categoryNameById.get(food.category_id) ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-charcoal-100">{formatPrice(food.price)}</td>
                  <td className="px-4 py-3 text-charcoal-100">
                    {food.discount_percentage > 0 ? `${food.discount_percentage}%` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void toggleAvailability(food)}
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        food.available
                          ? 'bg-green-400/20 text-green-300'
                          : 'bg-charcoal-700 text-charcoal-100'
                      }`}
                    >
                      {food.available ? 'Available' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(food)}
                        className="text-brand-300 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteFood(food.id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  )
}
