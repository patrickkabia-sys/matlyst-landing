import {
  existsSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { pathToFileURL } from 'node:url';

import { lagKlient } from './claude.mjs';
import { hentDataForSeo } from './dataforseo.mjs';
import {
  datafil,
  lesJson,
  lesLogg,
  skrivJson,
} from './filer.mjs';
import { granskArtikkel } from './gransk.mjs';
import { hentGsc } from './gsc.mjs';
import { hentUtdrag } from './kilder.mjs';
import { byggLenker } from './lenker.mjs';
import {
  kanPublisere,
  lesModus,
  osloDato,
  skalSperre,
  tellAvvisningerPåRad,
} from './modus.mjs';
import { lesNettsted, slugify } from './nettsted.mjs';
import { lesData } from './skjema.mjs';
import { skrivArtikkel } from './skriv.mjs';
import { byggKo, vurderPassform } from './sokeord.mjs';
import { velgEmne } from './velg.mjs';
import { sjekkFast } from './vern.mjs';
import { BLOGGROT } from '../scripts/blogg.mjs';

const REPO_ROT = new URL('../', import.meta.url);
const SPRAK = ['nb', 'sv', 'da', 'en'];
const MANDAG = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Oslo',
  weekday: 'short',
});

function lesSprakfiler(rot) {
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
      artikler.push({
        ...artikkel,
        sti: `${BLOGGROT[sprak]}${artikkel.slug}/`,
        fil,
      });
    }
  }
  return artikler;
}

function periodedato(tid, dagerTilbake) {
  const dato = new Date(`${osloDato(tid)}T12:00:00Z`);
  dato.setUTCDate(dato.getUTCDate() - dagerTilbake);
  return dato.toISOString().slice(0, 10);
}

async function oppdaterKo({ tid, avh, rot, klient, grenser, publisert, nettsted, forbudt }) {
  const dato = osloDato(tid);
  const tellerFil = datafil(rot, `logg/dataforseo-${dato}.json`);
  const teller = lesJson(tellerFil, { uke: dato, foresporsler: 0 });
  const gscKandidater = await avh.gsc({
    tjenestekonto: process.env.GSC_SERVICE_ACCOUNT_JSON,
    nettsted: 'sc-domain:matlyst-app.no',
    fra: periodedato(tid, 28),
    til: periodedato(tid, 1),
  });
  const fro = lesData('frø.json', rot);
  const dataforseoKandidater = [];
  for (const [sprak, ord] of Object.entries(fro)) {
    const igjen = grenser.dataforseoMaksForesporslerPerUke - teller.foresporsler;
    if (igjen <= 0) break;
    const valgte = ord.slice(0, igjen);
    if (valgte.length === 0) continue;
    teller.foresporsler += valgte.length;
    skrivJson(tellerFil, teller);
    const land = { nb: 'nor', sv: 'swe', da: 'dnk', en: 'usa' }[sprak];
    dataforseoKandidater.push(...await avh.dataforseo({
      login: process.env.DATAFORSEO_LOGIN,
      passord: process.env.DATAFORSEO_PASSWORD,
      frø: valgte,
      land,
      tak: valgte.length,
    }));
  }
  const kandidater = [...gscKandidater, ...dataforseoKandidater];
  let ko = [];
  if (kandidater.length > 0) {
    const mal = readFileSync(datafil(rot, 'instrukser/passform.md'), 'utf8');
    const passform = await vurderPassform(klient, kandidater, mal);
    ({ ko } = byggKo({
      kandidater,
      passform,
      nettsted,
      forbudt,
      grenser,
      brukt: publisert,
    }));
  }
  skrivJson(datafil(rot, 'emnekø.json'), ko);
  return ko;
}

function lagreAvvist(rot, dato, slug, innhold) {
  skrivJson(datafil(rot, `avvist/${dato}-${slug}.json`), innhold);
}

