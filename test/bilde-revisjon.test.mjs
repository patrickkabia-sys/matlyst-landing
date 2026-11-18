import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';
import test from 'node:test';
import { lesDimensjoner, rapportSomTekst, revider } from '../scripts/bilde-revisjon.mjs';

function png(bredde, hoyde) {
  function blokk(type, data) {
    const innhold = Buffer.concat([Buffer.from(type), data]);
    let crc = 0xffffffff;
    for (const byte of innhold) {
      crc ^= byte;
      for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    const lengde = Buffer.alloc(4);
    lengde.writeUInt32BE(data.length);
    const sum = Buffer.alloc(4);
    sum.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
    return Buffer.concat([lengde, innhold, sum]);
  }
  const hode = Buffer.alloc(13);
  hode.writeUInt32BE(bredde); hode.writeUInt32BE(hoyde, 4); hode[8] = 8;
  return Buffer.concat([
    Buffer.from('89504e470d0a1a0a', 'hex'), blokk('IHDR', hode),
    blokk('IDAT', deflateSync(Buffer.alloc((bredde + 1) * hoyde))), blokk('IEND', Buffer.alloc(0)),
  ]);
}

// Gyldig gråtone-JPEG med én blokk og minimale Huffman-tabeller.
function jpeg() {
  function segment(markor, data) {
    const hode = Buffer.from([255, markor, 0, 0]);
    hode.writeUInt16BE(data.length + 2, 2);
    return Buffer.concat([hode, data]);
  }
  const tabell = (type) => Buffer.from([type, 1, ...Array(15).fill(0), 0]);
  return Buffer.concat([
    Buffer.from([255, 216]), segment(0xdb, Buffer.from([0, ...Array(64).fill(1)])),
    segment(0xc0, Buffer.from([8, 0, 2, 0, 3, 1, 1, 0x11, 0])),
    segment(0xc4, Buffer.concat([tabell(0), tabell(0x10)])),
    segment(0xda, Buffer.from([1, 1, 0, 0, 63, 0])), Buffer.from([0x3f, 255, 217]),
  ]);
}
const webpL = Buffer.from('UklGRh4AAABXRUJQVlA4TBEAAAAvAkAAAAdQmSKXov+BiOh/AAA=', 'base64');
const webp = Buffer.from('UklGRjoAAABXRUJQVlA4IC4AAADQAQCdASoDAAIAAgA0JaACdLoB+AADsAD+7qY//izkYjs83/2Dv5wH5wH9FAAA', 'base64');
function utvidetWebp() {
  const blokk = Buffer.alloc(18);
  blokk.write('VP8X'); blokk.writeUInt32LE(10, 4);
  blokk.writeUIntLE(2, 12, 3); blokk.writeUIntLE(1, 15, 3);
  const fil = Buffer.concat([webp.subarray(0, 12), blokk, webp.subarray(12)]);
  fil.writeUInt32LE(fil.length - 8, 4);
  return fil;
}

function oppsett(t) {
  const rot = mkdtempSync(join(tmpdir(), 'matlyst-bilder-'));
  t.after(() => rmSync(rot, { recursive: true, force: true }));
  const skriv = (sti, tekst) => {
    const fil = join(rot, sti);
    mkdirSync(dirname(fil), { recursive: true }); writeFileSync(fil, tekst);
    return fil;
  };
  skriv('images/mat.png', png(300, 200));
  const side = (innhold, hode = '<meta property="og:image" content="/images/mat.png">', sprak = 'nb') =>
    `<!doctype html><html lang="${sprak}"><head>${hode}</head><body>${innhold}</body></html>`;
  return { rot, skriv, side };
}
const bilde = (attributter = '') => `<img src="/images/mat.png" ${attributter}>`;
const typer = (rapport) => rapport.sider[0].funn.map((funn) => funn.type);

for (const [navn, attributter, forventet] of [
  ['manglende alt', '', ['alt_mangler']],
  ['tom alt', 'alt=""', ['alt_tom']],
  ['dekor med rolle', 'alt="" role="presentation"', []],
  ['skjult dekor', 'alt="" aria-hidden="true"', []],
  ['skjult bilde uten alt', 'aria-hidden="true"', ['alt_mangler']],
  ['kort alt', 'alt="God middag"', ['alt_kort']],
  ['generisk engelsk alt', 'alt="image of a meal"', ['alt_prefiks']],
  ['generisk foto', 'alt="Photo of a meal"', ['alt_prefiks']],
  ['generisk bilde', 'alt="picture of a meal"', ['alt_prefiks']],
  ['generisk norsk alt', 'alt="Bilde av god middag"', ['alt_prefiks']],
  ['lang alt', `alt="${'middag '.repeat(19)}"`, ['alt_lang']],
  ['filnavn som alt', 'alt="mat.png"', ['alt_kort', 'alt_filnavn']],
  ['tre ord', 'alt="En god middag"', []],
  ['nøyaktig 125 tegn', `alt="En god ${'a'.repeat(118)}"`, []],
  ['HTML-entiteter som ordskiller', 'alt="En&nbsp;god&#32;middag"', []],
]) {
  test(`alt-regler: ${navn}`, (t) => {
    const { rot, skriv, side } = oppsett(t);
    skriv('index.html', side(bilde(`${attributter} width="300" height="200" loading="lazy"`)));
    assert.deepEqual(typer(revider(rot)).filter((type) => type.startsWith('alt_')), forventet);
  });
}

test('dimensjoner mangler når ett eller begge HTML-mål mangler', (t) => {
  const { rot, skriv, side } = oppsett(t);
  skriv('index.html', side(bilde('alt="En god middag"') + bilde('width="300" alt="En god middag"')));
  assert.equal(revider(rot).sammendrag.dimensjoner_mangler, 2);
});

test('sideforhold flagges over to prosent og godtas innenfor toleransen', (t) => {
  const { rot, skriv, side } = oppsett(t);
  skriv('index.html', side([150, 153, 154, 100].map((bredde) =>
    bilde(`width="${bredde}" height="100" alt="En god middag"`)).join('')));
  const funn = revider(rot).sider[0].funn.filter((funn) => funn.type === 'sideforhold');
  assert.deepEqual(funn.map((funn) => funn.bilde), [3, 4]);
});

test('lazy unntar første innholdsbilde etter navigasjon, dekor og butikkmerker', (t) => {
  const { rot, skriv, side } = oppsett(t);
  skriv('images/hero.png', png(800, 400));
  skriv('index.html', side(`<nav>${bilde('alt="Logo til Matlyst"')}</nav>
    <img src="/images/appstore-badge.svg"><img src="/images/googleplay-badge.png" alt="">
    <main>${bilde('alt="" role="presentation"')}
    <img src="/images/hero.png" alt="Mat på bordet" width="800" height="400">
    ${bilde('alt="En god middag" width="300" height="200"')}
    ${bilde('alt="En god middag" width="300" height="200" loading="lazy"')}</main>`));
  const rapport = revider(rot);
  assert.deepEqual(rapport.sider[0].funn.filter((f) => f.type === 'lazy_mangler').map((f) => f.bilde), [1, 2, 3, 4, 6]);
  assert.equal(rapport.sammendrag.hero_fetchpriority, 1);
  assert.equal(rapport.sider[0].funn.find((f) => f.type === 'hero_fetchpriority').niva, 'rad');
  assert.equal(rapport.sammendrag.alt_mangler, 0);
  assert.equal(rapport.sammendrag.alt_tom, 0);
  assert.equal(rapport.sammendrag.dimensjoner_mangler, 4);
});

test('hero med høy prioritet og lite førstebilde trenger ikke prioriteringsråd', (t) => {
  const { rot, skriv, side } = oppsett(t);
  skriv('images/hero.png', png(800, 400));
  skriv('index.html', side('<img src="/images/hero.png" fetchpriority="high" alt="Mat på bordet">'));
  skriv('liten.html', side(bilde('alt="En god middag"')));
  assert.equal(revider(rot).sammendrag.hero_fetchpriority, 0);
  assert.equal(revider(rot).sammendrag.lazy_mangler, 0);
});

test('srcset kreves ved størrelsessøsken i samme mappe, også fra suffiksert kilde', (t) => {
  const { rot, skriv, side } = oppsett(t);
  skriv('images/mat-400.png', png(6, 4));
  skriv('images/mat-800.png', png(12, 8));
  skriv('images/annen/unik-400.png', png(6, 4));
  skriv('images/unik.png', png(3, 2));
  skriv('index.html', side(bilde('alt="En god middag"') +
    '<img src="/images/mat-800.png"><img src="/images/unik.png">' +
    bilde('srcset="/images/mat-400.png 400w, /images/mat-800.png 800w"')));
  assert.deepEqual(revider(rot).sider[0].funn.filter((f) => f.type === 'srcset_mangler').map((f) => f.bilde), [1, 2]);
});

test('noindex og utelatte mapper blir ikke revidert, kommentarer og skript er ikke elementer', (t) => {
  const { rot, skriv, side } = oppsett(t);
  for (const mappe of ['node_modules', '.git', 'test', 'seo-data', 'seo-motor', 'scripts', 'docs', 'design', 'blogg-kilde', 'test-results']) {
    skriv(`${mappe}/feil.html`, side(bilde()));
  }
  for (const robot of ['robots', 'googlebot', 'bingbot']) {
    skriv(`${robot}.html`, side(bilde(), `<META CONTENT='NOINDEX,follow' NAME='${robot}'>`));
  }
  skriv('index.html', side(`<!-- ${bilde()} --><script>const tekst = '${bilde()}';</script>` +
    '<IMG ALT=\'En god middag\' SRC="/images/mat.png" WIDTH=300 HEIGHT=200 data-tekst=">">',
    '<!-- <meta name="robots" content="noindex"> --><meta content="/images/mat.png" property="og:image">'));
  const rapport = revider(rot);
  assert.deepEqual(rapport.sider.map((s) => s.sti), ['index.html']);
  assert.equal(rapport.sider[0].bilder.length, 1);
  assert.deepEqual(rapport.sider[0].funn, []);
});

test('og:image mangler eller peker til manglende fil og eksisterende mål rapporteres', (t) => {
  const { rot, skriv, side } = oppsett(t);
  skriv('uten.html', side('', ''));
  skriv('borte.html', side('', '<meta property="og:image" content="/images/borte.jpg">'));
  skriv('index.html', side('', '<meta property="og:image" content="https://matlyst-app.no/images/mat.png?v=1#bilde">'));
  const rapport = revider(rot);
  assert.equal(rapport.sammendrag.og_mangler, 1);
  assert.equal(rapport.sammendrag.og_fil_mangler, 1);
  assert.deepEqual(rapport.sider.find((s) => s.sti === 'index.html').ogBilder[0].dimensjoner, { bredde: 300, hoyde: 200 });
});

test('noindex-tekst i skript og maler skjuler ikke en indekserbar side', (t) => {
  const { rot, skriv, side } = oppsett(t);
  skriv('index.html', side('<script>const eksempel = \'<meta name="robots" content="noindex">\';</script>' +
    '<template><meta name="robots" content="noindex"></template>' + bilde()));
  assert.equal(revider(rot).sider.length, 1);
});

test('diskrapport teller format, 150 kB uten SVG og faktisk ubrukte filer på tvers av språk og noindex', (t) => {
  const { rot, skriv, side } = oppsett(t);
  skriv('images/stor.jpg', Buffer.concat([jpeg(), Buffer.alloc(150001 - jpeg().length)]));
  skriv('images/grense.png', Buffer.concat([png(3, 2), Buffer.alloc(150000 - png(3, 2).length)]));
  skriv('images/merke.svg', '<svg>' + ' '.repeat(160000) + '</svg>');
  skriv('images/ubrukt.webp', webpL);
  skriv('images/skjult.png', png(3, 2));
  skriv('images/bakgrunn.png', png(3, 2));
  skriv('images/kilde.png', png(3, 2));
  skriv('stil.css', 'body { background: url("images/bakgrunn.png"); }');
  skriv('index.html', side('<link rel="stylesheet" href="stil.css"><picture><source srcset="/images/kilde.png 2x">' + bilde() + '</picture>' +
    '<img src="/images/grense.png"><img src="/images/merke.svg">'));
  skriv('en/index.html', side('<img src="/images/stor.jpg">', undefined, 'en'));
  skriv('skjult.html', side('<img src="/images/skjult.png">', '<meta name="robots" content="noindex">'));
  const rapport = revider(rot, { sprak: 'en' });
  assert.deepEqual(rapport.filer.filter((f) => f.over150kB).map((f) => f.sti), ['images/stor.jpg']);
  assert.deepEqual(rapport.filer.filter((f) => !f.referert).map((f) => f.sti), ['images/ubrukt.webp']);
  assert.deepEqual(rapport.formatfordeling, { jpg: 1, png: 5, svg: 1, webp: 1 });
  assert.deepEqual(rapport.sider.map((s) => s.sti), ['en/index.html']);
  const tabell = rapportSomTekst(rapport).split('\n\n')[0];
  assert.match(tabell, /Filer over 150 kB\s+1/u);
  assert.match(tabell, /Ubrukte bildefiler\s+1/u);
});

test('URL-er løses relativt til siden, med kodede tegn, uten treff for fremmede verter', (t) => {
  const { rot, skriv, side } = oppsett(t);
  skriv('images/god mat.png', png(3, 2));
  skriv('en/index.html', side('<img src="../images/god%20mat.png?v=1#utsnitt" alt="god mat.png">' +
    '<img src="https://fremmed.example/images/mat.png">', '<meta property="og:image" content="https://fremmed.example/og.jpg">', 'en'));
  const rapport = revider(rot);
  assert.equal(rapport.sammendrag.alt_filnavn, 1);
  assert.equal(rapport.filer.find((f) => f.sti === 'images/god mat.png').referert, true);
  assert.equal(rapport.filer.find((f) => f.sti === 'images/mat.png').referert, false);
  assert.equal(rapport.sider[0].ogBilder[0].status, 'ekstern');
});

for (const [navn, data, forventet] of [
  ['PNG', png(7, 5), { bredde: 7, hoyde: 5 }],
  ['JPEG', jpeg(), { bredde: 3, hoyde: 2 }],
  ['WebP VP8', webp, { bredde: 3, hoyde: 2 }],
  ['WebP VP8L', webpL, { bredde: 3, hoyde: 2 }],
  ['WebP VP8X', utvidetWebp(), { bredde: 3, hoyde: 2 }],
]) {
  test(`filhodet gir riktige dimensjoner for ${navn}`, (t) => {
    const { skriv } = oppsett(t);
    assert.deepEqual(lesDimensjoner(skriv('bilde.bin', data)), forventet);
  });
}

test('ukjente, manglende og avkuttede filer gir ingen dimensjoner', (t) => {
  const { rot, skriv } = oppsett(t);
  assert.equal(lesDimensjoner(join(rot, 'borte.png')), null);
  for (const [i, data] of [Buffer.from('<svg/>'), png(3, 2).subarray(0, 20), jpeg().subarray(0, 10), webp.subarray(0, 25)].entries()) {
    assert.equal(lesDimensjoner(skriv(`avkuttet-${i}`, data)), null);
  }
});

test('dimensjonsleseren hopper over JPEG-metadata og WebP-blokker med utfyllingsbyte', (t) => {
  const { skriv } = oppsett(t);
  const medMetadata = Buffer.concat([jpeg().subarray(0, 2), Buffer.from([255, 225, 0, 5, 1, 2, 3]), jpeg().subarray(2)]);
  const medBlokk = Buffer.concat([webp.subarray(0, 12), Buffer.from('4a554e4b010000000000', 'hex'), webp.subarray(12)]);
  medBlokk.writeUInt32LE(medBlokk.length - 8, 4);
  assert.deepEqual(lesDimensjoner(skriv('metadata.jpg', medMetadata)), { bredde: 3, hoyde: 2 });
  assert.deepEqual(lesDimensjoner(skriv('utfylling.webp', medBlokk)), { bredde: 3, hoyde: 2 });
});

test('butikkmerker unntas også fra lang, kort, generisk og filnavnlik alt', (t) => {
  const { rot, skriv, side } = oppsett(t);
  skriv('index.html', side(['Kort', 'image of a badge', 'appstore-badge.svg', 'ord '.repeat(40)]
    .map((alt) => `<img src="/images/appstore-badge.svg" alt="${alt}">`).join('')));
  assert.deepEqual(typer(revider(rot)).filter((type) => type.startsWith('alt_')), []);
});

const prosjekt = fileURLToPath(new URL('../', import.meta.url));
const skript = join(prosjekt, 'scripts/bilde-revisjon.mjs');
test('CLI skriver JSON og tabell, exit 0 ved funn og feil, og overskriver ikke kildefiler', (t) => {
  const { rot, skriv } = oppsett(t);
  const kjor = (...args) => spawnSync(process.execPath, [skript, ...args], { cwd: rot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const resultat = kjor('--sprak', 'en', '--json', '--ut', join(rot, 'rapport.json'));
  assert.equal(resultat.status, 0);
  const rapport = JSON.parse(resultat.stdout);
  assert.deepEqual(JSON.parse(readFileSync(join(rot, 'rapport.json'), 'utf8')), rapport);
  assert.ok(rapport.sider.length > 0);
  assert.ok(Object.values(rapport.sammendrag).some((antall) => antall > 0));
  assert.ok(rapport.sider.every((s) => s.sprak === 'en'));
  const tabell = kjor('--sprak', 'en');
  assert.equal(tabell.status, 0);
  assert.match(tabell.stdout, /Feiltype\s+en\s+Totalt/u);
  assert.ok(tabell.stdout.indexOf('Feiltype') < tabell.stdout.indexOf('en/index.html'));
  for (const args of [['--ukjent'], ['--sprak'], ['--ut', join(rot, 'borte', 'rapport.json')]]) {
    const feil = kjor(...args);
    assert.equal(feil.status, 0);
    assert.match(feil.stderr, /Kunne ikke/u);
  }
  const kilde = skriv('bevar.html', '<html>Uendret</html>');
  const avvist = kjor('--ut', kilde);
  assert.equal(avvist.status, 0);
  assert.match(avvist.stderr, /Kunne ikke/u);
  assert.equal(readFileSync(kilde, 'utf8'), '<html>Uendret</html>');
});

test('språk normaliseres og rapporten endrer ingen inndata', (t) => {
  const { rot, skriv, side } = oppsett(t);
  const html = side(bilde(), undefined, 'no');
  skriv('index.html', html);
  skriv('en/index.html', side(bilde(), undefined, 'en-US'));
  assert.equal(revider(rot, { sprak: 'nb' }).sider.length, 1);
  assert.equal(revider(rot, { sprak: 'en' }).sider.length, 1);
  assert.equal(readFileSync(join(rot, 'index.html'), 'utf8'), html);
  assert.deepEqual(readFileSync(join(rot, 'images/mat.png')), png(300, 200));
});
