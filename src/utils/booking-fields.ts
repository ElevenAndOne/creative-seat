/** Validation constraints shared by the booking form and its API. */
export const BOOKING_LIMITS = {
  firstName: 60,
  lastName: 60,
  email: 254,
  phone: 40,
  company: 120,
  role: 120,
} as const

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE = /^\+?[\d\s().-]{7,}$/
