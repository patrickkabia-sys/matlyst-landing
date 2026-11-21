// Felles verktøy for høytidssidene på norsk (/julebord/, /nyttarsmiddag/). Mønsteret er det samme som /julemiddag/:
// HVERT tall på siden kommer fra hoytider.data.json, med kilde, adresse, dato på kilden, hentedato og sitatet fra kilden.
// Prosaen skriver aldri et tall selv, den henter det med t('id'). Finner vi ikke kilde for et tall, står det ikke på siden.
// Låst av test/hoytider-nb.test.mjs. Kilden til sitatene kontrolleres med kildekontroll-hoytider.mjs.
import { readFileSync } from 'node:fs';
import { forfatterPerson, harForfatter } from '../forfatter.mjs';

export const DATA = JSON.parse(readFileSync(new URL('./hoytider.data.json', import.meta.url), 'utf8'));
export const HENTET = DATA.hentet;
export const HENTET_TEKST = DATA.hentetTekst;
export const BASE = 'https://matlyst-app.no';
export const aar = (id) => DATA.kilder[id].dato.match(/\d{4}/u)[0];

export const p = (...ps) => ps.map((x) => `<p>${x}</p>`).join('');
export const ul = (...li) => `<ul>${li.map((x) => `<li>${x}</li>`).join('')}</ul>`;
export const tabell = (hode, rader) => `<table><thead><tr>${hode.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rader.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`).join('')}</tbody></table>`;
export const kg = (g) => (g >= 1000 ? `${String(Math.round(g) / 1000).replace('.', ',')} kg` : `${Math.round(g)} g`);
export const dl = (x) => `${String(x).replace('.', ',')} dl`;

/** Én sidevariant: egne tellere for hvilke tall og kilder siden faktisk bruker. */
export function lagSide() {
  const bruktTall = new Set();
  const bruktTekst = new Set();
  const bruktKilde = new Set();
  const tall = (id) => {
    const x = DATA.tall[id];
    if (!x) throw new Error(`Tall uten kilde: ${id}`);
    return x;
  };
  const t = (id) => { bruktTall.add(id); bruktKilde.add(tall(id).kilde); return tall(id).vis; };
  /** Tall som regnes ut av et tall (mengdetabeller): marker bare som brukt. */
  const rad = (id) => { t(id); return tall(id); };
  const henv = (prefiks, navn) => (id) => {
    if (!DATA.kilder[id]?.navn.startsWith(`${prefiks}:`)) throw new Error(`Feil kilde for ${navn}: ${id}`);
    bruktKilde.add(id);
    return `${navn} (${aar(id)})`;
  };
  const mp = henv('MatPrat', 'MatPrat');
  const mt = henv('Mattilsynet', 'Mattilsynet');
  /** Tekst uten tall som likevel hviler på en kilde: id i `tekst`-lista. Teksten på siden er en omskriving, sitatet ligger i datafila. */
  const tekst = (id) => { const x = DATA.tekst[id]; if (!x) throw new Error(`Tekst uten kilde: ${id}`); bruktTekst.add(id); bruktKilde.add(x.kilde); return ''; };
  const brukt = () => ({ tall: [...bruktTall], tekst: [...bruktTekst], kilder: Object.keys(DATA.kilder).filter((k) => bruktKilde.has(k)) });
  const kilderListe = () => brukt().kilder.map((id) => {
    const k = DATA.kilder[id];
    const mine = [...bruktTall].filter((x) => tall(x).kilde === id);
    const tallHtml = mine.length ? `<ul>${mine.map((x) => `<li data-tall="${x}">${tall(x).hva}: <strong>${tall(x).vis}</strong></li>`).join('')}</ul>` : 'Ingen tall, bare fremgangsmåte og regler i tekst.';
    return `<div class="scenario" id="kilde-${id}"><h3>${k.navn}</h3><dl><dt>Adresse</dt><dd><a href="${k.url}" rel="noopener">${k.url}</a></dd><dt>Dato på kilden</dt><dd>${k.dato}</dd><dt>Hentet</dt><dd><time datetime="${HENTET}">${HENTET_TEKST}</time></dd><dt>Tall vi bruker</dt><dd>${tallHtml}</dd></dl></div>`;
  }).join('');
  return { t, rad, tall, mp, mt, tekst, brukt, kilderListe };
}

export function skjemaFor({ sti, tittel, h1, beskrivelse, kilder }) {
  return [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Forside', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: h1, item: `${BASE}/${sti}` },
    ] },
    { '@context': 'https://schema.org', '@type': 'Article', headline: h1, description: beskrivelse, image: [`${BASE}/images/og.jpg`], inLanguage: 'nb', datePublished: HENTET, dateModified: HENTET, mainEntityOfPage: `${BASE}/${sti}`,
      author: harForfatter(sti) ? forfatterPerson() : { '@type': 'Organization', name: 'Matlyst', url: `${BASE}/` }, publisher: { '@type': 'Organization', name: 'Matlyst', url: `${BASE}/` },
      citation: kilder.map((id) => ({ '@type': 'WebPage', name: DATA.kilder[id].navn, url: DATA.kilder[id].url })) },
  ];
}

export const KILDEINTRO = p(`Hvert tall om mat, mengde og tid på denne siden står her, med kilde, adresse og dato. Tabellene er regnet ut ved å gange tallene per person med antall gjester. Vi har åpnet og lest hver side ${HENTET_TEKST}, og sitatene vi bygger på er lagret ordrett og kontrollert mot sidene. Mattilsynet er den norske myndigheten for mattrygghet, og MatPrat er Opplysningskontoret for egg og kjøtt. Mengder og tider er veiledende. Gjelder kilden en annen situasjon enn din, for eksempel en annen kjøttype eller et annet kjøleskap, gjelder kilden, ikke siden her.`);
