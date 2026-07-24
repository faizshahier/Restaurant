import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { isRestaurantOpenNow } from '../../lib/hours'
import { SettingsService } from '../../services'
import { AuthSection } from './AuthSection'
import { MobileNav } from './MobileNav'
import { NAV_LINKS } from './navLinks'

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `transition-colors hover:text-primary-300 ${isActive ? 'text-primary-300' : 'text-charcoal-50'}`

export function Header() {
  const [restaurantName, setRestaurantName] = useState('The Restaurant')
  const [logo, setLogo] = useState('')
  const [isOpenNow, setIsOpenNow] = useState<boolean | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // Keeps the default name and hides the open/closed badge if this fails,
    // rather than throwing an unhandled rejection on every page load.
    SettingsService.getSettings()
      .then((settings) => {
        setRestaurantName(settings.restaurant_name)
        setLogo(settings.logo)
        setIsOpenNow(isRestaurantOpenNow(settings.opening_hours))
      })
      .catch((err: unknown) => console.error('Failed to load settings', err))
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal-700 bg-charcoal-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="flex items-center gap-2 font-display text-xl font-semibold tracking-wide text-primary-200"
        >
          {logo && <img src={logo} alt="" className="h-8 w-8 rounded-full object-cover" />}
          {restaurantName}
          {isOpenNow !== null && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                isOpenNow ? 'bg-available/20 text-available' : 'bg-out-of-stock/20 text-out-of-stock'
              }`}
            >
              {isOpenNow ? 'Open Now' : 'Closed'}
            </span>
          )}
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex gap-8 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={navLinkClasses}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <AuthSection />
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-charcoal-700 text-charcoal-50 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="sr-only">Menu</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
            {isMenuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && <MobileNav onNavigate={() => setIsMenuOpen(false)} />}
    </header>
  )
}
