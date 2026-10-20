import { ZAPIER_WEBHOOK_URL } from 'astro:env/server'
import type { UTM_KEYS } from '../utils/booking'

/**
 * Where a booked demo goes: the "Catch Hook" trigger (Webhooks by Zapier) of
 * the "Creative Seat Book Demo Form" Zap. The Zap takes it from there — the
 * visitor into HubSpot, then a Google Calendar event on the demo calendar with
 * the visitor invited and a Meet link. That event is what then marks the slot
 * busy for everyone else (server/calendar-api.ts).
 *
 * The URL stays on the server, so the hook isn't on show to anyone who opens
 * the page source.
 */

export const zapierConfigured = () => Boolean(ZAPIER_WEBHOOK_URL)

/** One booking, flat, as the Zap's steps map it. */
export type DemoBooking = {
  first_name: string
  last_name: string
  full_name: string
  email: string
  phone: string
  company: string
  job_role: string
  /** In the studio's time zone, with its offset: "2026-10-21T10:30:00+02:00". */
  start: string
  end: string
  duration_minutes: number
  /** "Wed 21 Oct 2026, 10:30 (Africa/Johannesburg)". */
  studio_time: string
  studio_time_zone: string
  /** The visitor's own time zone, e.g. "Europe/London". */
  visitor_time_zone: string
  requested_at: string
  /** The page it was booked on, and its name in HubSpot's Form Source. */
  source: string
  form_source: string
} & Record<(typeof UTM_KEYS)[number], string>

export async function sendToZapier(booking: DemoBooking) {
  const response = await fetch(ZAPIER_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  })
  if (!response.ok) throw new Error(`Zapier webhook failed (${response.status}): ${await response.text().catch(() => 'no detail')}`)
}
