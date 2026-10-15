import type { APIRoute } from 'astro'
import { demoSlots, span, studioLabel, withBusy } from '../../server/availability'
import { busyTimes, calendarConfigured, createEvent } from '../../server/google-calendar'
import { json } from '../../server/http'
import { saveRequest, storeConfigured } from '../../server/request-store'
import type { Booking, BookingRequest } from '../../utils/booking'

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
  if (!firstName || !lastName || !email || !EMAIL.test(email) || !phone || !PHONE.test(phone) || !company || !role || typeof body.start !== 'string') return null
  return { firstName, lastName, name: `${firstName} ${lastName}`, email, phone, company, role, timeZone, start: body.start }
}

/**
 * POST /api/book — books a demo. The slot must be one on offer and still free:
 * the request is filed in Vercel Blob first, which claims the slot (a second
 * request for it gets 409). Once Google Calendar is connected the slot is also
 * checked against it, and the demo goes in as an event with the visitor
 * invited. A calendar hiccup after the request is filed doesn't lose it — the
 * team can still pick it up from the store.
 */
export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json().catch(() => null)) as Partial<BookingRequest> | null
  if (!body) return json({ error: 'invalid' }, 400)

  // Bots fill in the hidden field; tell them it worked and do nothing.
  if (body.website) return json({ start: body.start, end: body.start, invited: false } satisfies Partial<Booking>)

  const booking = parse(body)
  if (!booking) return json({ error: 'invalid' }, 400)

  // Only a slot that's on offer right now — not a made-up time, nor one that has since slipped past.
  const slot = demoSlots().find(({ start }) => start.toISOString() === booking.start)
  if (!slot) return json({ error: 'slot_taken' }, 409)

  const stored = storeConfigured()
  const calendar = calendarConfigured()
  const booked = { start: slot.start.toISOString(), end: slot.end.toISOString() }

  if (!stored && !calendar) {
    // Nowhere to keep it. Never drop a real request silently: production refuses.
    if (!import.meta.env.DEV) return json({ error: 'not_configured' }, 503)
    console.warn('[book-a-demo] No BLOB_READ_WRITE_TOKEN — sample booking, nothing was saved:', booking)
    return json({ ...booked, invited: false, sample: true } satisfies Booking)
  }

  const { firstName, lastName, name, email, phone, company, role, timeZone } = booking

  try {
    if (calendar && !withBusy([slot], await busyTimes(span([slot])))[0].free) return json({ error: 'slot_taken' }, 409)

    if (stored) {
      const filed = await saveRequest(slot, {
        requestedAt: new Date().toISOString(),
        ...booked,
        studioTime: studioLabel(slot.start),
        firstName,
        lastName,
        email,
        phone,
        company,
        role,
        timeZone,
      })
      if (filed === 'taken') return json({ error: 'slot_taken' }, 409)
    }
  } catch (error) {
    console.error('[book-a-demo] Couldn’t file the request:', error)
    return json({ error: 'unavailable' }, 502)
  }

  if (!calendar) return json({ ...booked, invited: false } satisfies Booking)

  try {
    const event = await createEvent({
      slot,
      summary: `Creative Seat demo · ${company}`,
      description: [
        'Booked on the Creative Seat website.',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Company: ${company}`,
        `Job role: ${role}`,
        `Their time zone: ${timeZone}`,
      ].join('\n'),
      guest: { name, email },
    })
    return json({ ...booked, ...event } satisfies Booking)
  } catch (error) {
    console.error('[book-a-demo] Couldn’t add the demo to the calendar:', error)
    // Filed already, so the team still has it; without the store, it's lost — say so.
    return stored ? json({ ...booked, invited: false } satisfies Booking) : json({ error: 'unavailable' }, 502)
  }
}
