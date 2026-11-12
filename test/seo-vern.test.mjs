import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { lesData } from '../seo-motor/skjema.mjs';
import { lesNettsted, ordOverlapp, slugify } from '../seo-motor/nettsted.mjs';
import { gjenkjennSprak } from '../seo-motor/sprakgjenkjenning.mjs';
import { sjekkFast } from '../seo-motor/vern.mjs';

const repoRot = new URL('../', import.meta.url);
const fixtureRot = new URL('../seo-motor/test/fixtures/artikler/', import.meta.url);
const nettsted = lesNettsted(repoRot);
const forbudt = lesData('forbudt.json');
const grenser = lesData('grenser.json');
const sprakfiler = Object.fromEntries(
  ['nb', 'sv', 'da', 'en'].map((sprak) => [sprak, lesData(`sprak/${sprak}.json`)]),
);

function lesFixture(navn = 'gyldig') {
  const grunnlag = JSON.parse(readFileSync(new URL('gyldig.json', fixtureRot), 'utf8'));
  const endring = navn === 'gyldig'
    ? {}
    : JSON.parse(readFileSync(new URL(`${navn}.json`, fixtureRot), 'utf8'));
  const artikkel = { ...grunnlag, ...endring };
  const ekstraTekst = artikkel.ekstraTekst ?? '';
  artikkel.seksjoner = artikkel.seksjoner.map((seksjon) => ({
    ...seksjon,
    tekst: `${`${artikkel.sprakTekst} `.repeat(25).trim()}${ekstraTekst}`,
  }));
  delete artikkel.sprakTekst;
  delete artikkel.ekstraTekst;
  return artikkel;
}

function sjekk(navn) {
  return sjekkFast(lesFixture(navn), { nettsted, forbudt, sprakfiler, grenser });
}

test('gyldig artikkel passerer', () => {
  assert.equal(nettsted.stier.has('/ukemeny/'), true);
  assert.deepEqual(sjekk('gyldig'), { ok: true, grunner: [] });
});

test('ingen stoppord finnes i mer enn én språkliste', () => {
  const stoppord = Object.fromEntries(
    Object.entries(sprakfiler).map(([sprak, sprakfil]) => [sprak, sprakfil.stoppord]),
  );
  const sprakPerOrd = new Map();

  for (const [sprak, ord] of Object.entries(stoppord)) {
    for (const stoppordet of ord) {
      const sprakMedOrdet = sprakPerOrd.get(stoppordet) ?? [];
      sprakMedOrdet.push(sprak);
      sprakPerOrd.set(stoppordet, sprakMedOrdet);
    }
  }

  const overlapp = [...sprakPerOrd]
    .filter(([, sprak]) => sprak.length > 1)
    .map(([ord, sprak]) => ({ ord, sprak }));

  assert.deepEqual(overlapp, []);
});

test('språkgjenkjenning skiller ekte avsnitt om rester på nb, sv, da og en', () => {
  const stoppord = Object.fromEntries(
    Object.entries(sprakfiler).map(([sprak, sprakfil]) => [sprak, sprakfil.stoppord]),
  );
  const eksempler = {
    nb: 'Når du åpner kjøleskapet, er det lurt å se hva som bør brukes først. Noen rester kan bli en ny middag, mens annet passer i matpakken. Hvis du har mye kokt ris eller noen grønnsaker, kan du også lage en enkel panne. Planlegg måltidet etter det du har, og bruk bare det som fortsatt er godt. Da kan maten være lettere å huske, og du slipper å kjøpe mer enn nødvendig nå.',
    da: 'Når du åbner køleskabet, kan du se, hvad der skal bruges først. Nogle madrester bliver til en ny aftensmad, mens andre passer i madpakken. Har du meget kogt ris eller grøntsager, kan du gerne samle dem i en hurtig ret. Planlæg derfor ud fra det, der allerede står på hylden. Efter måltidet kan du dele maden i mindre beholdere. Sådan får du overblik og undgår at købe mere af det, du har nok af.',
    sv: 'När du öppnar kylskåpet är det bra att se vad som behöver användas först. Några rester kan bli en ny middag och annat passar i matlådan. Om det finns många kokta grönsaker eller ris kvar kan du gärna laga en enkel panna. Planera måltiden med råvarorna som redan finns hemma. Sedan kan du märka burkarna och ställa dem över det som håller längre. Då glömmer du inte resterna och köper bara det som saknas.',
    en: 'When you open the refrigerator, check which leftovers should be used first. Some vegetables can become a quick dinner, and cooked rice can go into a warm bowl. Plan the meal with what you already have before adding anything to your grocery list. Put each portion in a clear container so you can see it. The next day, use them for lunch or turn them into another meal. This simple habit keeps food visible and helps your week feel easier to manage.',
  };

  for (const [sprak, tekst] of Object.entries(eksempler)) {
    const antallOrd = tekst.match(/\p{L}+/gu)?.length ?? 0;
    assert.ok(antallOrd >= 60 && antallOrd <= 100, `${sprak} har ${antallOrd} ord`);
    assert.equal(gjenkjennSprak(tekst, stoppord), sprak);
  }
});

