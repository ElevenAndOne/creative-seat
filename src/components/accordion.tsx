import { Accordion as BaseAccordion } from '@base-ui/react/accordion'
import { useReducedMotion } from 'motion/react'

export interface AccordionItem {
  question: string
  answer?: string
}

/**
 * FAQ disclosure list — heading row with a "+" toggle and a hairline rule
 * between items, per the Figma FAQ section. The answer slides open (height +
 * fade) and the icon rotates into an "×".
 */
export default function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: AccordionItem[]
  defaultOpen?: number | null
}) {
  const reduce = useReducedMotion()
  const defaultValue = defaultOpen === null ? [] : [`item-${defaultOpen}`]

  return (
    <BaseAccordion.Root defaultValue={defaultValue} className="group/accordion">
      {items.map((item, i) => {
        const value = `item-${i}`
        return (
          <BaseAccordion.Item key={item.question} value={value} className="border-t border-black/40 first:border-t-0">
            <BaseAccordion.Header>
              <BaseAccordion.Trigger className="group flex w-full items-start justify-between gap-6 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-4 focus-visible:ring-offset-mist">
                <span className="text-2xl font-medium leading-snug">{item.question}</span>
                <span
                  aria-hidden
                  className="mt-0.5 shrink-0 text-4xl leading-none transition-transform duration-300 group-data-[panel-open]:rotate-45"
                >
                  +
                </span>
              </BaseAccordion.Trigger>
            </BaseAccordion.Header>
            {item.answer && (
              <BaseAccordion.Panel
                keepMounted
                className={`h-[var(--accordion-panel-height)] overflow-hidden opacity-100 transition-[height,opacity] ease-[cubic-bezier(0.16,1,0.3,1)] data-[ending-style]:h-0 data-[ending-style]:opacity-0 data-[starting-style]:h-0 data-[starting-style]:opacity-0 ${reduce ? 'duration-0' : 'duration-300'}`}
              >
                <p className="-mt-2 max-w-[510px] pb-7 text-base leading-relaxed text-ink">
                  {item.answer}
                </p>
              </BaseAccordion.Panel>
            )}
          </BaseAccordion.Item>
        )
      })}
    </BaseAccordion.Root>
  )
}
