import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { AuthService } from '../services'
import type { PublicUser } from '../types'

interface AuthContextValue {
  user: PublicUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<PublicUser>
  signUp: (name: string, email: string, password: string) => Promise<PublicUser>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Subscribed (not a one-time getCurrentUser poll) so the app reacts to session
    // refresh, expiry, and sign-out from another tab, not just the initial load.
    const unsubscribe = AuthService.onAuthStateChange((currentUser) => {
      setUser(currentUser)
      setIsLoading(false)
    })
    return unsubscribe
  }, [])

  async function signIn(email: string, password: string) {
    const signedInUser = await AuthService.signIn(email, password)
    setUser(signedInUser)
    return signedInUser
  }

  async function signUp(name: string, email: string, password: string) {
    const newUser = await AuthService.signUp(name, email, password)
    setUser(newUser)
    return newUser
  }

  async function signOut() {
    await AuthService.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook belongs with its provider
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
