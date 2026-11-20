// Lager data.nb.json for «dl til gram» fra Matvaretabellens åpne API (foods.json) og varelista.
// Bruk: node scripts/familier/dl-til-gram/hent.mjs [--fil <foods.json>] [--dato ÅÅÅÅ-MM-DD]
// Uten --fil hentes API-et direkte. Alle rader får status «utkast»; kontroller.mjs setter «kontrollert».
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { VARER } from './varer.mjs';

export const API = 'https://www.matvaretabellen.no/api/nb/foods.json';
export const DATAFIL = fileURLToPath(new URL('./data.nb.json', import.meta.url));
const ML_PER_CUP = 2.365882;

/** Gram per dl for en matvare i API-svaret, uendret fra kilden, eller null når matvaren ikke har dl-porsjon. */
export function dlFraMatvare(mat) {
  const p = (mat?.portions ?? []).find((x) => x.portionUnit === 'dl');
  return p && Number.isFinite(p.quantity) ? p.quantity : null;
}

export const finnMatvare = (foods, navn) => foods.find((f) => f.foodName === navn) ?? null;

export const gPerDlFraCup = (gPerCup) => Math.round(gPerCup / ML_PER_CUP);

export function kilder(dato) {
  return {
    matvaretabellen: { navn: 'Matvaretabellen 2026', utgiver: 'Mattilsynet', aar: 2026, adresse: 'https://www.matvaretabellen.no', hentet: dato },
    'rapport-2015': {
      navn: 'Mål, vekt og porsjonsstørrelser for matvarer (IS-2286)',
      utgiver: 'Mattilsynet, Universitetet i Oslo og Helsedirektoratet',
      aar: 2015,
      adresse: 'https://www.helsedirektoratet.no/brosjyrer/mal-vekt-og-porsjonsstorrelser-for-matvarer',
      hentet: dato,
    },
    usda: { navn: 'FoodData Central, SR Legacy', utgiver: 'U.S. Department of Agriculture', aar: 2019, adresse: 'https://fdc.nal.usda.gov', hentet: dato },
  };
}

const g = (verdi, kilde, merknad) => ({ verdi, enhet: 'g', kilde, ...(merknad ? { merknad } : {}) });

/** Én rad fra varelista og API-svaret, eller null når varen ikke har dl-porsjon i API-et. Gjetter aldri. */
export function radFraKilde(vare, foods, dato = '2026-11-20') {
  const dl = dlFraMatvare(finnMatvare(foods, vare.matvaretabell));
  if (dl === null) return null;
  const tall = { dl: g(dl, 'matvaretabellen') };
  const tekst = { matvaretabell: vare.matvaretabell };
  if (vare.rapport) {
    if (vare.rapport.ss !== undefined) tall.ss_toppet = g(vare.rapport.ss, 'rapport-2015');
    if (vare.rapport.ts !== undefined) tall.ts_toppet = g(vare.rapport.ts, 'rapport-2015');
    tekst.rapportnavn = vare.rapport.navn;
  }
  if (vare.usda) {
    const u = vare.usda;
    tall.dl_usda = g(gPerDlFraCup(u.gPerCup), 'usda', u.modifikator ? `${u.gPerCup} g per ${u.modifikator}, regnet om fra cup` : `${u.gPerCup} g per cup, regnet om`);
    if (u.annen) tall[u.annen.felt] = g(gPerDlFraCup(u.annen.gPerCup), 'usda', `${u.annen.gPerCup} g per ${u.annen.modifikator}, regnet om fra cup`);
    tekst.usdaFdcId = String(u.fdcId);
    tekst.usdaNavn = u.navn;
  }
  return { id: vare.id, slug: vare.slug, navn: vare.navn, status: 'utkast', oppdatert: dato, tall, tekst };
}

export function lagData(foods, dato) {
  const rader = [];
  const utenRad = [];
  for (const vare of VARER) {
    const rad = radFraKilde(vare, foods, dato);
    if (rad) rader.push(rad);
    else utenRad.push(vare.id);
  }
  return { data: { familie: 'dl-til-gram', marked: 'nb', kilder: kilder(dato), rader }, utenRad };
}

async function hentApi() {
  // API-svaret er ca. 14 MB, og en avbrutt overføring gir avkortet JSON. Prøv derfor inntil tre ganger og si tydelig fra.
  let sist;
  for (let forsok = 1; forsok <= 3; forsok += 1) {
    try {
      const svar = await fetch(API);
      if (!svar.ok) throw new Error(`HTTP ${svar.status}`);
      return JSON.parse(await svar.text());
    } catch (feil) {
      sist = feil;
    }
  }
  throw new Error(`Kunne ikke hente ${API} etter tre forsøk: ${sist.message}`);
}

export async function lesFoods(fil) {
  const svar = fil ? JSON.parse(readFileSync(fil, 'utf8')) : await hentApi();
  return Array.isArray(svar) ? svar : svar.foods;
}

export function arg(navn) {
  const i = process.argv.indexOf(navn);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dato = arg('--dato') ?? new Date().toISOString().slice(0, 10);
  const foods = await lesFoods(arg('--fil'));
  const { data, utenRad } = lagData(foods, dato);
  writeFileSync(DATAFIL, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Skrev ${data.rader.length} rader til ${DATAFIL} (status utkast).`);
  if (utenRad.length) console.log(`Uten dl-porsjon i API-et, ingen rad: ${utenRad.join(', ')}`);
}
