// Malen for «dl til gram»: sidene skrives fra datafila, og hvert tall på siden regnes ut på nytt fra datafila og sammenlignes på sin plass.
import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { VIS_TOPPET, kalkHtml, navSide, sideForRad, tillatteTall, tillatteTallNav, utregnet } from '../scripts/familier/dl-til-gram/mal-nb.mjs';
import { BYTT, PIL, esc, gramTekst, kalkSkjelett, mengdeTekst, sigTekst, tallI } from '../scripts/familier/dl-til-gram/felles-mal.mjs';
import { TEKST } from '../scripts/familier/dl-til-gram/tekst-nb.mjs';
import { htmlTilTekst, synligTekst, tallUtenforData } from './hjelp/familievakt.mjs';

const MAPPE = fileURLToPath(new URL('../scripts/familier/dl-til-gram/', import.meta.url));
const data = lesData(MAPPE, 'nb');
const rader = publiserbare(data);
const rad = (id) => rader.find((r) => r.id === id);
const alleSider = () => [['nav', navSide(data, rader)], ...rader.map((r) => [r.id, sideForRad(r, data, rader)])];

// Uavhengig utregning i testen (ikke importert fra malen). Regelen: gram fra 1 g som hele gram (halve opp), under 1 g to gjeldende sifre;
// andre enheter: 100 og over som heltall, 10 til 100 tre gjeldende sifre, under 10 to, uten «,0» til slutt.
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

