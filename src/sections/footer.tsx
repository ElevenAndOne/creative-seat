import Container from '../components/container'
import Wordmark from '../components/wordmark'
import { socials } from '../content'
import { demoMail } from '../utils/contact'

const LINK = 'text-p-sm text-paper/75 underline decoration-paper/35 underline-offset-[5px] transition-colors hover:text-paper hover:decoration-paper'

/**
 * Footer on Forest, Paper type: the wordmark with the copyright line under it,
 * the site links set small and underlined in the middle, then outlined round
 * social buttons and the "a product of 11&1" credit on the right. Stacks on
 * phones.
 */
export default function SiteFooter() {
  return (
    <footer className="bg-forest py-10 text-paper">
      <Container className="flex items-center justify-between gap-x-12 gap-y-9 tablet:flex-wrap landscape:flex-col landscape:items-start">
        <div className="flex flex-col items-start gap-3">
          <a href="/" id="footer-logo" data-track="nav_click" data-track-location="footer">
            <Wordmark className="w-[170px]" />
          </a>
          <p className="text-p-sm text-paper/60">© {new Date().getFullYear()} Creative Seat. All rights reserved.</p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 tablet:order-last tablet:w-full landscape:order-none" aria-label="Footer navigation">
          <a href="#services" id="footer-nav-services" data-track="nav_click" data-track-location="footer" className={LINK}>Services</a>
          <a href="#resources" id="footer-nav-resources" data-track="nav_click" data-track-location="footer" className={LINK}>Resources</a>
          <a href="#pricing" id="footer-nav-pricing" data-track="nav_click" data-track-location="footer" className={LINK}>Pricing</a>
          <a href={demoMail} id="footer-book-demo" data-track="book_demo_click" data-track-location="footer" className={LINK}>Book a demo</a>
          {/* Reopens the cookie banner (components/cookie-banner.tsx). */}
          <button type="button" id="footer-cookie-settings" data-cookie-settings className={LINK}>
            Cookie settings
          </button>
        </nav>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                id={`footer-social-${social.name.toLowerCase()}`}
                data-track="social_click"
                data-track-location="footer"
                className="group grid size-12 place-items-center rounded-full border border-paper/45 transition-colors hover:border-volt hover:bg-volt focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
                aria-label={social.name}
              >
                {/* The icons are drawn dark: turned Paper on Forest, back to dark on the Volt hover. */}
                <img src={social.icon} alt="" className={`${social.size} brightness-0 invert transition group-hover:invert-0`} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-p-xs text-paper/60">A product of</span>
            <img src="/images/brands/11and1.svg" alt="11&1" className="h-[22px] w-auto" />
          </div>
        </div>
      </Container>
    </footer>
  )
}
