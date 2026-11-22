import { krevGuidemeny } from './hjelp/guidemeny.mjs';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const rot = fileURLToPath(new URL('..', import.meta.url));
import { SITEMAPER, UTELATT, MONSTER, filFor, guider, settInn } from '../scripts/guidelenker.mjs';
import { hylledel, morkBunn } from '../scripts/skall.mjs';

const VIA_HUB = {
  // Landleys Kök nås gjennom importhubbens kuraterte relatert-blokk.
  '/importer-fra-landleys-kok/': '/importer-oppskrifter/',
  // Alletiders Kogebog nås gjennom importhubbens kuraterte relatert-blokk.
  '/importer-fra-alletiders-kokebok/': '/importer-oppskrifter/',
  // DR Mad nås gjennom importhubbens kuraterte relatert-blokk.
  '/importer-fra-dr-mat/': '/importer-oppskrifter/',
  // Julemiddagsplanen, julebordet og nyttårsmiddagen står i «Alle guider» i bunnen og nås gjennom relatert-blokken på ukemenyen (lenkekartet, nøkkelen nb). Om-siden har egen lenke i hyllen Matlyst.
  '/julemiddag/': '/ukemeny/',
  // Sammenligningssidene står i «Alle guider» i bunnen og nås gjennom relatert-blokken på oppskriftsappen (lenkekartet, nb-gruppen sammenligning).
  '/beste-oppskriftsapp/': '/oppskriftsbok-app/',
  '/beste-handleliste-app/': '/oppskriftsbok-app/',
  '/beste-ukemeny-app/': '/oppskriftsbok-app/',
  '/julebord/': '/ukemeny/',
  '/nyttarsmiddag/': '/ukemeny/',
  // Mealime-siden nås gjennom Paprika-siden (lenkekartet, nb-gruppen flytting).
  '/mealime-alternativ/': '/bytt-fra-paprika/',
};

// Forsidene på sv, da og en når kildeguidene gjennom importhubben på sitt språk, som på norsk.
const importHub = (hub, guider) => Object.fromEntries(guider.map((sti) => [sti, hub]));
const VIA_HUB_FORSIDE = {
  '/': VIA_HUB,
  // Sammenligningssidene nås gjennom relatert-blokken på receptappen/opskriftsappen (lenkekartet, en-gruppen sammenligning via sidegruppene).
  '/sv/': { ...importHub('/sv/importera-recept/', ['/sv/alletiders-kogebog/', '/sv/dr-mad/', '/sv/matprat/']), ...importHub('/sv/receptbok-app/', ['/sv/basta-receptapp/', '/sv/basta-inkopslista-app/', '/sv/basta-veckomeny-app/']),
    // Julbordet och nyårsmiddagen står i «Alla guider» i bunnen och nås genom relaterat-blocket på veckomenyn (lenkekartet, nyckeln sv).
    ...importHub('/sv/veckomeny-app/', ['/sv/julbord/', '/sv/nyarsmiddag/']),
    // Mealime-sidan nås genom Paprika-sidan (lenkekartet, sv-gruppen flytting).
    '/sv/mealime-alternativ/': '/sv/byt-fran-paprika/' },
  // Julefrokosten og juleaften står i «Alle guider» i bunnen og nås gjennom relatert-blokken på madplan-appen (lenkekartet, da-gruppen hoytid).
  '/da/': { ...importHub('/da/importer-opskrifter/', ['/da/koket/', '/da/landleys-kok/', '/da/matprat/']), ...importHub('/da/opskrifts-app/', ['/da/bedste-opskriftsapp/', '/da/bedste-indkoebsliste-app/', '/da/bedste-madplan-app/']), ...importHub('/da/madplan-app/', ['/da/julefrokost/', '/da/juleaften/']),
    // Mealime-siden nås gennem Paprika-siden (lenkekartet, da-gruppen flytting).
    '/da/mealime-alternativ/': '/da/skift-fra-paprika/' },
  // Mealime-siden står i «All guides» i bunnen, men ikke i hovedhyllene: den nås gjennom Paprika-siden (lenkekartet, gruppen flytting).
  '/en/': { ...importHub('/en/import-recipes/', ['/en/alletiders-cookbook/', '/en/dr-food/', '/en/koket/', '/en/landleys-kok/', '/en/matprat/']), '/en/mealime-alternative/': '/en/import-recipes-from-paprika/',
    // Sammenligningssidene står i «All guides» i bunnen og nås gjennom relatert-blokken på oppskriftsappen (lenkekartet, en-gruppen sammenligning).
    '/en/best-recipe-app/': '/en/recipe-book-app/', '/en/best-grocery-list-app/': '/en/recipe-book-app/', '/en/best-meal-planning-app/': '/en/recipe-book-app/' },
};

