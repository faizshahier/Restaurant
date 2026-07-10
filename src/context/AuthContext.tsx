import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { AuthService, type SignUpResult } from '../services'
import type { PublicUser } from '../types'

interface AuthContextValue {
  user: PublicUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<PublicUser>
  signUp: (name: string, email: string, password: string) => Promise<SignUpResult>
  verifyEmailOtp: (email: string, token: string) => Promise<PublicUser>
  resendSignUpCode: (email: string) => Promise<void>
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
    const result = await AuthService.signUp(name, email, password)
    if (result.status === 'signed-in') {
      setUser(result.user)
    }
    return result
  }

  async function verifyEmailOtp(email: string, token: string) {
    const verifiedUser = await AuthService.verifyEmailOtp(email, token)
    setUser(verifiedUser)
    return verifiedUser
  }

  async function resendSignUpCode(email: string) {
    await AuthService.resendSignUpCode(email)
  }

  async function signOut() {
    await AuthService.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signIn, signUp, verifyEmailOtp, resendSignUpCode, signOut }}
    >
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
