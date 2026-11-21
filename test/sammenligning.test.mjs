// Sammenligningssidene (/beste-oppskriftsapp/, /beste-handleliste-app/, /beste-ukemeny-app/, bare norsk).
// Regelen (designspec punkt 10): nøytrale, etterprøvbare, daterte, og Matlyst oppgitt som avsender.
// Hvert faktum om en app har kilde og sitat i scripts/nb-sammenligning/apper.nb.json, eller står som «ikke oppgitt».
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { avvik, kildetekst, sitater } from '../scripts/nb-sammenligning/kildekontroll.mjs';
import { AVSENDER, DATA, STIER, apperPaSide, kilderForApp, kortDato, sider } from '../scripts/nb-sammenligning/sammenligning.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const les = (sti) => readFileSync(join(ROOT, sti), 'utf8');
const html = Object.fromEntries(Object.values(STIER).map((sti) => [sti, les(`${sti}index.html`)]));
const FELT = ['plattformer', 'norsk', 'gratis', 'betalt', 'nett', 'sosiale', 'ukemeny', 'handleliste', 'deling', 'spiskammer', 'saerpreg'];

/** Hovedinnholdet: fra H1 til FAQ, uten app-bevis, skall og relatert-blokker. */
function hoved(h) {
  const start = h.indexOf('<h1');
  const slutt = h.indexOf('<section class="faq">');
  assert.ok(start > -1 && slutt > start, 'fant ikke H1 og FAQ');
  return h.slice(start, slutt).replace(/<!-- app-bevis:start -->[\s\S]*?<!-- app-bevis:slutt -->/gu, '').replace(/<!-- relatert:start -->[\s\S]*?<!-- relatert:slutt -->/gu, '');
}
const synlig = (h) => h.replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<[^>]+>/gu, ' ').replace(/&amp;/gu, '&').replace(/\s+/gu, ' ');

