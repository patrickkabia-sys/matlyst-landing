// Familieregisteret: sidefamilier som genereres fra data (én mappe per familie under scripts/familier/).
// Registeret importerer aldri sidetyper.mjs eller locale-sider.mjs (de importerer det).
// Endres denne fila, går sidekontrollen i full modus (se scripts/revisjon-omfang.mjs).
//
// Oppføring: { id, sidetype: 'omregner' | 'guide-lang', mappe: URL, markeder: { [marked]: { rot } } }
//   rot er stien uten språkmappe og uten ledende skråstrek, for eksempel 'verktoy/dl-til-gram/'.
//   gruppeFinnes (valgfri): samlesiden står alt i en sidegruppe i locale-sider.mjs, så familien lager ingen egen gruppe for den.
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

export const FAMILIER = Object.freeze([
  { id: 'dl-til-gram', sidetype: 'omregner', mappe: new URL('./dl-til-gram/', import.meta.url), markeder: { nb: { rot: 'verktoy/dl-til-gram/' }, sv: { rot: 'verktyg/dl-till-gram/' }, da: { rot: 'vaerktoejer/dl-til-gram/' }, en: { rot: 'tools/cups-to-grams/' } } },
  // Ukemenyene: norsk (/ukemenyer/, MatPrat og Mattilsynet), svensk (/sv/veckomenyer/, Arla og Livsmedelsverket), dansk (/da/madplaner/, Arla og Fødevarestyrelsen)
  // og amerikansk engelsk (/en/weekly-meal-plans/, Taste of Home og USDA FSIS). Rettene og varene står i menyer.<marked>.json (meny.mjs), tallene og sitatene i data.<marked>.json.
  // Rettene er det man lager en hverdag i hvert land, ikke de norske rettene oversatt. Samme rad-id gir hreflang mellom språkene for samme menytype.
  // Sitatkontroll: node scripts/familier/holdbarhet/kildekontroll.mjs ukemeny [sv|da|en].
  // Kjernetemperatur og steketid: norsk (Mattilsynet først, så MatPrat med årstall; se steketid/mal-felles.mjs) og amerikansk engelsk
  // (FoodSafety.gov, USDA FSIS og land-grant extension; se steketid/mal-felles-en.mjs). Samme rad-id på nb og en gir hreflang; tallene på en er hentet fra amerikanske kilder, ikke oversatt.
  { id: 'kjernetemperatur', sidetype: 'guide-lang', mappe: new URL('./kjernetemperatur/', import.meta.url), markeder: { nb: { rot: 'kjernetemperatur/' }, sv: { rot: 'innertemperatur/' }, da: { rot: 'kernetemperatur/' }, en: { rot: 'internal-temperature/' } } },
  // Steketid på svensk (/sv/tillagningstid/): Svensk Fågel, Svenskt Kött, Svenska Ägg, Kronfågel, Findus og Arla (data.sv.json, tekst-sv.mjs). Tallene er hentet fra svenske kilder, ikke oversatt.
  // Sitatkontroll for sv: node scripts/familier/holdbarhet/kildekontroll.mjs <familie> sv (den har curl-fallback, og Arla svarer 404 på Node sin fetch). Gjelder også airfryer, erstatning og mengde-per-person.
  { id: 'steketid', sidetype: 'guide-lang', mappe: new URL('./steketid/', import.meta.url), markeder: { nb: { rot: 'steketid/' }, sv: { rot: 'tillagningstid/' }, da: { rot: 'stegetid/' }, en: { rot: 'cooking-times/' } } },
  { id: 'ukemeny', sidetype: 'guide-lang', mappe: new URL('./ukemeny/', import.meta.url), markeder: { nb: { rot: 'ukemenyer/' }, sv: { rot: 'veckomenyer/' }, da: { rot: 'madplaner/' }, en: { rot: 'weekly-meal-plans/' } } },
  // Holdbarhet i kjøleskapet og frysing: norsk (Mattilsynet først, så MatPrat; se holdbarhet/kjoling.mjs) og amerikansk engelsk (FoodSafety.gov, USDA FSIS, FDA; se holdbarhet/kjoling-en.mjs).
  // Samme rad-id på nb og en gir hreflang; tallene på en er hentet fra amerikanske kilder, ikke oversatt.
  { id: 'holdbarhet', sidetype: 'guide-lang', mappe: new URL('./holdbarhet/', import.meta.url), markeder: { nb: { rot: 'holdbarhet/' }, sv: { rot: 'hallbarhet/' }, da: { rot: 'holdbarhed/' }, en: { rot: 'how-long-does-it-last/' } } },
  { id: 'frysing', sidetype: 'guide-lang', mappe: new URL('./frysing/', import.meta.url), markeder: { nb: { rot: 'frysing/' }, sv: { rot: 'frysa/' }, da: { rot: 'kan-man-fryse/' }, en: { rot: 'can-you-freeze/' } } },
  // Mengde per person: norsk (MatPrat og Helsedirektoratet, tekstene i tekst-nb.mjs) og amerikansk engelsk (USDA FSIS, land-grant extension, National Turkey Federation m.fl., tekstene i tekst-en.mjs; US-mål først, metrisk i parentes). Sitat per tall (kildekontroll.mjs [nb|en]).
  // Mengde per person på svensk (/sv/hur-mycket-per-person/): Arla, Svenskt Kött og Kungsörnen. Kalkulatoren regner personer: ingen svensk kilde gir et barnetall, så barnefeltet er skjult (0).
  { id: 'mengde-per-person', sidetype: 'guide-lang', mappe: new URL('./mengde-per-person/', import.meta.url), markeder: { nb: { rot: 'mengde-per-person/' }, sv: { rot: 'hur-mycket-per-person/' }, da: { rot: 'hvor-meget-pr-person/' }, en: { rot: 'how-much-per-person/' } } },
  // Airfryer: tid og temperatur per råvare med kilde, og omregner fra ovn. Norsk (data.nb.json) og amerikansk engelsk (data.en.json, /en/air-fryer/).
  // Tallene står med sitat fra kilden i datafila (kildekontroll.mjs [nb|en]). På en er de hentet fra amerikanske kilder (Cosori, KitchenAid, Instant Pot, Philips, Mississippi State og Illinois Extension, USDA FSIS), ikke oversatt.
  // Samme rad-id på nb og en gir hreflang; rader uten norsk motstykke (shrimp, baked-potato, reheat-pizza-leftovers) står alene.
  // Airfryer på svensk (/sv/airfryer/): Arla (receptsidene «… i airfryer» og artikkelen med omregningstabell), Findus og OBH Nordica. Omregningen ugn till airfryer er en tabell og en temperaturregel fra Arla og OBH Nordica, ingen omregner.
  { id: 'airfryer', sidetype: 'guide-lang', mappe: new URL('./airfryer/', import.meta.url), markeder: { nb: { rot: 'airfryer/' }, sv: { rot: 'airfryer/' }, da: { rot: 'airfryer/' }, en: { rot: 'air-fryer/' } } },
  // Erstatning: hva du kan bruke i stedet for en vare du mangler. Norsk (Idun, MatPrat, melk.no med flere) og amerikansk engelsk (land-grant extension og King Arthur Baking; tallene er hentet fra amerikanske kilder, ikke oversatt). Sitatkontroll i erstatning/kildekontroll.mjs.
  // Erstatning på svensk (/sv/ersatta/): KronJäst, Kungsörnen og Dansukker. Bare de varene en svensk kilde gir en mengde for; egg, filmjölk, smör, bakpulver og grädde er utelatt.
  { id: 'erstatning', sidetype: 'guide-lang', mappe: new URL('./erstatning/', import.meta.url), markeder: { nb: { rot: 'erstatning/' }, sv: { rot: 'ersatta/' }, da: { rot: 'erstatning/' }, en: { rot: 'substitutes/' } } },
  // Rester og råvarer: undersidene /hva-kan-jeg-lage/med-<vare>/ til den eksisterende guiden. Samlesiden /hva-kan-jeg-lage/ har sidegruppen oppskrifter-fra-ingredienser (nb, sv, da, en).
  { id: 'rester', sidetype: 'guide-lang', mappe: new URL('./rester/', import.meta.url), markeder: { nb: { rot: 'hva-kan-jeg-lage/', gruppeFinnes: true }, sv: { rot: 'recept-pa-ingredienser/', gruppeFinnes: true }, da: { rot: 'opskrifter-ud-fra-ingredienser/', gruppeFinnes: true }, en: { rot: 'recipes-by-ingredients/', gruppeFinnes: true } } },
]);

