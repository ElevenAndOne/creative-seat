/**
 * Uppercase section label with the hairline rule underneath,
 * as used above every section heading in the Figma design.
 */
export default function Eyebrow({
  children,
  tone = 'dark',
  className = '',
}: {
  children: string
  tone?: 'dark' | 'light'
  className?: string
}) {
  const text = tone === 'dark' ? 'text-black' : 'text-white'
  const rule = tone === 'dark' ? 'border-black/30' : 'border-white/40'
  return (
    <div className={className}>
      <p className={`text-base font-medium uppercase tracking-wide ${text}`}>
        {children}
      </p>
      <hr className={`mt-4 ${rule}`} />
    </div>
  )
}
