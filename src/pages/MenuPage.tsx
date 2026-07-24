import { useEffect, useMemo, useState } from 'react'
import { Container } from '../components/layout/Container'
import { FoodCard } from '../components/food/FoodCard'
import { CategoryService, FoodService } from '../services'
import type { Category, Food } from '../types'

const ALL_CATEGORIES = 'all'

function pillClasses(active: boolean) {
  return `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
    active
      ? 'border-primary-300 bg-primary-400 text-charcoal-900'
      : 'border-charcoal-700 text-charcoal-100 hover:border-primary-300 hover:text-primary-300'
  }`
}

export function MenuPage() {
  const [foods, setFoods] = useState<Food[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(ALL_CATEGORIES)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([FoodService.getAvailableItems(), CategoryService.getAllCategories()])
      .then(([availableFoods, allCategories]) => {
        setFoods(availableFoods)
        setCategories(allCategories)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        // Without this the page sits on "Loading menu…" forever whenever the
        // request fails (offline, bad Supabase config, project unreachable).
        console.error('Failed to load menu', err)
        setError("We couldn't load the menu. Please check your connection and try again.")
        setIsLoading(false)
      })
  }, [])

  const categoryNameById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  )

  const visibleFoods = useMemo(
    () =>
      selectedCategoryId === ALL_CATEGORIES
        ? foods
        : foods.filter((food) => food.category_id === selectedCategoryId),
    [foods, selectedCategoryId],
  )

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Menu</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">
        Everything below is made to order with seasonal ingredients.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategoryId(ALL_CATEGORIES)}
          className={pillClasses(selectedCategoryId === ALL_CATEGORIES)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategoryId(category.id)}
            className={pillClasses(selectedCategoryId === category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-10 text-charcoal-100">Loading menu…</p>
      ) : error ? (
        <p className="mt-10 text-red-400">{error}</p>
      ) : visibleFoods.length === 0 ? (
        <p className="mt-10 text-charcoal-100">No dishes in this category yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleFoods.map((food) => (
            <FoodCard key={food.id} food={food} categoryName={categoryNameById.get(food.category_id)} />
          ))}
        </div>
      )}
    </Container>
  )
}
