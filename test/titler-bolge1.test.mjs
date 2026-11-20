// Titler, metabeskrivelser og H1 for bølge 1-sidene (søkeordkartet 19.11.2026). Låser ordlyden som er valgt og reglene rundt den:
// tittel maks 60 tegn med « | Matlyst», meta 120 til 155 tegn, og title, og:title og twitter:title i takt. Ingen tankestrek som skilletegn.
// Fasiten ligger i test/fasit/titler-bolge1.json og leses fra de genererte sidene, så en tom side eller en manglende tag gir rødt.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const fasit = JSON.parse(readFileSync(new URL('./fasit/titler-bolge1.json', import.meta.url), 'utf8'));
const rot = new URL('../', import.meta.url);
const ut = (t) => t.replace(/&amp;/gu, '&').replace(/&quot;/gu, '"').replace(/&#39;/gu, "'").replace(/&lt;/gu, '<').replace(/<[^>]+>/gu, '').trim();
const hent = (t, monster) => {
  const m = monster.exec(t);
  assert.ok(m, `fant ikke ${monster}`);
  return ut(m[1]);
};

for (const [sti, forventet] of Object.entries(fasit)) {
  test(`${sti}: tittel, meta og H1 følger søkeordkartet`, () => {
    const html = readFileSync(new URL(`${sti.slice(1)}index.html`, rot), 'utf8');
    const tittel = hent(html, /<title>(.*?)<\/title>/su);
    const meta = hent(html, /<meta name="description" content="(.*?)"/su);
    const h1 = hent(html, /<h1[^>]*>(.*?)<\/h1>/su);
    assert.equal(tittel, forventet.tittel);
    assert.equal(meta, forventet.meta);
    assert.equal(h1, forventet.h1);
    assert.ok(tittel.length <= 60, `tittel ${tittel.length} tegn`);
    assert.ok(meta.length >= 120 && meta.length <= 155, `meta ${meta.length} tegn`);
    assert.equal(hent(html, /property="og:title" content="(.*?)"/su), tittel);
    assert.equal(hent(html, /name="twitter:title" content="(.*?)"/su), tittel);
    for (const tekst of [tittel, meta, h1]) assert.ok(!/[–—]/u.test(tekst), `tankestrek i «${tekst}»`);
  });
}
