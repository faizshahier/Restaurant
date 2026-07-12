import { useEffect, useState } from 'react'
import { Container } from '../../components/layout/Container'
import { useAuth } from '../../context/AuthContext'
import { UserService } from '../../services'
import type { PublicUser, UserRole } from '../../types'

const ROLE_OPTIONS: UserRole[] = ['Customer', 'restaurant_manager', 'Admin']

const ROLE_LABELS: Record<UserRole, string> = {
  Admin: 'Admin',
  Customer: 'Customer',
  restaurant_manager: 'Restaurant Manager',
}

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
        <div className="mt-8 overflow-x-auto rounded-lg border border-charcoal-700">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-charcoal-800 text-charcoal-100">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-700">
              {users.map((targetUser) => (
                <tr key={targetUser.id}>
                  <td className="px-4 py-3 text-charcoal-50">
                    {targetUser.name}
                    {targetUser.id === currentUser?.id && (
                      <span className="ml-2 text-xs text-charcoal-400">(you)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-charcoal-100">{targetUser.email}</td>
                  <td className="px-4 py-3 text-charcoal-100">{targetUser.phone_number ?? '—'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={targetUser.role}
                      disabled={pendingId === targetUser.id}
                      onChange={(event) => void changeRole(targetUser, event.target.value as UserRole)}
                      className="rounded-md border border-charcoal-700 bg-charcoal-900 px-2 py-1 text-charcoal-50 focus:border-primary-300 focus:outline-none disabled:opacity-60"
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-charcoal-100">
                    {new Date(targetUser.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={targetUser.id === currentUser?.id || pendingId === targetUser.id}
                      onClick={() => void deleteUser(targetUser)}
                      className="text-red-400 hover:underline disabled:cursor-not-allowed disabled:text-charcoal-400 disabled:no-underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  )
}
