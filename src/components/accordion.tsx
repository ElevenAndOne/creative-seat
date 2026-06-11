import { useState } from 'react'

export interface AccordionItem {
  question: string
  answer?: string
}

/**
 * FAQ disclosure list — heading row with a "+" toggle and a hairline rule
 * between items, per the Figma FAQ section. The answer slides open.
 */
export default function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: AccordionItem[]
  defaultOpen?: number | null
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen)

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.question} className="border-t border-black/40 first:border-t-0">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-6 py-6 text-left"
            >
              <span className="text-2xl font-medium leading-snug">{item.question}</span>
              <span
                aria-hidden
                className={`mt-1 shrink-0 text-2xl font-light transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
              >
                +
              </span>
            </button>
            {isOpen && item.answer && (
              <p className="-mt-2 max-w-[510px] pb-7 text-base leading-relaxed text-ink">
                {item.answer}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
