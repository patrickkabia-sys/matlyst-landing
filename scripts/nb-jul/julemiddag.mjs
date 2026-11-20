// Julemiddagen (nb): plan fra tre uker før julaften. Utkast til Patricks godkjenning, skrevet 2026-11-20.
// Regelen: HVERT tall på siden kommer fra TALL under, og hvert tall har en kilde med adresse og hentedato.
// Prosaen skriver aldri et tall selv, den henter det med t('id'). Finner vi ikke kilde for et tall, står det ikke på siden.
// Alle kilder er åpnet og lest 2026-11-20 (MatPrat og Mattilsynet, rå HTML hentet med curl). Låst av test/julemiddag.test.mjs.
import { byggRik } from './../rik-sider.mjs';
import { forfatterPerson, harForfatter } from '../forfatter.mjs';

export const HENTET = '2026-11-20';
export const HENTET_TEKST = '20. november 2026';

export const KILDER = {
  'mp-mengde': { navn: 'MatPrat: Hvor mye julemat per person?', url: 'https://www.matprat.no/artikler/mengde-mal-og-vekt/hvordan-beregne-julemat-til-mange/', dato: 'utgitt 18. november 2025' },
  'mp-ribbe-sp': { navn: 'MatPrat: 10 spørsmål og svar om ribbe', url: 'https://www.matprat.no/artikler/tema/10-sporsmal-og-svar-om-ribbe/', dato: 'utgitt 10. desember 2025' },
  'mp-slik': { navn: 'MatPrat: Slik steker du ribbe', url: 'https://www.matprat.no/artikler/tilberedning/slik-steker-du-ribbe/', dato: 'utgitt 10. desember 2025' },
  'mp-pinnekjott': { navn: 'MatPrat: Utvanning og damping av pinnekjøtt', url: 'https://www.matprat.no/artikler/tilberedning/utvanning-og-damping-av-pinnekjott/', dato: 'utgitt 1. april 2014' },
  'mp-svin': { navn: 'MatPrat: Steke- og koketips for svinekjøtt', url: 'https://www.matprat.no/artikler/steke--og-koketips/steke--og-koketips-for-svinekjott/', dato: 'utgitt 10. desember 2025' },
  'mt-oppbevaring': { navn: 'Mattilsynet: Råd for oppbevaring av mat og drikke', url: 'https://www.mattilsynet.no/mat-og-drikke/forbrukere/rad-for-oppbevaring-av-mat', dato: 'faglig gjennomgått 20. februar 2026' },
  'mt-kjokken': { navn: 'Mattilsynet: Kjøkkenhygiene', url: 'https://www.mattilsynet.no/mat-og-drikke/forbrukere/kjokkenhygiene', dato: 'publisert 27. oktober 2023' },
};

