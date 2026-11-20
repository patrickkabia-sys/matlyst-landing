// Om-siden (nb): hvem som lager Matlyst. Utkast til Patricks godkjenning, skrevet 2026-11-20.
// BARE disse faktaene om personen er godkjent: Patrick Kabia, kjøletekniker av yrke, har laget Matlyst.
// Resten kommer fra sider som allerede er publisert: personvern.html («drives av en privatperson i Norge», behandlingsansvarlig), forsiden og produktsidene.
// Ingen alder, bosted, familie, utdanning, årstall, sitater, bilde eller historie om hvorfor appen ble laget. Låst av test/om.test.mjs.
import { byggRik } from './../rik-sider.mjs';

import { BASE, PERSON_ID } from '../forfatter.mjs';

export { BASE, PERSON_ID };
export const ORG_ID = `${BASE}/#organisasjon`;
export const PUBLISERT = '2026-11-20';

const p = (...ps) => ps.map((x) => `<p>${x}</p>`).join('');
const ul = (...li) => `<ul>${li.map((x) => `<li>${x}</li>`).join('')}</ul>`;

const rik = byggRik({
  lang: 'nb',
  svarTekst: 'Matlyst er laget av Patrick Kabia, som er kjøletekniker av yrke. Matlyst drives av en privatperson i Norge. På denne siden står det hvem som står bak, hvordan tallene på sidene våre kommer til, og hvordan du kommer i kontakt.',
  seksjoner: [
    ['Hvem som står bak Matlyst', p(
      'Matlyst er laget av Patrick Kabia. Han er kjøletekniker av yrke.',
      'Matlyst drives av en privatperson i Norge, og Patrick er behandlingsansvarlig for personopplysningene i appen. Hva vi lagrer og hvorfor, står i <a href="/personvern.html">personvernerklæringen</a>, og vilkårene står i <a href="/vilkar.html">vilkårene</a>.')],
    ['Hvorfor Matlyst ble laget', p(
      'Patrick er ikke utdannet kokk. Han er utdannet kjøletekniker. Mat er kjærlighetsspråket hans, og han ville slutte å miste oppskriftene han lager maten etter.',
      'Som lærling kom han inn i noen av de beste restaurantkjøkkenene i hjembyen sin. Han var aldri den som lagde maten. Han var den som fikset kjølerommet før første bestilling kom inn. Derfra så han på nært hold hvordan profesjonelle jobber: ingenting er tilfeldig, og alt har sin faste plass, merkelapp og dato.',
      'Hjemme lå oppskriftene hans på åtte steder: notater, OneNote, en oppskriftsapp, bokmerker, TikTok, Instagram, YouTube og favoritter. Han kunne lage maten, men hadde ikke noe system. Så han bygde systemet han hadde sett i de kjøkkenene, for helt vanlige familiemiddager.')],
    ['Lagre og finn oppskriftene dine', p(
      'Matlyst er en oppskriftsapp for iPhone og Android. Du lagrer oppskrifter fra nettsider, Instagram og TikTok, eller fra et bilde, og får dem som en ryddig liste med ingredienser og steg. Oppskriftene kan du søke i og regne om. Matlyst er gratis å komme i gang med.',
      'Matlyst bruker KI til å lese oppskrifter fra innlegg og bilder, så sjekk alltid utkastet mot originalen før du lagrer. Mer om appen står på siden om <a href="/oppskriftsbok-app/">oppskriftsappen</a>.')],
    ['Planlegg uka og handle', p(
      'Legg oppskrifter i <a href="/ukemeny/">ukemenyen</a>, og send ingrediensene til <a href="/handleliste/">handlelista</a>. I <a href="/spiskammer-app/">spiskammeret</a> holder du oversikt over det du har hjemme.')],
    ['Hva yrket betyr for innholdet', p(
      'Kjøling er faget til Patrick: temperatur, tid og hva som skjer med mat i kjøleskapet og fryseren. Matlyst har sider om holdbarhet, kjøling og frysing, og der kjenner han faget.',
      'Det betyr ikke at tallene på sidene er hans egne vurderinger. Tallene kommer fra navngitte kilder, for eksempel Mattilsynet og MatPrat, og hver side viser hvilke. Det er kildene som gjør at du kan stole på tallene, ikke yrket.')],
    ['Hvordan innholdet lages og kontrolleres', p('Tekstene på nettstedet skrives med hjelp av KI og gjennomgås av Patrick, og tallene har kilde.',
      'Dette er reglene vi følger når en side har tall om mattrygghet, holdbarhet, kjøling eller tining.')
      + ul(
        '<strong>Kilde på hvert tall.</strong> Hvert tall har en kilde med adresse og datoen vi åpnet og leste kilden.',
        '<strong>Kilden leses, ikke gjettes.</strong> Vi bruker ikke tall fra hukommelsen eller fra andre sider som viderefører tall.',
        '<strong>Veiledende tall merkes.</strong> Mengder per person og steketider er veiledende, og sidene sier det.',
        '<strong>Ingen kilde, ingen tall.</strong> Finner vi ikke en kilde, tas tallet ut av siden. Vi gir ikke egne tall.',
        '<strong>Ingen helsepåstander.</strong> Vi gir ikke kostholds- eller helseråd.',
        '<strong>Ingen egne oppskrifter.</strong> Matlyst gir svar og verktøy. Oppskriftene er dine.')
      + p('Siden om <a href="/julemiddag/">julemiddagen</a> er et eksempel. Der står hvert tall i en liste med kilde, adresse og hentedato, og en automatisk test feiler hvis et tall på siden mangler kilde.',
        'Matlyst er ikke tilknyttet kildene vi henviser til.')],
    ['Rettelser', p(
      'Har vi tatt feil, eller har en kilde endret seg, vil vi vite det. Skriv til <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a> og oppgi siden og tallet. Vi sjekker mot kilden, retter siden og oppdaterer datoen.')],
    ['Kontakt', p('Spørsmål om appen, personvern eller innholdet går til <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>.')
      + ul(
        '<a href="https://www.instagram.com/matlyst_app/" rel="noopener">Instagram: @matlyst_app</a>',
        '<a href="https://www.tiktok.com/@matlyst.appen" rel="noopener">TikTok: @matlyst.appen</a>',
        '<a href="https://www.youtube.com/@matlyst" rel="noopener">YouTube: @matlyst</a>',
        '<a href="https://www.pinterest.com/matlystapp/" rel="noopener">Pinterest: @matlystapp</a>')],
  ],
}).html;

