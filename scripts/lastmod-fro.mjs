// Engangsfylling av scripts/lastmod-kart.json fra git-historikken: for hver adresse i sidekartene,
// dagen da innholdsavtrykket (scripts/lastmod.mjs) fikk sin nåværende verdi, altså eldste commit i den
// siste sammenhengende rekken med likt avtrykk. Kjøres fra en komplett klone: node scripts/lastmod-fro.mjs
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITEMAPER, avtrykk, filForUrl } from './lastmod.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const git = (...a) => execFileSync('git', a, { cwd: rot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const kart = {};
const urler = SITEMAPER.flatMap((f) => [...readFileSync(join(rot, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/gu)].map((m) => m[1]));
let n = 0;
for (const url of new Set(urler)) {
  const fil = filForUrl(url);
  const na = avtrykk(readFileSync(join(rot, fil), 'utf8'));
  const logg = git('log', '--format=%H %cs', '--', fil).trim().split('\n').filter(Boolean).map((l) => l.split(' '));
  // logg er nyest først; hver commit endret fila. Finn eldste commit hvis versjon har samme avtrykk som nå.
  let dato = null;
  for (const [hash, d] of logg) {
    let html;
    try { html = git('show', `${hash}:${fil}`); } catch { break; }
    if (avtrykk(html) !== na) break;
    dato = d;
  }
  // Fila er endret uten at avtrykket er det (bare ramme), og hele rekken kan ha samme avtrykk: da er dato eldste commit.
  kart[url] = { hash: na, dato: dato ?? logg[0]?.[1] ?? '2026-10-05' };
  if (++n % 100 === 0) console.error(n);
}
writeFileSync(join(rot, 'scripts/lastmod-kart.json'), `${JSON.stringify(Object.fromEntries(Object.keys(kart).sort().map((k) => [k, kart[k]])), null, 1)}\n`);
console.log(`${Object.keys(kart).length} adresser`);
