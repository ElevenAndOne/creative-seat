import type { APIRoute } from 'astro'
import { faqItems, pricingPlans, processSteps, services } from '../content'
import { demoMail } from '../utils/contact'

/**
 * llms.txt — a plain-Markdown brief of the site for AI assistants and answer
 * engines (https://llmstxt.org), built from the same content the page renders.
 * Prices stay out: the site shows each visitor their own region's currency only.
 */
export const GET: APIRoute = ({ site }) => {
  const url = (hash = '') => new URL(`/${hash}`, site).href
  const body = `# Creative Seat

> Design, illustration and animation for marketing teams that need more capacity. Creative Seat gives a business its own dedicated, specialised creative team through one simple monthly subscription — an extension of the marketing team that's already there, not a replacement for it.

Creative Seat is a product of 11&1. Work is always done by human designers; AI-assisted workflows are used where they help, never in place of a designer.

## Services

${services.map((s) => `- ${s}`).join('\n')}

## How it works

${processSteps.map(({ title, subtitle, body }, i) => `${i + 1}. **${title} ${subtitle}** — ${body}`).join('\n')}

## Plans

Plans are billed monthly per seat, in US dollars, pounds sterling or euros depending on the visitor's region.

${pricingPlans
  .map((plan) => `### ${plan.name}\n\n${[plan.credits && `${plan.credits} credits a month`, plan.report, ...plan.features].filter(Boolean).map((line) => `- ${line}`).join('\n')}`)
  .join('\n\n')}

## Frequently asked questions

${faqItems.map(({ question, answer }) => `### ${question}\n\n${answer}`).join('\n\n')}

## Links

- [Home](${url()})
- [Services](${url('#services')})
- [Our work](${url('#work')})
- [Pricing](${url('#pricing')})
- [FAQ](${url('#resources')})
- [Book a demo](${demoMail}) — email the studio
`
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } })
}
