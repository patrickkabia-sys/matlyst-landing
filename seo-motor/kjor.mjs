import {
  existsSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { pathToFileURL } from 'node:url';

import { hentForslag } from './forslag.mjs';
import { datafil, lesJson } from './filer.mjs';
import { hentGsc } from './gsc.mjs';
import {
  kanPublisereDenneUken,
  kanPublisere,
  lesModus,
  osloDato,
} from './modus.mjs';
import { lesNettsted } from './nettsted.mjs';
import { lesOffentlig, skrivOffentlig } from './offentlig.mjs';
import {
  lesPrivat,
  lesSeoDataNokkel,
  skrivPrivat,
  utledEmneIdNokkel,
} from './privat.mjs';
import { lesData } from './skjema.mjs';
import { byggKo, emneId, lagBestilling } from './sokeord.mjs';
import { velgEmne } from './velg.mjs';

const REPO_ROT = new URL('../', import.meta.url);
const SPRAK = ['nb', 'sv', 'da', 'en'];
const MANDAG = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Oslo',
  weekday: 'short',
});

function lesSpråkfiler(rot) {
  return Object.fromEntries(SPRAK.map((sprak) => [sprak, lesData(`sprak/${sprak}.json`, rot)]));
}

function periodedato(tid, dagerTilbake) {
  const dato = new Date(`${osloDato(tid)}T12:00:00Z`);
  dato.setUTCDate(dato.getUTCDate() - dagerTilbake);
  return dato.toISOString().slice(0, 10);
}

function lesBestillinger(rot) {
  const mappe = datafil(rot, 'bestillinger/');
  if (!existsSync(mappe)) return [];
  return readdirSync(mappe)
    .filter((navn) => navn.endsWith('.json'))
    .sort()
    .map((navn) => lesOffentlig(new URL(navn, mappe), null))
    .filter(Boolean);
}

function skrivLogg(rot, logg) {
  return skrivOffentlig(rot, 'logg', `${logg.dato}.json`, logg);
}

function logggrunnlag(dato, modus) {
  return {
    dato,
    modus,
    resultat: 'feil',
    statuskode: 'motor-feil',
    grunnkoder: [],
    antall: { gsc: 0, forslag: 0, ko: 0, bestillinger: 0 },
  };
}

function nøklePrivatEmneko(privat, emneIdNokkel) {
  let endret = false;
  const emneko = privat.emneko.map((emne) => {
    const id = emneId(emneIdNokkel, emne.sprak, emne.sokeord);
    if (id === emne.id) return emne;
    endret = true;
    return { ...emne, id };
  });
  return endret ? { ...privat, emneko } : privat;
}

