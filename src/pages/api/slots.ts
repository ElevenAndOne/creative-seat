import type { APIRoute } from 'astro'
import { demoSlots, span, studioTimeZone, withBusy } from '../../server/availability'
import { busyTimes, calendarConfigured } from '../../server/google-calendar'
import { json } from '../../server/http'
import { storeConfigured, takenStarts } from '../../server/request-store'
import type { Availability } from '../../utils/booking'

/** Runs per request on Vercel — availability has to be live. */
export const prerender = false

/**
 * GET /api/slots — every demo slot over the next two working weeks, each marked
 * free or busy, for the picker on /book-a-demo. A slot is busy when a request
 * is already on file for it, or (once it's connected) Google Calendar has
 * something on then. With neither set up, every slot is open.
 */
export const GET: APIRoute = async () => {
  const slots = demoSlots()
  const range = span(slots)

  try {
    const [taken, busy] = await Promise.all([
      storeConfigured() ? takenStarts(range) : new Set<string>(),
      calendarConfigured() ? busyTimes(range) : [],
    ])
    const marked = withBusy(slots, busy).map((slot) => (taken.has(slot.start) ? { ...slot, free: false } : slot))
    return json({ timeZone: studioTimeZone, slots: marked } satisfies Availability)
  } catch (error) {
    console.error('[book-a-demo] Couldn’t work out availability:', error)
    return json({ error: 'unavailable' }, 502)
  }
}
