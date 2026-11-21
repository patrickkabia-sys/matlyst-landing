// Hylledata: de seks «hyllene» som både menyen og bunnen tegnes fra.
// Lenketekstene og rekkefølgen følger det godkjente forside-prototypet.
// `flis` er filnavnet i images/forside/logo/. En lenke uten side har `finnes: false`
// og vises ikke (se synligeLenker), men beholdes med forventet adresse.

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { gruppeForSti } from './locale-sider.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));

export const HYLLER = {
  nb: [
    {
      id: 'appen', navn: 'Appen', flis: '14.webp',
      lenker: [
        { tekst: 'Oppskriftsapp', href: '/oppskriftsbok-app/' },
        { tekst: 'Importer oppskrifter', href: '/importer-oppskrifter/' },
        { tekst: 'Ukemeny', href: '/ukemeny/' },
        { tekst: 'Handleliste', href: '/handleliste/' },
        { tekst: 'Spiskammer', href: '/spiskammer-app/' },
        { tekst: 'Spør Matlyst', href: '/#spor' },
        { tekst: 'Finn oppskrifter', href: '/finn-oppskrifter/' },
      ],
    },
    {
      id: 'lagre', navn: 'Lagre oppskrifter', flis: 'e99f71.webp',
      lenker: [
        { tekst: 'Instagram', href: '/lagre-oppskrifter-fra-instagram/' },
        { tekst: 'TikTok', href: '/lagre-oppskrifter-fra-tiktok/' },
        { tekst: 'Matprat', href: '/importer-fra-matprat/' },
        { tekst: 'Köket.se', href: '/importer-fra-koket/' },
        { tekst: 'Bilder og kokebøker', href: '/handskrevne-oppskrifter/' },
        { tekst: 'Paprika', href: '/bytt-fra-paprika/' },
      ],
    },
    {
      id: 'middag', navn: 'Middag', flis: 'a201c1.webp',
      lenker: [
        { tekst: 'Middagsforslag', href: '/middagsforslag/' },
        { tekst: 'Enkel middag', href: '/enkel-middag/' },
        { tekst: 'Tøm kjøleskapet', href: '/tom-kjoleskapet/' },
        { tekst: 'Hva kan jeg lage?', href: '/hva-kan-jeg-lage/' },
      ],
    },
    {
      id: 'verktoy', navn: 'Verktøy', flis: '3eef40.webp',
      lenker: [
        { tekst: 'Enhetsomregner', href: '/verktoy/enhetsomregner/' },
        // Sidene heter fortsatt «kopp» i adressen; teksten sier «cups».
        { tekst: 'Cups til dl', href: '/verktoy/kopp-til-dl/' },
        { tekst: 'Dl til cups', href: '/verktoy/dl-til-kopp/' },
        { tekst: 'Celsius til Fahrenheit', href: '/verktoy/celsius-til-fahrenheit/' },
        { tekst: 'Dl til gram', href: '/verktoy/dl-til-gram/' },
        { tekst: 'Porsjoner', href: '/verktoy/porsjoner/', finnes: false },
        { tekst: 'Kakeform', href: '/verktoy/kakeform/', finnes: false },
        { tekst: 'Steketid', href: '/verktoy/steketid/', finnes: false },
        { tekst: 'Pizzadeig', href: '/verktoy/pizzadeig/', finnes: false },
        { tekst: 'Gjær', href: '/verktoy/gjaer/', finnes: false },
        { tekst: 'Alle kalkulatorer', href: '/verktoy/', finnes: false },
      ],
    },
    {
      id: 'tips', navn: 'Kjøkkentips', flis: '77b354.webp',
      lenker: [
        { tekst: 'Doble en oppskrift', href: '/blogg/doble-oppskrift/' },
        { tekst: 'Er egget ferskt?', href: '/blogg/er-egget-ferskt/' },
        { tekst: 'Erstatte egg', href: '/blogg/erstatte-egg/' },
        { tekst: 'Kjernetemperatur', href: '/blogg/kjernetemperatur/' },
        { tekst: 'Koketider', href: '/blogg/koketider/' },
        // Familiene holdbarhet og frysing finnes bare på norsk (scripts/familier/).
        { tekst: 'Holdbarhet i kjøleskapet', href: '/holdbarhet/', bareNb: true },
        { tekst: 'Frysing', href: '/frysing/', bareNb: true },
        { tekst: 'Alle kjøkkentips', href: '/blogg/' },
      ],
    },
    {
      id: 'matlyst', navn: 'Matlyst', flis: 'b3fdbf.webp',
      lenker: [
        { tekst: 'For matskapere', href: '/skapere/' },
        // Om-siden finnes bare på norsk (bareNb): sv, da og en får ikke lenka før de har en egen om-side.
        { tekst: 'Om Matlyst', href: '/om/', bareNb: true },
        { tekst: 'Instagram', href: 'https://www.instagram.com/matlyst_app/' },
        { tekst: 'TikTok', href: 'https://www.tiktok.com/@matlyst.appen' },
        { tekst: 'YouTube', href: 'https://www.youtube.com/@matlyst' },
        { tekst: 'Pinterest', href: 'https://www.pinterest.com/matlystapp/' },
        { tekst: 'Personvern', href: '/personvern.html' },
      ],
    },
  ],
};