/** Leser tabellene og tekstene ut av en genererte side og sammenligner hvert tall på sin plass mot det som regnes ut fra datafila. */
function sjekkSide(r, s) {
  const dl = r.tall.dl.verdi;
  const t = TEKST[r.id];
  const v = tall(t.variant);
  const feil = [];
  const lik = (navn, faktisk, forventet) => { if (JSON.stringify(faktisk) !== JSON.stringify(forventet)) feil.push(`${navn}: ${JSON.stringify(faktisk)} mot ${JSON.stringify(forventet)}`); };
  const ss = gramT(dl * 15 / 100);
  const ts = gramT(dl * 5 / 100);
  const mengder = [['1 ts', ts], ['1 ss', ss], ['0,5 dl', gramT(dl / 2)], ['1 dl', String(dl)], ['2 dl', String(2 * dl)], ['3 dl', String(3 * dl)], ['4 dl', String(4 * dl)], ['5 dl', String(5 * dl)], ['1 liter', String(10 * dl)]];
  lik('tabell fra dl til gram', [...blokk(s.rik, '<table class="otabell">').matchAll(/<tr><td>([^<]*)<\/td><td>([^<]*)<\/td><\/tr>/gu)].map((m) => [m[1], m[2]]), mengder.map(([e, g]) => [e, `${g} g`]));
  const eks = [[100, '100 g'], [250, '250 g'], [500, '500 g'], [1000, '1 kg']];
  lik('eksempler gram til dl', [...blokk(s.rik, '<ul class="eksempler">').matchAll(/<li><b>([^<]*)<\/b><span>([^<]*)<\/span><\/li>/gu)].map((m) => [m[1], m[2]]), eks.map(([g, e]) => [e, `${andreT(g / dl)} dl`]));
  lik('formelen', s.rik.match(/<b>(\d+)<\/b><\/p>/u)?.[1], String(dl));
  lik('avsnittet om gram til dl', tall(ren(s.rik.match(/<h2>Fra gram til dl<\/h2><p>([\s\S]*?)<\/p>/u)?.[1])), [String(dl), String(dl)]);
  lik('første kort', tall(ren(s.rik.match(/fra dl til gram<\/h2><p>([\s\S]*?)<\/p>/u)?.[1])), ['1', ...v, String(dl)]);
  lik('ingress', tall(s.lead), ['1', ...v, String(dl)]);
  lik('metabeskrivelse', tall(s.description), ['1', ...v, String(dl)]);
  lik('kort svar', tall(ren(s.topp.match(/<p class="kortsvar">([\s\S]*?)<\/p>/u)?.[1])), ['1', ...v, String(dl), '15', ss, '5', ts]);
  lik('kalkulatorens eksempel', [s.topp.match(/<output[^>]*>([^<]*)<\/output>/u)?.[1], ren(s.topp.match(/class="kalksetning"[^>]*>([\s\S]*?)<\/p>/u)?.[1])], [String(2 * dl), `2 dl ${r.navn.toLowerCase()} = ${2 * dl} g`]);
  const svar = s.faq.map(([, a]) => ren(a));
  lik('FAQ 1', tall(svar[0]), ['1', ...v, String(dl), '2026', ...tall(r.tekst.matvaretabell)]);
  lik('FAQ 2', tall(svar[1]), dl === 100 ? ['100', andreT(100 / dl)] : ['100', andreT(100 / dl), '100', String(dl)]);
  lik('FAQ 3', tall(svar[2]), ['15', ss, '5', ts]);
  const naer = TEKST[t.naer?.[0]] && rad(t.naer[0]);
  const usda = ['dl_usda', 'dl_usda_pakket', 'dl_usda_siktet'].filter((k) => r.tall[k]).map((k) => ({ g: /^(\d+(?:[.,]\d+)?) g per/u.exec(r.tall[k].merknad)[1], verdi: r.tall[k].verdi }));
  for (const u of usda) lik(`USDA-tallet ${u.g} g per cup`, String(Math.round(Number(u.g) / 2.365882)), String(u.verdi));
  if (naer) {
    const dlN = naer.tall.dl.verdi;
    const vN = tall(TEKST[naer.id].variant);
    lik('FAQ 4, nær vare', tall(svar[3]), dlN === dl ? ['1', ...vN, String(dlN), ...v] : ['1', ...vN, String(dlN), String(dl), ...v]);
  } else if (!usda.length) {
    lik('FAQ 4, liter og kilo', tall(svar[3]), ['1', '10', gramT(10 * dl), '1', andreT(1000 / dl)]);
  } else {
    for (const u of usda) assert.ok(svar[3].includes(`${u.g} g per `) && svar[3].includes(`som tilsvarer ${Math.round(Number(u.g) / 2.365882)} g per dl`), `FAQ 4, USDA: ${svar[3]}`);
    assert.ok(svar[3].endsWith(`Vi bruker Matvaretabellens ${dl} g.`), svar[3]);
  }
  if (usda.length) {
    const sprik = blokk(s.rik, '<table class="sprik"><thead><tr><th scope="col">Kilde');
    lik('kildetabellen', [...sprik.matchAll(/<\/small><\/td><td>([^<]*)<\/td>/gu)].map((m) => m[1]), [`${dl} g`, ...usda.map((u) => `${Math.round(Number(u.g) / 2.365882)} g`)]);
    const intro = ren(s.rik.match(/<h2>Kildene side om side<\/h2>\s*<p>([\s\S]*?)<\/p>/u)?.[1]);
    lik('innledningen til kildetabellen', tall(intro), usda.every((u) => u.verdi === dl) ? [String(dl), '1'] : [String(dl), '1', ...usda.map((u) => String(Math.round(Number(u.g) / 2.365882)))]);
  }
  const andre = JSON.parse(r.tekst.andrePoster ?? '[]');
  if (andre.length) lik('andre poster', [...blokk(s.rik, '<table class="sprik"><thead><tr><th scope="col">Post').matchAll(/<td>«[^»]*»<\/td><td>([^<]*)<\/td>/gu)].map((m) => m[1]), andre.map(([, x]) => `${x} g`));
  return feil;
}

test('hvetemel: svaret står i ingress, kort svar, tabell og kalkulator, og er det samme tallet', () => {
  const s = sideForRad(rad('hvetemel'), data, rader);
  assert.match(s.lead, /1 dl siktet hvetemel veier 55 g/u);
  assert.match(s.topp, /2 dl hvetemel = 110 g/u);
  assert.match(s.topp, /1 dl siktet hvetemel er 55 g/u);
  assert.match(s.rik, /<td>1 dl<\/td><td>55 g<\/td>/u);
  assert.equal(s.title, '1 dl hvetemel i gram: regn om dl, ss og ts');
  assert.equal(s.description, '1 dl siktet hvetemel veier 55 g. Regn om mellom dl, ss, ts og gram, med tabell og tall fra Matvaretabellen og USDA.');
  assert.equal(s.h1, 'Hvetemel: dl til gram');
});

