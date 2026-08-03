import { Outlet } from 'react-router-dom'
import { AdminHeader } from './AdminHeader'

/**
 * Full-page shell for the admin dashboard.
 *
 * This is a sibling of the public Layout, not a child of it, so none of the public
 * site's navigation or footer appears inside the dashboard.
 */
export function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-charcoal-900">
      <AdminHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
