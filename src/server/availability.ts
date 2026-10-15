import { BOOKING_BUFFER_MINUTES, BOOKING_HOURS, BOOKING_TIME_ZONE } from 'astro:env/server'
import { DEMO_MINUTES, type Slot } from '../utils/booking'

/** How many working days ahead visitors can book, starting tomorrow. */
const DAYS_AHEAD = 10

const MINUTE = 60_000

export type Interval = { start: Date; end: Date }

type Day = { year: number; month: number; day: number }

const partsFormat = new Map<string, Intl.DateTimeFormat>()

/** Wall-clock parts of an instant in a time zone. */
function wallClock(at: Date, timeZone: string) {
  let format = partsFormat.get(timeZone)
  if (!format) {
    format = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })
    partsFormat.set(timeZone, format)
  }
  const parts = Object.fromEntries(format.formatToParts(at).map(({ type, value }) => [type, Number(value)]))
  return { year: parts.year, month: parts.month, day: parts.day, hour: parts.hour, minute: parts.minute, second: parts.second }
}

/** The instant a wall-clock time happens in a time zone — two passes, so it holds across a DST change. */
function zonedTime({ year, month, day }: Day, hour: number, minute: number, timeZone: string) {
  const naive = Date.UTC(year, month - 1, day, hour, minute)
  const offsetAt = (at: number) => {
    const p = wallClock(new Date(at), timeZone)
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - at
  }
  const first = naive - offsetAt(naive)
  return new Date(naive - offsetAt(first))
}

/** The next `count` weekdays in the studio's time zone, starting tomorrow. */
function workingDays(now: Date, count: number): Day[] {
  const today = wallClock(now, BOOKING_TIME_ZONE)
  const days: Day[] = []
  for (let offset = 1; days.length < count; offset++) {
    const date = new Date(Date.UTC(today.year, today.month - 1, today.day + offset))
    const weekday = date.getUTCDay()
    if (weekday !== 0 && weekday !== 6) days.push({ year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() })
  }
  return days
}

/** "09:00-17:00" → opening and closing as hours + minutes. */
function workingHours() {
  const match = /^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/.exec(BOOKING_HOURS)
  if (!match) throw new Error(`BOOKING_HOURS must look like 09:00-17:00, not "${BOOKING_HOURS}".`)
  const [opens, closes] = [Number(match[1]) * 60 + Number(match[2]), Number(match[3]) * 60 + Number(match[4])]
  if (closes <= opens) throw new Error('BOOKING_HOURS must close after it opens.')
  return { opens, closes }
}

/**
 * Every demo slot on offer, busy or not: half-hour starts through the studio's
 * working hours, on the next few weekdays.
 */
export function demoSlots(now = new Date()): Interval[] {
  const { opens, closes } = workingHours()
  return workingDays(now, DAYS_AHEAD).flatMap((day) => {
    const slots: Interval[] = []
    for (let at = opens; at + DEMO_MINUTES <= closes; at += DEMO_MINUTES) {
      const start = zonedTime(day, Math.floor(at / 60), at % 60, BOOKING_TIME_ZONE)
      slots.push({ start, end: new Date(start.getTime() + DEMO_MINUTES * MINUTE) })
    }
    return slots
  })
}

/** The span to ask the calendar about: the slots, plus the buffer either side. */
export function span(slots: Interval[]): Interval {
  const buffer = BOOKING_BUFFER_MINUTES * MINUTE
  return { start: new Date(slots[0].start.getTime() - buffer), end: new Date(slots.at(-1)!.end.getTime() + buffer) }
}

/** Marks each slot free unless it (with the buffer around it) overlaps a busy time. */
export function withBusy(slots: Interval[], busy: Interval[]): Slot[] {
  const buffer = BOOKING_BUFFER_MINUTES * MINUTE
  return slots.map(({ start, end }) => ({
    start: start.toISOString(),
    free: !busy.some((b) => start.getTime() - buffer < b.end.getTime() && b.start.getTime() < end.getTime() + buffer),
  }))
}

export const studioTimeZone = BOOKING_TIME_ZONE

const studioFormat = new Intl.DateTimeFormat('en-GB', { timeZone: BOOKING_TIME_ZONE, weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })

/** A slot as the studio sees it: "Fri 16 Oct 2026, 10:00 (Africa/Johannesburg)". */
export const studioLabel = (start: Date) => `${studioFormat.format(start)} (${BOOKING_TIME_ZONE})`