// Låser at ingen guide er foreldreløs: hver side i en sitemap med bunntekst skal
// lenke til guidene på sitt språk. Rotsiden bruker det nye sideskallet og kan
// også lenke gjennom en hub. Andre sider beholder den felles guideblokken.
for (const lang of Object.keys(SITEMAPER)) {
  const liste = guider(lang);

  test(`${lang}: guidelista har innhold og ingen juridiske sider`, () => {
    assert.ok(liste.length >= 15, `bare ${liste.length} guider`);
    for (const { sti, tekst } of liste) {
      assert.ok(!UTELATT.has(sti), sti);
      assert.ok(tekst.length > 0, `tom lenketekst for ${sti}`);
      assert.doesNotMatch(tekst, /[—–]/u, `tankestrek i lenketeksten for ${sti}`);
    }
  });

  const sider = [...readFileSync(new URL(`../${SITEMAPER[lang]}`, import.meta.url), 'utf8')
    .matchAll(/<loc>https:\/\/matlyst-app\.no([^<]+)<\/loc>/gu)].map((m) => m[1]);

  test(`${lang}: hver side lenker til alle guidene på sitt språk`, () => {
    for (const side of sider) {
      const html = readFileSync(filFor(side), 'utf8');
      if (!html.includes('</footer>')) continue;
      // Det nye sideskallet lenker til guider direkte eller gjennom en synlig hub.
      // Ingen guide får forsvinne fra navigasjonen når den gamle lenkelista fjernes.
      if (['/', '/sv/', '/da/', '/en/'].includes(side)) {
        krevGuidemeny(html, liste, VIA_HUB_FORSIDE[side], (sti) => readFileSync(filFor(sti), 'utf8'));
        continue;
      }
      const blokk = html.match(MONSTER)?.[0];
      assert.ok(blokk, `${side} mangler guideblokken`);
      for (const { sti } of liste) {
        assert.ok(blokk.includes(`href="${sti}"`), `${side} lenker ikke til ${sti}`);
      }
    }
  });
}

test('bunnteksten lenker ikke til enkeltsider under en hub (ingen lenkefarm)', () => {
  for (const lang of Object.keys(SITEMAPER)) {
    const liste = guider(lang);
    assert.ok(liste.length <= 40, `${lang}: ${liste.length} lenker i bunnteksten`);
    assert.ok(!liste.some(({ sti }) => /\/(tools|verktoy|verktyg|vaerktoejer)\/[a-z-]+-(to|til|till)-/u.test(sti)), `${lang}: omregner i bunnteksten`);
  }
  assert.ok(guider('en').some(({ sti }) => sti === '/en/tools/unit-converter/'), 'huben skal stå i bunnteksten');
  assert.ok(guider('en').some(({ sti }) => sti === '/en/holidays/'), 'høytidshuben skal stå i bunnteksten');
});

test('guidelenkegeneratoren lar forsidene stå urørt', () => {
  for (const [fil, sti] of [['index.html', '/'], ['sv/index.html', '/sv/'], ['da/index.html', '/da/'], ['en/index.html', '/en/']]) {
    const html = readFileSync(join(rot, fil), 'utf8');
    assert.equal(settInn(html, '<p>Uønsket guideblokk</p>', sti), html, sti);
  }
});

