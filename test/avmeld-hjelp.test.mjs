import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

// Hjelpemailen fra aktiveringssekvensen (app-repoet, _shared/avmeldLenke.ts) lenker hit
// med t=hjelp. Sida viser da en egen tekstvariant om tips om å komme i gang, ikke
// nyhetsbrevet. Teksten skal stå ferdig i HTML-en: ingenting fra adressen settes inn.
const ROOT = new URL('..', import.meta.url).pathname;
const SIDER = {
  'avmeld/index.html': 'Meld meg av tipsene',
  'sv/avregistrera/index.html': 'Avregistrera mig från tipsen',
  'da/afmeld/index.html': 'Afmeld mig tipsene',
  'en/unsubscribe/index.html': 'Unsubscribe me from the tips',
};
const NYHETSBREV = /nyhetsbrev|nyhedsbrev|newsletter/iu;

function seksjon(html, id) {
  const m = new RegExp(`<section id="${id}" hidden>([\\s\\S]*?)</section>`, 'u').exec(html);
  assert.ok(m, `fant ikke seksjonen ${id}`);
  return m[1];
}

test('hver avmeldingsside har en hjelpevariant av bekreft, ferdig, mangler og feilmeldingen', () => {
  for (const [fil, emne] of Object.entries(SIDER)) {
    const html = readFileSync(join(ROOT, fil), 'utf8');
    for (const id of ['bekreft-hjelp', 'ferdig-hjelp', 'mangler-hjelp', 'meldAv-hjelp', 'status-hjelp', 'feilmelding-hjelp']) {
      assert.match(html, new RegExp(`id="${id}"`, 'u'), `${fil}: ${id}`);
    }
    assert.match(seksjon(html, 'bekreft-hjelp'), /id="meldAv-hjelp"/u, fil);
    assert.match(html, new RegExp(`mailto:hei@matlyst-app\\.no\\?subject=${encodeURIComponent(emne).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'u'), `${fil}: e-postemnet`);
  }
});

test('hjelpevarianten handler om tipsene, ikke om å melde seg av nyhetsbrevet', () => {
  for (const fil of Object.keys(SIDER)) {
    const html = readFileSync(join(ROOT, fil), 'utf8');
    for (const id of ['bekreft-hjelp', 'ferdig-hjelp', 'mangler-hjelp']) {
      const tekst = seksjon(html, id).replace(/<[^>]+>/gu, ' ');
      const kicker = /<p class="avmeld-kicker">([^<]+)<\/p>/u.exec(seksjon(html, id))[1];
      assert.match(kicker, /tips/iu, `${fil} ${id}: kicker`);
      // Nyhetsbrevet nevnes bare for å si at det IKKE påvirkes.
      if (id !== 'bekreft-hjelp') assert.doesNotMatch(tekst, NYHETSBREV, `${fil} ${id}`);
    }
  }
});

test('avmeld.js velger variant fra t=hjelp, men setter aldri inn noe fra adressen', () => {
  const js = readFileSync(join(ROOT, 'avmeld.js'), 'utf8').replace(/\/\/[^\n]*/gu, '');
  assert.match(js, /q\.get\('t'\) === 'hjelp' \? '-hjelp' : ''/u);
  assert.match(js, /getElementById\('meldAv' \+ ende\)/u);
  assert.match(js, /getElementById\('feilmelding' \+ ende\)/u);
  // innerHTML finnes bare for feilmeldingen fra en mal i sida.
  const innerHtml = [...js.matchAll(/innerHTML\s*=\s*([^;]+);/gu)].map(([, h]) => h.trim());
  assert.deepEqual(innerHtml, ['feil.innerHTML']);
  assert.doesNotMatch(js, /q\.get\('t'\)[^;]*(innerHTML|textContent|insertAdjacent)/u);
  // u og s fjernes fortsatt fra adresselinja.
  assert.match(js, /rest\.delete\('u'\);\s*rest\.delete\('s'\);/u);
});
