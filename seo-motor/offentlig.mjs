import { basename } from 'node:path';

import {
  datafil,
  lesJson,
  skrivJson,
} from './filer.mjs';

const SKALAR = true;
const seksjon = {
  type: SKALAR,
  overskrift: SKALAR,
  tekst: SKALAR,
  rader: [[SKALAR]],
  punkter: [SKALAR],
};
const artikkel = {
  sprak: SKALAR,
  emne_id: SKALAR,
  slug: SKALAR,
  tittel: SKALAR,
  meta: SKALAR,
  ingress: SKALAR,
  seksjoner: [seksjon],
  faq: [{ sporsmal: SKALAR, svar: SKALAR }],
  pastander: [{ tekst: SKALAR, kilde_id: SKALAR }],
  appkobling: SKALAR,
  tagger: [SKALAR],
  kilder: [{ id: SKALAR, url: SKALAR }],
  lenker: [{ sti: SKALAR, tittel: SKALAR }],
  lesOgså: [{ sti: SKALAR, tittel: SKALAR }],
  publisert: SKALAR,
};
const former = {
  publisert: [{
    dato: SKALAR,
    emne_id: SKALAR,
    sprak: SKALAR,
    slug: SKALAR,
    sti: SKALAR,
  }],
  logg: {
    dato: SKALAR,
    modus: SKALAR,
    resultat: SKALAR,
    statuskode: SKALAR,
    grunnkoder: [SKALAR],
    sprak: SKALAR,
    slug: SKALAR,
    bestilling_id: SKALAR,
    pr_url: SKALAR,
    antall: {
      gsc: SKALAR,
      forslag: SKALAR,
      ko: SKALAR,
      bestillinger: SKALAR,
      levert: SKALAR,
      avvist: SKALAR,
    },
  },
  bestilling: {
    dato: SKALAR,
    sprak: SKALAR,
    emne_id: SKALAR,
    slug: SKALAR,
    emne: SKALAR,
    vinkel: SKALAR,
    appkoblinger: [SKALAR],
    kilde_ider: [SKALAR],
    krav: {
      ord_min: SKALAR,
      ord_maks: SKALAR,
      seksjoner_min: SKALAR,
      seksjoner_maks: SKALAR,
      faq_min: SKALAR,
      faq_maks: SKALAR,
      sprakregler_ref: SKALAR,
    },
  },
  avvist: {
    dato: SKALAR,
    sprak: SKALAR,
    slug: SKALAR,
    emne_id: SKALAR,
    grunnkoder: [SKALAR],
    granskingsgrunner: [SKALAR],
    artikkel,
  },
  sperre: {
    dato: SKALAR,
    grunnkode: SKALAR,
  },
};
const mapper = {
  publisert: '',
  logg: 'logg/',
  bestilling: 'bestillinger/',
  avvist: 'avvist/',
  sperre: '',
};
const forbudteNokler = new Set([
  'sokeord',
  'søkeord',
  'klikk',
  'visninger',
  'score',
  'poeng',
  'volum',
  'raw_query',
  'rå_søk',
]);

export class OffentligTilstandFeil extends Error {
  constructor() {
    super('offentlig-tilstand-ugyldig');
    this.name = 'OffentligTilstandFeil';
    this.kode = 'offentlig-tilstand-ugyldig';
  }
}

function sjekkForbudteNokler(verdi) {
  if (!verdi || typeof verdi !== 'object') return;
  if (Array.isArray(verdi)) {
    for (const element of verdi) sjekkForbudteNokler(element);
    return;
  }
  for (const [nokkel, innhold] of Object.entries(verdi)) {
    if (forbudteNokler.has(nokkel.toLocaleLowerCase())) throw new OffentligTilstandFeil();
    sjekkForbudteNokler(innhold);
  }
}

function sjekkForm(verdi, form) {
  if (form === SKALAR) {
    if (verdi !== null && typeof verdi === 'object') throw new OffentligTilstandFeil();
    return;
  }
  if (Array.isArray(form)) {
    if (!Array.isArray(verdi)) throw new OffentligTilstandFeil();
    for (const element of verdi) sjekkForm(element, form[0]);
    return;
  }
  if (!verdi || typeof verdi !== 'object' || Array.isArray(verdi)) {
    throw new OffentligTilstandFeil();
  }
  for (const [nokkel, innhold] of Object.entries(verdi)) {
    if (!Object.hasOwn(form, nokkel)) throw new OffentligTilstandFeil();
    sjekkForm(innhold, form[nokkel]);
  }
}

export function validerOffentlig(type, data) {
  if (!Object.hasOwn(former, type)) throw new OffentligTilstandFeil();
  sjekkForbudteNokler(data);
  sjekkForm(data, former[type]);
  return data;
}

function gyldigFilnavn(type, filnavn) {
  if (typeof filnavn !== 'string' || basename(filnavn) !== filnavn) return false;
  if (!/^[a-z0-9._-]+\.json$/u.test(filnavn)) return false;
  if (type === 'publisert') return filnavn === 'publisert.json';
  if (type === 'sperre') return filnavn === 'sperre.json';
  return true;
}

export function skrivOffentlig(rot, type, filnavn, data) {
  validerOffentlig(type, data);
  if (!gyldigFilnavn(type, filnavn)) throw new OffentligTilstandFeil();
  const fil = datafil(rot, `${mapper[type]}${filnavn}`);
  skrivJson(fil, data);
  return fil;
}

export function lesOffentlig(fil, reserve) {
  return lesJson(fil, reserve);
}
