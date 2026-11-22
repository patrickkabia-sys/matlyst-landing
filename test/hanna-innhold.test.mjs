// /hanna/ gjenbruker stjernene, importfilmen og kildebåndet fra forsiden på samme språk. Blokkene skal være identiske med forsidens.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { HANNA_SIDER, importfilmCss, importfilmJs } from '../scripts/hanna-innhold.mjs';
import { forside } from '../scripts/forside.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const les = (sti) => readFileSync(rot + sti, 'utf8');
const FORSIDE = { nb: 'index.html', sv: 'sv/index.html', da: 'da/index.html', en: 'en/index.html' };

const blokk = (html, navn) => {
  const a = html.indexOf(`<!-- hanna:${navn} -->`), b = html.indexOf(`<!-- /hanna:${navn} -->`);
  assert.ok(a > -1 && b > a, `markør for ${navn}`);
  return html.slice(a + `<!-- hanna:${navn} -->`.length, b);
};
const fraForsiden = {
  bevis: (h) => h.match(/<div class="bevis">[\s\S]*?<\/span><\/div>/u)?.[0],
  film: (h) => h.match(/<div class="spiller importflyt">[\s\S]*?<\/video>\s*<\/div>\s*<\/div>/u)?.[0],
  kilder: (h) => h.match(/<div class="kilder">[\s\S]*?<\/ul><\/div><\/div><\/div>/u)?.[0],
};

for (const [sprak, mappe] of Object.entries(HANNA_SIDER)) {
  test(`/${mappe}/: stjerner, film og kildebånd er identiske med forsidens (${sprak})`, () => {
    const hanna = les(`${mappe}/index.html`), front = les(FORSIDE[sprak]);
    assert.equal(front, forside(sprak), 'forsiden er ferdig bygd');
    for (const navn of ['bevis', 'film', 'kilder']) {
      const ventet = fraForsiden[navn](front);
      assert.ok(ventet && ventet.length > 100, `fant ${navn} på forsiden`);
      assert.equal(blokk(hanna, navn), ventet, navn);
    }
    assert.match(blokk(hanna, 'bevis'), /<b>5,0<\/b>|<b>5\.0<\/b>/u);
    assert.match(blokk(hanna, 'film'), new RegExp(`import-${sprak}\\.mp4`, 'u'));
  });

  test(`/${mappe}/: rekkefølge, kode, noindex, samtykke og videresending står (${sprak})`, () => {
    const h = les(`${mappe}/index.html`);
    const pos = (s) => { const i = h.indexOf(s); assert.ok(i > -1, s); return i; };
    assert.ok(pos('<!-- hanna:bevis -->') < pos('class="kode"'), 'stjernene over kodeboksen');
    assert.ok(pos('class="kode"') < pos('class="stores"'));
    assert.ok(pos('class="stores"') < pos('<!-- hanna:film -->'), 'filmen etter butikk-knappene');
    assert.ok(pos('<!-- hanna:film -->') < pos('<!-- hanna:kilder -->'), 'båndet under filmen');
    assert.ok(pos('<!-- hanna:kilder -->') < pos('class="slik"'), 'før bruksanvisningen');
    assert.match(h, /<meta name="robots" content="noindex">/u);
    assert.match(h, /location\.replace\(mal \+ location\.hash\)/u);
    assert.match(h, /data-consent-withdraw/u);
    assert.match(h, /href="\/importfilm\.css"/u);
    assert.match(h, /src="\/importfilm\.js" defer/u);
    assert.ok(h.includes('HHMAD14') && !/HANNA14/u.test(h));
  });
}

test('importfilm.css og importfilm.js er utdrag av forsidens filer, og har ingen måling', () => {
  assert.equal(les('importfilm.css'), importfilmCss(les('forside.css')));
  assert.equal(les('importfilm.js'), importfilmJs(les('forside.js')));
  const js = les('importfilm.js');
  assert.match(js, /prefers-reduced-motion: reduce/u);
  assert.match(js, /video\.play\(\)/u);
  assert.doesNotMatch(js, /posthog|capture\(|localStorage/u);
  assert.match(les('importfilm.css'), /@keyframes band/u);
  assert.match(les('importfilm.css'), /prefers-reduced-motion:reduce/u);
});

test('kampanjesidene står ikke i sitemap eller llms.txt', () => {
  const kart = ['sitemap.xml', 'sitemap-sv.xml', 'sitemap-da.xml', 'sitemap-en.xml', 'sitemap-index.xml', 'llms.txt'].map(les).join('\n');
  assert.doesNotMatch(kart, /\/hanna\//u);
});
