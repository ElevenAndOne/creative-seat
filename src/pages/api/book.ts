import type { APIRoute } from 'astro'
import { demoSlots, studioIso, studioLabel, studioTimeZone } from '../../server/availability'
import { withAvailability } from '../../server/calendar-api'
import { json } from '../../server/http'
import { sendToZapier, zapierConfigured } from '../../server/zapier'
import { UTM_KEYS, type Booking, type BookingRequest } from '../../utils/booking'

export const prerender = false

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^\+?[\d\s().-]{7,}$/

/** Trimmed text no longer than `max`, or null when it's missing, blank or too long. */
const text = (value: unknown, max: number) => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return !trimmed || trimmed.length > max ? null : trimmed
}

/** The request, cleaned — or null if anything in it is off. */
function parse(body: Partial<BookingRequest>) {
  const firstName = text(body.firstName, 60)
  const lastName = text(body.lastName, 60)
  const email = text(body.email, 254)
  const phone = text(body.phone, 40)
  const company = text(body.company, 120)
  const role = text(body.role, 120)
  const timeZone = text(body.timeZone, 64) ?? 'unknown'
  // Campaign tags are optional; anything odd is just left blank.
  const utm = Object.fromEntries(UTM_KEYS.map((key) => [key, text(body.utm?.[key], 200) ?? ''])) as Record<(typeof UTM_KEYS)[number], string>
  if (!firstName || !lastName || !email || !EMAIL.test(email) || !phone || !PHONE.test(phone) || !company || !role || typeof body.start !== 'string') return null
  return { firstName, lastName, email, phone, company, role, timeZone, utm, start: body.start }
}

/**
 * POST /api/book — books a demo. The slot must be one on offer and, by the
 * demo calendar, still free (409 if not). The booking then goes to the Zap
 * (server/zapier.ts), which files the contact and puts the demo in the
 * calendar with the visitor invited.
 */
export const POST: APIRoute = async ({ request, site }) => {
  const body = (await request.json().catch(() => null)) as Partial<BookingRequest> | null
  if (!body) return json({ error: 'invalid' }, 400)

  // Bots fill in the hidden field; tell them it worked and do nothing.
  if (body.website) return json({ start: body.start, end: body.start } satisfies Partial<Booking>)

  const booking = parse(body)
  if (!booking) return json({ error: 'invalid' }, 400)

  // Only a slot that's on offer right now — not a made-up time, nor one that has since slipped past.
  const slot = demoSlots().find(({ start }) => start.toISOString() === booking.start)
  if (!slot) return json({ error: 'slot_taken' }, 409)

  const booked = { start: slot.start.toISOString(), end: slot.end.toISOString() }

  if (!zapierConfigured()) {
    // Nowhere to send it. Never drop a real request silently: production refuses.
    if (!import.meta.env.DEV) return json({ error: 'not_configured' }, 503)
    console.warn('[book-a-demo] No ZAPIER_WEBHOOK_URL — sample booking, nothing was sent:', booking)
    return json({ ...booked, sample: true } satisfies Booking)
  }

  const { firstName, lastName, email, phone, company, role, timeZone, utm } = booking

  try {
    const [{ free }] = await withAvailability([slot])
    if (!free) return json({ error: 'slot_taken' }, 409)

    await sendToZapier({
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`,
      email,
      phone,
      company,
      job_role: role,
      start: studioIso(slot.start),
      end: studioIso(slot.end),
      duration_minutes: (slot.end.getTime() - slot.start.getTime()) / 60_000,
      studio_time: studioLabel(slot.start),
      studio_time_zone: studioTimeZone,
      visitor_time_zone: timeZone,
      requested_at: new Date().toISOString(),
      source: new URL('/book-a-demo', site).href,
      form_source: 'Creative Seat — Book a demo',
      ...utm,
    })
  } catch (error) {
    console.error('[book-a-demo] Couldn’t send the booking:', error)
    return json({ error: 'unavailable' }, 502)
  }

  return json(booked satisfies Booking)
}
