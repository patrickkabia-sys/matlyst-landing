// De ferdige omregnersidene: kalkulatorkortet i `topp`, kort svar, lesedelen uten svarboks og innholdsfortegnelse,
// og «cups» som hovedord. Forventningene utledes av kilden (generatoren og enheter.mjs), ikke av kopierte tall.
// Oppgave 3 slår på nb. Sv, da og en legges til i oppgave 4 og 5 (tabellen SPRAK under).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { ENHETER, FLERTALL, START, konverter, tall } from '../scripts/enheter.mjs';
import { byggLese, byggRik } from '../scripts/rik-sider.mjs';
import { KOPP_BIORD, enhetsSiderNb } from '../scripts/nb-enhetssider.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));

/** Synlig tekst: HTML uten script, tagger og attributter. */
const synligTekst = (html) => html.replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<[^>]+>/gu, ' ').replace(/&amp;/gu, '&').replace(/\s+/gu, ' ');
const sideTekst = (s) => synligTekst([s.eyebrow, s.h1, s.lead, s.topp, s.rik, s.forst, s.stegTittel, ...(s.steg ?? []).flat(), s.faqTittel, ...(s.faq ?? []).flat(), s.cta].join(' <br> '));

// Én rad per språk som er slått på. `hoved` er hovedordet i enhetsnavn, `biord` kopp-ordet, `siderMed` sidene der cups er med.
const SPRAK = {
  nb: {
    sider: enhetsSiderNb, mappe: 'verktoy/', hub: 'verktoy/enhetsomregner/', komma: true, hoved: /\bcups?\b/iu, biord: /kopp/iu,
    ordFor: (id, v) => FLERTALL.nb[id]?.[v === 1 ? 0 : 1] ?? ENHETER[id].nb.kort,
    sluttPaaPar: (s) => s.startsWith('verktoy/') && s !== 'verktoy/enhetsomregner/',
  },
};

const par = (lang) => Object.entries(SPRAK[lang].sider).filter(([sti]) => SPRAK[lang].sluttPaaPar(sti));
/** Fra- og til-enhet for en parside, utledet fra siden som genererte den (kortets valgte enheter). */
const fraTil = (side) => {
  const velg = (felt) => new RegExp(`data-felt="${felt}">(?:<option[^>]*>[^<]*</option>)*?<option value="([^"]+)" selected>`, 'u').exec(side.topp)[1];
  return [velg('fra'), velg('til')];
};