test('utregningene følger tallreglene: hele gram fra 1 g, to gjeldende sifre under, og få desimaler for andre enheter', () => {
  const u = utregnet({ tall: { dl: { verdi: 55 } } });
  assert.deepEqual(u.tilbake, [[100, '1,8'], [250, '4,5'], [500, '9,1'], [1000, '18,2']]);
  assert.equal(u.ss, 8.3);
  assert.equal(u.ts, 2.8);
  assert.equal(utregnet({ tall: { dl: { verdi: 35 } } }).ts, 1.8);
  assert.deepEqual(u.tabell.map(([e]) => e), ['1 ts', '1 ss', '0,5 dl', '1 dl', '2 dl', '3 dl', '4 dl', '5 dl', '1 liter']);
  assert.deepEqual(u.tabell.map(([, g]) => g), [2.8, 8.3, 28, 55, 110, 165, 220, 275, 550]);
  // Salt, 130 g per dl: 100 g er 0,77 dl, ikke 0,8.
  assert.deepEqual(utregnet({ tall: { dl: { verdi: 130 } } }).tilbake, [[100, '0,77'], [250, '1,9'], [500, '3,8'], [1000, '7,7']]);
  // Hele tideler uten «,0»: 100 g per dl gir 1, 2,5, 5 og 10 dl.
  assert.deepEqual(utregnet({ tall: { dl: { verdi: 100 } } }).tilbake, [[100, '1'], [250, '2,5'], [500, '5'], [1000, '10']]);
  // Under 1 g: to gjeldende sifre.
  const lite = utregnet({ tall: { dl: { verdi: 5 } } });
  assert.deepEqual(lite.tabell.slice(0, 3).map(([, g]) => g), [0.25, 0.75, 2.5]);
});

test('hvert tall på hver side regnes ut på nytt fra datafila og stemmer på sin plass', () => {
  for (const r of rader) assert.deepEqual(sjekkSide(r, sideForRad(r, data, rader)), [], r.id);
});

test('bevis: en tabellverdi endret til 1, 27 eller 90 gir rødt i den posisjonelle kontrollen', () => {
  const r = rad('hvetemel');
  const s = sideForRad(r, data, rader);
  assert.ok(s.rik.includes('<td>1 dl</td><td>55 g</td>'));
  for (const feilVerdi of [1, 27, 90]) {
    const feil = sjekkSide(r, { ...s, rik: s.rik.replace('<td>1 dl</td><td>55 g</td>', `<td>1 dl</td><td>${feilVerdi} g</td>`) });
    assert.ok(feil.length > 0 && feil[0].startsWith('tabell fra dl til gram'), `${feilVerdi}: ${feil}`);
  }
  // Det samme for ingress, kort svar, metabeskrivelse, FAQ og kildetabell.
  assert.ok(sjekkSide(r, { ...s, lead: s.lead.replace('55', '27') }).length > 0);
  assert.ok(sjekkSide(r, { ...s, description: s.description.replace('55', '90') }).length > 0);
  assert.ok(sjekkSide(r, { ...s, topp: s.topp.replace('er 8,3 g', 'er 9 g') }).length > 0);
  assert.ok(sjekkSide(r, { ...s, faq: s.faq.map(([q, a]) => [q, a.replace('1,8', '1,9')]) }).length > 0);
  assert.ok(sjekkSide(r, { ...s, rik: s.rik.replace('<td>53 g</td>', '<td>54 g</td>') }).length > 0);
});

test('tallvakten er stram: en tabellverdi på 27 eller 90 er ikke lenger tillatt på hvetemelsiden', () => {
  const r = rad('hvetemel');
  const s = sideForRad(r, data, rader);
  const tillatt = tillatteTall(r, data);
  for (const feilVerdi of ['27', '90', '14', '3,5']) assert.equal(tillatt.has(feilVerdi), false, feilVerdi);
  for (const ok of ['55', '110', '28', '8,3', '2,8', '1,8', '18,2', '53', '2026', '168936']) assert.equal(tillatt.has(ok), true, ok);
  assert.deepEqual(tallUtenforData({ ...s, rik: s.rik.replace('<td>1 dl</td><td>55 g</td>', '<td>1 dl</td><td>27 g</td>') }, tillatt), ['27']);
  assert.deepEqual(tallUtenforData({ ...s, rik: s.rik.replace('<td>1 dl</td><td>55 g</td>', '<td>1 dl</td><td>90 g</td>') }, tillatt), ['90']);
  // Ingen intervaller: ingen heltall 0 til 29 bare fordi de kan være en indeks.
  for (const n of ['6', '7', '9', '11', '12', '13', '16', '17', '19', '21', '22', '23', '24', '26', '27', '28', '29']) {
    // «20» er dagen i hentedatoen, og «28» og «11» står i tabellen; alt annet skal være utestengt.
    if (!['28', '11'].includes(n) && !tall(JSON.stringify(r.tekst)).includes(n)) assert.equal(tillatt.has(n), false, n);
  }
});

