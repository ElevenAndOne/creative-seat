import { Popover } from '@base-ui/react/popover'
import { motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode, type RefObject } from 'react'
import Button, { PillArrow } from '../components/autton'
import Em from '../components/em'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { pillClass } from '../components/pill'
import { track } from '../utils/analytics'
import {
  BookingError,
  formatDay,
  formatTime,
  formatWeekday,
  formatZone,
  groupByDay,
  loadAvailability,
  requestBooking,
  visitorTimeZone,
  zoneCity,
  type Availability,
  type Booking,
  type BookingErrorCode,
  type SlotDay,
} from '../utils/booking'
import { cn } from '../utils/cn'

const EASE = [0.16, 1, 0.3, 1] as const

/** Height of the fixed header, which the section clears (as in the hero). */
const HEADER = '4.75rem'

type Details = { firstName: string; lastName: string; email: string; phone: string; company: string; role: string; website: string }

type TextFieldId = Exclude<keyof Details, 'website'>

type Field = TextFieldId | 'date' | 'slot'

type Calendar =
  | { status: 'loading' }
  | { status: 'ready'; data: Availability }
  | { status: 'error'; code: BookingErrorCode }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** Digits with the usual separators, at least seven characters. */
const PHONE = /^\+?[\d\s().-]{7,}$/

