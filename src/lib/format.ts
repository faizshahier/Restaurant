const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatPrice(price: number): string {
  return currencyFormatter.format(price)
}

export function getDiscountedPrice(price: number, discountPercentage: number): number {
  return price * (1 - discountPercentage / 100)
}