for (const lang of Object.keys(SPRAK)) {
  const S = SPRAK[lang];
  const sider = par(lang);

  test(`${lang}: hver parside har kortet i topp og ingen gammel omregner`, () => {
    assert.ok(sider.length >= 200, `forventet minst 200 parsider, fant ${sider.length}`);
    for (const [sti, s] of sider) {
      assert.equal((s.topp.match(/<form class="kalk"/gu) ?? []).length, 1, sti);
      assert.equal((s.topp.match(/data-kalk="enhet"/gu) ?? []).length, 1, sti);
      assert.equal((s.topp.match(/<p class="kortsvar">/gu) ?? []).length, 1, sti);
      assert.doesNotMatch(s.topp, /kalkvare/u, sti);
      for (const html of [s.topp, s.rik]) assert.doesNotMatch(html, /class="omregner"|class="omregner-(?:rad|svar|bytt|data)|class="answer"|class="toc"|has-toc/u, sti);
      assert.doesNotMatch(s.rik, /<form/u, `${sti}: kalkulatoren står i topp, ikke i lesedelen`);
    }
  });

  test(`${lang}: kortets statiske eksempel er det generatoren regner ut`, () => {
    for (const [sti, s] of sider) {
      const [fra, til] = fraTil(s);
      const start = START[fra] ?? 1;
      const kommaTall = (n) => (S.komma ? tall(n).replace('.', ',') : tall(n));
      const forventet = `${kommaTall(start)} ${S.ordFor(fra, start)} = ${kommaTall(konverter(start, fra, til))} ${S.ordFor(til, Number(tall(konverter(start, fra, til))))}`;
      const setning = /data-felt="setning"[^>]*>([^<]*)</u.exec(s.topp)[1];
      assert.equal(setning, forventet, sti);
      const svar = /data-felt="svar"[^>]*>([^<]*)</u.exec(s.topp)[1];
      assert.equal(svar, kommaTall(konverter(start, fra, til)), sti);
      // Det korte svaret under kortet er dagens svar: regnet med 1, også for temperatur.
      const en = `1 ${S.ordFor(fra, 1)} = ${kommaTall(konverter(1, fra, til))} ${S.ordFor(til, Number(tall(konverter(1, fra, til))))}`;
      assert.ok(/<p class="kortsvar"><b>[^<]*<\/b> ([^<]*)</u.exec(s.topp)[1].startsWith(`${en}.`), `${sti}: kort svar åpner med «${en}.»`);
    }
  });

  test(`${lang}: lesedelen begynner med tabellen og har de åtte seksjonene i dagens rekkefølge`, () => {
    // Fasit: de publiserte sidene (eldre bygg). Seksjonene etter «Kalkulator» er de samme, med de samme innledningene.
    const publisert = readFileSync(`${ROT}${S.mappe}dl-til-kopp/index.html`, 'utf8');
    const gamle = [...publisert.matchAll(/<h2 id="[^"]*">([\s\S]*?)<\/h2>/gu)].map((m) => m[1]);
    assert.match(gamle[0], /^Kalkulator/u);
    const innledning = (h) => h.split(/[:]| (?:fra|til|bruker|om|ved)\b/u)[0].trim();
    const forventet = gamle.slice(1).map(innledning);
    assert.equal(forventet.length, 8);
    for (const [sti, s] of sider) {
      const h2 = [...s.rik.matchAll(/<h2 id="[^"]*">([\s\S]*?)<\/h2>/gu)].map((m) => m[1]);
      assert.equal(h2.length, 8, sti);
      assert.deepEqual(h2.map(innledning), forventet, sti);
      assert.match(s.rik, /^<h2 id="omregningstabell/u, `${sti}: lesedelen åpner med tabellen`);
      assert.match(s.rik, /<table>/u, sti);
    }
  });

  test(`${lang}: «cups» er hovedordet på sidene med cups`, () => {
    let med = 0;
    for (const [sti, s] of sider) {
      const [fra, til] = fraTil(s);
      if (fra !== 'cups' && til !== 'cups') continue;
      med++;
      for (const [navn, tekst] of [['title', s.title], ['h1', s.h1], ['description', s.description]]) {
        assert.match(tekst, S.hoved, `${sti} ${navn}`);
        assert.doesNotMatch(tekst, S.biord, `${sti} ${navn}`);
      }
      assert.doesNotMatch(synligTekst(s.topp), S.biord, `${sti}: kortet`);
    }
    assert.equal(med, 26, 'cups er med på 13 + 13 sider');
  });

  test(`${lang}: «kopp» står bare i setningene i KOPP_BIORD`, () => {
    const setninger = Object.values(KOPP_BIORD).flat();
    assert.ok(setninger.length >= 5);
    const alle = [...Object.entries(S.sider)];
    for (const setning of setninger) {
      assert.ok(setning.length > 10);
      assert.ok(alle.some(([, s]) => sideTekst(s).includes(setning)), `ingen side inneholder: ${setning}`);
    }
    for (const [sti, s] of alle) {
      let tekst = sideTekst(s);
      for (const setning of setninger) tekst = tekst.split(setning).join(' ');
      assert.doesNotMatch(tekst, S.biord, sti);
    }
  });

  test(`${lang}: biordet står på riktige sider: forklaringen og spørsmålet der cups er med, dl-spørsmålet mellom cups og dl`, () => {
    for (const [sti, s] of [...sider, [S.hub, S.sider[S.hub]]]) {
      const tekst = sideTekst(s);
      const hub = sti === S.hub;
      const [fra, til] = hub ? ['cups', 'ml'] : fraTil(s);
      const medCups = fra === 'cups' || til === 'cups';
      const mellom = medCups && [fra, til].includes('dl');
      assert.equal(tekst.includes(KOPP_BIORD.sammeSporsmal), medCups, `${sti}: spørsmålet om cups og kopp`);
      assert.equal(tekst.includes(KOPP_BIORD.sammeSvar), medCups, `${sti}: svaret om cups og kopp`);
      assert.equal(tekst.includes(KOPP_BIORD.forklaring), medCups && !hub, `${sti}: forklaringssetningen`);
      assert.equal(tekst.includes(KOPP_BIORD.dlSporsmal), mellom, `${sti}: spørsmålet om dl og kopp`);
      assert.equal(tekst.includes(KOPP_BIORD.dlSvar), mellom, `${sti}: svaret om dl og kopp`);
    }
  });

  test(`${lang}: titler er høyst 60 tegn og beskrivelser 100 til 160`, () => {
    for (const [sti, s] of Object.entries(S.sider)) {
      assert.ok(s.title.length <= 60, `${sti}: tittelen er ${s.title.length} tegn: ${s.title}`);
      assert.ok(s.description.length >= 100 && s.description.length <= 160, `${sti}: beskrivelsen er ${s.description.length} tegn`);
    }
  });

  test(`${lang}: H1 gjentar ikke samme ord som langform og kortform`, () => {
    let sjekket = 0;
    for (const [sti, s] of sider) {
      for (const id of fraTil(s)) {
        const { fl, kort } = ENHETER[id][lang];
        if (fl.toLocaleLowerCase() !== kort.toLocaleLowerCase()) continue;
        sjekket++;
        const antall = (s.h1.toLocaleLowerCase().match(new RegExp(`(?<![\\p{L}])${fl.toLocaleLowerCase()}(?![\\p{L}])`, 'gu')) ?? []).length;
        assert.equal(antall, 1, `${sti}: «${fl}» står ${antall} ganger i H1: ${s.h1}`);
      }
    }
    assert.ok(sjekket >= 26, 'cups er en slik enhet på 26 sider');
    // og ingen like nabo-ord i overskriftene (som locale-pages.test.mjs krever for de ferdige sidene)
    for (const [sti, s] of Object.entries(S.sider)) {
      for (const [, raw] of `<h1>${s.h1}</h1>${s.rik}`.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gu)) {
        const ord = synligTekst(raw).toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
        for (let i = 1; i < ord.length; i += 1) assert.notEqual(ord[i], ord[i - 1], `${sti}: ${raw}`);
      }
    }
  });

  test(`${lang}: ingen tankestrek i synlig tekst`, () => {
    for (const [sti, s] of Object.entries(S.sider)) {
      assert.doesNotMatch(`${sideTekst(s)} ${s.title} ${s.description}`, /[–—]/u, sti);
    }
  });

  test(`${lang}: samlesiden har kortet med volumenhetene og setningen om volum som første avsnitt`, () => {
    const hub = S.sider[S.hub];
    assert.match(hub.topp, /data-kalk="enhet"/u);
    assert.doesNotMatch(hub.topp, /kalkvare/u);
    const ids = [...hub.topp.matchAll(/<select data-felt="fra">([\s\S]*?)<\/select>/gu)][0][1].matchAll(/<option value="([^"]+)"/gu);
    assert.ok([...ids].every(([, id]) => ENHETER[id].gruppe === 'volum'));
    assert.match(hub.rik, /^<p>Kalkulatoren her regner om volum\. For vekt, lengde og temperatur bruker du listene under\.<\/p>/u);
    assert.doesNotMatch(hub.rik, /class="answer"|class="toc"|<form/u);
  });
}

test('nb: cups har nye navn, og adressen er som før', () => {
  assert.deepEqual(ENHETER.cups.nb, { en: 'cup', fl: 'cups', kort: 'cups' });
  assert.deepEqual(FLERTALL.nb.cups, ['cup', 'cups']);
  assert.ok(enhetsSiderNb['verktoy/kopp-til-dl/'] && enhetsSiderNb['verktoy/dl-til-kopp/']);
});


test('byggLese: samme H2 og slugg som byggRik, men uten svarboks og innholdsfortegnelse', () => {
  const seksjoner = [['Omregningstabell: cups til dl', '<p>a</p>'], ['Slutt å regne om for hånd', '<p>b</p>']];
  const lese = byggLese({ seksjoner });
  const rik = byggRik({ svarTekst: 'svar', seksjoner, lang: 'nb' }).html;
  assert.doesNotMatch(lese, /class="answer"|class="toc"|toc-title/u);
  assert.match(rik, /class="answer"/u);
  assert.deepEqual([...lese.matchAll(/<h2 id="([^"]+)">/gu)].map((m) => m[1]), [...rik.matchAll(/<h2 id="([^"]+)">/gu)].map((m) => m[1]));
  assert.equal(lese, rik.slice(rik.indexOf('<h2 id=')));
});
