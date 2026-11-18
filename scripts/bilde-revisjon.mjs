// Skrivebeskyttet revisjon: node scripts/bilde-revisjon.mjs [--sprak en] [--json] [--ut fil].
// kB er 1000 byte. Prioriteringsrådet bruker 800 piksler som grense for et stort førstebilde.
import { closeSync, existsSync, fstatSync, openSync, readFileSync, readSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { erNoindex } from './sprak-signaler.mjs';

const UTELATT = new Set(['node_modules', '.git', 'test', 'seo-data', 'seo-motor', 'scripts', 'docs', 'design', 'blogg-kilde', 'test-results']);
const BILDEFORMATER = new Set(['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'avif', 'ico', 'bmp', 'tif', 'tiff']);
const TOMME_TAGGER = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
export const FEILTYPER = {
  alt_mangler: 'Alt mangler', alt_tom: 'Tom alt', alt_kort: 'Alt under 3 ord',
  alt_lang: 'Alt over 125 tegn', alt_prefiks: 'Generisk alt-prefiks', alt_filnavn: 'Alt er filnavnet',
  dimensjoner_mangler: 'Width eller height mangler', sideforhold: 'Avvik i sideforhold',
  lazy_mangler: 'Lazy mangler', srcset_mangler: 'Srcset mangler',
  og_mangler: 'og:image mangler', og_fil_mangler: 'og:image-fil mangler',
  hero_fetchpriority: 'Råd: høy prioritet på hero',
};
const tommeAntall = () => Object.fromEntries(Object.keys(FEILTYPER).map((type) => [type, 0]));
const normaliserSprak = (sprak) => ({ no: 'nb' }[sprak] ?? sprak);
const sprakKode = (sprak) => normaliserSprak(sprak.toLowerCase().split(/[-_]/u)[0]);
const positivtTall = (verdi) => /^\d+(?:\.\d+)?$/u.test(verdi ?? '') && Number(verdi) > 0 ? Number(verdi) : null;

/** Leser bare nødvendige hodefelt, også når metadata ligger før JPEG- eller WebP-målene. */
export function lesDimensjoner(fil) {
  let fd;
  try {
    fd = openSync(fil, 'r');
    const storrelse = fstatSync(fd).size;
    const les = (posisjon, antall) => {
      if (posisjon < 0 || posisjon + antall > storrelse) return null;
      const data = Buffer.alloc(antall);
      return readSync(fd, data, 0, antall, posisjon) === antall ? data : null;
    };
    const maal = (bredde, hoyde) => bredde > 0 && hoyde > 0 ? { bredde, hoyde } : null;
    const hode = les(0, Math.min(storrelse, 32));
    if (!hode) return null;
    if (hode.length >= 24 && hode.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')) &&
        hode.toString('ascii', 12, 16) === 'IHDR' && hode.readUInt32BE(8) === 13 && storrelse >= 33) {
      return maal(hode.readUInt32BE(16), hode.readUInt32BE(20));
    }
    if (hode[0] === 0xff && hode[1] === 0xd8) {
      let posisjon = 2;
      const rammer = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
      while (posisjon < storrelse) {
        if (les(posisjon++, 1)?.[0] !== 0xff) return null;
        let markor;
        do { markor = les(posisjon++, 1)?.[0]; } while (markor === 0xff);
        if (markor == null || markor === 0xda || markor === 0xd9) return null;
        if (markor === 0x01 || (markor >= 0xd0 && markor <= 0xd7)) continue;
        const lengdefelt = les(posisjon, 2);
        if (!lengdefelt) return null;
        const lengde = lengdefelt.readUInt16BE();
        if (lengde < 2 || posisjon + lengde > storrelse) return null;
        if (rammer.has(markor)) {
          const ramme = lengde >= 8 ? les(posisjon + 2, 6) : null;
          if (!ramme || lengde < 8 + 3 * ramme[5]) return null;
          return maal(ramme.readUInt16BE(3), ramme.readUInt16BE(1));
        }
        posisjon += lengde;
      }
    }
    if (hode.toString('ascii', 0, 4) === 'RIFF' && hode.toString('ascii', 8, 12) === 'WEBP') {
      const slutt = hode.readUInt32LE(4) + 8;
      if (slutt > storrelse) return null;
      for (let posisjon = 12; posisjon + 8 <= slutt;) {
        const blokk = les(posisjon, 8);
        const type = blokk.toString('ascii', 0, 4);
        const lengde = blokk.readUInt32LE(4);
        if (posisjon + 8 + lengde + (lengde % 2) > slutt) return null;
        const data = les(posisjon + 8, Math.min(lengde, 10));
        if (type === 'VP8X' && data.length >= 10) return maal(data.readUIntLE(4, 3) + 1, data.readUIntLE(7, 3) + 1);
        if (type === 'VP8L' && data.length >= 5 && data[0] === 0x2f) {
          const felt = data.readUInt32LE(1);
          return maal((felt & 0x3fff) + 1, ((felt >>> 14) & 0x3fff) + 1);
        }
        if (type === 'VP8 ' && data.length >= 10 && !(data[0] & 1) && data.subarray(3, 6).equals(Buffer.from([0x9d, 1, 0x2a]))) {
          return maal(data.readUInt16LE(6) & 0x3fff, data.readUInt16LE(8) & 0x3fff);
        }
        posisjon += 8 + lengde + (lengde % 2);
      }
    }
    return null;
  } catch {
    return null;
  } finally {
    if (fd !== undefined) closeSync(fd);
  }
}

function dekodEntiteter(tekst) {
  const navn = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', aring: 'å', Aring: 'Å', oslash: 'ø', Oslash: 'Ø', aelig: 'æ', AElig: 'Æ' };
  return tekst.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/giu, (hele, verdi) => {
    if (!verdi.startsWith('#')) return navn[verdi] ?? hele;
    const tall = /^#x/iu.test(verdi) ? parseInt(verdi.slice(2), 16) : Number(verdi.slice(1));
    return tall > 0 && tall <= 0x10ffff ? String.fromCodePoint(tall) : '\ufffd';
  });
}

function utenInertInnhold(html) {
  return html.replace(/<!--[\s\S]*?(?:-->|$)/gu, '').replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/giu, '');
}

function tagger(html) {
  const resultat = [];
  const foreldre = [];
  for (const treff of utenInertInnhold(html).matchAll(/<\/?[a-z][\w:-]*(?:[^>"']|"[^"]*"|'[^']*')*>/giu)) {
    const navn = treff[0].match(/^<\/?([\w:-]+)/u)[1].toLowerCase();
    if (treff[0].startsWith('</')) {
      const indeks = foreldre.lastIndexOf(navn);
      if (indeks >= 0) foreldre.length = indeks;
      continue;
    }
    const attributter = {};
    const innhold = treff[0].slice(navn.length + 1, -1);
    for (const attr of innhold.matchAll(/([^\s=/'">]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/gu)) {
      const nokkel = attr[1].toLowerCase();
      if (!Object.hasOwn(attributter, nokkel)) attributter[nokkel] = dekodEntiteter(attr[2] ?? attr[3] ?? attr[4] ?? '');
    }
    resultat.push({ navn, attributter, foreldre: [...foreldre] });
    if (!TOMME_TAGGER.has(navn)) foreldre.push(navn);
  }
  return resultat;
}

function* filerUnder(mappe) {
  if (!existsSync(mappe)) return;
  for (const fil of readdirSync(mappe, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'nb'))) {
    if (UTELATT.has(fil.name)) continue;
    const sti = join(mappe, fil.name);
    // Symbolske lenker følges ikke, slik at revisjonen holder seg i arbeidstreet.
    if (fil.isDirectory()) yield* filerUnder(sti);
    else if (fil.isFile()) yield sti;
  }
}

function lokalFil(kilde, side, rot, opphav) {
  if (!kilde?.trim()) return null;
  try {
    const url = new URL(kilde.trim(), new URL(relative(rot, side).split(sep).join('/'), opphav));
    if (url.origin !== new URL(opphav).origin || !['https:', 'http:'].includes(url.protocol)) return null;
    const fil = resolve(rot, '.' + decodeURIComponent(url.pathname));
    const rel = relative(rot, fil);
    if (rel === '..' || rel.startsWith('..' + sep)) return null;
    return fil;
  } catch { return null; }
}

const erFil = (fil) => {
  try { return Boolean(fil) && statSync(fil).isFile(); } catch { return false; }
};
const cssKilder = (css) => [...css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]+))\s*\)/giu)].map((m) => m[1] ?? m[2] ?? m[3]);
const srcsetKilder = (srcset) => srcset.split(',').map((del) => del.trim().split(/\s+/u)[0]).filter(Boolean);

/** Revisjon av indekserbare sider. Filreferanser samles fra alle språk og også noindex-sider. */
export function revider(rot, { sprak } = {}) {
  rot = resolve(rot);
  const vert = erFil(join(rot, 'CNAME')) ? readFileSync(join(rot, 'CNAME'), 'utf8').trim() : 'matlyst-app.no';
  const opphav = `https://${vert}/`;
  const referanser = new Set();
  const lesteStiler = new Set();
  const maalCache = new Map();
  const dimensjoner = (fil) => {
    if (!fil) return null;
    if (!maalCache.has(fil)) maalCache.set(fil, lesDimensjoner(fil));
    return maalCache.get(fil);
  };
  const relativ = (fil) => relative(rot, fil).split(sep).join('/');
  function referer(kilde, side) {
    const fil = lokalFil(kilde, side, rot, opphav);
    if (fil) referanser.add(fil);
    return fil;
  }
  function lesStil(fil) {
    if (!erFil(fil) || lesteStiler.has(fil)) return;
    lesteStiler.add(fil);
    const css = readFileSync(fil, 'utf8').replace(/\/\*[\s\S]*?\*\//gu, '');
    const kilder = [...cssKilder(css), ...[...css.matchAll(/@import\s+["']([^"']+)["']/giu)].map((m) => m[1])];
    for (const kilde of kilder) {
      const funnet = referer(kilde, fil);
      if (funnet && extname(funnet).toLowerCase() === '.css') lesStil(funnet);
    }
  }
  const alleFiler = [...filerUnder(rot)];
  const bildefiler = alleFiler.filter((fil) => relativ(fil).startsWith('images/') && BILDEFORMATER.has(extname(fil).slice(1).toLowerCase()));
  const filsett = new Set(alleFiler);
  const sider = [];
  for (const fil of alleFiler.filter((sti) => /\.html$/iu.test(sti))) {
    const html = readFileSync(fil, 'utf8');
    const elementer = tagger(html);
    for (const { attributter: a } of elementer) {
      for (const navn of ['src', 'href', 'poster', 'data-src']) if (a[navn]) referer(a[navn], fil);
      if (a.srcset) for (const kilde of srcsetKilder(a.srcset)) referer(kilde, fil);
      if (a.style) for (const kilde of cssKilder(a.style)) referer(kilde, fil);
      if (a.content && /^(og:image(?::url|:secure_url)?|twitter:image(?::src)?)$/iu.test(a.property ?? a.name ?? '')) referer(a.content, fil);
      if (a.rel?.toLowerCase().split(/\s+/u).includes('stylesheet')) lesStil(lokalFil(a.href, fil, rot, opphav));
    }
    for (const stil of html.replace(/<!--[\s\S]*?-->/gu, '').matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/giu)) {
      for (const kilde of cssKilder(stil[1])) referer(kilde, fil);
    }
    if (erNoindex(utenInertInnhold(html))) continue;
    const sideSprak = sprakKode(elementer.find((el) => el.navn === 'html')?.attributter.lang?.trim() || 'ukjent');
    if (sprak && sideSprak !== sprakKode(sprak)) continue;
    const side = { sti: relativ(fil), sprak: sideSprak, bilder: [], ogBilder: [], funn: [] };
    const funn = (type, detaljer = {}) => side.funn.push({ type, niva: type === 'hero_fetchpriority' ? 'rad' : 'avvik', ...detaljer });
    const harMain = elementer.some((el) => el.navn === 'main');
    let harInnholdsbilde = false;
    for (const el of elementer.filter((el) => el.navn === 'img')) {
      const a = el.attributter;
      const kilde = a.src ?? '';
      const lokal = lokalFil(kilde, fil, rot, opphav);
      const maal = dimensjoner(lokal);
      const nummer = side.bilder.length + 1;
      const leggTil = (type, ekstra = {}) => funn(type, { bilde: nummer, src: kilde, ...ekstra });
      const alt = a.alt?.trim();
      const merke = /appstore-badge|googleplay-badge/iu.test(kilde);
      const dekor = alt === '' && (a.role?.toLowerCase() === 'presentation' || a['aria-hidden']?.toLowerCase() === 'true');
      const innhold = !merke && !dekor && !el.foreldre.some((navn) => ['nav', 'footer'].includes(navn)) &&
        (harMain ? el.foreldre.includes('main') : !el.foreldre.includes('header'));
      const forste = innhold && !harInnholdsbilde;
      if (innhold) harInnholdsbilde = true;
      const bredde = positivtTall(a.width);
      const hoyde = positivtTall(a.height);
      side.bilder.push({ nummer, src: kilde, alt: a.alt ?? null, dimensjoner: maal, bredde, hoyde, forsteInnholdsbilde: forste });
      if (!merke) {
        if (alt === undefined) leggTil('alt_mangler');
        else if (!alt) { if (!dekor) leggTil('alt_tom'); }
        else {
          if ((alt.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) ?? []).length < 3) leggTil('alt_kort');
          if ([...alt].length > 125) leggTil('alt_lang');
          if (/^(image of|picture of|photo of|bilde av)\b/iu.test(alt)) leggTil('alt_prefiks');
          let filnavn = '';
          try { filnavn = basename(decodeURIComponent(new URL(kilde, opphav).pathname)); } catch { /* Ugyldige URL-er har ikke et pålitelig filnavn. */ }
          if (filnavn && alt.toLowerCase() === filnavn.toLowerCase()) leggTil('alt_filnavn');
        }
      }
      if (!bredde || !hoyde) leggTil('dimensjoner_mangler');
      else if (maal) {
        const avvik = Math.abs((bredde / hoyde) / (maal.bredde / maal.hoyde) - 1);
        if (avvik > 0.02 + 1e-10) leggTil('sideforhold', { avvikProsent: Number((avvik * 100).toFixed(2)) });
      }
      if (!forste && a.loading?.toLowerCase() !== 'lazy') leggTil('lazy_mangler');
      if (forste && (maal?.bredde ?? bredde ?? 0) >= 800 && a.fetchpriority?.toLowerCase() !== 'high') leggTil('hero_fetchpriority');
      if (lokal && filsett.has(lokal) && !a.srcset?.trim()) {
        const endelse = extname(lokal);
        const stamme = basename(lokal, endelse).replace(/-\d+$/u, '');
        const sosken = [400, 800, 1200].map((n) => join(dirname(lokal), `${stamme}-${n}${endelse}`))
          .filter((sti) => sti !== lokal && filsett.has(sti));
        if (sosken.length) leggTil('srcset_mangler', { sosken: sosken.map(relativ) });
      }
    }
    const og = elementer.filter((el) => el.navn === 'meta' && (el.attributter.property ?? el.attributter.name)?.toLowerCase() === 'og:image' && el.attributter.content?.trim());
    if (!og.length) funn('og_mangler');
    for (const el of og) {
      const src = el.attributter.content;
      const lokal = lokalFil(src, fil, rot, opphav);
      const finnes = erFil(lokal);
      side.ogBilder.push({ src, fil: lokal ? relativ(lokal) : null, status: !lokal ? 'ekstern' : finnes ? 'finnes' : 'mangler', dimensjoner: finnes ? dimensjoner(lokal) : null });
      if (lokal && !finnes) funn('og_fil_mangler', { src });
    }
    sider.push(side);
  }
  const perSprak = {};
  const sammendrag = tommeAntall();
  for (const side of sider) {
    perSprak[side.sprak] ??= { sider: 0, antall: tommeAntall() };
    perSprak[side.sprak].sider++;
    for (const funn of side.funn) { sammendrag[funn.type]++; perSprak[side.sprak].antall[funn.type]++; }
  }
  const formatfordeling = {};
  const filer = bildefiler.map((fil) => {
    const format = extname(fil).slice(1).toLowerCase();
    formatfordeling[format] = (formatfordeling[format] ?? 0) + 1;
    const byte = statSync(fil).size;
    return { sti: relativ(fil), format, byte, over150kB: format !== 'svg' && byte > 150000, referert: referanser.has(fil), dimensjoner: dimensjoner(fil) };
  });
  return { sammendrag, perSprak, sider, filer, formatfordeling,
    storsteFiler: [...filer].sort((a, b) => b.byte - a.byte || a.sti.localeCompare(b.sti)).slice(0, 5) };
}

