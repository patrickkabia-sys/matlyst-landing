import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const siteJs = readFileSync(new URL('../site.js', import.meta.url), 'utf8');

function funksjonskropp(navn) {
  const start = siteJs.indexOf(`function ${navn}`);
  assert.notEqual(start, -1, `fant ikke ${navn}() i site.js`);
  const aapning = siteJs.indexOf('{', start);
  let dybde = 0;
  for (let i = aapning; i < siteJs.length; i++) {
    if (siteJs[i] === '{') dybde++;
    else if (siteJs[i] === '}' && --dybde === 0) return siteJs.slice(aapning, i + 1);
  }
  throw new Error(`fant ikke slutten på ${navn}()`);
}

test('samme målehendelse sendes til PostHog og GA4', () => {
  const kropp = funksjonskropp('capture');
  assert.match(kropp, /if \(get\(\) !== 'granted'\) return;/u);
  assert.match(kropp, /window\.posthog\.capture\(name, properties\)/u);
  assert.match(kropp, /window\.gtag\('event', name, properties\)/u);
});

test('butikk-klikk får beslutningsnyttig kontekst uten full utgående URL', () => {
  const kropp = funksjonskropp('eventProperties');
  for (const egenskap of ['page_path', 'page_title', 'cta_location', 'link_text', 'destination_store']) {
    assert.match(kropp, new RegExp(`${egenskap}:`, 'u'), `${egenskap} mangler`);
  }
  assert.doesNotMatch(kropp, /href|outbound_url|destination_url/u);
});

test('eksisterende hendelsesnavn beholdes for historisk sammenligning', () => {
  assert.match(siteJs, /capture\('appstore_click', eventProperties\(a, 'app_store'\)\)/u);
  assert.match(siteJs, /capture\('play_click', eventProperties\(a, 'google_play'\)\)/u);
});

test('analyseverktøyene lastes fortsatt bare etter samtykke', () => {
  assert.match(siteJs, /if \(consent === 'granted'\) \{ loadPixel\(\); loadPostHog\(\); loadGA\(\); \}/u);
  assert.match(siteJs, /if \(accept\) accept\.addEventListener\('click',[\s\S]*loadPostHog\(\); loadGA\(\);/u);
});
