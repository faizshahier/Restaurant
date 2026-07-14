import { inputClasses } from '../../components/form/Field'
import { formatPrice, getDiscountedPrice } from '../../lib/format'
import type { Food } from '../../types'

interface MenuSelectorProps {
  foods: Food[]
  quantities: Record<string, number>
  itemsError?: string
  onQuantityChange: (foodId: string, quantity: number) => void
}

export function MenuSelector({ foods, quantities, itemsError, onQuantityChange }: MenuSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      {foods.map((food) => (
        <div
          key={food.id}
          className="flex items-center justify-between gap-4 rounded-lg border border-charcoal-700 bg-charcoal-800 p-4"
        >
          <div>
            <p className="font-medium text-charcoal-50">{food.name}</p>
            <p className="text-sm text-charcoal-100">
              {formatPrice(getDiscountedPrice(food.price, food.discount_percentage))}
            </p>
          </div>
          <input
            type="number"
            min={0}
            value={quantities[food.id] ?? 0}
            onChange={(event) => onQuantityChange(food.id, Number(event.target.value))}
            className={`${inputClasses} w-20 text-center`}
          />
        </div>
      ))}
      {itemsError && <p className="text-sm text-red-400">{itemsError}</p>}
    </div>
  )
}
