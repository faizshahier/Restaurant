import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Container } from '../layout/Container'
import { useAuth } from '../../context/AuthContext'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (!user) {
    return <Navigate to="/sign-in" replace />
  }

  if (user.role !== 'Admin') {
    return (
      <Container>
        <p className="py-20 text-center text-charcoal-100">You need an admin account to view this page.</p>
      </Container>
    )
  }

  return <>{children}</>
}
