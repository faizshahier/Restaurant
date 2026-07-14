import { useEffect, useState, type FormEvent } from 'react'
import type { ZodType } from 'zod'

interface UseAdminCrudOptions<TItem, TForm> {
  emptyForm: TForm
  schema: ZodType<TForm>
  list: () => Promise<TItem[]>
  create: (data: TForm) => Promise<TItem>
  update: (id: string, data: TForm) => Promise<TItem | null>
  toFormState: (item: TItem) => TForm
  getId: (item: TItem) => string
}

type FormErrors<TForm> = Partial<Record<keyof TForm, string>>

/**
 * Shared state/handlers for the admin "list + create/edit form" pattern used by the
 * Foods, Gallery, and Categories admin pages. Each page still owns its own JSX and any
 * fields beyond simple create/update (e.g. delete-guard checks).
 */
export function useAdminCrud<TItem, TForm extends object>({
  emptyForm,
  schema,
  list,
  create,
  update,
  toFormState,
  getId,
}: UseAdminCrudOptions<TItem, TForm>) {
  const [items, setItems] = useState<TItem[]>([])
  const [form, setForm] = useState<TForm>(emptyForm)
  const [errors, setErrors] = useState<FormErrors<TForm>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    list().then((all) => {
      setItems(all)
      setIsLoading(false)
    })
    // Runs once on mount; `list` is a static service reference passed in by the caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function refresh() {
    setItems(await list())
  }

  function updateField<K extends keyof TForm>(field: K, value: TForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function startEdit(item: TItem) {
    setEditingId(getId(item))
    setForm(toFormState(item))
    setErrors({})
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = schema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FormErrors<TForm> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof TForm
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      if (editingId) {
        await update(editingId, result.data)
      } else {
        await create(result.data)
      }
      await refresh()
      cancelEdit()
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    items,
    form,
    errors,
    editingId,
    isSubmitting,
    isLoading,
    updateField,
    startEdit,
    cancelEdit,
    handleSubmit,
    refresh,
  }
}