/** The form's text fields, in reading order — two to a row. */
const FIELDS: { id: TextFieldId; label: string; type?: string; autoComplete: string; error: string }[] = [
  { id: 'firstName', label: 'First name', autoComplete: 'given-name', error: 'Enter your first name.' },
  { id: 'lastName', label: 'Last name', autoComplete: 'family-name', error: 'Enter your last name.' },
  { id: 'email', label: 'Email', type: 'email', autoComplete: 'email', error: 'Enter an email address like name@company.com.' },
  { id: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', error: 'Enter a phone number we can reach you on.' },
  { id: 'company', label: 'Company', autoComplete: 'organization', error: 'Enter your company’s name.' },
  { id: 'role', label: 'Job role', autoComplete: 'organization-title', error: 'Enter your job role.' },
]

/** The errors, minus one that's been dealt with. */
const without = (errors: Partial<Record<Field, string>>, field: Field) => {
  const rest = { ...errors }
  delete rest[field]
  return rest
}

/**
 * Book a demo, as the page's first screen: on the night gradient, the pitch on
 * the left and the form on the right — six details two to a row, then a date
 * and a time, each picked from a popover over live Google Calendar
 * availability (pages/api/slots.ts). Submitting books the slot
 * (pages/api/book.ts).
 *
 * Below 992px it stacks: pitch, then the form.
 */
export default function BookDemo() {
  const reduce = useReducedMotion() ?? false

  const [details, setDetails] = useState<Details>({ firstName: '', lastName: '', email: '', phone: '', company: '', role: '', website: '' })
  const [calendar, setCalendar] = useState<Calendar>({ status: 'loading' })
  const [dayKey, setDayKey] = useState<string | null>(null)
  const [slot, setSlot] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [notice, setNotice] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [failure, setFailure] = useState<BookingErrorCode | null>(null)
  const [booking, setBooking] = useState<Booking | null>(null)

  const cardRef = useRef<HTMLDivElement>(null)

  const fetchCalendar = useCallback(() => {
    const controller = new AbortController()
    loadAvailability(controller.signal)
      .then((data) => setCalendar({ status: 'ready', data }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setCalendar({ status: 'error', code: error instanceof BookingError ? error.code : 'unavailable' })
      })
    return () => controller.abort()
  }, [])

  // Availability loads straight away.
  useEffect(fetchCalendar, [fetchCalendar])

  const refresh = () => {
    setCalendar({ status: 'loading' })
    fetchCalendar()
  }

  // The confirmation is shorter than the form: on a phone, bring its top back into view.
  useEffect(() => {
    const card = cardRef.current
    if (booking && card && card.getBoundingClientRect().top < 80) card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }, [booking, reduce])

  const days = useMemo(() => (calendar.status === 'ready' ? groupByDay(calendar.data.slots) : []), [calendar])
  const day = days.find((d) => d.key === dayKey) ?? null

  const setDetail = (field: keyof Details, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }))
    if (field in errors) setErrors((current) => without(current, field as Field))
  }

  const pickDay = (key: string) => {
    setDayKey(key)
    // A time from another day no longer applies.
    if (slot && !days.find((d) => d.key === key)?.slots.some((s) => s.start === slot)) setSlot(null)
    setErrors((current) => without(current, 'date'))
  }

  const pickSlot = (start: string) => {
    setSlot(start)
    setNotice(null)
    setErrors((current) => without(current, 'slot'))
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sending) return

    const found: Partial<Record<Field, string>> = {}
    for (const { id, error } of FIELDS) if (!details[id].trim()) found[id] = error
    if (details.email.trim() && !EMAIL.test(details.email.trim())) found.email = FIELDS[2].error
    if (details.phone.trim() && !PHONE.test(details.phone.trim())) found.phone = FIELDS[3].error
    if (!day) found.date = 'Select a date.'
    else if (!slot) found.slot = 'Select a time.'
    setErrors(found)

    const first = [...FIELDS.map((f) => f.id), 'date', 'slot'].find((field) => found[field as Field])
    if (first) return document.getElementById(`book-${first}`)?.focus()

    setSending(true)
    setFailure(null)
    try {
      const result = await requestBooking({
        start: slot!,
        firstName: details.firstName,
        lastName: details.lastName,
        email: details.email,
        phone: details.phone,
        company: details.company,
        role: details.role,
        timeZone: visitorTimeZone(),
        website: details.website,
      })
      setBooking(result)
      track('generate_lead', { form: 'book_demo' })
    } catch (error) {
      const code = error instanceof BookingError ? error.code : 'unavailable'
      if (code === 'slot_taken') {
        // Someone got there first: fresh availability, and a nudge to pick again.
        setSlot(null)
        setNotice('That time has just been taken. Select another one.')
        refresh()
      } else {
        setFailure(code)
      }
    } finally {
      setSending(false)
    }
  }

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: reduce ? { duration: 0 } : { duration: 0.7, ease: EASE, delay },
  })

  const ready = calendar.status === 'ready' && days.length > 0

  return (
    <section id="book" className="relative isolate overflow-hidden bg-night text-paper">
      <div
        className="mx-auto grid w-full max-w-[var(--container-width)] grid-cols-[minmax(0,1fr)_minmax(0,36rem)] items-center gap-x-[clamp(3rem,7vw,8rem)] gap-y-12 pb-[var(--section-pad-md)] tablet:grid-cols-1"
        style={{ paddingTop: `calc(${HEADER} + clamp(2rem, 8dvh, 5rem))` }}
      >
        <div className="flex flex-col items-start">
          <motion.div {...rise(0.05)}>
            <Heading.H1 as="h1" className="max-w-[8em] text-[clamp(3rem,1.9rem+4.1vw,5.25rem)] leading-[0.95] tracking-[-0.015em] tablet:max-w-[10em]">
              <span className="block">Pull up a seat.</span> <Em>We’ll show you around.</Em>
            </Heading.H1>
          </motion.div>
          <motion.div {...rise(0.18)} className="mt-7 max-w-[30rem]">
            <Paragraph.Big className="text-paper/85">
              Thirty minutes on a video call with a delivery lead from the studio. Bring your backlog and we’ll show you how a seat would take it on.
            </Paragraph.Big>
          </motion.div>
        </div>

        <motion.div {...rise(0.3)}>
          <div ref={cardRef} className="scroll-mt-24 overflow-hidden rounded-frame bg-paper text-ink shadow-[0_40px_90px_-40px_color-mix(in_oklab,var(--color-ink)_90%,transparent)]">
            {booking ? (
              <Confirmation booking={booking} name={details.firstName} email={details.email} reduce={reduce} />
            ) : (
              <form noValidate onSubmit={submit} aria-label="Book a demo" className="relative p-9 landscape:p-6">
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
                  {calendar.status === 'ready' && days.length === 0 && (
                    <p role="status" className="col-span-full rounded-md border border-line px-4 py-3 text-p-sm">
                      Every slot over the next two weeks is booked. Check back in a few days.
                    </p>
                  )}

                  <DatePicker days={days} day={day} disabled={!ready} loading={calendar.status === 'loading'} error={errors.date} onPick={pickDay} />
                  <TimePicker day={day} slot={slot} disabled={!ready || !day} error={errors.slot} onPick={pickSlot} />

                  {ready && (
                    <p className="col-span-full -mt-1 text-p-xs text-muted">
                      Times are in your time zone ({zoneCity(visitorTimeZone())}).
                    </p>
                  )}
                </div>

                {failure && <Failure code={failure} />}

                <button type="submit" className={cn(pillClass('primary', true), 'mt-8 disabled:cursor-wait disabled:opacity-70')} disabled={sending} aria-busy={sending}>
                  <span>{sending ? 'Booking…' : 'Book my demo'}</span>
                  <PillArrow />
                </button>

                {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
                <label aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
                  Website
                  <input tabIndex={-1} autoComplete="off" value={details.website} onChange={(e) => setDetail('website', e.target.value)} />
                </label>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ---- The form's parts ---------------------------------------------------- */

const INPUT =
  'mt-2 block h-12 w-full rounded-md border border-ink/20 bg-paper px-4 text-p-md text-ink transition-colors placeholder:text-ink/35 hover:border-ink/45 focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink aria-[invalid=true]:border-2 aria-[invalid=true]:border-ink'

/** A field's label, with the required mark (in Ink — the brand has no red). */
function Label({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <span id={id} className="text-p-sm font-medium">
      {children}
      <span aria-hidden className="ml-0.5 text-ink/55">
        *
      </span>
    </span>
  )
}

function TextField({
  id,
  label,
  value,
  error,
  onChange,
  type = 'text',
  autoComplete,
}: {
  id: TextFieldId
  label: string
  value: string
  error?: string
  onChange: (field: keyof Details, value: string) => void
  type?: string
  autoComplete: string
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        id={`book-${id}`}
        type={type}
        autoComplete={autoComplete}
        required
        maxLength={id === 'email' ? 254 : 120}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `book-${id}-error` : undefined}
        className={INPUT}
      />
      {error && <FieldError id={`book-${id}-error`}>{error}</FieldError>}
    </label>
  )
}

/** The popovers' shared look: a Paper card that scales in from its trigger. */
const POPUP =
  'origin-[var(--transform-origin)] rounded-card border border-line bg-paper p-4 text-ink shadow-[0_24px_60px_-24px_color-mix(in_oklab,var(--color-ink)_55%,transparent)] outline-none transition-[opacity,scale] duration-150 ease-out data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 motion-reduce:transition-none'

/** A field that looks like an input and opens a popover — the date and time pickers' trigger. */
function PickerTrigger({ id, labelId, value, placeholder, disabled, error, icon }: { id: string; labelId: string; value: string | null; placeholder: string; disabled: boolean; error?: string; icon: ReactNode }) {
  return (
    <Popover.Trigger
      id={id}
      disabled={disabled}
      aria-labelledby={`${labelId} ${id}`}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(INPUT, 'flex items-center justify-between gap-3 text-left enabled:cursor-pointer disabled:cursor-not-allowed disabled:bg-chalk/40 data-[popup-open]:border-ink')}
    >
      <span className={cn('truncate', !value && 'text-ink/40')}>{value ?? placeholder}</span>
      <span aria-hidden className="shrink-0 text-ink/70">
        {icon}
      </span>
    </Popover.Trigger>
  )
}

function DatePicker({ days, day, disabled, loading, error, onPick }: { days: SlotDay[]; day: SlotDay | null; disabled: boolean; loading: boolean; error?: string; onPick: (key: string) => void }) {
  const [open, setOpen] = useState(false)
  const focusRef = useRef<HTMLButtonElement>(null)
  return (
    <div>
      <Label id="book-date-label">Date</Label>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <PickerTrigger
          id="book-date"
          labelId="book-date-label"
          value={day && `${day.weekday} ${day.date} ${day.month}`}
          placeholder={loading ? 'Loading dates…' : 'Select a date'}
          disabled={disabled}
          error={error}
          icon={<CalendarIcon />}
        />
        <Popover.Portal>
          <Popover.Positioner side="bottom" align="start" sideOffset={8} collisionPadding={16} className="z-[60]">
            <Popover.Popup initialFocus={focusRef} className={cn(POPUP, 'w-[19rem]')}>
              <MonthCalendar
                days={days}
                selected={day?.key ?? null}
                focusRef={focusRef}
                onPick={(key) => {
                  onPick(key)
                  setOpen(false)
                }}
              />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
      {error && <FieldError id="book-date-error">{error}</FieldError>}
    </div>
  )
}

const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })
const longDateFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
const pad = (n: number) => String(n).padStart(2, '0')

