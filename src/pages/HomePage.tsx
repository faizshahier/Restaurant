import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/layout/Container'
import { FoodCard } from '../components/food/FoodCard'
import { CategoryService, FoodService } from '../services'
import type { Category, Food } from '../types'

const HIGHLIGHTS = [
  {
    title: 'Seasonal Ingredients',
    description: 'Menus change with the season, sourced from local growers and fisheries.',
  },
  {
    title: 'Warm, Unhurried Service',
    description: 'A room built for long dinners, good company, and no clock-watching.',
  },
  {
    title: 'Easy Ordering',
    description: 'Order online in under a minute, any day of the week.',
  },
]

const MAX_FEATURED_ITEMS = 3

export function HomePage() {
  const [featuredFoods, setFeaturedFoods] = useState<Food[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    FoodService.getAvailableItems().then((foods) => setFeaturedFoods(foods.slice(0, MAX_FEATURED_ITEMS)))
    CategoryService.getAllCategories().then(setCategories)
  }, [])

  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]))

  return (
    <>
      <section className="border-b border-charcoal-700">
        <Container>
          <div className="flex flex-col items-center gap-6 py-12 text-center sm:py-20">
            <h1 className="font-display text-4xl font-semibold text-charcoal-50 sm:text-5xl lg:text-6xl">
              A Warm Table, Always Waiting
            </h1>
            <p className="max-w-2xl text-base text-charcoal-100 sm:text-lg">
              Seasonal dishes, thoughtful service, and a room built for good company. Explore the menu or
              order online for delivery and pickup.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/menu"
                className="rounded-md bg-primary-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-primary-300"
              >
                View Menu
              </Link>
              <Link
                to="/order"
                className="rounded-md border border-charcoal-700 px-6 py-3 text-sm font-semibold text-charcoal-50 transition-colors hover:border-primary-300 hover:text-primary-300"
              >
                Order Now
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {featuredFoods.length > 0 && (
        <Container>
          <h2 className="font-display text-2xl text-charcoal-50 sm:text-3xl">Featured Dishes</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredFoods.map((food) => (
              <FoodCard key={food.id} food={food} categoryName={categoryNameById.get(food.category_id)} />
            ))}
          </div>
        </Container>
      )}

      <section className="border-y border-charcoal-700 bg-charcoal-800">
        <Container>
          <div className="grid gap-8 sm:grid-cols-3">
            {HIGHLIGHTS.map((highlight) => (
              <div key={highlight.title}>
                <h3 className="font-display text-lg text-primary-200">{highlight.title}</h3>
                <p className="mt-2 text-sm text-charcoal-100">{highlight.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-charcoal-700">
        <Container>
          <div className="flex flex-col items-center gap-4 py-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h2 className="font-display text-2xl text-charcoal-50">Hungry?</h2>
              <p className="mt-1 text-charcoal-100">
                Order online for delivery or pickup, any day of the week.
              </p>
            </div>
            <Link
              to="/order"
              className="shrink-0 rounded-md bg-primary-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-primary-300"
            >
              Order Now
            </Link>
          </div>
        </Container>
      </section>

      <Container>
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <h2 className="font-display text-2xl text-charcoal-50">Our Story</h2>
          <p className="max-w-2xl text-charcoal-100">
            What started as a single family table has grown into a neighborhood favorite, without losing the
            things that mattered from day one: honest food and a genuine welcome.
          </p>
          <Link to="/about" className="text-primary-300 hover:underline">
            Learn more about us
          </Link>
        </div>
      </Container>
    </>
  )
}
