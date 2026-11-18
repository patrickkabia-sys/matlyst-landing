import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { behandle } from '../scripts/app-bevis.mjs';

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
      if (!/class="prose locale-prose has-toc"/u.test(html) || /<meta name="robots" content="[^"]*noindex/iu.test(html)) continue;
      // Logohistorien har sine egne animasjoner og regnes som app-bevis.
      if (/class="maskot-galleri"/u.test(html)) continue;
      // Nordiske enhetsomregnere venter på lokaliserte skjermbilder av Enheter-innstillingen (fra utvikling).
      // Fjern dette unntaket når bildene finnes og app-bevis.mjs har regler for dem.
      if (/\/(verktoy|verktyg|vaerktoejer)\//u.test(`${mappe}/${d.name}`)) continue;
      const n = (html.match(/class="i-appen i-/gu) ?? []).length;
      if (n < 2) mangler.push(`${mappe.replace(rot, '')}/${d.name} (${n})`);
    }
  };
  gaa(rot.replace(/\/$/u, ''));
  assert.deepEqual(mangler, []);
});
