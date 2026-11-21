import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { behandle } from '../scripts/app-bevis.mjs';
import { sideForPar } from '../scripts/nb-enhetssider.mjs';

const lang = (l) => `<html lang="${l}"><body><section class="prose locale-prose has-toc"><h2 id="a">How to save a recipe</h2><p>x</p><h2 id="b">Your grocery list</h2><p>y</p></section></body></html>`;

test('lange sider får app-bevis med grunn (billedtekst) og er idempotente', () => {
  for (const l of ['en', 'nb', 'sv', 'da']) {
    const html = l === 'en' ? lang('en') : lang(l).replace('How to save a recipe', { nb: 'Slik lagrer du', sv: 'Så sparar du', da: 'Sådan gemmer du' }[l]).replace('Your grocery list', { nb: 'Handleliste', sv: 'Inköpslista', da: 'Indkøbsliste' }[l]);
    const ut = behandle(html, l, '/x/');
    assert.match(ut, /class="i-appen i-/u, l);
    assert.match(ut, /class="i-appen-tittel"/u, l);
    assert.equal(behandle(ut, l, '/x/'), ut, l);
  }
});

test('sider uten innholdsfortegnelse eller med noindex røres ikke', () => {
  const kort = '<html lang="en"><body><section class="prose locale-prose"><h2 id="a">Import</h2><p>x</p></section></body></html>';
  assert.equal(behandle(kort, 'en', '/x/'), kort);
});

test('hver lang side på de fire språkene har minst to app-bevis', () => {
  const rot = new URL('..', import.meta.url).pathname;
  const mangler = [];
  const gaa = (mappe) => {
    for (const d of readdirSync(mappe, { withFileTypes: true })) {
      if (d.isDirectory()) { if (!['node_modules', '.git', 'test-results', 'playwright-report'].includes(d.name)) gaa(`${mappe}/${d.name}`); continue; }
      if (!d.name.endsWith('.html')) continue;
      const html = readFileSync(`${mappe}/${d.name}`, 'utf8');
      // Sider med enhetskortet (omregnerne etter at de er bygget på nytt) har ingen has-toc, men skal ha app-bevisene.
      if (!(/class="prose locale-prose has-toc"/u.test(html) || /<form class="kalk" data-kalk="enhet"/u.test(html)) || /<meta name="robots" content="[^"]*noindex/iu.test(html)) continue;
      // Logohistorien har sine egne animasjoner og regnes som app-bevis.
      if (/class="maskot-galleri"/u.test(html)) continue;
      const n = (html.match(/class="i-appen i-/gu) ?? []).length;
      if (n < 2) mangler.push(`${mappe.replace(rot, '')}/${d.name} (${n})`);
    }
  };
  gaa(rot.replace(/\/$/u, ''));
  assert.deepEqual(mangler, []);
});

// Omregnerne har kalkulatorkortet i `topp` og ingen has-toc-markør, men skal beholde de samme app-bevisene som de publiserte sidene (avgjørelse 8).
const nøkler = (html) => [...html.matchAll(/class="i-appen i-([a-z]+)"/gu)].map((m) => m[1]);
const omregner = (fra, til) => { const s = sideForPar(fra, til); return `<html lang="nb"><body><header class="locale-page-hero">${s.topp}</header><section class="prose locale-prose">${s.rik}</section></body></html>`; };

test('en omregnerside med enhetskortet får de samme app-bevisene som den publiserte siden', () => {
  const rot = new URL('..', import.meta.url).pathname;
  const publisert = readFileSync(`${rot}verktoy/dl-til-kopp/index.html`, 'utf8');
  const forventet = nøkler(publisert);
  assert.ok(forventet.includes('mapper') && forventet.includes('skalering') && forventet.includes('enheter'), `fasiten har mapper, skalering og enheter: ${forventet}`);
  const side = omregner('dl', 'cups');
  assert.match(side, /data-kalk="enhet"/u);
  assert.doesNotMatch(side, /has-toc/u);
  const ut = behandle(side, 'nb', '/verktoy/dl-til-kopp/');
  assert.deepEqual(nøkler(ut), forventet);
  assert.equal(behandle(ut, 'nb', '/verktoy/dl-til-kopp/'), ut, 'idempotent');
});

test('en familieside med volumvekt-kortet behandles fortsatt ikke', () => {
  const familie = '<html lang="nb"><body><header class="locale-page-hero"><form class="kalk" data-kalk="volumvekt"></form></header><section class="prose locale-prose"><h2 id="a">Slik lagrer du</h2><p>x</p><h2 id="b">Handleliste</h2><p>y</p></section></body></html>';
  assert.equal(behandle(familie, 'nb', '/x/'), familie);
});

// Alle 714 omregnere på de fire språkene beholder nøyaktig de samme app-bevisene som de publiserte sidene (avgjørelse 8): den gamle kalkulatorseksjonen
// er borte fra lesedelen, og kortet står i topp, men blokkene velges fra de samme overskriftene. Fasit: nøklene i de publiserte filene.
test('alle omregnere på nb, sv, da og en får de samme app-bevisene som de publiserte sidene', async () => {
  const rot = new URL('..', import.meta.url).pathname;
  const { enhetsSiderNb } = await import('../scripts/nb-enhetssider.mjs');
  const { enhetsSiderSv } = await import('../scripts/sv-enhetssider.mjs');
  const { enhetsSiderDa } = await import('../scripts/da-enhetssider.mjs');
  const { enhetsSider } = await import('../scripts/en-enhetssider.mjs');
  const { rikeSider } = await import('../scripts/en-rike-sider.mjs');
  const SPRÅK = [['nb', '', enhetsSiderNb], ['sv', 'sv/', enhetsSiderSv], ['da', 'da/', enhetsSiderDa], ['en', 'en/', { ...enhetsSider, 'tools/unit-converter/': rikeSider['tools/unit-converter/'] }]];
  let sjekket = 0;
  const avvik = [];
  // Kjent og forklart avvik: kokemodus-blokken på den engelske samlesiden kom fra ordet «cooking» i den fjernede overskriften «Convert any cooking unit»
  // (kalkulatorseksjonen). Ingen overskrift igjen på siden handler om matlagingsmodus, så blokken faller bort og siden står igjen med mapper-blokken.
  const UNNTAK = { 'en tools/unit-converter/': { publisert: 'kokemodus,mapper', ny: 'mapper' } };
  for (const [lang, prefiks, sider] of SPRÅK) {
    for (const [sti, s] of Object.entries(sider)) {
      const fil = `${rot}${prefiks}${sti}index.html`;
      const publisert = nøkler(readFileSync(fil, 'utf8'));
      const faq = `<section class="faq"><h2>${s.faqTittel}</h2>${s.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</section>`;
      const side = `<html lang="${lang}"><body><header class="locale-page-hero">${s.topp}</header><section class="prose locale-prose">${s.rik}</section>${faq}</body></html>`;
      assert.match(side, /data-kalk="enhet"/u, `${lang} ${sti}`);
      const ny = nøkler(behandle(side, lang, `/${prefiks}${sti}`));
      sjekket++;
      const unntak = UNNTAK[`${lang} ${sti}`];
      if (unntak) { assert.equal(publisert.join(), unntak.publisert); assert.equal(ny.join(), unntak.ny); continue; }
      if (JSON.stringify(ny) !== JSON.stringify(publisert)) avvik.push(`${lang} ${sti}: publisert [${publisert}] ny [${ny}]`);
    }
  }
  assert.equal(sjekket, 714, 'alle 714 omregnere');
  assert.deepEqual(avvik, []);
});
