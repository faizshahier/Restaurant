import { Link } from 'react-router-dom'
import { Container } from '../../components/layout/Container'
import { FoodCard } from '../../components/food/FoodCard'
import type { Food } from '../../types'

interface FeaturedDishesProps {
  foods: Food[]
  categoryNameById: Map<string, string>
}

export function FeaturedDishes({ foods, categoryNameById }: FeaturedDishesProps) {
  if (foods.length === 0) return null

  return (
    <Container>
      {/* Heading and the "view full menu" link share one row, so the section has a
          clear next step instead of leaving the visitor with nowhere to go. */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Picked for you</p>
          <h2 className="mt-1 font-display text-2xl text-charcoal-50 sm:text-3xl">Featured Dishes</h2>
        </div>
        <Link
          to="/menu"
          className="text-sm font-medium text-primary-300 transition-colors hover:text-primary-200"
        >
          View full menu →
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} categoryName={categoryNameById.get(food.category_id)} />
        ))}
      </div>
    </Container>
  )
}
