// Familiene «kjernetemperatur» og «steketid» (nb): adressene, kildene og eierens regler for innholdet.
// Mattilsynet først, MatPrat etterpå med årstall, hvert tall og hver sitert setning i datafila med kilde og ordrett sitat,
// kildeliste på hver side og ingen tankestrek. Den generelle tallvakten og likhetsvakten står i test/familier.test.mjs.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, familieSider } from '../scripts/familier/register.mjs';
import { avvik, kildetekst } from '../scripts/familier/steketid/kildekontroll.mjs';
import { kalkTid } from '../scripts/familier/steketid/mal-felles.mjs';
import { htmlTilTekst, synligTekst } from './hjelp/familievakt.mjs';

const FAM = ['kjernetemperatur', 'steketid'];
const familie = (id) => FAMILIER.find((f) => f.id === id);
const data = (id) => lesData(fileURLToPath(familie(id).mappe), 'nb');
const sider = async (id) => Object.entries(await familieSider('nb', [familie(id)]));
const ROT = fileURLToPath(new URL('..', import.meta.url));

// Adresselås: endres en adresse, må den endres her med vilje (og helst med omdirigering).
const ADRESSER = {
  kjernetemperatur: ['kjernetemperatur/', ...['kylling', 'kalkun', 'svinefilet', 'svinestek', 'svinenakke', 'biff', 'roastbiff', 'oksefilet', 'entrecote', 'lammelar', 'lammefilet', 'kjottdeig', 'laks', 'torsk'].map((s) => `kjernetemperatur/${s}/`)],
  steketid: ['steketid/', ...['ribbe', 'pinnekjott', 'kalkun', 'lammelar', 'svinestek', 'roastbiff', 'hel-kylling', 'kyllingfilet', 'laks-i-ovn', 'bakt-potet', 'egg', 'poteter-og-ris'].map((s) => `steketid/${s}/`)],
};
const KILDEDOMENER = /^https:\/\/www\.(?:mattilsynet\.no|matprat\.no)\//u;

