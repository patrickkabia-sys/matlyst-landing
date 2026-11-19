import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { kopier } from '../scripts/kjedeproeve.mjs';
import { rendre, trekkUt } from '../scripts/skall-paa.mjs';
import { alleSider, erUtrullet } from '../scripts/sidetyper.mjs';

import {
  autoArtikkelMain,
  autoArtikkelSchema,
  autoArtikler,
  bloggGrupper,
  indeksMain,
} from '../scripts/blogg.mjs';

const repoRot = fileURLToPath(new URL('..', import.meta.url));
const midlertidigRot = mkdtempSync(join(tmpdir(), 'matlyst-seo-blogg-'));
const fixture = {
  sprak: 'nb',
  emne_id: 'ris-i-airfryer-nb',
  slug: 'ris-script',
  tittel: 'Ris <script>x</script>',
  meta: 'Slik lager du en liten porsjon ris i airfryer med en enkel metode, tydelige steg og praktiske svar på vanlige spørsmål underveis.',
  ingress: 'Fordel risen jevnt og følg med underveis.',
  seksjoner: [
    { type: 'avsnitt', overskrift: 'Før du begynner', tekst: 'Les hele fremgangsmåten først.' },
    { type: 'tabell', overskrift: 'Kort oversikt', rader: [['Mengde', 'Liten porsjon'], ['Kontroll', 'Følg med']] },
    { type: 'liste', overskrift: 'Slik gjør du', punkter: ['Fordel jevnt', 'Sjekk underveis'] },
  ],
  faq: [
    { sporsmal: 'Kan kurven være full?', svar: 'Nei, fordel innholdet i et jevnt lag.' },
    { sporsmal: 'Må jeg følge med?', svar: 'Ja, modeller kan arbeide forskjellig.' },
    { sporsmal: 'Kan jeg gjenta metoden?', svar: 'Ja, noter det som fungerer hjemme.' },
  ],
  kilder: [
    { id: 'K1', url: 'https://www.mattilsynet.no/mat-og-drikke', tekst: 'Offentlig veiledning.' },
  ],
  pastander: [{ tekst: 'Følg offentlig veiledning.', kilde_id: 'K1' }],
  lenker: [{ sti: '/ukemeny/', tittel: 'Planlegg ukas middager' }],
  lesOgså: [{ sti: '/blogg/koketider/', tittel: 'Koketider' }],
  appkobling: 'kokemodus',
  tagger: ['airfryer'],
  publisert: '2026-11-12',
};

function skrivFixture(rot, alleSprak = false) {
  const sprak = alleSprak ? ['nb', 'sv', 'da', 'en'] : ['nb'];
  for (const lang of sprak) {
    const artikkel = lang === 'nb' ? fixture : {
      ...fixture,
      sprak: lang,
      emne_id: `${fixture.emne_id}-${lang}`,
      slug: `${fixture.slug}-${lang}`,
      tittel: `Auto ${lang} artikkel`,
    };
    const mappe = join(rot, `blogg-kilde/auto/${lang}`);
    mkdirSync(mappe, { recursive: true });
    writeFileSync(join(mappe, `${artikkel.slug}.json`), `${JSON.stringify(artikkel, null, 2)}\n`);
  }
}

skrivFixture(midlertidigRot);
const injisertRot = pathToFileURL(`${midlertidigRot}/`);
const [auto] = autoArtikler('nb', injisertRot);
let generertRot;