export function synligeLenker(hylle) {
  return hylle.lenker.filter((l) => l.finnes !== false);
}

// Hyllenes tekster per språk. Nøkkelen i `lenker` er bokmålslenkas `href`; lokale
// kildeguider (LOKALE_KILDER) har sin egen `href` som nøkkel, siden de ikke har noen bokmålslenke.
// Tekstene leveres av skalltekst-modulen; her ligger bare oppslaget og reglene.
export const HYLLETEKST = {
  sv: {
    navn: { appen: 'Appen', lagre: 'Spara recept', middag: 'Middag', verktoy: 'Verktyg', tips: 'Kökstips', matlyst: 'Matlyst' },
    lenker: {
      '/oppskriftsbok-app/': 'Receptapp',
      '/importer-oppskrifter/': 'Importera recept',
      '/ukemeny/': 'Veckomeny',
      '/handleliste/': 'Inköpslista',
      '/spiskammer-app/': 'Skafferi',
      '/#spor': 'Fråga Matlyst',
      '/finn-oppskrifter/': 'Hitta dina recept',
      '/lagre-oppskrifter-fra-instagram/': 'Instagram',
      '/lagre-oppskrifter-fra-tiktok/': 'TikTok',
      '/importer-fra-matprat/': 'Matprat',
      '/importer-fra-koket/': 'Köket.se',
      '/handskrevne-oppskrifter/': 'Foton och kokböcker',
      '/bytt-fra-paprika/': 'Paprika',
      '/middagsforslag/': 'Middagstips',
      '/enkel-middag/': 'Enkel middag',
      '/tom-kjoleskapet/': 'Töm kylskåpet',
      '/hva-kan-jeg-lage/': 'Vad kan jag laga?',
      '/verktoy/enhetsomregner/': 'Enhetsomvandlare',
      '/verktoy/kopp-til-dl/': 'Cups till dl',
      '/verktoy/dl-til-kopp/': 'Dl till cups',
      '/verktoy/celsius-til-fahrenheit/': 'Celsius till Fahrenheit',
      '/verktoy/dl-til-gram/': 'Dl till gram',
      '/verktoy/porsjoner/': 'Räkna om portioner',
      '/verktoy/kakeform/': 'Räkna om kakform',
      '/verktoy/steketid/': 'Stektider',
      '/verktoy/pizzadeig/': 'Pizzadeg',
      '/verktoy/gjaer/': 'Räkna om jäst',
      '/verktoy/': 'Alla räknare',
      '/blogg/doble-oppskrift/': 'Dubbla ett recept',
      '/blogg/er-egget-ferskt/': 'Är ägget färskt?',
      '/blogg/erstatte-egg/': 'Ersätta ägg i bakning',
      '/blogg/kjernetemperatur/': 'Innertemperatur',
      '/blogg/koketider/': 'Koktider',
      '/blogg/': 'Alla kökstips',
      '/skapere/': 'För receptskapare',
      'https://www.instagram.com/matlyst_app/': 'Instagram',
      'https://www.tiktok.com/@matlyst.appen': 'TikTok',
      'https://www.youtube.com/@matlyst': 'YouTube',
      'https://www.pinterest.com/matlystapp/': 'Pinterest',
      '/personvern.html': 'Integritet',
      '/sv/koket/': 'Köket.se',
      '/sv/landleys-kok/': 'Landleys Kök',
    },
  },
  da: {
    navn: { appen: 'Appen', lagre: 'Gem opskrifter', middag: 'Aftensmad', verktoy: 'Værktøjer', tips: 'Køkkentips', matlyst: 'Matlyst' },
    lenker: {
      '/oppskriftsbok-app/': 'Opskriftsapp',
      '/importer-oppskrifter/': 'Importér opskrifter',
      '/ukemeny/': 'Madplan',
      '/handleliste/': 'Indkøbsliste',
      '/spiskammer-app/': 'Spisekammer',
      '/#spor': 'Spørg Matlyst',
      '/finn-oppskrifter/': 'Find dine opskrifter',
      '/lagre-oppskrifter-fra-instagram/': 'Instagram',
      '/lagre-oppskrifter-fra-tiktok/': 'TikTok',
      '/importer-fra-matprat/': 'Matprat',
      '/importer-fra-koket/': 'Köket.se',
      '/handskrevne-oppskrifter/': 'Fotos og kogebøger',
      '/bytt-fra-paprika/': 'Paprika',
      '/middagsforslag/': 'Forslag til aftensmad',
      '/enkel-middag/': 'Nem aftensmad',
      '/tom-kjoleskapet/': 'Tøm køleskabet',
      '/hva-kan-jeg-lage/': 'Hvad kan jeg lave?',
      '/verktoy/enhetsomregner/': 'Enhedsomregner',
      '/verktoy/kopp-til-dl/': 'Cups til dl',
      '/verktoy/dl-til-kopp/': 'Dl til cups',
      '/verktoy/celsius-til-fahrenheit/': 'Celsius til fahrenheit',
      '/verktoy/dl-til-gram/': 'Dl til gram',
      '/verktoy/porsjoner/': 'Portioner',
      '/verktoy/kakeform/': 'Kageform',
      '/verktoy/steketid/': 'Stegetid',
      '/verktoy/pizzadeig/': 'Pizzadej',
      '/verktoy/gjaer/': 'Gær',
      '/verktoy/': 'Alle kalkulatorer',
      '/blogg/doble-oppskrift/': 'Fordoble en opskrift',
      '/blogg/er-egget-ferskt/': 'Er ægget friskt?',
      '/blogg/erstatte-egg/': 'Erstat æg i bagning',
      '/blogg/kjernetemperatur/': 'Kernetemperatur',
      '/blogg/koketider/': 'Kogetider',
      '/blogg/': 'Alle køkkentips',
      '/skapere/': 'For opskriftsskabere',
      'https://www.instagram.com/matlyst_app/': 'Instagram',
      'https://www.tiktok.com/@matlyst.appen': 'TikTok',
      'https://www.youtube.com/@matlyst': 'YouTube',
      'https://www.pinterest.com/matlystapp/': 'Pinterest',
      '/personvern.html': 'Privatliv',
      '/da/dr-mad/': 'DR Mad',
      '/da/alletiders-kogebog/': 'Alletiders Kogebog',
    },
  },
  en: {
    navn: { appen: 'The app', lagre: 'Save recipes', middag: 'Dinner', verktoy: 'Tools', tips: 'Kitchen tips', matlyst: 'Matlyst' },
    lenker: {
      '/oppskriftsbok-app/': 'Recipe organizer app',
      '/importer-oppskrifter/': 'Import recipes',
      '/ukemeny/': 'Meal plan',
      '/handleliste/': 'Grocery list',
      '/spiskammer-app/': 'Pantry',
      '/#spor': 'Ask Matlyst',
      '/finn-oppskrifter/': 'Find saved recipes',
      '/lagre-oppskrifter-fra-instagram/': 'Save from Instagram',
      '/lagre-oppskrifter-fra-tiktok/': 'Save from TikTok',
      '/importer-fra-matprat/': 'Save from Matprat',
      '/importer-fra-koket/': 'Save from Köket.se',
      '/handskrevne-oppskrifter/': 'Photos and cookbooks',
      '/bytt-fra-paprika/': 'Import from Paprika',
      '/middagsforslag/': 'Dinner ideas',
      '/enkel-middag/': 'Easy dinners',
      '/tom-kjoleskapet/': 'Clean out the fridge',
      '/hva-kan-jeg-lage/': 'What can I make?',
      '/verktoy/enhetsomregner/': 'Unit converter',
      '/verktoy/kopp-til-dl/': 'Cups to deciliters',
      '/verktoy/dl-til-kopp/': 'Deciliters to cups',
      '/verktoy/celsius-til-fahrenheit/': 'Celsius to Fahrenheit',
      '/verktoy/dl-til-gram/': 'Cups to grams',
      '/verktoy/porsjoner/': 'Servings calculator',
      '/verktoy/kakeform/': 'Pan size converter',
      '/verktoy/steketid/': 'Roasting times',
      '/verktoy/pizzadeig/': 'Pizza dough calculator',
      '/verktoy/gjaer/': 'Yeast converter',
      '/verktoy/': 'All calculators',
      '/blogg/doble-oppskrift/': 'Double or halve a recipe',
      '/blogg/er-egget-ferskt/': 'Are your eggs fresh?',
      '/blogg/erstatte-egg/': 'Egg substitutes',
      '/blogg/kjernetemperatur/': 'Internal temperatures',
      '/blogg/koketider/': 'Boiling times',
      '/en/holidays/': 'Holiday cooking',
      '/blogg/': 'All kitchen tips',
      '/skapere/': 'For recipe creators',
      'https://www.instagram.com/matlyst_app/': 'Instagram',
      'https://www.tiktok.com/@matlyst.appen': 'TikTok',
      'https://www.youtube.com/@matlyst': 'YouTube',
      'https://www.pinterest.com/matlystapp/': 'Pinterest',
      '/personvern.html': 'Privacy',
    },
  },
};

