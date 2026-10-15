import { GOOGLE_BUSY_CALENDAR_IDS, GOOGLE_CALENDAR_ID, GOOGLE_CLIENT_EMAIL, GOOGLE_IMPERSONATE, GOOGLE_PRIVATE_KEY } from 'astro:env/server'
import type { Interval } from './availability'

/**
 * Just enough Google Calendar for booking demos: free/busy and creating an
 * event. Talks to the REST API with a service-account token signed here with
 * Web Crypto, so it needs no SDK and runs on any server runtime.
 *
 * With GOOGLE_IMPERSONATE set (Google Workspace domain-wide delegation) it acts
 * as that person: the visitor is invited and gets a Google Meet link. Without
 * it, the service account writes to a calendar shared with it, and the event
 * only carries the visitor's details — service accounts can't invite anyone.
 */

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const API = 'https://www.googleapis.com/calendar/v3'
const SCOPES = 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.freebusy'

export const calendarConfigured = () => Boolean(GOOGLE_CLIENT_EMAIL && GOOGLE_PRIVATE_KEY)

/** Can events carry the visitor as a guest (and a Meet link)? Only when acting as a Workspace user. */
const canInvite = () => Boolean(GOOGLE_IMPERSONATE)

const busyCalendarIds = () => [...new Set([GOOGLE_CALENDAR_ID, ...(GOOGLE_BUSY_CALENDAR_IDS ?? '').split(',')].map((id) => id.trim()).filter(Boolean))]

const base64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const encodeJson = (value: unknown) => base64url(new TextEncoder().encode(JSON.stringify(value)))

let signingKey: Promise<CryptoKey> | undefined
let token: { value: string; expires: number } | undefined

function importKey() {
  // Env vars usually carry the PEM's line breaks as literal "\n".
  const body = GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n').replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '').replace(/\s+/g, '')
  const der = Uint8Array.from(atob(body), (c) => c.charCodeAt(0))
  return crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign'])
}

/** An OAuth access token from a signed service-account JWT, reused until a minute before it expires. */
async function accessToken() {
  if (token && token.expires > Date.now() + 60_000) return token.value

  const now = Math.floor(Date.now() / 1000)
  const claims = { iss: GOOGLE_CLIENT_EMAIL, scope: SCOPES, aud: TOKEN_URL, iat: now, exp: now + 3600, ...(GOOGLE_IMPERSONATE && { sub: GOOGLE_IMPERSONATE }) }
  const unsigned = `${encodeJson({ alg: 'RS256', typ: 'JWT' })}.${encodeJson(claims)}`
  signingKey ??= importKey()
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', await signingKey, new TextEncoder().encode(unsigned))

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${base64url(new Uint8Array(signature))}` }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`Google token request failed (${response.status}): ${data.error_description ?? data.error ?? 'no detail'}`)
  token = { value: data.access_token, expires: Date.now() + data.expires_in * 1000 }
  return token.value
}

async function google<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json', ...init.headers },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`Google Calendar ${path.split('?')[0]} failed (${response.status}): ${data.error?.message ?? 'no detail'}`)
  return data as T
}

type FreeBusy = { calendars: Record<string, { busy?: { start: string; end: string }[]; errors?: { reason: string }[] }> }

/**
 * Busy times across the booking calendar and any extra ones. A calendar the
 * account can't read is an error, not an empty diary — otherwise every slot
 * would look free.
 */
export async function busyTimes({ start, end }: Interval): Promise<Interval[]> {
  const ids = busyCalendarIds()
  const data = await google<FreeBusy>('/freeBusy', {
    method: 'POST',
    body: JSON.stringify({ timeMin: start.toISOString(), timeMax: end.toISOString(), items: ids.map((id) => ({ id })) }),
  })
  return ids.flatMap((id) => {
    const calendar = data.calendars[id]
    if (!calendar || calendar.errors?.length) throw new Error(`Can't read busy times for ${id}: ${calendar?.errors?.map((e) => e.reason).join(', ') ?? 'missing'}`)
    return (calendar.busy ?? []).map((b) => ({ start: new Date(b.start), end: new Date(b.end) }))
  })
}

type NewEvent = {
  slot: Interval
  summary: string
  description: string
  guest: { name: string; email: string }
}

type CreatedEvent = { id: string; hangoutLink?: string }

/** Puts the demo in the calendar. With an impersonated user, the visitor is invited and Google emails them. */
export async function createEvent({ slot, summary, description, guest }: NewEvent) {
  const invite = canInvite()
  const params = new URLSearchParams({ sendUpdates: invite ? 'all' : 'none', conferenceDataVersion: invite ? '1' : '0' })
  const event = await google<CreatedEvent>(`/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events?${params}`, {
    method: 'POST',
    body: JSON.stringify({
      summary,
      description,
      start: { dateTime: slot.start.toISOString() },
      end: { dateTime: slot.end.toISOString() },
      ...(invite && {
        attendees: [{ email: guest.email, displayName: guest.name }],
        conferenceData: { createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } } },
      }),
      extendedProperties: { private: { source: 'creative-seat-book-a-demo' } },
    }),
  })
  return { invited: invite, meetUrl: event.hangoutLink }
}
