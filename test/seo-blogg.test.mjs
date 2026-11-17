import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import test from 'node:test';

import {
  autoArtikkelMain,
  autoArtikkelSchema,
  autoArtikler,
  bloggGrupper,
  indeksMain,
} from '../scripts/blogg.mjs';

const repoRot = new URL('../', import.meta.url);
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
  cpSync(new URL('../', import.meta.url), generertRot, {
    recursive: true,
    filter: (kilde) => !['.git', '.superpowers', 'node_modules'].includes(kilde.split('/').at(-1)),
  });
  skrivFixture(generertRot, true);
  execFileSync(process.execPath, ['scripts/generer-norske-importguider.mjs'], { cwd: generertRot });
  execFileSync(process.execPath, ['scripts/generer-lokalsider.mjs'], { cwd: generertRot });
  return generertRot;
}

test.after(() => {
  rmSync(midlertidigRot, { recursive: true, force: true });
  if (generertRot) rmSync(generertRot, { recursive: true, force: true });
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

  assert.doesNotMatch(html, /Matprat|Godt\.no|\bNom\b/iu);
});
