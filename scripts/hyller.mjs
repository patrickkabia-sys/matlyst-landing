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
        { tekst: 'Dl til gram', href: '/verktoy/dl-til-gram/', finnes: false },
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
        { tekst: 'Alle kjøkkentips', href: '/blogg/' },
      ],
    },
    {
      id: 'matlyst', navn: 'Matlyst', flis: 'b3fdbf.webp',
      lenker: [
        { tekst: 'For matskapere', href: '/skapere/' },
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
export const HYLLETEKST = {};

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
  en: [
    { href: '/en/matprat/', nbHref: null },
    { href: '/en/koket/', nbHref: null },
    { href: '/en/landleys-kok/', nbHref: null },
    { href: '/en/alletiders-cookbook/', nbHref: null },
    { href: '/en/dr-food/', nbHref: null },
  ],
};

// De norske kildelenkene i bokmål-hylla. Utenfor bokmål vises de aldri; hyllas kilder er LOKALE_KILDER.
const NORSKE_KILDER = new Set(['/importer-fra-matprat/', '/importer-fra-koket/']);

const filFor = (sti) => `${rot}${sti.replace(/^\//, '')}${sti.endsWith('/') ? 'index.html' : ''}`;
const finnesFil = (sti) => existsSync(filFor(sti));
const harAnker = (sti, anker) => finnesFil(sti) && readFileSync(filFor(sti), 'utf8').includes(`id="${anker}"`);

function mangler(sprak, hva, nokkel, nbHref) {
  throw new Error(`mangler tekst: ${hva} på ${sprak} for ${nokkel}${nbHref === undefined ? '' : ` (nbHref ${nbHref})`}`);
}

// Slår opp språkets adresse i SIDEGRUPPER. Returnerer null når siden, fila eller ankeret mangler.
function lokalAdresse(sprak, nbHref) {
  if (/^https?:/.test(nbHref)) return nbHref;
  const [sti, anker] = nbHref.split('#');
  const mal = gruppeForSti(sti)?.sider[sprak];
  if (!mal || !finnesFil(mal)) return null;
  if (anker && !harAnker(mal, anker)) return null;
  return anker ? `${mal}#${anker}` : mal;
}

export function lokaliserHyller(sprak, tekst) {
  return HYLLER.nb.map((hylle) => {
    const navn = sprak === 'nb' ? hylle.navn : tekst?.navn?.[hylle.id] ?? mangler(sprak, `hyllenavn ${hylle.id}`, hylle.id);
    const lenker = hylle.lenker.map((l) => {
      if (sprak === 'nb') return { tekst: l.tekst, href: l.href, nbHref: l.href, finnes: l.finnes !== false };
      const t = tekst?.lenker?.[l.href] ?? mangler(sprak, 'lenke', l.href, l.href);
      const adresse = l.finnes === false || NORSKE_KILDER.has(l.href) ? null : lokalAdresse(sprak, l.href);
      return { tekst: t, href: adresse ?? l.href, nbHref: l.href, finnes: adresse !== null };
    });
    if (hylle.id === 'lagre' && sprak !== 'nb') {
      for (const k of LOKALE_KILDER[sprak] ?? []) {
        const t = tekst?.lenker?.[k.href] ?? mangler(sprak, 'lokal kildelenke', k.href, null);
        lenker.push({ tekst: t, href: k.href, nbHref: null, finnes: finnesFil(k.href) });
      }
    }
    return { id: hylle.id, flis: hylle.flis, navn, lenker };
  });
}
