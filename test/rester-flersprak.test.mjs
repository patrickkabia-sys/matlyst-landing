// Familien «rester» på svensk, dansk og amerikansk engelsk: samlesiden står på adressen den eldre guiden hadde, og undersidene ligger under den.
// Adressene er låst, hvert tall og hver sitert setning er hentet fra de samme kildene som holdbarhet- og frysing-sidene på språket (utledet derfra, ikke gjentatt her),
// kildene er fra landet, og sidene har hreflang til norsk der varen er den samme. Kontroll mot kildesidene krever nett:
// node scripts/familier/holdbarhet/kildekontroll.mjs rester sv|da|en
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, SPRAKMAPPE, familieForSti, familieGrupper } from '../scripts/familier/register.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const familie = FAMILIER.find((f) => f.id === 'rester');
const les = (id, mk) => lesData(fileURLToPath(new URL(`../scripts/familier/${id}/`, import.meta.url)), mk);
const side = (sti) => readFileSync(join(ROT, sti, 'index.html'), 'utf8');
const hoved = (sti) => side(sti).match(/<main[\s\S]*?<\/main>/u)?.[0] ?? '';
const tekstAv = (html) => html.replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<[^>]+>/gu, ' ').replace(/\s+/gu, ' ');

const MARKEDER = {
  sv: { rot: 'recept-pa-ingredienser/', prefiks: 'med-', slugs: ['kottfars', 'kyckling', 'agg', 'potatis', 'kokt-potatis', 'ris', 'pasta', 'lax', 'julskinka', 'gradde', 'morotter', 'brod', 'bananer'], vert: /\.se$/u, hreflang: 'sv-SE', hallbarhet: '/sv/hallbarhet/', frysing: '/sv/frysa/' },
  da: { rot: 'opskrifter-ud-fra-ingredienser/', prefiks: 'med-', slugs: ['hakket-oksekoed', 'kylling', 'aeg', 'kartofler', 'kogte-kartofler', 'ris', 'pasta', 'laks', 'flaeskesteg', 'and', 'floede', 'gulerodder', 'rugbroed', 'bananer'], vert: /\.dk$/u, hreflang: 'da-DK', hallbarhet: '/da/holdbarhed/', frysing: '/da/kan-man-fryse/' },
  en: { rot: 'recipes-by-ingredients/', prefiks: 'with-', slugs: ['ground-beef', 'chicken', 'rotisserie-chicken', 'eggs', 'leftover-potatoes', 'leftover-rice', 'leftover-pasta', 'salmon', 'leftover-turkey', 'leftover-ham', 'heavy-cream', 'carrots'], vert: /\.gov$/u, hreflang: 'en', hallbarhet: '/en/how-long-does-it-last/', frysing: '/en/can-you-freeze/' },
};

test('adresselås: rester har fire markeder, og samlesiden på hvert språk er den gamle guidens adresse', () => {
  assert.deepEqual(familie.markeder, {
    nb: { rot: 'hva-kan-jeg-lage/', gruppeFinnes: true },
    sv: { rot: 'recept-pa-ingredienser/', gruppeFinnes: true },
    da: { rot: 'opskrifter-ud-fra-ingredienser/', gruppeFinnes: true },
    en: { rot: 'recipes-by-ingredients/', gruppeFinnes: true },
  });
  const grupper = familieGrupper();
  assert.equal(grupper.some((g) => g.id === 'auto-fam-rester-nav'), false, 'samlesiden hører til sidegruppen oppskrifter-fra-ingredienser og får ingen egen gruppe');
});

