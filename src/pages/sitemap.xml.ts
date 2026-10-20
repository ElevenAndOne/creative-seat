import type { APIRoute } from 'astro'

/** Every page on the site. Add new routes here. */
const PAGES = ['/', '/book-a-demo']

export const GET: APIRoute = ({ site }) => {
  const lastmod = new Date().toISOString().slice(0, 10)
  const urls = PAGES.map((path) => `  <url><loc>${new URL(path, site).href}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
