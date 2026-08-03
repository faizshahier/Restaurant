import { Link } from 'react-router-dom'
import { Container } from '../../components/layout/Container'
import type { Category } from '../../types'

interface CategoryStripProps {
  categories: Category[]
}

/**
 * A quick way into the menu straight from the home page. Renders nothing when the
 * categories haven't loaded (or failed), so the page never shows an empty shell.
 */
export function CategoryStrip({ categories }: CategoryStripProps) {
  if (categories.length === 0) return null

  return (
    <Container>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Explore</p>
        <h2 className="mt-1 font-display text-2xl text-charcoal-50 sm:text-3xl">Browse by Category</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-charcoal-100">
          Jump straight to what you're craving.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            to="/menu"
            className="rounded-full border border-charcoal-700 bg-charcoal-800 px-5 py-2.5 text-sm font-medium text-charcoal-100 transition-colors hover:border-primary-300 hover:text-primary-300"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </Container>
  )
}
