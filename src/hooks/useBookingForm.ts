import { useCallback, useEffect, useMemo, useRef, useState, type SubmitEvent } from 'react'
import { EMAIL, FIELDS, PHONE, type Details, type Field } from '../components/booking/model'
import { track } from '../utils/analytics'
import { BookingError, campaign, groupByDay, loadAvailability, requestBooking, visitorTimeZone, type Availability, type Booking, type BookingErrorCode } from '../utils/booking'

type Calendar =
  | { status: 'loading' }
  | { status: 'ready'; data: Availability }
  | { status: 'error'; code: BookingErrorCode }
type Selection = { dayKey: string | null; slot: string | null }
type Errors = Partial<Record<Field, string>>

const without = (errors: Errors, field: Field): Errors => {
  const rest = { ...errors }
  delete rest[field]
  return rest
}

/** Owns the booking workflow; picker disclosure state remains with each picker. */
export function useBookingForm() {
  const [details, setDetails] = useState<Details>({ firstName: '', lastName: '', email: '', phone: '', company: '', role: '', website: '' })
  const [calendar, setCalendar] = useState<Calendar>({ status: 'loading' })
  const [selection, setSelection] = useState<Selection>({ dayKey: null, slot: null })
  const [errors, setErrors] = useState<Errors>({})
  const [notice, setNotice] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [failure, setFailure] = useState<BookingErrorCode | null>(null)
  const [booking, setBooking] = useState<Booking | null>(null)
  const availabilityRequest = useRef<AbortController | null>(null)
  const mounted = useRef(false)
  const submitting = useRef(false)
  const focusAfterRefresh = useRef(false)

  const fetchCalendar = useCallback(() => {
    // Every refresh supersedes its predecessor, including requests started by a retry.
    availabilityRequest.current?.abort()
    const controller = new AbortController()
    availabilityRequest.current = controller
    void loadAvailability(controller.signal)
      .then((data) => {
        if (controller.signal.aborted || !mounted.current) return
        const freshDays = groupByDay(data.slots)
        setSelection((current) => {
          const day = freshDays.find((candidate) => candidate.key === current.dayKey && candidate.open)
          return {
            dayKey: day?.key ?? null,
            slot: day?.slots.find((candidate) => candidate.start === current.slot && candidate.free)?.start ?? null,
          }
        })
        setCalendar({ status: 'ready', data })
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted && mounted.current) setCalendar({ status: 'error', code: error instanceof BookingError ? error.code : 'unavailable' })
      })
  }, [])

  const refresh = () => {
    setCalendar({ status: 'loading' })
    fetchCalendar()
  }

  useEffect(() => {
    mounted.current = true
    fetchCalendar()
    return () => {
      mounted.current = false
      availabilityRequest.current?.abort()
    }
  }, [fetchCalendar])

  const days = useMemo(() => calendar.status === 'ready' ? groupByDay(calendar.data.slots) : [], [calendar])
  const ready = calendar.status === 'ready' && days.some((candidate) => candidate.open)
  const day = days.find((candidate) => candidate.key === selection.dayKey && candidate.open) ?? null
  const slot = day?.slots.find((candidate) => candidate.start === selection.slot && candidate.free)?.start ?? null

  useEffect(() => {
    if (calendar.status === 'loading' || !focusAfterRefresh.current) return
    focusAfterRefresh.current = false
    const target = ready ? `book-${day ? 'slot' : 'date'}` : 'book-calendar-status'
    document.getElementById(target)?.focus()
  }, [calendar.status, day, ready])

  const setDetail = (field: keyof Details, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }))
    if (field !== 'website') setErrors((current) => without(current, field))
  }

  const pickDay = (key: string) => {
    if (!days.some((candidate) => candidate.key === key && candidate.open)) return
    setSelection((current) => ({ dayKey: key, slot: key === current.dayKey ? current.slot : null }))
    setErrors((current) => without(without(current, 'date'), 'slot'))
  }

  const pickSlot = (start: string) => {
    if (!day?.slots.some((candidate) => candidate.start === start && candidate.free)) return
    setSelection((current) => ({ ...current, slot: start }))
    setNotice(null)
    setErrors((current) => without(current, 'slot'))
  }

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current || !ready) return

    const found: Errors = {}
    for (const { id, error, maxLength } of FIELDS) {
      if (!details[id].trim() || details[id].trim().length > maxLength) found[id] = error
    }
    if (details.email.trim() && !EMAIL.test(details.email.trim())) found.email = FIELDS[2].error
    if (details.phone.trim() && !PHONE.test(details.phone.trim())) found.phone = FIELDS[3].error
    if (!day) found.date = 'Select a date.'
    else if (!slot) found.slot = 'Select a time.'
    setErrors(found)
    const first = [...FIELDS.map((field) => field.id), 'date', 'slot'].find((field) => found[field as Field])
    if (first) return document.getElementById(`book-${first}`)?.focus()

    submitting.current = true
    setSending(true)
    setFailure(null)
    try {
      const result = await requestBooking({ ...details, start: slot!, timeZone: visitorTimeZone(), utm: campaign() })
      if (!mounted.current) return
      setBooking(result)
      track('generate_lead', { form: 'book_demo' })
    } catch (error: unknown) {
      if (!mounted.current) return
      const code = error instanceof BookingError ? error.code : 'unavailable'
      if (code === 'slot_taken') {
        setSelection((current) => ({ ...current, slot: null }))
        setNotice('That time has just been taken. Your details are saved here. Select another time.')
        focusAfterRefresh.current = true
        refresh()
      } else {
        setFailure(code)
      }
    } finally {
      submitting.current = false
      if (mounted.current) setSending(false)
    }
  }

  return { details, calendar, days, day, slot, errors, notice, sending, failure, booking, ready, refresh, setDetail, pickDay, pickSlot, submit }
}