async function oppdaterMandag({
  tid,
  dato,
  avh,
  rot,
  nokkel,
  emneIdNokkel,
  privat,
  språkfiler,
}) {
  if (privat.forslagKjoringer[dato]) return privat;
  privat.forslagKjoringer[dato] = { status: 'startet', antallFrø: 0 };
  skrivPrivat(datafil(rot, 'privat.enc'), privat, nokkel);

  let gsc;
  try {
    gsc = await avh.gsc({
      tjenestekonto: avh.miljø?.GSC_SERVICE_ACCOUNT_JSON
        ?? process.env.GSC_SERVICE_ACCOUNT_JSON,
      nettsted: 'sc-domain:matlyst-app.no',
      fra: periodedato(tid, 28),
      til: periodedato(tid, 1),
    });
  } catch (feil) {
    const trygg = new Error('gsc-feil');
    trygg.kode = 'gsc-feil';
    trygg.httpStatus = feil?.response?.status ?? feil?.status ?? null;
    throw trygg;
  }

  const forslagRå = [];
  const forslagKandidater = [];
  let antallFrø = 0;
  for (const sprak of SPRAK) {
    const resultat = await avh.forslag({ sprak, språkfil: språkfiler[sprak] });
    forslagRå.push({ sprak, svar: resultat.rå });
    forslagKandidater.push(...resultat.kandidater);
    antallFrø += språkfiler[sprak]['forslagsfrø'].length;
  }

  const nettsted = lesNettsted(rot);
  const forbudt = lesData('forbudt.json', rot);
  const publisert = lesOffentlig(datafil(rot, 'publisert.json'), []);
  const bestillinger = lesBestillinger(rot);
  const brukt = [...publisert, ...bestillinger];
  const gscKandidater = gsc.map((rad) => ({ ...rad, kilde: 'gsc' }));
  const { ko } = byggKo({
    kandidater: [...gscKandidater, ...forslagKandidater],
    språkfiler,
    nettsted,
    forbudt,
    brukt,
    emneIdNokkel,
  });
  const perId = new Map([
    ...privat.emneko.map((emne) => [emne.id, emne]),
    ...ko.map((emne) => [emne.id, emne]),
  ]);
  const brukteSlugs = new Set(brukt.map(({ slug }) => slug).filter(Boolean));
  privat.emneko = [...perId.values()]
    .filter((emne) => !brukteSlugs.has(emne.slug))
    .sort((a, b) => b.score - a.score);
  privat.gsc = [{ dato, rader: gsc }];
  privat.forslag = [{ dato, svar: forslagRå }];
  privat.ytelse = [{
    dato,
    antall: gsc.length,
    klikk: gsc.reduce((sum, rad) => sum + (rad.klikk ?? 0), 0),
    visninger: gsc.reduce((sum, rad) => sum + (rad.visninger ?? 0), 0),
  }];
  privat.forslagKjoringer[dato] = { status: 'fullfort', antallFrø };
  skrivPrivat(datafil(rot, 'privat.enc'), privat, nokkel);
  return privat;
}

function tryggFeilkode(feil) {
  return typeof feil?.kode === 'string' ? feil.kode : 'motor-feil';
}

export async function kjor({ tid, modus, tørt, avh }) {
  const rot = avh.rot ?? REPO_ROT;
  const dato = osloDato(tid);
  const grunnmodus = lesModus({ variabel: modus, sperre: null });
  if (grunnmodus === 'av') return { dato, modus: 'av', resultat: 'av', statuskode: 'modus-av' };

  let aktivModus = grunnmodus;
  const logg = logggrunnlag(dato, aktivModus);
  try {
    const nokkel = avh.nokkel ?? lesSeoDataNokkel({
      tørt,
      tillatNokkelring: false,
      miljø: avh.miljø ?? process.env,
    });
    const emneIdNokkel = utledEmneIdNokkel(nokkel);
    const sperre = lesOffentlig(datafil(rot, 'sperre.json'), null);
    aktivModus = lesModus({ variabel: modus, sperre });
    logg.modus = aktivModus;
    const språkfiler = lesSpråkfiler(rot);
    const lestPrivat = lesPrivat(datafil(rot, 'privat.enc'), nokkel);
    let privat = nøklePrivatEmneko(lestPrivat, emneIdNokkel);
    if (privat !== lestPrivat) skrivPrivat(datafil(rot, 'privat.enc'), privat, nokkel);
    if (MANDAG.format(tid) === 'Mon') {
      privat = await oppdaterMandag({
        tid,
        dato,
        avh,
        rot,
        nokkel,
        emneIdNokkel,
        privat,
        språkfiler,
      });
    }

    const publisert = lesOffentlig(datafil(rot, 'publisert.json'), []);
    const bestillinger = lesBestillinger(rot);
    const grenser = lesData('grenser.json', rot);
    logg.antall = {
      gsc: privat.gsc.at(-1)?.rader?.length ?? 0,
      forslag: privat.forslag.at(-1)?.svar?.reduce((sum, rad) => (
        sum + rad.svar.reduce((språksum, frø) => språksum + frø.forslag.length, 0)
      ), 0) ?? 0,
      ko: privat.emneko.length,
      bestillinger: bestillinger.length,
    };
    if (!kanPublisere(publisert, tid) || bestillinger.some((rad) => rad.dato === dato)) {
      logg.resultat = 'tom';
      logg.statuskode = 'daglig-grense';
      skrivLogg(rot, logg);
      return logg;
    }
    if (!kanPublisereDenneUken(publisert, tid, grenser.artiklerMaksPerUke)) {
      logg.resultat = 'tom';
      logg.statuskode = 'ukentlig-grense';
      skrivLogg(rot, logg);
      return logg;
    }

    const emne = velgEmne(privat.emneko, [...publisert, ...bestillinger]);
    if (!emne) {
      logg.resultat = 'tom';
      logg.statuskode = 'ko-tom';
      skrivLogg(rot, logg);
      return logg;
    }
    const bestilling = lagBestilling(emne, språkfiler[emne.sprak], grenser, dato);
    const bestillingId = `${dato}-${emne.sprak}-${bestilling.slug}`;
    skrivOffentlig(rot, 'bestilling', `${bestillingId}.json`, bestilling);
    logg.resultat = 'bestilling';
    logg.statuskode = 'bestilling-opprettet';
    logg.sprak = emne.sprak;
    logg.slug = bestilling.slug;
    logg.bestilling_id = bestillingId;
    logg.antall.bestillinger += 1;
    skrivLogg(rot, logg);
    return logg;
  } catch (feil) {
    logg.modus = aktivModus;
    logg.resultat = 'feil';
    logg.statuskode = tryggFeilkode(feil);
    if (Number.isInteger(feil?.httpStatus)) logg.http_status = feil.httpStatus;
    skrivLogg(rot, logg);
    return logg;
  }
}