export const SPRAKMAPPE = Object.freeze({ nb: '', sv: 'sv/', da: 'da/', en: 'en/' });
// Feltene generatorene krever: utvid() i rike-sider-register.mjs dropper stille en ny side uten eyebrow og steg.
const KREVD = ['title', 'description', 'eyebrow', 'h1', 'lead', 'steg', 'rik', 'faq', 'cta', 'publisert', 'schemas'];

const ROT_MONSTER = /^[a-z0-9-]+(\/[a-z0-9-]+)*\/$/u;
const ID_MONSTER = /^[a-z0-9-]+$/u;
const SIDETYPER = new Set(['omregner', 'guide-lang']);
const validerte = new WeakSet();

/** Alle innganger validerer registeret først: id, sidetype, marked og rot (ingen «..», ingen ledende skråstrek, ingen store bokstaver). */
function valider(familier) {
  if (validerte.has(familier)) return;
  for (const familie of familier) {
    if (typeof familie.id !== 'string' || !ID_MONSTER.test(familie.id)) throw new Error(`Familie med ugyldig id ${JSON.stringify(familie.id)}: id må være a-z, 0-9 og bindestrek`);
    if (!SIDETYPER.has(familie.sidetype)) throw new Error(`${familie.id}: ugyldig sidetype ${JSON.stringify(familie.sidetype)} (omregner eller guide-lang)`);
    for (const [marked, m] of Object.entries(familie.markeder ?? {})) {
      if (!Object.hasOwn(SPRAKMAPPE, marked)) throw new Error(`${familie.id}: ukjent marked ${JSON.stringify(marked)}`);
      if (typeof m?.rot !== 'string' || !ROT_MONSTER.test(m.rot)) throw new Error(`${familie.id}/${marked}: ugyldig rot ${JSON.stringify(m?.rot)}: den må ha formen verktoy/familie/ (a-z, 0-9 og bindestrek, slutter på skråstrek)`);
    }
  }
  validerte.add(familier);
}

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

