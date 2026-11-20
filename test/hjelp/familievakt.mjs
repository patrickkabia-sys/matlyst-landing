// Vaktene for alle sidefamilier (scripts/familier/). Hver vakt er en ren funksjon, så testen kan vise at den blir rød.
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare, validerData } from '../../scripts/familier/felles.mjs';
import { SPRAKMAPPE, familieSider } from '../../scripts/familier/register.mjs';
import { NORSKE_RESTORD } from './restord.mjs';

const ENTITETER = { '&nbsp;': ' ', '&#160;': ' ', '&#8239;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
const avkod = (t) => t.replace(/&(?:nbsp|amp|lt|gt|quot|#160|#8239|#39);/gu, (e) => ENTITETER[e]);
const TAGG = String.raw`<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^'">])*?)(\/?)>`;
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

// Attributter leseren ser, eller som styrer det leseren ser (kalkulatorens data bor i data-*).
const SYNLIG_ATTR = /\s(?:value|placeholder|aria-label|title|alt|content|data-[\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/giu;

function erSkjult(attr) {
  return /(?:^|\s)hidden(?=[\s=/]|$)/iu.test(attr)
    || /(?:^|\s)aria-hidden\s*=\s*["']?true["']?/iu.test(attr)
    || /(?:^|\s)style\s*=\s*(?:"[^"]*"|'[^']*')/iu.test(attr) && /(?:display\s*:\s*none|visibility\s*:\s*hidden)/iu.test(attr)
    || /(?:^|\s)class\s*=\s*["'][^"']*(?:^|[\s"'])skjult(?=[\s"'])/iu.test(attr);
}

/** Fjerner elementer som er skjult (hidden, aria-hidden, display:none, visibility:hidden, klassen skjult) med alt innhold. */
export function utenSkjult(html) {
  let ut = '';
  let pos = 0;
  let skjuler = null;
  for (const m of String(html).matchAll(new RegExp(TAGG, 'gu'))) {
    const [hel, lukk, navn0, attr, selvlukk] = m;
    const navn = navn0.toLowerCase();
    if (skjuler === null) {
      ut += html.slice(pos, m.index);
      if (!lukk && erSkjult(attr)) {
        if (!VOID.has(navn) && !selvlukk) skjuler = { navn, dybde: 1 };
      } else ut += hel;
    } else if (navn === skjuler.navn && !VOID.has(navn) && !selvlukk) {
      skjuler.dybde += lukk ? -1 : 1;
      if (skjuler.dybde === 0) skjuler = null;
    }
    pos = m.index + hel.length;
  }
  return skjuler === null ? ut + html.slice(pos) : ut;
}

/** HTML til tekst, men med verdiene i attributter som leseren ser og innholdet i application/json-skript med. ld+json, stil og vanlige skript holdes utenfor. */
export function htmlTilTekst(html, { attributter = true } = {}) {
  const s = String(html).replace(/<!--[\s\S]*?-->/gu, ' ');
  const json = [...s.matchAll(/<script\b[^>]*\btype\s*=\s*["']application\/json["'][^>]*>([\s\S]*?)<\/script>/giu)].map((m) => m[1]);
  const uten = s.replace(/<script\b[\s\S]*?<\/script>/giu, ' ').replace(/<style\b[\s\S]*?<\/style>/giu, ' ');
  const attr = [...uten.matchAll(SYNLIG_ATTR)].map((m) => m[1] ?? m[2]);
  return avkod([uten.replace(/<[^>]+>/gu, ' '), ...(attributter ? [...attr, ...json] : [])].join(' '));
}

const TEKSTFELT = ['title', 'description', 'h1', 'eyebrow', 'topp', 'lead', 'forst', 'stegTittel', 'alternativ', 'grense', 'faqTittel', 'rik', 'cta'];
const delerAv = (side) => [
  ...TEKSTFELT.map((f) => side[f]),
  ...(side.steg ?? []).flat(),
  ...(side.faq ?? []).flat(),
  ...(side.seksjoner ?? []).flat(),
].filter((d) => typeof d === 'string');

/** Alt leseren kan se på siden (også skjult tekst, så tallvakten ser den), som tekst. */
export function synligTekst(side) {
  return delerAv(side).map(htmlTilTekst).join(' ').replace(/\s+/gu, ' ').trim();
}

/** Samme felt som HTML, til likhetsvakten (som selv fjerner skjult tekst). */
export const sideHtml = (side) => delerAv(side).join(' ');

const BROKTEGN = '½⅓⅔¼¾⅛⅜⅝⅞';
const TALL = new RegExp(String.raw`\d{1,3}(?:[   ]\d{3})+(?:[.,]\d+)?(?:\/\d+)?|\d+(?:[.,]\d+)?(?:\/\d+)?|[${BROKTEGN}]`, 'gu');
const utenRom = (t) => t.replace(/[   ]/gu, '');

/**
 * Hvert tall i synlig tekst som ikke står i `tillatte`. «1 200» (vanlig eller hardt mellomrom) er ett tall og
 * sammenlignes uten mellomrom, «1/2» er ett symbol, og brøktegn (½ osv.) er symboler som må være tillatt.
 */
export function tallUtenforData(side, tillatte) {
  const godkjent = new Set([...tillatte].map(utenRom));
  return (synligTekst(side).match(TALL) ?? []).map(utenRom).filter((t) => !godkjent.has(t));
}

const ord = (tekst) => htmlTilTekst(utenSkjult(tekst), { attributter: false }).toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
const femmere = (tekst) => {
  const o = ord(tekst);
  return new Set(Array.from({ length: Math.max(0, o.length - 4) }, (_, i) => o.slice(i, i + 5).join(' ')));
};

/**
 * For hver side: andelen ordfemmere som ikke finnes på noen annen side i lista.
 * Sider under terskelen returneres. En side uten én eneste ordfemmer regnes som 0 (ingenting eget).
 * Terskelen 0,2 er et startpunkt; familie 1 måler den mot ekte sider og senker den aldri for å få grønt.
 */
export function forLike(sider, terskel = 0.2) {
  const sett = sider.map((s) => femmere(s.tekst));
  const iAntallSider = new Map();
  for (const f of sett) for (const g of f) iAntallSider.set(g, (iAntallSider.get(g) ?? 0) + 1);
  return sider.map((s, i) => {
    const alle = sett[i];
    const unik = alle.size === 0 ? 0 : [...alle].filter((g) => iAntallSider.get(g) === 1).length / alle.size;
    return { sti: s.sti, unik };
  }).filter((r) => r.unik < terskel);
}

/** Radens egne navn (navn, ord, variant, slug og postnavn), de som maskeres i `maskertUnik`. */
const maskeTekst = (tekst, navn) => {
  let t = htmlTilTekst(utenSkjult(tekst), { attributter: false }).toLowerCase();
  const alle = [...new Set(navn.filter((n) => typeof n === 'string' && n.trim()).map((n) => n.toLowerCase().trim()))].sort((a, b) => b.length - a.length);
  for (const n of alle) t = t.split(n).join(' vare ');
  return (t.match(/[\p{L}\p{N}]+/gu) ?? []).map((w) => (/^\d+$/u.test(w) ? '#' : w));
};
const femmereAv = (ord) => new Set(Array.from({ length: Math.max(0, ord.length - 4) }, (_, i) => ord.slice(i, i + 5).join(' ')));

/**
 * Som forLike, men etter at hver sides egne navn er byttet med «vare» og alle tall med «#». Viser hvor mye av en side som er annet enn
 * mal med innsatt navn og tall. `sider`: { sti, tekst, navn: string[] }. Gir alle sidene, laveste unike andel først. Ingen terskel.
 */
export function maskertUnik(sider) {
  const sett = sider.map((s) => femmereAv(maskeTekst(s.tekst, s.navn ?? [])));
  const antall = new Map();
  for (const f of sett) for (const g of f) antall.set(g, (antall.get(g) ?? 0) + 1);
  return sider.map((s, i) => ({ sti: s.sti, unik: sett[i].size === 0 ? 0 : [...sett[i]].filter((g) => antall.get(g) === 1).length / sett[i].size }))
    .sort((a, b) => a.unik - b.unik);
}

/**
 * Duplikater: sider i samme marked med identisk maskert tekst OG identiske datatall (`data`, en tekst som beskriver grunntall og porsjoner).
 * Det er samme side to ganger med bare navnet byttet, og skal være én side. Gir grupper av stier.
 */
export function maskertDuplikater(sider) {
  const grupper = new Map();
  for (const s of sider) {
    const nokkel = `${maskeTekst(s.tekst, s.navn ?? []).join(' ')}|${s.data ?? ''}`;
    grupper.set(nokkel, [...(grupper.get(nokkel) ?? []), s.sti]);
  }
  return [...grupper.values()].filter((g) => g.length > 1);
}

/** Datatallene til en rad som tekst: alle tall med verdi og merknad, sortert. Brukes av duplikatvakten. */
export const datatall = (rad) => JSON.stringify(Object.values(rad.tall).map((t) => `${t.verdi}|${t.merknad ?? ''}`).sort());

/** Grupper av stier med samme verdi i feltet (små og store bokstaver og ytre mellomrom teller ikke). */
export function dupliserte(sider, felt) {
  const perVerdi = new Map();
  for (const s of sider) {
    const v = String(s[felt] ?? '').trim().toLowerCase();
    perVerdi.set(v, [...(perVerdi.get(v) ?? []), s.sti]);
  }
  return [...perVerdi.values()].filter((g) => g.length > 1);
}

// Går gjennom alt under mappa uten å følge symlenker (lstat). Symlenker, av alle slag, samles for seg.
function skann(mappe) {
  const filer = [];
  const lenker = [];
  const gaa = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isSymbolicLink()) lenker.push(full);
      else if (e.isDirectory()) gaa(full);
      else if (e.name.endsWith('.html')) filer.push(full);
    }
  };
  gaa(mappe);
  return { filer, lenker };
}
const erLenke = (sti) => { try { return lstatSync(sti).isSymbolicLink(); } catch { return false; } };
const finnes = (sti) => { try { lstatSync(sti); return true; } catch { return false; } };

/**
 * Samsvar mellom data og filer. manglerFil: publiserbare rader (og samlesiden) uten fil på disk.
 * manglerRad: HTML-fil under familiens rot som ikke hører til en publiserbar rad. Alt under en familierot
 * skal komme fra datafila: en håndskrevet fil, en fil for et utkast og en gammel fil etter at en rad er
 * fjernet gir alle manglerRad. symlenker: enhver symlenke (fil eller mappe) under familierota, eller i
 * selve stien ned til den, er en feil og regnes aldri som en side. Stiene er relative til `rotmappe`.
 */
export function sideMotData(familie, rotmappe) {
  const manglerFil = [];
  const manglerRad = [];
  const symlenker = [];
  const rel = (f) => relative(rotmappe, f);
  for (const [marked, { rot }] of Object.entries(familie.markeder)) {
    const mappe = join(rotmappe, SPRAKMAPPE[marked], rot);
    // Hvert ledd fra språkmappa og ned til familierota.
    let sti = rotmappe;
    let brutt = false;
    for (const ledd of join(SPRAKMAPPE[marked], rot).split('/').filter(Boolean)) {
      sti = join(sti, ledd);
      if (erLenke(sti)) { symlenker.push(rel(sti)); brutt = true; break; }
    }
    if (brutt) continue;
    const forventet = new Map([[join(mappe, 'index.html'), 'samleside']]);
    for (const rad of publiserbare(lesData(fileURLToPath(familie.mappe), marked))) forventet.set(join(mappe, rad.slug, 'index.html'), rad.id);
    const { filer, lenker } = existsSync(mappe) ? skann(mappe) : { filer: [], lenker: [] };
    symlenker.push(...lenker.map(rel));
    for (const fil of forventet.keys()) if (!finnes(fil)) manglerFil.push(rel(fil));
    for (const fil of filer) if (!forventet.has(fil)) manglerRad.push(rel(fil));
  }
  const sortert = (l) => [...new Set(l)].sort();
  return { manglerFil: sortert(manglerFil), manglerRad: sortert(manglerRad), symlenker: sortert(symlenker) };
}

// Kontrollerer at fila på disk har sidens title, h1 og lead (rått eller HTML-kodet, slik generatorene skriver dem).
const htmlKodet = (t) => t.replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/"/gu, '&quot;').replace(/'/gu, '&#39;');
const harTekst = (html, tekst) => typeof tekst === 'string' && (html.includes(tekst) || html.includes(htmlKodet(tekst)));

/** Feil når vaktene har sett færre sider enn de som skal finnes. */
export const antallFeil = (kontrollert, forventet) => (kontrollert < forventet ? [`kontrollerte ${kontrollert} av ${forventet} sider som skal finnes`] : []);

/**
 * Kjører alle vaktene for hver familie og marked. Gir `feil` (lesbare linjer, tom når alt er i orden)
 * `kontrollert` (antall sider vaktene faktisk så på) og `forventet` (samleside pluss publiserbare rader per marked),
 * så en test kan kreve at vaktene ikke hoppet over noe.
 */
export async function kontrollerFamilier(familier, rotmappe) {
  const feil = [];
  let kontrollert = 0;
  let forventet = 0;
  for (const familie of familier) {
    if (Object.keys(familie.markeder ?? {}).length === 0) feil.push(`${familie.id}: familien har ingen markeder`);
    for (const marked of Object.keys(familie.markeder)) {
      const navn = `${familie.id}/${marked}`;
      const data = (() => {
        try { return lesData(fileURLToPath(familie.mappe), marked); } catch (e) { feil.push(`${navn}: ${e.message}`); return null; }
      })();
      if (!data) continue;
      try { validerData(data); } catch (e) { feil.push(`${navn}: ${e.message}`); continue; }
      const sider = await familieSider(marked, [{ ...familie, markeder: { [marked]: familie.markeder[marked] } }]);
      const mal = await import(new URL(`mal-${marked}.mjs`, familie.mappe));
      const rader = publiserbare(data);
      forventet += 1 + rader.length;
      // Samlesiden bruker malens egen liste når den har en (tillatteTallNav); ellers er den foreningen av radenes lister.
      const navTillatte = typeof mal.tillatteTallNav === 'function' ? mal.tillatteTallNav(data) : new Set(rader.flatMap((r) => [...mal.tillatteTall(r, data)]));
      const liste = Object.entries(sider).map(([nokkel, side]) => ({ sti: nokkel, ...side, tekst: sideHtml(side) }));
      for (const s of liste) {
        kontrollert += 1;
        const rad = rader.find((r) => s.sti === `${familie.markeder[marked].rot}${r.slug}/`);
        for (const t of tallUtenforData(s, rad ? mal.tillatteTall(rad, data) : navTillatte)) feil.push(`${navn}: tall utenfor data på ${s.sti}: ${t}`);
        if (marked !== 'nb' && NORSKE_RESTORD.test(synligTekst(s))) feil.push(`${navn}: norsk restord på ${s.sti}`);
        // Innholdsvaktene ser på malobjektene; her sjekkes at fila på disk faktisk bærer det malen ga.
        const fil = join(rotmappe, SPRAKMAPPE[marked], s.sti, 'index.html');
        if (finnes(fil) && !erLenke(fil)) {
          const html = readFileSync(fil, 'utf8');
          const mangler = ['title', 'h1', 'lead'].filter((felt) => !harTekst(html, s[felt]));
          if (mangler.length) feil.push(`${navn}: filen ${relative(rotmappe, fil)} mangler ${mangler.join(', ')} fra malen`);
        }
      }
      // Duplikater (lik maskert tekst og like datatall) og likhet etter maskering. Siste er en opplysning, ikke en terskel (se maskertUnik).
      const maskert = liste.map((x) => { const rad = rader.find((r) => x.sti === `${familie.markeder[marked].rot}${r.slug}/`); return { sti: x.sti, tekst: x.tekst, navn: rad ? [rad.navn, rad.slug, rad.tekst?.variant, rad.tekst?.usdaNavn, rad.tekst?.usdaNavn2, rad.tekst?.matvaretabell, ...(mal.maskeNavn?.(rad) ?? [])] : [], data: rad ? datatall(rad) : x.sti }; });
      for (const g of maskertDuplikater(maskert)) feil.push(`${navn}: samme side to ganger med bare navnet byttet (lik maskert tekst og like datatall): ${g.join(', ')}`);
      for (const r of forLike(liste)) feil.push(`${navn}: for lik de andre sidene: ${r.sti} (${r.unik.toFixed(2)} unik)`);
      for (const felt of ['title', 'h1', 'description']) for (const g of dupliserte(liste, felt)) feil.push(`${navn}: lik ${felt} på ${g.join(', ')}`);
      const m = sideMotData({ ...familie, markeder: { [marked]: familie.markeder[marked] } }, rotmappe);
      for (const f of m.manglerFil) feil.push(`${navn}: rad uten fil: ${f}`);
      for (const f of m.manglerRad) feil.push(`${navn}: fil uten rad: ${f}`);
      for (const f of m.symlenker) feil.push(`${navn}: symlenke: ${f}`);
    }
  }
  feil.push(...antallFeil(kontrollert, forventet));
  return { feil, kontrollert, forventet };
}
