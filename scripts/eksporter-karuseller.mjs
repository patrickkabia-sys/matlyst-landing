#!/usr/bin/env node
// Henter SoMe-karusellene inn som kilde for bloggen: teksten fra karusellmalene og
// bildene fra de ferdige mappene, alt godkjent av Patrick før det ble rendret.
// Kjøres når en ny karusell skal bli bloggartikkel; resultatet committes her.
//   node scripts/eksporter-karuseller.mjs [sti til matlyst/marketing]
// Bloggen leser bare blogg-kilde/karuseller.json og images/blogg/, aldri marketing-mappa.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { BLOGGTEMAER } from './blogg.mjs';

const ROT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const MARKETING = resolve(process.argv[2] ?? join(ROT, '../matlyst/marketing'));
const KILDE = join(MARKETING, 'out/brag-serie/work');
const MAPPER = { nb: 'karuseller', sv: 'karuseller-sv', da: 'karuseller-da', en: 'karuseller-en' };

function lastSprakfil(fil) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(readFileSync(join(KILDE, fil), 'utf8'), ctx);
  return ctx.window.KARUSELLER_SPRAK;
}

function lastNorsk() {
  const html = readFileSync(join(KILDE, 'karusell.html'), 'utf8');
  const start = html.indexOf('const KARUSELLER = ');
  const slutt = html.indexOf('\nconst q = new URLSearchParams');
  if (start < 0 || slutt < 0) throw new Error('Fant ikke KARUSELLER i karusell.html');
  return vm.runInNewContext(`(${html.slice(start + 'const KARUSELLER = '.length, slutt).replace(/;\s*$/u, '')})`, {});
}

// Captionen uten hashtagger og uten SoMe-oppfordringen («Lagre den …») blir ingressen.
function ingress(caption) {
  return caption.split('\n').filter((linje) => !linje.trim().startsWith('#')).join(' ')
    .replace(/\s*(?:Lagre den|Spara den|Gem den|Save (?:it|this))[^.]*\./giu, '')
    .replace(/\s+/gu, ' ').trim();
}

const data = { nb: lastNorsk(), sv: lastSprakfil('karuseller-sv.js'), da: lastSprakfil('karuseller-da.js'), en: lastSprakfil('karuseller-en-v2.js') };
const ut = {};
let bilder = 0;
for (const [tema, sprakene] of Object.entries(BLOGGTEMAER)) {
  for (const lang of Object.keys(sprakene)) {
    const karusell = data[lang][tema];
    if (!karusell) throw new Error(`Mangler karusellen ${tema} på ${lang}`);
    const mappe = join(MARKETING, 'out', MAPPER[lang], tema);
    const captionFil = join(mappe, 'caption.txt');
    // Engelsk: captionen står i Patricks godkjente dagsfil, ikke i mappa.
    const dagsfil = karusell.dagsfil && join(MARKETING, 'some-nordisk', karusell.dagsfil);
    const fraDagsfil = dagsfil && existsSync(dagsfil) ? readFileSync(dagsfil, 'utf8').match(/```caption-karusell\n([\s\S]*?)```/u)?.[1] : null;
    const caption = karusell.caption ?? fraDagsfil ?? readFileSync(captionFil, 'utf8');
    const jpg = readdirSync(join(mappe, '4x5')).filter((f) => /^\d+\.jpg$/u.test(f)).sort();
    if (jpg.length !== karusell.sider.length) throw new Error(`${lang}/${tema}: ${jpg.length} bilder, ${karusell.sider.length} sider`);
    const malmappe = join(ROT, 'images/blogg', lang, tema);
    mkdirSync(malmappe, { recursive: true });
    for (const f of jpg) {
      const mal = join(malmappe, f.replace('.jpg', '.webp'));
      execFileSync('cwebp', ['-quiet', '-q', '82', '-resize', '800', '0', join(mappe, '4x5', f), '-o', mal]);
      bilder += 1;
    }
    ut[lang] ??= {};
    ut[lang][tema] = { etikett: karusell.etikett, ingress: ingress(caption), sider: karusell.sider, bilder: jpg.map((f) => f.replace('.jpg', '.webp')) };
  }
}
mkdirSync(join(ROT, 'blogg-kilde'), { recursive: true });
writeFileSync(join(ROT, 'blogg-kilde/karuseller.json'), `${JSON.stringify(ut, null, 2)}\n`);
console.log(`eksporterte ${Object.values(ut).reduce((n, l) => n + Object.keys(l).length, 0)} karuseller og ${bilder} bilder`);
if (!existsSync(join(ROT, 'blogg-kilde/karuseller.json'))) process.exit(1);