function avsluttMedLogg(rot, logg, meldinger) {
  skrivJson(datafil(rot, `logg/${logg.dato}.json`), logg);
  if (logg.resultat === 'avvist') {
    const historikk = lesLogg(rot);
    if (skalSperre(tellAvvisningerPåRad(historikk))) {
      skrivJson(datafil(rot, 'sperre.json'), {
        dato: logg.dato,
        grunn: meldinger.sperre,
      });
      logg.resultat = 'sperret';
      logg.grunner = [...(logg.grunner ?? []), meldinger.sperre];
      skrivJson(datafil(rot, `logg/${logg.dato}.json`), logg);
    }
  }
  return logg;
}

export async function kjor({ tid, modus, tørt, avh }) {
  const rot = avh.rot ?? REPO_ROT;
  const dato = osloDato(tid);
  const grunnmodus = lesModus({ variabel: modus, sperre: null });
  if (grunnmodus === 'av') {
    return { dato, modus: 'av', resultat: 'av', kostnadUsd: 0 };
  }

  const logg = {
    dato,
    modus: grunnmodus,
    resultat: 'feil',
    kostnadUsd: 0,
  };
  let meldinger;
  try {
    meldinger = lesData('sprak/nb.json', rot).motor;
    const sperre = lesJson(datafil(rot, 'sperre.json'), null);
    logg.modus = lesModus({ variabel: modus, sperre });
    const publisert = lesJson(datafil(rot, 'publisert.json'), []);
    const grenser = lesData('grenser.json', rot);
    const forbudt = lesData('forbudt.json', rot);
    const nettsted = lesNettsted(rot);
    let ko = lesJson(datafil(rot, 'emnekø.json'), []);
    if (MANDAG.format(tid) === 'Mon') {
      ko = await oppdaterKo({
        tid,
        avh,
        rot,
        klient: avh.klient,
        grenser,
        publisert,
        nettsted,
        forbudt,
      });
    }
    if (!kanPublisere(publisert, tid)) {
      logg.resultat = 'tom';
      logg.grunner = [meldinger.alleredePublisert];
      return avsluttMedLogg(rot, logg, meldinger);
    }

    const emne = velgEmne(ko, publisert);
    if (!emne) {
      logg.resultat = 'tom';
      logg.grunner = [meldinger.tomKo];
      return avsluttMedLogg(rot, logg, meldinger);
    }
    logg.emne = emne.sokeord;
    logg.sprak = emne.sprak;

    const kilder = lesData('kilder.json', rot);
    const utdrag = await hentUtdrag(emne, kilder, avh.hent);
    if (utdrag.length === 0) {
      const slug = slugify(emne.sokeord);
      logg.resultat = 'avvist';
      logg.slug = slug;
      logg.grunner = [meldinger.ingenKilder];
      lagreAvvist(rot, dato, slug, { emne, grunner: logg.grunner });
      return avsluttMedLogg(rot, logg, meldinger);
    }

    const sprakfiler = lesSprakfiler(rot);
    const sprakfil = sprakfiler[emne.sprak];
    const skrivMal = readFileSync(datafil(rot, 'instrukser/skriv.md'), 'utf8');
    const skrevet = await skrivArtikkel(avh.klient, { emne, utdrag, sprakfil, mal: skrivMal });
    logg.kostnadUsd += skrevet.kostnadUsd;
    const artikkel = {
      ...skrevet.artikkel,
      publisert: dato,
      kilder: utdrag.map(({ id, url }) => ({ id, url })),
    };
    logg.slug = artikkel.slug;
    logg.tittel = artikkel.tittel;

    const fast = sjekkFast(artikkel, { nettsted, forbudt, sprakfiler, grenser });
    if (!fast.ok) {
      logg.resultat = 'avvist';
      logg.grunner = fast.grunner;
      lagreAvvist(rot, dato, artikkel.slug, { artikkel, utdrag, grunner: fast.grunner });
      return avsluttMedLogg(rot, logg, meldinger);
    }

    const granskMal = readFileSync(datafil(rot, 'instrukser/gransk.md'), 'utf8');
    const gransket = await granskArtikkel(avh.klient, {
      artikkel,
      utdrag,
      sprakfil,
      mal: granskMal,
    });
    logg.kostnadUsd += gransket.kostnadUsd;
    if (!gransket.godkjent) {
      logg.resultat = 'avvist';
      logg.grunner = [gransket.grunn];
      lagreAvvist(rot, dato, artikkel.slug, { artikkel, utdrag, grunner: logg.grunner });
      return avsluttMedLogg(rot, logg, meldinger);
    }

    const sti = `${BLOGGROT[artikkel.sprak]}${artikkel.slug}/`;
    const eksisterende = lesAutoArtikler(rot);
    const lenker = byggLenker(eksisterende, { ...artikkel, sti, sprakfil });
    artikkel.lenker = lenker.nyLenker;
    for (const gammel of eksisterende) {
      const nyLenke = lenker.lesOgså.get(gammel.slug);
      if (!nyLenke) continue;
      const { fil, sti: _sti, ...lagret } = gammel;
      lagret.lesOgså = [...(lagret.lesOgså ?? []).filter((lenke) => lenke.sti !== nyLenke.sti), nyLenke];
      skrivJson(fil, lagret);
    }
    skrivJson(new URL(`blogg-kilde/auto/${artikkel.sprak}/${artikkel.slug}.json`, rot), artikkel);
    publisert.push({
      dato,
      emne_id: emne.id,
      sprak: artikkel.sprak,
      slug: artikkel.slug,
      sti,
      tittel: artikkel.tittel,
    });
    skrivJson(datafil(rot, 'publisert.json'), publisert);
    logg.resultat = 'publisert';
    logg.sti = sti;
    return avsluttMedLogg(rot, logg, meldinger);
  } catch (feil) {
    logg.resultat = 'feil';
    logg.grunner = [feil instanceof Error ? feil.message : String(feil)];
    meldinger ??= lesData('sprak/nb.json', rot).motor;
    return avsluttMedLogg(rot, logg, meldinger);
  }
}