function torrAvhengigheter(rot) {
  const fixture = lesJson(new URL('seo-motor/test/fixtures/tørt/api.json', rot), {});
  return {
    rot,
    gsc: async () => fixture.gsc ?? [],
    forslag: async ({ språkfil, sprak }) => {
      const rå = [];
      const kandidater = [];
      for (const frø of språkfil['forslagsfrø']) {
        const verdier = fixture.forslag?.[frø.tekst] ?? [];
        rå.push({ frø: frø.tekst, forslag: verdier });
        for (const sokeord of verdier) {
          kandidater.push({
            sokeord,
            sprak,
            frø,
            forslagAntall: verdier.length,
            kilde: 'forslag',
          });
        }
      }
      return { rå, kandidater };
    },
  };
}

function ekteAvhengigheter(rot) {
  return {
    rot,
    miljø: process.env,
    gsc: hentGsc,
    forslag: ({ sprak, språkfil }) => hentForslag({
      sprak,
      språkfil,
      hent: async (url) => {
        const svar = await fetch(url);
        return { status: svar.status, data: await svar.json() };
      },
    }),
  };
}

async function cli() {
  const tørt = process.argv.includes('--tørt');
  const modus = tørt ? (process.env.SEO_AUTOPILOT ?? 'utkast') : process.env.SEO_AUTOPILOT;
  const fixtureTid = tørt
    ? lesJson(new URL('seo-motor/test/fixtures/tørt/api.json', REPO_ROT), {}).tid
    : null;
  const avh = tørt ? torrAvhengigheter(REPO_ROT) : ekteAvhengigheter(REPO_ROT);
  const logg = await kjor({
    tid: fixtureTid ? new Date(fixtureTid) : new Date(),
    modus,
    tørt,
    avh,
  });
  const resultat = {
    dato: logg.dato,
    resultat: logg.resultat,
    modus: logg.modus,
    statuskode: logg.statuskode,
    ...(logg.bestilling_id ? { bestilling_id: logg.bestilling_id } : {}),
    ...(logg.slug ? { slug: logg.slug } : {}),
    ...(logg.http_status ? { http_status: logg.http_status } : {}),
    ...(logg.antall ? { antall: logg.antall } : {}),
  };
  writeFileSync(new URL('../seo-resultat.json', import.meta.url), `${JSON.stringify(resultat, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(resultat)}\n`);
  if (logg.resultat === 'feil') process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await cli();
}