for (const [mk, c] of Object.entries(MARKEDER)) {
  const d = () => les('rester', mk);
  const adresser = c.slugs.map((s) => `/${SPRAKMAPPE[mk]}${c.rot}${c.prefiks}${s}/`);

  test(`${mk}: samlesiden og ${c.slugs.length} undersider har fast adresse, står i sitemap og har canonical`, () => {
    assert.deepEqual(publiserbare(d()).map((r) => r.slug), c.slugs.map((s) => `${c.prefiks}${s}`));
    const kart = readFileSync(join(ROT, `sitemap-${mk}.xml`), 'utf8');
    for (const a of [`/${SPRAKMAPPE[mk]}${c.rot}`, ...adresser]) {
      assert.match(kart, new RegExp(`<loc>https://matlyst-app\\.no${a}</loc>`, 'u'), a);
      assert.match(side(a.slice(1)), new RegExp(`<link rel="canonical" href="https://matlyst-app\\.no${a}">`, 'u'), a);
      assert.equal(familieForSti(a), 'rester', a);
    }
    assert.doesNotMatch(readFileSync(join(ROT, 'sitemap.xml'), 'utf8'), new RegExp(`<loc>https://matlyst-app\\.no/${SPRAKMAPPE[mk]}${c.rot}`, 'u'), 'norsk sitemap har bare norske adresser');
  });

  test(`${mk}: hvert tall og hver sitert setning er utledet fra holdbarhet eller frysing på samme språk, med samme kilde og samme sitat`, () => {
    const fasit = [les('holdbarhet', mk), les('frysing', mk)];
    const tall = new Set();
    const tekst = new Set();
    for (const f of fasit) for (const r of f.rader) {
      for (const t of Object.values(r.tall)) tall.add(`${t.verdi}|${t.enhet}|${t.kilde}|${t.merknad}`);
      for (const q of Object.values(r.tekst ?? {})) tekst.add(q);
    }
    const data = d();
    let n = 0;
    for (const r of data.rader) {
      assert.ok(Object.keys(r.tall).length > 0, `${r.id}: ingen tall`);
      for (const [navn, t] of Object.entries(r.tall)) {
        n += 1;
        assert.ok(t.merknad && t.merknad.length > 8, `${r.id}/${navn}: mangler sitat`);
        assert.ok(tall.has(`${t.verdi}|${t.enhet}|${t.kilde}|${t.merknad}`), `${r.id}/${navn}: tallet står ikke likt i holdbarhet eller frysing (${mk})`);
        assert.deepEqual(data.kilder[t.kilde] && { ...data.kilder[t.kilde], hentet: '' }, { ...[...fasit.flatMap((f) => Object.entries(f.kilder))].find(([id]) => id === t.kilde)?.[1], hentet: '' }, `${r.id}/${navn}: kilden er ikke den samme`);
      }
      for (const [navn, q] of Object.entries(r.tekst ?? {})) {
        n += 1;
        assert.ok(tekst.has(q), `${r.id}/${navn}: setningen står ikke likt i holdbarhet eller frysing (${mk})`);
      }
    }
    assert.ok(n > 40, `bare ${n} tall og sitater ble sjekket`);
  });

  test(`${mk}: alle kilder er fra landet og har https-adresse`, () => {
    for (const [id, k] of Object.entries(d().kilder)) {
      assert.match(k.adresse, /^https:\/\//u, id);
      assert.match(new URL(k.adresse).hostname, c.vert, `${id}: ${k.adresse} er ikke en kilde fra landet`);
    }
  });

  test(`${mk}: ingen tankestrek, ingen emoji, ingen oppskriftsoverskrifter, og «nok» står ikke i dansk tekst`, () => {
    for (const a of [`/${SPRAKMAPPE[mk]}${c.rot}`, ...adresser]) {
      const t = tekstAv(hoved(a.slice(1)));
      assert.ok(t.length > 1500, `${a}: tom side`);
      assert.doesNotMatch(t, /[—–]/u, `${a}: tankestrek`);
      assert.doesNotMatch(t, /\p{Extended_Pictographic}/u, `${a}: emoji`);
      assert.doesNotMatch(t, /\b(?:Ingredienser|Ingredienser:|Gör så här|Fremgangsmåde|Ingredients:|Directions|Instructions)\b/u, `${a}: ser ut som en oppskrift`);
      if (mk === 'da') assert.doesNotMatch(t, /\bnok\b/iu, `${a}: «nok» leses som NOK av locale-testen`);
    }
  });

  test(`${mk}: hver underside har samlesiden, spiskammer-appen og appkort, og er lenket fra samlesiden`, () => {
    const hub = side(`${SPRAKMAPPE[mk]}${c.rot}`);
    for (const a of adresser) {
      const html = side(a.slice(1));
      assert.match(html, new RegExp(`href="/${SPRAKMAPPE[mk]}${c.rot}"`, 'u'), `${a}: lenke til samlesiden`);
      assert.match(html, /href="\/(?:sv\/skafferi-app|da\/spisekammer-app|en\/pantry-app)\/"/u, `${a}: lenke til spiskammeret`);
      assert.ok((html.match(/class="i-appen i-/gu) ?? []).length >= 1, `${a}: appkort`);
      assert.ok(hub.includes(`href="${a}"`), `${a}: ikke lenket fra samlesiden`);
    }
  });

  test(`${mk}: «se også»-lenkene til holdbarhet og frysing peker på sider som finnes`, () => {
    let antall = 0;
    for (const a of adresser) {
      for (const [, href] of hoved(a.slice(1)).matchAll(new RegExp(`href="((?:${c.hallbarhet}|${c.frysing})[^"]+)"`, 'gu'))) {
        antall += 1;
        assert.ok(existsSync(join(ROT, href.slice(1), 'index.html')), `${a}: ${href} finnes ikke`);
      }
    }
    assert.ok(antall >= c.slugs.length, `bare ${antall} lenker`);
  });

  test(`${mk}: samme rad-id som norsk gir hreflang begge veier, og samlesiden har alle fire språk`, () => {
    const nb = new Set(les('rester', 'nb').rader.map((r) => r.id));
    const felles = d().rader.filter((r) => nb.has(r.id));
    assert.ok(felles.length >= 8, `bare ${felles.length} felles varer med norsk`);
    for (const r of felles) {
      const hos = side(`${SPRAKMAPPE[mk]}${c.rot}${r.slug}`);
      const norsk = les('rester', 'nb').rader.find((x) => x.id === r.id).slug;
      assert.match(hos, new RegExp(`hreflang="nb-NO" href="https://matlyst-app\\.no/hva-kan-jeg-lage/${norsk}/"`, 'u'), `${r.id}: hreflang til norsk`);
      assert.match(side(`hva-kan-jeg-lage/${norsk}`), new RegExp(`hreflang="${c.hreflang}" href="https://matlyst-app\\.no/${SPRAKMAPPE[mk]}${c.rot}${r.slug}/"`, 'u'), `${r.id}: norsk peker tilbake`);
    }
    const hub = side(`${SPRAKMAPPE[mk]}${c.rot}`);
    for (const h of ['nb-NO', 'sv-SE', 'da-DK', 'en']) assert.match(hub, new RegExp(`hreflang="${h}"`, 'u'), h);
  });

  test(`${mk}: samlesiden har beholdt den gamle sidens spørsmål og forbeholdet om at forslagene er veiledende`, () => {
    const hub = hoved(`${SPRAKMAPPE[mk]}${c.rot}`);
    const t = tekstAv(hub);
    const forventet = { sv: ['Skapar sökningen nya recept?', 'Förslagen är ett hjälpmedel'], da: ['Laver søgningen nye opskrifter?', 'Forslagene er kun vejledende'], en: ['Does ingredient search create new recipes?', 'Suggestions are a guide'] }[mk];
    for (const s of forventet) assert.ok(t.includes(s), `mangler «${s}»`);
  });
}
