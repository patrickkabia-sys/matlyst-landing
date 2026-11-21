// De ferdige omregnersidene: kalkulatorkortet i `topp`, kort svar, lesedelen uten svarboks og innholdsfortegnelse,
// og «cups» som hovedord. Forventningene utledes av kilden (generatoren og enheter.mjs), ikke av kopierte tall.
// Alle fire språk står i tabellen SPRAK under. Engelsk har ikke kopp-ordet og ikke «cups»-regelen for navn (cups er allerede hovedordet).
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { ENHETER, FLERTALL, HURTIG_BROK, enhetsKort, KORT_ETIKETTER, START, enheterFor, konverter, tall } from '../scripts/enheter.mjs';
import { byggLese, byggRik } from '../scripts/rik-sider.mjs';
import * as NB from '../scripts/nb-enhetssider.mjs';
import * as SV from '../scripts/sv-enhetssider.mjs';
import * as DA from '../scripts/da-enhetssider.mjs';
import { enhetsSider as enhetsSiderEn } from '../scripts/en-enhetssider.mjs';
import { rikeSider } from '../scripts/en-rike-sider.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));

/** Synlig tekst: HTML uten script, tagger og attributter. */
const synligTekst = (html) => html.replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<[^>]+>/gu, ' ').replace(/&amp;/gu, '&').replace(/\s+/gu, ' ');
const sideTekst = (s) => synligTekst([s.eyebrow, s.h1, s.lead, s.topp, s.rik, s.forst, s.stegTittel, ...(s.steg ?? []).flat(), s.faqTittel, ...(s.faq ?? []).flat(), s.cta].join(' <br> '));

