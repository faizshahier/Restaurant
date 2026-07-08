import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Container } from '../components/layout/Container'
import { Field, inputClasses } from '../components/form/Field'
import { formatPrice, getDiscountedPrice } from '../lib/format'
import { FoodService, OrderService } from '../services'
import { createOrderSchema } from '../validation/schemas'
import type { Food, Order, OrderItem } from '../types'

interface FormState {
  customer_name: string
  phone: string
  notes: string
}

const initialForm: FormState = { customer_name: '', phone: '', notes: '' }

type FormErrors = Partial<Record<'customer_name' | 'phone' | 'items', string>>

export function OrderPage() {
  const [foods, setFoods] = useState<Food[]>([])
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)

  useEffect(() => {
    FoodService.getAvailableItems().then(setFoods)
  }, [])

  const items: OrderItem[] = useMemo(
    () =>
      foods
        .filter((food) => (quantities[food.id] ?? 0) > 0)
        .map((food) => ({
          food_id: food.id,
          food_name: food.name,
          quantity: quantities[food.id] ?? 0,
          price: getDiscountedPrice(food.price, food.discount_percentage),
        })),
    [foods, quantities],
  )

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function updateQuantity(foodId: string, quantity: number) {
    setQuantities((prev) => ({ ...prev, [foodId]: Math.max(0, quantity) }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)

    const result = createOrderSchema.safeParse({ ...form, items })
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormErrors
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      const order = await OrderService.createOrder(result.data)
      setConfirmedOrder(order)
      setForm(initialForm)
      setQuantities({})
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (confirmedOrder) {
    return (
      <Container>
        <div className="mx-auto max-w-lg rounded-lg border border-charcoal-700 bg-charcoal-800 p-8 text-center">
          <h1 className="font-display text-2xl text-charcoal-50">Order Placed</h1>
          <p className="mt-2 text-charcoal-100">
            Thanks, {confirmedOrder.customer_name}. Your order total is{' '}
            <span className="font-medium text-brand-200">{formatPrice(confirmedOrder.total)}</span>.
          </p>
          <p className="mt-4 text-sm text-brand-300">Status: {confirmedOrder.status}</p>
          <button
            type="button"
            onClick={() => setConfirmedOrder(null)}
            className="mt-6 rounded-md bg-brand-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-brand-300"
          >
            Place Another Order
          </button>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Order Online</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">Pick your dishes and we'll get cooking.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6" noValidate>
        <div className="flex flex-col gap-3">
          {foods.map((food) => (
            <div
              key={food.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-charcoal-700 bg-charcoal-800 p-4"
            >
              <div>
                <p className="font-medium text-charcoal-50">{food.name}</p>
                <p className="text-sm text-charcoal-100">
                  {formatPrice(getDiscountedPrice(food.price, food.discount_percentage))}
                </p>
              </div>
              <input
                type="number"
                min={0}
                value={quantities[food.id] ?? 0}
                onChange={(event) => updateQuantity(food.id, Number(event.target.value))}
                className={`${inputClasses} w-20 text-center`}
              />
            </div>
          ))}
        </div>
        {errors.items && <p className="text-sm text-red-400">{errors.items}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" error={errors.customer_name}>
            <input
              type="text"
              value={form.customer_name}
              onChange={(event) => setForm((prev) => ({ ...prev, customer_name: event.target.value }))}
              className={inputClasses}
            />
          </Field>

          <Field label="Phone" error={errors.phone}>
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              className={inputClasses}
            />
          </Field>
        </div>

        <Field label="Notes (optional)">
          <textarea
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            rows={2}
            className={inputClasses}
          />
        </Field>

        <p className="text-lg font-medium text-charcoal-50">Total: {formatPrice(total)}</p>

        {submitError && <p className="text-sm text-red-400">{submitError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start rounded-md bg-brand-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Placing order…' : 'Place Order'}
        </button>
      </form>
    </Container>
  )
}