// vis = teksten slik den står på siden. Mengdene er veiledende, ikke krav.
export const TALL = [
  { id: 'ribbe', vis: '300 g', kilde: 'mp-mengde', hva: 'ribbe per person', g: 300 },
  { id: 'ribbe-medister', vis: '250 g', kilde: 'mp-mengde', hva: 'ribbe per person når du serverer medisterkaker og pølse' },
  { id: 'ribbe-kald', vis: '450 g', kilde: 'mp-mengde', hva: 'ribbe per person når det også skal være kald ribbe dagen etter' },
  { id: 'medister', vis: '50 til 100 g', kilde: 'mp-mengde', hva: 'medisterkaker eller medisterpølse som tilbehør til ribbe, per person' },
  { id: 'pk-torr', vis: '400 g', kilde: 'mp-mengde', hva: 'tørket pinnekjøtt per person', g: 400 },
  { id: 'pk-torr-stor', vis: '500 g', kilde: 'mp-mengde', hva: 'tørket pinnekjøtt per person til storspisere' },
  { id: 'pk-vann', vis: '530 g', kilde: 'mp-mengde', hva: 'utvannet pinnekjøtt per person' },
  { id: 'pk-vann-stor', vis: '650 g', kilde: 'mp-mengde', hva: 'utvannet pinnekjøtt per person til storspisere' },
  { id: 'voss', vis: '100 g', kilde: 'mp-mengde', hva: 'vossakorv som tilbehør til pinnekjøtt, per person' },
  { id: 'poteter', vis: '200 g', kilde: 'mp-mengde', hva: 'poteter per person', g: 200 },
  { id: 'saus', vis: '3/4 til 1 dl', kilde: 'mp-mengde', hva: 'saus per person', dl: [0.75, 1] },
  { id: 'kalrot', vis: '100 til 150 g', kilde: 'mp-mengde', hva: 'kålrotstappe til pinnekjøtt, per person' },
  { id: 'surkal', vis: '80 til 100 g', kilde: 'mp-mengde', hva: 'surkål eller rødkål til ribbe, per person', g: [80, 100] },
  { id: 'gront', vis: '80 til 100 g', kilde: 'mp-mengde', hva: 'ekstra grønnsaker, for eksempel rosenkål, per person' },

  { id: 'frys-ra', vis: '3 til 6 måneder', kilde: 'mp-ribbe-sp', hva: 'anbefalt tid i fryseren for rå ribbe' },
  { id: 'tint-ra', vis: '1 til 2 dager', kilde: 'mp-ribbe-sp', hva: 'holdbarhet for rå, tint ribbe' },
  { id: 'tint-saltet', vis: '3 til 5 dager', kilde: 'mp-ribbe-sp', hva: 'holdbarhet for tint ribbe som er saltet og pepret med en gang' },
  { id: 'tint-kjoleskap', vis: '3 grader', kilde: 'mp-ribbe-sp', hva: 'høyeste temperatur i kjøleskapet ribba skal ligge i' },
  { id: 'varme-opp', vis: '30 minutter', kilde: 'mp-ribbe-sp', hva: 'tid for å varme opp ferdigstekt ribbe, sammen med medisterkaker og pølser' },
  { id: 'varme-opp-temp', vis: '200 °C', kilde: 'mp-ribbe-sp', hva: 'ovnstemperatur for å varme opp ferdigstekt ribbe' },
  { id: 'medister-tid', vis: '20 til 30 minutter', kilde: 'mp-ribbe-sp', hva: 'tid for å varme medisterkaker og steke pølsebiter sammen med ribba, de siste minuttene av steketiden' },
  { id: 'ribbe-over', vis: 'over 2 timer', kilde: 'mp-ribbe-sp', hva: 'samlet steketid ribbe må ha for å bli mør' },

  { id: 'damp-ribbe', vis: 'ca. 45 minutter', kilde: 'mp-slik', hva: 'damping av ribbe under tett folie' },
  { id: 'damp-ribbe-temp', vis: '230 °C', kilde: 'mp-slik', hva: 'ovnstemperatur ved damping av ribbe' },
  { id: 'stek-ribbe-temp', vis: '200 °C', kilde: 'mp-slik', hva: 'ovnstemperatur ved steking av ribbe etter dampingen' },
  { id: 'stek-ribbe', vis: 'ca. 1 til 1½ time', kilde: 'mp-slik', hva: 'steking av ribbe etter dampingen' },
  { id: 'hvile-ribbe', vis: 'ca. 20 minutter', kilde: 'mp-slik', hva: 'hviletid for ribba før den skjæres' },
  { id: 'salt-dager', vis: '1 til 3 dager', kilde: 'mp-slik', hva: 'tid ribba står saltet og pepret kjølig før steking' },

  { id: 'utvanning', vis: '30 timer', kilde: 'mp-pinnekjott', hva: 'utvanning av pinnekjøtt i romtemperatur', t: 30 },
  { id: 'damping', vis: '3 timer', kilde: 'mp-pinnekjott', hva: 'damping av pinnekjøtt på svak varme', t: 3 },
  { id: 'voss-damp', vis: '15 til 20 minutter', kilde: 'mp-pinnekjott', hva: 'tid pølser og vossakorv damper sammen med pinnekjøttet, de siste minuttene' },

  { id: 'svin-ferdig', vis: '75 °C', kilde: 'mp-svin', hva: 'kjernetemperatur for gjennomstekt svinekam og skinkestek med svor (ribbe har ingen oppgitt kjernetemperatur)' },

  { id: 'mt-kjole-ned', vis: '4 °C', kilde: 'mt-oppbevaring', hva: 'kjøleskapet bør være under denne temperaturen' },
  { id: 'mt-kjole-opp', vis: 'minus 1 °C', kilde: 'mt-oppbevaring', hva: 'kjøleskapet bør være over denne temperaturen' },
  { id: 'mt-fryser', vis: 'minus 18 °C', kilde: 'mt-oppbevaring', hva: 'frysertemperatur: denne eller lavere' },
  { id: 'mt-fryser-kv', vis: '3 til 12 måneder', kilde: 'mt-oppbevaring', hva: 'tid før kvaliteten i fryseren går ned, avhengig av produktet' },
  { id: 'mt-avkjol-fra', vis: '60 °C', kilde: 'mt-oppbevaring', hva: 'varm hjemmelaget mat skal kjøles ned fra denne temperaturen' },
  { id: 'mt-avkjol-til', vis: '10 °C', kilde: 'mt-oppbevaring', hva: 'varm hjemmelaget mat skal kjøles ned til denne temperaturen, så raskt som mulig og senest innen to timer' },
  { id: 'mt-rester', vis: '2 til 4 dager', kilde: 'mt-oppbevaring', hva: 'restemat holder seg i kjøleskap' },
  { id: 'mt-oppvarming', vis: '70 grader', kilde: 'mt-kjokken', hva: 'ved oppvarming over denne temperaturen i flere minutter blir de aller fleste bakterier drept' },
  { id: 'mt-bakterier', vis: '8 til 60 grader', kilde: 'mt-kjokken', hva: 'temperaturområdet der bakterier trives og formerer seg raskt' },
  { id: 'mt-varmholding', vis: 'ca. 60 grader', kilde: 'mt-kjokken', hva: 'maten må holde omtrent denne temperaturen hvis den skal holdes varm før servering' },
];