// Én rad per språk som er slått på. `hoved` er hovedordet i enhetsnavn, `biord` kopp-ordet, `siderMed` sidene der cups er med.
const ordFor = (lang) => (id, v) => FLERTALL[lang]?.[id]?.[v === 1 ? 0 : 1] ?? ENHETER[id][lang].kort;
const SPRAK = {
  en: {
    sider: { ...enhetsSiderEn, 'tools/unit-converter/': rikeSider['tools/unit-converter/'] }, mappe: 'en/tools/', hub: 'tools/unit-converter/', komma: false, hoved: /\bcups?\b/iu, biord: null, KOPP_BIORD: null, ordFor: ordFor('en'),
    publisert: 'cups-to-ml', kalkH2: / calculator$/u, kortSvar: 'Short answer:', tabellId: /^<h2 id="[a-z0-9-]+-conversion-chart"/u, likeNavn: false,
    h2: [/ conversion chart$/u, /^How to convert /u, /^Where recipes use /u, /^Measuring tips$/u, /^Common mistakes when converting$/u, /^Converting a whole recipe$/u, /^Stop converting by hand$/u, /^Related conversions$/u],
    hubInnledning: /^<p>A free cooking unit converter for every combination: /u, hubVolum: 'This calculator converts volume\\. For weight, length, and temperature, use the lists below\\.',
  },
  nb: {
    sider: NB.enhetsSiderNb, KOPP_BIORD: NB.KOPP_BIORD, mappe: 'verktoy/', hub: 'verktoy/enhetsomregner/', komma: true, hoved: /\bcups?\b/iu, biord: /kopp/iu, ordFor: ordFor('nb'),
    publisert: 'dl-til-kopp', kalkH2: /^Kalkulator/u, kortSvar: 'Kort svar:', tabellId: /^<h2 id="(?:omregningstabell|tabell|tabel)/u, likeNavn: true,
    h2: [/^Omregningstabell: /u, /^Slik regner du om /u, /^Hvor oppskrifter bruker /u, /^Tips til måling$/u, /^Vanlige feil ved omregning$/u, /^Regn om en hel oppskrift$/u, /^Slutt å regne om for hånd$/u, /^Beslektede omregninger$/u],
    hubInnledning: /^<p>En gratis omregner for matlaging, med alle kombinasjoner: /u, hubVolum: 'Kalkulatoren her regner om volum\\. For vekt, lengde og temperatur bruker du listene under\\.',
  },
  sv: {
    sider: SV.enhetsSiderSv, KOPP_BIORD: SV.KOPP_BIORD, mappe: 'sv/verktyg/', hub: 'verktyg/enhetsomvandlare/', komma: true, hoved: /\bcups?\b/iu, biord: /kopp/iu, ordFor: ordFor('sv'),
    publisert: 'dl-till-kopp', kalkH2: /^Omvandlare från /u, kortSvar: 'Kort svar:', tabellId: /^<h2 id="(?:omregningstabell|tabell|tabel)/u, likeNavn: true,
    h2: [/^Tabell: /u, /^Så räknar du om /u, /^Där recept använder /u, /^Tips för mätning$/u, /^Vanliga misstag vid omräkning$/u, /^Räkna om ett helt recept$/u, /^Sluta räkna om för hand$/u, /^Närliggande omvandlingar$/u],
    hubInnledning: /^<p>En gratis omvandlare för matlagning med alla kombinationer: /u, hubVolum: 'Den här omvandlaren räknar volym\\. För vikt, längd och temperatur använder du listorna nedan\\.',
  },
  da: {
    sider: DA.enhetsSiderDa, KOPP_BIORD: DA.KOPP_BIORD, mappe: 'da/vaerktoejer/', hub: 'vaerktoejer/enhedsomregner/', komma: true, hoved: /\bcups?\b/iu, biord: /\bkop(pe[rn]?)?\b/iu, ordFor: ordFor('da'),
    publisert: 'dl-til-kop', kalkH2: /^Regnemaskine: /u, kortSvar: 'Kort svar:', tabellId: /^<h2 id="(?:omregningstabell|tabell|tabel)/u, likeNavn: true,
    h2: [/^Tabel: /u, /^Sådan regner du /u, /^Hvor opskrifter bruger /u, /^Tips til måling$/u, /^Almindelige fejl, når du regner om$/u, /^Regn en hel opskrift om$/u, /^Hold op med at regne om i hånden$/u, /^Beslægtede omregninger$/u],
    hubInnledning: /^<p>Her finder du alle køkkenomregninger samlet: /u, hubVolum: 'Regnemaskinen her regner volumen om\\. Til vægt, længde og temperatur bruger du listerne herunder\\.',
  },
};
for (const S of Object.values(SPRAK)) S.sluttPaaPar = (n) => n !== S.hub;

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
    assert.ok(sider.length >= 100, `forventet minst 100 parsider, fant ${sider.length}`);
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
      // Det korte svaret under kortet åpner med kortets egen setning (samme startmengde, også for temperatur: 180 °C, 350 °F).
      assert.ok(/<p class="kortsvar"><b>[^<]*<\/b> ([^<]*)</u.exec(s.topp)[1].startsWith(`${setning}.`), `${sti}: kort svar åpner med «${setning}.»`);
      assert.ok(s.topp.includes(`<p class="kortsvar"><b>${S.kortSvar}</b> `), `${sti}: etiketten «${S.kortSvar}»`);
    }
  });

  test(`${lang}: lesedelen begynner med tabellen og har de åtte seksjonene i dagens rekkefølge`, () => {
    // Fasit: de åtte seksjonene som står i de publiserte sidene (eldre bygg) etter kalkulatorseksjonen, med de samme innledningene.
    const publisert = readFileSync(`${ROT}${S.mappe}${S.publisert}/index.html`, 'utf8');
    let gamle = [...publisert.matchAll(/<h2 id="[^"]*">([\s\S]*?)<\/h2>/gu)].map((m) => m[1]);
    if (S.kalkH2.test(gamle[0])) gamle = gamle.slice(1);
    assert.equal(gamle.length, 8);
    assert.equal(S.h2.length, 8);
    S.h2.forEach((re, i) => assert.match(gamle[i], re, `publisert side, seksjon ${i + 1}`));
    for (const [sti, s] of sider) {
      const h2 = [...s.rik.matchAll(/<h2 id="[^"]*">([\s\S]*?)<\/h2>/gu)].map((m) => m[1]);
      assert.equal(h2.length, 8, sti);
      S.h2.forEach((re, i) => assert.match(h2[i], re, `${sti}: seksjon ${i + 1}`));
      assert.doesNotMatch(s.rik, S.kalkH2, sti);
      assert.match(s.rik, S.tabellId, `${sti}: lesedelen åpner med tabellen`);
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
        if (S.biord) assert.doesNotMatch(tekst, S.biord, `${sti} ${navn}`);
      }
      if (S.biord) assert.doesNotMatch(synligTekst(s.topp), S.biord, `${sti}: kortet`);
    }
    const volum = enheterFor(lang).filter((id) => ENHETER[id].gruppe === 'volum').length;
    assert.equal(med, 2 * (volum - 1), 'cups er med på like mange sider fra som til');
  });

  // Kopp-ordet finnes bare på nb, sv og da. Engelsk sier «cup» fra før og har ingen biord.
  if (S.biord) {
    test(`${lang}: «kopp» står bare i setningene i KOPP_BIORD`, () => {
      const setninger = Object.values(S.KOPP_BIORD).flat();
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
        assert.equal(tekst.includes(S.KOPP_BIORD.sammeSporsmal), medCups, `${sti}: spørsmålet om cups og kopp`);
        assert.equal(tekst.includes(S.KOPP_BIORD.sammeSvar), medCups, `${sti}: svaret om cups og kopp`);
        assert.equal(tekst.includes(S.KOPP_BIORD.forklaring), medCups && !hub, `${sti}: forklaringssetningen`);
        assert.equal(tekst.includes(S.KOPP_BIORD.dlSporsmal), mellom, `${sti}: spørsmålet om dl og kopp`);
        assert.equal(tekst.includes(S.KOPP_BIORD.dlSvar), mellom, `${sti}: svaret om dl og kopp`);
      }
    });
  }

  test(`${lang}: samme tall for en cup overalt på siden: 3 gjeldende sifre står ikke ved siden av kort svar med 4`, () => {
    const fire = tall(konverter(1, 'cups', 'dl'));
    const tre = String(Number(Number(fire).toPrecision(3)));
    assert.notEqual(fire, tre);
    const mønster = new RegExp(`(?<![\\d.,])${tre.replace('.', '[.,]')} dl(?![\\p{L}\\d])`, 'u');
    let sett = 0;
    for (const [sti, s] of Object.entries(S.sider)) {
      sett++;
      assert.doesNotMatch(sideTekst(s), mønster, `${sti}: «${tre} dl» for en cup, kort svar sier ${fire}`);
    }
    assert.ok(sett > 0);
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
        const { en, fl, kort } = ENHETER[id][lang];
        if (![fl, en].some((t) => t.toLocaleLowerCase() === kort.toLocaleLowerCase())) continue;
        sjekket++;
        const antall = (s.h1.toLocaleLowerCase().match(new RegExp(`(?<![\\p{L}])${fl.toLocaleLowerCase()}(?![\\p{L}])`, 'gu')) ?? []).length;
        assert.equal(antall, 1, `${sti}: «${fl}» står ${antall} ganger i H1: ${s.h1}`);
      }
    }
    if (S.likeNavn) assert.ok(sjekket >= 2 * (enheterFor(lang).filter((id) => ENHETER[id].gruppe === 'volum').length - 1), 'cups er en slik enhet');
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

  test(`${lang}: valgteksten for cups er «Cups», ikke «Cups (cup)»`, () => {
    for (const [sti, s] of sider) assert.doesNotMatch(s.topp, />Cups \(cups?\)</u, sti);
  });

  test(`${lang}: samlesiden har kortet med volumenhetene og setningen om volum som første avsnitt`, () => {
    const hub = S.sider[S.hub];
    assert.match(hub.topp, /data-kalk="enhet"/u);
    assert.doesNotMatch(hub.topp, /kalkvare/u);
    const ids = [...hub.topp.matchAll(/<select data-felt="fra">([\s\S]*?)<\/select>/gu)][0][1].matchAll(/<option value="([^"]+)"/gu);
    assert.ok([...ids].every(([, id]) => ENHETER[id].gruppe === 'volum'));
    // Den gamle innledningen (dagens svarTekst) er første avsnitt; setningen om at kalkulatoren regner volum kommer rett etter.
    assert.match(hub.rik, S.hubInnledning, `${S.hub}: lesedelen åpner med innledningen`);
    assert.match(hub.rik, new RegExp(`^<p>[^<]+</p><p>${S.hubVolum}</p>`, 'u'), `${S.hub}: volumsetningen er avsnitt to`);
    assert.doesNotMatch(hub.rik, /class="answer"|class="toc"|<form/u);
  });
}

