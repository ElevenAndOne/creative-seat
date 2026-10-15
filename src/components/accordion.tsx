import { Accordion as BaseAccordion } from '@base-ui/react/accordion'
import { useRef } from 'react'

export interface AccordionItem {
  question: string
  answer?: string
}

/**
 * FAQ disclosure list — question row with a "+" toggle and a hairline rule
 * under every item. The answer slides open (height + fade) and the "+" turns
 * 45° into a "×", the brand's one hover/open gesture.
 */
export default function Accordion({
  items,
  defaultOpen = 0,
  idPrefix,
  onOpen,
}: {
  items: AccordionItem[]
  defaultOpen?: number | null
  /** Gives each question an id, `<idPrefix>-1`, `-2`…, for analytics and deep links. */
  idPrefix?: string
  /** Called with the item a visitor opens (not the ones they close). */
  onOpen?: (item: AccordionItem) => void
}) {
  const defaultValue = defaultOpen === null ? [] : [`item-${defaultOpen}`]
  const openRef = useRef<unknown[]>(defaultValue)

  const onValueChange = (value: unknown[]) => {
    const opened = value.find((v) => !openRef.current.includes(v))
    openRef.current = value
    if (opened !== undefined) onOpen?.(items[Number(String(opened).slice('item-'.length))])
  }

  return (
    <BaseAccordion.Root defaultValue={defaultValue} onValueChange={onValueChange} className="border-t border-line">
      {items.map((item, i) => {
        const value = `item-${i}`
        return (
          <BaseAccordion.Item key={item.question} value={value} className="border-b border-line">
            <BaseAccordion.Header>
              {/* An open item tightens the gap under its question to the design's 15px. */}
              <BaseAccordion.Trigger id={idPrefix && `${idPrefix}-${i + 1}`} className="group flex w-full items-center justify-between gap-6 py-[26px] text-left outline-none transition-[padding] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink data-[panel-open]:pb-[15px]">
                <span className="text-h4 font-bold">{item.question}</span>
                <img src="/images/icons/plus.svg" alt="" aria-hidden className="size-5 shrink-0 transition-transform duration-[250ms] ease-out group-data-[panel-open]:rotate-45" />
              </BaseAccordion.Trigger>
            </BaseAccordion.Header>
            {item.answer && (
              <BaseAccordion.Panel
                keepMounted
                className="h-[var(--accordion-panel-height)] overflow-hidden opacity-100 transition-[height,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[ending-style]:h-0 data-[ending-style]:opacity-0 data-[starting-style]:h-0 data-[starting-style]:opacity-0 motion-reduce:duration-0"
              >
                <p className="max-w-[40rem] pb-[26px] text-p-md">
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