function torrAvhengigheter(rot) {
  const fixture = lesJson(new URL('seo-motor/test/fixtures/tørt/api.json', rot), {});
  let klientKall = 0;
  return {
    gsc: async () => fixture.gsc ?? [],
    dataforseo: async () => fixture.dataforseo ?? [],
    hent: async () => fixture.kilde,
    klient: {
      messages: {
        parse: async () => {
          klientKall += 1;
          const data = klientKall === 1
            ? fixture.passform
            : klientKall === 2
              ? fixture.artikkel
              : fixture.gransk;
          return {
            parsed_output: data,
            stop_reason: 'end_turn',
            usage: { input_tokens: 0, output_tokens: 0 },
          };
        },
      },
    },
    gh: async () => '',
    rot,
  };
}

function ekteAvhengigheter(rot) {
  return {
    gsc: hentGsc,
    dataforseo: hentDataForSeo,
    hent: async (url) => {
      const svar = await fetch(url);
      return { status: svar.status, tekst: await svar.text() };
    },
    klient: lagKlient({ apiKey: process.env.ANTHROPIC_API_KEY_LANDING }),
    gh: null,
    rot,
  };
}

async function cli() {
  const tørt = process.argv.includes('--tørt');
  const modus = tørt ? (process.env.SEO_AUTOPILOT ?? 'utkast') : process.env.SEO_AUTOPILOT;
  const avh = tørt
    ? torrAvhengigheter(REPO_ROT)
    : modus
      ? ekteAvhengigheter(REPO_ROT)
      : { rot: REPO_ROT };
  const fixtureTid = tørt
    ? lesJson(new URL('seo-motor/test/fixtures/tørt/api.json', REPO_ROT), {}).tid
    : null;
  const logg = await kjor({ tid: fixtureTid ? new Date(fixtureTid) : new Date(), modus, tørt, avh });
  const resultat = {
    resultat: logg.resultat,
    modus: logg.modus,
    ...(logg.slug ? { slug: logg.slug } : {}),
  };
  writeFileSync(new URL('../seo-resultat.json', import.meta.url), `${JSON.stringify(resultat, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(resultat)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await cli();
}
