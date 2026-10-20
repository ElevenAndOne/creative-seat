import { BOOKING_BUFFER_MINUTES, BOOKING_TIME_ZONE, CALENDAR_API_URL } from 'astro:env/server'
import { DEMO_MINUTES, type Slot } from '../utils/booking'
import { studioClock, type Interval } from './availability'

/**
 * When the studio is free, from the mia calendar API — the same service
 * miacreate.ai's booking form uses (github.com/ElevenAndOne/mia-calendar-api).
 * It runs a Google Calendar FreeBusy query over the demo calendar and answers,
 * for one date, the start times still open: `["09:00", "09:30", "11:00"]`.
 * All the Google credentials live there; this site only asks.
 *
 * The API only books until 31 December of the current year, so days past that
 * aren't asked about and stay closed.
 */
async function freeTimes(date: string): Promise<Set<string>> {
  const url = new URL('/api/slots', CALENDAR_API_URL)
  url.search = new URLSearchParams({ date, duration: String(DEMO_MINUTES), buffer: String(BOOKING_BUFFER_MINUTES), timeZone: BOOKING_TIME_ZONE }).toString()
  const response = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' })
  const data = await response.json().catch(() => null)
  if (!response.ok || !Array.isArray(data)) throw new Error(`Calendar API ${url.pathname}?date=${date} failed (${response.status}): ${data?.error ?? 'no detail'}`)
  return new Set(data)
}

/** Marks each slot free or busy, asking the calendar API once per studio day. */
export async function withAvailability(slots: Interval[]): Promise<Slot[]> {
  const lastBookable = `${studioClock(new Date()).date.slice(0, 4)}-12-31`
  const dates = [...new Set(slots.map(({ start }) => studioClock(start).date))].filter((date) => date <= lastBookable)
  const free = new Map(await Promise.all(dates.map(async (date) => [date, await freeTimes(date)] as const)))
  return slots.map(({ start }) => {
    const { date, time } = studioClock(start)
    return { start: start.toISOString(), free: free.get(date)?.has(time) ?? false }
  })
}
