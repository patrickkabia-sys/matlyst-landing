// Malen för familjen «rester» (sv): samlingssidan /sv/recept-pa-ingredienser/ och en sida per vara under /sv/recept-pa-ingredienser/med-<vara>/.
// Siffror och meningar om förvaring kommer från data.sv.json (Livsmedelsverket och Svenskt Kött, samma som sidorna om hållbarhet och frysa), inte från norska sidor.
import { lagMal } from './bygg-flersprak.mjs';
import { NAV, TEKST, FORVARING } from './tekst-sv.mjs';

export const ROT = '/sv/recept-pa-ingredienser/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  lang: 'sv',
  hjem: ['Hem', '/sv/'],
  rot: ROT,
  innhold: TEKST,
  nav: NAV,
  eyebrow: 'Vad kan jag laga?',
  cta: 'Se vad du kan laga med det du har i Matlyst',
  relatertTittel: 'Fler varor',
  kildeH2: 'Källor',
  kildeIntro: 'Siffror och meningar om förvaring kommer från källorna nedan, och varje mening är kontrollerad mot källsidan. Där en sida saknar eget datum står året vi läste den. Rätterna är våra förslag och har ingen källa.',
  lest: 'Läst',
  post: 'Har en källa ändrats, eller hittade du ett fel? Skriv till <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>.',
  stegTittel: 'Kort sagt',
  faqTittel: 'Vanliga frågor',
  til: 'till',
  sitat: ['”', '”'],
  grad: ' ',
  dato: (a, m, d) => `${d} ${['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'][m - 1]} ${a}`,
  enkelt: { veckor: 'vecka', dagar: 'dag', timmar: 'timme', månader: 'månad', år: 'år' },
  oppbevaringH2: FORVARING,
  se: {
    tittel: 'Läs också:',
    navn: { holdbarhet: 'Hållbarhet', frysing: 'Frysa' },
    rot: { holdbarhet: '/sv/hallbarhet/', frysing: '/sv/frysa/' },
    lenker: {
      kjottdeig: { holdbarhet: ['kjott'], frysing: ['kottfars'] },
      kylling: { holdbarhet: ['rester'], frysing: ['middagsrester'] },
      egg: { holdbarhet: ['egg'], frysing: ['egg'] },
      poteter: { holdbarhet: ['frukt-og-gronnsaker'] },
      'kokte-poteter': { holdbarhet: ['rester', 'kokt-ris-og-pasta'], frysing: ['middagsrester'] },
      ris: { holdbarhet: ['kokt-ris-og-pasta'], frysing: ['middagsrester'] },
      pasta: { holdbarhet: ['kokt-ris-og-pasta'], frysing: ['middagsrester'] },
      laks: { holdbarhet: ['rester'], frysing: ['fisk'] },
      'kokt-skinke': { holdbarhet: ['framme', 'rester'], frysing: ['middagsrester'] },
      floete: { frysing: ['melk-og-fil'] },
      gulrotter: { holdbarhet: ['frukt-og-gronnsaker'], frysing: ['frukt-og-gronnsaker'] },
      brod: { holdbarhet: ['brod'], frysing: ['brod'] },
      bananer: { frysing: ['frukt-og-gronnsaker'] },
    },
  },
});
