import { NavLink, Outlet } from 'react-router-dom'
import { Container } from './Container'

const ADMIN_LINKS = [
  { to: '/admin/reservations', label: 'Reservations' },
  { to: '/admin/foods', label: 'Foods' },
  { to: '/admin/categories', label: 'Categories' },
]

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? 'border-brand-300 bg-brand-400 text-charcoal-900'
      : 'border-charcoal-700 text-charcoal-100 hover:border-brand-300 hover:text-brand-300'
  }`

export function AdminLayout() {
  return (
    <div>
      <Container>
        <div className="flex flex-wrap gap-2 border-b border-charcoal-700 pb-6">
          {ADMIN_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}
        </div>
      </Container>
      <Outlet />
    </div>
  )
}
