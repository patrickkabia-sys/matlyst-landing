// Familien «dl til gram» på svensk («dl till gram») og dansk («dl til gram»): samme varer, samme tall og samme kilder som den norske.
// Dataene sammenlignes med data.nb.json, og hvert tall på hver side regnes ut på nytt (uavhengig av malen) og sammenlignes på sin plass.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, SPRAKMAPPE, familieGrupper, familieSider } from '../scripts/familier/register.mjs';
import { TEKST as TEKST_NB } from '../scripts/familier/dl-til-gram/tekst-nb.mjs';
import { TEKST as TEKST_SV } from '../scripts/familier/dl-til-gram/tekst-sv.mjs';
import { TEKST as TEKST_DA } from '../scripts/familier/dl-til-gram/tekst-da.mjs';
import * as MAL_SV from '../scripts/familier/dl-til-gram/mal-sv.mjs';
import * as MAL_DA from '../scripts/familier/dl-til-gram/mal-da.mjs';
import { htmlTilTekst, synligTekst, tallUtenforData } from './hjelp/familievakt.mjs';
import { NORSKE_RESTORD } from './hjelp/restord.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const MAPPE = fileURLToPath(new URL('../scripts/familier/dl-til-gram/', import.meta.url));
const nb = lesData(MAPPE, 'nb');

// Varer som bare finnes i norsk butikk, og derfor ikke har side på svensk og dansk. Tallene gjelder ikke de nærmeste svenske og danske varene.
const BARE_NORSK = ['romme'];

// Det som er språkspesifikt, skrevet ut her og ikke hentet fra malen: roten, skjeene, spørsmålene, sitattegnene og forbudte ord.
const SPRAK = {
  sv: {
    mal: MAL_SV, tekst: TEKST_SV, rot: 'verktyg/dl-till-gram/', h1Nav: 'Dl till gram', q: ['”', '”'], mnd: 'november', hentet: 'Hämtad 20 november 2026', per: 'per',
    skjeer: [['1 krm', 1], ['1 tsk', 5], ['1 msk', 15]], tabellEtiketter: ['1 krm', '1 tsk', '1 msk', '0,5 dl', '1 dl', '2 dl', '3 dl', '4 dl', '5 dl', '1 liter'],
    forbudt: /\b(?:veier|spiseskje|spiseskjeer|teskje|teskjeer|strøken|hvor mye|oppskrift|ss|ts|og|ikke)\b/iu,
    veier: 'väger', fra: 'Från gram till dl', kortsvar: 'Kort svar:', delMed: 'Dela 100 med', titlePre: (o) => `1 dl ${o} i gram:`, eks: 'Exempel',
    tillSetning: /^Nej\. 1 dl .+ väger \d+ g, jämfört med \d+ g för .+\.$/u,
  },
  da: {
    mal: MAL_DA, tekst: TEKST_DA, rot: 'vaerktoejer/dl-til-gram/', h1Nav: 'Dl til gram', q: ['»', '«'], mnd: 'november', hentet: 'Hentet 20. november 2026', per: 'pr.',
    skjeer: [['1 tsk', 5], ['1 spsk', 15]], tabellEtiketter: ['1 tsk', '1 spsk', '0,5 dl', '1 dl', '2 dl', '3 dl', '4 dl', '5 dl', '1 liter'],
    forbudt: /\b(?:veier|spiseskje|spiseskjeer|teskje|teskjeer|strøken|hvor mye|oppskrift|oppskrifter|ss|ts|regn om for)\b/iu,
    veier: 'vejer', fra: 'Fra gram til dl', kortsvar: 'Kort svar:', delMed: 'Del 100 med', titlePre: (o) => `1 dl ${o} i gram:`, eks: 'Eksempler',
    tillSetning: /^Nej\. 1 dl .+ vejer \d+ g, mod \d+ g for .+\.$/u,
  },
};

