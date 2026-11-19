import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { behandle, kjor } from '../scripts/app-uttrykk.mjs';
import { organisasjonSkjema } from '../scripts/organisasjon.mjs';
import { alleSider } from '../scripts/sidetyper.mjs';

const side = (lang, ekstra = '') => `<html lang="${lang}"><head></head><body><nav><div class="nav-right"><a class="link" href="/x">X</a></div></nav><main>${ekstra}<a href="https://apps.apple.com/app/matlyst/id1">a</a><a href="https://play.google.com/store/apps/details?id=app.matlyst">p</a></main></body></html>`;

const FORSIDER = [['/sv/', 'sv'], ['/da/', 'da'], ['/en/', 'en']];

test('alle tre forsidene får nedlastingsknapp og fast linje, og behandlingen er idempotent', () => {
  for (const [sti, lang] of FORSIDER) {
    const ut = behandle(side(lang), sti);
    assert.match(ut, /class="nav-dl"/u, sti);
    assert.match(ut, /id="dl-bar"/u, sti);
    assert.equal(behandle(ut, sti), ut, sti);
  }
});

test('bare de tre forsidene behandles', () => {
  const rot = fileURLToPath(new URL('..', import.meta.url));
  // Dagens forsider har markør og app-uttrykk-blokker; fjern dem så behandle() har noe å gjøre.
  for (const [sti] of FORSIDER) {
    const fil = alleSider(rot).find((s) => s.sti === sti).fil;
    const ren = readFileSync(join(rot, fil), 'utf8')
      .replace(/<!-- app-uttrykk:start -->[\s\S]*?<!-- app-uttrykk:slutt -->/gu, '')
      .replace(/<a class="nav-dl"[^>]*>[\s\S]*?<\/a>/gu, '')
      .replace(' data-app-uttrykk="1"', '');
    const ut = behandle(ren, sti);
    assert.match(ut, /class="nav-dl"/u, sti);
    assert.match(ut, /id="dl-bar"/u, sti);
  }
  const generert = readFileSync(join(rot, 'test/fixtures/skall-paa/omregner-nb-generert.html.fiks'), 'utf8');
  assert.equal(behandle(generert, '/verktoy/kopp-til-dl/'), generert);
  assert.equal(behandle(side('nb'), '/x/'), side('nb'));
  for (const s of alleSider(rot)) {
    if (FORSIDER.some(([sti]) => sti === s.sti)) continue;
    const html = readFileSync(join(rot, s.fil), 'utf8');
    assert.equal(behandle(html, s.sti), html, s.sti);
  }
});

test('en underside røres ikke', () => {
  assert.equal(behandle(side('nb'), '/x/'), side('nb'));
  for (const lang of ['nb', 'sv', 'da', 'en']) assert.equal(behandle(side(lang), '/x/'), side(lang), lang);
});

