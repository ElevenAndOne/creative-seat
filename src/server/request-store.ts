import { BlobError, BlobNotFoundError, head, list, put } from '@vercel/blob'
import { BLOB_READ_WRITE_TOKEN } from 'astro:env/server'
import type { Interval } from './availability'

/**
 * Demo requests, kept in Vercel Blob (the Blob store connected to the Vercel
 * project; private, so the files have no public URL). One JSON file per
 * booked slot, named by the slot's UTC start:
 *
 *   demo-requests/2026-10-16/08-00Z.json
 *
 * The fixed name doubles as the slot's lock — a second request for the same
 * half hour finds the file already there — and listing the files tells the
 * picker which slots are taken. Deleting a file (Vercel → Storage → the store's
 * browser) frees its slot again.
 */

const PREFIX = 'demo-requests/'

export const storeConfigured = () => Boolean(BLOB_READ_WRITE_TOKEN)

const options = () => ({ token: BLOB_READ_WRITE_TOKEN })

/** `demo-requests/2026-10-16/08-00Z.json` for a slot starting 08:00 UTC that day. */
const pathFor = (start: Date) => {
  const iso = start.toISOString()
  return `${PREFIX}${iso.slice(0, 10)}/${iso.slice(11, 16).replace(':', '-')}Z.json`
}

/** The slot start a request file stands for, as an ISO instant — or null for anything else in the store. */
const startOf = (pathname: string) => {
  const match = /^demo-requests\/(\d{4}-\d{2}-\d{2})\/(\d{2})-(\d{2})Z\.json$/.exec(pathname)
  return match ? new Date(`${match[1]}T${match[2]}:${match[3]}:00.000Z`).toISOString() : null
}

/** Starts of every slot with a request on file, across the months the span touches. */
export async function takenStarts({ start, end }: Interval): Promise<Set<string>> {
  const months = new Set([start.toISOString().slice(0, 7), end.toISOString().slice(0, 7)])
  const taken = new Set<string>()
  for (const month of months) {
    let cursor: string | undefined
    do {
      const page = await list({ ...options(), prefix: `${PREFIX}${month}`, cursor })
      for (const blob of page.blobs) {
        const slot = startOf(blob.pathname)
        if (slot) taken.add(slot)
      }
      cursor = page.hasMore ? page.cursor : undefined
    } while (cursor)
  }
  return taken
}

export type DemoRequest = {
  requestedAt: string
  start: string
  end: string
  /** The slot as the studio sees it, e.g. "Fri 16 Oct 2026, 10:00 (Africa/Johannesburg)". */
  studioTime: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  role: string
  /** The visitor's own time zone. */
  timeZone: string
}

/**
 * Files the request under its slot. Returns 'taken' when that slot already has
 * one — checked first, and again by the write itself, which won't overwrite.
 */
export async function saveRequest(slot: Interval, request: DemoRequest): Promise<'saved' | 'taken'> {
  const pathname = pathFor(slot.start)
  try {
    await head(pathname, options())
    return 'taken'
  } catch (error) {
    if (!(error instanceof BlobNotFoundError)) throw error
  }
  try {
    await put(pathname, JSON.stringify(request, null, 2), {
      ...options(),
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
    })
    return 'saved'
  } catch (error) {
    // Lost a race for the same slot: the store refuses to overwrite.
    if (error instanceof BlobError && /exist/i.test(error.message)) return 'taken'
    throw error
  }
}
