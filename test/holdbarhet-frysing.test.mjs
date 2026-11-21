// Familiene «holdbarhet» og «frysing» (nb): adressene, kildene og eierens regler for innholdet.
// Mattilsynet først, MatPrat etterpå med årstall, hvert tall i datafila med kilde og sitat, kildeliste på hver side,
// og datomerkingen nevnt på sidene om pakkede varer. Den generelle tallvakten og likhetsvakten står i test/familier.test.mjs.
import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, familieSider } from '../scripts/familier/register.mjs';
import { avvik, kildetekst } from '../scripts/familier/holdbarhet/kildekontroll.mjs';
import { htmlTilTekst, synligTekst, tallUtenforData } from './hjelp/familievakt.mjs';

const FAM = ['holdbarhet', 'frysing'];
const familie = (id) => FAMILIER.find((f) => f.id === id);
const data = (id) => lesData(fileURLToPath(familie(id).mappe), 'nb');
const mal = (id) => import(new URL('mal-nb.mjs', familie(id).mappe));
const sider = async (id) => Object.entries(await familieSider('nb', [familie(id)]));

// Adresselås: endres en adresse, må den endres her med vilje (og helst med omdirigering).
const ADRESSER = {
  holdbarhet: ['holdbarhet/', 'holdbarhet/egg/', 'holdbarhet/kokte-egg/', 'holdbarhet/kokt-ris-og-pasta/', 'holdbarhet/kjottdeig-og-kylling/', 'holdbarhet/kjott/', 'holdbarhet/skalldyr/', 'holdbarhet/rester/'],
  frysing: ['frysing/', 'frysing/ost/', 'frysing/melk/', 'frysing/smor/', 'frysing/egg/', 'frysing/brod/', 'frysing/kaker/', 'frysing/kjottdeig-og-kylling/', 'frysing/kjott/', 'frysing/middagsrester/', 'frysing/fisk/', 'frysing/skalldyr/', 'frysing/baer/', 'frysing/frukt-og-gronnsaker/'],
};
// Varesidene om pakkede varer skal si at datoen og rådene på pakken gjelder.
const PAKKEDE = ['holdbarhet/kjottdeig-og-kylling/', 'holdbarhet/kjott/', 'holdbarhet/skalldyr/'];
const KILDEDOMENER = /^https:\/\/www\.(?:mattilsynet\.no|matprat\.no)\//u;

/** Brudd på kilderegelen for én side: tekst uten kildeliste, MatPrat uten år, MatPrat før Mattilsynet. */
export function kildebrudd(side) {
  const feil = [];
  const kilder = /<ol class="kilder" id="kilder">([\s\S]*?)<\/ol>/u.exec(side.rik)?.[1] ?? '';
  const punkter = [...kilder.matchAll(/<li>([\s\S]*?)<\/li>/gu)].map((m) => m[1]);
  if (!punkter.length) feil.push('mangler kildeliste');
  for (const li of punkter) if (!/<a href="https:\/\/[^"]+"/u.test(li) || !/Lest \d{1,2}\. [a-zæøå]+ \d{4}\./u.test(li)) feil.push(`kilde uten lenke eller lesedato: ${li}`);
  const mt = punkter.map((li) => li.startsWith('Mattilsynet:'));
  if (mt.indexOf(false) > -1 && mt.lastIndexOf(true) > mt.indexOf(false)) feil.push('MatPrat står før Mattilsynet i kildelista');
  const uten = htmlTilTekst(side.rik.replace(/<ol class="kilder"[\s\S]*?<\/ol>/u, ''));
  const tekst = [side.lead, uten, ...side.faq.flat().map((x) => htmlTilTekst(x)), side.description].join(' ');
  for (const m of tekst.matchAll(/MatPrat(?! \(\d{4}\)|, \d{4})/gu)) feil.push(`MatPrat uten årstall: «${tekst.slice(m.index, m.index + 40)}»`);
  const forsteMt = [side.lead, uten].join(' ').indexOf('Mattilsynet');
  const forsteMp = [side.lead, uten].join(' ').indexOf('MatPrat');
  if (forsteMt === -1) feil.push('Mattilsynet er ikke nevnt');
  else if (forsteMp > -1 && forsteMp < forsteMt) feil.push('MatPrat nevnes før Mattilsynet');
  return feil;
}

test('adressene er låst: samleside og varesider under /holdbarhet/ og /frysing/', async () => {
  for (const id of FAM) {
    assert.deepEqual(familie(id).markeder, { nb: { rot: `${id}/` } }, id);
    assert.deepEqual((await sider(id)).map(([sti]) => sti).sort(), [...ADRESSER[id]].sort(), id);
  }
});

test('hvert tall i datafila har kilde hos Mattilsynet eller MatPrat og et sitat fra kilden', () => {
  for (const id of FAM) {
    const d = data(id);
    for (const [k, kilde] of Object.entries(d.kilder)) assert.match(kilde.adresse, KILDEDOMENER, `${id}: ${k}`);
    for (const r of d.rader) {
      for (const [felt, t] of Object.entries(r.tall)) {
        assert.ok(Object.hasOwn(d.kilder, t.kilde), `${id}/${r.id}/${felt}: kilden ${t.kilde} mangler`);
        assert.ok(t.merknad && t.merknad.length >= 10, `${id}/${r.id}/${felt}: mangler sitatet fra kilden`);
      }
    }
  }
});

