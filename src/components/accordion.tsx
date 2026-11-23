import { Accordion as BaseAccordion } from '@base-ui/react/accordion'
import { useRef } from 'react'

export interface AccordionItem {
  question: string
  answer?: string
}

/**
 * FAQ disclosure list — question row with a "+" toggle, a hairline rule
 * above every item and one closing the list. All items start closed and several can be open at once. The answer slides open (height + fade) and the "+" turns
 * 45° into a "×", the brand's one hover/open gesture.
 */
export default function Accordion({
  items,
  defaultOpen = null,
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
    <BaseAccordion.Root
      multiple
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className="border-b border-line"
      onKeyDown={(event) => {
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
        const triggers = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]')].filter((trigger) => trigger.getAttribute('aria-disabled') !== 'true')
        const index = triggers.findIndex((trigger) => trigger === event.target)
        if (index < 0) return
        event.preventDefault()
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? triggers.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + triggers.length) % triggers.length
        triggers[next]?.focus()
      }}
    >
      {items.map((item, i) => {
        const value = `item-${i}`
        return (
          <BaseAccordion.Item key={item.question} value={value} className="border-t border-line">
            <BaseAccordion.Header>
              {/* An open item tightens the gap under its question; the answer brings its own. */}
              <BaseAccordion.Trigger data-accordion-trigger id={idPrefix && `${idPrefix}-${i + 1}`} className="group flex w-full items-center justify-between gap-xbg pt-[calc(var(--spacing-xbg)-1px)] pb-xbg text-left transition-[padding] duration-300 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ink data-[panel-open]:pb-2">
                <span className="min-w-px flex-1 text-ui font-bold">{item.question}</span>
                {/* Figma's `plus` glyph (8:13158), inline so it draws in ink: 1.5 strokes, arms 4.166→15.834. */}
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" className="size-5 shrink-0 text-ink transition-transform duration-[250ms] ease-out group-data-[panel-open]:rotate-45">
                  <path d="M4.166 10H15.834M10 4.166V15.834" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </BaseAccordion.Trigger>
            </BaseAccordion.Header>
            {item.answer && (
              <BaseAccordion.Panel
                keepMounted
                className="h-[var(--accordion-panel-height)] overflow-hidden opacity-100 transition-[height,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[ending-style]:h-0 data-[ending-style]:opacity-0 data-[starting-style]:h-0 data-[starting-style]:opacity-0"
              >
                <p className="max-w-[40rem] pb-xbg pr-11 text-p-sm text-muted">
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
