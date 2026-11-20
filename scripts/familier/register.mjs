// Familieregisteret: sidefamilier som genereres fra data (én mappe per familie under scripts/familier/).
// Registeret importerer aldri sidetyper.mjs eller locale-sider.mjs (de importerer det).
// Endres denne fila, går sidekontrollen i full modus (se scripts/revisjon-omfang.mjs).
//
// Oppføring: { id, sidetype: 'omregner' | 'guide-lang', mappe: URL, markeder: { [marked]: { rot } } }
//   rot er stien uten språkmappe og uten ledende skråstrek, for eksempel 'verktoy/dl-til-gram/'.
// Mappa har data.<marked>.json (se felles.mjs) og mal-<marked>.mjs, som eksporterer
//   navSide(data, rader), sideForRad(rad, data, rader) og tillatteTall(rad, data).
// Samme rad-id på to markeder betyr «samme vare» og gir hreflang mellom språkene.
import { fileURLToPath } from 'node:url';

// felles.mjs trenger zod. Mange tester kopierer generatorene til mapper uten node_modules, og generatorene
// har ellers ingen avhengigheter. Derfor lastes felles.mjs mykt: uten zod virker registeret så lenge
// ingen familie leses (tomt register), og først da kommer feilen, med tydelig melding.
let felles = null;
let fellesFeil = null;
try {
  felles = await import('./felles.mjs');
} catch (feil) {
  if (feil?.code !== 'ERR_MODULE_NOT_FOUND') throw feil;
  fellesFeil = feil;
}
const trengFelles = () => {
  if (felles) return felles;
  throw new Error(`Familiedata kan ikke leses uten zod (kjør npm ci): ${fellesFeil?.message}`);
};

export const FAMILIER = Object.freeze([]);

const SPRAKMAPPE = Object.freeze({ nb: '', sv: 'sv/', da: 'da/', en: 'en/' });
// Feltene generatorene krever: utvid() i rike-sider-register.mjs dropper stille en ny side uten eyebrow og steg.
const KREVD = ['title', 'description', 'eyebrow', 'h1', 'lead', 'steg', 'rik', 'faq', 'cta', 'publisert', 'schemas'];

const mappeSti = (familie) => fileURLToPath(familie.mappe);
const sti = (marked, rot, slug = '') => `/${SPRAKMAPPE[marked]}${rot}${slug ? `${slug}/` : ''}`;

function kontroller(familie, marked, navn, side) {
  const mangler = KREVD.filter((felt) => !side?.[felt] || (Array.isArray(side[felt]) && side[felt].length === 0));
  if (mangler.length) throw new Error(`${familie.id}/${marked}/${navn}: malen gir en side uten ${mangler.join(', ')}`);
  return side;
}

function lesFamilie(familie, marked) {
  const { lesData, publiserbare } = trengFelles();
  const data = lesData(mappeSti(familie), marked);
  if (data.familie !== familie.id) throw new Error(`${familie.id}/${marked}: datafila sier familie «${data.familie}»`);
  return { data, rader: publiserbare(data) };
}

/** Sidene til ett marked, nøklet på stien uten språkmappe (som RIKE i rike-sider-register.mjs). */
export async function familieSider(marked, familier = FAMILIER) {
  const ut = {};
  for (const familie of familier) {
    const m = familie.markeder[marked];
    if (!m) continue;
    const { data, rader } = lesFamilie(familie, marked);
    const mal = await import(new URL(`mal-${marked}.mjs`, familie.mappe));
    ut[m.rot] = kontroller(familie, marked, 'nav', mal.navSide(data, rader));
    for (const rad of rader) ut[`${m.rot}${rad.slug}/`] = kontroller(familie, marked, rad.id, mal.sideForRad(rad, data, rader));
  }
  return ut;
}

/** Sidegrupper til SIDEGRUPPER: én for samlesiden og én per rad-id. Synkron, leser bare datafilene. */
export function familieGrupper(familier = FAMILIER) {
  const ut = [];
  for (const familie of familier) {
    const marked = Object.keys(familie.markeder);
    const nav = { id: `auto-fam-${familie.id}-nav`, sider: {} };
    const perRad = new Map();
    for (const mk of marked) {
      nav.sider[mk] = sti(mk, familie.markeder[mk].rot);
      for (const rad of lesFamilie(familie, mk).rader) {
        const g = perRad.get(rad.id) ?? { id: `auto-fam-${familie.id}-${rad.id}`, sider: {} };
        g.sider[mk] = sti(mk, familie.markeder[mk].rot, rad.slug);
        perRad.set(rad.id, g);
      }
    }
    ut.push(nav, ...perRad.values());
  }
  return ut;
}

/** Familie-id for en full sti (med språkmappe), eller null. Alt under familiens rot hører til familien. */
export function familieForSti(fullSti, familier = FAMILIER) {
  for (const familie of familier) {
    for (const [mk, { rot }] of Object.entries(familie.markeder)) {
      if (fullSti.startsWith(sti(mk, rot))) return familie.id;
    }
  }
  return null;
}

/** Antall sider per sidetype (samleside pluss publiserbare rader, alle markeder). */
export function familieAntall(familier = FAMILIER) {
  const antall = { omregner: 0, 'guide-lang': 0 };
  for (const familie of familier) {
    for (const mk of Object.keys(familie.markeder)) antall[familie.sidetype] += 1 + lesFamilie(familie, mk).rader.length;
  }
  return antall;
}