// Uavhengig utregning (ikke importert fra malen): gram fra 10 g som hele gram (halve opp), under 10 g to gjeldende sifre; andre enheter 100 og over som heltall,
// 10 til 100 tre gjeldende sifre, under 10 to, uten «,0» til slutt. Desimalkomma.
const sig = (n, sifre) => {
  const d = Math.min(100, Math.max(0, sifre - 1 - Math.floor(Math.log10(Math.abs(n)))));
  const t = (Math.round(Number((n * 10 ** d).toPrecision(12))) / 10 ** d).toFixed(d);
  return (t.includes('.') ? t.replace(/0+$/u, '').replace(/\.$/u, '') : t).replace('.', ',');
};
const gramT = (n) => (n >= 10 ? String(Math.round(Number(n.toPrecision(12)))) : sig(n, 2));
const andreT = (n) => (n >= 100 ? String(Math.round(n)) : sig(n, n >= 10 ? 3 : 2));
const tall = (t) => String(t).match(/\d+(?:[.,]\d+)?/gu) ?? [];
const ren = (html) => htmlTilTekst(html, { attributter: false }).replace(/\s+/gu, ' ').trim();
const blokk = (html, start) => html.match(new RegExp(`${start}[\\s\\S]*?</(?:table|ul|p)>`, 'u'))?.[0] ?? '';

