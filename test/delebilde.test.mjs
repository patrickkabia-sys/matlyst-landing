// Sider av typene verktøy (omregnere), blogg og guider peker på delebildet for sin type og sitt språk, og bildet finnes og er 1200 × 630.
// Sider med eget bilde (bloggartikler, de gamle guidene) har ikke det felles bildet og er utenfor. Lag bildene på nytt: node scripts/delebilde-render.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { alleSider } from '../scripts/sidetyper.mjs';
import { BASE, BILDETYPER, BREDDE, FELLES_BILDE, HOYDE, SPRAK, bildeSti, bildeUrl } from '../scripts/delebilde-tekst.mjs';
import { bildetypeFor, settDelebilde } from '../scripts/delebilde.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const meta = (html, navn, attr = 'property') => html.match(new RegExp(`<meta ${attr}="${navn}" content="([^"]*)"`, 'u'))?.[1];

function pngMaal(fil) {
  const b = readFileSync(fil);
  assert.equal(b.subarray(1, 4).toString(), 'PNG', `${fil} er ikke en PNG`);
  return { b: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

test('alle tolv delebildene finnes, er 1200 × 630 og under 200 kB', () => {
  assert.equal(BILDETYPER.length * SPRAK.length, 12);
  for (const type of BILDETYPER) {
    for (const sprak of SPRAK) {
      const fil = rot + bildeSti(type, sprak).slice(1);
      assert.ok(existsSync(fil), `${fil} mangler`);
      assert.deepEqual(pngMaal(fil), { b: BREDDE, h: HOYDE }, fil);
      assert.ok(statSync(fil).size < 200 * 1024, `${fil} er over 200 kB`);
    }
  }
});

test('hver side av typene verktøy, blogg og guide har bildet for sin type og sitt språk', () => {
  const tall = {};
  const feil = [];
  for (const s of alleSider(rot)) {
    const html = readFileSync(rot + s.fil, 'utf8');
    const type = bildetypeFor(s.sti, html);
    if (type === null) continue;
    const og = meta(html, 'og:image');
    // Eget, spesifikt bilde (bloggartikkelens første bilde) beholdes.
    if (!og.includes('/images/delebilde/') && og !== `${BASE}${FELLES_BILDE}`) { tall.eget = (tall.eget ?? 0) + 1; continue; }
    const forventet = bildeUrl(type, s.sprak);
    const ok = og === forventet && meta(html, 'twitter:image', 'name') === forventet
      && meta(html, 'og:image:width') === String(BREDDE) && meta(html, 'og:image:height') === String(HOYDE)
      && (meta(html, 'og:image:alt') ?? '') !== '' && meta(html, 'og:image:alt') === meta(html, 'twitter:image:alt', 'name')
      && existsSync(rot + bildeSti(type, s.sprak).slice(1));
    if (!ok) feil.push(`${s.sti}: ${og}`);
    tall[`${type}/${s.sprak}`] = (tall[`${type}/${s.sprak}`] ?? 0) + 1;
  }
  assert.deepEqual(feil, []);
  // Vakten må se sidene: alle tolv kombinasjoner har sider, og det er hundrevis av omregnere.
  for (const type of BILDETYPER) for (const sprak of SPRAK) assert.ok(tall[`${type}/${sprak}`] > 0, `ingen sider for ${type}/${sprak}`);
  assert.ok(tall['verktoy/nb'] > 100);
});

test('forsider, juss og tjenester får ikke et typebilde', () => {
  for (const s of alleSider(rot)) {
    if (!['forside', 'juss', 'tjeneste'].includes(s.type)) continue;
    assert.ok(!meta(readFileSync(rot + s.fil, 'utf8'), 'og:image')?.includes('/images/delebilde/'), s.sti);
  }
});

test('settDelebilde bytter bare det felles bildet og er idempotent', () => {
  const hode = `<meta property="og:image" content="${BASE}${FELLES_BILDE}">\n<meta property="og:image:alt" content="x">\n<meta name="twitter:image" content="${BASE}${FELLES_BILDE}">\n<meta name="twitter:image:alt" content="x">`;
  const ny = settDelebilde(hode, 'blogg', 'sv');
  assert.match(ny, /blogg-sv\.png/u);
  assert.equal(settDelebilde(ny, 'blogg', 'sv'), ny);
  const eget = hode.replaceAll(FELLES_BILDE, '/images/blogg/sv/egg/01.webp');
  assert.equal(settDelebilde(eget, 'blogg', 'sv'), eget);
});
