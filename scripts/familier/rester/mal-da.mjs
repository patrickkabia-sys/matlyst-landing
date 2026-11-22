// Mal for familien «rester» (da): samlesiden /da/opskrifter-ud-fra-ingredienser/ og én side per vare under /da/opskrifter-ud-fra-ingredienser/med-<vare>/.
// Tal og sætninger om opbevaring kommer fra data.da.json (Fødevarestyrelsen, Forbrugerrådet Tænk, Madens Verden, Teknologisk Institut og Arla, de samme som siderne om holdbarhed og frysning).
import { lagMal } from './bygg-flersprak.mjs';
import { NAV, OPBEVARING, TEKST } from './tekst-da.mjs';

export const ROT = '/da/opskrifter-ud-fra-ingredienser/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  lang: 'da',
  hjem: ['Forside', '/da/'],
  rot: ROT,
  innhold: TEKST,
  nav: NAV,
  eyebrow: 'Hvad kan jeg lave?',
  cta: 'Se, hvad du kan lave med det, du har, i Matlyst',
  relatertTittel: 'Flere varer',
  kildeH2: 'Kilder',
  kildeIntro: 'Tal og sætninger om opbevaring kommer fra kilderne nedenfor, og hver sætning er kontrolleret mod kildesiden. Hvor en side ikke har sin egen dato, står det år, vi læste den. Rettene er vores forslag og har ingen kilde.',
  lest: 'Læst',
  post: 'Har en kilde ændret sig, eller fandt du en fejl? Skriv til <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>.',
  stegTittel: 'Kort sagt',
  faqTittel: 'Spørgsmål og svar',
  til: 'til',
  sitat: ['»', '«'],
  grad: ' ',
  dato: (a, m, d) => `${d}. ${['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'][m - 1]} ${a}`,
  enkelt: { uger: 'uge', dage: 'dag', timer: 'time', måneder: 'måned' },
  oppbevaringH2: OPBEVARING,
  se: {
    tittel: 'Læs også:',
    navn: { holdbarhet: 'Holdbarhed', frysing: 'Frysning' },
    rot: { holdbarhet: '/da/holdbarhed/', frysing: '/da/kan-man-fryse/' },
    lenker: {
      kjottdeig: { holdbarhet: ['hakket-koed'], frysing: ['hakket-koed'] },
      kylling: { holdbarhet: ['rester'], frysing: ['kylling'] },
      egg: { holdbarhet: ['egg'] },
      poteter: { holdbarhet: ['groentsager'] },
      'kokte-poteter': { holdbarhet: ['rester'], frysing: ['middagsrester'] },
      ris: { holdbarhet: ['rester'], frysing: ['middagsrester'] },
      pasta: { holdbarhet: ['rester'], frysing: ['middagsrester'] },
      laks: { holdbarhet: ['fisk', 'roeget-fisk'], frysing: ['fisk'] },
      flaeskesteg: { holdbarhet: ['rester'], frysing: ['middagsrester'] },
      and: { holdbarhet: ['rester'], frysing: ['middagsrester'] },
      floete: { holdbarhet: ['melk'], frysing: ['ost'] },
      gulrotter: { holdbarhet: ['groentsager'], frysing: ['frukt-og-gronnsaker'] },
      brod: { frysing: ['brod'] },
      bananer: { frysing: ['frukt-og-gronnsaker'] },
    },
  },
});
