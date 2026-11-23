import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import LinkButton from '../link-button'
import Paragraph from '../paragraph'
import { pillClass } from '../pill'
import { contact } from '../../content'
import { formatDay, formatTime, formatWeekday, formatZone, type Booking, type BookingErrorCode } from '../../utils/booking'

const EASE = [0.16, 1, 0.3, 1] as const

export function NoAvailability({ onRetry }: { onRetry: () => void }) {
  return (
    <div id="book-calendar-status" tabIndex={-1} role="status" className="col-span-full rounded-md border border-line px-4 py-3">
      <Paragraph.Small>There are no free demo times in the next two weeks. <EmailUs /></Paragraph.Small>
      <button type="button" onClick={onRetry} className="mt-3 text-p-sm font-semibold underline underline-offset-4">Refresh times</button>
    </div>
  )
}

export function CalendarError({ code, onRetry }: { code: BookingErrorCode; onRetry: () => void }) {
  return (
    <div id="book-calendar-status" tabIndex={-1} role="alert" className="col-span-full rounded-md border border-line px-4 py-3">
      {code === 'not_configured' ? (
        <Paragraph.Small>
          Online booking isn’t open just yet. <EmailUs />
        </Paragraph.Small>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Paragraph.Small>
            We couldn’t load the calendar. Try again, or <EmailUs lower />
          </Paragraph.Small>
          <button type="button" onClick={onRetry} className={pillClass('outline')}>
            <span>Try again</span>
          </button>
        </div>
      )}
    </div>
  )
}

export function Confirmation({ booking, name, email }: { booking: Booking; name: string; email: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const reducedMotion = useReducedMotion()
  // The form is gone: move focus to what replaced it.
  useEffect(() => ref.current?.focus({ preventScroll: true }), [])

  const when = `${formatDay(booking.start)} at ${formatTime(booking.start)} ${formatZone(booking.start)}`
  return (
    <motion.div
      initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.4, ease: EASE }}
      className="flex min-h-[20rem] flex-col items-start p-10 landscape:p-7"
      role="status"
    >
      <span className="grid size-12 place-items-center rounded-full bg-ink text-volt">
        <Tick className="size-6" />
      </span>
      <h2 ref={ref} tabIndex={-1} className="mt-8 text-h2 font-bold outline-none">
        See you {formatWeekday(booking.start)}, {name.trim()}.
      </h2>
      <Paragraph className="mt-4 max-w-[26rem]">
        {booking.sample ? <>Your sample demo is set for {when}. This preview does not send a calendar invite or confirmation email.</> : <>Your 30-minute demo is booked for {when}. The calendar invite and video link are on their way to {email}.</>}
      </Paragraph>
      <LinkButton href="/#work" id="book-see-work" data-track="see_work_click" data-track-location="book_demo" variant="outline" className="mt-9">
        See our work
      </LinkButton>
    </motion.div>
  )
}

export function Failure({ code }: { code: BookingErrorCode }) {
  return (
    <p role="alert" className="mt-6 rounded-md bg-soft-volt px-4 py-3 text-p-sm font-medium text-forest">
      {code === 'not_configured' ? (
        <>
          Online booking isn’t open just yet. <EmailUs />
        </>
      ) : code === 'invalid' ? (
        <>Something in your details didn’t go through. Check them and try again.</>
      ) : (
        <>
          Your booking didn’t go through. Try again in a moment, or <EmailUs lower />
        </>
      )}
    </p>
  )
}

/** The way round a booking that won't go through: an email to the studio. */
export function EmailUs({ lower }: { lower?: boolean }) {
  return (
    <>
      {lower ? 'email' : 'Email'} us at{' '}
      <a href={`mailto:${contact.email}?subject=${encodeURIComponent('Book a demo — Creative Seat')}`} className="underline underline-offset-4">
        {contact.email}
      </a>{' '}
      and we’ll find a time.
    </>
  )
}

function Tick({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={className}>
      <path d="m4.5 10.4 3.6 3.6 7.4-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
