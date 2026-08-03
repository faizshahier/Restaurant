import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useRestaurantBranding } from '../../hooks/useRestaurantBranding'
import { AuthSection } from './AuthSection'
import { BrandLogo } from './BrandLogo'
import { MobileNav } from './MobileNav'
import { OpenStatusBadge } from './OpenStatusBadge'
import { NAV_LINKS } from './navLinks'

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `transition-colors hover:text-primary-300 ${isActive ? 'text-primary-300' : 'text-charcoal-50'}`

/** Header for the public website. The admin dashboard uses AdminHeader instead. */
export function Header() {
  const { restaurantName, logo, isOpenNow } = useRestaurantBranding()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal-700 bg-charcoal-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <BrandLogo logo={logo} restaurantName={restaurantName} />
          <OpenStatusBadge isOpenNow={isOpenNow} />
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