test('frysetidene fra MatPrat ligger innenfor Mattilsynets ramme, ellers er varen avvist', () => {
  const d = data('frysing');
  for (const r of publiserbare(d)) {
    const ramme = [r.tall['mt-kv-min'].verdi, r.tall['mt-kv-maks'].verdi];
    for (const [felt, t] of Object.entries(r.tall)) {
      if (t.kilde !== 'mp-fryser') continue;
      assert.equal(t.enhet, 'måneder', `${r.id}/${felt}`);
      assert.ok(t.verdi >= ramme[0] && t.verdi <= ramme[1], `${r.id}/${felt}: ${t.verdi} er utenfor ${ramme.join(' til ')}`);
    }
  }
});

test('hvert tall på hver side står i datafila (eller er år og lesedato for en kilde)', async () => {
  for (const id of FAM) {
    const d = data(id);
    const m = await mal(id);
    for (const [sti, side] of await sider(id)) {
      const rad = publiserbare(d).find((r) => sti === `${id}/${r.slug}/`);
      assert.deepEqual(tallUtenforData(side, rad ? m.tillatteTall(rad, d) : m.tillatteTallNav(d)), [], sti);
    }
  }
});

test('hver side har kildeliste med lenke og lesedato, Mattilsynet først, og MatPrat alltid med årstall', async () => {
  for (const id of FAM) for (const [sti, side] of await sider(id)) assert.deepEqual(kildebrudd(side), [], sti);
});

test('sidene om pakkede varer sier at pakken gjelder, og ingen side har tankestrek', async () => {
  for (const id of FAM) {
    for (const [sti, side] of await sider(id)) {
      if (PAKKEDE.includes(sti)) assert.match(side.rik, /Står det noe på pakken, gjelder det/u, sti);
      assert.doesNotMatch(synligTekst(side), /[—–]/u, sti);
    }
  }
  const egg = Object.fromEntries(await sider('holdbarhet'))['holdbarhet/egg/'];
  assert.match(egg.rik, /«best før»/u);
});

test('kildekontrollen finner sitatet i en tabellrad, og melder fra når kilden har endret tallet', () => {
  const html = '<main><p>Kjøleskapet bør vere under 4&nbsp;ºC.</p><table><tr><th>Hva</th><th>Tid</th></tr><tr><td>Kylling</td><td>4 mnd</td></tr><tr><td>Svinekjøtt</td><td>Magert: 6 mnd<br>Med fett: 3 mnd</td></tr></table></main>';
  const tekster = { k: kildetekst(html) };
  const d = (merknad) => ({ rader: [{ id: 'x', tall: { a: { verdi: 4, kilde: 'k', merknad } } }] });
  assert.deepEqual(avvik(d('Kylling | 4 mnd'), tekster), []);
  assert.deepEqual(avvik(d('Svinekjøtt | Magert: 6 mnd / Med fett: 3 mnd'), tekster), []);
  assert.deepEqual(avvik(d('Kjøleskapet bør vere under 4 ºC.'), tekster), []);
  assert.deepEqual(avvik(d('Kylling | 5 mnd'), tekster), [{ id: 'x', felt: 'a', kilde: 'k' }]);
  assert.deepEqual(avvik(d('Kylling | 4 mnd'), {}), [{ id: 'x', felt: 'a', kilde: 'k' }]);
});

test('kilderegelen kan bli rød: MatPrat uten år, MatPrat først og manglende kildeliste felles', () => {
  const god = { lead: 'Hold kjøleskapet under 4 °C, sier Mattilsynet. Tiden er 4 dager, ifølge MatPrat (2026).', rik: '<p>x</p><ol class="kilder" id="kilder"><li>Mattilsynet: <a href="https://www.mattilsynet.no/a">A</a> (2026). Lest 21. november 2026.</li><li>MatPrat (Opplysningskontoret for egg og kjøtt): <a href="https://www.matprat.no/b">B</a> (2026). Lest 21. november 2026.</li></ol>', faq: [], description: '' };
  assert.deepEqual(kildebrudd(god), []);
  assert.ok(kildebrudd({ ...god, lead: 'Tiden er 4 dager, ifølge MatPrat. Mattilsynet sier noe.' }).some((f) => f.startsWith('MatPrat uten årstall')));
  assert.ok(kildebrudd({ ...god, lead: 'MatPrat (2026) sier 4 dager. Mattilsynet sier noe.' }).includes('MatPrat nevnes før Mattilsynet'));
  assert.ok(kildebrudd({ ...god, rik: '<p>x</p>' }).includes('mangler kildeliste'));
  assert.ok(kildebrudd({ ...god, rik: god.rik.replace(/(<li>Mattilsynet[\s\S]*?<\/li>)(<li>MatPrat[\s\S]*?<\/li>)/u, '$2$1') }).includes('MatPrat står før Mattilsynet i kildelista'));
});
