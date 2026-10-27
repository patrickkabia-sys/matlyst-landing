#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { alternativerFor } from './locale-sider.mjs';
import { norskeImportGuider } from './import-guider-lokale.mjs';

const base = 'https://matlyst-app.no';
const root = fileURLToPath(new URL('..', import.meta.url));
const esc = (tekst) => String(tekst).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const json = (verdi) => JSON.stringify(verdi).replaceAll('<', '\\u003c');
const regexEsc = (verdi) => String(verdi).replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');

function hode(v) {
  const sti = `/${v.path}`;
  const canonical = `${base}${sti}`;
  const hreflang = alternativerFor(sti).map(([kode, href]) => `<link rel="alternate" hreflang="${kode}" href="${base}${href}">`).join('\n');
  const schemas = [{
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      {'@type': 'ListItem', position: 1, name: 'Forside', item: `${base}/`},
      {'@type': 'ListItem', position: 2, name: v.h1, item: canonical},
    ],
  }, {
    '@context': 'https://schema.org', '@type': 'HowTo', name: v.stegTittel,
    step: v.steg.map(([name, text], index) => ({'@type': 'HowToStep', position: index + 1, name, text: text.replace(/<[^>]+>/gu, '')})),
  }, {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: v.faq.map(([name, text]) => ({'@type': 'Question', name, acceptedAnswer: {'@type': 'Answer', text}})),
  }];
  return `<!DOCTYPE html>
<html lang="nb">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(v.title)} | Matlyst</title>
<meta name="description" content="${esc(v.description)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${canonical}">
${hreflang}
<meta name="theme-color" content="#F7F3EC">
<meta property="og:title" content="${esc(v.title)} | Matlyst">
<meta property="og:description" content="${esc(v.description)}">
<meta property="og:image" content="${base}/images/og.jpg">
<meta property="og:image:alt" content="${esc(v.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Matlyst">
<meta property="og:locale" content="nb_NO">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(v.title)} | Matlyst">
<meta name="twitter:description" content="${esc(v.description)}">
<meta name="twitter:image" content="${base}/images/og.jpg">
<meta name="twitter:image:alt" content="${esc(v.description)}">
<link rel="icon" type="image/png" href="/images/icon.png">
<link rel="stylesheet" href="/styles.css">
<script type="application/ld+json">${json(schemas)}</script>
<script src="/locale.js" defer></script>
</head>`;
}

function side(v) {
  return `${hode(v)}<body data-locale="nb">
<a class="skip-link" href="#hovedinnhold">Hopp til innholdet</a>
<nav aria-label="Hovednavigasjon"><a href="/" class="brand">Mat<em>lyst</em></a><div class="nav-right"><a class="link" href="/#funksjoner">Funksjoner</a></div></nav>
<main id="hovedinnhold"><header class="locale-page-hero"><p class="eyebrow">${v.eyebrow}</p><h1 class="disp">${v.h1}</h1><p class="lead">${v.lead}</p></header>
<section class="prose locale-prose"><h2>${v.stegTittel}</h2><p>${v.forst}</p><ol>${v.steg.map(([tittel, tekst]) => `<li><strong>${tittel}.</strong> ${tekst}</li>`).join('')}</ol><p>${v.alternativ}</p><p>${v.grense}</p>
${v.seksjoner.map(([tittel, innhold]) => `<h2>${tittel}</h2>${innhold}`).join('\n')}</section>
<section class="faq"><h2>${v.faqTittel}</h2>${v.faq.map(([sporsmal, svar], index) => `<details${index === 0 ? ' open' : ''}><summary>${sporsmal}</summary><p>${svar}</p></details>`).join('')}</section>
<section class="page-cta"><h2 class="disp">${v.cta}</h2><div class="store-badges"><a class="btn-store" href="https://apps.apple.com/no/app/matlyst/id6762563515" rel="noopener"><img src="/images/appstore-badge.svg" alt="Last ned i App Store"></a><a class="btn-store" href="https://play.google.com/store/apps/details?id=app.matlyst&amp;hl=no&amp;gl=NO" rel="noopener"><img src="/images/googleplay-badge-en.png" alt="Last ned fra Google Play"></a></div></section></main>
<footer><a href="/" class="brand">Mat<em>lyst</em></a><div class="f-l"><a href="/vilkar.html">Vilkår</a><a href="/personvern.html">Personvern</a><a href="#samtykke" data-consent-withdraw>Endre samtykke</a><a href="mailto:hei@matlyst-app.no">Kontakt</a></div><span class="c">© 2026 Matlyst · Oppskrifter, ukemeny og handleliste.</span></footer>
<div class="cookie" id="cookie" hidden><div class="cookie-inner" id="samtykke"><p>Vi bruker nødvendig lagring for at siden skal virke. Sier du ja, bruker vi også analyse (PostHog og Google Analytics) til å forbedre Matlyst. Les mer i <a href="/personvern.html">personvernerklæringen</a>.</p><div class="cookie-actions"><button class="ck-btn ck-accept" id="ck-accept" type="button">Godta</button><button class="ck-btn ck-reject" id="ck-reject" type="button">Bare nødvendige</button></div></div></div><script src="/site.js" defer></script></body></html>`;
}

for (const v of norskeImportGuider) {
  const fil = `${root}/${v.path}index.html`;
  mkdirSync(dirname(fil), {recursive: true});
  writeFileSync(fil, side(v));
}

const sitemapFil = `${root}/sitemap.xml`;
let sitemap = readFileSync(sitemapFil, 'utf8');
for (const v of norskeImportGuider) {
  const loc = `${base}/${v.path}`;
  const blokk = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>2026-10-27</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
  const monster = new RegExp(`  <url>\\s*<loc>${regexEsc(loc)}<\\/loc>[\\s\\S]*?<\\/url>`, 'u');
  sitemap = monster.test(sitemap) ? sitemap.replace(monster, blokk) : sitemap.replace('</urlset>', `${blokk}\n</urlset>`);
}
writeFileSync(sitemapFil, sitemap);
