import { NavLink, Outlet } from 'react-router-dom'
import { Container } from './Container'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types'

interface AdminLink {
  to: string
  label: string
  roles: UserRole[]
}

const ADMIN_LINKS: AdminLink[] = [
  { to: '/admin/orders', label: 'Orders', roles: ['Admin', 'restaurant_manager'] },
  { to: '/admin/foods', label: 'Foods', roles: ['Admin', 'restaurant_manager'] },
  { to: '/admin/analytics', label: 'Analytics', roles: ['Admin', 'restaurant_manager'] },
  { to: '/admin/categories', label: 'Categories', roles: ['Admin'] },
  { to: '/admin/gallery', label: 'Gallery', roles: ['Admin'] },
  { to: '/admin/settings', label: 'Settings', roles: ['Admin'] },
  { to: '/admin/users', label: 'Users', roles: ['Admin'] },
]

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? 'border-primary-300 bg-primary-400 text-charcoal-900'
      : 'border-charcoal-700 text-charcoal-100 hover:border-primary-300 hover:text-primary-300'
  }`

export function AdminLayout() {
  const { user } = useAuth()
  const visibleLinks = ADMIN_LINKS.filter((link) => user && link.roles.includes(user.role))

  return (
    <div>
      <Container>
        <div className="flex flex-wrap gap-2 border-b border-charcoal-700 pb-6">
          {visibleLinks.map((link) => (
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
