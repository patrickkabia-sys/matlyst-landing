// Lager data.en.json for «cups to grams» fra USDA FoodData Central, SR Legacy (nedlastet JSON), og varelista i varer-en.mjs.
// Bruk: node scripts/familier/dl-til-gram/hent-usda.mjs --fil <SR Legacy-JSON> [--dato ÅÅÅÅ-MM-DD]
// Datasettet (210 MB) ligger ikke i repoet. Alle rader får status «utkast»; kontroller-usda.mjs setter «kontrollert».
// Hvert tall leses i datasettet via FDC-ID og porsjonens ordrette modifikator. Gjetter aldri.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { VARER_EN } from './varer-en.mjs';

export const DATAFIL_EN = fileURLToPath(new URL('./data.en.json', import.meta.url));

export function kilder(dato) {
  return {
    usda: {
      navn: 'FoodData Central, SR Legacy',
      utgiver: 'U.S. Department of Agriculture, Agricultural Research Service',
      aar: 2019,
      adresse: 'https://fdc.nal.usda.gov/',
      hentet: dato,
    },
  };
}

/** Leser SR Legacy-fila (`{ SRLegacyFoods: [...] }`) og gir lista med poster. */
export function lesSr(fil) {
  const svar = JSON.parse(readFileSync(fil, 'utf8'));
  const poster = Array.isArray(svar) ? svar : svar.SRLegacyFoods;
  if (!Array.isArray(poster)) throw new Error(`${fil}: fant ingen SRLegacyFoods`);
  return poster;
}

export const finnPost = (sr, fdcId) => sr.find((p) => p.fdcId === fdcId) ?? null;

/** Etiketten en porsjon får i merknaden: modifikatoren ordrett, med mengden foran når den ikke er 1. */
export const porsjonEtikett = (p) => (p.amount === 1 ? p.modifier : `${p.amount} ${p.modifier}`);

/** Porsjonen med denne modifikatoren og mengde 1, eller null når den mangler eller ikke er entydig. */
export function grunnPorsjon(post, modifikator) {
  const treff = (post?.foodPortions ?? []).filter((p) => p.modifier === modifikator && p.amount === 1);
  return treff.length === 1 ? treff[0] : null;
}

const g = (verdi, merknad) => ({ verdi, enhet: 'g', kilde: 'usda', merknad });

/** Tallene for én post: grunnlaget først (nøkkel `basis`), så alle øvrige porsjoner som p_<n>, i USDAs egen rekkefølge. `prefiks` er '' eller 'b_'. */
function tallFraPost(post, grunn, nokkel, prefiks) {
  const tall = { [`${prefiks}${nokkel}`]: g(grunn.gramWeight, porsjonEtikett(grunn)) };
  const ovrige = post.foodPortions.filter((p) => p !== grunn).sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  ovrige.forEach((p, i) => { tall[`${prefiks}p_${i + 1}`] = g(p.gramWeight, porsjonEtikett(p)); });
  return tall;
}

/** Én rad fra varelista og SR Legacy, eller null når posten eller porsjonen ikke finnes. Gjetter aldri. */
export function radFraUsda(vare, sr, dato = '2026-11-20') {
  const post = finnPost(sr, vare.fdcId);
  const grunn = grunnPorsjon(post, vare.porsjon);
  if (!post || !grunn || !Number.isFinite(grunn.gramWeight)) return null;
  const tall = tallFraPost(post, grunn, vare.basis, '');
  const tekst = { variant: vare.variant, usdaNavn: post.description, fdcId: String(vare.fdcId) };
  if (vare.ogsa) {
    const post2 = finnPost(sr, vare.ogsa.fdcId);
    const grunn2 = grunnPorsjon(post2, vare.ogsa.porsjon);
    if (!post2 || !grunn2) return null;
    Object.assign(tall, tallFraPost(post2, grunn2, vare.basis, 'b_'));
    Object.assign(tekst, { usdaNavn2: post2.description, fdcId2: String(vare.ogsa.fdcId) });
  }
  return { id: vare.id, slug: vare.slug, navn: vare.navn, status: 'utkast', oppdatert: dato, tall, tekst };
}

export function lagDataEn(sr, dato) {
  const rader = [];
  const utenRad = [];
  for (const vare of VARER_EN) {
    const rad = radFraUsda(vare, sr, dato);
    if (rad) rader.push(rad);
    else utenRad.push(vare.id);
  }
  return { data: { familie: 'dl-til-gram', marked: 'en', kilder: kilder(dato), rader }, utenRad };
}

export function arg(navn) {
  const i = process.argv.indexOf(navn);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const fil = arg('--fil');
  if (!fil) throw new Error('Bruk: hent-usda.mjs --fil <SR Legacy-JSON> [--dato ÅÅÅÅ-MM-DD]');
  const dato = arg('--dato') ?? new Date().toISOString().slice(0, 10);
  const { data, utenRad } = lagDataEn(lesSr(fil), dato);
  writeFileSync(DATAFIL_EN, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Skrev ${data.rader.length} rader til ${DATAFIL_EN} (status utkast).`);
  if (utenRad.length) console.log(`Uten post eller porsjon i datasettet, ingen rad: ${utenRad.join(', ')}`);
}
