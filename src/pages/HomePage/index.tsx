import { useEffect, useState } from 'react'
import { CategoryService, FoodService } from '../../services'
import type { Category, Food } from '../../types'
import { HeroSection } from './HeroSection'
import { FeaturedDishes } from './FeaturedDishes'
import { HighlightsSection } from './HighlightsSection'
import { CtaBanner } from './CtaBanner'
import { OurStorySection } from './OurStorySection'

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
      <HeroSection />
      <FeaturedDishes foods={featuredFoods} categoryNameById={categoryNameById} />
      <HighlightsSection />
      <CtaBanner />
      <OurStorySection />
    </>
  )
}
