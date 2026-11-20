// Hvilke sider revisjonen åpner. Utvalget følger ÉTT predikat, erUtrullet() fra
// sideregisteret, så en side revideres akkurat når den er rullet ut til nytt skall.
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { alleSider, erGenerertFamilie, erUtrullet, tjenestefamilie, EKSEMPEL, BLOGGINDEKS, TYPER, UTRULLET } from '../../../scripts/sidetyper.mjs';

const ROT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const KART_STANDARD = join(ROT, 'qa', 'forhandsvisning', 'kart.json');

// Forsiden har nytt skall fra før (forside-løpet) og står ikke i UTRULLET. Bare «/» er klar.
const FORSIDE_KLAR = '/';
const VERIFISERING = 'tjeneste:verifisering';

let cache = null;
function sider() {
  if (!cache) {
    cache = alleSider(ROT).map((s) => ({ ...s, html: readFileSync(join(ROT, s.fil), 'utf8') }));
  }
  return cache;
}

function klar(side, utrullet) {
  if (side.nokkel === VERIFISERING) return false;
  if (side.type === 'forside') return side.sti === FORSIDE_KLAR;
  return erUtrullet(side.sti, side.html, utrullet);
}

const rad = (side) => ({ sti: side.sti, url: side.sti, type: side.type, sprak: side.sprak, fulltSkall: side.type !== 'tjeneste' });

/** Rekkefølgen på stiene i eksempelsidene, uten verifiseringsfiler. */
export function eksempelStier() {
  return new Set(Object.values(EKSEMPEL).flatMap((sprak) => Object.values(sprak)));
}

/** Rader fra qa/forhandsvisning/kart.json (lages av skall-paa --forhandsvis). */
function forhandsvisning(utrullet, KART = KART_STANDARD) {
  // En manglende eller tom kart.json må aldri gi en grønn revisjon uten sider.
  if (!existsSync(KART)) throw new Error(`REVISJON=forhandsvisning, men ${KART} mangler. Kjør skall-paa --forhandsvis først.`);
  const kart = JSON.parse(readFileSync(KART, 'utf8'));
  if (!Array.isArray(kart) || kart.length === 0) throw new Error(`REVISJON=forhandsvisning, men ${KART} er tom. Kjør skall-paa --forhandsvis først.`);
  return kart
    .filter((r) => r.type !== 'tjeneste' || utrullet.has(`tjeneste:${tjenestefamilie(r.sti)}`))
    .map((r) => ({ sti: r.sti, url: r.url, type: r.type, sprak: r.sprak, fulltSkall: r.type !== 'tjeneste' }));
}

// PR-utvalget: tre sider per generert familie og språk, og høyst 40 endrede per familie og språk.
export const PER_FAMILIE = 3;
export const ENDRET_TAK = 40;
const sha = (sti) => createHash('sha1').update(sti).digest('hex');
const etterSha = (a, b) => (sha(a.sti) < sha(b.sti) ? -1 : sha(a.sti) > sha(b.sti) ? 1 : 0);

function lesEndret() {
  const fil = process.env.REVISJON_ENDRET;
  if (!fil || !existsSync(fil)) return [];
  return readFileSync(fil, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
}

function prUtvalg(klare, endret, eks, bloggindeks) {
  const valgt = new Map();
  const ta = (s) => valgt.set(s.sti, s);
  // 1. Alt som ikke er en generert familie.
  for (const s of klare) if (!erGenerertFamilie(s.familie)) ta(s);
  // 2. De første per generert familie og språk, sortert på sha1 av stien.
  const perFamilie = Map.groupBy(klare.filter((s) => erGenerertFamilie(s.familie)), (s) => `${s.familie}|${s.sprak}`);
  for (const liste of perFamilie.values()) for (const s of [...liste].sort(etterSha).slice(0, PER_FAMILIE)) ta(s);
  // 3. Eksempelsidene, forsiden og bloggindeksene.
  for (const s of klare) if (eks.has(s.sti) || s.sti === FORSIDE_KLAR || bloggindeks.has(s.sti)) ta(s);
  // 4. Endrede sider, med tak per generert familie og språk. Filer som ikke finnes lenger, eller ikke er sider, hoppes over.
  const filer = new Set(endret);
  const endredeKlare = klare.filter((s) => filer.has(s.fil));
  const endretPerFamilie = Map.groupBy(endredeKlare, (s) => (erGenerertFamilie(s.familie) ? `${s.familie}|${s.sprak}` : null));
  for (const [nokkel, liste] of endretPerFamilie) {
    for (const s of nokkel === null ? liste : [...liste].sort(etterSha).slice(0, ENDRET_TAK)) ta(s);
  }
  return [...valgt.values()].sort((a, b) => (a.sti < b.sti ? -1 : a.sti > b.sti ? 1 : 0));
}

/**
 * @param {{ revisjon?: string, endret?: string[], sprak?: string, utrullet?: Set<string>, kart?: string }} valg
 *   kart: sti til forhåndsvisningskartet (standard qa/forhandsvisning/kart.json; tester bruker en midlertidig).
 * @returns {{ sti: string, url: string, type: string, sprak: string, fulltSkall: boolean }[]}
 */
export function utvalg({
  revisjon = process.env.REVISJON,
  sprak = process.env.REVISJON_SPRAK,
  utrullet = UTRULLET,
  kart = KART_STANDARD,
  endret = undefined,
} = {}) {
  const medSprak = (rader) => (sprak ? rader.filter((r) => r.sprak === sprak) : rader);
  if (revisjon === 'forhandsvisning') return medSprak(forhandsvisning(utrullet, kart));
  const klare = sider().filter((s) => klar(s, utrullet));
  if (revisjon === 'pr') {
    const eks = eksempelStier();
    const bloggUte = klare.some((s) => s.type === 'blogg');
    const bloggindeks = new Set(bloggUte ? Object.values(BLOGGINDEKS) : []);
    return medSprak(prUtvalg(klare, endret ?? lesEndret(), eks, bloggindeks).map(rad));
  }
  if (revisjon === 'alle') return medSprak(klare.map(rad));
  if (revisjon && TYPER.includes(revisjon)) return medSprak(klare.filter((s) => s.type === revisjon).map(rad));
  if (revisjon) throw new Error(`Ukjent REVISJON: ${revisjon}`);

  // Standard: eksempelsidene som er klare, pluss forsiden og bloggindeksen når blogg er rullet ut.
  const eks = eksempelStier();
  const bloggUte = sider().some((s) => s.type === 'blogg' && klar(s, utrullet));
  const bloggindeks = new Set(bloggUte ? Object.values(BLOGGINDEKS) : []);
  const valgt = klare.filter((s) => eks.has(s.sti) || s.sti === FORSIDE_KLAR || bloggindeks.has(s.sti));
  return medSprak(valgt.map(rad));
}

/** Typer der minst én side er klar. */
export function utrulledeTyper(utrullet = UTRULLET) {
  return TYPER.filter((t) => sider().some((s) => s.type === t && klar(s, utrullet)));
}
