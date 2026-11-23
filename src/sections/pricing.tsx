import LinkButton from '../components/link-button'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { pricingPlans } from '../content'
import { useCurrency } from '../hooks/useCurrency'
import { cn } from '../utils/cn'
import { demoPage } from '../utils/contact'
import { formatPrice } from '../utils/price'

function Check() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-4 text-forest">
      <path d="M13.3333 4L6 11.3333L2.66667 8" fill="none" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Seat plans, priced in the visitor's own currency only (see hooks/useCurrency).
 * Three cards as the Figma file draws them: a 12px shell holding a sunken
 * panel (name, price, credits and the full-width pill) with the feature list
 * underneath. The featured plan sits on Volt with a Soft Volt panel and the
 * filled pill; the others are Paper with a Chalk panel and the outline pill,
 * so the three read as one set.
 */
export default function Pricing() {
  // Null until the visitor's region is known: the price keeps its space but
  // stays hidden till then, so nobody sees another region's currency.
  const currency = useCurrency()

  return (
    <Section id="pricing" className="bg-chalk" padBottom="md">
      <Heading.H1>
        Simple pricing, <Em>no surprises.</Em>
      </Heading.H1>
      <Paragraph className="mt-6 max-w-[36rem]">
        One monthly fee for your own specialised creative team — no per-project quotes, retainers or surprise invoices.
      </Paragraph>

      {/* Three across, all the height of the tallest; two plus one at tablet, left-aligned with the heading; one full-width column from 768px down, where two would squeeze the prices. */}
      <div className="mt-12 grid grid-cols-3 gap-8 tablet:grid-cols-2 tablet:gap-6 landscape:grid-cols-1">
        {pricingPlans.map((plan) => {
          const featured = plan.featured ?? false
          return (
            <article
              key={plan.id}
              id={`pricing-${plan.id}`}
              className={cn('flex flex-col gap-4 rounded-md p-3 text-ink', featured ? 'bg-volt' : 'bg-paper')}
            >
              <div className={cn('flex flex-col gap-3 rounded-md p-3', featured ? 'bg-soft-volt' : 'bg-chalk')}>
                <div className="flex items-center justify-between gap-2">
                  <Heading.H3Serif>{plan.name}</Heading.H3Serif>
                  {featured && <span className="shrink-0 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-p-xs text-paper">Most popular</span>}
                </div>

                <div>
                  <p className="flex items-baseline gap-1">
                    <span className={cn('text-[2.25rem] font-extrabold leading-[2.75rem] tracking-[-0.0278em] transition-opacity duration-300', plan.price && !currency && 'opacity-0')}>
                      {plan.price ? formatPrice(plan.price[currency ?? 'USD'], currency ?? 'USD') : 'Custom'}
                    </span>
                    {plan.price && <span className="text-p-sm">/ month</span>}
                  </p>
                  {/* Enterprise has no credit line, but keeps its height so the panels line up. */}
                  <p aria-hidden={!plan.credits} className={cn('mt-1 text-ui font-semibold', !plan.credits && 'invisible')}>
                    {plan.credits ?? 0} credits
                  </p>
                </div>

                <LinkButton
                  href={demoPage}
                  id={`pricing-${plan.id}-book-demo`}
                  data-track="book_demo_click"
                  data-track-location={`pricing_${plan.id.replace('-', '_')}`}
                  variant={featured ? 'primary' : 'outline'}
                  full
                >
                  Book a demo
                </LinkButton>
              </div>

              <div className="flex flex-col gap-3 px-1">
                <Paragraph.Small className="font-medium">{plan.report}</Paragraph.Small>
                <ul className="flex flex-col gap-1 text-p-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className={cn('grid size-6 shrink-0 place-items-center rounded-full', featured ? 'bg-soft-volt' : 'bg-chalk')}>
                        <Check />
                      </span>
                      <span className="py-0.5">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          )
        })}
      </div>
    </Section>
  )
}