const AAR = (id) => KILDER[id].dato.match(/\d{4}/u)[0];
export const mp = (id) => `MatPrat (${AAR(id)})`;
export const mt = (id) => `Mattilsynet (${AAR(id)})`;

const tallPerId = new Map(TALL.map((x) => [x.id, x]));
const brukt = new Set();
export const t = (id) => {
  const x = tallPerId.get(id);
  if (!x) throw new Error(`Tall uten kilde: ${id}`);
  brukt.add(id);
  return x.vis;
};

// Veiledende mengder per antall gjester. Regnestykket står her og gjentas i testen.
export const GJESTER = [2, 4, 6, 8, 10, 12];
const per = (id) => tallPerId.get(id);
const kg = (g) => (g >= 1000 ? `${String(g / 1000).replace('.', ',')} kg` : `${g} g`);
const dl = (x) => `${String(x).replace('.', ',')} dl`;
export const kjottRad = (n) => [String(n), kg(n * per('ribbe').g), kg(n * per('pk-torr').g), kg(n * per('poteter').g)];
export const tilbehorRad = (n) => {
  const [lav, hoy] = per('surkal').g;
  const [dlLav, dlHoy] = per('saus').dl;
  return [String(n), `${dl(n * dlLav)} til ${dl(n * dlHoy)}`, `${kg(n * lav)} til ${kg(n * hoy)}`];
};
['ribbe', 'pk-torr', 'poteter', 'saus', 'surkal'].forEach((id) => brukt.add(id));

