// Felles verktøy for høytidssidene på norsk (/julebord/, /nyttarsmiddag/). Mønsteret er det samme som /julemiddag/:
// HVERT tall på siden kommer fra hoytider.data.json, med kilde, adresse, dato på kilden, hentedato og sitatet fra kilden.
// Prosaen skriver aldri et tall selv, den henter det med t('id'). Finner vi ikke kilde for et tall, står det ikke på siden.
// Låst av test/hoytider-nb.test.mjs. Kilden til sitatene kontrolleres med kildekontroll-hoytider.mjs.
import { readFileSync } from 'node:fs';
import { forfatterPerson, harForfatter } from '../forfatter.mjs';

export const lesDatasett = (url) => JSON.parse(readFileSync(url, 'utf8'));
export const DATA = lesDatasett(new URL('./hoytider.data.json', import.meta.url));
export const HENTET = DATA.hentet;
export const HENTET_TEKST = DATA.hentetTekst;
export const BASE = 'https://matlyst-app.no';
export const aar = (id, data = DATA) => data.kilder[id].dato.match(/\d{4}/u)[0];

export const p = (...ps) => ps.map((x) => `<p>${x}</p>`).join('');
export const ul = (...li) => `<ul>${li.map((x) => `<li>${x}</li>`).join('')}</ul>`;
export const tabell = (hode, rader) => `<table><thead><tr>${hode.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rader.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`).join('')}</tbody></table>`;
export const kg = (g) => (g >= 1000 ? `${String(Math.round(g) / 1000).replace('.', ',')} kg` : `${Math.round(g)} g`);
export const dl = (x) => `${String(x).replace('.', ',')} dl`;

// Ord i kildekortene. Andre markeder (da, sv) sender sine egne.
export const KORTORD_NB = { adresse: 'Adresse', dato: 'Dato på kilden', hentet: 'Hentet', tall: 'Tall vi bruker', ingen: 'Ingen tall, bare fremgangsmåte og regler i tekst.' };

/** Én sidevariant: egne tellere for hvilke tall og kilder siden faktisk bruker. `data` og `kortord` byttes for et annet marked. */
export function lagSide({ data = DATA, kortord = KORTORD_NB } = {}) {
  const bruktTall = new Set();
  const bruktTekst = new Set();
  const bruktKilde = new Set();
  const tall = (id) => {
    const x = data.tall[id];
    if (!x) throw new Error(`Tall uten kilde: ${id}`);
    return x;
  };
  const t = (id) => { bruktTall.add(id); bruktKilde.add(tall(id).kilde); return tall(id).vis; };
  /** Tall som regnes ut av et tall (mengdetabeller): marker bare som brukt. */
  const rad = (id) => { t(id); return tall(id); };
  const henv = (prefiks, navn) => (id) => {
    if (!data.kilder[id]?.navn.startsWith(`${prefiks}:`)) throw new Error(`Feil kilde for ${navn}: ${id}`);
    bruktKilde.add(id);
    return `${navn} (${aar(id, data)})`;
  };
  const mp = henv('MatPrat', 'MatPrat');
  const mt = henv('Mattilsynet', 'Mattilsynet');
  /** Tekst uten tall som likevel hviler på en kilde: id i `tekst`-lista. Teksten på siden er en omskriving, sitatet ligger i datafila. */
  const tekst = (id) => { const x = data.tekst[id]; if (!x) throw new Error(`Tekst uten kilde: ${id}`); bruktTekst.add(id); bruktKilde.add(x.kilde); return ''; };
  const brukt = () => ({ tall: [...bruktTall], tekst: [...bruktTekst], kilder: Object.keys(data.kilder).filter((k) => bruktKilde.has(k)) });
  const kilderListe = () => brukt().kilder.map((id) => {
    const k = data.kilder[id];
    const mine = [...bruktTall].filter((x) => tall(x).kilde === id);
    const tallHtml = mine.length ? `<ul>${mine.map((x) => `<li data-tall="${x}">${tall(x).hva}: <strong>${tall(x).vis}</strong></li>`).join('')}</ul>` : kortord.ingen;
    return `<div class="scenario" id="kilde-${id}"><h3>${k.navn}</h3><dl><dt>${kortord.adresse}</dt><dd><a href="${k.url}" rel="noopener">${k.url}</a></dd><dt>${kortord.dato}</dt><dd>${k.dato}</dd><dt>${kortord.hentet}</dt><dd><time datetime="${data.hentet}">${data.hentetTekst}</time></dd><dt>${kortord.tall}</dt><dd>${tallHtml}</dd></dl></div>`;
  }).join('');
  return { t, rad, tall, mp, mt, henv, tekst, brukt, kilderListe };
}

export function skjemaFor({ sti, tittel, h1, beskrivelse, kilder, data = DATA, lang = 'nb', forside = 'Forside', hjem = `${BASE}/` }) {
  return [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: forside, item: hjem },
      { '@type': 'ListItem', position: 2, name: h1, item: `${BASE}/${sti}` },
    ] },
    { '@context': 'https://schema.org', '@type': 'Article', headline: h1, description: beskrivelse, image: [`${BASE}/images/og.jpg`], inLanguage: lang, datePublished: data.hentet, dateModified: data.hentet, mainEntityOfPage: `${BASE}/${sti}`,
      author: harForfatter(sti) ? forfatterPerson() : { '@type': 'Organization', name: 'Matlyst', url: `${BASE}/` }, publisher: { '@type': 'Organization', name: 'Matlyst', url: `${BASE}/` },
      citation: kilder.map((id) => ({ '@type': 'WebPage', name: data.kilder[id].navn, url: data.kilder[id].url })) },
  ];
}

export const KILDEINTRO = p(`Hvert tall om mat, mengde og tid på denne siden står her, med kilde, adresse og dato. Tabellene er regnet ut ved å gange tallene per person med antall gjester. Vi har åpnet og lest hver side ${HENTET_TEKST}, og sitatene vi bygger på er lagret ordrett og kontrollert mot sidene. Mattilsynet er den norske myndigheten for mattrygghet, og MatPrat er Opplysningskontoret for egg og kjøtt. Mengder og tider er veiledende. Gjelder kilden en annen situasjon enn din, for eksempel en annen kjøttype eller et annet kjøleskap, gjelder kilden, ikke siden her.`);
