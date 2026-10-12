import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const ROOT = new URL('..', import.meta.url).pathname;
const les = (sti) => readFileSync(join(ROOT, sti.endsWith('/') ? `${sti}index.html` : sti), 'utf8');

// Stiene appen og e-postene allerede lenker til (matlyst-master:
// supabase/functions/_shared/juridiskeLenker.ts og lib/sprak/en/epost.ts).
const APPENS_STIER = ['en/privacy/', 'en/terms/', 'en/import-recipes/', 'en/unsubscribe/'];

test('de engelske stiene appen lenker til finnes', () => {
  for (const sti of APPENS_STIER) assert.ok(existsSync(join(ROOT, sti, 'index.html')), sti);
  assert.match(les('en/terms/'), /<section id="alder">/u);
});

test('juridiske sider er merket som utkast og viser ingen interne markører', () => {
  for (const sti of ['en/privacy/', 'en/terms/']) {
    const html = les(sti);
    assert.match(html, /<!-- UTKAST: venter på endelig juridisk gjennomgang/u, sti);
    const synlig = html.replace(/<!--[\s\S]*?-->/gu, '');
    assert.doesNotMatch(synlig, /\[(?:JURIST|VERIFISER|DATE)|\[overgang|Del 4/iu, sti);
  }
});

test('engelsk personvern nevner de samme leverandørene som norsk', () => {
  const norsk = les('personvern.html');
  const engelsk = les('en/privacy/');
  const leverandorer = ['Supabase', 'Apple', 'Google', 'Gemini', 'Anthropic Ireland, Limited', 'RevenueCat', 'Sentry', 'PostHog', 'EmailOctopus', 'reCAPTCHA', 'Meta', 'Google Analytics'];
  for (const navn of leverandorer) {
    assert.ok(norsk.includes(navn), `norsk mangler ${navn}`);
    assert.ok(engelsk.includes(navn), `engelsk mangler ${navn}`);
  }
});

test('engelske sider har engelsk sitemap i robots.txt', () => {
  assert.match(les('robots.txt'), /^Sitemap: https:\/\/matlyst-app\.no\/sitemap-en\.xml$/mu);
  const xml = les('sitemap-en.xml');
  for (const sti of ['en/', 'en/import-recipes/', 'en/privacy/', 'en/terms/']) {
    assert.match(xml, new RegExp(`<loc>https://matlyst-app\\.no/${sti}</loc>`, 'u'), sti);
  }
  assert.doesNotMatch(xml, /en\/unsubscribe/u);
});

function besok(url, { sprak = ['en-US'], lagret = null, agent = 'Mozilla/5.0' } = {}) {
  const { pathname, search, hash } = new URL(url, 'https://matlyst-app.no');
  const lager = new Map(lagret ? [['matlyst-sprak', lagret]] : []);
  const omdirigert = [];
  const window = {
    location: { pathname, search, hash, replace: (til) => omdirigert.push(til) },
    navigator: { languages: sprak, language: sprak[0], userAgent: agent },
    localStorage: { getItem: (k) => lager.get(k) ?? null, setItem: (k, v) => lager.set(k, v) },
  };
  vm.runInNewContext(les('locale.js'), { window, URLSearchParams });
  return { til: omdirigert[0] ?? null, lagret: lager.get('matlyst-sprak') ?? null };
}

test('ukjente og engelske nettleserspråk får engelsk, nordiske beholder sitt', () => {
  assert.equal(besok('/').til, '/en/');
  assert.equal(besok('/', { sprak: ['de-DE', 'fr'] }).til, '/en/');
  assert.equal(besok('/vilkar.html', { sprak: ['es-ES'] }).til, '/en/terms/');
  assert.equal(besok('/sv/integritet/', { sprak: ['ja-JP'] }).til, '/en/privacy/');
  assert.equal(besok('/en/', { sprak: ['en-GB'] }).til, null);
  assert.equal(besok('/', { sprak: ['en-US', 'nb-NO'] }).til, null);
  assert.equal(besok('/', { sprak: ['de-DE', 'nn'] }).til, null);
  assert.equal(besok('/', { sprak: ['en-US', 'sv-SE'] }).til, '/sv/');
  assert.equal(besok('/en/', { sprak: ['da-DK'] }).til, '/da/');
});

test('ukjent språk på en side uten engelsk motstykke blir der den er', () => {
  assert.equal(besok('/ukemeny/', { sprak: ['de-DE'] }).til, null);
  assert.equal(besok('/sv/enkel-middag/', { sprak: ['fr-FR'] }).til, null);
});

test('søkemotorer omdirigeres ikke automatisk', () => {
  const googlebot = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
  assert.equal(besok('/', { agent: googlebot }).til, null);
  assert.equal(besok('/sv/', { agent: googlebot }).til, null);
  assert.equal(besok('/', { agent: 'Mozilla/5.0 (compatible; bingbot/2.0)' }).til, null);
});

test('engelsk som aktivt valg lagres og følges', () => {
  assert.deepEqual(besok('/en/?sprak=en', { sprak: ['nb-NO'] }), { til: null, lagret: 'en' });
  assert.equal(besok('/', { sprak: ['nb-NO'], lagret: 'en' }).til, '/en/');
  assert.equal(besok('/vilkar.html', { sprak: ['nb-NO'], lagret: 'en' }).til, '/en/terms/');
  assert.equal(besok('/en/privacy/', { sprak: ['en-US'], lagret: 'da' }).til, '/da/privatliv/');
});
