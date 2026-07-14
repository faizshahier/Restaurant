import type { PublicUser, UserRole } from '../../../types'

const ROLE_OPTIONS: UserRole[] = ['Customer', 'restaurant_manager', 'Admin']

const ROLE_LABELS: Record<UserRole, string> = {
  Admin: 'Admin',
  Customer: 'Customer',
  restaurant_manager: 'Restaurant Manager',
}

interface UsersTableProps {
  users: PublicUser[]
  currentUserId: string | undefined
  pendingId: string | null
  onChangeRole: (targetUser: PublicUser, role: UserRole) => void
  onDelete: (targetUser: PublicUser) => void
}

export function UsersTable({ users, currentUserId, pendingId, onChangeRole, onDelete }: UsersTableProps) {
  return (
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
                {targetUser.id === currentUserId && (
                  <span className="ml-2 text-xs text-charcoal-400">(you)</span>
                )}
              </td>
              <td className="px-4 py-3 text-charcoal-100">{targetUser.email}</td>
              <td className="px-4 py-3 text-charcoal-100">{targetUser.phone_number ?? '—'}</td>
              <td className="px-4 py-3">
                <select
                  value={targetUser.role}
                  disabled={pendingId === targetUser.id}
                  onChange={(event) => onChangeRole(targetUser, event.target.value as UserRole)}
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
                  disabled={targetUser.id === currentUserId || pendingId === targetUser.id}
                  onClick={() => onDelete(targetUser)}
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
  )
}
