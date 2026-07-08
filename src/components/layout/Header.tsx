import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { SettingsService } from '../../services'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/reservations', label: 'Reservations' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `transition-colors hover:text-brand-300 ${isActive ? 'text-brand-300' : 'text-charcoal-50'}`

export function Header() {
  const [restaurantName, setRestaurantName] = useState('The Restaurant')
  const [logo, setLogo] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    SettingsService.getSettings().then((settings) => {
      setRestaurantName(settings.restaurant_name)
      setLogo(settings.logo)
    })
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal-700 bg-charcoal-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="flex items-center gap-2 font-display text-xl font-semibold tracking-wide text-brand-200"
        >
          {logo && <img src={logo} alt="" className="h-8 w-8 rounded-full object-cover" />}
          {restaurantName}
        </NavLink>

        <nav className="hidden gap-8 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={navLinkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>

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

      {isMenuOpen && (
        <nav className="flex flex-col gap-1 border-t border-charcoal-700 px-4 pb-4 text-sm font-medium md:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 ${isActive ? 'bg-charcoal-800 text-brand-300' : 'text-charcoal-50'}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
