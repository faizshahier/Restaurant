import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Container } from '../../components/layout/Container'
import { Field, inputClasses } from '../../components/form/Field'
import { formatPrice, getDiscountedPrice } from '../../lib/format'
import { CategoryService, FoodService, OrderService } from '../../services'
import { createOrderSchema } from '../../validation/schemas'
import type { Category, Food, Order, OrderItem } from '../../types'
import { MenuSelector } from './MenuSelector'
import { OrderConfirmation } from './OrderConfirmation'
import { toErrorMessage } from '../../lib/errors'

interface FormState {
  customer_name: string
  phone: string
  location: string
  notes: string
}

const initialForm: FormState = { customer_name: '', phone: '', location: '', notes: '' }

type FormErrors = Partial<Record<'customer_name' | 'phone' | 'location' | 'items', string>>

export function OrderPage() {
  const [foods, setFoods] = useState<Food[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingMenu, setIsLoadingMenu] = useState(true)
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)

  useEffect(() => {
    // Both requests go out together instead of one after the other, so the menu
    // appears as soon as the slower of the two finishes.
    Promise.all([FoodService.getAvailableItems(), CategoryService.getAllCategories()])
      .then(([availableFoods, allCategories]) => {
        setFoods(availableFoods)
        setCategories(allCategories)
        setIsLoadingMenu(false)
      })
      .catch((err: unknown) => {
        console.error('Failed to load menu items', err)
        setSubmitError("We couldn't load the menu. Please check your connection and try again.")
        setIsLoadingMenu(false)
      })
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
      setSubmitError(toErrorMessage(error, 'Something went wrong. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (confirmedOrder) {
    return (
      <Container>
        <OrderConfirmation order={confirmedOrder} onPlaceAnother={() => setConfirmedOrder(null)} />
      </Container>
    )
  }

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Order Online</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">Pick your dishes and we'll get cooking.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6" noValidate>
        <MenuSelector
          foods={foods}
          categories={categories}
          quantities={quantities}
          isLoading={isLoadingMenu}
          itemsError={errors.items}
          onQuantityChange={updateQuantity}
        />

        {items.length > 0 && (
          <div className="rounded-xl border border-charcoal-700 bg-charcoal-800 p-5">
            <h2 className="font-display text-lg text-charcoal-50">Your Order</h2>
            <ul className="mt-3 space-y-1.5">
              {items.map((item) => (
                <li key={item.food_id} className="flex justify-between gap-4 text-sm text-charcoal-100">
                  <span>
                    {item.quantity} × {item.food_name}
                  </span>
                  <span className="text-charcoal-50">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

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

        <Field label="Delivery Location" error={errors.location}>
          <input
            type="text"
            value={form.location}
            onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
            placeholder="Street address, building, or landmark"
            className={inputClasses}
          />
        </Field>

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
          className="self-start rounded-md bg-primary-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-primary-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Placing order…' : 'Place Order'}
        </button>
      </form>
    </Container>
  )
}