const TITTEL = 'Om Matlyst: hvem som lager appen';
const BESKRIVELSE = 'Matlyst er laget av Patrick Kabia, kjøletekniker av yrke. Se hvem som står bak, hvordan tallene på sidene får kilde og dato, og hvordan du tar kontakt.';
const H1 = 'Om Matlyst';

function skjema() {
  return [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Forside', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: H1, item: `${BASE}/om/` },
    ] },
    { '@context': 'https://schema.org', '@type': 'AboutPage', '@id': `${BASE}/om/#side`, url: `${BASE}/om/`, name: TITTEL, description: BESKRIVELSE, inLanguage: 'nb',
      about: { '@id': ORG_ID }, mainEntity: { '@id': PERSON_ID } },
    { '@context': 'https://schema.org', '@type': 'Person', '@id': PERSON_ID, name: 'Patrick Kabia', jobTitle: 'Kjøletekniker', url: `${BASE}/om/`, worksFor: { '@id': ORG_ID } },
  ];
}

export const side = {
  title: TITTEL,
  description: BESKRIVELSE,
  eyebrow: 'Om oss',
  h1: H1,
  lead: 'Matlyst er laget av Patrick Kabia, som er kjøletekniker av yrke. Her står det hvem som står bak, og hvordan vi lar tall få kilde og dato.',
  publisert: PUBLISERT,
  schemas: skjema(),
  forst: '',
  stegTittel: 'Kort om siden',
  steg: [['Hvem', 'Patrick Kabia, kjøletekniker, har laget Matlyst.'], ['Hvordan', 'Hvert tall har kilde, adresse og dato.'], ['Kontakt', 'hei@matlyst-app.no']],
  alternativ: '',
  grense: '',
  seksjoner: [],
  faqTittel: 'Spørsmål om Matlyst',
  rik,
  faq: [
    ['Hvem lager Matlyst?', 'Matlyst er laget av Patrick Kabia, som er kjøletekniker av yrke. Matlyst drives av en privatperson i Norge.'],
    ['Hvordan kommer jeg i kontakt?', 'Skriv til hei@matlyst-app.no. Der svarer vi på spørsmål om appen, personvern og innholdet på sidene.'],
    ['Hvor kommer tallene på sidene fra?', 'Fra navngitte kilder som Mattilsynet og MatPrat. Hvert tall har en kilde med adresse og datoen vi leste den, og tall vi ikke finner kilde for, tas ut.'],
    ['Hva gjør jeg hvis jeg finner en feil?', 'Skriv til hei@matlyst-app.no og oppgi siden og tallet. Vi sjekker mot kilden, retter siden og oppdaterer datoen.'],
    ['Gir Matlyst helseråd eller egne oppskrifter?', 'Nei. Matlyst gir svar og verktøy, ikke helseråd og ikke egne oppskrifter. Du lagrer oppskriftene du selv bruker.'],
    ['Hva skjer med opplysningene mine?', 'Det står i personvernerklæringen. Der står det også at Matlyst aldri selger opplysningene dine.'],
  ],
  cta: 'Prøv Matlyst med dine egne oppskrifter',
};
