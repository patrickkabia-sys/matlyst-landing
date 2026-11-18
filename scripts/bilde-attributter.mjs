// Gir butikkmerkene (App Store og Google Play) width og height, så siden ikke hopper når de lastes
// (layoutstabilitet, Core Web Vitals). Kjøres ETTER generatorene, som sprak-signaler.mjs:
//   node scripts/bilde-attributter.mjs
// Idempotent: merker som allerede har begge attributtene røres ikke.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Visningsstørrelse ved 40 piksler høyde (som i .store-badges), forholdet fra filene.
export const MERKER = {
  '/images/appstore-badge.svg': [120, 40],
  '/images/googleplay-badge-en.png': [134, 40],
};
const UTELATT = new Set(['node_modules', '.git', 'test-results', 'playwright-report']);

export function settDimensjoner(html) {
  return html.replace(/<img\b[^>]*>/giu, (tagg) => {
    const kilde = tagg.match(/\ssrc=["']([^"']+)["']/iu)?.[1];
    const mal = MERKER[kilde];
    if (!mal || /\swidth=/iu.test(tagg) || /\sheight=/iu.test(tagg)) return tagg;
    return tagg.replace(/<img\b/iu, `<img width="${mal[0]}" height="${mal[1]}"`);
  });
}

function htmlFiler(mappe) {
  return readdirSync(mappe, { withFileTypes: true }).flatMap((d) => {
    if (d.isDirectory()) return UTELATT.has(d.name) ? [] : htmlFiler(join(mappe, d.name));
    return d.name.endsWith('.html') ? [join(mappe, d.name)] : [];
  });
}

export function kjor(rot) {
  const endret = [];
  for (const fil of htmlFiler(rot)) {
    const html = readFileSync(fil, 'utf8');
    const ny = settDimensjoner(html);
    if (ny !== html) { writeFileSync(fil, ny); endret.push(relative(rot, fil)); }
  }
  return endret;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const endret = kjor(fileURLToPath(new URL('..', import.meta.url)));
  console.log(`bilde-attributter: ${endret.length} sider oppdatert`);
}