test('sv og da: kortets etiketter er på språket, og feilmeldingen bruker språkets eksempel', () => {
  for (const lang of ['sv', 'da']) {
    const E = KORT_ETIKETTER[lang];
    // «Fra» og «Til» er samme ord på dansk som på norsk; resten skal være skrevet om.
    for (const felt of ['mengde', 'bytt', 'vanlige', 'feil', ...(lang === 'sv' ? ['fra', 'til'] : [])]) assert.notEqual(E[felt], KORT_ETIKETTER.nb[felt], `${lang} ${felt}`);
    assert.notEqual(E.aria(ENHETER.ml[lang], ENHETER.dl[lang]), KORT_ETIKETTER.nb.aria(ENHETER.ml.nb, ENHETER.dl.nb), `${lang} aria`);
    for (const [sti, s] of Object.entries(SPRAK[lang].sider)) {
      const data = JSON.parse(/<script type="application\/json" class="kalk-data">([\s\S]*?)<\/script>/u.exec(s.topp)[1]);
      assert.equal(data.feil, E.feil, sti);
      assert.match(data.feil, /2,5/u, `${sti}: komma i eksempelet`);
      for (const etikett of [E.mengde, E.fra, E.til, E.bytt, E.vanlige]) assert.ok(s.topp.includes(etikett), `${sti}: «${etikett}»`);
    }
  }
});

