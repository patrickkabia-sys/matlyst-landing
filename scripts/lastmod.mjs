// Ekte <lastmod> i sidekartene. Datoen er dagen sidens INNHOLD sist endret seg, ikke byggedagen.
// Innholdet er tittel, beskrivelse, canonical, språkalternativer, strukturerte data og <main>; rammen
// (meny, bunn, skript, stil) teller ikke, for en rammeendring på alle sider sier ingenting om sidene.
// scripts/lastmod-kart.json husker avtrykk og dato per adresse. Står avtrykket fast, står datoen fast, så to
// bygg på rad uten endring gir identiske sidekart. Endret avtrykk gir dagens dato (eller LASTMOD_DATO).
// Første fylling av kartet gjøres av scripts/lastmod-fro.mjs fra git-historikken.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SITEMAPER = ['sitemap.xml', 'sitemap-sv.xml', 'sitemap-da.xml', 'sitemap-en.xml'];
const BASE = 'https://matlyst-app.no';

export function avtrykk(html) {
  const del = (re) => (re.exec(html)?.[0] ?? '');
  const alle = (re) => (html.match(re) ?? []).join('\n');
  const start = html.search(/<main\b/u);
  const slutt = html.lastIndexOf('</main>');
  const main = start >= 0 && slutt > start ? html.slice(start, slutt + 7) : html.slice(Math.max(0, html.search(/<body\b/u)));
  const tekst = [
    del(/<title>[^<]*<\/title>/u),
    del(/<meta name="description"[^>]*>/u),
    del(/<link rel="canonical"[^>]*>/u),
    alle(/<link rel="alternate" hreflang=[^>]*>/gu),
    alle(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gu),
    main,
  ].join('\n').replace(/\s+/gu, ' ');
  return createHash('sha256').update(tekst).digest('hex').slice(0, 16);
}

export function filForUrl(url) {
  const sti = url.startsWith(BASE) ? url.slice(BASE.length) : null;
  if (sti === null) return null;
  if (sti.endsWith('/')) return `${sti.slice(1)}index.html`;
  return sti.slice(1);
}

export function dagensDato() {
  return process.env.LASTMOD_DATO ?? new Date().toISOString().slice(0, 10);
}

// Ren funksjon: gammelt kart + nytt avtrykk + dato -> ny oppføring.
export function nyOppforing(gammel, hash, dato) {
  return gammel && gammel.hash === hash ? gammel : { hash, dato };
}

export function oppdaterSitemap(xml, kart, rot, dato) {
  const mangler = [];
  const ut = xml.replace(/(<loc>)([^<]+)(<\/loc>\s*)<lastmod>[^<]*<\/lastmod>/gu, (m, a, url, b) => {
    const fil = filForUrl(url);
    if (!fil || !existsSync(join(rot, fil))) { mangler.push(url); return m; }
    const hash = avtrykk(readFileSync(join(rot, fil), 'utf8'));
    kart[url] = nyOppforing(kart[url], hash, dato);
    return `${a}${url}${b}<lastmod>${kart[url].dato}</lastmod>`;
  });
  return { xml: ut, mangler };
}

export function kjorLastmod(rot, dato = dagensDato()) {
  const kartFil = join(rot, 'scripts/lastmod-kart.json');
  const kart = existsSync(kartFil) ? JSON.parse(readFileSync(kartFil, 'utf8')) : {};
  const mangler = [];
  for (const navn of SITEMAPER) {
    const r = oppdaterSitemap(readFileSync(join(rot, navn), 'utf8'), kart, rot, dato);
    mangler.push(...r.mangler);
    writeFileSync(join(rot, navn), r.xml);
  }
  const sortert = Object.fromEntries(Object.keys(kart).sort().map((k) => [k, kart[k]]));
  writeFileSync(kartFil, `${JSON.stringify(sortert, null, 1)}\n`);
  return { mangler };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { mangler } = kjorLastmod(fileURLToPath(new URL('..', import.meta.url)));
  if (mangler.length) console.warn(`lastmod: ${mangler.length} adresser uten sidefil, dato uendret`);
}
