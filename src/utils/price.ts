import type { Currency } from '../hooks/useCurrency'

/** A whole-number price, e.g. "$2,400". A fixed locale, so the prerendered and hydrated prices match character for character. */
export const formatPrice = (amount: number, currency: Currency) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
