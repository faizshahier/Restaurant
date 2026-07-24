import { useEffect, useState } from 'react'
import { Container } from '../../../components/layout/Container'
import { useAdminCrud } from '../../../hooks/useAdminCrud'
import { CategoryService, FoodService } from '../../../services'
import { createFoodSchema, type CreateFoodInput } from '../../../validation/schemas'
import type { Category, Food } from '../../../types'
import { FoodForm } from './FoodForm'
import { FoodTable } from './FoodTable'

const emptyForm: CreateFoodInput = {
  name: '',
  description: '',
  price: 0,
  discount_percentage: 0,
  image: '',
  category_id: '',
  available: true,
}

function toFormState(food: Food): CreateFoodInput {
  return {
    name: food.name,
    description: food.description,
    price: food.price,
    discount_percentage: food.discount_percentage,
    image: food.image,
    category_id: food.category_id,
    available: food.available,
  }
}

export function AdminFoodsPage() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    CategoryService.getAllCategories()
      .then(setCategories)
      .catch((err: unknown) => console.error('Failed to load categories', err))
  }, [])

  const crud = useAdminCrud<Food, CreateFoodInput>({
    emptyForm,
    schema: createFoodSchema,
    list: FoodService.getAllItems,
    create: FoodService.createItem,
    update: FoodService.updateItem,
    toFormState,
    getId: (food) => food.id,
  })

  async function toggleAvailability(food: Food) {
    await FoodService.updateItem(food.id, { available: !food.available })
    await crud.refresh()
  }

  async function deleteFood(id: string) {
    await FoodService.deleteItem(id)
    await crud.refresh()
  }

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Foods</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">Manage the dishes shown on the public menu.</p>

      <FoodForm
        form={crud.form}
        errors={crud.errors}
        categories={categories}
        editingId={crud.editingId}
        isSubmitting={crud.isSubmitting}
        onChange={crud.updateField}
        onSubmit={crud.handleSubmit}
        onCancel={crud.cancelEdit}
      />

      {crud.isLoading ? (
        <p className="mt-10 text-charcoal-100">Loading foods…</p>
      ) : (
        <FoodTable
          foods={crud.items}
          categories={categories}
          onEdit={crud.startEdit}
          onToggleAvailability={(food) => void toggleAvailability(food)}
          onDelete={(id) => void deleteFood(id)}
        />
      )}
    </Container>
  )
}
