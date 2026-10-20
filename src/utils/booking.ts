/**
 * The book-a-demo contract between the page (sections/book-demo.tsx) and the
 * booking API (pages/api/slots.ts, pages/api/book.ts), plus the client's calls
 * and the formatting that shows a slot in the visitor's own time zone.
 */

/** How long a demo runs, in minutes — the page, the ticket and the calendar event all say so. */
export const DEMO_MINUTES = 30

/** One half-hour slot. `start` is an ISO instant; `free` is false when the demo calendar is busy then. */
export type Slot = { start: string; free: boolean }

export type Availability = {
  /** The studio's time zone, where working hours are set. */
  timeZone: string
  slots: Slot[]
}

export type BookingRequest = {
  start: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  role: string
  /** The visitor's IANA time zone, for the event description. */
  timeZone: string
  /** The campaign they came in on, for HubSpot. */
  utm: Utm
  /** Honeypot — a hidden field people never fill in. */
  website: string
}

/** The campaign parameters passed on with a booking, as the Zap maps them into HubSpot. */
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>

/** The campaign the visitor arrived with: the booking page's own utm_* parameters, or those kept from their landing page (layouts/base.astro). */
export function campaign(): Utm {
  let kept: Record<string, unknown> = {}
  try {
    kept = JSON.parse(sessionStorage.getItem('cs-utm') ?? '{}')
  } catch {
    // Storage blocked or garbled: the URL alone will do.
  }
  const here = new URLSearchParams(location.search)
  return Object.fromEntries(
    UTM_KEYS.flatMap((key) => {
      const value = here.get(key) ?? kept[key]
      return typeof value === 'string' && value ? [[key, value]] : []
    }),
  )
}

export type Booking = {
  start: string
  end: string
  /** Dev only, with no Zapier webhook set: nothing was sent. */
  sample?: boolean
}

/**
 * Why a request failed: the time was taken in the meantime, booking isn't set
 * up on the server, the input was rejected, or the calendar, Zapier or the
 * network let us down.
 */
export type BookingErrorCode = 'slot_taken' | 'not_configured' | 'invalid' | 'unavailable'

export class BookingError extends Error {
  readonly code: BookingErrorCode

  constructor(code: BookingErrorCode) {
    super(code)
    this.code = code
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, { cache: 'no-store', ...init, headers: { Accept: 'application/json', ...init?.headers } })
  } catch {
    throw new BookingError('unavailable')
  }
  const data = await response.json().catch(() => null)
  if (response.ok && data) return data as T
  const code = data?.error
  throw new BookingError(code === 'slot_taken' || code === 'not_configured' || code === 'invalid' ? code : 'unavailable')
}

export const loadAvailability = (signal?: AbortSignal) => call<Availability>('/api/slots', { signal })

export const requestBooking = (body: BookingRequest) =>
  call<Booking>('/api/book', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

/* ---- Showing slots in the visitor's time zone ---------------------------- */

/** The visitor's IANA time zone, e.g. `Europe/London`. */
export const visitorTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'

/** `Europe/London` → "London", `America/Argentina/Buenos_Aires` → "Buenos Aires". */
export const zoneCity = (timeZone: string) => timeZone.split('/').pop()!.replace(/_/g, ' ')

const dayKeyFormat = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
const weekdayFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'short' })
const longWeekdayFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'long' })
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric' })
const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'short' })
// Times follow the visitor's own clock habit (15:00 or 3:00 PM).
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })
const zoneFormat = new Intl.DateTimeFormat('en-GB', { timeZoneName: 'short' })

export type SlotDay = {
  /** The visitor's local date, `YYYY-MM-DD`. */
  key: string
  weekday: string
  date: string
  month: string
  slots: Slot[]
  /** False when every slot that day is taken. */
  open: boolean
}

/**
 * Slots grouped by the visitor's own calendar day — so for someone far from the
 * studio, one working day can spill across two of theirs.
 */
export function groupByDay(slots: Slot[]): SlotDay[] {
  const days = new Map<string, SlotDay>()
  for (const slot of slots) {
    const at = new Date(slot.start)
    const key = dayKeyFormat.format(at)
    let day = days.get(key)
    if (!day) {
      day = { key, weekday: weekdayFormat.format(at), date: dateFormat.format(at), month: monthFormat.format(at), slots: [], open: false }
      days.set(key, day)
    }
    day.slots.push(slot)
    day.open ||= slot.free
  }
  return [...days.values()].sort((a, b) => a.key.localeCompare(b.key))
}

export const formatTime = (iso: string) => timeFormat.format(new Date(iso))

/** "BST", "GMT+2" — the short name of the visitor's zone at that moment. */
export const formatZone = (iso: string) => zoneFormat.formatToParts(new Date(iso)).find((part) => part.type === 'timeZoneName')?.value ?? ''

/** { weekday: "Tue", date: "21", month: "Oct" }. */
const dayParts = (iso: string) => {
  const at = new Date(iso)
  return { weekday: weekdayFormat.format(at), date: dateFormat.format(at), month: monthFormat.format(at) }
}

/** "Tue 21 Oct". */
export const formatDay = (iso: string) => {
  const { weekday, date, month } = dayParts(iso)
  return `${weekday} ${date} ${month}`
}

/** "Tuesday". */
export const formatWeekday = (iso: string) => longWeekdayFormat.format(new Date(iso))
