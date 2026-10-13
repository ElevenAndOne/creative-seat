import { Accordion as BaseAccordion } from '@base-ui/react/accordion'

export interface AccordionItem {
  question: string
  answer?: string
}

/**
 * FAQ disclosure list — question row with a "+" toggle and a hairline rule
 * under every item, per the Figma FAQ section. The answer slides open (height +
 * fade) and the "+" swaps for the violet "×".
 */
export default function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: AccordionItem[]
  defaultOpen?: number | null
}) {
  const defaultValue = defaultOpen === null ? [] : [`item-${defaultOpen}`]

  return (
    <BaseAccordion.Root defaultValue={defaultValue} className="font-inter">
      {items.map((item, i) => {
        const value = `item-${i}`
        return (
          <BaseAccordion.Item key={item.question} value={value} className="border-b border-black/18">
            <BaseAccordion.Header>
              {/* An open item tightens the gap under its question to the design's 15px. */}
              <BaseAccordion.Trigger className="group flex w-full items-center justify-between gap-6 py-[26px] text-left outline-none transition-[padding] duration-300 focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-4 focus-visible:ring-offset-mist data-[panel-open]:pb-[15px]">
                <span className="text-h4 font-semibold text-ink">{item.question}</span>
                <span aria-hidden className="relative size-5 shrink-0">
                  <img src="/images/icons/plus.svg" alt="" className="absolute inset-0 size-full transition-opacity duration-200 group-data-[panel-open]:opacity-0" />
                  <img src="/images/icons/close.svg" alt="" className="absolute inset-0 size-full opacity-0 transition-opacity duration-200 group-data-[panel-open]:opacity-100" />
                </span>
              </BaseAccordion.Trigger>
            </BaseAccordion.Header>
            {item.answer && (
              <BaseAccordion.Panel
                keepMounted
                className="h-[var(--accordion-panel-height)] overflow-hidden opacity-100 transition-[height,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[ending-style]:h-0 data-[ending-style]:opacity-0 data-[starting-style]:h-0 data-[starting-style]:opacity-0 motion-reduce:duration-0"
              >
                <p className="max-w-[40rem] pb-[26px] text-[15px] leading-[1.65] text-graphite">
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