// Kildeguider skrevet for språket. «Lagre oppskrifter» viser de lokale kildene per språk,
// ikke de norske overalt: Matprat og Köket.se i bokmål-hylla blir borte på de andre språkene
// (se NORSKE_KILDER) og erstattes av disse. `nbHref: null` fordi de ikke har noen bokmålslenke.
export const LOKALE_KILDER = {
  sv: [
    { href: '/sv/koket/', nbHref: null },
    { href: '/sv/landleys-kok/', nbHref: null },
  ],
  da: [
    { href: '/da/dr-mad/', nbHref: null },
    { href: '/da/alletiders-kogebog/', nbHref: null },
  ],
  // Engelsk: ingen nordiske kilder i hylla (kjent for få amerikanere); sidene nås fra «Alle guider».
  en: [],
};

// Lenker som bare finnes på ett språk, i andre hyller enn «Lagre oppskrifter» (der gjelder LOKALE_KILDER).
// Form: språk, hylle-id, så lenker med `href` og `foran` (nbHref til lenka den settes rett foran; uten `foran`
// havner den sist). `nbHref: null` fordi de ikke har noen bokmålslenke. Teksten ligger i språkets `lenker`.
export const LOKALE_LENKER = {
  en: { tips: [{ href: '/en/holidays/', foran: '/blogg/' }] },
};