test('datafila: hvert faktum har kilde og sitat, eller står som «Ikke oppgitt»', () => {
  for (const [id, a] of Object.entries(DATA.apper)) {
    assert.deepEqual(Object.keys(a.fakta).sort(), [...FELT].sort(), `${id}: feltene`);
    for (const [felt, f] of Object.entries(a.fakta)) {
      if (f.tekst === 'Ikke oppgitt') { assert.equal(f.kilder, undefined, `${id}/${felt}: «Ikke oppgitt» skal ikke ha kilde`); continue; }
      assert.ok(f.kilder?.length, `${id}/${felt}: faktum uten kilde`);
      for (const k of f.kilder) {
        assert.ok(DATA.kilder[k.kilde], `${id}/${felt}: ukjent kilde ${k.kilde}`);
        assert.ok(k.sitat?.trim(), `${id}/${felt}: sitat mangler`);
      }
    }
  }
  for (const [id, k] of Object.entries(DATA.kilder)) {
    assert.match(k.adresse, /^https:\/\//u, id);
    assert.equal(k.hentet, DATA.sjekket, `${id}: hentedato skal være sjekkdatoen`);
  }
});

test('kildekontrollen blir rød når et sitat ikke står hos kilden', () => {
  const data = { kilder: { a: {} }, apper: { x: { fakta: { norsk: { tekst: 'Ja', kilder: [{ kilde: 'a', sitat: 'Norwegian Bokmål' }] } } } } };
  assert.deepEqual(avvik(data, { a: kildetekst('<p>Languages English, Norwegian&nbsp;Bokmål</p>') }), []);
  assert.equal(avvik(data, { a: kildetekst('<p>Languages English, German</p>') }).length, 1);
  assert.equal(avvik(data, {}).length, 1);
  assert.ok(sitater(DATA).length > 100);
});

for (const [sti, h] of Object.entries(html)) {
  test(`${sti}: Matlyst står som avsender øverst, før første mellomtittel`, () => {
    const m = hoved(h);
    assert.ok(m.indexOf(AVSENDER) > -1, 'avsendersetningen mangler');
    assert.ok(m.indexOf(AVSENDER) < m.indexOf('<h2'), 'avsendersetningen står ikke før første H2');
    assert.ok(sider[sti].lead.startsWith(AVSENDER));
  });

  test(`${sti}: hver app har kort med kildelenker og sjekkdato, i alfabetisk rekkefølge`, () => {
    const m = hoved(h);
    const ider = apperPaSide(sti);
    assert.ok(ider.length >= 5 && ider.length <= 8, `${ider.length} apper`);
    assert.ok(ider.includes('matlyst'));
    const navn = ider.map((id) => DATA.apper[id].navn);
    assert.deepEqual(navn, [...navn].sort((a, b) => a.localeCompare(b, 'nb')), 'rekkefølgen er ikke alfabetisk');
    const pos = ider.map((id) => m.indexOf(`id="app-${id}"`));
    assert.ok(pos.every((p) => p > -1), 'kort mangler');
    assert.deepEqual(pos, [...pos].sort((a, b) => a - b));
    for (const id of ider) {
      const kort = m.slice(m.indexOf(`id="app-${id}"`)).split('</div>')[0];
      for (const k of kilderForApp(id)) assert.ok(kort.includes(`href="${k.adresse.replaceAll('&', '&amp;')}"`), `${id}: lenker ikke til ${k.adresse}`);
      assert.ok(kort.includes(`sjekket ${kortDato(DATA.sjekket)}`), `${id}: sjekkdato mangler`);
      assert.ok(kort.includes('Best for deg som'), `${id}: «best for» mangler`);
    }
  });

  test(`${sti}: hver verdi i kortene er et faktum med kilde, eller «ikke oppgitt»`, () => {
    const m = hoved(h);
    const medKilde = new Set(Object.values(DATA.apper).flatMap((a) => Object.values(a.fakta)).filter((f) => f.kilder?.length).map((f) => f.tekst));
    let tause = 0;
    for (const id of apperPaSide(sti)) {
      const kort = m.slice(m.indexOf(`id="app-${id}"`)).split('</dl>')[0];
      for (const [, dt, dd] of kort.matchAll(/<dt>([^<]*)<\/dt><dd>([\s\S]*?)<\/dd>/gu)) {
        if (dt === 'Best for deg som' || dt === 'Kilder') continue;
        const v = dd.replaceAll('&amp;', '&');
        if (v === 'ikke oppgitt') { tause += 1; continue; }
        assert.ok(medKilde.has(v), `${id}/${dt}: «${v}» har ingen kilde`);
      }
    }
    assert.ok(tause > 0, 'ingen «ikke oppgitt», så vakten vokter ingenting');
  });

  test(`${sti}: ingen stjerner, vurderinger, kronepriser, tankestrek, emoji eller logoer fra andre`, () => {
    const m = hoved(h);
    const tekst = synlig(m);
    assert.doesNotMatch(tekst, /[★⭐]|\d[,.]\d\s*(?:av 5|stjerner)|\d[\d ]*\s*(?:vurderinger|stjerner|ratings)/u);
    assert.doesNotMatch(tekst, /\d\s*kr\b|\bkr\s*\d|NOK\s*\d|\$\s?\d/u);
    assert.doesNotMatch(tekst, /[—–]/u);
    assert.doesNotMatch(tekst, /\p{Extended_Pictographic}/u);
    for (const [, src] of m.matchAll(/<img[^>]+src="([^"]+)"/gu)) assert.match(src, /^\/images\//u, src);
    assert.doesNotMatch(h, /AggregateRating|"ratingValue"|"ItemList"/u);
  });

  test(`${sti}: hvert tall i teksten finnes i datafila eller er en dato`, () => {
    const tillatt = new Set();
    for (const id of apperPaSide(sti)) for (const f of Object.values(DATA.apper[id].fakta)) for (const n of f.tekst.match(/\d+/gu) ?? []) tillatt.add(n);
    for (const n of kortDato(DATA.sjekket).split('.')) tillatt.add(n);
    for (const n of DATA.sjekket.split('-')) tillatt.add(String(Number(n)));
    tillatt.add('1000'); // navnet REMA 1000
    const tekst = synlig(hoved(h));
    for (const n of tekst.match(/\d+/gu) ?? []) assert.ok(tillatt.has(n) || tillatt.has(String(Number(n))), `tallet ${n} har ingen kilde i datafila`);
  });

  test(`${sti}: lenker til de to andre sammenligningene, og står i sitemap og llms.txt`, () => {
    for (const annen of Object.values(STIER).filter((s) => s !== sti)) assert.ok(hoved(h).includes(`href="/${annen}"`), annen);
    assert.match(les('sitemap.xml'), new RegExp(`<loc>https://matlyst-app\\.no/${sti}</loc>`, 'u'));
    assert.ok(les('llms.txt').includes(`https://matlyst-app.no/${sti}`));
  });
}

test('ingen omtale av Zesti på sidene, i datafila eller i llms.txt', () => {
  for (const tekst of [...Object.values(html), JSON.stringify(DATA), les('llms.txt'), les('scripts/nb-sammenligning/sammenligning.mjs')]) assert.doesNotMatch(tekst, /zesti/iu);
});

test('de relevante sidene lenker inn til sammenligningene', () => {
  const lenker = {
    'oppskriftsbok-app/index.html': ['/beste-oppskriftsapp/'],
    'handleliste/index.html': ['/beste-handleliste-app/'],
    'ukemeny/index.html': ['/beste-ukemeny-app/'],
    'blogg/velg-oppskriftsapp/index.html': ['/beste-oppskriftsapp/', '/beste-handleliste-app/', '/beste-ukemeny-app/'],
  };
  for (const [fil, mal] of Object.entries(lenker)) {
    const h = les(fil);
    const innhold = h.slice(h.indexOf('<h1'), h.indexOf('<!-- relatert:start -->') > -1 ? h.indexOf('<!-- relatert:start -->') : h.indexOf('<section class="faq">'));
    for (const m of mal) assert.ok(innhold.includes(`href="${m}"`), `${fil} lenker ikke til ${m} i teksten`);
  }
});
