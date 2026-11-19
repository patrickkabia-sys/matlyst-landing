// Hvilke sider revisjonen åpner. Utvalget følger ÉTT predikat, erUtrullet() fra
// sideregisteret, så en side revideres akkurat når den er rullet ut til nytt skall.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { alleSider, erUtrullet, tjenestefamilie, EKSEMPEL, BLOGGINDEKS, TYPER, UTRULLET } from '../../../scripts/sidetyper.mjs';

const ROT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const KART = join(ROT, 'qa', 'forhandsvisning', 'kart.json');

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
function forhandsvisning(utrullet) {
  // En manglende eller tom kart.json må aldri gi en grønn revisjon uten sider.
  if (!existsSync(KART)) throw new Error(`REVISJON=forhandsvisning, men ${KART} mangler. Kjør skall-paa --forhandsvis først.`);
  const kart = JSON.parse(readFileSync(KART, 'utf8'));
  if (!Array.isArray(kart) || kart.length === 0) throw new Error(`REVISJON=forhandsvisning, men ${KART} er tom. Kjør skall-paa --forhandsvis først.`);
  return kart
    .filter((r) => r.type !== 'tjeneste' || utrullet.has(`tjeneste:${tjenestefamilie(r.sti)}`))
    .map((r) => ({ sti: r.sti, url: r.url, type: r.type, sprak: r.sprak, fulltSkall: r.type !== 'tjeneste' }));
}

/**
 * @param {{ revisjon?: string, sprak?: string, utrullet?: Set<string> }} valg
 * @returns {{ sti: string, url: string, type: string, sprak: string, fulltSkall: boolean }[]}
 */
export function utvalg({
  revisjon = process.env.REVISJON,
  sprak = process.env.REVISJON_SPRAK,
  utrullet = UTRULLET,
} = {}) {
  const medSprak = (rader) => (sprak ? rader.filter((r) => r.sprak === sprak) : rader);
  if (revisjon === 'forhandsvisning') return medSprak(forhandsvisning(utrullet));
  const klare = sider().filter((s) => klar(s, utrullet));
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
