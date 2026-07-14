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
      <h2 className="font-display text-2xl text-charcoal-50 sm:text-3xl">Featured Dishes</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} categoryName={categoryNameById.get(food.category_id)} />
        ))}
      </div>
    </Container>
  )
}
