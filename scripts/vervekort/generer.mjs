#!/usr/bin/env node
// Lager vervekortets fire sider: /v/, /sv/v/, /da/v/ og /en/v/.
//
//   node scripts/vervekort/generer.mjs
//
// Hvorfor egen generator og ikke scripts/generer-lokalsider.mjs: den store
// generatoren gir hver side samtykkebanner, analyse (site.js), språkvelger og
// automatisk språkbytte (locale.js). Vervekortet skal ha ingen av delene: ingen
// analyse, ingen tredjepart, og språket er valgt av appen som lagde lenka.
// Sidene står heller ikke i SIDEGRUPPER, så de havner aldri i sitemapene.
//
// Sidene er statiske og like for alle koder. Koden leses bare av /v/vervekort.js,
// valideres mot ^[A-F0-9]{6}$ og settes inn med textContent. Ingenting fra
// spørrestrengen havner i HTML-kilden.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE, SPRAK, TEKSTER, bildeUrl } from './tekster.mjs';

const ROT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const APP_STORE = 'https://apps.apple.com/app/matlyst/id6762563515';
const PLAY = 'https://play.google.com/store/apps/details?id=app.matlyst';

// Bare 'self': sida laster ingenting utenfra og kan ikke sende noe noe sted.
// Navigasjon (location.replace til butikken) styres ikke av CSP.
const CSP = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'";

const esc = (s) => String(s)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

export function side(lang) {
  const t = TEKSTER[lang];
  const url = `${BASE}${t.sti}`;
  return `<!DOCTYPE html>
<html lang="${t.htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="${CSP}">
  <title>${esc(t.tittel)}</title>
  <meta name="description" content="${esc(t.beskrivelse)}">
  <!-- Vervekortet skal aldri indekseres. Ikke Disallow i robots.txt: da henter
       ikke forhåndsviserne (Twitterbot, facebookexternalhit) kortet. -->
  <meta name="robots" content="noindex">
  <meta name="referrer" content="no-referrer">
  <meta name="theme-color" content="#F7F3EC">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Matlyst">
  <meta property="og:locale" content="${t.ogLocale}">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(t.tittel)}">
  <meta property="og:description" content="${esc(t.beskrivelse)}">
  <meta property="og:image" content="${bildeUrl(lang)}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(t.bildeAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(t.tittel)}">
  <meta name="twitter:description" content="${esc(t.beskrivelse)}">
  <meta name="twitter:image" content="${bildeUrl(lang)}">
  <meta name="twitter:image:alt" content="${esc(t.bildeAlt)}">
  <link rel="icon" type="image/png" href="/images/icon.png">
  <link rel="stylesheet" href="/avmeld.css">
  <link rel="stylesheet" href="/v/vervekort.css">
  <script src="/v/vervekort.js" defer></script>
</head>
<!--
  Vervekortet. Generert av scripts/vervekort/generer.mjs, ikke rediger for hånd.
  Appen deler ${BASE}${t.sti} med koden i parameteren k. Forhåndsvisningen bygges av OG-taggene over,
  som er like for alle koder. vervekort.js sender iPhone og iPad til App Store og
  Android til Google Play; alle andre ser sida. Tester: test/vervekort.test.mjs og
  test/playwright/vervekort.spec.mjs.
-->
<body class="avmeld-rot">
  <nav>
    <a class="nav-brand" href="${t.hjem}">Mat<em>lyst</em></a>
  </nav>

  <main class="avmeld-doc vervekort">
    <h1 class="avmeld-title">${esc(t.tittel)}</h1>
    <p class="avmeld-intro">${esc(t.intro)}</p>

    <section class="avmeld-kort vk-kodekort" id="medKode" hidden>
      <p class="vk-etikett" id="kodeEtikett">${esc(t.kodeEtikett)}</p>
      <div class="vk-koderad">
        <output class="vk-kode" id="kode" aria-labelledby="kodeEtikett"></output>
        <button class="avmeld-knapp vk-kopier" id="kopier" type="button" data-kopiert="${esc(t.kopiert)}" data-feil="${esc(t.kopierFeil)}">${esc(t.kopier)}</button>
      </div>
      <p class="vk-status" id="status" role="status" aria-live="polite"></p>
    </section>

    <h2 class="vk-h2">${esc(t.stegTittel)}</h2>
    <ol class="vk-steg">
      <li>${esc(t.steg1)}</li>
      <li>${esc(t.steg2)}</li>
    </ol>
    <p class="vk-utenkode" id="utenKode">${esc(t.utenKode)}</p>

    <div class="vk-butikker" role="group" aria-label="${esc(t.butikker)}">
      <a class="vk-butikk" id="appStore" href="${APP_STORE}" rel="noreferrer noopener"><img src="/images/appstore-badge.svg" width="120" height="40" alt="Download on the App Store"></a>
      <a class="vk-butikk" id="play" href="${PLAY}" rel="noreferrer noopener"><img src="/images/googleplay-badge-en.png" width="104" height="40" alt="Get it on Google Play"></a>
    </div>

    <p class="vk-lesmer"><a href="${t.hjem}" rel="noreferrer">${esc(t.lesMer)}</a></p>
  </main>
</body>
</html>
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const lang of SPRAK) {
    const fil = join(ROT, TEKSTER[lang].sti.slice(1), 'index.html');
    mkdirSync(dirname(fil), { recursive: true });
    writeFileSync(fil, side(lang));
    console.log(`skrev ${fil.slice(ROT.length + 1)}`);
  }
}
