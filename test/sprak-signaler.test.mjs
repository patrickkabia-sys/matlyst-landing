import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { erNoindex, kodeFor, settInn, KODER } from '../scripts/sprak-signaler.mjs';

const side = (lang, ekstra = '') => `<!DOCTYPE html>\n<html lang="${lang}">\n<head>\n<meta charset="UTF-8">\n<title>x</title>${ekstra}\n</head>\n<body></body>\n</html>\n`;
const antall = (html) => (html.match(/http-equiv=["']?content-language/giu) ?? []).length;

test('kodeFor: språk til landkode', () => {
  assert.equal(kodeFor(side('no')), 'nb-NO');
  assert.equal(kodeFor(side('nb')), 'nb-NO');
  assert.equal(kodeFor(side('sv')), 'sv-SE');
  assert.equal(kodeFor(side('da')), 'da-DK');
  assert.equal(kodeFor(side('en')), 'en-US');
  assert.equal(kodeFor(side('fr')), null);
  assert.equal(kodeFor('<p>ingen html-tagg</p>'), null);
});

test('kodeFor: enkle anførselstegn, store bokstaver og data-lang', () => {
  assert.equal(kodeFor("<html lang='sv'><head></head>"), 'sv-SE');
  assert.equal(kodeFor('<HTML LANG="sv"><HEAD></HEAD>'), 'sv-SE');
  // data-lang er ikke lang, selv om det står etter og har en annen verdi
  assert.equal(kodeFor('<html lang="sv" data-lang="en"><head></head>'), 'sv-SE');
  assert.equal(kodeFor('<html data-lang="en" lang="da"><head></head>'), 'da-DK');
  assert.equal(kodeFor('<html data-lang="en"><head></head>'), null);
});

test('kodeFor: en kommentert html-tagg teller ikke', () => {
  assert.equal(kodeFor('<!-- <html lang="en"> --><html lang="da"><head></head>'), 'da-DK');
});

test('settInn: legger taggen rett etter charset, og er idempotent', () => {
  const ny = settInn(side('en'));
  assert.match(ny, /<meta charset="UTF-8">\n<meta http-equiv="content-language" content="en-US">\n<title>/u);
  assert.equal(settInn(ny), ny);
  assert.equal(antall(ny), 1);
});

test('settInn: rett en feil eksisterende verdi, uten å doble taggen', () => {
  const ny = settInn(side('sv', '\n<meta http-equiv="content-language" content="no">'));
  assert.match(ny, /content="sv-SE"/u);
  assert.equal(antall(ny), 1);
});

test('settInn: eksisterende tagg med motsatt attributtrekkefølge, enkle anførselstegn eller store bokstaver', () => {
  for (const eksisterende of [
    '<meta content="no" http-equiv="content-language">',
    "<meta http-equiv='content-language' content='no'>",
    '<META HTTP-EQUIV="Content-Language" CONTENT="no">',
  ]) {
    const ny = settInn(side('sv', `\n${eksisterende}`));
    assert.equal(antall(ny), 1, eksisterende);
    assert.match(ny, /content="sv-SE"/u, eksisterende);
    assert.doesNotMatch(ny, /content="no"|content='no'/iu, eksisterende);
  }
});

test('settInn: flere eksisterende tagger blir til én', () => {
  const ny = settInn(side('da', '\n<meta http-equiv="content-language" content="no">\n<meta content="sv" http-equiv="content-language">'));
  assert.equal(antall(ny), 1);
  assert.match(ny, /content="da-DK"/u);
});

test('settInn: kommentert head og charset gir innsetting i den ekte headen', () => {
  const html = '<html lang="sv"><!-- <head><meta charset="UTF-8"></head> --><head><meta charset="UTF-8"><title>x</title></head>';
  const ny = settInn(html);
  assert.equal(antall(ny), 1);
  assert.ok(ny.indexOf('http-equiv="content-language"') > ny.indexOf('--><head>'), 'taggen havnet i kommentaren');
});

test('settInn: sider uten kjent språk rører vi ikke, og aldri <html lang>', () => {
  const fransk = side('fr');
  assert.equal(settInn(fransk), fransk);
  assert.match(settInn(side('no')), /<html lang="no">/u);
});

test('erNoindex: bare robots-meta teller', () => {
  assert.equal(erNoindex(side('no', '\n<meta name="robots" content="noindex, nofollow">')), true);
  assert.equal(erNoindex(side('no', '\n<meta name="robots" content="follow, noindex">')), true);
  assert.equal(erNoindex(side('no', '\n<meta content="noindex" name="robots">')), true);
  assert.equal(erNoindex(side('no', '\n<meta name="bingbot" content="noindex">')), true);
  assert.equal(erNoindex(side('no', '\n<meta name="description" content="noindex explained">')), false);
  assert.equal(erNoindex(side('no', '\n<meta name="robots" content="index, follow">')), false);
  assert.equal(erNoindex(side('no', '\n<!-- <meta name="robots" content="noindex"> -->')), false);
});

test('settInn: sider med noindex rører vi ikke, men en beskrivelse som nevner ordet gjør det ikke', () => {
  for (const meta of ['\n<meta name="robots" content="noindex, nofollow">', '\n<meta name="robots" content="follow, noindex">']) {
    const stotte = side('no', meta);
    assert.equal(settInn(stotte), stotte);
  }
  assert.equal(antall(settInn(side('sv', '\n<meta name="description" content="noindex explained">'))), 1);
});

test('settInn: sider uten charset får taggen rett etter <head>', () => {
  const html = '<html lang="da">\n<head>\n<title>x</title>\n</head>\n</html>';
  assert.match(settInn(html), /<head>\n<meta http-equiv="content-language" content="da-DK">/u);
});

// Låser at hver side i sitemapene har riktig tag. Forventet land utledes av URL-en (prefiks),
// ikke av samme funksjon som skriver taggen, så en felles feil slipper ikke gjennom. Alle sidene må
// finnes som fil; en sti som ikke løses opp feiler testen i stedet for å bli hoppet over.
// En generator som skriver en side på nytt uten taggen gjør denne rød: kjør node scripts/sprak-signaler.mjs.
const SITEMAPER = ['sitemap.xml', 'sitemap-sv.xml', 'sitemap-da.xml', 'sitemap-en.xml'];
const landFraSti = (sti) => (sti.startsWith('/sv/') ? 'sv-SE' : sti.startsWith('/da/') ? 'da-DK' : sti.startsWith('/en/') ? 'en-US' : 'nb-NO');
const filFraSti = (sti) => {
  const kandidater = sti.endsWith('/') ? [`${sti}index.html`] : [sti, `${sti}.html`, `${sti}/index.html`];
  for (const k of kandidater) {
    const fil = new URL(`..${k}`, import.meta.url);
    if (k.endsWith('.html') && existsSync(fil)) return fil;
  }
  return null;
};

for (const navn of SITEMAPER) {
  const urler = [...readFileSync(new URL(`../${navn}`, import.meta.url), 'utf8').matchAll(/<loc>https:\/\/matlyst-app\.no([^<]+)<\/loc>/gu)].map((m) => m[1]);
  test(`${navn}: alle sider har riktig content-language`, () => {
    assert.ok(urler.length > 10, `bare ${urler.length} URL-er`);
    let kontrollert = 0;
    for (const sti of urler) {
      const fil = filFraSti(sti);
      assert.ok(fil, `${sti} finnes ikke som fil`);
      const html = readFileSync(fil, 'utf8');
      const forventet = landFraSti(sti);
      assert.equal(kodeFor(html), forventet, `${sti}: html lang gir ikke ${forventet}`);
      assert.match(html, new RegExp(`<meta http-equiv="content-language" content="${forventet}">`, 'u'), `${sti} mangler content-language ${forventet}`);
      assert.equal(antall(html), 1, `${sti} har flere content-language-tagger`);
      kontrollert++;
    }
    assert.equal(kontrollert, urler.length);
  });
}

test('KODER dekker alle språkene vi publiserer', () => {
  assert.deepEqual(Object.values(KODER).sort(), ['da-DK', 'en-US', 'nb-NO', 'nb-NO', 'sv-SE']);
});
