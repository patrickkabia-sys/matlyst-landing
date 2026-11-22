import { readFileSync, writeFileSync, mkdirSync, lstatSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normaliserSti, sidetype, tjenestefamilie, alleSider, erUtrullet, nokkel, UTRULLET, EKSEMPEL, trygtUnderRot } from './sidetyper.mjs';
import { SKALLTEKST } from './skall-tekst.mjs';
import { gruppeForSti } from './locale-sider.mjs';
import { topp, hylledel, morkBunn, nedlasting, samtykke, sprakvelger } from './skall.mjs';

// Sluttposisjonen inkluderer lukketaggen. Nøsting av samme tagg må telles;
// både samtykkebannerne og de eldre nedlastingsboksene har ulik dybde.
function elementSlutt(html, start, tagg) {
  const tagger = new RegExp(`<\\/?${tagg}\\b[^>]*>`, 'gu');
  tagger.lastIndex = start;
  let dybde = 0;
  for (let m; (m = tagger.exec(html));) {
    dybde += m[0].startsWith('</') ? -1 : 1;
    if (dybde === 0) return tagger.lastIndex;
  }
  throw new Error(`Ubalansert ${tagg} ved posisjon ${start}`);
}

function blokk(html, navn) {
  const start = html.indexOf(`<!-- ${navn} -->`);
  const lukker = `<!-- /${navn} -->`;
  const slutt = html.indexOf(lukker, start);
  return start < 0 || slutt < 0 ? '' : html.slice(start, slutt + lukker.length);
}

/** Bevarer rå HTML. Kropp er dokumentet gjennom åpningen av body;
 * hale er resten etter gammel bunn, uten banneret og den gamle faste linjen.
 * Banneret returneres separat, mens skript i halen beholdes ordrett.
 */
export function trekkUt(html, sti) {
  const type = sidetype(sti, html);
  if (type === 'tjeneste') throw new Error(`Kan ikke trekke ut tjeneste (${tjenestefamilie(sti)}): ${sti}`);
  const sprak = /^\/(sv|da|en)\//u.exec(normaliserSti(sti))?.[1] ?? 'nb';
  const krev = (vilkar, melding) => {
    if (!vilkar) throw new Error(`${melding}: ${sti}`);
  };
  const body = /<body\b[^>]*>/u.exec(html);
  krev(body, 'Mangler body');
  const kroppSlutt = body.index + body[0].length;
  let start, slutt, haleStart;
  if (html.includes('<!-- skall:topp -->')) {
    const topp = html.indexOf('<!-- skall:topp -->', kroppSlutt);
    const toppSlutt = html.indexOf('<!-- /skall:topp -->', topp);
    krev(topp >= kroppSlutt && toppSlutt > topp, 'Mangler avslutning av skall:topp');
    start = toppSlutt + '<!-- /skall:topp -->'.length;
    slutt = html.indexOf('<!-- skall:bunn -->', start);
    krev(slutt >= start, 'Mangler skall:bunn');
    const bunnSlutt = html.indexOf('<!-- /skall:bunn -->', slutt);
    krev(bunnSlutt > slutt, 'Mangler avslutning av skall:bunn');
    haleStart = bunnSlutt + '<!-- /skall:bunn -->'.length;
  } else {
    const navSlutt = html.indexOf('</nav>', kroppSlutt);
    krev(navSlutt >= kroppSlutt, 'Mangler avslutning av nav');
    start = navSlutt + '</nav>'.length;
    const footer = /<footer\b/u.exec(html.slice(start));
    krev(footer, 'Mangler footer');
    slutt = start + footer.index;
    const footerSlutt = html.indexOf('</footer>', slutt);
    krev(footerSlutt > slutt, 'Mangler avslutning av footer');
    haleStart = footerSlutt + '</footer>'.length;
  }
  const cookie = /<div\b[^>]*\sid="cookie"[^>]*>/u.exec(html);
  let banner = null;
  if (cookie) {
    try { banner = html.slice(cookie.index, elementSlutt(html, cookie.index, 'div')); }
    catch (feil) { throw new Error(`${feil.message}: ${sti}`); }
  }
  let hale = html.slice(haleStart);
  if (banner) hale = hale.replace(banner, '');
  hale = hale.replace(/<!-- app-uttrykk:start -->[\s\S]*?<!-- app-uttrykk:slutt -->/gu, '');
  return {
    sprak,
    type,
    kropp: html.slice(0, kroppSlutt),
    innhold: html.slice(start, slutt),
    banner,
    harSiteJs: /<script\b[^>]*\bsrc="\/site\.js"[^>]*>\s*<\/script>/u.test(html),
    guider: blokk(html, 'guider:bunn'),
    sprakvelgere: { topp: blokk(html, 'språkvelger:topp'), bunn: blokk(html, 'språkvelger:bunn') },
    hale,
  };
}

