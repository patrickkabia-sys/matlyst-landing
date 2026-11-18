// Skrivebeskyttet revisjon. Ingen nettverkskall eller eksterne avhengigheter.
// Kjør: node scripts/lenke-revisjon.mjs [--sprak en] [--json]
// Innkommende er unike indekserbare kildesider med brødtekstlenke, uten selvlenker.
// Utgående, svake ankre og ødelagte lenker omfatter alle områder på siden.
// Under tre inkluderer foreldreløse. Ødelagte telles som lenkeforekomster.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { erNoindex } from './sprak-signaler.mjs';

const ROT = fileURLToPath(new URL('../', import.meta.url));
const DOMENE = 'https://matlyst-app.no';
const SPRAK = ['nb', 'sv', 'da', 'en'];
const UTELATT = new Set(['node_modules', '.git', 'test', 'seo-data', 'seo-motor', 'scripts', 'docs', 'design', 'blogg-kilde', 'test-results', 'playwright-report']);
const SVAKE = new Set(['', 'klikk her', 'les mer', 'her', 'more', 'read more', 'click here']);
const TOMME_TAGGER = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

function dekodTekst(tekst) {
  const tegn = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
  return tekst.replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/giu, (hel, kode) => {
    if (!kode.startsWith('#')) return tegn[kode.toLowerCase()];
    const tall = kode[1].toLowerCase() === 'x' ? parseInt(kode.slice(2), 16) : Number(kode.slice(1));
    return tall > 0 && tall <= 0x10ffff ? String.fromCodePoint(tall) : hel;
  });
}