test('nettstedindeksen leser hele metadata med apostrof', () => {
  const side = nettsted.sider.find(({ sti }) => sti === '/en/blog/leftovers-in-the-fridge/');

  assert.match(side.meta, /Here's how long the usual ones last/);
  assert.match(side.meta, /USDA guidelines\.$/);
});

test('for lang tittel avvises', () => {
  assert.match(sjekk('for-lang-tittel').grunner.join(' '), /tittel/i);
});

test('slugify gir ascii og vern avviser kollisjon', () => {
  assert.equal(slugify('Rømmegrøt på 10 min'), 'rommegrot-pa-10-min');
  assert.match(sjekk('slug-kollisjon').grunner.join(' '), /slug/i);
});

test('slug i forbudt.json avvises', () => {
  const artikkel = lesFixture();
  const resultat = sjekkFast(artikkel, {
    nettsted,
    forbudt: { ...forbudt, slugs: [`/${artikkel.slug}/`] },
    sprakfiler,
    grenser,
  });

  assert.match(resultat.grunner.join(' '), /forbudt.*slug/i);
});

test('nesten-duplikat avvises', () => {
  assert.ok(ordOverlapp(
    'Koketider for ris, pasta, egg og grønnsaker',
    'Koketider for egg, ris, pasta og grønnsaker',
  ) > 0.5);
  assert.match(sjekk('nesten-duplikat').grunner.join(' '), /overlapp/i);
});

test('lenke til matprat.no avvises', () => {
  assert.match(sjekk('forbudt-lenke').grunner.join(' '), /forbudt/i);
});

test('død intern lenke avvises', () => {
  assert.match(sjekk('dod-intern-lenke').grunner.join(' '), /intern lenke/i);
});

test('absolutt død intern lenke avvises', () => {
  const artikkel = lesFixture();
  artikkel.lenker = [{ sti: 'https://matlyst-app.no/finnes-ikke/', tittel: 'Les mer' }];

  assert.match(
    sjekkFast(artikkel, { nettsted, forbudt, sprakfiler, grenser }).grunner.join(' '),
    /intern lenke/i,
  );
});

test('tall uten påstand avvises', () => {
  assert.match(sjekk('tall-uten-pastand').grunner.join(' '), /tall/i);
});

test('delstreng i et annet tall teller ikke som påstand', () => {
  const artikkel = lesFixture();
  artikkel.seksjoner[0].tekst += ' Stek grønnsakene i 5 minutter.';
  artikkel.pastander = [{ tekst: 'Stek grønnsakene i 15 minutter.', kilde_id: 'K1' }];

  assert.match(
    sjekkFast(artikkel, { nettsted, forbudt, sprakfiler, grenser }).grunner.join(' '),
    /tall/i,
  );
});

test('ukjent kilde_id avvises', () => {
  assert.match(sjekk('ukjent-kilde').grunner.join(' '), /kilde_id/i);
});

test('svensk tekst merket da avvises', () => {
  assert.match(sjekk('svensk-som-da').grunner.join(' '), /språk/i);
});

test('en-tekst med «the shop» avvises', () => {
  assert.match(sjekk('britisk-engelsk').grunner.join(' '), /britisk/i);
});

test('helseord avvises', () => {
  assert.match(sjekk('helseord').grunner.join(' '), /helseord/i);
});

test('bøyde helseord avvises', () => {
  const artikkel = lesFixture();
  artikkel.seksjoner[0].tekst += ' Rådene er ikke laget for allergikere eller for å telle kalorier.';

  assert.match(
    sjekkFast(artikkel, { nettsted, forbudt, sprakfiler, grenser }).grunner.join(' '),
    /helseord/i,
  );
});