test('settInn bruker plassen i hylledelen når blokka mangler, og er idempotent', () => {
  const html = `${hylledel('nb')}<footer></footer>`;
  const ny = '<!-- guider:bunn --><div class="f-guider">x</div><!-- /guider:bunn -->';
  const ut = settInn(html, ny);
  assert.ok(ut.indexOf(ny) > ut.indexOf('<summary>') && ut.indexOf(ny) < ut.indexOf('</details>'));
  assert.equal(settInn(ut, ny), ut);
  assert.ok(!ut.includes('<!-- guider:plass -->'));
  assert.ok(!ut.includes('</footer>') || ut.indexOf(ny) < ut.indexOf('<footer>'), 'blokka står ikke i bunnteksten');
});

test('settInn faller tilbake til bunnteksten uten plass, og tåler $ i blokka', () => {
  const ny = '<!-- guider:bunn --><a>$& $1</a><!-- /guider:bunn -->';
  assert.ok(settInn('<footer></footer>', ny).includes(ny));
});

test('settInn erstatter en eksisterende guideblokk med nytt innhold, og plassen ligger i hylledelen før .bunnrad', () => {
  const gammel = '<!-- guider:bunn --><div class="f-guider">gammel</div><!-- /guider:bunn -->';
  const ny = '<!-- guider:bunn --><div class="f-guider">ny</div><!-- /guider:bunn -->';
  const side = (guider) => hylledel('nb', { guider }) + morkBunn('nb', {});
  const ut = settInn(side(gammel), ny);
  assert.equal(ut, side(ny));
  assert.ok(!ut.includes('gammel'));
  assert.equal(ut.split('<!-- guider:bunn -->').length - 1, 1, 'nøyaktig én blokk');
  // Fra plassmerket: blokka står i hylledelen, før .bunnrad, og aldri etter bunnteksten.
  const fraPlass = settInn(side(''), ny);
  assert.ok(fraPlass.indexOf('<section class="bunn"') < fraPlass.indexOf(ny));
  assert.ok(fraPlass.indexOf(ny) < fraPlass.indexOf('<div class="bunnrad">'));
  assert.ok(fraPlass.indexOf(ny) < fraPlass.indexOf('<footer'));
  assert.ok(fraPlass.indexOf(ny) < fraPlass.indexOf('</section>'));
});

test('settInn uten plassmerke: blokka står i hylledelen foran .bunnrad, ikke i eller etter bunnteksten', () => {
  const ny = '<!-- guider:bunn --><div class="f-guider">ny</div><!-- /guider:bunn -->';
  const utenPlass = (hylledel('nb') + morkBunn('nb', {})).replace('<!-- guider:plass -->', '');
  assert.ok(!utenPlass.includes('guider:plass'));
  const ut = settInn(utenPlass, ny);
  assert.equal(ut.split(ny).length - 1, 1);
  const pos = (m) => { const i = ut.indexOf(m); assert.ok(i > -1, m); return i; };
  assert.ok(pos('<section class="bunn"') < pos(ny));
  assert.ok(pos(ny) < pos('<div class="bunnrad">'));
  assert.ok(pos(ny) < pos('</section>'));
  assert.ok(pos(ny) < pos('<footer'));
  assert.equal(settInn(ut, ny), ut, 'idempotent');
});

test('enkeltsidene og samlesiden til en datadrevet familie står ikke i bunnlista (samlesiden har egen lenke i hyllen)', async () => {
  const { FAMILIER, SPRAKMAPPE } = await import('../scripts/familier/register.mjs');
  assert.ok(FAMILIER.length > 0);
  for (const f of FAMILIER) {
    for (const [marked, { rot }] of Object.entries(f.markeder)) {
      const under = guider(marked).map((g) => g.sti).filter((sti) => sti.startsWith(`/${SPRAKMAPPE[marked]}${rot}`));
      assert.deepEqual(under, [], `${f.id}/${marked}`);
    }
  }
});
