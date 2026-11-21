// De ferdige omregnersidene: kalkulatorkortet i `topp`, kort svar, lesedelen uten svarboks og innholdsfortegnelse,
// og «cups» som hovedord. Forventningene utledes av kilden (generatoren og enheter.mjs), ikke av kopierte tall.
// Alle fire språk står i tabellen SPRAK under. Engelsk har ikke kopp-ordet og ikke «cups»-regelen for navn (cups er allerede hovedordet).
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { ENHETER, FLERTALL, HURTIG_BROK, enhetsKort, KORT_ETIKETTER, START, enheterFor, kortSetning, konverter, tall } from '../scripts/enheter.mjs';
import { byggLese, byggRik } from '../scripts/rik-sider.mjs';
import * as NB from '../scripts/nb-enhetssider.mjs';
import * as SV from '../scripts/sv-enhetssider.mjs';
import * as DA from '../scripts/da-enhetssider.mjs';
import { enhetsSider as enhetsSiderEn } from '../scripts/en-enhetssider.mjs';
import { rikeSider } from '../scripts/en-rike-sider.mjs';

const stor = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const ROT = fileURLToPath(new URL('..', import.meta.url));
const FASIT_SEKSJONER = JSON.parse(readFileSync(`${ROT}test/fasit/omregner-seksjoner.json`, 'utf8'));

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
    hubOverskrift: '<h2 id="convert-any-cooking-unit">Convert any cooking unit</h2>',
    hubInnledning: /^<p>A free cooking unit converter for every combination: /u, hubVolum: 'The calculator above converts volume\\. For weight, length, and temperature, use the lists below\\.',
    hubPeker: /use the calculator above\.<\/p>/u, til: 'to', verb: (a, b) => `Convert ${a} to ${b}`,
  },
  nb: {
    sider: NB.enhetsSiderNb, KOPP_BIORD: NB.KOPP_BIORD, mappe: 'verktoy/', hub: 'verktoy/enhetsomregner/', komma: true, hoved: /\bcups?\b/iu, biord: /kopp/iu, ordFor: ordFor('nb'),
    publisert: 'dl-til-kopp', kalkH2: /^Kalkulator/u, kortSvar: 'Kort svar:', tabellId: /^<h2 id="(?:omregningstabell|tabell|tabel)/u, likeNavn: true,
    h2: [/^Omregningstabell: /u, /^Slik regner du om /u, /^Hvor oppskrifter bruker /u, /^Tips til måling$/u, /^Vanlige feil ved omregning$/u, /^Regn om en hel oppskrift$/u, /^Slutt å regne om for hånd$/u, /^Beslektede omregninger$/u],
    hubInnledning: /^<p>En gratis omregner for matlaging, med alle kombinasjoner: /u, hubVolum: 'Kalkulatoren over regner om volum\\. For vekt, lengde og temperatur bruker du listene under\\.',
    hubPeker: /bruk kalkulatoren over\.<\/p>/u, til: 'til', verb: (a, b) => `Regn om ${a} til ${b}`,
    krus: (ml) => `Å måle med et kaffekrus. Kruset i skapet rommer sjelden ${ml} ml, som er det en cup er.`, stavefeil: /målesje/iu, riktigSkje: /måleskje/u,
  },
  sv: {
    sider: SV.enhetsSiderSv, KOPP_BIORD: SV.KOPP_BIORD, mappe: 'sv/verktyg/', hub: 'verktyg/enhetsomvandlare/', komma: true, hoved: /\bcups?\b/iu, biord: /kopp/iu, ordFor: ordFor('sv'),
    publisert: 'dl-till-kopp', kalkH2: /^Omvandlare från /u, kortSvar: 'Kort svar:', tabellId: /^<h2 id="(?:omregningstabell|tabell|tabel)/u, likeNavn: true,
    h2: [/^Tabell: /u, /^Så räknar du om /u, /^Där recept använder /u, /^Tips för mätning$/u, /^Vanliga misstag vid omräkning$/u, /^Räkna om ett helt recept$/u, /^Sluta räkna om för hand$/u, /^Närliggande omvandlingar$/u],
    hubInnledning: /^<p>En gratis omvandlare för matlagning med alla kombinationer: /u, hubVolum: 'Omvandlaren ovan räknar om volym\\. För vikt, längd och temperatur använder du listorna nedan\\.',
    hubPeker: /använd omvandlaren ovan\.<\/p>/u, til: 'till', verb: (a, b) => `Räkna om ${a} till ${b}`, hubCup: /\bcup\b/u,
    krus: (ml) => `Att mäta med en kaffemugg. En mugg rymmer sällan ${ml} ml, som en cup gör.`,
  },
  da: {
    sider: DA.enhetsSiderDa, KOPP_BIORD: DA.KOPP_BIORD, mappe: 'da/vaerktoejer/', hub: 'vaerktoejer/enhedsomregner/', komma: true, hoved: /\bcups?\b/iu, biord: /\bkop(pe[rn]?)?\b/iu, ordFor: ordFor('da'),
    publisert: 'dl-til-kop', kalkH2: /^Regnemaskine: /u, kortSvar: 'Kort svar:', tabellId: /^<h2 id="(?:omregningstabell|tabell|tabel)/u, likeNavn: true,
    h2: [/^Tabel: /u, /^Sådan regner du /u, /^Hvor opskrifter bruger /u, /^Tips til måling$/u, /^Almindelige fejl, når du regner om$/u, /^Regn en hel opskrift om$/u, /^Hold op med at regne om i hånden$/u, /^Beslægtede omregninger$/u],
    hubInnledning: /^<p>Her finder du alle køkkenomregninger samlet: /u, hubVolum: 'Regnemaskinen herover regner volumen om\\. Til vægt, længde og temperatur bruger du listerne herunder\\.',
    hubPeker: null, til: 'til', verb: (a, b) => `Regn ${a} om til ${b}`, hubCup: /\bcup\b/u,
    krus: (ml) => `Du måler med et kaffekrus. Et krus rummer sjældent ${ml} ml, som er det, en cup er.`, stavefeil: /målske/iu, riktigSkje: /måleske/u,
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

  test(`${lang}: lesedelen begynner med tabellen og har de åtte seksjonene i samme rekkefølge som de publiserte sidene`, () => {
    // Fasit: test/fasit/omregner-seksjoner.json, frosset fra de publiserte sidene på origin/main FØR ombyggingen (ikke fra filene i arbeidskopien,
    // som ombyggingen overskriver). Én parside per enhetsgruppe og samlesiden; kalkulatorseksjonen er tatt ut. Det eneste som er endret med vilje er
    // ordet kopper/koppar, som nå er «cups» (avgjørelse 1), og at H2 med kortform først har stor forbokstav («Ml to cl conversion chart»); begge normaliseres før sammenligningen.
    const fasit = FASIT_SEKSJONER[lang];
    const cups = (h) => stor(h.replace(/\bkopper\b|\bkoppar\b/gu, 'cups'));
    const h2Av = (s) => [...s.rik.matchAll(/<h2 id="[^"]*">([\s\S]*?)<\/h2>/gu)].map((m) => m[1]);
    assert.deepEqual(Object.keys(fasit.par).sort(), ['lengde', 'temperatur', 'vekt', 'volum'], 'fasiten har ett par per gruppe');
    for (const [gruppe, { side, h2 }] of Object.entries(fasit.par)) {
      const sti = side.replace(/^(?:sv|da|en)\//u, '');
      assert.ok(S.sider[sti], `${lang}: fasitsiden ${side} (${gruppe}) finnes i generatoren som ${sti}`);
      assert.equal(h2.length, 8, `${gruppe}: fasiten har åtte seksjoner`);
      assert.deepEqual(h2Av(S.sider[sti]), h2.map(cups), `${lang} ${gruppe}: seksjonene og rekkefølgen er som på den publiserte siden`);
    }
    assert.deepEqual(h2Av(S.sider[S.hub]), fasit.samleside.h2.map(cups), `${lang}: samlesidens seksjoner er som på den publiserte siden (uten kalkulatoren)`);
    fasit.par.volum.h2.forEach((h, i) => assert.match(h, S.h2[i], `fasit, seksjon ${i + 1}`));
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

  // Tittel og H1 følger mønsteret alle sidene har: «Regn om <kort> til <kort>: <navn> til <navn>» og «<Navn> til <navn> (<kort> til <kort>)».
  // Sammenslåingen av like ledd gjelder bare valgteksten i kortet, ikke tittel og H1. Unntak: forkortes når delen etter kolon bare gjentar parleddet,
  // og tittelen er kortformen alene når den lange er over 60 tegn. H1 uten parentes når parentesen ville vært identisk med teksten foran.
  test(`${lang}: tittel og H1 følger mønsteret, med søkeordet sammenhengende («cups til dl»)`, () => {
    let medLikt = 0;
    for (const [sti, s] of sider) {
      const [fra, til] = fraTil(s);
      const F = ENHETER[fra][lang]; const T = ENHETER[til][lang];
      const parKort = `${F.kort} ${S.til} ${T.kort}`;
      const parNavn = `${F.fl} ${S.til} ${T.fl}`;
      const lang0 = `${S.verb(F.kort, T.kort)}: ${parNavn}`;
      const forventetTittel = parNavn.toLocaleLowerCase() === parKort.toLocaleLowerCase() || lang0.length > 60 ? S.verb(F.kort, T.kort) : lang0;
      assert.equal(s.title, forventetTittel, sti);
      const base = `${stor(F.fl)} ${S.til} ${T.fl}`;
      const forventetH1 = base.toLocaleLowerCase() === parKort.toLocaleLowerCase() ? base : `${base} (${parKort})`;
      assert.equal(s.h1, forventetH1, sti);
      if ([F, T].some((e) => [e.fl, e.en].some((t) => t.toLocaleLowerCase() === e.kort.toLocaleLowerCase()))) medLikt++;
    }
    if (S.likeNavn) assert.ok(medLikt >= 2 * (enheterFor(lang).filter((id) => ENHETER[id].gruppe === 'volum').length - 1), 'cups er en slik enhet, og sidene med den er med');
    // Konkrete sider fra bestillingen.
    if (lang === 'nb') {
      assert.equal(S.sider['verktoy/kopp-til-dl/'].title, 'Regn om cups til dl: cups til desiliter');
      assert.equal(S.sider['verktoy/kopp-til-dl/'].h1, 'Cups til desiliter (cups til dl)');
      assert.equal(S.sider['verktoy/dl-til-kopp/'].title, 'Regn om dl til cups: desiliter til cups');
      assert.equal(S.sider['verktoy/dl-til-kopp/'].h1, 'Desiliter til cups (dl til cups)');
    }
    if (lang === 'sv') {
      assert.equal(S.sider['verktyg/kopp-till-dl/'].title, 'Räkna om cup till dl: cups till deciliter');
      assert.equal(S.sider['verktyg/kopp-till-dl/'].h1, 'Cups till deciliter (cup till dl)');
    }
    if (lang === 'da') {
      assert.equal(S.sider['vaerktoejer/kop-til-dl/'].title, 'Regn cup om til dl: cups til deciliter');
      assert.equal(S.sider['vaerktoejer/kop-til-dl/'].h1, 'Cups til deciliter (cup til dl)');
    }
  });

  test(`${lang}: ingen tittel gjentar parleddet etter kolon`, () => {
    const ord = (t) => t.toLocaleLowerCase().match(/[\p{L}\p{N}°]+/gu) ?? [];
    let medKolon = 0;
    for (const [sti, s] of Object.entries(S.sider)) {
      const [foran, ...etter] = s.title.split(': ');
      if (!etter.length) continue;
      medKolon++;
      const fore = new Set(ord(foran));
      assert.ok(!ord(etter.join(': ')).every((o) => fore.has(o)), `${sti}: «${s.title}» gjentar leddet`);
    }
    assert.ok(medKolon > 100, 'vakten ser titler med kolon');
  });

  test(`${lang}: ingen like nabo-ord i overskriftene`, () => {
    for (const [sti, s] of Object.entries(S.sider)) {
      for (const [, raw] of `<h1>${s.h1}</h1>${s.rik}`.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gu)) {
        const ord = synligTekst(raw).toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
        for (let i = 1; i < ord.length; i += 1) assert.notEqual(ord[i], ord[i - 1], `${sti}: ${raw}`);
      }
    }
  });

  test(`${lang}: overskriftene begynner med stor forbokstav`, () => {
    for (const [sti, s] of Object.entries(S.sider)) {
      for (const [, raw] of `<h1>${s.h1}</h1>${s.rik}<h2>${s.faqTittel}</h2>`.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gu)) {
        const t = synligTekst(raw).trim();
        assert.equal(t.charAt(0), t.charAt(0).toLocaleUpperCase(lang), `${sti}: «${t}»`);
      }
    }
  });

  test(`${lang}: regnestykket er det samme i description, steg 3, kort svar og kortets setning (temperatur: 180 °C, 350 °F)`, () => {
    let temp = 0;
    for (const [sti, s] of sider) {
      const [fra, til] = fraTil(s);
      const forventet = kortSetning(lang, fra, til);
      if (ENHETER[fra].gruppe === 'temperatur') {
        temp++;
        assert.ok(forventet.startsWith(fra === 'c' ? '180 °C = 356 °F' : '350 °F = 176'), `${sti}: ${forventet}`);
      }
      assert.ok(s.description.includes(`${forventet}.`), `${sti}: description har «${forventet}.»: ${s.description}`);
      assert.ok(s.steg[2][1].includes(`${forventet}.`), `${sti}: steg 3 har «${forventet}.»: ${s.steg[2][1]}`);
      assert.ok(/<p class="kortsvar"><b>[^<]*<\/b> ([^<]*)</u.exec(s.topp)[1].startsWith(`${forventet}.`), `${sti}: kort svar`);
      assert.equal(/data-felt="setning"[^>]*>([^<]*)</u.exec(s.topp)[1], forventet, `${sti}: kortets setning`);
    }
    assert.equal(temp, 2, 'celsius til fahrenheit og motsatt');
  });

  // Enheten bøyes etter samme regel overalt på siden som i kortet: «1 cup», «2 cups», «1,5 cups», «0,4227 cups».
  test(`${lang}: enheter med flertallsform bøyes ved hvert tall (tittel, beskrivelse, tabell, eksempler, spørsmål, steg)`, () => {
    const former = Object.values(FLERTALL[lang] ?? {});
    let sett = 0;
    for (const [sti, s] of Object.entries(S.sider)) {
      const tekst = `${sideTekst(s)} ${s.title} ${s.description}`;
      for (const [entall, flertall] of former) {
        const re = new RegExp(`(?<![\\p{L}\\d.,/-])(\\d+(?:[.,]\\d+)?) (${entall}|${flertall})(?![\\p{L}\\d])`, 'gu');
        for (const [, n, ord] of tekst.matchAll(re)) {
          sett++;
          const skalVaereEntall = n === '1';
          assert.equal(ord, skalVaereEntall ? entall : flertall, `${sti}: «${n} ${ord}»`);
        }
      }
    }
    if (lang !== 'en' || former.length) assert.ok(sett > 100, `vakten ser tall ved enhetene (${sett})`);
  });

  test(`${lang}: kaffekrus-setningen i feillisten gjelder volumet, ikke størrelsen på målebegeret`, { skip: !S.krus }, () => {
    const setning = S.krus(tall(ENHETER.cups.f).replace('.', ','));
    assert.equal(setning.includes('236,6'), true);
    let sett = 0;
    for (const [sti, s] of sider) {
      if (ENHETER[fraTil(s)[0]].gruppe !== 'volum') continue;
      sett++;
      assert.ok(synligTekst(s.rik).includes(setning), `${sti}: «${setning}»`);
      assert.doesNotMatch(synligTekst(s.rik), /som målebeger|som mätglas|som målebæger|lige så stort som et målebæger/u, sti);
    }
    assert.ok(sett > 100);
  });

  test(`${lang}: ingen ordet «målesje» eller «målske», og «måleskje»/«måleske» står rett`, { skip: !S.stavefeil }, () => {
    const kilde = readFileSync(`${ROT}scripts/${lang}-enhetssider.mjs`, 'utf8');
    assert.doesNotMatch(kilde, S.stavefeil, 'generatoren');
    let rett = 0;
    for (const [sti, s] of Object.entries(S.sider)) {
      const tekst = `${sideTekst(s)} ${s.title} ${s.description}`;
      assert.doesNotMatch(tekst, S.stavefeil, sti);
      if (S.riktigSkje.test(tekst)) rett++;
    }
    assert.ok(rett > 5, 'vakten ser det riktige ordet');
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
    // Engelsk: de to avsnittene står under den opprinnelige overskriften «Convert any cooking unit» (første seksjon), som også utløser appkortet for kokemodus.
    const lese = S.hubOverskrift ? hub.rik.replace(S.hubOverskrift, '') : hub.rik;
    if (S.hubOverskrift) assert.ok(hub.rik.startsWith(S.hubOverskrift), `${S.hub}: første seksjon er «Convert any cooking unit»`);
    assert.match(lese, S.hubInnledning, `${S.hub}: lesedelen åpner med innledningen`);
    assert.match(lese, new RegExp(`^<p>[^<]+</p><p>${S.hubVolum}</p>`, 'u'), `${S.hub}: volumsetningen er avsnitt to`);
    assert.doesNotMatch(hub.rik, /class="answer"|class="toc"|<form/u);
    // Innledningen viser til kortet over (ikke «under» eller «her»), og setningen om volum sier det samme.
    if (S.hubPeker) assert.match(lese.split('</p>')[0] + '</p>', S.hubPeker, `${S.hub}: innledningen peker på kalkulatoren over`);
    assert.doesNotMatch(lese.slice(0, lese.indexOf('<h2')), /Kalkulatoren her |Den här omvandlaren|Regnemaskinen her |This calculator /u, `${S.hub}: «her» peker feil vei`);
  });

  test(`${lang}: samlesiden og enhetssidene har rett hovedord i tittelen`, () => {
    const hub = S.sider[S.hub];
    assert.ok(hub.title.length <= 60, hub.title);
    if (S.hubCup) {
      assert.match(hub.title, S.hubCup, hub.title);
      assert.doesNotMatch(hub.title, /\bcups\b/u, hub.title);
    }
  });

  test(`${lang}: «jug» står ikke i sidene, og væske måles i «liquid measuring cup»`, { skip: lang !== 'en' }, () => {
    for (const [sti, s] of Object.entries(S.sider)) assert.doesNotMatch(`${sideTekst(s)} ${s.description}`, /\bjugs?\b/iu, sti);
    assert.match(sideTekst(S.sider['tools/ml-to-dl/']), /liquid measuring cup/u);
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