test('hvert tall på hver side er tillatt, og samlesiden har sin egen liste', () => {
  for (const r of rader) assert.deepEqual(tallUtenforData(sideForRad(r, data, rader), tillatteTall(r, data)), [], r.id);
  assert.deepEqual(tallUtenforData(navSide(data, rader), tillatteTallNav(data)), []);
});

test('en vare uten sammenligning får ingen tomme avsnitt, og bare rader med USDA-tall får kildesammenligning', () => {
  const uten = rader.find((r) => !r.tall.dl_usda);
  assert.ok(uten, 'datafila har en vare uten USDA-tall');
  const s = sideForRad(uten, data, rader);
  for (const forbudt of ['Kildene side om side', 'USDA', 'toppet', 'undefined', 'NaN', '<h2></h2>', 'null']) assert.equal(s.rik.includes(forbudt), false, forbudt);
  const med = sideForRad(rad('hvetemel'), data, rader);
  assert.match(med.rik, /Kildene side om side/u);
  assert.match(med.rik, /«Wheat flour, white, all-purpose, enriched, unbleached»/u);
});

test('andre poster i Matvaretabellen vises med navn og vekt, og bare når raden har dem', () => {
  const smor = sideForRad(rad('smor'), data, rader).rik;
  assert.match(smor, /<h2>Andre poster i Matvaretabellen<\/h2>/u);
  assert.match(smor, /<td>«Smør, usaltet»<\/td><td>90 g<\/td>/u);
  assert.match(smor, /«Smør, meierismør, ekstra salt, Kviteseidsmør»/u);
  const uten = rader.find((r) => !r.tekst.andrePoster);
  assert.ok(uten, 'datafila har en vare uten andre poster');
  assert.equal(sideForRad(uten, data, rader).rik.includes('Andre poster i Matvaretabellen'), false);
});

test('brunt sukker og melis viser begge USDA-tallene som egne rader, med målet på norsk', () => {
  const brunt = sideForRad(rad('brunt-sukker'), data, rader).rik;
  assert.match(brunt, /145 g per løst fylt cup/u);
  assert.match(brunt, /220 g per pakket cup/u);
  assert.equal((brunt.match(/class="sprik"[\s\S]*?<\/table>/u)[0].match(/<tr/gu) ?? []).length, 1 + 1 + 2, 'topprad, Matvaretabellen og to USDA-rader');
  const melis = sideForRad(rad('melis'), data, rader).rik;
  assert.match(melis, /120 g per cup, usiktet/u);
  assert.match(melis, /100 g per cup, siktet/u);
  assert.match(sideForRad(rad('flote'), data, rader).rik, /238 g per cup flytende fløte \(gir 2 cups pisket\)/u);
  assert.match(sideForRad(rad('mandler'), data, rader).rik, /143 g per cup, hele mandler/u);
});

test('ingen engelske USDA-mål i norske setninger, og den lange parentesen i rosinposten står bare i kildetabellen', () => {
  for (const [navn, s] of alleSider()) {
    const utenNavn = JSON.stringify({ ...s, schemas: undefined }).replace(/«[^»]*»/gu, '');
    assert.equal(/\b(unpacked|packed|unsifted|sifted|whole|fluid|yields|Includes)\b/u.test(utenNavn), false, navn);
  }
  const rosiner = sideForRad(rad('rosiner'), data, rader);
  assert.ok(rosiner.rik.includes("Includes foods for USDA's Food Distribution Program"));
  assert.equal(rosiner.faq.some(([, a]) => a.includes('Includes')), false);
  assert.ok(rosiner.rik.includes('145 g per cup (ikke pakket)'));
});

