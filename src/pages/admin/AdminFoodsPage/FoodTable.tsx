import { formatPrice } from '../../../lib/format'
import type { Category, Food } from '../../../types'

interface FoodTableProps {
  foods: Food[]
  categories: Category[]
  onEdit: (food: Food) => void
  onToggleAvailability: (food: Food) => void
  onDelete: (id: string) => void
}

export function FoodTable({ foods, categories, onEdit, onToggleAvailability, onDelete }: FoodTableProps) {
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]))

  return (
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
              <td className="px-4 py-3 text-charcoal-100">{categoryNameById.get(food.category_id) ?? '—'}</td>
              <td className="px-4 py-3 text-charcoal-100">{formatPrice(food.price)}</td>
              <td className="px-4 py-3 text-charcoal-100">
                {food.discount_percentage > 0 ? `${food.discount_percentage}%` : '—'}
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onToggleAvailability(food)}
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    food.available ? 'bg-available/20 text-available' : 'bg-out-of-stock/20 text-out-of-stock'
                  }`}
                >
                  {food.available ? 'Available' : 'Hidden'}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(food)}
                    className="text-primary-300 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(food.id)}
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
  )
}