export function ctaOmrader(innhold, type) {
  const omrader = [];
  for (const m of innhold.matchAll(/<(section|div|header)\b[^>]*>/gu)) {
    const klasser = /\sclass="([^"]*)"/u.exec(m[0])?.[1].split(/\s+/u) ?? [];
    let verdi;
    if (m[1] === 'section' && klasser.includes('app-cta')) verdi = 'app-cta';
    else if (['section', 'div'].includes(m[1]) && klasser.includes('page-cta')) verdi = 'side-cta';
    else if (type === 'guide-gammel' && m[1] === 'header' && klasser.includes('hero')) verdi = 'helt';
    if (verdi) omrader.push({ start: m.index, slutt: elementSlutt(innhold, m.index, m[1]), verdi });
  }
  return omrader;
}

export function byttButikkmerker(innhold, sprak, type) {
  const omrader = ctaOmrader(innhold, type);
  const bytter = [];
  for (const m of innhold.matchAll(/<div class="store-badges">/gu)) {
    const omrade = omrader.find((o) => m.index >= o.start && m.index < o.slutt);
    if (!omrade) continue;
    const slutt = elementSlutt(innhold, m.index, 'div');
    bytter.push({ start: m.index, slutt, verdi: omrade.verdi });
  }
  let ut = innhold;
  // Bytt bakfra så alle opprinnelige posisjoner fortsatt stemmer.
  for (const { start, slutt, verdi } of bytter.reverse()) {
    ut = ut.slice(0, start) + `<a class="knapp" href="/app" data-hent="${verdi}">${SKALLTEKST[sprak].innhold.knapp}</a>` + ut.slice(slutt);
  }
  return ut;
}

// Stilblokken som alle sider med fullt skall får. Generatorene skriver den samme blokken, så ingen mal lenker til et gammelt stilark.
export const STIL = '<!-- skall:stil --><link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/skall.css"><link rel="stylesheet" href="/side.css"><script src="/skall.js" defer></script><link rel="apple-touch-icon" href="/images/apple-touch-icon.png"><!-- /skall:stil -->';
const TJENESTESTIL = '<!-- skall:stil --><link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/tjeneste.css"><link rel="apple-touch-icon" href="/images/apple-touch-icon.png"><!-- /skall:stil -->';
const STILBLOKK = /<!-- skall:stil -->[\s\S]*?<!-- \/skall:stil -->/gu;
const LENKE = /<link\b[^>]*>/giu;
const INNEBYGD_STIL = /<style\b[^>]*>[\s\S]*?<\/style>/giu;

function attributt(tagg, navn) {
  return new RegExp(`\\s${navn}\\s*=\\s*(["'])(.*?)\\1`, 'iu').exec(tagg)?.[2];
}

// Velg plass før opprydding; bygg så hodet uten posisjonsforskyvninger.
function stilHode(html, tjeneste) {
  return html.replace(/<head\b[^>]*>[\s\S]*?<\/head>/iu, (hode) => {
    const gamle = [...hode.matchAll(STILBLOKK)];
    const lenker = [...hode.matchAll(LENKE)];
    const stiler = lenker.filter((m) => attributt(m[0], 'href') === '/styles.css');
    const innebygde = tjeneste ? [] : [...hode.matchAll(INNEBYGD_STIL)].filter((m) => m[0].includes('@font-face'));
    const ikoner = tjeneste ? [] : lenker.filter((m) => attributt(m[0], 'rel') === 'apple-touch-icon');
    const plass = gamle[0]?.index ?? stiler[0]?.index ?? (tjeneste
      ? lenker.find((m) => attributt(m[0], 'rel') === 'stylesheet')?.index
      : innebygde[0]?.index) ?? hode.search(/<\/head>/iu);
    const fjern = [...gamle, ...stiler, ...innebygde, ...ikoner].map((m) => ({ start: m.index, slutt: m.index + m[0].length }));
    const blokka = tjeneste ? TJENESTESTIL : STIL;
    let ut = '';
    for (let i = 0; i < hode.length;) {
      if (i === plass) ut += blokka;
      const del = fjern.find((m) => m.start === i);
      if (del) i = del.slutt;
      else ut += hode[i++];
    }
    return ut;
  });
}

