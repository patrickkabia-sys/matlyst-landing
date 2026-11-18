import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { HYLLER, synligeLenker } from '../scripts/hyller.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const SKJULTE = ['Dl til gram', 'Porsjoner', 'Kakeform', 'Steketid', 'Pizzadeig', 'Gjær', 'Alle kalkulatorer'];

// Leser de seks hyllene ut av menyen i det godkjente prototypet. Kaster hvis noe mangler.
function hyllerFraPrototyp() {
  const html = readFileSync(join(rot, 'docs/superpowers/prototyper/2026-11-18-forside.html'), 'utf8');
  const start = html.indexOf('<nav class="panel" id="panel"');
  assert.ok(start > -1, 'fant ikke nav.panel i prototypet');
  const slutt = html.indexOf('</nav>', start);
  assert.ok(slutt > start, 'fant ikke slutten på nav.panel');
  const panel = html.slice(start, slutt).replace(/<!--[\s\S]*?-->/g, '');
  const forventetAntallHyller = (panel.match(/class="fag(?=["\s])/g) ?? []).length;
  const blokker = panel.split(/<div\b[^>]*class="fag["\s][^>]*>/).slice(1);
  assert.equal(blokker.length, forventetAntallHyller, 'leste ikke alle hyllene i prototypet');
  assert.equal(blokker.length, 6, 'prototypet skal ha seks hyller');
  return blokker.map((b) => {
    const navn = /<button\b[^>]*class="fagknapp[^"]*"[^>]*>[\s\S]*?<span\b[^>]*>([^<]+)<\/span>/.exec(b)?.[1];
    const src = /<img\b[^>]*class="flis[^"]*"[^>]*\bsrc="([^"]+)"/.exec(b)?.[1] ?? /<img\b[^>]*\bsrc="([^"]+)"[^>]*class="flis/.exec(b)?.[1];
    assert.ok(navn && src, 'hylle uten navn eller flis i prototypet');
    const lenker = [...b.matchAll(/<li\b[^>]*>\s*<a\b[^>]*>\s*<span\b[^>]*>([^<]+)<\/span>/g)].map((m) => m[1]);
    const antallLi = (b.match(/<li\b/g) ?? []).length;
    assert.equal(lenker.length, antallLi, `${navn}: leste ${lenker.length} av ${antallLi} lenker i prototypet`);
    assert.ok(lenker.length > 0, `${navn}: ingen lenker i prototypet`);
    return { navn, flis: src.split('/').pop(), lenker };
  });
}

test('bokmål har de seks hyllene i specens rekkefølge', () => {
  assert.deepEqual(HYLLER.nb.map((h) => h.navn), ['Appen', 'Lagre oppskrifter', 'Middag', 'Verktøy', 'Kjøkkentips', 'Matlyst']);
});

test('hver synlige lenke peker på en side som finnes', () => {
  for (const hylle of HYLLER.nb) for (const { tekst, href } of synligeLenker(hylle)) {
    if (/^https?:/.test(href)) continue;
    const sti = href.split('#')[0];
    assert.ok(existsSync(join(rot, sti.endsWith('/') ? `${sti}index.html` : sti)), `${hylle.navn}: ${tekst} (${href})`);
  }
});

test('de seks kalkulatorene som ikke finnes, vises ikke', () => {
  const verktoy = HYLLER.nb.find((h) => h.id === 'verktoy');
  const manglerSider = verktoy.lenker.filter((l) => l.finnes === false).map((l) => l.tekst);
  assert.deepEqual(manglerSider.slice(0, 6), ['Dl til gram', 'Porsjoner', 'Kakeform', 'Steketid', 'Pizzadeig', 'Gjær']);
  assert.ok(!synligeLenker(verktoy).some((l) => l.finnes === false));
});

test('ingen hylle sier kopper i synlig tekst', () => {
  const tekster = HYLLER.nb.flatMap((h) => [h.navn, ...h.lenker.map((l) => l.tekst)]);
  assert.doesNotMatch(tekster.join('\n'), /kopp/i);
});

test('hver hylle har en flis og unike id-er', () => {
  assert.equal(new Set(HYLLER.nb.map((h) => h.id)).size, 6);
  for (const h of HYLLER.nb) assert.match(h.flis, /^[\w-]+\.webp$/);
});

test('hyllene er identiske med prototypet: navn, flis og lenketekster i rekkefølge', () => {
  const proto = hyllerFraPrototyp();
  assert.deepEqual(
    HYLLER.nb.map((h) => ({ navn: h.navn, flis: h.flis, lenker: h.lenker.map((l) => l.tekst) })),
    proto,
  );
});

test('nøyaktig disse syv lenkene er skjult', () => {
  const skjulte = HYLLER.nb.flatMap((h) => h.lenker.filter((l) => l.finnes === false).map((l) => l.tekst));
  assert.deepEqual(skjulte, SKJULTE);
});

test('synligeLenker beholder alt unntatt de skjulte, 33 totalt', () => {
  const proto = hyllerFraPrototyp();
  HYLLER.nb.forEach((h, i) => {
    assert.deepEqual(synligeLenker(h).map((l) => l.tekst), proto[i].lenker.filter((t) => !SKJULTE.includes(t)), h.navn);
  });
  assert.equal(HYLLER.nb.flatMap(synligeLenker).length, 33);
});