/** Leser tabellene og tekstene ut av en generert side og sammenligner hvert tall på sin plass mot det som regnes ut fra datafila. */
function sjekkSide(S, r, rad, s) {
  const dl = r.tall.dl.verdi;
  const v = tall(S.tekst[r.id].variant);
  const feil = [];
  const lik = (navn, faktisk, forventet) => { if (JSON.stringify(faktisk) !== JSON.stringify(forventet)) feil.push(`${navn}: ${JSON.stringify(faktisk)} mot ${JSON.stringify(forventet)}`); };
  const ss = gramT(dl * 15 / 100);
  const ts = gramT(dl * 5 / 100);
  const skjeRader = S.skjeer.map(([e, ml]) => [e, gramT(dl * ml / 100)]);
  const mengder = [...skjeRader, ['0,5 dl', gramT(dl / 2)], ['1 dl', String(dl)], ['2 dl', String(2 * dl)], ['3 dl', String(3 * dl)], ['4 dl', String(4 * dl)], ['5 dl', String(5 * dl)], ['1 liter', String(10 * dl)]];
  lik('tabell fra dl til gram', [...blokk(s.rik, '<table class="otabell">').matchAll(/<tr><td>([^<]*)<\/td><td>([^<]*)<\/td><\/tr>/gu)].map((m) => [m[1], m[2]]), mengder.map(([e, g]) => [e, `${g} g`]));
  lik('eksempler gram til dl', [...blokk(s.rik, '<ul class="eksempler">').matchAll(/<li><b>([^<]*)<\/b><span>([^<]*)<\/span><\/li>/gu)].map((m) => [m[1], m[2]]),
    [[100, '100 g'], [250, '250 g'], [500, '500 g'], [1000, '1 kg']].map(([g, e]) => [e, `${andreT(g / dl)} dl`]));
  lik('formelen', s.rik.match(/<b>(\d+)<\/b><\/p>/u)?.[1], String(dl));
  lik('avsnittet om gram til dl', tall(ren(s.rik.match(new RegExp(`<h2>${S.fra}</h2><p>([\\s\\S]*?)</p>`, 'u'))?.[1])), [String(dl), String(dl)]);
  lik('første kort', tall(ren(s.rik.match(/<div class="oto"><div class="okort"><h2>[^<]*<\/h2><p>([\s\S]*?)<\/p>/u)?.[1])), ['1', ...v, String(dl)]);
  lik('ingress', tall(s.lead), ['1', ...v, String(dl)]);
  lik('metabeskrivelse', tall(s.description), ['1', ...v, String(dl)]);
  lik('kort svar', tall(ren(s.topp.match(/<p class="kortsvar">([\s\S]*?)<\/p>/u)?.[1])), ['1', ...v, String(dl), '15', ss, '5', ts]);
  lik('kalkulatorens eksempel', [s.topp.match(/<output[^>]*>([^<]*)<\/output>/u)?.[1], ren(s.topp.match(/class="kalksetning"[^>]*>([\s\S]*?)<\/p>/u)?.[1])], [String(2 * dl), `2 dl ${r.navn.toLowerCase()} = ${2 * dl} g`]);
  const svar = s.faq.map(([, a]) => ren(a));
  lik('FAQ 1', tall(svar[0]), ['1', ...v, String(dl), '2026', ...tall(r.tekst.matvaretabell)]);
  lik('FAQ 2', tall(svar[1]), dl === 100 ? ['100', andreT(100 / dl)] : ['100', andreT(100 / dl), '100', String(dl)]);
  lik('FAQ 3', tall(svar[2]), ['15', ss, '5', ts]);
  const naer = S.tekst[S.tekst[r.id].naer?.[0]] && rad(S.tekst[r.id].naer[0]);
  const usda = ['dl_usda', 'dl_usda_pakket', 'dl_usda_siktet'].filter((k) => r.tall[k]).map((k) => ({ g: /^(\d+(?:[.,]\d+)?) g per/u.exec(r.tall[k].merknad)[1], verdi: r.tall[k].verdi }));
  for (const u of usda) lik(`USDA-tallet ${u.g} g per cup`, String(Math.round(Number(u.g) / 2.365882)), String(u.verdi));
  if (naer) {
    const dlN = naer.tall.dl.verdi;
    const vN = tall(S.tekst[naer.id].variant);
    lik('FAQ 4, nær vare', tall(svar[3]), dlN === dl ? ['1', ...vN, String(dlN), ...v] : ['1', ...vN, String(dlN), String(dl), ...v]);
    assert.match(svar[3], dlN === dl ? /^Ja\./u : S.tillSetning, `FAQ 4 sier ja eller nei: ${svar[3]}`);
  } else if (!usda.length) {
    lik('FAQ 4, liter og kilo', tall(svar[3]), ['1', '10', gramT(10 * dl), '1', andreT(1000 / dl)]);
  } else {
    for (const u of usda) assert.ok(svar[3].includes(`${u.g} g ${S.per} `) && svar[3].includes(`${Math.round(Number(u.g) / 2.365882)} g ${S.per} dl`), `FAQ 4, USDA: ${svar[3]}`);
    assert.ok(svar[3].endsWith(` ${dl} g.`), svar[3]);
  }
  if (usda.length) {
    const sprik = blokk(s.rik, '<table class="sprik"><thead><tr><th scope="col">(?:Källa|Kilde)');
    lik('kildetabellen', [...sprik.matchAll(/<\/small><\/td><td>([^<]*)<\/td>/gu)].map((m) => m[1]), [`${dl} g`, ...usda.map((u) => `${Math.round(Number(u.g) / 2.365882)} g`)]);
    const intro = ren(s.rik.match(/<h2>(?:Källorna sida vid sida|Kilderne side om side)<\/h2>\s*<p>([\s\S]*?)<\/p>/u)?.[1]);
    lik('innledningen til kildetabellen', tall(intro), usda.every((u) => u.verdi === dl) ? [String(dl), '1'] : [String(dl), '1', ...usda.map((u) => String(Math.round(Number(u.g) / 2.365882)))]);
  }
  const andre = JSON.parse(r.tekst.andrePoster ?? '[]');
  if (andre.length) lik('andre poster', [...blokk(s.rik, '<table class="sprik"><thead><tr><th scope="col">Post').matchAll(new RegExp(`<td>${S.q[0]}[^${S.q[1]}]*${S.q[1]}</td><td>([^<]*)</td>`, 'gu'))].map((m) => m[1]), andre.map(([, x]) => `${x} g`));
  return feil;
}

