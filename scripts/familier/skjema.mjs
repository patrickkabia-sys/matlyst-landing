// Strukturerte data (schema.org) for sidefamiliene. Byggerne gir ferdige objekter som malene legger i `schemas`.
// Ingen av dem lager HowTo eller FAQPage: HowTo gir ingen rike resultater lenger, og FAQPage lager
// generatorene selv fra synlig FAQ (guidePage tar navnet 'faq' sammen med objektene).
// Endres denne fila, går sidekontrollen i full modus (se scripts/revisjon-omfang.mjs).
import { BASE } from '../forfatter.mjs';

const KONTEKST = 'https://schema.org';
const PRISVALUTA = Object.freeze({ nb: 'NOK', sv: 'SEK', da: 'DKK', en: 'USD' });
const adresseUt = (adresse) => (String(adresse).startsWith('/') ? `${BASE}${adresse}` : adresse);
const organisasjon = () => ({ '@type': 'Organization', name: 'Matlyst', url: BASE });

/** @param {{ navn: string, adresse: string }[]} ledd */
export function brodsmuler(ledd) {
  return {
    '@context': KONTEKST,
    '@type': 'BreadcrumbList',
    itemListElement: ledd.map((l, i) => ({ '@type': 'ListItem', position: i + 1, name: l.navn, item: adresseUt(l.adresse) })),
  };
}

export function webApplikasjon({ navn, beskrivelse, adresse, sprak }) {
  return {
    '@context': KONTEKST,
    '@type': 'WebApplication',
    name: navn,
    description: beskrivelse,
    url: adresseUt(adresse),
    inLanguage: sprak,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: PRISVALUTA[sprak] ?? 'USD' },
  };
}

/** `kilder`: Kilde-objekter fra dataskjemaet (felles.mjs). Hver blir én citation. */
export function artikkel({ tittel, beskrivelse, adresse, sprak, publisert, endret, kilder, forfatter }) {
  return {
    '@context': KONTEKST,
    '@type': 'Article',
    headline: tittel,
    description: beskrivelse,
    image: [`${BASE}/images/og.jpg`],
    inLanguage: sprak,
    datePublished: publisert,
    dateModified: endret ?? publisert,
    mainEntityOfPage: adresseUt(adresse),
    author: forfatter ?? organisasjon(),
    publisher: organisasjon(),
    citation: kilder.map((k) => ({ '@type': 'CreativeWork', name: k.navn, publisher: { '@type': 'Organization', name: k.utgiver }, url: k.adresse, datePublished: String(k.aar) })),
  };
}

export function elementliste({ navn, adresse, elementer }) {
  return {
    '@context': KONTEKST,
    '@type': 'ItemList',
    name: navn,
    url: adresseUt(adresse),
    numberOfItems: elementer.length,
    itemListElement: elementer.map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.navn, url: adresseUt(e.adresse) })),
  };
}