// De norske kildelenkene i bokmål-hylla. Utenfor bokmål vises de aldri; hyllas kilder er LOKALE_KILDER.
const NORSKE_KILDER = new Set(['/importer-fra-matprat/', '/importer-fra-koket/']);

// `grunn` er nettstedets rot; testene peker den på en midlertidig kopi.
const filFor = (grunn, sti) => `${grunn}${sti.replace(/^\//, '')}${sti.endsWith('/') ? 'index.html' : ''}`;
const finnesFil = (grunn, sti) => existsSync(filFor(grunn, sti));
const harAnker = (grunn, sti, anker) => finnesFil(grunn, sti) && readFileSync(filFor(grunn, sti), 'utf8').includes(`id="${anker}"`);

function mangler(sprak, hva, nokkel, nbHref) {
  throw new Error(`mangler tekst: ${hva} på ${sprak} for ${nokkel}${nbHref === undefined ? '' : ` (nbHref ${nbHref})`}`);
}

// Slår opp språkets adresse i SIDEGRUPPER. Returnerer null når siden, fila eller ankeret mangler.
function lokalAdresse(grunn, sprak, nbHref) {
  if (/^https?:/.test(nbHref)) return nbHref;
  const [sti, anker] = nbHref.split('#');
  const mal = gruppeForSti(sti)?.sider[sprak];
  if (!mal || !finnesFil(grunn, mal)) return null;
  if (anker && !harAnker(grunn, mal, anker)) return null;
  return anker ? `${mal}#${anker}` : mal;
}