/**
 * A month at a time, weeks starting Monday. Only days with a free slot can be
 * picked; a fully booked one is struck through, and the rest are faded out.
 */
function MonthCalendar({ days, selected, focusRef, onPick }: { days: SlotDay[]; selected: string | null; focusRef: RefObject<HTMLButtonElement | null>; onPick: (key: string) => void }) {
  const byKey = new Map(days.map((d) => [d.key, d]))
  const months = [...new Set(days.map((d) => d.key.slice(0, 7)))]
  const [index, setIndex] = useState(() => Math.max(0, selected ? months.indexOf(selected.slice(0, 7)) : 0))

  const [year, month] = months[index].split('-').map(Number)
  const lead = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7
  const length = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const keys = Array.from({ length }, (_, i) => `${year}-${pad(month)}-${pad(i + 1)}`)
  // Focus lands on the chosen day, or the month's first one that's open.
  const focusKey = selected && keys.includes(selected) ? selected : keys.find((k) => byKey.get(k)?.open)

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-p-sm font-semibold" aria-live="polite">
          {monthFormat.format(new Date(Date.UTC(year, month - 1, 1)))}
        </p>
        {months.length > 1 && (
          <div className="flex gap-1">
            <MonthButton label="Previous month" disabled={index === 0} onClick={() => setIndex(index - 1)} flip />
            <MonthButton label="Next month" disabled={index === months.length - 1} onClick={() => setIndex(index + 1)} />
          </div>
        )}
      </div>
      <div aria-hidden className="mt-3 grid grid-cols-7 text-center text-p-xs text-muted">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-y-1">
        {Array.from({ length: lead }, (_, i) => (
          <span key={`lead-${i}`} />
        ))}
        {keys.map((key, i) => {
          const info = byKey.get(key)
          const chosen = key === selected
          const label = longDateFormat.format(new Date(Date.UTC(year, month - 1, i + 1)))
          return (
            <button
              key={key}
              ref={key === focusKey ? focusRef : undefined}
              type="button"
              disabled={!info?.open}
              onClick={() => onPick(key)}
              aria-pressed={chosen}
              aria-label={info ? (info.open ? label : `${label}, fully booked`) : `${label}, unavailable`}
              className={cn(
                'mx-auto grid size-9 place-items-center rounded-full text-p-sm tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink',
                info?.open && !chosen && 'cursor-pointer font-semibold hover:bg-chalk',
                info && !info.open && 'text-ink/30 line-through',
                !info && 'text-ink/20',
                chosen && 'bg-ink font-semibold text-volt',
              )}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MonthButton({ label, disabled, onClick, flip }: { label: string; disabled: boolean; onClick: () => void; flip?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-ink enabled:hover:bg-chalk disabled:text-ink/25"
    >
      <svg viewBox="0 0 16 16" aria-hidden className={cn('size-3.5', flip && 'rotate-180')}>
        <path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

/** That day's half hours; booked ones are struck through and can't be picked. */
function TimePicker({ day, slot, disabled, error, onPick }: { day: SlotDay | null; slot: string | null; disabled: boolean; error?: string; onPick: (start: string) => void }) {
  const [open, setOpen] = useState(false)
  const focusRef = useRef<HTMLButtonElement>(null)
  const focusStart = day?.slots.find((s) => s.start === slot)?.start ?? day?.slots.find((s) => s.free)?.start
  return (
    <div>
      <Label id="book-slot-label">Time</Label>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <PickerTrigger
          id="book-slot"
          labelId="book-slot-label"
          value={slot && `${formatTime(slot)} ${formatZone(slot)}`}
          placeholder="Select a time"
          disabled={disabled}
          error={error}
          icon={<Chevron />}
        />
        <Popover.Portal>
          <Popover.Positioner side="bottom" align="end" sideOffset={8} collisionPadding={16} className="z-[60]">
            <Popover.Popup initialFocus={focusRef} className={cn(POPUP, 'max-h-[min(22rem,var(--available-height))] w-[17rem] overflow-y-auto')}>
              {day && (
                <>
                  <p className="text-p-sm font-semibold">
                    {formatWeekday(day.slots[0].start)} {day.date} {day.month}
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {day.slots.map((s) => (
                      <button
                        key={s.start}
                        ref={s.start === focusStart ? focusRef : undefined}
                        type="button"
                        disabled={!s.free}
                        aria-pressed={s.start === slot}
                        aria-label={s.free ? formatTime(s.start) : `${formatTime(s.start)}, booked`}
                        onClick={() => {
                          onPick(s.start)
                          setOpen(false)
                        }}
                        className={cn(
                          'h-9 rounded-full border text-p-sm font-medium tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink',
                          s.start === slot ? 'border-ink bg-ink text-paper' : s.free ? 'cursor-pointer border-ink/20 hover:border-ink' : 'border-transparent bg-chalk/60 text-ink/30 line-through',
                        )}
                      >
                        {formatTime(s.start)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
      {error && <FieldError id="book-slot-error">{error}</FieldError>}
    </div>
  )
}

function CalendarError({ code, onRetry }: { code: BookingErrorCode; onRetry: () => void }) {
  return (
    <div role="alert" className="col-span-full rounded-md border border-line px-4 py-3">
      {code === 'not_configured' ? (
        <Paragraph.Small>Online booking isn’t open just yet. Check back soon.</Paragraph.Small>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Paragraph.Small>We couldn’t load the calendar. Check your connection and try again.</Paragraph.Small>
          <button type="button" onClick={onRetry} className={pillClass('outline')}>
            <span>Try again</span>
            <PillArrow />
          </button>
        </div>
      )}
    </div>
  )
}

function Confirmation({ booking, name, email, reduce }: { booking: Booking; name: string; email: string; reduce: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null)
  // The form is gone: move focus to what replaced it.
  useEffect(() => ref.current?.focus({ preventScroll: true }), [])

  const when = `${formatDay(booking.start)} at ${formatTime(booking.start)} ${formatZone(booking.start)}`
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
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
        Your 30-minute demo is booked for {when}.{' '}
        {booking.invited ? (
          <>The calendar invite and video link are on their way to {email}.</>
        ) : (
          <>We’ll send the calendar invite and video link to {email}.</>
        )}
      </Paragraph>
      {booking.sample && <p className="mt-5 border-l-2 border-ink/25 pl-3 text-p-xs text-muted">Sample booking — Google Calendar isn’t connected yet, so nothing was saved or sent.</p>}
      <Button href="/#work" id="book-see-work" data-track="see_work_click" data-track-location="book_demo" variant="outline" className="mt-9">
        See our work
      </Button>
    </motion.div>
  )
}

function Failure({ code }: { code: BookingErrorCode }) {
  return (
    <p role="alert" className="mt-6 rounded-md bg-soft-volt px-4 py-3 text-p-sm font-medium text-forest">
      {code === 'not_configured' ? (
        <>Online booking isn’t open just yet. Check back soon.</>
      ) : code === 'invalid' ? (
        <>Something in your details didn’t go through. Check them and try again.</>
      ) : (
        <>Your booking didn’t go through. Try again in a moment.</>
      )}
    </p>
  )
}

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <span id={id} className="mt-2 flex items-start gap-1.5 text-p-xs font-semibold">
      <span aria-hidden className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-ink text-[0.625rem] font-bold text-paper">
        !
      </span>
      {children}
    </span>
  )
}

function Tick({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={className}>
      <path d="m4.5 10.4 3.6 3.6 7.4-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className="size-[1.125rem]">
      <rect x="3" y="4.5" width="14" height="12.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 8.5h14M7 2.75v3.5M13 2.75v3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-4">
      <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
