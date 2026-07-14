import { useEffect, useState } from 'react'
import { Container } from '../../../components/layout/Container'
import { useAuth } from '../../../context/AuthContext'
import { UserService } from '../../../services'
import type { PublicUser, UserRole } from '../../../types'
import { UsersTable } from './UsersTable'

export function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<PublicUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  useEffect(() => {
    UserService.listUsers().then((allUsers) => {
      setUsers(allUsers)
      setIsLoading(false)
    })
  }, [])

  async function refreshUsers() {
    const allUsers = await UserService.listUsers()
    setUsers(allUsers)
  }

  async function changeRole(targetUser: PublicUser, role: UserRole) {
    if (role === targetUser.role) return

    if (targetUser.id === currentUser?.id && targetUser.role === 'Admin' && role !== 'Admin') {
      const confirmed = window.confirm(
        'This removes your own admin access. You will lose access to this page immediately. Continue?',
      )
      if (!confirmed) return
    }

    setError(null)
    setPendingId(targetUser.id)
    try {
      await UserService.updateProfile(targetUser.id, { role })
      await refreshUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the role. Please try again.')
    } finally {
      setPendingId(null)
    }
  }

  async function deleteUser(targetUser: PublicUser) {
    const confirmed = window.confirm(
      `Delete ${targetUser.name}'s profile? They will keep their login but lose all site access ` +
        'and role until they contact you again — this does not delete their Supabase Auth account.',
    )
    if (!confirmed) return

    setError(null)
    setPendingId(targetUser.id)
    try {
      await UserService.deleteUser(targetUser.id)
      await refreshUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete this user. Please try again.')
    } finally {
      setPendingId(null)
    }
  }

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Users</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">
        Manage account roles and remove access. New accounts are created by signing up at{' '}
        <span className="text-charcoal-50">/sign-up</span> — assign them a role here afterward.
      </p>

      <div className="mt-4 max-w-2xl rounded-lg border border-charcoal-700 bg-charcoal-800 p-4 text-sm text-charcoal-100">
        There is no "Add User" button here on purpose: creating a login (email + password) can only be done
        through self-service sign-up or Supabase's Admin API, which requires a secret key this app never
        exposes to the browser. Once someone has an account, promote or demote them below.
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {isLoading ? (
        <p className="mt-10 text-charcoal-100">Loading users…</p>
      ) : (
        <UsersTable
          users={users}
          currentUserId={currentUser?.id}
          pendingId={pendingId}
          onChangeRole={(targetUser, role) => void changeRole(targetUser, role)}
          onDelete={(targetUser) => void deleteUser(targetUser)}
        />
      )}
    </Container>
  )
}
