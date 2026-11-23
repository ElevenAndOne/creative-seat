/** Header destinations (desktop and mobile), in the Figma navbar's order. */
export const navigation = [
  { id: 'work', label: 'Work', href: '/#work' },
  { id: 'services', label: 'Services', href: '/#services' },
  { id: 'pricing', label: 'Pricing', href: '/#pricing' },
] as const

/** Footer destinations: the header's, plus the FAQs. */
export const footerNavigation = [
  { id: 'services', label: 'Services', href: '/#services' },
  { id: 'work', label: 'Our work', href: '/#work' },
  { id: 'resources', label: 'FAQs', href: '/#resources' },
  { id: 'pricing', label: 'Pricing', href: '/#pricing' },
] as const
