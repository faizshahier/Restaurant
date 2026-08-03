import { useMemo, useState } from 'react'
import { formatPrice, getDiscountedPrice } from '../../lib/format'
import type { Category, Food } from '../../types'

interface MenuSelectorProps {
  foods: Food[]
  categories: Category[]
  quantities: Record<string, number>
  isLoading: boolean
  itemsError?: string
  onQuantityChange: (foodId: string, quantity: number) => void
}

const ALL = 'all'

/** Grey placeholder cards shown while dishes load, so the page never looks empty. */
function SkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-charcoal-700 bg-charcoal-800">
          <div className="h-32 rounded-t-xl bg-charcoal-700" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-3/4 rounded bg-charcoal-700" />
            <div className="h-4 w-1/3 rounded bg-charcoal-700" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function MenuSelector({
  foods,
  categories,
  quantities,
  isLoading,
  itemsError,
  onQuantityChange,
}: MenuSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL)

  // Only show pills for categories that actually have dishes, so no filter can
  // lead to an empty grid.
  const usedCategories = useMemo(() => {
    const ids = new Set(foods.map((f) => f.category_id))
    return categories.filter((c) => ids.has(c.id))
  }, [foods, categories])

  const visibleFoods = useMemo(
    () => (activeCategory === ALL ? foods : foods.filter((f) => f.category_id === activeCategory)),
    [foods, activeCategory],
  )

  if (isLoading) return <SkeletonGrid />

  return (
    <div>
      {usedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(ALL)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === ALL
                ? 'border-primary-300 bg-primary-400 text-charcoal-900'
                : 'border-charcoal-700 text-charcoal-100 hover:border-primary-300 hover:text-primary-300'
            }`}
          >
            All
          </button>
          {usedCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'border-primary-300 bg-primary-400 text-charcoal-900'
                  : 'border-charcoal-700 text-charcoal-100 hover:border-primary-300 hover:text-primary-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleFoods.map((food) => {
          const quantity = quantities[food.id] ?? 0
          const isSelected = quantity > 0
          const price = getDiscountedPrice(food.price, food.discount_percentage)

          return (
            <div
              key={food.id}
              className={`overflow-hidden rounded-xl border bg-charcoal-800 transition-colors ${
                isSelected ? 'border-primary-400' : 'border-charcoal-700'
              }`}
            >
              {/* The photo and name form one large button, so a single tap adds the
                  dish — much easier than typing into a number field. */}
              <button
                type="button"
                onClick={() => onQuantityChange(food.id, quantity + 1)}
                className="block w-full text-left"
                aria-label={`Add one ${food.name}`}
              >
                <div className="relative h-32 bg-charcoal-700">
                  {food.image ? (
                    <img
                      src={food.image}
                      alt={food.name}
                      /* lazy + async decoding: off-screen photos don't delay first paint */
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-charcoal-400">
                      Photo coming soon
                    </div>
                  )}
                  {isSelected && (
                    <span className="absolute right-2 top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-primary-400 px-2 text-xs font-bold text-charcoal-900">
                      {quantity}
                    </span>
                  )}
                  {food.discount_percentage > 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-charcoal-900/85 px-2 py-0.5 text-xs font-medium text-primary-200">
                      -{food.discount_percentage}%
                    </span>
                  )}
                </div>
                <div className="px-4 pt-3">
                  <p className="font-medium text-charcoal-50">{food.name}</p>
                  <p className="mt-0.5 text-sm text-primary-200">{formatPrice(price)}</p>
                </div>
              </button>

              <div className="px-4 pb-4 pt-3">
                {isSelected ? (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onQuantityChange(food.id, quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-charcoal-700 text-lg text-charcoal-50 transition-colors hover:border-primary-300 hover:text-primary-300"
                      aria-label={`Remove one ${food.name}`}
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center font-medium text-charcoal-50">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => onQuantityChange(food.id, quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-charcoal-700 text-lg text-charcoal-50 transition-colors hover:border-primary-300 hover:text-primary-300"
                      aria-label={`Add one ${food.name}`}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onQuantityChange(food.id, 1)}
                    className="rounded-md bg-primary-400 px-4 py-2 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-primary-300"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {itemsError && <p className="mt-4 text-sm text-red-400">{itemsError}</p>}
    </div>
  )
}