/** Tabell først, deretter sidefunn og felles filrapport. */
export function rapportSomTekst(rapport) {
  const sprak = Object.keys(rapport.perSprak).sort();
  const rader = [['Feiltype', ...sprak, 'Totalt'], ...Object.entries(FEILTYPER).map(([type, navn]) =>
    [navn, ...sprak.map((kode) => String(rapport.perSprak[kode].antall[type])), String(rapport.sammendrag[type])])];
  rader.push(['Filer over 150 kB', ...sprak.map(() => ''), String(rapport.filer.filter((fil) => fil.over150kB).length)],
    ['Ubrukte bildefiler', ...sprak.map(() => ''), String(rapport.filer.filter((fil) => !fil.referert).length)]);
  const bredder = rader[0].map((_, i) => Math.max(...rader.map((rad) => rad[i].length)));
  const linjer = rader.map((rad) => rad.map((celle, i) => i === 0 ? celle.padEnd(bredder[i]) : celle.padStart(bredder[i])).join('  '));
  linjer.push('', `Indekserbare sider: ${rapport.sider.length}. Råd om hero er veiledende (bredde minst 800 piksler).`,
    'Filrapporten gjelder alle språk. Referanser fra noindex-sider er med. Eksterne URL-er hentes ikke.');
  for (const side of rapport.sider) {
    linjer.push('', `${side.sti} (${side.sprak}, ${side.bilder.length} bilder)`);
    if (!side.funn.length) linjer.push('  Ingen avvik.');
    for (const funn of side.funn) linjer.push(`  ${FEILTYPER[funn.type]}${funn.bilde ? `, bilde ${funn.bilde}` : ''}${funn.src ? `: ${funn.src}` : ''}${funn.avvikProsent !== undefined ? ` (${funn.avvikProsent} prosent)` : ''}`);
    for (const og of side.ogBilder) linjer.push(`  og:image: ${og.src}, ${og.status}${og.dimensjoner ? `, ${og.dimensjoner.bredde} × ${og.dimensjoner.hoyde}` : ', dimensjoner ikke lesbare lokalt'}`);
  }
  linjer.push('', `Formatfordeling: ${Object.entries(rapport.formatfordeling).sort().map(([format, antall]) => `${format}: ${antall}`).join(', ')}`);
  for (const [tittel, utvalg] of [
    ['Over 150 kB (uten SVG)', rapport.filer.filter((f) => f.over150kB)],
    ['Ubrukte bildefiler', rapport.filer.filter((f) => !f.referert)],
    ['De fem største filene', rapport.storsteFiler],
  ]) {
    linjer.push('', `${tittel}: ${utvalg.length}`);
    for (const fil of utvalg) linjer.push(`  ${fil.sti}: ${(fil.byte / 1000).toFixed(1)} kB`);
  }
  return linjer.join('\n') + '\n';
}

