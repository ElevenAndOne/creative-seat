import { useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { TextField } from '../components/booking/fields'
import { FIELDS } from '../components/booking/model'
import { DatePicker, TimePicker } from '../components/booking/pickers'
import { CalendarError, Confirmation, Failure, NoAvailability } from '../components/booking/status'
import Em from '../components/em'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { pillClass } from '../components/pill'
import { useBookingForm } from '../hooks/useBookingForm'
import { visitorTimeZone, zoneCity } from '../utils/booking'
import { cn } from '../utils/cn'
import { contact } from '../content'

const HEADER = '4.75rem'

/** The page composes the booking workflow with independent fields, pickers and recovery states. */
export default function BookDemo() {
  const { details, calendar, days, day, slot, errors, notice, sending, failure, booking, ready, refresh, setDetail, pickDay, pickSlot, submit } = useBookingForm()
  const reducedMotion = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (booking && card && card.getBoundingClientRect().top < 80) card.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' })
  }, [booking, reducedMotion])

  return (
    <section id="book" className="relative isolate overflow-hidden bg-night text-paper">
      <div
        className="mx-auto grid w-full max-w-[var(--container-width)] grid-cols-[minmax(0,1fr)_minmax(0,36rem)] items-center gap-x-[clamp(3rem,7vw,8rem)] gap-y-12 pb-[var(--section-pad-md)] tablet:grid-cols-1"
        style={{ paddingTop: `calc(${HEADER} + clamp(2rem, 8dvh, 5rem))` }}
      >
        <div className="flex flex-col items-start">
          <div>
            <Heading.H1 as="h1" className="max-w-[8em] text-[clamp(3rem,2.7143rem+1.4286vw,4rem)] leading-[0.95] tracking-[-0.015em] tablet:max-w-[10em]">
              <span className="block">Pull up a seat.</span> <Em>We’ll show you around.</Em>
            </Heading.H1>
          </div>
          <div className="mt-7 max-w-[30rem]">
            <Paragraph.Big className="text-paper/85">
              Thirty minutes on a video call with a delivery lead from the studio. Bring your backlog and we’ll show you how a seat would take it on.
            </Paragraph.Big>
          </div>
        </div>

        <div>
          <div ref={cardRef} className="scroll-mt-24 overflow-hidden rounded-frame bg-paper text-ink shadow-[0_40px_90px_-40px_color-mix(in_oklab,var(--color-ink)_90%,transparent)]">
            {booking ? (
              <Confirmation booking={booking} name={details.firstName} email={details.email} />
            ) : (
              <form noValidate onSubmit={submit} aria-label="Book a demo" className="relative p-9 landscape:p-6">
                <p id="book-form-guidance" className="mb-5 text-p-xs text-muted">All fields are required. Your demo lasts 30 minutes.</p>
                <noscript><p className="mb-5 text-p-sm">To arrange your demo without JavaScript, <a href={`mailto:${contact.email}`} className="underline underline-offset-4">email the studio</a>.</p></noscript>
                <fieldset disabled={sending} className="m-0 min-w-0 border-0 p-0">
                  <legend className="sr-only">Your details and demo time</legend>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-5 portrait:grid-cols-1">
                    {FIELDS.map((field) => (
                      <TextField key={field.id} {...field} value={details[field.id]} error={errors[field.id]} onChange={setDetail} />
                    ))}

                    {notice && (
                      <p role="status" className="col-span-full rounded-md bg-soft-volt px-4 py-3 text-p-sm font-medium text-forest">
                        {notice}
                      </p>
                    )}
                    {calendar.status === 'error' && <CalendarError code={calendar.code} onRetry={refresh} />}
                    {calendar.status === 'ready' && !ready && <NoAvailability onRetry={refresh} />}
                    {calendar.status === 'loading' && <p role="status" className="col-span-full text-p-xs text-muted">Finding available demo times…</p>}

                    <DatePicker days={days} day={day} disabled={!ready} loading={calendar.status === 'loading'} error={errors.date} onPick={pickDay} />
                    <TimePicker day={day} slot={slot} disabled={!ready || !day} error={errors.slot} onPick={pickSlot} />

                    {ready && (
                      <p className="col-span-full -mt-1 text-p-xs text-muted">
                        Times are in your time zone ({zoneCity(visitorTimeZone())}).
                      </p>
                    )}
                  </div>

                  {failure && <Failure code={failure} />}

                  <button type="submit" className={cn(pillClass('primary', true), 'mt-8 disabled:cursor-not-allowed disabled:opacity-70')} disabled={sending || !ready} aria-busy={sending} aria-describedby="book-form-guidance">
                    <span>{sending ? 'Booking…' : calendar.status === 'loading' ? 'Loading times…' : !ready ? 'No times available' : 'Book my demo'}</span>
                  </button>
                </fieldset>

                {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
                <label aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" value={details.website} onChange={(e) => setDetail('website', e.target.value)} />
                </label>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