test('innledningen til kildetabellen sier tallene, og «oppgir ikke samme» er borte', () => {
  const p = (id) => ren(sideForRad(rad(id), data, rader).rik.match(/<h2>Kildene side om side<\/h2>\s*<p>([\s\S]*?)<\/p>/u)[1]);
  assert.equal(p('olje'), 'Matvaretabellen oppgir 90 g for 1 dl olje, USDA 92 g. Vi bruker tallet fra Matvaretabellen.');
  assert.equal(p('mandler'), 'Matvaretabellen og USDA oppgir begge 60 g for 1 dl mandler.');
  assert.equal(p('brunt-sukker'), 'Matvaretabellen oppgir 70 g for 1 dl brunt sukker, USDA 61 g og 93 g. Vi bruker tallet fra Matvaretabellen.');
  for (const [, s] of alleSider()) assert.equal(s.rik.includes('oppgir ikke samme'), false);
});

test('toppede skjeer står ikke på sidene, og rapporten er ikke blant kildene', () => {
  assert.equal(VIS_TOPPET, false);
  for (const [navn, s] of alleSider()) {
    assert.equal(/toppet|Mål, vekt og porsjonsstørrelser|IS-2286/iu.test(JSON.stringify(s)), false, navn);
  }
  assert.ok(rad('hvetemel').tall.ss_toppet);
});

test('spiseskje og teskje er merket som utregnet; væsker (melk, fløte, olje, sirup) sies uten «strøken»', () => {
  const s = sideForRad(rad('hvetemel'), data, rader);
  assert.match(s.topp, /strøken spiseskje \(15 ml\) er 8,3 g, og en strøken teskje \(5 ml\) er 2,8 g, regnet ut fra dl-tallet/u);
  const ss = s.faq.find(([q]) => /1 ss/u.test(q));
  assert.match(ss[1], /strøken/u);
  assert.match(ss[1], /regnet ut/u);
  assert.deepEqual(Object.keys(TEKST).filter((id) => TEKST[id].flytende).sort(), ['flote', 'melk', 'olje', 'sirup']);
  const melk = sideForRad(rad('melk'), data, rader);
  assert.match(melk.topp, /En spiseskje \(15 ml\) er 15 g, og en teskje \(5 ml\) er 5 g, regnet ut fra dl-tallet\./u);
  assert.equal(/strøken/u.test(JSON.stringify(melk)), false);
  assert.match(melk.faq.find(([q]) => /1 ss/u.test(q))[1], /^En spiseskje \(15 ml\) veier 15 g, regnet ut fra dl-tallet\. En teskje \(5 ml\) veier 5 g\.$/u);
  for (const id of ['flote', 'olje', 'sirup']) assert.equal(/strøken/u.test(JSON.stringify(sideForRad(rad(id), data, rader))), false, id);
});

test('«regnet ut fra dl-tallet» står bare i kort svar og i svaret om spiseskje (samlesiden: i kildelinja)', () => {
  const tell = (s) => (JSON.stringify(s).match(/regnet ut fra dl-tallet/gu) ?? []).length;
  for (const r of rader) assert.equal(tell(sideForRad(r, data, rader)), 2, r.id);
  assert.equal(tell(navSide(data, rader)), 1);
  assert.equal(sideForRad(rad('hvetemel'), data, rader).rik.includes('regnet ut fra dl-tallet'), false);
});

test('ingen «Mengdene oppskrifter bruker mest», og første kort sier hva 1 dl veier', () => {
  const s = sideForRad(rad('ris'), data, rader);
  assert.equal(JSON.stringify(s).includes('Mengdene oppskrifter bruker mest'), false);
  assert.match(s.rik, /<h2>Ris fra dl til gram<\/h2><p>1 dl tørr, polert jasminris veier 80 g\.<\/p>/u);
});

