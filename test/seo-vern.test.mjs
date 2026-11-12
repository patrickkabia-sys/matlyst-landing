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

test('stoppordlistene har 25–35 generelle ord uten mattema', () => {
  const temaord = new Set([
    'aftensmad', 'beholdere', 'grøntsager', 'køleskabet', 'madpakken', 'madrester',
    'food', 'leftovers', 'meal', 'refrigerator', 'vegetables',
    'kjøleskapet', 'måltidet', 'råvarene',
    'kylskåpet', 'måltiden', 'råvarorna', 'resterna',
  ]);

  for (const [sprak, sprakfil] of Object.entries(sprakfiler)) {
    assert.ok(
      sprakfil.stoppord.length >= 25 && sprakfil.stoppord.length <= 35,
      `${sprak} har ${sprakfil.stoppord.length} stoppord`,
    );
    assert.deepEqual(
      sprakfil.stoppord.filter((ord) => temaord.has(ord)),
      [],
      `${sprak} har temaord`,
    );
  }
});

test('språkgjenkjenning skiller ekte avsnitt om tre temaer på nb, sv, da og en', () => {
  const stoppord = Object.fromEntries(
    Object.entries(sprakfiler).map(([sprak, sprakfil]) => [sprak, sprakfil.stoppord]),
  );
  const eksempler = {
    rester: {
      nb: 'Når du åpner kjøleskapet, er det lurt å se hva som bør brukes først. Noen rester kan bli en ny middag, mens annet passer i matpakken. Hvis du har mye kokt ris eller noen grønnsaker, kan du også lage en enkel panne. Planlegg måltidet etter det du har, og bruk bare det som fortsatt er godt. Da kan maten være lettere å huske, og du slipper å kjøpe mer enn nødvendig nå.',
      da: 'Når du åbner køleskabet, kan du se, hvad der skal bruges først. Nogle madrester bliver til en ny aftensmad, mens andre passer i madpakken. Har du meget kogt ris eller grøntsager, kan du gerne bruge dem i en hurtig ret. Planlæg derfor ud fra det, du allerede har. Efter måltidet kan du dele maden i mindre beholdere. Sådan får du overblik og undgår at købe mere af det, du har nok af.',
      sv: 'När du öppnar kylskåpet är det bra att se vad som behöver användas först. Några rester kan bli en ny middag och andra passar i matlådan. Om det finns många kokta grönsaker eller ris kvar kan du gärna laga en enkel panna. Planera måltiden med råvarorna som redan finns hemma. Sedan kan du märka burkarna och ställa dem längst fram, framför det som håller längre. Då glömmer du inte resterna och köper bara det som saknas.',
      en: 'When you open the refrigerator, check which leftovers should be used first. Some vegetables can become a quick dinner, and cooked rice can go into a warm bowl. Plan the meal with what you already have before adding anything to your grocery list. Put each portion in a clear container so you can see it. The next day, use them for lunch or turn them into another meal. This simple habit keeps food visible and helps your week feel easier to manage.',
    },
    airfryer: {
      nb: 'En airfryer blir raskt varm og passer godt når du vil lage en mindre porsjon. Fordel bitene i ett lag, slik at den varme luften kommer til rundt hele overflaten. Hvis kurven er for full, kan resultatet bli ujevnt. Snu eller rist innholdet underveis, og sjekk gjerne litt før tiden i oppskriften er ute. Ulike modeller arbeider forskjellig, derfor bør du følge med første gang og notere hva som fungerer best hjemme hos deg.',
      da: 'En airfryer bliver hurtigt varm og er praktisk, når du vil tilberede en mindre portion. Fordel stykkerne i ét lag, så den varme luft kan bevæge sig omkring dem. Hvis kurven er for fuld, bliver resultatet ofte ujævnt. Vend eller ryst indholdet undervejs, og se gerne til det lidt før den angivne tid. Modeller arbejder forskelligt, så følg ekstra godt med første gang, og skriv bagefter ned, hvad der fungerede bedst hjemme hos dig.',
      sv: 'En airfryer blir snabbt varm och passar bra när du vill laga en mindre portion. Fördela bitarna i ett jämnt lager så att den varma luften kommer åt runt om. Om korgen är för full blir resultatet lätt ojämnt. Vänd eller skaka innehållet under tiden och kontrollera gärna lite tidigare än receptet anger. Olika modeller fungerar på olika sätt, så håll extra uppsikt första gången och anteckna vad som fungerar bäst hemma hos dig.',
      en: 'An air fryer heats up quickly and works well when you want to make a smaller batch. Arrange the pieces in a single layer so hot air can move around every side. An overcrowded basket may give you uneven results. Turn or shake the contents during cooking, then check a little earlier than the recipe suggests. Models vary, so watch closely the first time and write down what works best in your kitchen for an easier result next time.',
    },
    egg: {
      nb: 'Koketiden for egg avhenger av størrelsen, temperaturen før koking og hvordan du liker plommen. Legg eggene forsiktig i vannet når det koker, og start tiden med én gang. Små forskjeller kan endre resultatet, så bruk samme metode flere ganger før du justerer. Etterpå kan du kjøle eggene i kaldt vann. Det stanser kokingen og gjør dem lettere å håndtere. Noter tiden som passer hjemme, slik at du enkelt kan gjenta resultatet senere.',
      da: 'Kogetiden for æg afhænger af størrelsen, temperaturen før kogning og af, hvordan du foretrækker blommen. Læg forsigtigt æggene i vandet, når det koger, og start tiden med det samme. Små forskelle kan ændre resultatet, så brug den samme metode nogle gange, før du justerer. Køl bagefter æggene i koldt vand. Det standser tilberedningen og gør dem lettere at håndtere. Skriv den tid ned, der passer hjemme hos dig, så resultatet er nemt at gentage.',
      sv: 'Koktiden för ägg beror på storleken, temperaturen före kokningen och hur du vill ha gulan. Lägg försiktigt äggen i vattnet när det kokar och starta timern direkt. Små skillnader kan påverka resultatet, så använd samma metod några gånger innan du justerar den. Kyl sedan äggen i kallt vatten. Det avbryter tillagningen och gör dem lättare att hantera. Skriv ned tiden som passar hemma hos dig, så blir resultatet enklare att upprepa senare.',
      en: 'Cooking time for eggs depends on their size, their starting temperature, and how you prefer the yolk. Lower the eggs carefully into boiling water and start timing right away. Small differences can change the result, so repeat the same method before making adjustments. Cool the eggs in cold water afterward. This stops the cooking and makes them easier to handle. Write down the timing that works in your kitchen, and you can repeat the result more reliably later.',
    },
  };

  for (const [tema, spraktekster] of Object.entries(eksempler)) {
    for (const [sprak, tekst] of Object.entries(spraktekster)) {
      const antallOrd = tekst.match(/\p{L}+/gu)?.length ?? 0;
      assert.ok(antallOrd >= 60 && antallOrd <= 100, `${tema}/${sprak} har ${antallOrd} ord`);
      assert.equal(gjenkjennSprak(tekst, stoppord), sprak, `${tema}/${sprak}`);
    }
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