export function kjorCli(args = process.argv.slice(2)) {
  try {
    let sprak, ut, json = false;
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--json') json = true;
      else if (['--sprak', '--ut'].includes(args[i])) {
        const flagg = args[i];
        const verdi = args[++i];
        if (!verdi || verdi.startsWith('--')) throw new Error(`Verdi mangler etter ${flagg}`);
        if (flagg === '--sprak') sprak = verdi; else ut = verdi;
      } else throw new Error(`Ukjent argument: ${args[i]}`);
    }
    const rot = fileURLToPath(new URL('..', import.meta.url));
    const rapport = revider(rot, { sprak });
    const tekst = json ? JSON.stringify(rapport, null, 2) + '\n' : rapportSomTekst(rapport);
    // En rapport kan aldri overskrive en eksisterende fil eller opprettes under images/.
    if (ut) {
      const mal = resolve(ut);
      const rel = relative(join(rot, 'images'), mal);
      if (!['.json', '.txt', '.md'].includes(extname(mal).toLowerCase()) || (!rel.startsWith('..' + sep) && rel !== '..')) {
        throw new Error('Rapportfilen må være en ny .json-, .txt- eller .md-fil utenfor images/');
      }
      writeFileSync(mal, tekst, { flag: 'wx' });
    }
    process.stdout.write(tekst);
  } catch (feil) {
    process.stderr.write(`Kunne ikke fullføre bilderevisjonen: ${feil.message}\n`);
  }
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = kjorCli();