for (const [mk, S] of Object.entries(SPRAK)) {
  const data = lesData(MAPPE, mk);
  const rader = publiserbare(data);
  const rad = (id) => rader.find((r) => r.id === id);
  const alleSider = () => [['nav', S.mal.navSide(data, rader)], ...rader.map((r) => [r.id, S.mal.sideForRad(r, data, rader)])];
  const sideAv = (id) => S.mal.sideForRad(rad(id), data, rader);

  test(`${mk}: datafila har samme varer, tall, kilder og postnavn som den norske, unntatt de rent norske varene`, () => {
    assert.equal(data.marked, mk);
    assert.deepEqual(rader.map((r) => r.id), publiserbare(nb).map((r) => r.id).filter((id) => !BARE_NORSK.includes(id)));
    for (const id of BARE_NORSK) assert.equal(data.rader.some((r) => r.id === id), false, `${id} har ingen rad på ${mk}`);
    for (const r of rader) {
      const n = publiserbare(nb).find((x) => x.id === r.id);
      assert.deepEqual(r.tall, n.tall, `${r.id}: tallene er de norske`);
      assert.deepEqual(r.tekst, n.tekst, `${r.id}: postnavn, FDC-id og andre poster er ordrett fra kilden`);
      assert.deepEqual([r.status, r.kontrollert, r.oppdatert], [n.status, n.kontrollert, n.oppdatert], r.id);
    }
    assert.deepEqual(data.kilder, nb.kilder);
  });

  test(`${mk}: sidene ligger under ${S.rot}, ett navn og én adresse per vare, og hver vare har en variantbetegnelse`, async () => {
    const sider = await familieSider(mk, [FAMILIER.find((x) => x.id === 'dl-til-gram')]);
    assert.deepEqual(Object.keys(sider).sort(), [S.rot, ...rader.map((r) => `${S.rot}${r.slug}/`)].sort());
    assert.equal(rader.length, 28);
    assert.equal(new Set(rader.map((r) => r.slug)).size, rader.length);
    assert.equal(new Set(rader.map((r) => r.navn)).size, rader.length);
    for (const r of rader) assert.ok(S.tekst[r.id]?.variant, r.id);
    assert.deepEqual(Object.keys(S.tekst).filter((id) => !rad(id)), []);
    // flytende og nære varer følger den norske, uten de rent norske varene
    for (const id of Object.keys(TEKST_NB).filter((x) => !BARE_NORSK.includes(x))) {
      assert.equal(S.tekst[id].flytende, TEKST_NB[id].flytende, `${id} flytende`);
      assert.deepEqual(S.tekst[id].naer ?? [], (TEKST_NB[id].naer ?? []).filter((x) => !BARE_NORSK.includes(x)), `${id} nære varer`);
    }
    for (const r of rader) assert.ok(existsSync(`${ROT}${SPRAKMAPPE[mk]}${S.rot}${r.slug}/index.html`), `${r.slug}: filen er bygget`);
  });

  test(`${mk}: samleside og to varesider følger søkeordene i tittel og H1`, () => {
    const nav = S.mal.navSide(data, rader);
    assert.equal(nav.h1, S.h1Nav);
    assert.ok(nav.title.startsWith(`${S.h1Nav}:`), nav.title);
    assert.ok(nav.title.includes(String(rader.length)), nav.title);
    const hvete = sideAv('hvetemel');
    assert.ok(hvete.title.startsWith(S.titlePre(rad('hvetemel').navn.toLowerCase())), hvete.title);
    assert.equal(hvete.h1, `${rad('hvetemel').navn}: dl ${mk === 'sv' ? 'till' : 'til'} gram`);
    assert.match(hvete.lead, new RegExp(`^1 dl ${S.tekst.hvetemel.variant} ${S.veier} 55 g\\.`, 'u'));
    assert.match(hvete.topp, /2 dl [^ ]+ = 110 g/u);
    assert.match(hvete.rik, /<td>1 dl<\/td><td>55 g<\/td>/u);
  });

  test(`${mk}: hvert tall på hver side regnes ut på nytt fra datafila og stemmer på sin plass`, () => {
    for (const r of rader) assert.deepEqual(sjekkSide(S, r, rad, sideAv(r.id)), [], r.id);
  });

  test(`${mk}: bevis, en tabellverdi eller et tall i teksten endret gir rødt i den posisjonelle kontrollen`, () => {
    const r = rad('hvetemel');
    const s = sideAv('hvetemel');
    assert.ok(s.rik.includes('<td>1 dl</td><td>55 g</td>'));
    for (const feilVerdi of [1, 27, 90]) {
      const feil = sjekkSide(S, r, rad, { ...s, rik: s.rik.replace('<td>1 dl</td><td>55 g</td>', `<td>1 dl</td><td>${feilVerdi} g</td>`) });
      assert.ok(feil.length > 0 && feil[0].startsWith('tabell fra dl til gram'), `${feilVerdi}: ${feil}`);
    }
    assert.ok(sjekkSide(S, r, rad, { ...s, lead: s.lead.replace('55', '27') }).length > 0);
    assert.ok(sjekkSide(S, r, rad, { ...s, description: s.description.replace('55', '90') }).length > 0);
    assert.ok(sjekkSide(S, r, rad, { ...s, topp: s.topp.replace('8,3 g', '9 g') }).length > 0);
    assert.ok(sjekkSide(S, r, rad, { ...s, faq: s.faq.map(([q, a]) => [q, a.replace('1,8', '1,9')]) }).length > 0);
    assert.ok(sjekkSide(S, r, rad, { ...s, rik: s.rik.replace('<td>53 g</td>', '<td>54 g</td>') }).length > 0);
  });

  test(`${mk}: tallvakten er stram, og alle sider holder seg til tillatte tall`, () => {
    const r = rad('hvetemel');
    const s = sideAv('hvetemel');
    const tillatt = S.mal.tillatteTall(r, data);
    for (const feilVerdi of ['27', '90', '14', '3,5']) assert.equal(tillatt.has(feilVerdi), false, feilVerdi);
    for (const ok of ['55', '110', '28', '8,3', '2,8', '1,8', '18,2', '53', '2026', '168936']) assert.equal(tillatt.has(ok), true, ok);
    assert.deepEqual(tallUtenforData({ ...s, rik: s.rik.replace('<td>1 dl</td><td>55 g</td>', '<td>1 dl</td><td>27 g</td>') }, tillatt), ['27']);
    for (const x of rader) assert.deepEqual(tallUtenforData(sideAv(x.id), S.mal.tillatteTall(x, data)), [], x.id);
    assert.deepEqual(tallUtenforData(S.mal.navSide(data, rader), S.mal.tillatteTallNav(data)), []);
  });

  test(`${mk}: skjeene regnes fra dl-tallet, og væsker sies uten «struken» eller «afstrøget»`, () => {
    const u = S.mal.utregnet({ tall: { dl: { verdi: 55 } } });
    assert.deepEqual(u.tabell.map(([e]) => e), S.tabellEtiketter);
    assert.deepEqual(u.tabell.map(([, g]) => g), [...S.skjeer.map(([, ml]) => Number(gramT(55 * ml / 100).replace(',', '.'))), 28, 55, 110, 165, 220, 275, 550]);
    assert.equal(S.mal.utregnet({ tall: { dl: { verdi: 100 } } }).tabell[0][1], mk === 'sv' ? 1 : 5, 'første skje: 1 krm er 1 g på svensk, 1 tsk er 5 g på dansk');
    assert.deepEqual(u.tilbake, [[100, '1,8'], [250, '4,5'], [500, '9,1'], [1000, '18,2']]);
    const flytende = Object.keys(S.tekst).filter((id) => S.tekst[id].flytende).sort();
    assert.deepEqual(flytende, ['flote', 'melk', 'olje', 'sirup']);
    const stram = mk === 'sv' ? /struken/u : /afstrøget/u;
    assert.match(JSON.stringify(sideAv('hvetemel')), stram);
    for (const id of flytende) assert.equal(stram.test(JSON.stringify(sideAv(id))), false, id);
    assert.match(sideAv('melk').topp, mk === 'sv' ? /En matsked \(15 ml\) är 15 g och en tesked \(5 ml\) är 5 g, uträknat från dl-talet\./u : /En spiseskefuld \(15 ml\) er 15 g, og en teskefuld \(5 ml\) er 5 g, regnet ud fra dl-tallet\./u);
  });

  test(`${mk}: «uträknat/regnet ud» står bare i kort svar og svaret om skjeen (samlesiden: i kildelinja)`, () => {
    const ord = mk === 'sv' ? /uträkna(?:t|de) från dl-talet/gu : /regnet ud fra dl-tallet/gu;
    const tell = (s) => (JSON.stringify(s).match(ord) ?? []).length;
    for (const r of rader) assert.equal(tell(sideAv(r.id)), 2, r.id);
    assert.equal(tell(S.mal.navSide(data, rader)), 1);
  });

  test(`${mk}: kryddmått står bare på svensk, og kalkulatoren kjenner alle enhetene i tabellen`, () => {
    const html = S.mal.kalkHtml({ rader, fast: rad('salt') });
    const json = JSON.parse(html.match(/class="kalk-data">([\s\S]*?)<\/script>/u)[1]);
    assert.deepEqual(json.varer, [['salt', 130]]);
    assert.equal(json.feil, mk === 'sv' ? 'Skriv in en mängd, till exempel 2 eller 2,5.' : 'Skriv en mængde, for eksempel 2 eller 2,5.');
    assert.equal('krm' in json.ml, mk === 'sv');
    for (const [e, ml] of S.skjeer) {
      assert.equal(json.ml[e.replace('1 ', '')], ml, e);
      assert.ok(html.includes(`<option value="${e.replace('1 ', '')}">`), e);
    }
    const valg = S.mal.kalkHtml({ rader });
    assert.equal(JSON.parse(valg.match(/class="kalk-data">([\s\S]*?)<\/script>/u)[1]).varer.length, rader.length);
    assert.match(valg, /<select data-felt="vare">/u);
    assert.match(html, new RegExp(`<a href="/${mk}/${S.rot}">`, 'u'));
  });

  test(`${mk}: alle sider, ren tekst uten tankestrek, norske ord, mal-rester eller like titler`, () => {
    const titler = new Set();
    for (const [navn, s] of alleSider()) {
      assert.ok(`${s.title} | Matlyst`.length <= 60, `${navn}: tittel ${s.title.length + 10} tegn`);
      assert.ok(s.description.length >= 100 && s.description.length <= 160, `${navn}: beskrivelse ${s.description.length} tegn`);
      const tekst = synligTekst(s);
      assert.equal(/[—–]/u.test(tekst), false, `${navn}: tankestrek`);
      assert.equal(/undefined|NaN|\[object|\bnull\b/u.test(tekst), false, `${navn}: ugyldig tekst`);
      // Postnavnene står ordrett på norsk (som i kilden) og er ikke en del av språket: de tas ut før restordene letes etter.
      const utenPoster = tekst.replace(new RegExp(`${S.q[0]}[^${S.q[1]}]*${S.q[1]}`, 'gu'), ' ').replace(/Matvaretabellen|Mattilsynet/gu, ' ');
      assert.equal(NORSKE_RESTORD.test(utenPoster), false, `${navn}: norsk restord`);
      assert.equal(S.forbudt.test(utenPoster), false, `${navn}: ${utenPoster.match(S.forbudt)?.[0]}`);
      assert.equal(titler.has(s.title), false, `${navn}: lik tittel`);
      titler.add(s.title);
      assert.ok((s.faq.length >= 3 && s.faq.length <= 4) || navn === 'nav', `${navn}: ${s.faq.length} spørsmål`);
      assert.ok(s.faq.every(([q]) => q.endsWith('?')), `${navn}: spørsmål uten spørsmålstegn`);
      assert.ok(s.steg.length > 0 && s.schemas.includes('faq'), `${navn}: steg og FAQ`);
    }
  });

  test(`${mk}: strukturerte data har kilder og ingen valutakode, og kildelista har dato på språket`, () => {
    const s = sideAv('hvetemel');
    const typer = s.schemas.map((x) => x['@type'] ?? x);
    assert.deepEqual(typer, ['WebApplication', 'Article', 'faq']);
    assert.equal(JSON.stringify(s.schemas).includes('priceCurrency'), false);
    assert.equal(s.schemas[1].inLanguage, mk);
    assert.deepEqual(s.schemas[1].citation.map((c) => c.name), ['Matvaretabellen 2026', 'FoodData Central, SR Legacy']);
    assert.deepEqual(S.mal.navSide(data, rader).schemas.map((x) => x['@type'] ?? x), ['WebApplication', 'Article', 'ItemList', 'faq']);
    assert.match(s.rik, new RegExp(S.hentet, 'u'));
    assert.match(s.rik, /<ol class="kilder" id="kilder">/u);
  });

  test(`${mk}: USDA-målene står på språket, og to USDA-rader gir to rader i kildetabellen`, () => {
    for (const [navn, s] of alleSider()) {
      const utenNavn = JSON.stringify({ ...s, schemas: undefined }).replace(new RegExp(`${S.q[0]}[^${S.q[1]}]*${S.q[1]}`, 'gu'), '');
      assert.equal(/\b(unpacked|packed|unsifted|sifted|whole|fluid|yields)\b/u.test(utenNavn), false, navn);
    }
    const brunt = sideAv('brunt-sukker').rik;
    assert.equal((brunt.match(/class="sprik"[\s\S]*?<\/table>/u)[0].match(/<tr/gu) ?? []).length, 1 + 1 + 2);
    assert.equal(sideAv('olje').rik.includes('class="sprik"'), true);
    const uten = rader.find((r) => !r.tall.dl_usda);
    assert.equal(/USDA|undefined/u.test(sideAv(uten.id).rik.replace(/FoodData Central, SR Legacy[^<]*/u, '')), false);
  });

  test(`${mk}: appkortet bruker språkets eget bilde, og bildefila finnes`, () => {
    const s = sideAv('hvetemel');
    const bilde = s.rik.match(/<img class="tel" src="([^"]+)"/u)[1];
    assert.ok(bilde.startsWith(`/images/en-guide/${mk}/`), bilde);
    assert.ok(existsSync(`${ROT}${bilde.slice(1)}`), bilde);
    assert.ok(existsSync(`${ROT}${bilde.slice(1).replace('-400', '-800')}`));
    assert.ok(s.rik.includes(`href="/${mk}/${mk === 'sv' ? 'receptbok-app' : 'opskrifts-app'}/"`));
    assert.ok(existsSync(`${ROT}${mk}/${mk === 'sv' ? 'receptbok-app' : 'opskrifts-app'}/index.html`));
  });

  test(`${mk}: andre varer har åtte lenker pluss samlesiden, aldri varen selv, og nær variant først`, () => {
    const b = sideAv('hvetemel').rik.match(/<div class="related">[\s\S]*?<\/div>/u)[0];
    const lenker = [...b.matchAll(/href="([^"]+)"/gu)].map((m) => m[1]);
    assert.equal(lenker.length, 9);
    assert.equal(lenker.includes(`/${mk}/${S.rot}${rad('hvetemel').slug}/`), false);
    assert.equal(lenker.at(-1), `/${mk}/${S.rot}`);
    assert.equal(lenker[0], `/${mk}/${S.rot}${rad('sammalt-hvetemel').slug}/`);
    // samlesidens beslektede omregninger finnes
    const nav = S.mal.navSide(data, rader).rik;
    for (const [, href] of nav.matchAll(/<li><a href="(\/[^"]+\/)">/gu)) if (!href.includes(S.rot)) assert.ok(existsSync(`${ROT}${href.slice(1)}index.html`), href);
  });

  test(`${mk}: hreflang og språkvelger går mellom nb, sv, da (og en der den finnes), begge veier`, () => {
    const grupper = familieGrupper();
    for (const r of rader) {
      const g = grupper.find((x) => x.id === `auto-fam-dl-til-gram-${r.id}`);
      assert.ok(g, r.id);
      for (const m of ['nb', 'sv', 'da']) assert.ok(g.sider[m], `${r.id}: ${m}`);
      assert.equal(g.sider[mk], `/${mk}/${S.rot}${r.slug}/`);
      const html = readFileSync(`${ROT}${mk}/${S.rot}${r.slug}/index.html`, 'utf8');
      for (const [m, sti] of Object.entries(g.sider)) {
        assert.ok(html.includes(`href="${sti}" lang="${m}" hreflang="${m}"`), `${mk}/${r.id}: språkvelger til ${m}`);
        assert.ok(html.includes(`hreflang="${{ nb: 'nb-NO', sv: 'sv-SE', da: 'da-DK', en: 'en' }[m]}" href="https://matlyst-app.no${sti}"`), `${mk}/${r.id}: hreflang ${m}`);
        const motpart = readFileSync(`${ROT}${sti.slice(1)}index.html`, 'utf8');
        assert.ok(motpart.includes(`hreflang="${{ nb: 'nb-NO', sv: 'sv-SE', da: 'da-DK', en: 'en' }[mk]}" href="https://matlyst-app.no/${mk}/${S.rot}${r.slug}/"`), `${m}/${r.id}: peker tilbake til ${mk}`);
      }
    }
    // Rent norske varer har ingen side på språket, og den norske siden peker ikke hit.
    for (const id of BARE_NORSK) {
      const g = grupper.find((x) => x.id === `auto-fam-dl-til-gram-${id}`);
      assert.ok(g?.sider.nb, `${id}: den norske siden finnes`);
      assert.equal(g.sider[mk], undefined, `${id}: ingen ${mk}-side`);
      const norsk = readFileSync(`${ROT}${g.sider.nb.slice(1)}index.html`, 'utf8');
      assert.equal(norsk.includes(`/${mk}/${S.rot}`), false, `${id}: den norske siden lenker ikke til ${mk}`);
    }
    const nav = grupper.find((x) => x.id === 'auto-fam-dl-til-gram-nav');
    assert.equal(nav.sider[mk], `/${mk}/${S.rot}`);
    assert.ok(nav.sider.nb && nav.sider.en && nav.sider.sv && nav.sider.da);
  });

  test(`${mk}: sidene står i sitemap-${mk}.xml, i llms.txt og i menyen`, () => {
    const kart = readFileSync(`${ROT}sitemap-${mk}.xml`, 'utf8');
    const adresser = [S.rot, ...rader.map((r) => `${S.rot}${r.slug}/`)];
    for (const a of adresser) assert.ok(kart.includes(`<loc>https://matlyst-app.no/${mk}/${a}</loc>`), a);
    assert.ok(readFileSync(`${ROT}llms.txt`, 'utf8').includes(`https://matlyst-app.no/${mk}/${S.rot}`));
    assert.ok(readFileSync(`${ROT}${mk}/index.html`, 'utf8').includes(`href="/${mk}/${S.rot}"`), 'menyen på forsiden lenker til samlesiden');
  });
}

test('registeret har dl-til-gram på nb, sv, da og en, med riktige røtter', () => {
  const f = FAMILIER.find((x) => x.id === 'dl-til-gram');
  assert.deepEqual(Object.entries(f.markeder).map(([m, { rot }]) => `${m}:${rot}`).sort(), ['da:vaerktoejer/dl-til-gram/', 'en:tools/cups-to-grams/', 'nb:verktoy/dl-til-gram/', 'sv:verktyg/dl-till-gram/']);
});

test('sv og da bruker språkets egne ord for skjeene, ikke norsk «ss» og «ts»', () => {
  for (const [mk, S] of Object.entries(SPRAK)) {
    const data = lesData(MAPPE, mk);
    const rader = publiserbare(data);
    const rik = rader.map((r) => S.mal.sideForRad(r, data, rader).rik).join(' ');
    assert.equal(/<td>1 (?:ss|ts)<\/td>/u.test(rik), false, mk);
    assert.ok(rik.includes(mk === 'sv' ? '<td>1 msk</td>' : '<td>1 spsk</td>'));
  }
});
