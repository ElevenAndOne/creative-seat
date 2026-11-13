import type { ReactNode } from 'react'

import type { Details, TextFieldId } from './model'

export const INPUT =
  'mt-2 block h-12 w-full rounded-md border border-ink/20 bg-paper px-4 text-p-md text-ink transition-colors placeholder:text-ink/35 hover:border-ink/45 focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink aria-[invalid=true]:border-2 aria-[invalid=true]:border-ink'

/** A field's label, with the required mark (in Ink — the brand has no red). */
export function Label({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <span id={id} className="text-p-sm font-medium">
      {children}
      <span aria-hidden className="ml-0.5 text-ink/55">
        *
      </span>
    </span>
  )
}

export function TextField({
  id,
  label,
  value,
  error,
  onChange,
  type = 'text',
  autoComplete,
  maxLength,
}: {
  id: TextFieldId
  label: string
  value: string
  error?: string
  onChange: (field: keyof Details, value: string) => void
  type?: string
  autoComplete: string
  maxLength: number
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        id={`book-${id}`}
        type={type}
        name={id}
        autoComplete={autoComplete}
        required
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `book-${id}-error` : undefined}
        className={INPUT}
      />
      {error && <FieldError id={`book-${id}-error`}>{error}</FieldError>}
    </label>
  )
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <span id={id} className="mt-2 flex items-start gap-1.5 text-p-xs font-semibold">
      <span aria-hidden className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-ink text-[0.625rem] font-bold text-paper">
        !
      </span>
      {children}
    </span>
  )
}