function byggMidlertidigNettsted() {
  if (generertRot) return generertRot;
  generertRot = mkdtempSync(join(tmpdir(), 'matlyst-seo-nettsted-'));
  kopier(repoRot, generertRot);
  skrivFixture(generertRot, true);
  // Lokal utrulling bare i kopien: repoets UTRULLET røres ikke. Da må generatorkjeden
  // faktisk legge skallet på de nygenererte omregnersidene.
  const sidetyper = join(generertRot, 'scripts/sidetyper.mjs');
  const kilde = readFileSync(sidetyper, 'utf8');
  const lokal = kilde.replace('export const UTRULLET = new Set();', "export const UTRULLET = new Set(['omregner']);");
  assert.notEqual(lokal, kilde, 'fant ikke UTRULLET i kopien');
  writeFileSync(sidetyper, lokal);
  execFileSync(process.execPath, ['scripts/generer-norske-importguider.mjs'], { cwd: generertRot });
  execFileSync(process.execPath, ['scripts/generer-lokalsider.mjs'], { cwd: generertRot });
  for (const skript of ['guidelenker', 'lenker-sett', 'skall-paa', 'app-uttrykk', 'app-bevis', 'bilde-attributter', 'sprak-signaler']) {
    execFileSync(process.execPath, [`scripts/${skript}.mjs`], { cwd: generertRot });
  }
  return generertRot;
}

test.after(() => {
  rmSync(midlertidigRot, { recursive: true, force: true });
  if (generertRot) rmSync(generertRot, { recursive: true, force: true });
});

test('lokalsidegeneratoren lar index.html for rotsiden stå byte for byte urørt', () => {
  const foer = readFileSync(join(repoRot, 'index.html'), 'utf8');
  const etter = readFileSync(join(byggMidlertidigNettsted(), 'index.html'), 'utf8');
  assert.ok(etter === foer, 'lokalsidegeneratoren skal ikke sette guideblokken inn på /');
});

test('auto-artikkel får h1, seksjoner, faq og kilder', () => {
  const html = autoArtikkelMain(auto, '<button>Last ned</button>');

  assert.match(html, /<h1[^>]*>Ris &lt;script&gt;x&lt;\/script&gt;<\/h1>/u);
  assert.match(html, /<h2>Før du begynner<\/h2><p>Les hele fremgangsmåten først\.<\/p>/u);
  assert.match(html, /<table class="blogg-tabell">/u);
  assert.match(html, /<ul><li>Fordel jevnt<\/li><li>Sjekk underveis<\/li><\/ul>/u);
  assert.match(html, /<section class="faq">[\s\S]*Kan kurven være full\?/u);
  assert.match(html, /<ol class="blogg-kilder">[\s\S]*K1/u);
});

test('auto-artikkel escaper HTML i modellfelt', () => {
  const html = autoArtikkelMain(auto, '<button>Last ned</button>');

  assert.doesNotMatch(html, /<script>x<\/script>/u);
  assert.match(html, /Ris &lt;script&gt;x&lt;\/script&gt;/u);
});

test('FAQPage-schema har alle spørsmål', () => {
  const schema = autoArtikkelSchema(auto);
  const faq = schema.find((rad) => rad['@type'] === 'FAQPage');

  assert.deepEqual(
    faq.mainEntity.map((rad) => rad.name),
    fixture.faq.map((rad) => rad.sporsmal),
  );
});

test('enspråklig auto-artikkel får ingen hreflang til andre språk', () => {
  const gruppe = bloggGrupper(injisertRot).find(({ id }) => id === `auto-${fixture.emne_id}`);
  assert.deepEqual(gruppe.sider, { nb: `/blogg/${fixture.slug}/` });

  const html = readFileSync(join(byggMidlertidigNettsted(), `blogg/${fixture.slug}/index.html`), 'utf8');
  assert.doesNotMatch(html, /hreflang="(?:sv|da|en)"/u);
});

test('bloggforsiden lenker til auto-artikkelen', () => {
  assert.match(indeksMain('nb', injisertRot), new RegExp(`href="/blogg/${fixture.slug}/"`, 'u'));

  const html = readFileSync(join(byggMidlertidigNettsted(), 'blogg/index.html'), 'utf8');
  assert.match(html, new RegExp(`href="/blogg/${fixture.slug}/"`, 'u'));
});

