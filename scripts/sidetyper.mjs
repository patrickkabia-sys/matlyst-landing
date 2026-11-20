// Sideregisteret: hvilken type hver publiserbare HTML-fil har, og ÉT predikat for
// hva som er rullet ut til nytt skall og ny grunnstil. Rendereren, testvaktene og
// revisjonen bruker bare erUtrullet(), aldri UTRULLET direkte.
// Reglene ser aldri på rammen (nav/footer), bare på stien og på innholdsklassene.
import { readdirSync, readFileSync, realpathSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { SIDEGRUPPER, gruppeForSti } from './locale-sider.mjs';
import { ENHETER } from './enheter.mjs';
import { familieForSti } from './familier/register.mjs';

export const TYPER = Object.freeze(['forside', 'omregner', 'guide-lang', 'guide-kort', 'guide-gammel', 'blogg', 'juss', 'tjeneste']);

const FORSIDER = new Set(['/', '/sv/', '/da/', '/en/']);
const JURIDISKE_GRUPPER = new Set(['personvern', 'vilkar', 'slett-konto']);
const OMREGNER_ROTER = ['/verktoy/', '/sv/verktyg/', '/da/vaerktoejer/', '/en/tools/'];
const GAMLE_GUIDER = new Set(['/importer-fra-matprat/', '/finn-oppskrifter/', '/hva-kan-jeg-lage/', '/skapere/']);
const TJENESTEGRUPPER = { avmeld: 'avmeld', 'tiktok-auth': 'auth', 'tiktok-stotte': 'kampanje', christine: 'kampanje' };
const VERIFISERING = new Set(['/googleeaf5ec75e707227b.html', '/pinterest-55ce57abd0b250c89348ecc452354dac.html']);

// Alle innganger normaliserer stien likt: uten spørring og anker, med ledende
// skråstrek, og «x», «x/» og «x/index.html» er samme side. .html-filer som
// /personvern.html beholdes som de er.
export function normaliserSti(sti) {
  let s = String(sti).replace(/[?#].*$/u, '');
  if (!s.startsWith('/')) s = `/${s}`;
  if (s.endsWith('/index.html')) s = s.slice(0, -'index.html'.length);
  if (!s.endsWith('/') && !s.endsWith('.html')) s += '/';
  return s;
}

export function tjenestefamilie(rasti) {
  const sti = normaliserSti(rasti);
  const gruppe = gruppeForSti(sti);
  if (gruppe && TJENESTEGRUPPER[gruppe.id]) return TJENESTEGRUPPER[gruppe.id];
  if (/^(\/(sv|da|en))?\/v\/$/u.test(sti)) return 'vervekort';
  if (sti === '/bekreft/') return 'bekreft';
  if (sti === '/app/') return 'app';
  if (sti === '/404.html') return 'feil';
  if (VERIFISERING.has(sti)) return 'verifisering';
  return null;
}

// Rekkefølgen er regelen: blogg må sjekkes før has-toc, siden en bloggartikkel
// kan inneholde begge.
export function sidetypeEllerNull(rasti, html) {
  const sti = normaliserSti(rasti);
  if (FORSIDER.has(sti)) return 'forside';
  if (tjenestefamilie(sti) !== null) return 'tjeneste';
  if (JURIDISKE_GRUPPER.has(gruppeForSti(sti)?.id)) return 'juss';
  if (OMREGNER_ROTER.some((rot) => sti.startsWith(rot))) return 'omregner';
  if (GAMLE_GUIDER.has(sti)) return 'guide-gammel';
  if (html.includes('class="blogg-artikkel') || html.includes('class="blogg-kort"')) return 'blogg';
  if (html.includes('class="prose locale-prose has-toc"')) return 'guide-lang';
  if (html.includes('class="locale-page-hero"')) return 'guide-kort';
  return null;
}

export function sidetype(sti, html) {
  const type = sidetypeEllerNull(sti, html);
  if (type === null) throw new Error(`Ukjent sidetype: ${sti}`);
  return type;
}

export function nokkel(rastisti, html) {
  const type = sidetypeEllerNull(rastisti, html);
  if (type === null) return null;
  return type === 'tjeneste' ? `tjeneste:${tjenestefamilie(rastisti)}` : type;
}

// Familie: finere inndeling enn nøkkelen, så revisjonen kan ta et utvalg per familie.
// Enhetsomregnerne deles etter enhetsgruppe (volum, vekt, lengde, temperatur), hubbene er «nav».
// Gruppe-id er auto-enhet-<fra>-<til>, og enhets-id kan selv ha bindestrek («oz-vekt»),
// så paret slås opp mot ENHETER i stedet for å splittes på bindestrek.
const ENHETSGRUPPE_FRA_ID = (() => {
  const kart = new Map();
  for (const fra of Object.keys(ENHETER)) {
    for (const til of Object.keys(ENHETER)) {
      if (fra !== til && ENHETER[fra].gruppe === ENHETER[til].gruppe) kart.set(`auto-enhet-${fra}-${til}`, ENHETER[fra].gruppe);
    }
  }
  return kart;
})();

export function familie(sti, html) {
  // Datadrevne familier (scripts/familier/) først: alt under familiens rot er familien.
  const registrert = familieForSti(normaliserSti(sti));
  if (registrert !== null) return `fam:${registrert}`;
  const n = nokkel(sti, html);
  if (n !== 'omregner') return n;
  const gruppe = ENHETSGRUPPE_FRA_ID.get(gruppeForSti(normaliserSti(sti))?.id);
  return gruppe ? `omregner:${gruppe}` : 'omregner:nav';
}

// Genererte familier får et utvalg i stedet for alle sidene på PR-er.
export function erGenerertFamilie(fam) {
  return (typeof fam === 'string') && ((fam.startsWith('omregner:') && fam !== 'omregner:nav') || fam.startsWith('fam:'));
}

// Oppgave 10 til 18 legger til nøkler. 'tjeneste:verifisering' legges aldri til.
export const UTRULLET = new Set(['omregner', 'guide-lang', 'guide-kort', 'blogg', 'guide-gammel', 'juss', 'tjeneste:avmeld', 'tjeneste:bekreft', 'tjeneste:vervekort', 'tjeneste:auth', 'tjeneste:app', 'tjeneste:kampanje', 'tjeneste:feil']);

export function erUtrullet(sti, html, utrullet = UTRULLET) {
  const n = nokkel(sti, html);
  return n !== null && utrullet.has(n);
}

// 'seo' står utenfor brevets liste, men mappen har bare .md-filer og ingen publiserbar HTML.
const HOPP_OVER = new Set(['node_modules', 'docs', 'test', 'scripts', 'seo-motor', 'seo-data', 'seo',
    'blogg-kilde', 'qa', 'test-results', 'playwright-report']);

// Sant bare når fila (etter at symlenker er løst) ligger inne i rota. Mangler fila, er svaret nei.
export function trygtUnderRot(rot, fil) {
  try {
    return realpathSync(fil).startsWith(realpathSync(rot) + sep);
  } catch {
    return false;
  }
}

function htmlFiler(mappe) {
  const ut = [];
  for (const oppforing of readdirSync(mappe, { withFileTypes: true })) {
    if (oppforing.name.startsWith('.') || HOPP_OVER.has(oppforing.name)) continue;
    // Symlenker følges aldri: de kan peke ut av rota.
    if (oppforing.isSymbolicLink()) continue;
    const full = join(mappe, oppforing.name);
    if (oppforing.isDirectory()) ut.push(...htmlFiler(full));
    else if (oppforing.name.endsWith('.html')) ut.push(full);
  }
  return ut;
}

function stiForFil(fil) {
  if (fil === 'index.html') return '/';
  if (fil.endsWith('/index.html')) return `/${fil.slice(0, -'index.html'.length)}`;
  return `/${fil}`;
}

function sprakForSti(sti) {
  const m = /^\/(sv|da|en)(\/|$)/u.exec(sti);
  return m ? m[1] : 'nb';
}

function leseSiderIntern(rot, tillatUkjent) {
  return htmlFiler(rot).sort().map((full) => {
    const fil = relative(rot, full).split('\\').join('/');
    const sti = stiForFil(fil);
    const html = readFileSync(full, 'utf8');
    const type = tillatUkjent ? sidetypeEllerNull(sti, html) : sidetype(sti, html);
    return { sti, fil, sprak: sprakForSti(sti), type, nokkel: nokkel(sti, html), familie: type === null ? null : familie(sti, html) };
  });
}

// Ukjent sidetype kaster.
export function alleSider(rot) {
  return leseSiderIntern(rot, false);
}

// Ukjente sider får type og nøkkel null i stedet for å kaste.
export function alleSiderMedUkjente(rot) {
  return leseSiderIntern(rot, true);
}

function gruppeSider(id) {
  const gruppe = SIDEGRUPPER.find((g) => g.id === id);
  if (!gruppe) throw new Error(`Mangler sidegruppe ${id}`);
  return { ...gruppe.sider };
}

export const EKSEMPEL = Object.freeze({
  forside: gruppeSider('forside'),
  omregner: gruppeSider('auto-enhet-cups-dl'),
  'guide-lang': gruppeSider('instagram-oppskrifter'),
  'guide-kort': gruppeSider('ukemeny'),
  'guide-gammel': { nb: '/finn-oppskrifter/' },
  blogg: gruppeSider('blogg-eggtest'),
  juss: gruppeSider('personvern'),
  tjeneste: gruppeSider('avmeld'),
});

export const BLOGGINDEKS = Object.freeze({ ...gruppeSider('blogg') });
