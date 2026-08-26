import { cn } from '../utils/cn'

/**
 * Living backdrop for the brand-radial sections (hero, multi-platform
 * performance). Sits behind content as a full-bleed, absolutely-positioned
 * layer: a few large, blurred brand-colour blobs that drift slowly over the
 * section's static `bg-brand-radial`, screen-blended so they only ever lighten
 * the gradient. The motion is pure CSS (see `.cs-blob-*` in index.css) and is
 * held still under `prefers-reduced-motion`.
 *
 * Usage: the parent <Section> keeps `bg-brand-radial` and adds
 * `relative isolate overflow-hidden`; drop this in as the first child. The
 * `-z-10` layer paints above the section background but below the (statically
 * positioned) content, so nothing else needs a z-index.
 */
export default function AnimatedGradient({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}>
      {/* magenta — reinforces the radial's bottom-right anchor */}
      <div className="cs-blob cs-blob-a absolute -bottom-1/4 -right-1/5 h-[80%] w-[65%] rounded-round bg-magenta/60 mix-blend-screen blur-[90px]" />
      {/* blush — warm highlight sweeping the upper-left */}
      <div className="cs-blob cs-blob-b absolute -top-1/4 -left-1/6 h-[70%] w-[55%] rounded-round bg-blush/45 mix-blend-screen blur-[100px]" />
      {/* violet — adds depth through the middle */}
      <div className="cs-blob cs-blob-c absolute top-1/5 left-1/4 h-[65%] w-[55%] rounded-round bg-[#7a2fa6]/50 mix-blend-screen blur-[110px]" />
    </div>
  )
}
