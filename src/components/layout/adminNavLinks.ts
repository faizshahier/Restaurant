import type { UserRole } from '../../types'

export interface AdminNavLink {
  to: string
  label: string
  /** Who may see this tab. Admin is included everywhere a manager is allowed. */
  roles: UserRole[]
}

/**
 * The admin dashboard's main navigation. Kept in one place so the desktop bar and
 * the mobile menu can never drift apart.
 */
export const ADMIN_NAV_LINKS: AdminNavLink[] = [
  { to: '/admin/orders', label: 'Orders', roles: ['Admin', 'restaurant_manager'] },
  { to: '/admin/foods', label: 'Foods', roles: ['Admin', 'restaurant_manager'] },
  { to: '/admin/analytics', label: 'Analytics', roles: ['Admin', 'restaurant_manager'] },
  { to: '/admin/categories', label: 'Categories', roles: ['Admin'] },
  { to: '/admin/gallery', label: 'Gallery', roles: ['Admin'] },
  { to: '/admin/settings', label: 'Settings', roles: ['Admin'] },
  { to: '/admin/users', label: 'Users', roles: ['Admin'] },
]

/** Only the tabs this role is allowed to open. */
export function visibleAdminLinks(role: UserRole | undefined): AdminNavLink[] {
  if (!role) return []
  return ADMIN_NAV_LINKS.filter((link) => link.roles.includes(role))
}
