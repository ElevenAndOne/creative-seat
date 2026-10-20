import type { APIRoute } from 'astro'
import { demoSlots, studioTimeZone } from '../../server/availability'
import { withAvailability } from '../../server/calendar-api'
import { json } from '../../server/http'
import type { Availability } from '../../utils/booking'

/** Runs per request on Vercel — availability has to be live. */
export const prerender = false

/**
 * GET /api/slots — every demo slot over the next two working weeks, each marked
 * free or busy from the demo calendar, for the picker on /book-a-demo.
 */
export const GET: APIRoute = async () => {
  try {
    return json({ timeZone: studioTimeZone, slots: await withAvailability(demoSlots()) } satisfies Availability)
  } catch (error) {
    console.error('[book-a-demo] Couldn’t work out availability:', error)
    return json({ error: 'unavailable' }, 502)
  }
}
