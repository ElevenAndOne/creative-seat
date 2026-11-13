import { Popover } from '@base-ui/react/popover'
import { useRef, useState, type ReactNode, type RefObject } from 'react'
import { formatTime, formatZone, formatWeekday, type SlotDay } from '../../utils/booking'
import { cn } from '../../utils/cn'
import { FieldError, INPUT, Label } from './fields'

/** The popovers' shared look: a Paper card that scales in from its trigger. */
const POPUP =
  'origin-[var(--transform-origin)] rounded-card border border-line bg-paper p-4 text-ink shadow-[0_24px_60px_-24px_color-mix(in_oklab,var(--color-ink)_55%,transparent)] outline-none transition-[opacity,scale] duration-150 ease-out data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0'

/** A field that looks like an input and opens a popover — the date and time pickers' trigger. */
function PickerTrigger({ id, labelId, value, placeholder, disabled, error, icon }: { id: string; labelId: string; value: string | null; placeholder: string; disabled: boolean; error?: string; icon: ReactNode }) {
  return (
    <Popover.Trigger
      id={id}
      disabled={disabled}
      aria-labelledby={`${labelId} ${id}-value`}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(INPUT, 'flex items-center justify-between gap-3 text-left enabled:cursor-pointer disabled:cursor-not-allowed disabled:bg-chalk/40 data-[popup-open]:border-ink')}
    >
      <span id={`${id}-value`} className={cn('truncate', !value && 'text-muted')}>{value ?? placeholder}</span>
      <span aria-hidden className="shrink-0 text-ink/70">
        {icon}
      </span>
    </Popover.Trigger>
  )
}

export function DatePicker({ days, day, disabled, loading, error, onPick }: { days: SlotDay[]; day: SlotDay | null; disabled: boolean; loading: boolean; error?: string; onPick: (key: string) => void }) {
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
            <Popover.Popup aria-label="Choose a demo date" initialFocus={focusRef} className={cn(POPUP, 'w-[19rem] max-w-[calc(100vw-2rem)]')}>
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

  const currentMonth = months[Math.min(index, months.length - 1)]
  if (!currentMonth) return <p role="status">No dates are available. Close this picker and refresh the calendar.</p>
  const [year, month] = currentMonth.split('-').map(Number)
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
export function TimePicker({ day, slot, disabled, error, onPick }: { day: SlotDay | null; slot: string | null; disabled: boolean; error?: string; onPick: (start: string) => void }) {
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
            <Popover.Popup aria-label="Choose a demo time" initialFocus={focusRef} className={cn(POPUP, 'max-h-[min(22rem,var(--available-height))] w-[17rem] max-w-[calc(100vw-2rem)] overflow-y-auto')}>
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