// Fasit tatt med dagens utdata før flyttingen til scripts/organisasjon.mjs.
const ORG_FASIT = {
  "nb": "<script type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"Organization\",\"name\":\"Matlyst\",\"url\":\"https://matlyst-app.no/\",\"logo\":\"https://matlyst-app.no/images/icon.png\",\"email\":\"hei@matlyst-app.no\",\"sameAs\":[\"https://www.instagram.com/matlyst_app/\",\"https://www.tiktok.com/@matlyst.appen\",\"https://www.youtube.com/@matlyst\",\"https://www.pinterest.com/matlystapp/\",\"https://apps.apple.com/app/matlyst/id1\",\"https://play.google.com/store/apps/details?id=app.matlyst\"]}</script>",
  "sv": "<script type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"Organization\",\"name\":\"Matlyst\",\"url\":\"https://matlyst-app.no/\",\"logo\":\"https://matlyst-app.no/images/icon.png\",\"email\":\"hei@matlyst-app.no\",\"sameAs\":[\"https://www.instagram.com/matlyst_app/\",\"https://www.tiktok.com/@matlyst.appen\",\"https://www.youtube.com/@matlyst\",\"https://www.pinterest.com/matlystapp/\",\"https://apps.apple.com/app/matlyst/id1\",\"https://play.google.com/store/apps/details?id=app.matlyst\"]}</script>",
  "da": "<script type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"Organization\",\"name\":\"Matlyst\",\"url\":\"https://matlyst-app.no/\",\"logo\":\"https://matlyst-app.no/images/icon.png\",\"email\":\"hei@matlyst-app.no\",\"sameAs\":[\"https://www.instagram.com/matlyst_app/\",\"https://www.tiktok.com/@matlyst.appen\",\"https://www.youtube.com/@matlyst\",\"https://www.pinterest.com/matlystapp/\",\"https://apps.apple.com/app/matlyst/id1\",\"https://play.google.com/store/apps/details?id=app.matlyst\"]}</script>",
  "en": "<script type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"Organization\",\"name\":\"Matlyst\",\"url\":\"https://matlyst-app.no/\",\"logo\":\"https://matlyst-app.no/images/icon.png\",\"email\":\"hei@matlyst-app.no\",\"sameAs\":[\"https://www.instagram.com/matlyst_app/\",\"https://www.tiktok.com/@matlyst.appen\",\"https://www.youtube.com/@matlyst\",\"https://www.pinterest.com/matlystapp/\",\"https://apps.apple.com/app/matlyst/id1\",\"https://play.google.com/store/apps/details?id=app.matlyst\"]}</script>"
};
test('organisasjonsskjemaet er det samme etter flyttingen', () => {
  const urler = { ios: 'https://apps.apple.com/app/matlyst/id1', play: 'https://play.google.com/store/apps/details?id=app.matlyst' };
  for (const lang of Object.keys(ORG_FASIT)) assert.equal(organisasjonSkjema(lang, urler), ORG_FASIT[lang], lang);
});

test('noindex-sider og sider uten butikklenker får ingen nedlastingsknapp', () => {
  const noindex = side('en').replace('<head>', '<head><meta name="robots" content="noindex, follow">');
  assert.equal(behandle(noindex, '/en/'), noindex);
  const utenButikk = '<html lang="en"><body><div class="nav-right"></div></body></html>';
  assert.equal(behandle(utenButikk, '/en/'), utenButikk);
});

test('forsidene får telefoner i heroen og rader med telefon', () => {
  const hero = '<header class="hero locale-home-hero"><div><h1>x</h1></div><div class="hero-side">y</div></header><section class="locale-grid"><article class="locale-card"><h2 class="disp">A</h2><p>a</p></article><article class="locale-card"><h2 class="disp">B</h2><p>b</p><a class="more" href="/en/b">More →</a></article></section>';
  const ut = behandle(side('en', hero), '/en/');
  assert.match(ut, /has-stage/u);
  assert.match(ut, /class="hero-stage"/u);
  assert.equal((ut.match(/class="step-card /gu) ?? []).length, 2);
});

test('Guider-panelet er skjult til det åpnes (hidden vinner over display)', () => {
  const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.nav-panel\[hidden\]\s*\{\s*display:\s*none/u);
});

test('toppen får bakgrunn ved rulling også på genererte sider (nav uten id)', () => {
  const js = readFileSync(new URL('../site.js', import.meta.url), 'utf8');
  const forste = js.split('\n')[0];
  assert.match(forste, /querySelector\('body > nav'\)/u, 'site.js må finne <nav> uten id="nav", ellers renner teksten gjennom toppen');
});

test('kjor endrer bare forsidene, også med ukjente sider i treet', (t) => {
  const mappe = mkdtempSync(join(tmpdir(), 'app-forsider-'));
  t.after(() => rmSync(mappe, { recursive: true, force: true }));
  for (const mp of ['sv', 'ny-side']) mkdirSync(join(mappe, mp));
  writeFileSync(join(mappe, 'sv/index.html'), side('sv'));
  writeFileSync(join(mappe, 'ny-side/index.html'), side('nb'));
  assert.deepEqual(kjor(mappe), ['sv/index.html']);
  assert.equal(readFileSync(join(mappe, 'ny-side/index.html'), 'utf8'), side('nb'));
  assert.deepEqual(kjor(mappe), []);
});
