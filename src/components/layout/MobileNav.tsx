import { NavLink } from 'react-router-dom'
import { AuthSection } from './AuthSection'
import { NAV_LINKS } from './navLinks'

interface MobileNavProps {
  onNavigate: () => void
}

export function MobileNav({ onNavigate }: MobileNavProps) {
  return (
    <nav className="flex flex-col gap-1 border-t border-charcoal-700 px-4 pb-4 text-sm font-medium md:hidden">
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={({ isActive }) =>
            `rounded-md px-3 py-2 ${isActive ? 'bg-charcoal-800 text-primary-300' : 'text-charcoal-50'}`
          }
          onClick={onNavigate}
        >
          {link.label}
        </NavLink>
      ))}
      <div className="mt-2 border-t border-charcoal-700 px-3 pt-3">
        <AuthSection onNavigate={onNavigate} />
      </div>
    </nav>
  )
}
