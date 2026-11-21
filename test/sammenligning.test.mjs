// Sammenligningssidene: norsk (/beste-oppskriftsapp/, /beste-handleliste-app/, /beste-ukemeny-app/) og amerikansk engelsk
// (/en/best-recipe-app/, /en/best-grocery-list-app/, /en/best-meal-planning-app/), fra samme generator (scripts/sammenligning/).
// Regelen (designspec punkt 10): nøytrale, etterprøvbare, daterte, og Matlyst oppgitt som avsender.
// Hvert faktum om en app har kilde og sitat i scripts/sammenligning/apper.<marked>.json, eller står som «ikke oppgitt» / «Not stated».
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { avvik, kildetekst, sitater } from '../scripts/sammenligning/kildekontroll.mjs';
import * as nb from '../scripts/sammenligning/nb.mjs';
import * as en from '../scripts/sammenligning/en.mjs';
import { alternativerFor } from '../scripts/locale-sider.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const les = (sti) => readFileSync(join(ROOT, sti), 'utf8');
const utenKommentarer = (t) => t.replace(/\/\*[\s\S]*?\*\/|(^|[^:])\/\/.*$/gmu, '$1');

const MARKEDER = {
  nb: { mod: nb, prefiks: '/', sitemap: 'sitemap.xml', bestFor: 'Best for deg som', kilder: 'Kilder', sjekket: 'sjekket', ikke: 'ikke oppgitt', tall: ['1000'], // navnet REMA 1000
    felt: ['plattformer', 'norsk', 'gratis', 'betalt', 'nett', 'sosiale', 'ukemeny', 'handleliste', 'deling', 'spiskammer', 'saerpreg'],
    priser: /\d\s*kr\b|\bkr\s*\d|NOK\s*\d|\$\s?\d/u },
  en: { mod: en, prefiks: '/en/', sitemap: 'sitemap-en.xml', bestFor: 'Best for you if you', kilder: 'Sources', sjekket: 'checked', ikke: 'not stated', tall: [],
    felt: ['plattformer', 'enheter', 'gratis', 'betalt', 'nett', 'sosiale', 'ukemeny', 'handleliste', 'deling', 'spiskammer', 'saerpreg'],
    priser: /\$\s?\d|\d\s*(?:USD|dollars?)\b|\bUSD\s*\d/iu },
};

/** Hovedinnholdet: fra H1 til FAQ, uten app-bevis, skall og relatert-blokker. */
function hoved(h) {
  const start = h.indexOf('<h1');
  const slutt = h.indexOf('<section class="faq">');
  assert.ok(start > -1 && slutt > start, 'fant ikke H1 og FAQ');
  return h.slice(start, slutt).replace(/<!-- app-bevis:start -->[\s\S]*?<!-- app-bevis:slutt -->/gu, '').replace(/<!-- relatert:start -->[\s\S]*?<!-- relatert:slutt -->/gu, '');
}
const synlig = (h) => h.replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<[^>]+>/gu, ' ').replace(/&amp;/gu, '&').replace(/\s+/gu, ' ');

test('kildekontrollen blir rød når et sitat ikke står hos kilden, også i notiser', () => {
  const data = { kilder: { a: {} }, apper: { x: { fakta: { norsk: { tekst: 'Ja', kilder: [{ kilde: 'a', sitat: 'Norwegian Bokmål' }] } } } } };
  assert.deepEqual(avvik(data, { a: kildetekst('<p>Languages English, Norwegian&nbsp;Bokmål</p>') }), []);
  assert.equal(avvik(data, { a: kildetekst('<p>Languages English, German</p>') }).length, 1);
  assert.equal(avvik(data, {}).length, 1);
  const medNotis = { ...data, notiser: { n: { tekst: 'T', kilder: [{ kilde: 'a', sitat: 'was discontinued' }] } } };
  assert.equal(avvik(medNotis, { a: kildetekst('<p>Norwegian Bokmål</p>') }).length, 1, 'notisen er ikke kontrollert');
  assert.ok(sitater(nb.DATA).length > 100);
  assert.ok(sitater(en.DATA).length > 100);
});

