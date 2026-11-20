// Forfatter: Patrick Kabia står som forfatter (synlig linje og author som Person med @id fra om-siden) på norske sider om kjøling og mat,
// og bare på sidene i registeret scripts/forfatter.mjs. Ikke på app- eller importguidene, og ikke på sv, da og en.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { FORFATTERLINJE, FORFATTER_SIDER, PERSON_ID, forfatterPerson, harForfatter } from '../scripts/forfatter.mjs';
import { alleSider } from '../scripts/sidetyper.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const sider = alleSider(ROOT);
const html = (fil) => readFileSync(join(ROOT, fil), 'utf8');
const skjema = (h) => [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gu)].flatMap(([, r]) => [JSON.parse(r)].flat());
export const harLinje = (h) => /<p class="eyebrow">Av <a href="\/om\/">Patrick Kabia<\/a>, kjøletekniker<\/p>/u.test(h);
export const harForfatterSkjema = (h) => skjema(h).some((s) => s['@type'] === 'Article' && s.author?.['@type'] === 'Person' && s.author['@id'] === PERSON_ID);
export const forfatterTreff = (h) => harLinje(h) || harForfatterSkjema(h);

test('registeret har bare norske sider som finnes, og linja og personen er de godkjente', () => {
  assert.ok(FORFATTER_SIDER.length >= 5);
  for (const sti of FORFATTER_SIDER) {
    assert.ok(!/^(?:sv|da|en)\//u.test(sti), sti);
    assert.ok(existsSync(join(ROOT, sti, 'index.html')), sti);
  }
  assert.equal(FORFATTERLINJE, '<p class="eyebrow">Av <a href="/om/">Patrick Kabia</a>, kjøletekniker</p>');
  assert.deepEqual(forfatterPerson(), { '@type': 'Person', '@id': PERSON_ID, name: 'Patrick Kabia', url: 'https://matlyst-app.no/om/' });
  assert.equal(PERSON_ID, 'https://matlyst-app.no/om/#patrick-kabia');
});

test('alle sider i registeret har synlig forfatterlinje og author som Person koblet til om-siden', () => {
  for (const sti of FORFATTER_SIDER) {
    const h = html(`${sti}index.html`);
    assert.equal([...h.matchAll(/Av <a href="\/om\/">Patrick Kabia<\/a>, kjøletekniker/gu)].length, 1, `${sti}: forfatterlinje`);
    assert.ok(harForfatterSkjema(h), `${sti}: author mangler i Article`);
    // Linja står i sidens hode, ikke i skallet eller bunnen.
    assert.match(h, /<header class="locale-page-hero">[\s\S]*?<p class="eyebrow">Av <a href="\/om\/">[\s\S]*?<\/header>/u, sti);
  }
});

test('forfatter står bare på sidene i registeret (ingen app-, import- eller andre guider, ingen andre språk)', () => {
  const med = sider.filter((s) => forfatterTreff(html(s.fil)));
  assert.deepEqual(med.map((s) => s.sti.replace(/^\//u, '')).sort(), [...FORFATTER_SIDER].sort());
  for (const sti of ['oppskriftsbok-app/', 'importer-oppskrifter/', 'ukemeny/', 'bytt-fra-paprika/', 'spiskammer-app/', 'blogg/velg-oppskriftsapp/', 'blogg/doble-oppskrift/']) assert.equal(harForfatter(sti), false, sti);
  assert.ok(sider.filter((s) => s.sprak !== 'nb').length > 100);
});

test('forfattervakten kan bli rød: en side utenfor lista med linje eller en listet side uten gir treff', () => {
  const uten = html('oppskriftsbok-app/index.html');
  assert.equal(forfatterTreff(uten), false);
  assert.equal(forfatterTreff(uten.replace('</header>', `${FORFATTERLINJE}</header>`)), true);
  const med = html('julemiddag/index.html');
  assert.equal(harLinje(med.replace(FORFATTERLINJE, '')), false);
  assert.equal(harForfatterSkjema(med.replace(/"author":\{"@type":"Person"/u, '"author":{"@type":"Organization"')), false);
});
