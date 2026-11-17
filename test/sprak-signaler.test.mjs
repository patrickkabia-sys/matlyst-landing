import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { kodeFor, settInn, KODER } from '../scripts/sprak-signaler.mjs';

const side = (lang, ekstra = '') => `<!DOCTYPE html>\n<html lang="${lang}">\n<head>\n<meta charset="UTF-8">\n<title>x</title>${ekstra}\n</head>\n<body></body>\n</html>\n`;

test('kodeFor: språk til landkode', () => {
  assert.equal(kodeFor(side('no')), 'nb-NO');
  assert.equal(kodeFor(side('nb')), 'nb-NO');
  assert.equal(kodeFor(side('sv')), 'sv-SE');
  assert.equal(kodeFor(side('da')), 'da-DK');
  assert.equal(kodeFor(side('en')), 'en-US');
  assert.equal(kodeFor(side('fr')), null);
  assert.equal(kodeFor('<p>ingen html-tagg</p>'), null);
});

test('settInn: legger taggen rett etter charset, og er idempotent', () => {
  const ny = settInn(side('en'));
  assert.match(ny, /<meta charset="UTF-8">\n<meta http-equiv="content-language" content="en-US">\n<title>/u);
  assert.equal(settInn(ny), ny);
  assert.equal((ny.match(/content-language/gu) ?? []).length, 1);
});

test('settInn: rett en feil eksisterende verdi, uten å doble taggen', () => {
  const feil = side('sv', '\n<meta http-equiv="content-language" content="no">');
  const ny = settInn(feil);
  assert.match(ny, /content="sv-SE"/u);
  assert.equal((ny.match(/content-language/gu) ?? []).length, 1);
});

test('settInn: rører ikke sider uten kjent språk, og aldri <html lang>', () => {
  const fransk = side('fr');
  assert.equal(settInn(fransk), fransk);
  assert.match(settInn(side('no')), /<html lang="no">/u);
});

test('settInn: sider med noindex rører vi ikke', () => {
  const stotte = side('no', '\n<meta name="robots" content="noindex, nofollow">');
  assert.equal(settInn(stotte), stotte);
});

test('settInn: sider uten charset får taggen rett etter <head>', () => {
  const html = '<html lang="da">\n<head>\n<title>x</title>\n</head>\n</html>';
  assert.match(settInn(html), /<head>\n<meta http-equiv="content-language" content="da-DK">/u);
});

// Låser at ingen side i sitemapene mangler taggen eller har feil land. En generator som skriver en
// side på nytt uten den gjør denne rød; kjør da node scripts/sprak-signaler.mjs.
const SITEMAPER = ['sitemap.xml', 'sitemap-sv.xml', 'sitemap-da.xml', 'sitemap-en.xml'];
for (const navn of SITEMAPER) {
  const urler = [...readFileSync(new URL(`../${navn}`, import.meta.url), 'utf8').matchAll(/<loc>https:\/\/matlyst-app\.no([^<]+)<\/loc>/gu)].map((m) => m[1]);
  test(`${navn}: alle sider har riktig content-language`, () => {
    assert.ok(urler.length > 10, `bare ${urler.length} URL-er`);
    for (const sti of urler) {
      const fil = new URL(`..${sti.endsWith('/') ? `${sti}index.html` : sti.endsWith('.html') ? sti : `${sti}.html`}`, import.meta.url);
      let html;
      try {
        html = readFileSync(fil, 'utf8');
      } catch {
        continue; // sider uten egen fil (omdirigeringer) hoppes over
      }
      const forventet = kodeFor(html);
      if (!forventet) continue;
      assert.match(html, new RegExp(`<meta http-equiv="content-language" content="${forventet}">`, 'u'), `${sti} mangler content-language ${forventet}`);
    }
  });
}

test('KODER dekker alle språkene vi publiserer', () => {
  assert.deepEqual(Object.values(KODER).sort(), ['da-DK', 'en-US', 'nb-NO', 'nb-NO', 'sv-SE']);
});