/** Brudd på kilderegelen for én side: ingen kildeliste, MatPrat uten år, MatPrat før Mattilsynet, Mattilsynet ikke nevnt. */
export function kildebrudd(side, { samleside = false } = {}) {
  const feil = [];
  const kilder = /<ol class="kilder" id="kilder">([\s\S]*?)<\/ol>/u.exec(side.rik)?.[1] ?? '';
  const punkter = [...kilder.matchAll(/<li>([\s\S]*?)<\/li>/gu)].map((m) => m[1]);
  if (!punkter.length) feil.push('mangler kildeliste');
  for (const li of punkter) if (!/<a href="https:\/\/[^"]+"/u.test(li) || !/Lest \d{1,2}\. [a-zæøå]+ \d{4}\./u.test(li)) feil.push(`kilde uten lenke eller lesedato: ${li}`);
  const mt = punkter.map((li) => li.startsWith('Mattilsynet:'));
  if (mt.indexOf(false) > -1 && mt.lastIndexOf(true) > mt.indexOf(false)) feil.push('MatPrat står før Mattilsynet i kildelista');
  const uten = htmlTilTekst(side.rik.replace(/<ol class="kilder"[\s\S]*?<\/ol>/u, ''));
  // Overskrifter og aria-label er etiketter, ikke påstander: «MatPrat» uten årstall der gir ingen tall uten kilde.
  const utenEtiketter = htmlTilTekst(side.rik.replace(/<ol class="kilder"[\s\S]*?<\/ol>/u, '').replace(/<h2>[\s\S]*?<\/h2>/gu, ' ').replace(/ aria-label="[^"]*"/gu, ''));
  const tekst = [side.lead, utenEtiketter, ...side.faq.flat().map((x) => htmlTilTekst(x)), side.description].join(' ');
  // Samlesidene skriver «MatPrat» uten årstall i innledende setninger. Årstallet står da per rad i tabellens kildekolonne.
  if (!samleside) for (const m of tekst.matchAll(/MatPrat(?! \(\d{4}\)|, \d{4})/gu)) feil.push(`MatPrat uten årstall: «${tekst.slice(m.index, m.index + 40)}»`);
  // Rekkefølgen sjekkes i brødteksten: første blokk er alltid «Dette sier Mattilsynet». Innledningen kan starte med MatPrat når Mattilsynet ikke har noe om saken.
  const forste = uten;
  if (forste.indexOf('Mattilsynet') === -1) feil.push('Mattilsynet er ikke nevnt');
  else if (forste.indexOf('MatPrat') > -1 && forste.indexOf('MatPrat') < forste.indexOf('Mattilsynet')) feil.push('MatPrat nevnes før Mattilsynet');
  return feil;
}

test('adressene er låst: samleside og varesider under /kjernetemperatur/ og /steketid/', async () => {
  for (const id of FAM) {
    assert.deepEqual(familie(id).markeder, { nb: { rot: `${id}/` } }, id);
    assert.deepEqual((await sider(id)).map(([sti]) => sti).sort(), [...ADRESSER[id]].sort(), id);
  }
});

test('hvert tall og hver sitert setning i datafila har kilde hos Mattilsynet eller MatPrat og et ordrett sitat', () => {
  for (const id of FAM) {
    const d = data(id);
    for (const [k, kilde] of Object.entries(d.kilder)) {
      assert.match(kilde.adresse, KILDEDOMENER, `${id}: ${k}`);
      assert.ok(kilde.utgiver === 'Mattilsynet' || kilde.utgiver.startsWith('MatPrat'), `${id}: ${k}`);
    }
    for (const r of d.rader) {
      for (const [felt, t] of Object.entries(r.tall)) {
        assert.ok(Object.hasOwn(d.kilder, t.kilde), `${id}/${r.id}/${felt}: kilden ${t.kilde} mangler`);
        assert.ok(t.merknad && t.merknad.length >= 10, `${id}/${r.id}/${felt}: mangler sitatet fra kilden`);
      }
      for (const [felt, v] of Object.entries(r.tekst ?? {})) {
        const [kilde, ...rest] = v.split('|');
        assert.ok(Object.hasOwn(d.kilder, kilde), `${id}/${r.id}/${felt}: kilden ${kilde} mangler`);
        assert.ok(rest.join('|').length >= 10, `${id}/${r.id}/${felt}: mangler sitatet`);
      }
    }
  }
});

test('hver rad står bare som kontrollert når den har tall, og avviste rader får ingen side', async () => {
  for (const id of FAM) {
    const d = data(id);
    assert.ok(d.rader.some((r) => r.status === 'avvist'), `${id}: and skal stå som avvist`);
    const publisert = new Set(publiserbare(d).map((r) => r.id));
    assert.ok(!publisert.has('and'), `${id}: and er avvist og skal ikke ha side`);
    for (const [sti] of await sider(id)) assert.ok(!sti.includes('/and/'), sti);
  }
});

test('hver side har kildeliste med lenke og lesedato, Mattilsynet først, og MatPrat alltid med årstall', async () => {
  for (const id of FAM) for (const [sti, side] of await sider(id)) assert.deepEqual(kildebrudd(side, { samleside: sti === `${id}/` }), [], sti);
});

test('ingen side har tankestrek, og sidene bærer forfatterlinjen når de er bygget', async () => {
  for (const id of FAM) {
    for (const [sti, side] of await sider(id)) {
      assert.doesNotMatch(synligTekst(side), /[—–]/u, sti);
      const fil = readFileSync(`${ROT}${sti}index.html`, 'utf8');
      assert.match(fil, /Av <a href="\/om\/">Patrick Kabia<\/a>, kjøletekniker/u, sti);
    }
  }
});

test('hver vareside lenker til samlesiden, og kjernetemperatur og steketid lenker til hverandre', async () => {
  for (const id of FAM) {
    for (const [sti, side] of await sider(id)) {
      if (sti === `${id}/`) continue;
      assert.match(side.rik, new RegExp(`href="/${id}/"`, 'u'), `${sti}: lenke til samlesiden`);
    }
  }
  const alle = Object.fromEntries([...await sider('kjernetemperatur'), ...await sider('steketid')]);
  for (const [fra, til] of [['kjernetemperatur/kylling/', '/steketid/hel-kylling/'], ['kjernetemperatur/kalkun/', '/steketid/kalkun/'], ['steketid/ribbe/', '/kjernetemperatur/svinestek/'], ['steketid/kalkun/', '/kjernetemperatur/kalkun/'], ['steketid/laks-i-ovn/', '/kjernetemperatur/laks/']]) {
    assert.ok(alle[fra].rik.includes(`href="${til}"`), `${fra} -> ${til}`);
  }
});

test('kalkulatoren på kalkunsiden regner minutter per kilo fra datafila og har ett svar som stemmer med eksempelet', async () => {
  const d = data('steketid');
  const kalkun = d.rader.find((r) => r.id === 'kalkun');
  const side = Object.fromEntries(await sider('steketid'))['steketid/kalkun/'];
  const json = JSON.parse(/<script type="application\/json" class="kalk-data">([\s\S]*?)<\/script>/u.exec(side.rik)[1]);
  assert.equal(json.affin.kg[0], kalkun.tall['per-kilo'].verdi, 'faktoren er MatPrats minutter per kilo');
  assert.equal(kalkun.tall['per-kilo'].enhet, 'minutter per kilo');
  assert.match(side.rik, new RegExp(`${kalkun.tall['ex-kg'].verdi} kg = ${kalkun.tall['ex-kg'].verdi * kalkun.tall['per-kilo'].verdi} min`, 'u'));
  assert.equal(kalkun.tall['ex-t'].verdi * 60, kalkun.tall['ex-kg'].verdi * kalkun.tall['per-kilo'].verdi, 'eksempelet fra MatPrat (6 kg, 3 timer) går opp med regelen');
  // Bare kalkun har en slik regel i kildene: ingen andre sider har et kort.
  for (const [sti, s] of await sider('steketid')) if (sti !== 'steketid/kalkun/') assert.ok(!s.rik.includes('class="kalk"'), sti);
  assert.match(kalkTid({ perKilo: 30, ordKilde: 'x', eksempelKg: 6, steg: ['5', '6'] }), /<select data-felt="fra"><option value="kg" selected>kilo<\/option><\/select>/u);
});

test('kildekontrollen finner sitatet i en tabellrad, og melder fra når kilden har endret tallet eller setningen', () => {
  const html = '<main><p>Når du steker hele kjøttstykker, er det nok.</p><table><tr><th>Rett</th><th>Tid</th></tr><tr><td>Kylling</td><td>68 °C</td></tr><tr><td>Svin</td><td>Medium: 65 °C<br>Gjennomstekt: 75 °C</td></tr></table></main>';
  const tekster = { k: kildetekst(html) };
  const d = (merknad, tekst) => ({ rader: [{ id: 'x', tall: { a: { verdi: 68, kilde: 'k', merknad } }, tekst }] });
  assert.deepEqual(avvik(d('Kylling | 68 °C'), tekster), []);
  assert.deepEqual(avvik(d('Svin | Medium: 65 °C / Gjennomstekt: 75 °C'), tekster), []);
  assert.deepEqual(avvik(d('Kylling | 68 °C', { s: 'k|Når du steker hele kjøttstykker, er det nok.' }), tekster), []);
  assert.deepEqual(avvik(d('Kylling | 70 °C'), tekster), [{ id: 'x', felt: 'a', kilde: 'k' }]);
  assert.deepEqual(avvik(d('Kylling | 68 °C', { s: 'k|Når du steker hele kjøttstykker, er det ikke nok.' }), tekster), [{ id: 'x', felt: 's', kilde: 'k' }]);
  assert.deepEqual(avvik(d('Kylling | 68 °C'), {}), [{ id: 'x', felt: 'a', kilde: 'k' }]);
});

test('kilderegelen kan bli rød: MatPrat uten år, MatPrat først, ingen Mattilsynet og manglende kildeliste felles', () => {
  const god = { lead: 'Mattilsynet (2023) skriver at gjennomstekt er minimum 75 °C. MatPrat (2014) oppgir 68 °C.', rik: '<p>Mattilsynet (2023) skriver noe. MatPrat (2014) skriver noe.</p><ol class="kilder" id="kilder"><li>Mattilsynet: <a href="https://www.mattilsynet.no/a">A</a> (2023). Lest 21. november 2026.</li><li>MatPrat (Opplysningskontoret for egg og kjøtt): <a href="https://www.matprat.no/b">B</a> (2014). Lest 21. november 2026.</li></ol>', faq: [], description: '' };
  assert.deepEqual(kildebrudd(god), []);
  assert.ok(kildebrudd({ ...god, lead: 'Mattilsynet (2023) sier noe. MatPrat oppgir 68 °C.' }).some((f) => f.startsWith('MatPrat uten årstall')));
  assert.deepEqual(kildebrudd({ ...god, lead: 'Mattilsynet (2023) sier noe. MatPrat oppgir 68 °C.' }, { samleside: true }), [], 'samlesiden slipper årstall i innledningen');
  assert.ok(kildebrudd({ ...god, rik: god.rik.replace('<p>Mattilsynet (2023) skriver noe. MatPrat (2014) skriver noe.</p>', '<p>MatPrat (2014) skriver noe. Mattilsynet (2023) skriver noe.</p>') }).includes('MatPrat nevnes før Mattilsynet'));
  assert.ok(kildebrudd({ ...god, rik: god.rik.replace('<p>Mattilsynet (2023) skriver noe. MatPrat (2014) skriver noe.</p>', '<p>MatPrat (2014) skriver noe.</p>') }).includes('Mattilsynet er ikke nevnt'));
  assert.ok(kildebrudd({ ...god, rik: '<p>Mattilsynet (2023) skriver noe.</p>' }).includes('mangler kildeliste'));
  assert.ok(kildebrudd({ ...god, rik: god.rik.replace(/(<li>Mattilsynet[\s\S]*?<\/li>)(<li>MatPrat[\s\S]*?<\/li>)/u, '$2$1') }).includes('MatPrat står før Mattilsynet i kildelista'));
});
