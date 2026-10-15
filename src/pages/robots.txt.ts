import type { APIRoute } from 'astro'

/** Open to every crawler — answer engines (GPTBot, ClaudeBot, PerplexityBot…) included. */
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
