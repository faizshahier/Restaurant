import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useRestaurantBranding } from '../../hooks/useRestaurantBranding'
import { BrandLogo } from './BrandLogo'
import { OpenStatusBadge } from './OpenStatusBadge'
import { visibleAdminLinks } from './adminNavLinks'

const tabClasses = ({ isActive }: { isActive: boolean }) =>
  `shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? 'border-primary-300 bg-primary-400 text-charcoal-900'
      : 'border-charcoal-700 text-charcoal-100 hover:border-primary-300 hover:text-primary-300'
  }`

/**
 * The admin dashboard header. Deliberately carries none of the public site's
 * navigation — the dashboard is its own space.
 *
 * Row 1: logo, open/closed status, greeting, sign out.
 * Row 2: the admin sections, which are now the dashboard's main navigation.
 */
export function AdminHeader() {
  const { user, signOut } = useAuth()
  const { restaurantName, logo, isOpenNow } = useRestaurantBranding()
  const links = visibleAdminLinks(user?.role)

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal-700 bg-charcoal-900/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-3">
          {/* The logo returns to the dashboard home, not the public site, so the
              admin stays inside the dashboard while working. */}
          <Link to="/admin" className="flex items-center gap-3">
            <BrandLogo logo={logo} restaurantName={restaurantName} />
            <OpenStatusBadge isOpenNow={isOpenNow} />
          </Link>

          <div className="flex items-center gap-3 text-sm">
            {user && (
              <span className="hidden text-charcoal-100 sm:inline">
                Hi, {user.name.split(' ')[0]}
              </span>
            )}
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-md border border-charcoal-700 px-3 py-1.5 font-medium text-primary-300 transition-colors hover:border-primary-300"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Main dashboard navigation. Scrolls sideways on small screens and wraps
            on larger ones, so all sections stay reachable without a hamburger. */}
        <nav
          aria-label="Admin sections"
          className="flex gap-2 overflow-x-auto pb-3 sm:flex-wrap sm:overflow-x-visible"
        >
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={tabClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
