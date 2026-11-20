import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { avkod, byggLlms, lagLlms } from '../scripts/llms.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const llms = readFileSync(join(rot, 'llms.txt'), 'utf8');
const lenker = [...llms.matchAll(/^- \[([^\]]+)\]\(https:\/\/matlyst-app\.no([^)]*)\): (.+)$/gmu)];

function filForSti(sti) {
  if (sti === '/') return 'index.html';
  return sti.endsWith('/') ? `${sti.slice(1)}index.html` : sti.slice(1);
}

test('llms.txt er lik det byggekjeden skriver (ingen håndredigering)', () => {
  assert.equal(llms, lagLlms(rot));
});

test('alle lenker peker på sider som finnes, uten noindex, og har tittel og beskrivelse', () => {
  assert.ok(lenker.length > 100);
  for (const [, tittel, sti, beskrivelse] of lenker) {
    const fil = join(rot, filForSti(sti));
    assert.ok(existsSync(fil), `mangler side for ${sti}`);
    assert.ok(!/<meta name="robots" content="[^"]*noindex/u.test(readFileSync(fil, 'utf8')), `${sti} er noindex`);
    assert.ok(tittel.length > 3 && beskrivelse.length > 10, sti);
  }
  const unike = new Set(lenker.map((l) => l[2]));
  assert.equal(unike.size, lenker.length, 'duplikatlenker');
});

test('alle fire språk er med, med blogg, verktøyoversikt og personvern', () => {
  for (const [pref, hub, blogg] of [['', '/verktoy/enhetsomregner/', '/blogg/'], ['/sv', '/sv/verktyg/enhetsomvandlare/', '/sv/blogg/'], ['/da', '/da/vaerktoejer/enhedsomregner/', '/da/blog/'], ['/en', '/en/tools/unit-converter/', '/en/blog/']]) {
    const stier = lenker.map((l) => l[2]);
    assert.ok(stier.includes(pref ? `${pref}/` : '/'), `forside ${pref}`);
    assert.ok(stier.includes(hub), hub);
    assert.ok(stier.some((s) => s.startsWith(blogg) && s !== blogg), `blogg ${blogg}`);
    assert.ok(stier.includes(blogg), blogg);
  }
  for (const h of ['## Norsk', '## Dansk', '## Svenska', '## English']) assert.ok(llms.includes(`\n${h}\n`), h);
});

test('formatet: H1 først, blockquote, så bare H2-seksjoner', () => {
  const rader = llms.split('\n');
  assert.equal(rader[0], '# Matlyst');
  assert.ok(rader.some((r) => r.startsWith('> ')));
  assert.ok(!rader.some((r) => /^#{3,}\s/u.test(r)));
  assert.equal(rader.filter((r) => r.startsWith('# ')).length, 1);
});

test('byggLlms utelater noindex-sider og sider uten beskrivelse', () => {
  const tekst = JSON.parse(readFileSync(join(rot, 'scripts/llms-tekst.json'), 'utf8'));
  const sider = [
    { sti: '/', sprak: 'nb', type: 'forside', tittel: 'Forside', beskrivelse: 'Hjem', noindex: false },
    { sti: '/skjult/', sprak: 'nb', type: 'guide-kort', tittel: 'Skjult', beskrivelse: 'x', noindex: true },
    { sti: '/uten/', sprak: 'nb', type: 'guide-kort', tittel: 'Uten', beskrivelse: undefined, noindex: false },
  ];
  const ut = byggLlms(sider, tekst);
  assert.ok(ut.includes('(https://matlyst-app.no/)'));
  assert.ok(!ut.includes('/skjult/') && !ut.includes('/uten/'));
});

test('HTML-entiteter avkodes', () => {
  assert.equal(avkod('Tom &amp; Jerry&#39;s &quot;mat&quot;'), 'Tom & Jerry\'s "mat"');
});

test('samlesiden til hver registrerte familie er med i llms.txt, men ikke hver vareside', async () => {
  const { FAMILIER, SPRAKMAPPE } = await import('../scripts/familier/register.mjs');
  const stier = lenker.map((l) => l[2]);
  assert.ok(FAMILIER.length > 0, 'registeret har en familie');
  for (const f of FAMILIER) {
    for (const [marked, { rot: familierot }] of Object.entries(f.markeder)) {
      const nav = `/${SPRAKMAPPE[marked]}${familierot}`;
      assert.ok(stier.includes(nav), `llms.txt mangler samlesiden ${nav}`);
      assert.deepEqual(stier.filter((s) => s.startsWith(nav) && s !== nav), [], `llms.txt skal ikke ha enkeltsidene under ${nav}`);
    }
  }
});

test('byggLlms tar med samlesiden til en familie under verktøy, og hopper over enkeltsidene og noindex', () => {
  const tekst = JSON.parse(readFileSync(join(rot, 'scripts/llms-tekst.json'), 'utf8'));
  const familier = [{ id: 'prove', sidetype: 'omregner', markeder: { nb: { rot: 'verktoy/prove/' } } }];
  const side = (sti, tittel, noindex = false) => ({ sti, sprak: 'nb', type: 'omregner', tittel, beskrivelse: `Beskrivelse av ${tittel}`, noindex });
  const ut = byggLlms([side('/verktoy/prove/', 'Prøve'), side('/verktoy/prove/mel/', 'Prøvemel'), side('/verktoy/prove2/', 'Annet')], tekst, familier);
  assert.ok(ut.includes('(https://matlyst-app.no/verktoy/prove/)'));
  assert.ok(!ut.includes('/verktoy/prove/mel/') && !ut.includes('/verktoy/prove2/'));
  const skjult = byggLlms([side('/verktoy/prove/', 'Prøve', true)], tekst, familier);
  assert.ok(!skjult.includes('/verktoy/prove/'));
});
