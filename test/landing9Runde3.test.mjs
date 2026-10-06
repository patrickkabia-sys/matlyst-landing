import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const les = (path) => readFileSync(join(ROOT, path), 'utf8');

function finnHtml(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? finnHtml(path) : entry.name === 'index.html' ? [path] : [];
  });
}

const sider = ['sv', 'da'].flatMap((lang) => finnHtml(join(ROOT, lang)));
const tekst = (html) => html
  .replace(/<script(?! type="application\/ld\+json")[\s\S]*?<\/script>/gu, ' ')
  .replace(/<[^>]+>/gu, ' ')
  .replace(/&[^;]+;/gu, ' ')
  .replace(/\s+/gu, ' ');

test('klageveien nevner Forbrukertilsynet som mekler, ikke Forbrukerrådet', () => {
  for (const side of ['da/vilkaar/index.html', 'sv/villkor/index.html']) {
    const html = les(side);
    assert.match(html, /Forbrukertilsynet/u, side);
    assert.match(html, /Forbrukerklageutvalget/u, side);
  }
  for (const fil of sider) {
    const html = readFileSync(fil, 'utf8');
    assert.doesNotMatch(html, /Forbrukerrådet/u, relative(ROOT, fil));
  }
  assert.match(les('da/vilkaar/index.html'), /Forbrukertilsynet mægle, og en sag om fortrydelsesret/u);
  assert.match(les('sv/villkor/index.html'), /Konsument Europa, som kan medla i tvister med företag i Norge/u);
  const kilder = les('qa/sv-da/juridiske-kilder.md');
  for (const url of ['https://forbrugereuropa.dk/klag/', 'https://www.konsumenteuropa.se/', 'https://www.forbrukerradet.no/her-klager-du/', 'https://www.forbrukertilsynet.no/forbrukerklageutvalget/']) {
    assert.ok(kilder.includes(url), url);
  }
  assert.match(kilder, /Forbrukertilsynet mekler i Norge/u);
});

test('begge personvernsider har uttrykkelig samtykke etter artikkel 9', () => {
  assert.match(les('sv/integritet/index.html'), /uttryckliga samtycke enligt artikel 6\.1 a och artikel 9\.2 a/u);
  assert.match(les('da/privatliv/index.html'), /udtrykkelige samtykke efter artikel 6, stk\. 1, litra a, og artikel 9, stk\. 2, litra a/u);
});

test('ingen side har lik eller nesten lik H1 og H2', () => {
  const ord = (s) => new Set(s.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []);
  for (const fil of sider) {
    const html = readFileSync(fil, 'utf8');
    const rel = relative(ROOT, fil);
    const h1 = tekst(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/u)?.[1] ?? '').trim();
    const a = ord(h1);
    for (const [, raw] of html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gu)) {
      const h2 = tekst(raw).trim();
      const b = ord(h2);
      const felles = [...a].filter((w) => b.has(w)).length;
      const likhet = felles / new Set([...a, ...b]).size;
      assert.ok(likhet < 0.75, `${rel}: H1 «${h1}» og H2 «${h2}» er for like`);
    }
  }
});

test('ingen «del/dele/deler/dela/delar … til Matlyst»', () => {
  for (const fil of sider) {
    const synlig = tekst(readFileSync(fil, 'utf8'));
    assert.doesNotMatch(synlig, /\b(?:del|dele|deler|dela|delar)\b[^.!?]{0,80}?\btill? Matlyst\b/iu, relative(ROOT, fil));
  }
});

test('nb-NO/x-default finnes bare der den norske siden lenker tilbake', () => {
  const medNorsk = new Set(['sv/index.html', 'da/index.html', 'sv/integritet/index.html', 'da/privatliv/index.html', 'sv/villkor/index.html', 'da/vilkaar/index.html', 'sv/radera-konto/index.html', 'da/slet-konto/index.html']);
  for (const fil of sider) {
    const rel = relative(ROOT, fil);
    const html = readFileSync(fil, 'utf8');
    const nb = html.match(/hreflang="nb-NO" href="https:\/\/matlyst-app\.no([^"]+)"/u)?.[1];
    if (!medNorsk.has(rel)) {
      assert.doesNotMatch(html, /hreflang="(?:nb-NO|x-default)"/u, rel);
      continue;
    }
    assert.ok(nb, rel);
    assert.match(html, new RegExp(`hreflang="x-default" href="https://matlyst-app\\.no${nb.replace('.', '\\.')}"`, 'u'), rel);
    const norsk = les(nb === '/' ? 'index.html' : nb.slice(1));
    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/u)[1];
    assert.ok(norsk.includes(`href="${canonical}"`), `${nb} lenker ikke tilbake til ${canonical}`);
  }
});

test('Google Play-merket er beskåret til det synlige merket', () => {
  const png = readFileSync(join(ROOT, 'images/googleplay-badge-en.png'));
  assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [564, 168]);
});

test('skjermbildene er ekte sider, ikke like feilsider', () => {
  const dir = join(ROOT, 'qa/sv-da/skjermbilder');
  const filer = readdirSync(dir).filter((navn) => navn.endsWith('.png'));
  assert.equal(filer.length, 96);
  const storrelser = filer.map((navn) => statSync(join(dir, navn)).size);
  assert.ok(new Set(storrelser).size >= 90, `bare ${new Set(storrelser).size} ulike filstørrelser`);
  assert.ok(Math.min(...storrelser) > 20_000, 'et skjermbilde er mistenkelig lite');
});

test('AI-samtykket trekkes tilbake i appen, ikke via nettsidelenken', () => {
  for (const [side, overskrift] of [['sv/integritet/index.html', 'AI-behandling'], ['da/privatliv/index.html', 'AI-behandling']]) {
    const avsnitt = les(side).match(new RegExp(`<h2>${overskrift}</h2><p>([\\s\\S]*?)</p>`, 'u'))?.[1];
    assert.ok(avsnitt, `${side}: fant ikke ${overskrift}`);
    assert.doesNotMatch(avsnitt, /Ändra samtycke|Skift samtykke|nederst på siden|längst ned på sidan/u, side);
    assert.match(avsnitt, /appens (?:inställningar|indstillinger)/u, side);
  }
});