test('den genererte autoartikkelen og bloggforsiden har hver språkvelger nøyaktig én gang, med ett kommentarpar', () => {
  const rot = byggMidlertidigNettsted();
  for (const fil of [`blogg/${fixture.slug}/index.html`, 'blogg/index.html']) {
    const html = readFileSync(join(rot, fil), 'utf8');
    for (const plass of ['topp', 'bunn']) {
      assert.equal(html.split(`<!-- språkvelger:${plass} -->`).length, 2, `${fil} ${plass} åpner`);
      assert.equal(html.split(`<!-- /språkvelger:${plass} -->`).length, 2, `${fil} ${plass} lukker`);
    }
    assert.equal(html.split('class="language-switcher ').length, 3, `${fil} språkvelgere`);
  }
});

test('sidekartet for språket har auto-artikkelen', () => {
  const rot = byggMidlertidigNettsted();
  const sitemap = readFileSync(join(rot, 'sitemap.xml'), 'utf8');
  const llms = readFileSync(join(rot, 'llms.txt'), 'utf8');

  assert.match(sitemap, new RegExp(`<loc>https://matlyst-app.no/blogg/${fixture.slug}/</loc>`, 'u'));
  assert.match(llms, /## Auto-artikler/u);
  assert.ok(llms.includes(`[Ris <script>x</script>](https://matlyst-app.no/blogg/${fixture.slug}/)`));
});

test('lanseringstestene godtar auto-artikler og deres publiseringsdato', () => {
  const rot = byggMidlertidigNettsted();

  execFileSync(process.execPath, ['--test', 'test/lansering.test.mjs'], { cwd: rot, stdio: 'pipe' });
});

test('auto-artikkel får ikke forbudte merkenavn fra guidebunnteksten', () => {
  const html = readFileSync(join(byggMidlertidigNettsted(), `blogg/${fixture.slug}/index.html`), 'utf8');

  assert.doesNotMatch(trekkUt(html, `/blogg/${fixture.slug}/`).innhold, /Matprat|Godt\.no|\bNom\b/iu);
});

test('den genererte autoartikkelen er det skall-paa lager', (t) => {
  const sti = `/blogg/${fixture.slug}/`;
  const html = readFileSync(join(byggMidlertidigNettsted(), `blogg/${fixture.slug}/index.html`), 'utf8');
  if (!erUtrullet(sti, html)) return t.skip('Blogg er ikke rullet ut ennå');
  assert.equal(html, rendre(html, sti));
});

test('generatorkjeden gir autoartikkelen meny, bilder med mål og språksignal', () => {
  const html = readFileSync(join(byggMidlertidigNettsted(), `blogg/${fixture.slug}/index.html`), 'utf8');
  assert.match(html, /class="(?:nav-meny|topp)"/u);
  assert.match(html, /http-equiv="content-language" content="nb-NO"/u);
  for (const bilde of html.matchAll(/<img[^>]*src="\/images\/(?:appstore-badge\.svg|googleplay-badge-en\.png)"[^>]*>/gu)) {
    assert.match(bilde[0], /width="\d+"/u);
    assert.match(bilde[0], /height="\d+"/u);
  }
});

test('generatorkjeden legger det nye skallet på regenererte omregnersider (og ingen gammel meny)', () => {
  const rot = byggMidlertidigNettsted();
  const sider = alleSider(rot).filter((s) => s.nokkel === 'omregner');
  assert.ok(sider.length > 0, 'L skal ha generert omregnersider');
  for (const s of sider) {
    const html = readFileSync(join(rot, s.fil), 'utf8');
    assert.ok(html.includes('<!-- skall:topp -->'), `${s.sti}: mangler skall:topp`);
    assert.ok(html.includes('<link rel="stylesheet" href="/side.css">'), `${s.sti}: mangler side.css`);
    assert.match(html, /<header class="topp"/u, `${s.sti}: mangler topp()`);
    assert.ok(!html.includes('class="nav-meny"') && !html.includes('class="nav-dl"') && !html.includes('data-app-uttrykk'), `${s.sti}: gammel nav fra app-uttrykk`);
    assert.equal(html, rendre(html, s.sti, new Set(['omregner'])), `${s.sti}: rendre er ikke idempotent`);
  }
});
