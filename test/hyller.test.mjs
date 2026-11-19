import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { HYLLER, HYLLETEKST, LOKALE_KILDER, lokaliserHyller, synligeLenker } from '../scripts/hyller.mjs';
import { alleSider } from '../scripts/sidetyper.mjs';
import { gruppeForSti } from '../scripts/locale-sider.mjs';

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
  const tekstAv = (innerHtml) => innerHtml.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return blokker.map((b) => {
    const knapp = /<button\b[^>]*class="fagknapp[^"]*"[^>]*>([\s\S]*?)<\/button>/.exec(b)?.[1];
    assert.ok(knapp, 'hylle uten fagknapp i prototypet');
    const navn = tekstAv(knapp);
    const imgTag = /<img\b[^>]*?\sclass="flis"[^>]*?>/.exec(b)?.[0];
    const src = imgTag && /(?:^|\s)src="([^"]+)"/.exec(imgTag)?.[1];
    assert.ok(navn && src, `${navn}: hylle uten navn eller flis-src i prototypet`);
    const lenker = [...b.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map((m) => tekstAv(m[1]));
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

// Falsk tekst: hver nøkkel får en synlig verdi, så testene ser adressene og ikke oversettelsen.
const falsk = () => ({
  navn: Object.fromEntries(HYLLER.nb.map((h) => [h.id, `N:${h.id}`])),
  lenker: {
    ...Object.fromEntries(HYLLER.nb.flatMap((h) => h.lenker.map((l) => [l.href, `T:${l.href}`]))),
    ...Object.fromEntries(Object.values(LOKALE_KILDER).flat().map((k) => [k.href, `T:${k.href}`])),
  },
});
const finn = (hyller, id, nbHref) => hyller.find((h) => h.id === id).lenker.find((l) => l.nbHref === nbHref);

test('lokaliserHyller henter adressene fra SIDEGRUPPER', () => {
  const sv = lokaliserHyller('sv', falsk());
  assert.equal(finn(sv, 'appen', '/handleliste/').href, '/sv/inkopslista/');
  assert.equal(finn(sv, 'verktoy', '/verktoy/kopp-til-dl/').href, '/sv/verktyg/kopp-till-dl/');
  assert.equal(finn(sv, 'matlyst', '/personvern.html').href, '/sv/integritet/');
  assert.equal(finn(sv, 'matlyst', 'https://www.youtube.com/@matlyst').href, 'https://www.youtube.com/@matlyst');
});

test('en lenke uten side på språket vises ikke', () => {
  for (const s of ['sv', 'da', 'en']) {
    const koketider = finn(lokaliserHyller(s, falsk()), 'tips', '/blogg/koketider/');
    assert.equal(koketider.finnes === false, gruppeForSti('/blogg/koketider/')?.sider[s] === undefined, s);
  }
  // Lenker som er skjult på bokmål, arves.
  assert.equal(finn(lokaliserHyller('da', falsk()), 'verktoy', '/verktoy/porsjoner/').finnes, false);
});

test('Spør Matlyst vises bare når forsiden på språket har delen', () => {
  for (const s of ['sv', 'da', 'en']) {
    const forside = readFileSync(join(rot, gruppeForSti('/').sider[s], 'index.html'), 'utf8');
    assert.equal(finn(lokaliserHyller(s, falsk()), 'appen', '/#spor').finnes, forside.includes('id="spor"'), s);
  }
});

test('manglende tekst kaster med adressen', () => {
  const t = falsk();
  delete t.lenker['/ukemeny/'];
  assert.throws(() => lokaliserHyller('sv', t), /mangler tekst.*\/ukemeny\//);
});

test('norske kilder vises ikke utenfor bokmål, de lokale kildene gjør', () => {
  for (const s of ['sv', 'da', 'en']) {
    const lagre = lokaliserHyller(s, falsk()).find((h) => h.id === 'lagre');
    for (const href of ['/importer-fra-matprat/', '/importer-fra-koket/']) assert.equal(lagre.lenker.find((l) => l.nbHref === href).finnes, false, `${s} ${href}`);
    const lokale = lagre.lenker.filter((l) => l.nbHref === null);
    assert.deepEqual(lokale.map((l) => l.href), LOKALE_KILDER[s].map((k) => k.href));
    assert.ok(lokale.every((l) => l.finnes));
  }
  assert.ok(!lokaliserHyller('nb', falsk()).find((h) => h.id === 'lagre').lenker.some((l) => l.nbHref === null));
});

test('manglende tekst for en lokal kilde kaster med adressen', () => {
  const t = falsk();
  delete t.lenker['/da/dr-mad/'];
  assert.throws(() => lokaliserHyller('da', t), /mangler tekst.*\/da\/dr-mad\//);
});

test('hver lokale kilde er en side som finnes, på sitt eget språk', () => {
  const stier = new Set(alleSider(rot).map((s) => s.sti));
  for (const [sprak, kilder] of Object.entries(LOKALE_KILDER)) for (const { href, nbHref } of kilder) {
    assert.ok(stier.has(href), href);
    assert.ok(href.startsWith(`/${sprak}/`), href);
    assert.equal(nbHref, null);
  }
});

// Uavhengig fasit, skrevet ut for hånd og ikke utledet fra koden.
test('de lokale kildene per språk er nøyaktig disse', () => {
  assert.deepEqual(Object.fromEntries(Object.entries(LOKALE_KILDER).map(([s, k]) => [s, k.map((x) => x.href)])), {
    sv: ['/sv/koket/', '/sv/landleys-kok/'],
    da: ['/da/dr-mad/', '/da/alletiders-kogebog/'],
    en: [],
  });
  for (const [s, hrefer] of [['sv', ['/sv/koket/', '/sv/landleys-kok/']], ['da', ['/da/dr-mad/', '/da/alletiders-kogebog/']], ['en', []]]) {
    const t = falsk();
    const lagre = lokaliserHyller(s, t).find((h) => h.id === 'lagre');
    assert.deepEqual(lagre.lenker.filter((l) => l.nbHref === null).map((l) => l.href), hrefer, s);
  }
});

// Midlertidig rot med bare de filene en test ber om.
function medRot(filer, kjor) {
  const grunn = mkdtempSync(join(tmpdir(), 'matlyst-hyller-'));
  try {
    for (const [sti, innhold] of Object.entries(filer)) {
      mkdirSync(join(grunn, sti, '..'), { recursive: true });
      writeFileSync(join(grunn, sti), innhold);
    }
    return kjor(`${grunn}/`);
  } finally { rmSync(grunn, { recursive: true, force: true }); }
}

test('Spør Matlyst vises når forsiden på språket har id="spor", og skjules uten', () => {
  const med = medRot({ 'sv/index.html': '<section id="spor"></section>' }, (grunn) => finn(lokaliserHyller('sv', falsk(), { grunn }), 'appen', '/#spor'));
  assert.equal(med.finnes, true);
  assert.equal(med.href, '/sv/#spor');
  const uten = medRot({ 'sv/index.html': '<section></section>' }, (grunn) => finn(lokaliserHyller('sv', falsk(), { grunn }), 'appen', '/#spor'));
  assert.equal(uten.finnes, false);
});

test('en lenke vises ikke når fila på språket mangler, og vises når den finnes', () => {
  const funn = (filer) => medRot(filer, (grunn) => finn(lokaliserHyller('sv', falsk(), { grunn }), 'appen', '/handleliste/'));
  assert.equal(funn({ 'sv/inkopslista/index.html': '' }).finnes, true);
  assert.equal(funn({ 'sv/index.html': '' }).finnes, false);
});

for (const s of ['sv', 'da', 'en']) {
  test(`${s}: hver hylle og lenke har tekst, og hver synlige lenke finnes`, () => {
    const hyller = lokaliserHyller(s, HYLLETEKST[s]);
    assert.equal(hyller.length, 6);
    for (const h of hyller) {
      assert.ok(h.navn && h.navn.length <= 18, h.navn);
      for (const l of h.lenker) {
        assert.ok(l.tekst && l.tekst.length <= 24, `${h.id}: ${l.tekst}`);
        assert.doesNotMatch(l.tekst, /[–—]|\b(kopp|kopper|kop|koppar)\b/i);
        if (l.finnes && !/^https?:/.test(l.href)) {
          const sti = l.href.split('#')[0];
          assert.ok(existsSync(join(rot, sti.endsWith('/') ? `${sti}index.html` : sti)), `${s} ${l.href}`);
        }
      }
    }
  });
  test(`${s}: tekstfila har ingen nøkler koden ikke kjenner`, () => {
    const kjente = new Set([...HYLLER.nb.flatMap((h) => h.lenker.map((l) => l.href)), ...LOKALE_KILDER[s].map((k) => k.href)]);
    for (const nokkel of Object.keys(HYLLETEKST[s].lenker)) if (!kjente.has(nokkel) && !Object.values(LOKALE_KILDER).flat().some((k) => k.href === nokkel)) assert.fail(nokkel);
  });
}
