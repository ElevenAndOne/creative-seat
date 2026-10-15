import { faqItems, pricingPlans, processSteps, services } from '../content'

const DESCRIPTION = 'Design, illustration and animation for marketing teams that need more capacity — a dedicated creative team on one monthly subscription.'

/**
 * The home page's JSON-LD graph: who we are (Organization, WebSite, WebPage),
 * what we sell (Service with its plans), how it works (HowTo) and the FAQ
 * (FAQPage) — the facts search and answer engines quote. Built from the same
 * content the page renders, so the two can't drift apart.
 *
 * Plans carry no prices on purpose: visitors only ever see their own region's
 * currency, so the markup doesn't publish the others.
 */
export function homeStructuredData(site: URL, title: string, description: string) {
  const url = site.href
  const org = `${url}#organization`
  const web = `${url}#website`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': org,
        name: 'Creative Seat',
        url,
        logo: new URL('/icon-512.png', site).href,
        description: DESCRIPTION,
        parentOrganization: { '@type': 'Organization', name: '11&1' },
      },
      {
        '@type': 'WebSite',
        '@id': web,
        url,
        name: 'Creative Seat',
        publisher: { '@id': org },
        inLanguage: 'en-GB',
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { '@id': web },
        about: { '@id': org },
        primaryImageOfPage: new URL('/og-image.jpg', site).href,
        inLanguage: 'en-GB',
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: 'Creative Seat creative subscription',
        serviceType: 'Creative design subscription',
        description: DESCRIPTION,
        provider: { '@id': org },
        areaServed: 'Worldwide',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Creative seats',
          itemListElement: pricingPlans.map((plan) => ({
            '@type': 'Offer',
            name: plan.name,
            description: [plan.credits && `${plan.credits} credits a month`, plan.report, ...plan.features].filter(Boolean).join('. '),
            itemOffered: { '@type': 'Service', name: `${plan.name} — Creative Seat`, serviceType: services.join(', ') },
          })),
        },
      },
      {
        '@type': 'HowTo',
        '@id': `${url}#how-it-works`,
        name: 'How Creative Seat works',
        step: processSteps.map(({ title, subtitle, body }, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: `${title} ${subtitle}`,
          text: body,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: faqItems.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  }
}
