import { createHash } from 'node:crypto';
import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { datafil, lesJson, lesLogg, skrivJson } from './filer.mjs';
import { hentBestillingskilder } from './kilder.mjs';
import { byggLenker } from './lenker.mjs';
import {
  kanPublisereDenneUken,
  osloDato,
  skalSperre,
  tellAvvisningerPåRad,
} from './modus.mjs';
import { lesNettsted, slugify } from './nettsted.mjs';
import { skrivOffentlig } from './offentlig.mjs';
import {
  lesPrivat,
  lesSeoDataNokkel,
  skrivPrivat,
} from './privat.mjs';
import {
  ArtikkelSkjema,
  BestillingSkjema,
  GranskSkjema,
  lesData,
} from './skjema.mjs';
import { sjekkFast } from './vern.mjs';
import { BLOGGROT } from '../scripts/blogg.mjs';

const REPO_ROT = new URL('../', import.meta.url);
const SPRAK = ['nb', 'sv', 'da', 'en'];

export function artikkelSha256(fil) {
  return createHash('sha256').update(readFileSync(fil)).digest('hex');
}

function lesJsonKrevd(fil) {
  return JSON.parse(readFileSync(fil, 'utf8'));
}

function lesSpråkfiler(rot) {
  return Object.fromEntries(SPRAK.map((sprak) => [sprak, lesData(`sprak/${sprak}.json`, rot)]));
}

function lesAutoArtikler(rot) {
  const artikler = [];
  for (const sprak of SPRAK) {
    const mappe = new URL(`blogg-kilde/auto/${sprak}/`, rot);
    if (!existsSync(mappe)) continue;
    for (const navn of readdirSync(mappe).filter((fil) => fil.endsWith('.json')).sort()) {
      const fil = new URL(navn, mappe);
      const artikkel = lesJson(fil, null);
      if (!artikkel) continue;
      artikler.push({ ...artikkel, sti: `${BLOGGROT[sprak]}${artikkel.slug}/`, fil });
    }
  }
  return artikler;
}

function rensSeksjon(seksjon) {
  return Object.fromEntries(
    ['type', 'overskrift', 'tekst', 'rader', 'punkter']
      .filter((nokkel) => Object.hasOwn(seksjon, nokkel))
      .map((nokkel) => [nokkel, seksjon[nokkel]]),
  );
}

function rensArtikkel(artikkel) {
  const renset = {};
  const skalarer = [
    'sprak', 'emne_id', 'slug', 'tittel', 'meta', 'ingress', 'appkobling', 'publisert',
  ];
  for (const nokkel of skalarer) {
    if (Object.hasOwn(artikkel, nokkel)) renset[nokkel] = artikkel[nokkel];
  }
  if (Array.isArray(artikkel.seksjoner)) renset.seksjoner = artikkel.seksjoner.map(rensSeksjon);
  for (const nokkel of ['faq', 'pastander', 'tagger', 'kilder', 'lenker', 'lesOgså']) {
    if (Array.isArray(artikkel[nokkel])) renset[nokkel] = artikkel[nokkel];
  }
  return renset;
}

function vernkode(grunn) {
  return `vern-${slugify(grunn) || 'avvist'}`;
}

function skrivLeveringslogg(rot, logg) {
  skrivOffentlig(rot, 'logg', `${logg.dato}.json`, logg);
}

function avvisLevering(rot, { bestilling, artikkel, dato, statuskode, grunnkoder, grunner }) {
  const filnavn = `${dato}-${bestilling.slug}.json`;
  skrivOffentlig(rot, 'avvist', filnavn, {
    dato,
    sprak: bestilling.sprak,
    slug: bestilling.slug,
    emne_id: bestilling.emne_id,
    grunnkoder,
    granskingsgrunner: grunner,
    artikkel: rensArtikkel(artikkel),
  });
  const logg = {
    dato,
    modus: 'lokal',
    resultat: 'avvist',
    statuskode,
    grunnkoder,
    sprak: bestilling.sprak,
    slug: bestilling.slug,
    bestilling_id: `${bestilling.dato}-${bestilling.sprak}-${bestilling.slug}`,
    antall: { avvist: 1 },
  };
  skrivLeveringslogg(rot, logg);
  if (skalSperre(tellAvvisningerPåRad(lesLogg(rot)))) {
    const sperrekode = 'tre-avvisninger-pa-rad';
    skrivOffentlig(rot, 'sperre', 'sperre.json', { dato, grunnkode: sperrekode });
    logg.resultat = 'sperret';
    logg.statuskode = sperrekode;
    logg.grunnkoder = [...grunnkoder, sperrekode];
    skrivLeveringslogg(rot, logg);
  }
  return { exitCode: 1, statuskode, slug: bestilling.slug, grunner };
}

