import { normaliserSti, sidetype, tjenestefamilie } from './sidetyper.mjs';
import { SKALLTEKST } from './skall-tekst.mjs';

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
