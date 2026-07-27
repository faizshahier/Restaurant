/**
 * Supabase rejects with plain objects — `{ message, code, details, hint }` — not `Error`
 * instances. Callers that do `err instanceof Error ? err.message : 'Something went wrong'`
 * therefore always took the fallback branch and discarded the real reason, which is how an
 * RLS failure (code 42501) surfaced to users as a generic "Something went wrong".
 *
 * Normalising at the repository boundary means every layer above can rely on a real Error
 * whose message says what actually happened.
 */
export function toAppError(error: unknown): Error {
  if (error instanceof Error) return error

  if (typeof error === 'string') return new Error(error)

  if (error && typeof error === 'object') {
    const { message, code, details, hint } = error as {
      message?: unknown
      code?: unknown
      details?: unknown
      hint?: unknown
    }

    if (typeof message === 'string' && message.length > 0) {
      // Keep the Postgres error code — it's the difference between "permission denied"
      // guesswork and knowing it's an RLS policy (42501) or a missing function (PGRST202).
      const suffix = typeof code === 'string' && code.length > 0 ? ` [${code}]` : ''
      const normalized = new Error(message + suffix)

      if (typeof details === 'string' && details.length > 0) normalized.cause = details
      else if (typeof hint === 'string' && hint.length > 0) normalized.cause = hint

      return normalized
    }
  }

  return new Error('An unexpected error occurred.')
}

/** Convenience for `catch` blocks that just need something displayable. */
export function toErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const message = toAppError(error).message
  return message === 'An unexpected error occurred.' ? fallback : message
}

/**
 * Guards against a silent no-op write. A PostgREST update/delete filtered out by a
 * Row-Level Security policy affects zero rows and returns HTTP 200 with an empty
 * body — NOT an error. With `.maybeSingle()` that surfaces as `null`, so a save
 * that changed nothing looks successful and the UI just re-displays the old value.
 *
 * Call this on the result of an update-by-id: if it's null, the row either does
 * not exist or the current user lacks permission (e.g. not signed in as staff).
 */
export function assertRowReturned<T>(row: T | null, action = 'update this record'): T {
  if (row == null) {
    throw new Error(
      `Couldn't ${action}. The change did not save — the record may no longer exist, or you ` +
        'do not have permission (you may need to be signed in as an admin or staff member).',
    )
  }
  return row
}