test('varianten står i ingress og metabeskrivelse, mens tittel og H1 beholder kortnavnet', () => {
  const ris = sideForRad(rad('ris'), data, rader);
  assert.equal(ris.lead, '1 dl tørr, polert jasminris veier 80 g. Skriv inn mengden, så ser du vekten med en gang.');
  assert.equal(ris.title, '1 dl ris i gram: regn om dl, ss og ts');
  assert.equal(ris.h1, 'Ris: dl til gram');
  assert.match(ris.description, /^1 dl tørr, polert jasminris veier 80 g\. Regn om mellom dl, ss, ts og gram, med tabell og tallet fra Matvaretabellen\.$/u);
  assert.match(sideForRad(rad('romme'), data, rader).lead, /^1 dl seterrømme med 35 % fett veier 100 g\./u);
});

test('alle sider: metabeskrivelsen følger malen og er 100 til 160 tegn, uten tankestrek og uten like titler', () => {
  const titler = new Set();
  for (const [navn, s] of alleSider()) {
    assert.ok(s.title.length <= 60, `${navn}: ${s.title.length} tegn`);
    assert.ok(s.description.length >= 100 && s.description.length <= 160, `${navn}: beskrivelse ${s.description.length} tegn: ${s.description}`);
    assert.equal(/[—–]/u.test(synligTekst(s)), false, `${navn}: tankestrek`);
    assert.equal(/undefined|NaN|\[object/u.test(synligTekst(s)), false, `${navn}: ugyldig tekst`);
    assert.equal(titler.has(s.title), false, `${navn}: lik tittel`);
    titler.add(s.title);
    assert.ok(s.faq.length >= 3 && s.faq.length <= 4 || navn === 'nav', `${navn}: ${s.faq.length} spørsmål`);
    assert.ok(s.steg.length > 0, `${navn}: steg mangler (registeret krever det)`);
    if (navn !== 'nav') assert.match(s.description, /Regn om mellom dl, ss, ts og gram, med tabell og tall(et)? fra Matvaretabellen( og USDA)?\.$/u, navn);
  }
});

test('nær vare: samme vekt sies «like mye som», ellers «mot»', () => {
  const melk = sideForRad(rad('melk'), data, rader).faq[3];
  assert.equal(melk[1], 'Ja. 1 dl kremfløte med 37 % fett veier 100 g, like mye som helmelk. <a href="/verktoy/dl-til-gram/flote/">Se siden for fløte</a>.');
  const hvete = sideForRad(rad('hvetemel'), data, rader).faq[3];
  assert.match(hvete[1], /^Nei\. 1 dl sammalt hvetemel \(fint eller grovt\) veier 60 g, mot 55 g for siktet hvetemel\./u);
});

test('FAQ: «Del 100 på 100» er et trivielt regnestykke og sløyfes (melk, fløte, rømme), ellers står det', () => {
  for (const [id, ord] of [['melk', 'melk'], ['flote', 'fløte'], ['romme', 'rømme']]) {
    assert.equal(sideForRad(rad(id), data, rader).faq[1][1], `100 g ${ord} er 1 dl.`, id);
  }
  for (const r of rader.filter((x) => x.tall.dl.verdi !== 100)) {
    assert.match(sideForRad(r, data, rader).faq[1][1], new RegExp(`^100 g .+ er [\\d,]+ dl\\. Del 100 på ${r.tall.dl.verdi}\\.$`, 'u'), r.id);
  }
});

test('kommentaren ved VIS_TOPPET sier hvorfor tallene ikke vises, uten å vente på noe svar', async () => {
  const { readFileSync } = await import('node:fs');
  const kilde = readFileSync(new URL('../scripts/familier/dl-til-gram/mal-nb.mjs', import.meta.url), 'utf8');
  const ved = kilde.slice(0, kilde.indexOf('export const VIS_TOPPET'));
  assert.match(ved, /lar seg ikke skille fra strøkne mål/u);
  assert.equal(/venter på svar/u.test(kilde), false);
});

test('FAQ: «Del 100 på 55» og «som tilsvarer … per dl»', () => {
  assert.equal(sideForRad(rad('hvetemel'), data, rader).faq[1][1], '100 g hvetemel er 1,8 dl. Del 100 på 55.');
  const kakao = sideForRad(rad('kakao'), data, rader).faq[3][1];
  assert.equal(kakao, 'USDA har posten «Cocoa, dry powder, unsweetened»: 86 g per cup, som tilsvarer 36 g per dl. Vi bruker Matvaretabellens 50 g.');
});

test('samlesiden: tekstene fra retterunden, og kilden skrives likt', () => {
  const s = navSide(data, rader);
  assert.equal(s.description, `Hva veier 1 dl? Regn om dl, ss, ts og gram for ${rader.length} varer, fra mel og sukker til smør og melk, med kilde på hvert tall.`);
  assert.match(s.rik, /Trykk på en vare for flere mengder, gram til dl og kilder\./u);
  assert.equal(s.faq[1][1], '1 dl hvetemel veier 55 g, så 2 dl blir 110 g.'.replace(/^/u, 'Gang antall dl med vekten per dl for varen. '));
  assert.match(s.faq[2][1], /^Del antall gram på det 1 dl av varen veier\. 100 g hvetemel er 1,8 dl\.$/u);
  assert.equal(s.faq[3][1], 'Vekten per dl er hentet fra Matvaretabellen 2026 (Mattilsynet).');
  assert.match(s.topp, />Matvaretabellen 2026 \(Mattilsynet\)<\/a>\. Skjeene er regnet ut fra dl-tallet\./u);
  assert.equal(JSON.stringify(s).includes('Matvaretabellen 2026, Mattilsynet'), false);
});

test('siden svarer uten JavaScript', () => {
  const s = sideForRad(rad('hvetemel'), data, rader);
  assert.match(s.topp, /<output[^>]*>110<\/output>/u);
  assert.match(s.rik, /<table class="otabell">/u);
  assert.match(s.topp, /class="kalksetning"[^>]*>2 dl hvetemel = 110 g</u);
});

test('samlesiden lister alle varene med lenke, og tittelen har riktig antall', () => {
  const s = navSide(data, rader);
  for (const r of rader) assert.ok(s.rik.includes(`href="/verktoy/dl-til-gram/${r.slug}/"`), r.id);
  assert.ok(s.title.includes(`${rader.length} varer`), s.title);
  assert.equal(s.h1, 'Dl til gram');
  assert.match(s.topp, /<select data-felt="vare">/u);
  assert.match(s.topp, /2 dl hvetemel = 110 g/u);
});

test('strukturerte data: kalkulator og artikkel med kilder, ingen HowTo og ingen FAQPage', () => {
  const typer = sideForRad(rad('hvetemel'), data, rader).schemas.map((x) => x['@type']);
  assert.deepEqual(typer, ['BreadcrumbList', 'WebApplication', 'Article']);
  assert.deepEqual(navSide(data, rader).schemas.map((x) => x['@type']), ['BreadcrumbList', 'WebApplication', 'Article', 'ItemList']);
  const art = sideForRad(rad('hvetemel'), data, rader).schemas[2];
  assert.deepEqual(art.citation.map((c) => c.name), ['Matvaretabellen 2026', 'FoodData Central, SR Legacy']);
  const utenUsda = sideForRad(rader.find((r) => !r.tall.dl_usda), data, rader).schemas[2];
  assert.deepEqual(utenUsda.citation.map((c) => c.name), ['Matvaretabellen 2026']);
  assert.equal(navSide(data, rader).schemas[3].numberOfItems, rader.length);
});

test('kilder: nummerert liste med utgiver, år, lenke og hentedato, og Matvaretabellens kildelinje', () => {
  const s = sideForRad(rad('hvetemel'), data, rader);
  assert.match(s.rik, /<ol class="kilder" id="kilder">/u);
  assert.match(s.rik, /Matvaretabellen 2026\. Mattilsynet\./u);
  assert.match(s.rik, /Hentet 20\. november 2026/u);
  assert.match(s.topp, /Matvaretabellen 2026 \(Mattilsynet\)<\/a>, «Hvetemel, siktet»\./u);
});

test('hver vare har en variantbetegnelse i tekst-nb, og ingenting for en vare som ikke finnes', () => {
  for (const r of rader) assert.ok(TEKST[r.id]?.variant, r.id);
  assert.deepEqual(Object.keys(TEKST).filter((id) => !rad(id)), []);
});

test('kalkulatorens data: varene står som [ord, gram per dl], og faste varer har bare én', () => {
  const html = kalkHtml({ rader, fast: rad('kakao') });
  const json = JSON.parse(html.match(/<script type="application\/json" class="kalk-data">([\s\S]*?)<\/script>/u)[1]);
  assert.deepEqual(json.varer, [['kakao', 50]]);
  assert.equal(json.feil, 'Skriv inn en mengde, for eksempel 2 eller 2,5.');
  assert.match(html, /<b>Kakao<\/b>/u);
  assert.match(html, /<a href="\/verktoy\/dl-til-gram\/">Bytt vare<\/a>/u);
  const valg = kalkHtml({ rader });
  assert.equal(JSON.parse(valg.match(/class="kalk-data">([\s\S]*?)<\/script>/u)[1]).varer.length, rader.length);
});

test('andre varer: åtte lenker pluss «Alle varer», og aldri varen selv', () => {
  const s = sideForRad(rad('hvetemel'), data, rader);
  const b = s.rik.match(/<div class="related">[\s\S]*?<\/div>/u)[0];
  const lenker = [...b.matchAll(/href="([^"]+)"/gu)].map((m) => m[1]);
  assert.equal(lenker.length, 9);
  assert.equal(lenker.includes('/verktoy/dl-til-gram/hvetemel/'), false);
  assert.equal(lenker.at(-1), '/verktoy/dl-til-gram/');
  assert.equal(lenker[0], '/verktoy/dl-til-gram/sammalt-hvetemel/', 'nær variant først');
});

test('teksten leses som ren tekst uten rester av markup', () => {
  const tekst = htmlTilTekst(sideForRad(rad('hvetemel'), data, rader).rik, { attributter: false });
  assert.equal(/&[a-z]+;|<|>/u.test(tekst.replace(/[«»]/gu, '')), false);
});

// Den språknøytrale malkoden (felles-mal.mjs), som norsk og engelsk mal deler.
test('felles tallregler: desimaltegnet velges, og reglene er de samme som før', () => {
  assert.equal(gramTekst(27.5, { komma: false }), '28');
  assert.equal(gramTekst(0.275, { komma: false }), '0.28');
  assert.equal(gramTekst(0.275, { komma: true }), '0,28');
  assert.equal(gramTekst(0, { komma: true }), '0');
  assert.equal(mengdeTekst(4.409, { komma: false }), '4.4');
  assert.equal(mengdeTekst(0.8, { komma: true }), '0,8');
  assert.equal(mengdeTekst(0.8, { komma: false }), '0.8');
  assert.equal(mengdeTekst(16, { komma: false }), '16');
  assert.equal(mengdeTekst(250, { komma: true }), '250');
  assert.equal(sigTekst(2.75, 2, { komma: true }), '2,8');
  assert.equal(sigTekst(0.5, 2), '0.5');
  assert.deepEqual(tallI('1 dl er 55,5 g og 2.5 cups'), ['1', '55,5', '2.5']);
  assert.equal(esc('<a href="x">&</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
});

test('kalkSkjelett: id er valgfritt, tekstene kommer fra kalleren, og dataene beskyttes mot </script>', () => {
  const arg = {
    etiketter: { aria: 'Calculator', mengde: 'Amount', fra: 'From', til: 'To', bytt: 'Swap', vanlige: 'Common' },
    enheter: [['cups', 'Cups'], ['g', 'Grams (g)']], fra: 'cups', til: 'g', data: { varer: [['a<b', 1]] },
    start: { mengde: '2', svar: '250', setning: '2 cups flour = 250 g', hurtig: [['1', '1 cup']] }, vareHtml: '<div class="kalkvare">V</div>',
  };
  const uten = kalkSkjelett(arg);
  assert.ok(uten.startsWith('<form class="kalk" data-kalk="volumvekt"'));
  assert.equal(kalkSkjelett({ ...arg, id: 'fast' }).startsWith('<form class="kalk" id="fast" data-kalk="volumvekt"'), true);
  assert.ok(uten.includes('<option value="cups" selected>Cups</option><option value="g">Grams (g)</option>'));
  assert.ok(uten.includes('<option value="cups">Cups</option><option value="g" selected>Grams (g)</option>'));
  assert.ok(uten.includes('<button type="button" data-v="1">1 cup</button>'));
  assert.ok(uten.includes('class="kalksetning" data-felt="setning" role="status" aria-live="polite">2 cups flour = 250 g</p>'));
  assert.ok(uten.includes('a\\u003cb') && !uten.includes('a<b'));
  assert.ok(uten.includes(PIL) && uten.includes(BYTT));
});