for (const [marked, M] of Object.entries(MARKEDER)) {
  const { DATA, AVSENDER, STIER, apperPaSide, kilderForApp, kortDato, sider } = M.mod;
  const IKKE = M.ikke[0].toUpperCase() + M.ikke.slice(1);
  const html = Object.fromEntries(Object.values(STIER).map((sti) => [sti, les(`${M.prefiks.slice(1)}${sti}index.html`)]));

  test(`${marked}: datafila: hvert faktum har kilde og sitat, eller står som «${IKKE}»`, () => {
    for (const [id, a] of Object.entries(DATA.apper)) {
      assert.deepEqual(Object.keys(a.fakta).sort(), [...M.felt].sort(), `${id}: feltene`);
      for (const [felt, f] of [...Object.entries(a.fakta), ...Object.entries(DATA.notiser ?? {})]) {
        if (f.tekst === IKKE) { assert.equal(f.kilder, undefined, `${id}/${felt}: «${IKKE}» skal ikke ha kilde`); continue; }
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

  if (marked === 'en') {
    test('en: kildene er amerikanske butikker (App Store /us/, Google Play gl=US) eller appens egen nettside', () => {
      for (const [id, k] of Object.entries(DATA.kilder)) {
        if (k.adresse.includes('apps.apple.com')) assert.match(k.adresse, /^https:\/\/apps\.apple\.com\/us\/app\/id\d+$/u, id);
        if (k.adresse.includes('play.google.com')) assert.match(k.adresse, /[?&]gl=US(&|$)/u, id);
        if (k.utgiver.startsWith('App Store') || k.utgiver.startsWith('Google Play')) assert.match(k.utgiver, /\(US\)$/u, id);
      }
    });
    test('en: hreflang peker til den norske motparten, og den norske tilbake', () => {
      const par = { 'best-recipe-app/': '/beste-oppskriftsapp/', 'best-grocery-list-app/': '/beste-handleliste-app/', 'best-meal-planning-app/': '/beste-ukemeny-app/' };
      for (const [sti, norsk] of Object.entries(par)) {
        const enSti = `/en/${sti}`;
        assert.deepEqual(alternativerFor(enSti), [['nb-NO', norsk], ['en', enSti], ['x-default', enSti]]);
        assert.ok(html[sti].includes(`<link rel="alternate" hreflang="nb-NO" href="https://matlyst-app.no${norsk}">`), sti);
        assert.ok(les(`${norsk.slice(1)}index.html`).includes(`<link rel="alternate" hreflang="en" href="https://matlyst-app.no${enSti}">`), norsk);
      }
    });
    test('en: det siden sier om Matlyst og enheter følger de andre engelske sidene (ingen omregning til cups)', () => {
      const tekst = Object.values(html).map((h) => synlig(hoved(h))).join(' ');
      assert.doesNotMatch(tekst, /Matlyst (?:converts?|turns)[^.]*\bcups?\b/iu);
      assert.match(synlig(hoved(html['best-recipe-app/'])), /Units set to US/u);
      assert.match(les('en/recipe-book-app/index.html'), /Switch to Units: US in Settings and Matlyst keeps the cups, ounces, and degrees Fahrenheit the source used\./u);
    });
    test('en: Mealime står ikke som app, men nevnes som lagt ned med kilde og lenke til flyttesiden', () => {
      assert.equal(DATA.apper.mealime, undefined);
      const m = hoved(html['best-meal-planning-app/']);
      assert.ok(m.includes('href="https://www.mealime.com/closing"'));
      assert.ok(m.includes('href="/en/mealime-alternative/"'));
      assert.ok(synlig(m).includes('discontinued as of October 21, 2026'));
    });
  }

  for (const [sti, h] of Object.entries(html)) {
    const adr = `${M.prefiks}${sti}`;
    test(`${adr}: Matlyst står som avsender øverst, før første mellomtittel`, () => {
      const m = hoved(h);
      assert.ok(m.indexOf(AVSENDER) > -1, 'avsendersetningen mangler');
      assert.ok(m.indexOf(AVSENDER) < m.indexOf('<h2'), 'avsendersetningen står ikke før første H2');
      assert.ok(sider[sti].lead.startsWith(AVSENDER));
    });

    test(`${adr}: hver app har kort med kildelenker og sjekkdato, i alfabetisk rekkefølge`, () => {
      const m = hoved(h);
      const ider = apperPaSide(sti);
      assert.ok(ider.length >= 5 && ider.length <= 8, `${ider.length} apper`);
      assert.ok(ider.includes('matlyst'));
      const navn = ider.map((id) => DATA.apper[id].navn);
      assert.deepEqual(navn, [...navn].sort((a, b) => a.localeCompare(b, marked)), 'rekkefølgen er ikke alfabetisk');
      const pos = ider.map((id) => m.indexOf(`id="app-${id}"`));
      assert.ok(pos.every((p) => p > -1), 'kort mangler');
      assert.deepEqual(pos, [...pos].sort((a, b) => a - b));
      for (const id of ider) {
        const kort = m.slice(m.indexOf(`id="app-${id}"`)).split('</div>')[0];
        for (const k of kilderForApp(id)) assert.ok(kort.includes(`href="${k.adresse.replaceAll('&', '&amp;')}"`), `${id}: lenker ikke til ${k.adresse}`);
        assert.ok(kort.includes(`${M.sjekket} ${kortDato(DATA.sjekket)}`), `${id}: sjekkdato mangler`);
        assert.ok(kort.includes(M.bestFor), `${id}: «best for» mangler`);
      }
    });

    test(`${adr}: hver verdi i kortene er et faktum med kilde, eller «${M.ikke}»`, () => {
      const m = hoved(h);
      const medKilde = new Set(Object.values(DATA.apper).flatMap((a) => Object.values(a.fakta)).filter((f) => f.kilder?.length).map((f) => f.tekst));
      let tause = 0;
      for (const id of apperPaSide(sti)) {
        const kort = m.slice(m.indexOf(`id="app-${id}"`)).split('</dl>')[0];
        for (const [, dt, dd] of kort.matchAll(/<dt>([^<]*)<\/dt><dd>([\s\S]*?)<\/dd>/gu)) {
          if (dt === M.bestFor || dt === M.kilder) continue;
          const v = dd.replaceAll('&amp;', '&');
          if (v === M.ikke) { tause += 1; continue; }
          assert.ok(medKilde.has(v), `${id}/${dt}: «${v}» har ingen kilde`);
        }
      }
      assert.ok(tause > 0, `ingen «${M.ikke}», så vakten vokter ingenting`);
    });

    test(`${adr}: ingen stjerner, vurderinger, priser, tankestrek, emoji eller logoer fra andre`, () => {
      const m = hoved(h);
      const tekst = synlig(m);
      assert.doesNotMatch(tekst, /[★⭐]|\d[,.]\d\s*(?:av 5|stjerner|out of 5|stars)|\d[\d ,]*\s*(?:vurderinger|stjerner|ratings|reviews|stars)/u);
      assert.doesNotMatch(tekst, M.priser);
      assert.doesNotMatch(tekst, /[—–]/u);
      assert.doesNotMatch(tekst, /\p{Extended_Pictographic}/u);
      for (const [, src] of m.matchAll(/<img[^>]+src="([^"]+)"/gu)) assert.match(src, /^\/images\//u, src);
      assert.doesNotMatch(h, /AggregateRating|"ratingValue"|"ItemList"/u);
    });

    test(`${adr}: hvert tall i teksten finnes i datafila eller er en dato`, () => {
      const tillatt = new Set(M.tall);
      const tekster = [...apperPaSide(sti).flatMap((id) => Object.values(DATA.apper[id].fakta)), ...Object.values(DATA.notiser ?? {})].map((f) => f.tekst);
      for (const t of tekster) for (const n of t.match(/\d+/gu) ?? []) tillatt.add(n);
      for (const n of kortDato(DATA.sjekket).match(/\d+/gu)) tillatt.add(String(Number(n)));
      for (const n of DATA.sjekket.split('-')) tillatt.add(String(Number(n)));
      const tekst = synlig(hoved(h));
      for (const n of tekst.match(/\d+/gu) ?? []) assert.ok(tillatt.has(n) || tillatt.has(String(Number(n))), `tallet ${n} har ingen kilde i datafila`);
    });

    test(`${adr}: lenker til de to andre sammenligningene, og står i sitemap og llms.txt`, () => {
      for (const annen of Object.values(STIER).filter((s) => s !== sti)) assert.ok(hoved(h).includes(`href="${M.prefiks}${annen}"`), annen);
      assert.match(les(M.sitemap), new RegExp(`<loc>https://matlyst-app\\.no${adr}</loc>`, 'u'));
      assert.ok(les('llms.txt').includes(`https://matlyst-app.no${adr}`));
    });
  }
}

test('ingen omtale av Zesti på sidene, i datafilene, i generatoren eller i llms.txt', () => {
  const filer = [...['beste-oppskriftsapp', 'beste-handleliste-app', 'beste-ukemeny-app', 'en/best-recipe-app', 'en/best-grocery-list-app', 'en/best-meal-planning-app'].map((d) => `${d}/index.html`),
    'llms.txt', 'scripts/sammenligning/sammenligning.mjs', 'scripts/sammenligning/nb.mjs', 'scripts/sammenligning/en.mjs', 'scripts/sammenligning/apper.nb.json', 'scripts/sammenligning/apper.en.json'];
  for (const fil of filer) assert.doesNotMatch(les(fil), /zesti/iu, fil);
});

test('generatoren er felles: markedsfilene har ingen egen kopi av kort, tabell eller side', () => {
  for (const fil of ['scripts/sammenligning/nb.mjs', 'scripts/sammenligning/en.mjs']) {
    const kode = utenKommentarer(les(fil));
    assert.match(kode, /lagSammenligning\(MARKED\)/u, fil);
    assert.doesNotMatch(kode, /function (?:kort|tabell|side)\b|<table|<dl>/u, fil);
  }
});

test('de relevante sidene lenker inn til sammenligningene', () => {
  const lenker = {
    'oppskriftsbok-app/index.html': ['/beste-oppskriftsapp/'],
    'handleliste/index.html': ['/beste-handleliste-app/'],
    'ukemeny/index.html': ['/beste-ukemeny-app/'],
    'blogg/velg-oppskriftsapp/index.html': ['/beste-oppskriftsapp/', '/beste-handleliste-app/', '/beste-ukemeny-app/'],
    'en/recipe-book-app/index.html': ['/en/best-recipe-app/'],
    'en/shopping-list/index.html': ['/en/best-grocery-list-app/'],
    'en/meal-plan-app/index.html': ['/en/best-meal-planning-app/'],
    'en/mealime-alternative/index.html': ['/en/best-meal-planning-app/'],
    'en/blog/choose-recipe-organizer-app/index.html': ['/en/best-recipe-app/', '/en/best-grocery-list-app/', '/en/best-meal-planning-app/'],
  };
  for (const [fil, mal] of Object.entries(lenker)) {
    const h = les(fil);
    const innhold = h.slice(h.indexOf('<h1'), h.indexOf('<!-- relatert:start -->') > -1 ? h.indexOf('<!-- relatert:start -->') : h.indexOf('<section class="faq">'));
    for (const m of mal) assert.ok(innhold.includes(`href="${m}"`), `${fil} lenker ikke til ${m} i teksten`);
  }
});
