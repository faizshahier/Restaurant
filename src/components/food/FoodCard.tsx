import { formatPrice, getDiscountedPrice } from '../../lib/format'
import type { Food } from '../../types'

interface FoodCardProps {
  food: Food
  categoryName?: string
}

export function FoodCard({ food, categoryName }: FoodCardProps) {
  const hasDiscount = food.discount_percentage > 0
  const discountedPrice = getDiscountedPrice(food.price, food.discount_percentage)

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-charcoal-700 bg-charcoal-800">
      <div className="flex h-40 items-center justify-center bg-charcoal-700 text-xs text-charcoal-400">
        {food.image ? (
          <img src={food.image} alt={food.name} className="h-full w-full object-cover" />
        ) : (
          <span>Photo coming soon</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {categoryName && (
          <span className="text-xs font-medium uppercase tracking-wide text-brand-300">{categoryName}</span>
        )}
        <h3 className="font-display text-lg text-charcoal-50">{food.name}</h3>
        <p className="flex-1 text-sm text-charcoal-100">{food.description}</p>
        {hasDiscount ? (
          <p className="flex items-center gap-2">
            <span className="text-sm text-charcoal-400 line-through">{formatPrice(food.price)}</span>
            <span className="font-medium text-brand-200">{formatPrice(discountedPrice)}</span>
            <span className="rounded-full bg-brand-400/20 px-2 py-0.5 text-xs font-medium text-brand-200">
              -{food.discount_percentage}%
            </span>
          </p>
        ) : (
          <p className="font-medium text-brand-200">{formatPrice(food.price)}</p>
        )}
      </div>
    </article>
  )
}
