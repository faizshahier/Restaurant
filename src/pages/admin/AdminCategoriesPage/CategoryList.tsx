import type { Category } from '../../../types'

interface CategoryListProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  return (
    <ul className="mt-8 divide-y divide-charcoal-700 rounded-lg border border-charcoal-700">
      {categories.map((category) => (
        <li key={category.id} className="flex items-center justify-between px-4 py-3">
          <span className="text-charcoal-50">{category.name}</span>
          <div className="flex gap-3 text-sm">
            <button
              type="button"
              onClick={() => onEdit(category)}
              className="text-primary-300 hover:underline"
            >
              Edit
            </button>
            <button type="button" onClick={() => onDelete(category)} className="text-red-400 hover:underline">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
