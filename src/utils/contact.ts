import { contact } from '../content'

/** A mailto: link to the studio inbox, with the subject filled in. */
const mailto = (subject: string) => `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`

/** The "Book a demo" buttons. */
export const demoMail = mailto('Book a demo — Creative Seat')

/** The "Get in touch" buttons. */
export const contactMail = mailto('Hello from the Creative Seat website')
