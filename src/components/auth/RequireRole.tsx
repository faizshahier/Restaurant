import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Container } from '../layout/Container'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types'

interface RequireRoleProps {
  roles: UserRole[]
  children: ReactNode
}

/**
 * Gates a route to one or more roles. Admin should generally be included
 * alongside restaurant_manager wherever a manager-only page is gated, since
 * the site admin has unrestricted access to everything.
 */
export function RequireRole({ roles, children }: RequireRoleProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (!user) {
    return <Navigate to="/sign-in" replace />
  }

  if (!roles.includes(user.role)) {
    return (
      <Container>
        <p className="py-20 text-center text-charcoal-100">You don't have permission to view this page.</p>
      </Container>
    )
  }

  return <>{children}</>
}
