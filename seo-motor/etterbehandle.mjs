import { execFile } from 'node:child_process';
import {
  existsSync,
  rmSync,
} from 'node:fs';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';

import {
  datafil,
  lesJson,
  lesLogg,
  skrivJson,
} from './filer.mjs';
import { skalSperre, tellAvvisningerPåRad } from './modus.mjs';
import { nattrapport, postRapport, ukerapport } from './rapport.mjs';

const REPO_ROT = new URL('../', import.meta.url);
const SPRAK = ['nb', 'sv', 'da', 'en'];
const MANDAG = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Oslo',
  weekday: 'short',
});

function meldinger(rot) {
  return lesJson(datafil(rot, 'sprak/nb.json'), {}).motor;
}

export function avvis(rot, { byggutfall, dato, slug }) {
  const tekst = meldinger(rot);
  const grunn = byggutfall === 'failure' ? tekst.nettstedbyggFeilet : tekst.npmTestFeilet;
  const artikkelfil = SPRAK
    .map((sprak) => new URL(`blogg-kilde/auto/${sprak}/${slug}.json`, rot))
    .find((fil) => existsSync(fil));
  if (artikkelfil) {
    const artikkel = lesJson(artikkelfil, null);
    skrivJson(datafil(rot, `avvist/${dato}-${slug}.json`), { artikkel, grunner: [grunn] });
    rmSync(artikkelfil);
  }

  const publisertFil = datafil(rot, 'publisert.json');
  const publisert = lesJson(publisertFil, []).filter((rad) => rad.slug !== slug);
  skrivJson(publisertFil, publisert);

  const loggfil = datafil(rot, `logg/${dato}.json`);
  const logg = lesJson(loggfil, {});
  logg.resultat = 'avvist';
  logg.grunner = [grunn];
  delete logg.sti;
  skrivJson(loggfil, logg);

  if (skalSperre(tellAvvisningerPåRad(lesLogg(rot)))) {
    skrivJson(datafil(rot, 'sperre.json'), { dato, grunn: tekst.sperre });
    logg.resultat = 'sperret';
    logg.grunner.push(tekst.sperre);
    skrivJson(loggfil, logg);
  }
  return logg;
}

export function levering(rot, {
  dato,
  modus,
  prutfall,
  prUrl,
  publiseringsutfall,
  slug,
}) {
  const tekst = meldinger(rot);
  const loggfil = datafil(rot, `logg/${dato}.json`);
  const logg = lesJson(loggfil, {});
  if (logg.resultat === 'publisert' && modus === 'på' && publiseringsutfall !== 'success') {
    logg.resultat = 'feil';
    logg.grunner = [tekst.pushMainFeilet];
  }
  if (logg.resultat === 'publisert' && modus === 'utkast' && prutfall !== 'success') {
    logg.resultat = 'feil';
    logg.grunner = [tekst.utkastPrFeilet];
    const publisertFil = datafil(rot, 'publisert.json');
    const publisert = lesJson(publisertFil, []).filter((rad) => rad.slug !== slug);
    skrivJson(publisertFil, publisert);
  }
  if (prUrl) {
    logg.resultat = 'utkast';
    logg.prUrl = prUrl;
  }
  skrivJson(loggfil, logg);
  return logg;
}

export function pushfeil(rot, { dato, modus, motorresultat }) {
  const tekst = meldinger(rot);
  const loggfil = datafil(rot, `logg/${dato}.json`);
  const logg = lesJson(loggfil, {});
  const publisering = modus === 'på' && motorresultat === 'publisert';
  logg.resultat = 'feil';
  logg.grunner = [publisering ? tekst.pushArtikkelOgStatusFeilet : tekst.pushStatusFeilet];
  skrivJson(loggfil, logg);
  return logg;
}

export function ukekostnad(rot, sluttdato) {
  const sluttdag = new Date(`${sluttdato}T12:00:00Z`);
  const start = new Date(sluttdag);
  start.setUTCDate(start.getUTCDate() - 6);
  const startdato = start.toISOString().slice(0, 10);
  return lesLogg(rot)
    .filter((rad) => rad.dato >= startdato && rad.dato <= sluttdato)
    .reduce((sum, rad) => sum + (rad.kostnadUsd ?? 0), 0);
}

export function lagRapporttekst(rot, dato) {
  const logg = lesJson(datafil(rot, `logg/${dato}.json`), {});
  let tekst = nattrapport(logg);
  const dag = new Date(`${dato}T12:00:00Z`);
  if (MANDAG.format(dag) === 'Mon') {
    tekst += `\n${ukerapport({
      ytelse: logg.ytelse ?? [],
      ko: lesJson(datafil(rot, 'emnekø.json'), []),
      kostnadUke: ukekostnad(rot, dato),
    })}`;
  }
  return tekst;
}

export async function rapporter(rot, { dato, gh }) {
  const språk = lesJson(datafil(rot, 'sprak/nb.json'), {});
  await postRapport(lagRapporttekst(rot, dato), {
    issueTittel: språk.rapport.issueTittel,
    gh,
  });
}

async function cli() {
  const steg = process.argv[2];
  if (steg === 'avvis') {
    avvis(REPO_ROT, {
      byggutfall: process.env.BYGGUTFALL,
      dato: process.env.DATO,
      slug: process.env.SLUG,
    });
    return;
  }
  if (steg === 'levering') {
    levering(REPO_ROT, {
      dato: process.env.DATO,
      modus: process.env.MODUS,
      prutfall: process.env.PRUTFALL,
      prUrl: process.env.PR_URL,
      publiseringsutfall: process.env.PUBLISERINGSUTFALL,
      slug: process.env.SLUG,
    });
    return;
  }
  if (steg === 'pushfeil') {
    pushfeil(REPO_ROT, {
      dato: process.env.DATO,
      modus: process.env.MODUS,
      motorresultat: process.env.MOTORRESULTAT,
    });
    return;
  }
  if (steg === 'rapport') {
    const kjør = promisify(execFile);
    const gh = async (args) => (await kjør('gh', args)).stdout.trim();
    await rapporter(REPO_ROT, { dato: process.env.DATO, gh });
    return;
  }
  process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await cli();
}
