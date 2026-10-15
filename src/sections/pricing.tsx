import Button from '../components/autton'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { pricingPlans } from '../content'
import { useCurrency, type Currency } from '../hooks/useCurrency'
import { cn } from '../utils/cn'

// A fixed locale, so the prerendered and hydrated prices match character for character.
const formatPrice = (amount: number, currency: Currency) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)

function Check() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className="mt-[3px] size-4 shrink-0">
      <path d="m4.5 10.4 3.6 3.6 7.4-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Seat plans, priced in the visitor's own currency only (see hooks/useCurrency).
 * The featured plan sits on Soft Volt — the layout's accent — with the filled
 * pill; the others carry the same full-width pill in outline, so the three
 * cards read as one set.
 */
export default function Pricing() {
  // Null until the visitor's region is known: the price keeps its space but
  // stays hidden till then, so nobody sees another region's currency.
  const currency = useCurrency()

  return (
    <Section id="pricing" pad="md">
      <div className="border-t border-ink pt-xlg">
        <Eyebrow>Pricing</Eyebrow>
        <Heading.H1 className="mt-4">
          Simple pricing, <Em>no surprises.</Em>
        </Heading.H1>
        <Paragraph className="mt-5 max-w-[31rem]">
          One monthly fee for your own specialised creative team — no per-project quotes, retainers or surprise invoices.
        </Paragraph>
      </div>

      <div className="mt-[50px] grid grid-cols-3 gap-[24px] tablet:mx-auto tablet:max-w-[28rem] tablet:grid-cols-1">
        {pricingPlans.map((plan) => {
          const featured = plan.featured ?? false
          return (
            <article
              key={plan.id}
              id={`pricing-${plan.id}`}
              className={cn('relative flex flex-col rounded-card p-8', featured ? 'bg-soft-volt text-forest' : 'border border-line text-ink')}
            >
              <div className="flex items-center justify-between gap-3">
                <Heading.H3>{plan.name}</Heading.H3>
                {featured && <span className="rounded-full bg-ink px-3 py-1.5 text-p-xs font-medium leading-none text-paper">Most popular</span>}
              </div>

              <p className="mt-6 flex items-baseline gap-1.5">
                <span className={cn('text-[2.75rem] font-bold leading-none tracking-[-0.03em] transition-opacity duration-300', plan.price && !currency && 'opacity-0')}>
                  {plan.price ? formatPrice(plan.price[currency ?? 'USD'], currency ?? 'USD') : 'Custom'}
                </span>
                {plan.price && <span className="text-p-sm">/ month</span>}
              </p>
              {/* Enterprise has no credit line, but keeps its height so the cards' rules line up. */}
              <p aria-hidden={!plan.credits} className={cn('mt-3 text-p-sm font-semibold', !plan.credits && 'invisible')}>
                {plan.credits ?? 0} credits
              </p>

              <Paragraph.Small className={cn('mt-6 border-y py-5 font-medium', featured ? 'border-forest/20' : 'border-line')}>
                {plan.report}
              </Paragraph.Small>

              <ul className="mt-6 space-y-2.5 text-p-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5">
                    <Check />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-9">
                <Button
                  href="#contact"
                  id={`pricing-${plan.id}-book-demo`}
                  data-track="book_demo_click"
                  data-track-location={`pricing_${plan.id.replace('-', '_')}`}
                  variant={featured ? 'primary' : 'outline'}
                  full
                >
                  Book a demo
                </Button>
              </div>
            </article>
          )
        })}
      </div>
    </Section>
  )
}