/**
 * Sidene ett marked skal ha, som Map fra sti (uten språkmappe) til familie-id. Kaster med begge navngitt når
 * to familier gir samme sti, eller når én families rot ligger i en annens (eller er lik den).
 */
function stierFor(familier, marked) {
  const stier = new Map();
  const roter = [];
  for (const familie of familier) {
    const m = familie.markeder[marked];
    if (!m) continue;
    const { rader } = lesFamilie(familie, marked);
    for (const [navn, nokkel] of [['samleside', m.rot], ...rader.map((r) => [r.id, `${m.rot}${r.slug}/`])]) {
      if (stier.has(nokkel)) throw new Error(`Sti-kollisjon på ${marked}: /${nokkel} gis av både «${stier.get(nokkel)}» og «${familie.id}» (${navn})`);
      stier.set(nokkel, familie.id);
    }
    roter.push({ id: familie.id, rot: m.rot });
  }
  for (const a of roter) {
    for (const b of roter) {
      if (a !== b && b.rot.startsWith(a.rot)) throw new Error(`Rot-kollisjon på ${marked}: roten ${b.rot} (${b.id}) ligger under roten ${a.rot} (${a.id})`);
    }
  }
  return stier;
}

/**
 * Sidene til ett marked, nøklet på stien uten språkmappe (som RIKE i rike-sider-register.mjs).
 * `basis` er det som alt finnes i RIKE for språket: en familieside med samme sti kaster i stedet for å overskrive stille.
 */
export async function familieSider(marked, familier = FAMILIER, basis = {}) {
  valider(familier);
  const stier = stierFor(familier, marked);
  for (const [nokkel, id] of stier) {
    if (Object.hasOwn(basis, nokkel)) throw new Error(`Sti-kollisjon på ${marked}: /${nokkel} gis av familien «${id}», men finnes alt i RIKE.${marked}`);
  }
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
  valider(familier);
  for (const mk of Object.keys(SPRAKMAPPE)) stierFor(familier, mk);
  const ut = [];
  for (const familie of familier) {
    const marked = Object.keys(familie.markeder);
    const nav = { id: `auto-fam-${familie.id}-nav`, sider: {} };
    const perRad = new Map();
    for (const mk of marked) {
      // gruppeFinnes: samlesiden hører allerede til en sidegruppe i locale-sider.mjs (med lenker til de andre språkene), så familien lager ikke en ny.
      if (!familie.markeder[mk].gruppeFinnes) nav.sider[mk] = sti(mk, familie.markeder[mk].rot);
      for (const rad of lesFamilie(familie, mk).rader) {
        const g = perRad.get(rad.id) ?? { id: `auto-fam-${familie.id}-${rad.id}`, sider: {} };
        g.sider[mk] = sti(mk, familie.markeder[mk].rot, rad.slug);
        perRad.set(rad.id, g);
      }
    }
    ut.push(...(Object.keys(nav.sider).length ? [nav] : []), ...perRad.values());
  }
  return ut;
}

/** Familie-id for en full sti (med språkmappe), eller null. Alt under familiens rot hører til familien. */
export function familieForSti(fullSti, familier = FAMILIER) {
  valider(familier);
  for (const familie of familier) {
    for (const [mk, { rot }] of Object.entries(familie.markeder)) {
      if (fullSti.startsWith(sti(mk, rot))) return familie.id;
    }
  }
  return null;
}

/** Antall sider per sidetype (samleside pluss publiserbare rader, alle markeder). */
export function familieAntall(familier = FAMILIER) {
  valider(familier);
  const antall = { omregner: 0, 'guide-lang': 0 };
  for (const familie of familier) {
    for (const mk of Object.keys(familie.markeder)) antall[familie.sidetype] += 1 + lesFamilie(familie, mk).rader.length;
  }
  return antall;
}
