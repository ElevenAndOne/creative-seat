export type Details = { firstName: string; lastName: string; email: string; phone: string; company: string; role: string; website: string }

export type TextFieldId = Exclude<keyof Details, 'website'>

export type Field = TextFieldId | 'date' | 'slot'


/** The form's text fields, in reading order — two to a row. */
export const FIELDS: { id: TextFieldId; label: string; type?: string; autoComplete: string; maxLength: number; error: string }[] = [
  { id: 'firstName', label: 'First name', autoComplete: 'given-name', maxLength: BOOKING_LIMITS.firstName, error: 'Enter your first name.' },
  { id: 'lastName', label: 'Last name', autoComplete: 'family-name', maxLength: BOOKING_LIMITS.lastName, error: 'Enter your last name.' },
  { id: 'email', label: 'Email', type: 'email', autoComplete: 'email', maxLength: BOOKING_LIMITS.email, error: 'Enter an email address like name@company.com.' },
  { id: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', maxLength: BOOKING_LIMITS.phone, error: 'Enter a phone number we can reach you on.' },
  { id: 'company', label: 'Company', autoComplete: 'organization', maxLength: BOOKING_LIMITS.company, error: 'Enter your company’s name.' },
  { id: 'role', label: 'Job role', autoComplete: 'organization-title', maxLength: BOOKING_LIMITS.role, error: 'Enter your job role.' },
]
import { BOOKING_LIMITS } from '../../utils/booking-fields'
export { EMAIL, PHONE } from '../../utils/booking-fields'