function attributter(tagg) {
  const resultat = {};
  for (const m of tagg.matchAll(/\s([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gu)) {
    const navn = m[1].toLowerCase();
    if (!(navn in resultat)) resultat[navn] = dekodTekst(m[2] ?? m[3] ?? m[4]);
  }
  return resultat;
}

export function sprakFor(sti) {
  return sti.match(/^\/(sv|da|en)(?:\/|$)/u)?.[1] ?? 'nb';
}

export function filFor(rot, sti) {
  const lokal = decodeURIComponent(sti);
  const fil = resolve(rot, `.${lokal.endsWith('/') ? `${lokal}index.html` : lokal}`);
  if (!fil.startsWith(`${resolve(rot)}${sep}`)) throw new Error(`Stien er utenfor nettstedet: ${sti}`);
  return fil;
}

function finnesFil(rot, sti) {
  try { return statSync(filFor(rot, sti)).isFile(); } catch { return false; }
}

/** URL er bare en lokal parser. Ressurser som bilder beholder filendelsen. */
export function normaliserLenke(href, fra = '/', rot = ROT) {
  let url;
  try { url = new URL(href, `${DOMENE}${fra}`); } catch { return null; }
  if (!['https:', 'http:'].includes(url.protocol) || url.hostname !== 'matlyst-app.no' || url.port) return null;
  let sti = url.pathname.replace(/\/{2,}/gu, '/').replace(/\/index\.html$/u, '/');
  try {
    const dekodet = decodeURIComponent(sti);
    if (dekodet.includes('\0') || dekodet.includes('\\') || dekodet.split('/').includes('..')) return null;
  } catch { return null; }
  if (!sti.endsWith('/') && !extname(sti)) {
    if (finnesFil(rot, `${sti}/`)) sti += '/';
    else if (finnesFil(rot, `${sti}.html`)) sti += '.html';
    else sti += '/';
  }
  return sti;
}

/** Leser statisk HTML med en taggstakk, også nøstede navigasjonsområder. */
export function lesLenker(html, fra, rot = ROT) {
  const lenker = [];
  const stakk = [];
  let anker = null;
  const avslutt = () => {
    if (anker) {
      anker.tekst = anker.tekst.replace(/\s+/gu, ' ').trim();
      lenker.push(anker);
      anker = null;
    }
  };
  const kilde = html.replace(/<!--[\s\S]*?-->/gu, '')
    .replace(/<(script|style|template|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>/giu, '');
  const biter = kilde.matchAll(/<\/?[a-zA-Z](?:[^"'<>]|"[^"]*"|'[^']*')*>|[^<]+|</gu);
  for (const [bit] of biter) {
    const tagg = bit.match(/^<(\/?)([a-zA-Z][\w:-]*)\b/u);
    if (!tagg) {
      if (anker) anker.tekst += dekodTekst(bit);
      continue;
    }
    const navn = tagg[2].toLowerCase();
    if (tagg[1]) {
      if (navn === 'a') avslutt();
      const pos = stakk.findLastIndex((element) => element.navn === navn);
      if (pos !== -1) stakk.splice(pos);
      continue;
    }
    const attrs = attributter(bit);
    const omrade = ['nav', 'header', 'footer', 'head'].includes(navn) ? navn
      : attrs.role?.toLowerCase() === 'navigation' ? 'nav' : null;
    if (navn === 'a') {
      avslutt();
      if ('href' in attrs) anker = {
        fra, href: attrs.href, til: normaliserLenke(attrs.href, fra, rot), tekst: '',
        omrade: stakk.findLast((element) => element.omrade)?.omrade ?? 'brodtekst',
      };
    }
    if (anker && navn === 'img') anker.tekst += attrs.alt ?? '';
    if (anker && navn === 'br') anker.tekst += ' ';
    if (!TOMME_TAGGER.has(navn)) stakk.push({ navn, omrade });
  }
  avslutt();
  return lenker;
}

export function lesSider(rot = ROT) {
  const sider = [];
  function lesMappe(mappe) {
    for (const fil of readdirSync(mappe, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'nb'))) {
      if (UTELATT.has(fil.name)) continue;
      const fullSti = join(mappe, fil.name);
      if (fil.isDirectory()) lesMappe(fullSti);
      else if (fil.isFile() && fil.name.endsWith('.html')) {
        const html = readFileSync(fullSti, 'utf8');
        if (erNoindex(html)) continue;
        const filsti = '/' + relative(rot, fullSti).split(sep).map(encodeURIComponent).join('/');
        const sti = filsti.replace(/\/index\.html$/u, '/');
        sider.push({ sti, sprak: sprakFor(sti), lenker: lesLenker(html, sti, rot) });
      }
    }
  }
  lesMappe(rot);
  return sider;
}

/** hub er én sti. tilleggshubber er valgfrie og får de samme eikene. */
export function validerKart(kart) {
  const objekt = (verdi) => verdi !== null && typeof verdi === 'object' && !Array.isArray(verdi);
  const sti = (verdi) => typeof verdi === 'string' && /^\/(?!\/)[^?#\\]*$/u.test(verdi)
    && (verdi.endsWith('/') || verdi.endsWith('.html'));
  const stier = (verdi) => Array.isArray(verdi) && verdi.every(sti);
  if (!objekt(kart)) throw new Error('Lenkekartet må være et objekt med språk som nøkler.');
  for (const [sprak, data] of Object.entries(kart)) {
    if (!SPRAK.includes(sprak) || !objekt(data) || !objekt(data.hubber)) throw new Error(`Ugyldig språkstruktur i lenkekartet: ${sprak}`);
    for (const [navn, gruppe] of Object.entries(data.hubber)) {
      if (!objekt(gruppe) || !sti(gruppe.hub) || !stier(gruppe.eiker)
        || !stier(gruppe.planlagt ?? []) || !stier(gruppe.tilleggshubber ?? [])) {
        throw new Error(`Ugyldig hub eller stiliste i lenkekartet: ${sprak}/${navn}`);
      }
      for (const side of [gruppe.hub, ...gruppe.eiker, ...(gruppe.tilleggshubber ?? []), ...(gruppe.planlagt ?? [])]) {
        if (sprakFor(side) !== sprak || normaliserLenke(side) !== side) throw new Error(`Ugyldig kanonisk sti i ${sprak}/${navn}: ${side}`);
      }
    }
  }
  return kart;
}

export function sjekkKart(kart, sider, rot = ROT) {
  validerKart(kart);
  const brodtekst = new Map(sider.map((side) => [side.sti, new Set(side.lenker.filter((lenke) => lenke.omrade === 'brodtekst').map((lenke) => lenke.til))]));
  const resultat = Object.fromEntries(SPRAK.map((sprak) => [sprak, []]));
  for (const [sprak, data] of Object.entries(kart)) {
    for (const [gruppe, verdi] of Object.entries(data.hubber)) {
      const hubber = [verdi.hub, ...(verdi.tilleggshubber ?? [])];
      const brudd = resultat[sprak];
      for (const sti of new Set([...hubber, ...verdi.eiker])) {
        if (!finnesFil(rot, sti)) brudd.push({ type: 'mangler-fil', gruppe, sti });
      }
      for (const hub of hubber) {
        for (const eike of verdi.eiker) {
          if (!finnesFil(rot, hub) || !finnesFil(rot, eike)) continue;
          if (!brodtekst.get(hub)?.has(eike)) brudd.push({ type: 'hub-mangler-eike', gruppe, fra: hub, til: eike });
          if (!brodtekst.get(eike)?.has(hub)) brudd.push({ type: 'eike-mangler-hub', gruppe, fra: eike, til: hub });
        }
      }
    }
  }
  return resultat;
}

export function revider({ rot = ROT, kart = {}, sprak } = {}) {
  if (sprak !== undefined && !SPRAK.includes(sprak)) throw new Error(`Ukjent språk: ${sprak}. Velg nb, sv, da eller en.`);
  const sider = lesSider(rot);
  const innkommende = new Map(sider.map(({ sti }) => [sti, new Set()]));
  for (const side of sider) {
    for (const lenke of side.lenker) {
      if (lenke.omrade === 'brodtekst' && lenke.til !== side.sti) innkommende.get(lenke.til)?.add(side.sti);
    }
  }
  const kartbrudd = sjekkKart(kart, sider, rot);
  const rapport = { sprak: {}, feil: [] };
  for (const kode of sprak ? [sprak] : SPRAK) {
    const valgte = sider.filter((side) => side.sprak === kode);
    const lenker = valgte.flatMap((side) => side.lenker);
    const oversikt = valgte.map((side) => ({
      sti: side.sti,
      innkommendeBrodtekst: innkommende.get(side.sti).size,
      utgaende: side.lenker.length,
      utgaendeBrodtekst: side.lenker.filter((lenke) => lenke.omrade === 'brodtekst').length,
      utgaendeInterne: side.lenker.filter((lenke) => lenke.til !== null).length,
    }));
    rapport.sprak[kode] = {
      sider: oversikt,
      foreldrelose: oversikt.filter((side) => side.innkommendeBrodtekst === 0).map((side) => side.sti),
      underTre: oversikt.filter((side) => side.innkommendeBrodtekst < 3).map((side) => side.sti),
      odelagte: lenker.filter((lenke) => lenke.til !== null && !finnesFil(rot, lenke.til)),
      overHundre: oversikt.filter((side) => side.utgaende > 100).map((side) => side.sti),
      svakeAnkere: lenker.filter((lenke) => SVAKE.has(lenke.tekst.toLowerCase())),
      kartbrudd: kartbrudd[kode],
    };
  }
  return rapport;
}

function tabell(rader) {
  const bredder = rader[0].map((_, i) => Math.max(...rader.map((rad) => String(rad[i]).length)));
  return rader.map((rad) => rad.map((felt, i) => String(felt).padEnd(bredder[i])).join('  ').trimEnd()).join('\n');
}

export function formaterRapport(rapport) {
  const rader = [['Språk', 'Sider', 'Foreldreløse', 'Under 3', 'Ødelagte', 'Over 100', 'Svake ankre', 'Kartbrudd']];
  for (const [sprak, data] of Object.entries(rapport.sprak)) {
    rader.push([sprak, data.sider.length, data.foreldrelose.length, data.underTre.length, data.odelagte.length, data.overHundre.length, data.svakeAnkere.length, data.kartbrudd.length]);
  }
  const deler = [tabell(rader), 'Innkommende: unike kildesider i brødtekst, uten selvlenker. Under 3 inkluderer foreldreløse.',
    'Utgående og ødelagte: lenkeforekomster i alle områder. Utgående inkluderer eksterne lenker.'];
  for (const [sprak, data] of Object.entries(rapport.sprak)) {
    deler.push(`\nSider (${sprak})`, tabell([
      ['Sti', 'Innkommende brødtekst', 'Utgående', 'Utgående brødtekst', 'Utgående interne'],
      ...data.sider.map((side) => [side.sti, side.innkommendeBrodtekst, side.utgaende, side.utgaendeBrodtekst, side.utgaendeInterne]),
    ]));
    deler.push(`Foreldreløse: ${data.foreldrelose.join(', ') || 'ingen'}`,
      `Under 3: ${data.underTre.join(', ') || 'ingen'}`, `Over 100: ${data.overHundre.join(', ') || 'ingen'}`);
    if (data.odelagte.length) deler.push('Ødelagte lenker:', tabell([
      ['Fra', 'Til', 'Område'], ...data.odelagte.map((lenke) => [lenke.fra, lenke.til, lenke.omrade]),
    ]));
    if (data.svakeAnkere.length) deler.push('Svake ankre:', tabell([
      ['Fra', 'Lenke', 'Tekst', 'Område'], ...data.svakeAnkere.map((lenke) => [lenke.fra, lenke.href, lenke.tekst || '(tom)', lenke.omrade]),
    ]));
    if (data.kartbrudd.length) deler.push('Kartbrudd:', tabell([
      ['Type', 'Gruppe', 'Fra eller sti', 'Til'], ...data.kartbrudd.map((brudd) => [brudd.type, brudd.gruppe, brudd.fra ?? brudd.sti, brudd.til ?? '']),
    ]));
  }
  deler.push(...rapport.feil.map((feil) => `Feil: ${feil}`));
  return deler.join('\n');
}

/** Også lese- og argumentfeil rapporteres med exitkode 0. Ingen sider skrives. */
export function kjorCli(args = process.argv.slice(2), { rot = ROT, skriv = console.log } = {}) {
  let rapport;
  try {
    let sprak;
    for (let i = 0; i < args.length; i += 1) {
      if (args[i] === '--json') continue;
      if (args[i] === '--sprak' && SPRAK.includes(args[i + 1])) sprak = args[++i];
      else throw new Error(`Ugyldig argument: ${args[i]}. Bruk [--sprak nb|sv|da|en] [--json].`);
    }
    let kart;
    try { kart = JSON.parse(readFileSync(join(rot, 'seo-data/lenkekart.json'), 'utf8')); }
    catch { throw new Error('Kunne ikke lese seo-data/lenkekart.json som JSON.'); }
    rapport = revider({ rot, kart, sprak });
  } catch (feil) {
    rapport = { sprak: {}, feil: [`Revisjonen kunne ikke fullføres: ${feil.message}`] };
  }
  skriv(args.includes('--json') ? JSON.stringify(rapport, null, 2) : formaterRapport(rapport));
  return rapport;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) kjorCli();
