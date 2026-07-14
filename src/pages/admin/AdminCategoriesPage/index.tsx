import { useState } from 'react'
import { Container } from '../../../components/layout/Container'
import { useAdminCrud } from '../../../hooks/useAdminCrud'
import { CategoryService, FoodService } from '../../../services'
import { createCategorySchema, type CreateCategoryInput } from '../../../validation/schemas'
import type { Category } from '../../../types'
import { CategoryForm } from './CategoryForm'
import { CategoryList } from './CategoryList'

const emptyForm: CreateCategoryInput = { name: '' }

export function AdminCategoriesPage() {
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const crud = useAdminCrud<Category, CreateCategoryInput>({
    emptyForm,
    schema: createCategorySchema,
    list: CategoryService.getAllCategories,
    create: CategoryService.createCategory,
    update: CategoryService.updateCategory,
    toFormState: (category) => ({ name: category.name }),
    getId: (category) => category.id,
  })

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
    await crud.refresh()
  }

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Categories</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">Manage the categories dishes are grouped under.</p>

      <CategoryForm
        form={crud.form}
        errors={crud.errors}
        editingId={crud.editingId}
        isSubmitting={crud.isSubmitting}
        onChange={crud.updateField}
        onSubmit={crud.handleSubmit}
        onCancel={crud.cancelEdit}
      />

      {deleteError && <p className="mt-4 text-sm text-red-400">{deleteError}</p>}

      {crud.isLoading ? (
        <p className="mt-10 text-charcoal-100">Loading categories…</p>
      ) : (
        <CategoryList
          categories={crud.items}
          onEdit={crud.startEdit}
          onDelete={(c) => void deleteCategory(c)}
        />
      )}
    </Container>
  )
}