function bodyAttributter(html, type, familie) {
  return html.replace(/<body\b[^>]*>/u, (body) => {
    const ren = body.replace(/\sdata-(?:sidetype|app-uttrykk|tjeneste)\s*=\s*(["'])[^]*?\1/gu, '');
    return ren.slice(0, -1) + ` data-sidetype="${type}"${familie ? ` data-tjeneste="${familie}"` : ''}>`;
  });
}

function innholdsramme(innhold, type) {
  let ut = innhold;
  // De eldre heltene står utenfor main. Behold utseende og anker, men la
  // header.topp være sidens eneste banner-landemerke. Knappene er byttet først.
  for (const { start, slutt } of ctaOmrader(innhold, type).filter((o) => o.verdi === 'helt').reverse()) {
    const helt = innhold.slice(start, slutt).replace(/^<header\b/u, '<div').replace(/<\/header>$/u, '</div>');
    ut = ut.slice(0, start) + helt + ut.slice(slutt);
  }
  // De tre eldre juridiske sidene mangler mål for hopp-lenka.
  if (!/\bid=["']hovedinnhold["']/u.test(ut)) {
    ut = ut.replace(/<main\b[^>]*>/u, (main) => attributt(main, 'id') === undefined ? main.slice(0, -1) + ' id="hovedinnhold">' : main);
  }
  return ut;
}

export function rendre(html, sti, utrullet = UTRULLET) {
  if (!erUtrullet(sti, html, utrullet)) return html;
  const n = nokkel(sti, html);
  if (n === 'tjeneste:vervekort' || n === 'tjeneste:verifisering') return html;
  const gruppe = gruppeForSti(normaliserSti(sti));
  if (n.startsWith('tjeneste:')) {
    const sprak = /^\/(sv|da|en)\//u.exec(normaliserSti(sti))?.[1] ?? Object.entries(gruppe?.sider ?? {}).find(([, href]) => normaliserSti(href) === normaliserSti(sti))?.[0] ?? 'nb';
    let ut = bodyAttributter(stilHode(html, true), 'tjeneste', tjenestefamilie(sti));
    if (gruppe) for (const plass of ['topp', 'bunn']) {
      ut = ut.replace(new RegExp(`<!-- språkvelger:${plass} -->[\\s\\S]*?<!-- /språkvelger:${plass} -->`, 'gu'), () => sprakvelger(sprak, plass, gruppe.sider));
    }
    return ut;
  }
  const d = trekkUt(html, sti);
  const velgere = gruppe ? Object.fromEntries(['topp', 'bunn'].map((plass) => [plass, sprakvelger(d.sprak, plass, gruppe.sider)])) : d.sprakvelgere;
  const kropp = bodyAttributter(stilHode(d.kropp, false), d.type);
  const innhold = innholdsramme(byttButikkmerker(d.innhold, d.sprak, d.type), d.type);
  return kropp + '<!-- skall:topp --><div class="side"><div class="kort"><div class="blad">'
    + topp(d.sprak, { sprakvelger: velgere.topp }) + '<!-- /skall:topp -->' + innhold
    + '<!-- skall:bunn --></div>' + hylledel(d.sprak, { guider: d.guider }) + '</div>'
    + morkBunn(d.sprak, { sprakvelger: velgere.bunn, samtykkelenke: d.harSiteJs })
    + nedlasting(d.sprak) + (d.banner ?? (d.harSiteJs ? samtykke(d.sprak) : ''))
    + '</div><!-- /skall:bunn -->' + d.hale;
}

export function kjor(rot, utrullet = UTRULLET, { forhandsvis: mal } = {}) {
  if (mal !== undefined) return forhandsvis(rot, utrullet, mal);
  const endrede = [];
  for (const s of alleSider(rot)) {
    const fil = join(rot, s.fil);
    if (!trygtUnderRot(rot, fil)) continue;
    const html = readFileSync(fil, 'utf8');
    const ut = rendre(html, s.sti, utrullet);
    if (ut === html || !trygtUnderRot(rot, fil)) continue;
    writeFileSync(fil, ut);
    endrede.push(s.fil);
  }
  return endrede;
}

// Nye mål finnes ikke ennå. Kontroller nærmeste eksisterende forelder før
// mkdir, og selve fila hvis den finnes (lstat oppdager også brutte symlenker).
function trygtSkrivemal(rot, fil) {
  let eksisterende = resolve(fil);
  while (!lstatSync(eksisterende, { throwIfNoEntry: false })) eksisterende = dirname(eksisterende);
  return eksisterende === resolve(rot) || trygtUnderRot(rot, eksisterende);
}

function skrivForhandsvisning(rot, fil, innhold) {
  if (!trygtSkrivemal(rot, fil)) return false;
  mkdirSync(dirname(fil), { recursive: true });
  if (!trygtUnderRot(rot, dirname(fil)) || !trygtSkrivemal(rot, fil)) return false;
  writeFileSync(fil, innhold);
  return true;
}

// Kildesidene røres ikke. Både kilder, speilede mål og kartet må bli under rot.
export function forhandsvis(rot, utrullet = UTRULLET, mal = 'qa/forhandsvisning') {
  const utrot = resolve(rot, mal);
  const rel = relative(resolve(rot), utrot).split('\\').join('/');
  if (!rel.startsWith('qa/') || rel.includes('../')) throw new Error('Forhåndsvisningen må ligge i en undermappe av qa');
  const eksempler = new Set(Object.values(EKSEMPEL).flatMap(Object.values));
  const familier = new Set();
  const valgte = alleSider(rot).filter((s) => {
    if (!trygtUnderRot(rot, join(rot, s.fil))) return false;
    if (s.type !== 'tjeneste') return eksempler.has(s.sti);
    if (s.nokkel === 'tjeneste:verifisering' || !erUtrullet(s.sti, readFileSync(join(rot, s.fil), 'utf8'), utrullet)) return false;
    const eksempel = `${s.nokkel}:${s.sprak}`;
    if (familier.has(eksempel)) return false;
    familier.add(eksempel);
    return true;
  });
  // Rendring fullføres før skriving, så en feil ikke etterlater et halvt nytt kart.
  const sider = valgte.flatMap((s) => {
    const fil = join(rot, s.fil);
    if (!trygtUnderRot(rot, fil)) return [];
    const html = readFileSync(fil, 'utf8');
    // Forsidene har allerede sitt eget skall fra scripts/forside.mjs.
    let ut = ['/', '/sv/', '/da/', '/en/'].includes(s.sti) ? html : rendre(html, s.sti, new Set([...utrullet, s.nokkel]));
    ut = ut.replace(/<meta\b[^>]*\bname\s*=\s*(["'])robots\1[^>]*>/giu, '')
      .replace(/<\/head>/iu, '<meta name="robots" content="noindex"></head>')
      .replace(/<script\b[^>]*\bsrc\s*=\s*(["'])\/locale\.js\1[^>]*>\s*<\/script>/giu, '');
    return [{ s, ut }];
  });
  const kart = sider.flatMap(({ s, ut }) => {
    const fil = join(utrot, s.fil);
    if (!skrivForhandsvisning(rot, fil, ut)) return [];
    return [{ sti: s.sti, url: `/${rel}${s.sti}`, type: s.type, sprak: s.sprak }];
  });
  skrivForhandsvisning(rot, join(utrot, 'kart.json'), JSON.stringify(kart, null, 2) + '\n');
  return kart;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rot = fileURLToPath(new URL('..', import.meta.url));
  const args = process.argv.slice(2);
  if (args.length === 0) console.log(`skall-paa: ${kjor(rot).length} sider oppdatert`);
  else if (args.length === 2 && args[0] === '--forhandsvis') console.log(`skall-paa: ${kjor(rot, UTRULLET, { forhandsvis: args[1] }).length} forhåndsvisninger skrevet`);
  else { console.error('Bruk: node scripts/skall-paa.mjs [--forhandsvis qa/forhandsvisning]'); process.exitCode = 1; }
}
