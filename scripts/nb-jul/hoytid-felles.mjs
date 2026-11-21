// Felles verktøy for høytidssidene på norsk (/julebord/, /nyttarsmiddag/). Mønsteret er det samme som /julemiddag/:
// HVERT tall på siden kommer fra hoytider.data.json, med kilde, adresse, dato på kilden, hentedato og sitatet fra kilden.
// Prosaen skriver aldri et tall selv, den henter det med t('id'). Finner vi ikke kilde for et tall, står det ikke på siden.
// Låst av test/hoytider-nb.test.mjs. Kilden til sitatene kontrolleres med kildekontroll-hoytider.mjs.
import { readFileSync } from 'node:fs';
import { forfatterPerson, harForfatter } from '../forfatter.mjs';

export const BASE = 'https://matlyst-app.no';

// Teksten som er fast per marked (kildekort, brødsmuler, språk). Tallene og kildene ligger i datafila til markedet.
// Norsk er standard, og de norske sidene importerer DATA, HENTET osv. direkte. Svensk bygges med lagMarked('sv') (scripts/sv-jul/).
const TEKST = {
  nb: { fil: './hoytider.data.json', lang: 'nb', forsideNavn: 'Forside', forsideSti: '/', brodsmuler: true, adresse: 'Adresse', datoKilde: 'Dato på kilden', hentet: 'Hentet', tallVi: 'Tall vi bruker', ingenTall: 'Ingen tall, bare fremgangsmåte og regler i tekst.',
    kildeintro: (ht) => `Hvert tall om mat, mengde og tid på denne siden står her, med kilde, adresse og dato. Tabellene er regnet ut ved å gange tallene per person med antall gjester. Vi har åpnet og lest hver side ${ht}, og sitatene vi bygger på er lagret ordrett og kontrollert mot sidene. Mattilsynet er den norske myndigheten for mattrygghet, og MatPrat er Opplysningskontoret for egg og kjøtt. Mengder og tider er veiledende. Gjelder kilden en annen situasjon enn din, for eksempel en annen kjøttype eller et annet kjøleskap, gjelder kilden, ikke siden her.` },
  sv: { fil: '../sv-jul/hoytider.data.json', lang: 'sv', forsideNavn: 'Startsida', forsideSti: '/sv/', brodsmuler: false, adresse: 'Adress', datoKilde: 'Datum på källan', hentet: 'Hämtad', tallVi: 'Siffror vi använder', ingenTall: 'Inga siffror, bara arbetssätt och regler i text.',
    kildeintro: (ht) => `Varje siffra om mat, mängd och tid på den här sidan står här, med källa, adress och datum. Tabellerna är räknade genom att multiplicera siffrorna per person med antalet gäster. Vi har öppnat och läst varje sida ${ht}, och citaten vi bygger på är sparade ordagrant och kontrollerade mot sidorna. Livsmedelsverket är den svenska myndigheten för mat och livsmedel. De andra källorna är Svenskt Kött, Svensk Fågel och Arla, och vi namnger dem med år varje gång. Mängder och tider är riktvärden. Gäller källan en annan situation än din, till exempel en annan köttsort eller ett annat kylskåp, gäller källan, inte den här sidan.` },
};

export const p = (...ps) => ps.map((x) => `<p>${x}</p>`).join('');
export const ul = (...li) => `<ul>${li.map((x) => `<li>${x}</li>`).join('')}</ul>`;
export const tabell = (hode, rader) => `<table><thead><tr>${hode.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rader.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`).join('')}</tbody></table>`;
export const kg = (g) => (g >= 1000 ? `${String(Math.round(g) / 1000).replace('.', ',')} kg` : `${Math.round(g)} g`);
export const dl = (x) => `${String(x).replace('.', ',')} dl`;

/** Alt som er felles for en høytidsside, for ett marked: datafil, kildekort, skjema, tellere. `lagSide()` gir tellerne for én sidevariant. */
export function lagMarked(sprak = 'nb') {
  const T = TEKST[sprak];
  const DATA = JSON.parse(readFileSync(new URL(T.fil, import.meta.url), 'utf8'));
  const HENTET = DATA.hentet;
  const HENTET_TEKST = DATA.hentetTekst;
  const aar = (id) => DATA.kilder[id].dato.match(/\d{4}/u)[0];

  /** Én sidevariant: egne tellere for hvilke tall og kilder siden faktisk bruker. */
  function lagSide() {
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
    /** Henvisning til en kilde med utgiver og år: «MatPrat (2025)». Kilden må ha et navn som starter med «utgiver:». */
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
      const tallHtml = mine.length ? `<ul>${mine.map((x) => `<li data-tall="${x}">${tall(x).hva}: <strong>${tall(x).vis}</strong></li>`).join('')}</ul>` : T.ingenTall;
      return `<div class="scenario" id="kilde-${id}"><h3>${k.navn}</h3><dl><dt>${T.adresse}</dt><dd><a href="${k.url}" rel="noopener">${k.url}</a></dd><dt>${T.datoKilde}</dt><dd>${k.dato}</dd><dt>${T.hentet}</dt><dd><time datetime="${HENTET}">${HENTET_TEKST}</time></dd><dt>${T.tallVi}</dt><dd>${tallHtml}</dd></dl></div>`;
    }).join('');
    return { t, rad, tall, mp, mt, henv, tekst, brukt, kilderListe };
  }

  /** `sti` er adressen uten ledende skråstrek, med språkmappen: «julebord/» eller «sv/julbord/». */
  function skjemaFor({ sti, tittel, h1, beskrivelse, kilder }) {
    // De svenske sidene får brødsmulene fra generatoren (generer-lokalsider.mjs), så de lager bare Article her.
    return [
      ...(T.brodsmuler ? [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: T.forsideNavn, item: `${BASE}${T.forsideSti}` },
        { '@type': 'ListItem', position: 2, name: h1, item: `${BASE}/${sti}` },
      ] }] : []),
      { '@context': 'https://schema.org', '@type': 'Article', headline: h1, description: beskrivelse, image: [`${BASE}/images/og.jpg`], inLanguage: T.lang, datePublished: HENTET, dateModified: HENTET, mainEntityOfPage: `${BASE}/${sti}`,
        author: harForfatter(sti) ? forfatterPerson() : { '@type': 'Organization', name: 'Matlyst', url: `${BASE}/` }, publisher: { '@type': 'Organization', name: 'Matlyst', url: `${BASE}/` },
        citation: kilder.map((id) => ({ '@type': 'WebPage', name: DATA.kilder[id].navn, url: DATA.kilder[id].url })) },
    ];
  }

  const KILDEINTRO = p(T.kildeintro(HENTET_TEKST));
  return { DATA, HENTET, HENTET_TEKST, aar, lagSide, skjemaFor, KILDEINTRO, kildetekster: T };
}

const NB = lagMarked('nb');
export const { DATA, HENTET, HENTET_TEKST, aar, lagSide, skjemaFor, KILDEINTRO } = NB;