// Tidslinjen regnes fra middagstid og kilden: damping 3 timer, utvanning 30 timer.
export const MIDDAG_KL = 17;
export const DAMP_START_KL = MIDDAG_KL - per('damping').t;
// 30 timer før kl. 14 er kl. 08 dagen før dagen før (24 + 6 timer bakover).
export const UTVANN_START_KL = DAMP_START_KL - (per('utvanning').t - 24);

const p = (...ps) => ps.map((x) => `<p>${x}</p>`).join('');
const ul = (...li) => `<ul>${li.map((x) => `<li>${x}</li>`).join('')}</ul>`;
const tabell = (hode, rader) => `<table><thead><tr>${hode.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rader.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`).join('')}</tbody></table>`;

const tidsrader = [
  ['Tre uker før, torsdag 3. desember', ul(
    'Sett antall gjester og velg menyen: ribbe, pinnekjøtt eller begge deler.',
    'Fyll ut mengdetabellen under, og lag første handleliste med det som holder seg: tørrvarer, drikke og hermetikk.',
    `Bestill kjøttet. Skal du kjøpe ribbe en uke eller mer før julaften, kan du like gjerne kjøpe frossen ribbe. ${mp('mp-ribbe-sp')} sier at industrifrysing er bedre enn hjemmefrysing.`)],
  ['En uke før, torsdag 17. desember', ul(
    `Legg et termometer i kjøleskapet. ${mt('mt-oppbevaring')} sier at det bør være under ${t('mt-kjole-ned')}, men over ${t('mt-kjole-opp')}. Fryseren skal være ${t('mt-fryser')} eller kaldere.`,
    'Rydd plass i kjøleskapet, så ribba kan ligge kaldt de siste dagene.')],
  ['Fire dager før, søndag 20. desember', ul(
    `${mt('mt-oppbevaring')} sier at tining i kjøleskap er tryggere enn på kjøkkenbenken. ${mp('mp-ribbe-sp')} sier at frossen ribbe tas ut av fryseren og tines i ett døgn i kjøleskap, og at kjøleskapet skal være kaldt, på maks ${t('tint-kjoleskap')}.`)],
  ['Tre dager før, mandag 21. desember', ul(
    `Rut svoren, og gni ribba med salt og pepper. ${mp('mp-slik')} sier at den skal stå kjølig i ${t('salt-dager')} før steking.`,
    'Lag andre handleliste med det ferske: grønnsaker, poteter og det som skal spises raskt.')],
  ['Dagen før, onsdag 23. desember', ul(
    `Pinnekjøtt: start utvanningen tidlig, kl. 0${UTVANN_START_KL}. ${mt('mt-kjokken')} sier at bakterier trives og formerer seg raskt ved temperaturer fra ${t('mt-bakterier')}. ${mp('mp-pinnekjott')} sier at utvanning tar ca. ${t('utvanning')} i romtemperatur, og at dampingen tar ca. ${t('damping')}. Skal middagen stå på bordet kl. ${MIDDAG_KL}, starter du dampingen kl. ${DAMP_START_KL}.`,
    'Ribbe: du kan steke den ferdig i dag og varme den opp på julaften. Se avsnittet om å forberede i forveien.',
    'Skrell potetene, og gjør klart tilbehøret.')],
  ['Julaften, torsdag 24. desember', ul(
    `Ribbe, ifølge ${mp('mp-slik')}: damp ${t('damp-ribbe')} på ${t('damp-ribbe-temp')} under tett folie, stek videre ${t('stek-ribbe')} på ${t('stek-ribbe-temp')}, og la den hvile ${t('hvile-ribbe')} før du skjærer. ${mp('mp-ribbe-sp')} sier at medisterkaker og pølser kan stekes med ribba de siste ${t('medister-tid')}.`,
    `Pinnekjøtt, ifølge ${mp('mp-pinnekjott')}: damp ca. ${t('damping')} på svak varme. Pølser og vossakorv kan dampe med de siste ${t('voss-damp')}.`,
    `Skal maten holde seg varm før servering, må den holde ${t('mt-varmholding')} (${mt('mt-kjokken')}).`)],
];
const tidslinje = tidsrader.map(([naar, hva]) => `<h3>${naar}</h3>${hva}`).join('');

const mengder = tabell(['Gjester', 'Ribbe', 'Pinnekjøtt, tørket', 'Poteter'], GJESTER.map(kjottRad)) + tabell(['Gjester', 'Saus', 'Surkål eller rødkål'], GJESTER.map(tilbehorRad));

const liste = `<ul>
<li><strong>Kjøtt:</strong> ribbe eller pinnekjøtt (se tabellen), medisterkaker, julepølse eller vossakorv.</li>
<li><strong>Grønt:</strong> poteter, kålrot hvis det er pinnekjøtt, surkål eller rødkål, rosenkål eller andre grønnsaker, epler og svisker hvis du bruker dem.</li>
<li><strong>Kjøleskap:</strong> smør, fløte eller melk til sausen og stappen, rørte tyttebær.</li>
<li><strong>Tørrvarer og krydder:</strong> salt og pepper, mel eller maisenna til sausen, kraft, eventuelt bjørkepinner eller rist til dampingen.</li>
<li><strong>Dessert og drikke:</strong> det du selv skal ha til dessert og til bordet.</li></ul>`;

function kilderListe() {
  return Object.entries(KILDER).map(([id, k]) => {
    const tall = TALL.filter((x) => x.kilde === id);
    return `<div class="scenario" id="kilde-${id}"><h3>${k.navn}</h3><dl><dt>Adresse</dt><dd><a href="${k.url}" rel="noopener">${k.url}</a></dd><dt>Dato på kilden</dt><dd>${k.dato}</dd><dt>Hentet</dt><dd><time datetime="${HENTET}">${HENTET_TEKST}</time></dd><dt>Tall vi bruker</dt><dd><ul>${tall.map((x) => `<li data-tall="${x.id}">${x.hva}: <strong>${x.vis}</strong></li>`).join('')}</ul></dd></dl></div>`;
  }).join('');
}

const avsnitt = [
  ['Tidslinje fra tre uker før julaften',
    p(`Julaften 2026 er en torsdag. Tidslinjen under teller bakover fra den dagen. Alle tider og mengder på siden er <strong>veiledende</strong>: de kommer fra kildene nederst, og tykkelsen på kjøttet, ovnen og antall gjester kan endre dem. Bruk oppskriften og kjøttets pakke som fasit.`)
    + tidslinje],
  ['Mengder ut fra antall gjester',
    p(`Tallene under er veiledende mengder per person fra ${mp('mp-mengde')}, ganget opp: ribbe ${t('ribbe')}, tørket pinnekjøtt ${t('pk-torr')}, poteter ${t('poteter')}, saus ${t('saus')} og surkål eller rødkål ${t('surkal')}. Du velger ribbe eller pinnekjøtt, så du skal ikke legge sammen de to kjøttkolonnene.`)
    + mengder
    + p(`${mp('mp-mengde')} sier at små barn spiser mindre, og at du kan regne en halv porsjon til dem og en full porsjon til ungdom og voksne.`)
    + '<h3>Når du vil ha mer eller mindre</h3>'
    + ul(
      `Ribbe med medisterkaker og pølse: ${t('ribbe-medister')} ribbe per person. Medisterkaker eller medisterpølse som tilbehør: ${t('medister')} per person.`,
      `Kald ribbe til dagen etter: ${t('ribbe-kald')} ribbe per person.`,
      `Storspisere: ${t('pk-torr-stor')} tørket pinnekjøtt per person.`,
      `Kjøper du pinnekjøttet ferdig utvannet: ${t('pk-vann')} per person, eller ${t('pk-vann-stor')} til storspisere.`,
      `Tilbehør til pinnekjøtt: ${t('kalrot')} kålrotstappe og ${t('voss')} vossakorv per person.`,
      `Ekstra grønnsaker, for eksempel rosenkål: ${t('gront')} per person.`)],
  ['Handleliste for julemiddagen',
    p('Handle i to runder: først det som holder seg, så det ferske. Lista under har ingen mengder, for dem finner du i tabellen over. I Matlyst legger du oppskriftene dine på handlelista, så får du alt samlet og sortert etter hylle.')
    + liste],
  ['Kjøling, tining og rester',
    p(`Disse reglene er fra ${mt('mt-oppbevaring')}, bortsett fra oppvarming og varmholding, som er fra ${mt('mt-kjokken')}. De gjelder alt du lager til julemiddagen.`)
    + ul(
      `<strong>Kjøleskapet:</strong> under ${t('mt-kjole-ned')}, men over ${t('mt-kjole-opp')}. Fryseren skal være ${t('mt-fryser')} eller kaldere.`,
      '<strong>Tining:</strong> tin i kjøleskap. Det går saktere, men er tryggere. Unngå å tine frosen, lettbedervelig mat på kjøkkenbenken.',
      `<strong>Avkjøling:</strong> varm, hjemmelaget mat skal kjøles fra ${t('mt-avkjol-fra')} til ${t('mt-avkjol-til')} så raskt som mulig, og senest innen to timer. ${mt('mt-oppbevaring')} sier at det går fortere hvis du deler maten i mindre porsjoner.`,
      `<strong>Rester:</strong> restemat holder seg ${t('mt-rester')} i kjøleskap. Skal du ikke spise den snart, frys den med en gang.`,
      `<strong>Oppvarming:</strong> ved oppvarming til over ${t('mt-oppvarming')} i flere minutter blir de aller fleste bakterier drept. Skal maten holdes varm, må den holde ${t('mt-varmholding')}.`)
    + '<h3>Hva med kjernetemperatur?</h3>'
    + p(`${mt('mt-kjokken')} sier at ved oppvarming til over ${t('mt-oppvarming')} i flere minutter blir de aller fleste bakterier drept. ${mp('mp-ribbe-sp')} gir ingen kjernetemperatur for ribbe, og sier at du verken trenger steketermometer eller å tenke på kjernetemperaturen: ribba trenger høy temperatur og relativt lang steketid, og den må steke ${t('ribbe-over')} til sammen for å bli mør. For svinekam og skinkestek med svor oppgir ${mp('mp-svin')} ${t('svin-ferdig')} som gjennomstekt.`)],
  ['Forbered i forveien, og hva som kan fryses',
    p('Det du kan gjøre i forveien, tar mye press av julaften.')
    + '<h3>Ribbe dagen før</h3>'
    + p(`${mt('mt-oppbevaring')} sier at varm, hjemmelaget mat skal kjøles fra ${t('mt-avkjol-fra')} til ${t('mt-avkjol-til')} så raskt som mulig, men senest i løpet av to timer. ${mt('mt-oppbevaring')} sier også at maten kjøles raskere hvis den deles i mindre porsjoner.`, `${mp('mp-ribbe-sp')} sier at du kan steke ribba ferdig dagen før, men svoren må være sprø, ellers blir den ikke sprø ved oppvarming. ${mp('mp-ribbe-sp')} sier at ribba varmes i ${t('varme-opp')} på ${t('varme-opp-temp')} sammen med medisterkaker og pølser.`)
    + '<h3>Frys</h3>'
    + ul(
      `Rester av julematen: ${mt('mt-oppbevaring')} sier at du skal fryse restemat med en gang hvis du ikke skal spise den snart, og at kvaliteten i fryseren går ned etter ${t('mt-fryser-kv')}, avhengig av produktet.`,
      `Rå ribbe: ${mp('mp-ribbe-sp')} anbefaler ${t('frys-ra')} i fryseren.`,
      `Ferdigstekt ribbe: ${mp('mp-ribbe-sp')} fraråder å fryse den, fordi svoren mister sprøheten og blir gummiaktig. Stek den heller i forveien og oppbevar den i kjøleskap.`,
      `Tint ribbe, ifølge ${mp('mp-ribbe-sp')}: saltet og pepret med en gang holder den ${t('tint-saltet')}, rå og tint bare ${t('tint-ra')}.`)
    + p('For sausen, stappen, tilbehøret og desserten har vi ikke funnet en kilde med frysetider, så vi oppgir ingen. Følg oppskriften eller pakningen.')],
  ['Slik bruker du Matlyst til julemiddagen',
    p('Matlyst gir deg ingen oppskrifter og ingen steketider. Du lagrer oppskriftene du selv bruker, og Matlyst hjelper deg å holde orden.')
    + ul(
      'Lagre ribbe-, saus- og dessertoppskriften din fra nettsiden, Instagram eller TikTok, eller ta bilde av oppskriften i kokeboka (bildeimport er en Matlyst Pro-funksjon). Sjekk alltid utkastet mot originalen før du lagrer.',
      'Regn om oppskriften fra 1 til 20 porsjoner til antall gjester. Omregningen er lineær, så sjekk krydder og salt selv.',
      'Legg oppskriftene i <a href="/ukemeny/">ukemenyen</a>, de dagene du skal lage dem.',
      'Legg ukemenyen på <a href="/handleliste/">handlelista</a>, så får du like varer samlet og sortert etter hylle. Varer du har i spiskammeret, er fravalgt og merket «Har hjemme».',
      'Legg inn det som blir til overs i <a href="/spiskammer-app/">spiskammeret</a>, med utløpsdato, så ser du hva som bør brukes først.')
    + p('Matlyst varsler ikke om tining, utvanning eller steketider. Skriv tidene i notatene på oppskriften, eller bruk tidslinjen over.')],
  ['Kilder og tall',
    p(`Hvert tall om mat, mengde og tid på denne siden står her, med kilde, adresse og dato. Tabellene er regnet ut ved å gange tallene per person med antall gjester, klokkeslettene er regnet ut fra utvanning og damping, og datoene er julaften 2026 telt bakover. Vi har åpnet og lest hver side ${HENTET_TEKST}. Mattilsynet er den norske myndigheten for mattrygghet, og MatPrat er Opplysningskontoret for egg og kjøtt. Mengder og tider er veiledende. Gjelder kilden en annen situasjon enn din, for eksempel en annen kjøttype eller et annet kjøleskap, gjelder kilden, ikke siden her.`)
    + kilderListe()
    + p('Fant du en feil, eller har en kilde endret seg? Skriv til <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>, så rettes siden og datoen oppdateres. Les mer om hvordan vi jobber på <a href="/om/">om-siden</a>.')],
];

const rik = byggRik({
  lang: 'nb',
  svarTekst: `Start tre uker før julaften: velg ribbe eller pinnekjøtt, regn ut mengdene fra antall gjester, bestill kjøttet og handle i to runder. Pinnekjøttet vannes ut i ca. ${t('utvanning')} og dampes i ca. ${t('damping')}. Ribba tines i kjøleskap, saltes og stekes i to trinn. Alle mengder og tider er veiledende, og hvert tall har kilde nederst på siden.`,
  seksjoner: avsnitt,
}).html;

export const FAQ = [
  ['Hvor mye ribbe trenger jeg per person?', `${mp('mp-mengde')} regner ${t('ribbe')} per person, eller ${t('ribbe-medister')} hvis du serverer medisterkaker og pølse. Vil du ha kald ribbe dagen etter, regner de ${t('ribbe-kald')}.`],
  ['Hvor mye pinnekjøtt skal jeg regne per person?', `${mp('mp-mengde')} regner ${t('pk-torr')} tørket pinnekjøtt per person, og ${t('pk-torr-stor')} til storspisere. Utvannet pinnekjøtt regnes som ${t('pk-vann')}.`],
  ['Hvor lenge skal pinnekjøttet vannes ut og dampes?', `${mt('mt-kjokken')} sier at bakterier trives og formerer seg raskt ved temperaturer fra ${t('mt-bakterier')}. ${mp('mp-pinnekjott')} sier ca. ${t('utvanning')} utvanning og ca. ${t('damping')} damping.`],
  ['Når skal jeg ta frossen ribbe ut av fryseren?', `${mp('mp-ribbe-sp')} sier ca. fire dager før julaften. Ribba tines i ett døgn i kjøleskap, og så gnis den med salt og pepper.`],
  ['Hvor lenge holder rester av julematen seg?', `${mt('mt-oppbevaring')} sier at restemat holder seg ${t('mt-rester')} i kjøleskap. Skal du ikke spise den snart, frys den med en gang.`],
  ['Kan jeg fryse ferdig ribbe?', `${mt('mt-oppbevaring')} sier at du skal fryse restemat med en gang hvis du ikke skal spise den snart. ${mp('mp-ribbe-sp')} fraråder å fryse ferdigstekt ribbe, fordi svoren mister sprøheten. Stek den heller i forveien og oppbevar den i kjøleskap.`],
  ['Hvilken temperatur skal kjøleskapet ha?', `${mt('mt-oppbevaring')} sier under ${t('mt-kjole-ned')}, men over ${t('mt-kjole-opp')}. Legg et termometer inne i kjøleskapet og sjekk det.`],
  ['Gir Matlyst oppskrifter eller steketider til julemiddagen?', 'Nei. Du lagrer oppskriftene du selv bruker, regner dem om til antall gjester og sender ingrediensene til én handleliste.'],
];

const BASE = 'https://matlyst-app.no';
const STI = 'julemiddag/';
const TITTEL = 'Julemiddag: plan, mengder og handleliste';
const BESKRIVELSE = 'Plan for julemiddagen fra tre uker før julaften: tidslinje, mengder ut fra antall gjester, handleliste og kjøling. Veiledende tall med kilde og dato.';
const H1 = 'Julemiddagen planlagt fra tre uker før julaften';
function skjema() {
  return [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Forside', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: H1, item: `${BASE}/${STI}` },
    ] },
    { '@context': 'https://schema.org', '@type': 'Article', headline: H1, description: BESKRIVELSE, image: [`${BASE}/images/og.jpg`], inLanguage: 'nb', datePublished: HENTET, dateModified: HENTET, mainEntityOfPage: `${BASE}/${STI}`,
      author: harForfatter(STI) ? forfatterPerson() : { '@type': 'Organization', name: 'Matlyst', url: `${BASE}/` }, publisher: { '@type': 'Organization', name: 'Matlyst', url: `${BASE}/` },
      citation: Object.values(KILDER).map((k) => ({ '@type': 'WebPage', name: k.navn, url: k.url })) },
  ];
}

export const side = {
  title: TITTEL,
  description: BESKRIVELSE,
  eyebrow: 'Julemiddag',
  h1: H1,
  lead: 'Tidslinje, mengder ut fra antall gjester, handleliste og regler for kjøling og rester. Hvert tall har en kilde med adresse og hentedato, og mengdene er veiledende.',
  publisert: HENTET,
  schemas: skjema(),
  forst: '',
  stegTittel: 'Slik bruker du siden',
  steg: [
    ['Velg meny og antall gjester', 'Ribbe, pinnekjøtt eller begge deler.'],
    ['Følg tidslinjen', 'Bestill, tin, vann ut og lag på forhånd.'],
    ['Handle fra to lister', 'Først det som holder seg, så det ferske.'],
  ],
  alternativ: '',
  grense: '',
  seksjoner: [],
  faqTittel: 'Spørsmål om julemiddagen',
  rik,
  faq: FAQ,
  cta: 'Lagre julemiddagens oppskrifter i Matlyst',
};
export const TALL_BRUKT = () => [...brukt];