test('en: kortet tar brøker og har brøker som hurtigmengder for cups, tbsp og tsp', () => {
  const data = (html) => JSON.parse(/<script type="application\/json" class="kalk-data">([\s\S]*?)<\/script>/u.exec(html)[1]);
  for (const [sti, s] of Object.entries(SPRAK.en.sider)) {
    const d = data(s.topp);
    assert.equal(d.brok, true, sti);
    for (const id of Object.keys(HURTIG_BROK)) if (d.steg[id]) assert.deepEqual(d.steg[id], HURTIG_BROK[id], `${sti}: ${id}`);
  }
  // Brøkene står som knapper bare der kortet har enheten; cups, tbsp og tsp finnes på volumsidene og samlesiden.
  for (const sti of ['tools/cups-to-ml/', 'tools/unit-converter/']) {
    const d = data(SPRAK.en.sider[sti].topp);
    for (const id of ['cups', 'tbsp', 'tsp']) assert.deepEqual(d.steg[id], HURTIG_BROK[id], `${sti}: ${id}`);
  }
  // Andre språk tar ikke brøker.
  for (const lang of ['nb', 'sv', 'da']) assert.equal(data(Object.values(SPRAK[lang].sider)[0].topp).brok, undefined, lang);
});

test('en: fiksturen for brøkene er kortet slik generatoren lager det nå', () => {
  const fikstur = readFileSync(`${ROT}test/playwright/fiksturer/kalk-enhet-en.html`, 'utf8');
  for (const [id, fra, til] of [['cups', 'cups', 'ml'], ['temp', 'f', 'c']]) {
    assert.ok(fikstur.includes(enhetsKort('en', fra, til).replace('<form class="kalk" ', `<form class="kalk" id="${id}" `)), `${id}: kortet i fiksturen er utdatert, lag den på nytt`);
  }
  assert.match(fikstur, /<html lang="en">/u);
});

test('nb: cups har nye navn, og adressen er som før', () => {
  const { enhetsSiderNb } = NB;
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

test('ingen kode for den gamle omregneren står igjen', () => {
  // Uten kommentarer: kommentarene forklarer hva som er borte og siterer derfor navnene.
  const utenKommentarer = (kode) => kode.replace(/\/\*[\s\S]*?\*\//gu, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/gu, '$1');
  const site = utenKommentarer(readFileSync(`${ROT}site.js`, 'utf8'));
  const css = utenKommentarer(readFileSync(`${ROT}side.css`, 'utf8'));
  assert.ok(site.length > 1000 && css.length > 1000, 'filene er lest');
  assert.match(site, /form\.kalk/u, 'vakten ser kalkulatorkortet i site.js, ellers er den blind');
  assert.match(css, /\.omregner-liste/u, 'vakten ser listestilen, som blir stående');
  for (const navn of ['form.omregner', 'omregner-rad', 'omregner-svar', 'omregner-bytt', 'omregner-data', 'data-handling']) {
    assert.ok(!site.includes(navn), `site.js nevner ${navn}`);
    assert.ok(!css.includes(navn), `side.css nevner ${navn}`);
  }
  assert.ok(!/body\[data-sidetype="omregner"\] \.toc/u.test(css), 'stilen som skjuler innholdsfortegnelsen på omregnersidene');
  const kjede = utenKommentarer(readFileSync(`${ROT}scripts/kjede.mjs`, 'utf8'));
  assert.match(kjede, /'app-bevis'/u, 'vakten ser etterbehandlingen');
  assert.ok(!kjede.includes('omregner-flertall'), 'kjede.mjs nevner omregner-flertall');
  assert.equal(existsSync(`${ROT}scripts/omregner-flertall.mjs`), false);
  assert.equal(existsSync(`${ROT}test/omregner-flertall.test.mjs`), false);
});