function ugyldigInndata() {
  return { exitCode: 2, statuskode: 'ugyldig-inndata' };
}

export async function lever({
  bestillingFil,
  artikkelFil,
  granskingFil,
  rot = REPO_ROT,
  nokkel,
  hent,
  tid = new Date(),
  grenser: grenserOverstyring,
  beholdBestilling = false,
}) {
  let bestilling;
  let artikkel;
  try {
    bestilling = BestillingSkjema.parse(lesJsonKrevd(bestillingFil));
    artikkel = lesJsonKrevd(artikkelFil);
    if (!artikkel || typeof artikkel !== 'object' || Array.isArray(artikkel)) return ugyldigInndata();
  } catch {
    return ugyldigInndata();
  }
  const dato = osloDato(tid);
  const identitetStemmer = artikkel.sprak === bestilling.sprak
    && artikkel.emne_id === bestilling.emne_id
    && artikkel.slug === bestilling.slug
    && bestilling.appkoblinger.includes(artikkel.appkobling);
  if (!identitetStemmer) {
    return avvisLevering(rot, {
      bestilling,
      artikkel,
      dato,
      statuskode: 'artikkel-matcher-ikke-bestilling',
      grunnkoder: ['artikkel-matcher-ikke-bestilling'],
      grunner: [],
    });
  }

  const grenser = grenserOverstyring ?? lesData('grenser.json', rot);
  const publisertFil = datafil(rot, 'publisert.json');
  const publisert = lesJson(publisertFil, []);
  if (!kanPublisereDenneUken(publisert, tid, grenser.artiklerMaksPerUke)) {
    return avvisLevering(rot, {
      bestilling,
      artikkel,
      dato,
      statuskode: 'ukentlig-grense',
      grunnkoder: ['ukentlig-grense'],
      grunner: [],
    });
  }

  const kilder = lesData('kilder.json', rot);
  let kildeutdrag;
  try {
    kildeutdrag = await hentBestillingskilder(bestilling, kilder, hent);
  } catch {
    kildeutdrag = [];
  }
  if (kildeutdrag.length !== bestilling.kilde_ider.length) {
    return avvisLevering(rot, {
      bestilling,
      artikkel,
      dato,
      statuskode: 'kilder-ingen-utdrag',
      grunnkoder: ['kilder-ingen-utdrag'],
      grunner: [],
    });
  }
  const artikkelMedKilder = { ...artikkel, kilder: kildeutdrag };
  const språkfiler = lesSpråkfiler(rot);
  const fast = sjekkFast(artikkelMedKilder, {
    nettsted: lesNettsted(rot),
    forbudt: lesData('forbudt.json', rot),
    sprakfiler: språkfiler,
    grenser,
  });
  if (!fast.ok) {
    const grunnkoder = fast.grunner.map(vernkode);
    return avvisLevering(rot, {
      bestilling,
      artikkel: artikkelMedKilder,
      dato,
      statuskode: grunnkoder[0],
      grunnkoder,
      grunner: fast.grunner,
    });
  }

  if (!granskingFil || !existsSync(granskingFil)) {
    return avvisLevering(rot, {
      bestilling,
      artikkel: artikkelMedKilder,
      dato,
      statuskode: 'gransking-mangler',
      grunnkoder: ['gransking-mangler'],
      grunner: [],
    });
  }
  let gransking;
  try {
    gransking = GranskSkjema.parse(lesJsonKrevd(granskingFil));
  } catch {
    return ugyldigInndata();
  }
  if (gransking.artikkel_sha256 !== artikkelSha256(artikkelFil)) {
    return avvisLevering(rot, {
      bestilling,
      artikkel: artikkelMedKilder,
      dato,
      statuskode: 'gransking-gjelder-annen-versjon',
      grunnkoder: ['gransking-gjelder-annen-versjon'],
      grunner: gransking.grunner,
    });
  }
  if (gransking.beslutning !== 'GODKJENT') {
    return avvisLevering(rot, {
      bestilling,
      artikkel: artikkelMedKilder,
      dato,
      statuskode: 'gransking-avvist',
      grunnkoder: ['gransking-avvist'],
      grunner: gransking.grunner,
    });
  }

  const sti = `${BLOGGROT[artikkel.sprak]}${artikkel.slug}/`;
  const eksisterende = lesAutoArtikler(rot);
  const sprakfil = språkfiler[artikkel.sprak];
  const lenker = byggLenker(eksisterende, { ...artikkelMedKilder, sti, sprakfil });
  const levert = ArtikkelSkjema.parse({
    ...artikkelMedKilder,
    lenker: lenker.nyLenker,
    publisert: dato,
  });
  for (const gammel of eksisterende) {
    const nyLenke = lenker.lesOgså.get(gammel.slug);
    if (!nyLenke) continue;
    const { fil, sti: _sti, ...lagret } = gammel;
    lagret.lesOgså = [
      ...(lagret.lesOgså ?? []).filter((lenke) => lenke.sti !== nyLenke.sti),
      nyLenke,
    ];
    skrivJson(fil, lagret);
  }
  skrivJson(new URL(`blogg-kilde/auto/${levert.sprak}/${levert.slug}.json`, rot), levert);
  publisert.push({
    dato,
    emne_id: levert.emne_id,
    sprak: levert.sprak,
    slug: levert.slug,
    sti,
  });
  skrivOffentlig(rot, 'publisert', 'publisert.json', publisert);
  const privat = lesPrivat(datafil(rot, 'privat.enc'), nokkel);
  privat.emneko = privat.emneko.filter((emne) => emne.id !== levert.emne_id);
  skrivPrivat(datafil(rot, 'privat.enc'), privat, nokkel);
  skrivLeveringslogg(rot, {
    dato,
    modus: 'lokal',
    resultat: 'levert',
    statuskode: 'levert',
    grunnkoder: [],
    sprak: levert.sprak,
    slug: levert.slug,
    bestilling_id: `${bestilling.dato}-${bestilling.sprak}-${bestilling.slug}`,
    antall: { levert: 1 },
  });
  if (!beholdBestilling) rmSync(bestillingFil);
  return { exitCode: 0, statuskode: 'levert', slug: levert.slug };
}