export function lokaliserHyller(sprak, tekst, { grunn = rot } = {}) {
  return HYLLER.nb.map((hylle) => {
    const navn = sprak === 'nb' ? hylle.navn : tekst?.navn?.[hylle.id] ?? mangler(sprak, `hyllenavn ${hylle.id}`, hylle.id);
    const lenker = hylle.lenker.filter((l) => sprak === 'nb' || !l.bareNb).map((l) => {
      if (sprak === 'nb') return { tekst: l.tekst, href: l.href, nbHref: l.href, finnes: l.finnes !== false };
      const t = tekst?.lenker?.[l.href] ?? mangler(sprak, 'lenke', l.href, l.href);
      const adresse = l.finnes === false || NORSKE_KILDER.has(l.href) ? null : lokalAdresse(grunn, sprak, l.href);
      return { tekst: t, href: adresse ?? l.href, nbHref: l.href, finnes: adresse !== null };
    });
    if (hylle.id === 'lagre' && sprak !== 'nb') {
      for (const k of LOKALE_KILDER[sprak] ?? []) {
        const t = tekst?.lenker?.[k.href] ?? mangler(sprak, 'lokal kildelenke', k.href, null);
        lenker.push({ tekst: t, href: k.href, nbHref: null, finnes: finnesFil(grunn, k.href) });
      }
    }
    if (sprak !== 'nb') {
      for (const k of LOKALE_LENKER[sprak]?.[hylle.id] ?? []) {
        const t = tekst?.lenker?.[k.href] ?? mangler(sprak, 'lokal lenke', k.href, null);
        const ny = { tekst: t, href: k.href, nbHref: null, finnes: finnesFil(grunn, k.href) };
        const i = k.foran === undefined ? -1 : lenker.findIndex((l) => l.nbHref === k.foran);
        if (i === -1) lenker.push(ny); else lenker.splice(i, 0, ny);
      }
    }
    return { id: hylle.id, flis: hylle.flis, navn, lenker };
  });
}
