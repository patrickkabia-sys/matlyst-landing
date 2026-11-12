import { existsSync, readFileSync, readdirSync } from 'node:fs'

const STOPPORD = new Set([
  'a', 'an', 'and', 'att', 'av', 'de', 'den', 'det', 'en', 'et', 'for', 'för',
  'i', 'med', 'of', 'och', 'og', 'eller', 'på', 'som', 'the', 'til', 'to',
])

export function lesNettsted(rot) {
  const sitemapFiler = readdirSync(rot)
    .filter((navn) => /^sitemap.*\.xml$/u.test(navn))
    .sort()
  const stier = new Set()
  const sider = []

  for (const sitemapFil of sitemapFiler) {
    const sitemap = readFileSync(new URL(sitemapFil, rot), 'utf8')
    for (const treff of sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu)) {
      const sti = new URL(treff[1]).pathname
      if (stier.has(sti)) continue
      stier.add(sti)

      const relativFil = sti === '/'
        ? 'index.html'
        : sti.endsWith('/')
          ? `${sti.slice(1)}index.html`
          : sti.slice(1)
      const fil = new URL(relativFil, rot)
      if (!existsSync(fil)) continue

      const html = readFileSync(fil, 'utf8')
      const tittel = html.match(/<title[^>]*>([\s\S]*?)<\/title>/iu)?.[1] ?? ''
      const metaTreff = html.match(/<meta\s+name=["']description["']\s+content=(["'])([\s\S]*?)\1[^>]*>/iu)
        ?? html.match(/<meta\s+content=(["'])([\s\S]*?)\1\s+name=["']description["'][^>]*>/iu)
      const meta = (metaTreff?.[2] ?? '')
        .replace(/&nbsp;/giu, ' ')
        .replace(/&amp;/giu, '&')
        .replace(/&lt;/giu, '<')
        .replace(/&gt;/giu, '>')
        .replace(/&quot;/giu, '"')
        .replace(/&#(?:39|x27);/giu, "'")
      const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/iu)?.[1] ?? ''
      const tekst = body
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, ' ')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, ' ')
        .replace(/<!--([\s\S]*?)-->/gu, ' ')
        .replace(/<[^>]+>/gu, ' ')
        .replace(/&nbsp;/giu, ' ')
        .replace(/&amp;/giu, '&')
        .replace(/&lt;/giu, '<')
        .replace(/&gt;/giu, '>')
        .replace(/&quot;/giu, '"')
        .replace(/&#(?:39|x27);/giu, "'")
        .replace(/\s+/gu, ' ')
        .trim()

      sider.push({ sti, tittel, meta, tekst })
    }
  }

  return { sider, stier }
}

export function slugify(tekst) {
  return tekst
    .toLocaleLowerCase('nb')
    .replace(/æ/gu, 'ae')
    .replace(/[øö]/gu, 'o')
    .replace(/[åä]/gu, 'a')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '')
}

export function ordOverlapp(a, b) {
  const ordA = new Set(a
    .toLocaleLowerCase()
    .replace(/æ/gu, 'ae')
    .replace(/[øö]/gu, 'o')
    .replace(/[åä]/gu, 'a')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .match(/[a-z0-9]+/gu)
    ?.filter((ord) => !STOPPORD.has(ord)) ?? [])
  const ordB = new Set(b
    .toLocaleLowerCase()
    .replace(/æ/gu, 'ae')
    .replace(/[øö]/gu, 'o')
    .replace(/[åä]/gu, 'a')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .match(/[a-z0-9]+/gu)
    ?.filter((ord) => !STOPPORD.has(ord)) ?? [])
  const union = new Set([...ordA, ...ordB])
  if (union.size === 0) return 0
  const felles = [...ordA].filter((ord) => ordB.has(ord)).length
  return felles / union.size
}
