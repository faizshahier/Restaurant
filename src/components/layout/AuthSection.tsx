import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface AuthSectionProps {
  onNavigate?: () => void
}

export function AuthSection({ onNavigate }: AuthSectionProps) {
  const { user, isLoading, signOut } = useAuth()

  if (isLoading) return null

  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        {(user.role === 'Admin' || user.role === 'restaurant_manager') && (
          <Link to="/admin" onClick={onNavigate} className="font-medium text-primary-300 hover:underline">
            Admin
          </Link>
        )}
        <Link to="/my-orders" onClick={onNavigate} className="font-medium text-primary-300 hover:underline">
          My Orders
        </Link>
        <span className="text-charcoal-100">Hi, {user.name.split(' ')[0]}</span>
        <button
          type="button"
          onClick={() => {
            void signOut()
            onNavigate?.()
          }}
          className="font-medium text-primary-300 hover:underline"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <Link to="/sign-in" onClick={onNavigate} className="text-sm font-medium text-primary-300 hover:underline">
      Sign In
    </Link>
  )
}
