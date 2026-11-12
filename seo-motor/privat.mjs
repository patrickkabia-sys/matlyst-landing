import { execFileSync } from 'node:child_process';
import {
  createCipheriv,
  createDecipheriv,
  hkdfSync,
  randomBytes,
} from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const VERSJON = 1;
const AAD = Buffer.from('matlyst-seo-data:v1', 'utf8');
const EMNE_ID_INFO = Buffer.from('matlyst-seo-emne-id', 'utf8');
const TESTNOKKEL_FIL = new URL('./test/fixtures/seo-data-nokkel.txt', import.meta.url);

export class PrivatTilstandFeil extends Error {
  constructor() {
    super('privat-tilstand-ugyldig');
    this.name = 'PrivatTilstandFeil';
    this.kode = 'privat-tilstand-ugyldig';
  }
}

export class SeoDataNokkelFeil extends Error {
  constructor(kode) {
    super(kode);
    this.name = 'SeoDataNokkelFeil';
    this.kode = kode;
  }
}

export function tomPrivatTilstand() {
  return {
    emneko: [],
    gsc: [],
    forslag: [],
    ytelse: [],
    forslagKjoringer: {},
  };
}

function dekodNokkel(nokkel) {
  if (typeof nokkel !== 'string' || !/^[A-Za-z0-9+/]{43}=$/u.test(nokkel)) {
    throw new SeoDataNokkelFeil('seo-data-nokkel-ugyldig');
  }
  const dekodet = Buffer.from(nokkel, 'base64');
  if (dekodet.length !== 32 || dekodet.toString('base64') !== nokkel) {
    throw new SeoDataNokkelFeil('seo-data-nokkel-ugyldig');
  }
  return dekodet;
}

export function utledEmneIdNokkel(nokkel) {
  return Buffer.from(hkdfSync(
    'sha256',
    dekodNokkel(nokkel),
    Buffer.alloc(0),
    EMNE_ID_INFO,
    32,
  ));
}

export function krypterPrivat(data, nokkel, tilfeldig = randomBytes) {
  const iv = tilfeldig(12);
  if (!Buffer.isBuffer(iv) || iv.length !== 12) {
    throw new SeoDataNokkelFeil('seo-data-iv-ugyldig');
  }
  const cipher = createCipheriv('aes-256-gcm', dekodNokkel(nokkel), iv);
  cipher.setAAD(AAD);
  const chiffertekst = Buffer.concat([
    cipher.update(JSON.stringify(data), 'utf8'),
    cipher.final(),
  ]);
  return {
    versjon: VERSJON,
    iv: iv.toString('base64'),
    auth_tag: cipher.getAuthTag().toString('base64'),
    chiffertekst: chiffertekst.toString('base64'),
  };
}

export function dekrypterPrivat(konvolutt, nokkel) {
  try {
    if (!konvolutt || konvolutt.versjon !== VERSJON) throw new Error();
    const iv = Buffer.from(konvolutt.iv, 'base64');
    const authTag = Buffer.from(konvolutt.auth_tag, 'base64');
    const chiffertekst = Buffer.from(konvolutt.chiffertekst, 'base64');
    if (iv.length !== 12 || authTag.length !== 16 || chiffertekst.length === 0) throw new Error();
    const decipher = createDecipheriv('aes-256-gcm', dekodNokkel(nokkel), iv);
    decipher.setAAD(AAD);
    decipher.setAuthTag(authTag);
    const klartekst = Buffer.concat([
      decipher.update(chiffertekst),
      decipher.final(),
    ]).toString('utf8');
    const data = JSON.parse(klartekst);
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error();
    return data;
  } catch (feil) {
    if (feil instanceof SeoDataNokkelFeil) throw feil;
    throw new PrivatTilstandFeil();
  }
}

function filsti(fil) {
  return fil instanceof URL ? fileURLToPath(fil) : fil;
}

export function lesPrivat(fil, nokkel) {
  dekodNokkel(nokkel);
  if (!existsSync(fil)) return tomPrivatTilstand();
  try {
    const konvolutt = JSON.parse(readFileSync(fil, 'utf8'));
    return dekrypterPrivat(konvolutt, nokkel);
  } catch (feil) {
    if (feil instanceof SeoDataNokkelFeil || feil instanceof PrivatTilstandFeil) throw feil;
    throw new PrivatTilstandFeil();
  }
}

export function skrivPrivat(fil, data, nokkel) {
  const sti = filsti(fil);
  mkdirSync(dirname(sti), { recursive: true });
  const konvolutt = krypterPrivat(data, nokkel);
  writeFileSync(sti, `${JSON.stringify(konvolutt)}\n`, { mode: 0o600 });
}

function standardNokkelring(kommando, argumenter) {
  return execFileSync(kommando, argumenter, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
}

export function lesSeoDataNokkel({
  tørt = false,
  tillatNokkelring = false,
  miljø = process.env,
  finnNokkelring = standardNokkelring,
} = {}) {
  let nokkel = miljø.SEO_DATA_NOKKEL?.trim();
  if (!nokkel && tørt) nokkel = readFileSync(TESTNOKKEL_FIL, 'utf8').trim();
  if (!nokkel && tillatNokkelring) {
    try {
      nokkel = finnNokkelring('security', [
        'find-generic-password',
        '-s',
        'matlyst-seo-data',
        '-w',
      ]).trim();
    } catch {
      nokkel = '';
    }
  }
  if (!nokkel) throw new SeoDataNokkelFeil('seo-data-nokkel-mangler');
  dekodNokkel(nokkel);
  return nokkel;
}
