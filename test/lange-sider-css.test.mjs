import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// Låser stilene for lange sider (18.11.2026): venstrekant, rytme og komponentene
// innholdsfortegnelse, svar-boks, scenario, founder-sitat, video og tabell.
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const MARKØR = '===== Lange sider:';

function blokk() {
  const start = css.indexOf(MARKØR);
  assert.ok(start > -1, 'markøren for blokken mangler i styles.css');
  return css.slice(start);
}

function regler(tekst) {
  return [...tekst.replace(/\/\*[\s\S]*?\*\//gu, '').matchAll(/([^{}]+)\{[^{}]*\}/gu)].map((m) => m[1].trim());
}

test('komponentene for lange sider finnes', () => {
  const b = blokk();
  for (const klasse of ['.toc', '.answer', '.scenario', '.founder', '.phones', '.table-wrap']) {
    assert.ok(b.includes(klasse), `${klasse} mangler`);
  }
  assert.match(b, /\.prose video\{/u, 'video-stilen mangler');
  assert.match(b, /\.prose\.locale-prose h3\{/u, 'H3-stilen mangler');
});

test('ingen regel i blokken treffer sidens globale nav eller footer', () => {
  // Siden har globale regler for «nav» og «footer». Et element med disse navnene arver dem
  // (position:fixed, flex osv.), så komponenter må bruke div, p eller klasser.
  const farlige = regler(blokk()).flatMap((velger) => velger.split(',')).map((v) => v.trim())
    .filter((v) => /(^|[\s>+~])(nav|footer)(?![\w-])/u.test(v));
  assert.deepEqual(farlige, []);
});

test('brødtekst, FAQ, app-boks og bloggblokker deler venstrekant med heroen', () => {
  const b = blokk();
  const formel = 'calc(max(0px,50% - 550px) + var(--pad))';
  for (const velger of ['.locale-prose~.faq', '.locale-prose~.app-cta', '.blogg-forside']) {
    const regel = b.split('}').find((r) => r.includes(velger));
    assert.ok(regel, `${velger} mangler`);
    assert.ok(regel.includes(formel), `${velger} bruker ikke samme venstrekant som heroen`);
  }
});

test('bare eksisterende fargetokens brukes i blokken', () => {
  const b = blokk();
  const brukte = new Set([...b.matchAll(/var\(--([a-z0-9-]+)\)/gu)].map((m) => m[1]));
  const definerte = new Set([...css.matchAll(/--([a-z0-9-]+)\s*:/gu)].map((m) => m[1]));
  const ukjente = [...brukte].filter((t) => !definerte.has(t));
  assert.deepEqual(ukjente, []);
});

test('reduced motion er respektert', () => {
  assert.match(blokk(), /prefers-reduced-motion:reduce\)\{html\{scroll-behavior:auto\}/u);
});