async function cli() {
  const argumenter = process.argv.slice(2);
  const tørt = argumenter.includes('--tørt');
  const posisjonelle = argumenter.filter((verdi, indeks) => (
    verdi !== '--tørt'
    && verdi !== '--gransking'
    && argumenter[indeks - 1] !== '--gransking'
  ));
  const granskingIndeks = argumenter.indexOf('--gransking');
  const bestillingFil = posisjonelle[0] ? resolve(posisjonelle[0]) : null;
  const artikkelFil = posisjonelle[1] ? resolve(posisjonelle[1]) : null;
  const granskingFil = granskingIndeks >= 0 && argumenter[granskingIndeks + 1]
    ? resolve(argumenter[granskingIndeks + 1])
    : null;
  if (!bestillingFil || !artikkelFil) {
    process.stdout.write(`${JSON.stringify(ugyldigInndata())}\n`);
    process.exitCode = 2;
    return;
  }
  let nokkel;
  try {
    nokkel = lesSeoDataNokkel({ tørt, tillatNokkelring: !tørt });
  } catch (feil) {
    const resultat = { exitCode: 2, statuskode: feil.kode ?? 'ugyldig-inndata' };
    process.stdout.write(`${JSON.stringify(resultat)}\n`);
    process.exitCode = 2;
    return;
  }
  const resultat = await lever({
    bestillingFil,
    artikkelFil,
    granskingFil,
    rot: REPO_ROT,
    nokkel,
    hent: tørt
      ? async () => ({
        status: 200,
        tekst: readFileSync(new URL('./test/fixtures/lever/kilde.html', import.meta.url), 'utf8'),
      })
      : async (url) => {
        const svar = await fetch(url);
        return { status: svar.status, tekst: await svar.text() };
      },
    grenser: tørt ? { ...lesData('grenser.json', REPO_ROT), brodtekstMinOrd: 20 } : undefined,
    beholdBestilling: tørt,
  });
  process.stdout.write(`${JSON.stringify({
    exitCode: resultat.exitCode,
    statuskode: resultat.statuskode,
    ...(resultat.slug ? { slug: resultat.slug } : {}),
  })}\n`);
  for (const grunn of resultat.grunner ?? []) process.stderr.write(`${grunn}\n`);
  process.exitCode = resultat.exitCode;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await cli();
}
