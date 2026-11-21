// Teksten for familien «airfryer» (nb). Hver setning gjengir det en navngitt kilde sier, med kilden nevnt; ingen egne råd om mattrygghet.
// Tall skrives aldri her: h.t(felt) henter dem fra data.nb.json, der sitatet bak hvert tall står i `merknad`.
// Utsagn uten tall står som sitat i radens `tekst` i datafila (nøkkel «kildeid: tema»), og kildekontroll.mjs sjekker dem mot kilden.
// Tidene er veiledende. Der to kilder spriker, står begge side om side.

const L = (id, tekst) => [`/airfryer/${id}/`, tekst];
const TIDENE = 'Tidene og temperaturene på siden er veiledende. Kildene sier selv at de varierer med airfryer, mengde og tykkelse.';
const SVAR_ADVARSEL = 'Tidene er veiledende.';

/** Avsnittet om kjernetemperatur for kjøtt og fisk: tallet står i radens `kjerne`, og siden sier at det er kjernetemperaturen som avgjør. */
const KJERNE = (innhold) => ['Kjernetemperatur: det avgjør, ikke klokka', innhold];

export const TEKST = {
  // ---------------------------------------------------------------- kylling
  kyllingfilet: (h) => ({
    ord: 'kyllingfilet',
    title: 'Kyllingfilet i airfryer: tid og temperatur',
    h1: 'Kyllingfilet i airfryer: tid og temperatur',
    description: `${h.k('mp-kyllingfilet')} stekte kyllingfilet på ${h.t('mp-temp')} i ${h.t('mp-tid')} på hver side. ${h.k('ph-hd920')} oppgir ${h.t('ph-temp')} i ${h.t('ph-tid')}. Begge tidene side om side.`,
    lead: 'MatPrat og Philips oppgir ulike tider for kyllingfilet. Her står begge side om side, med kilde og år, så du kan velge hvor du begynner å sjekke.',
    svar: `${h.k('mp-kyllingfilet')} stekte kyllingfilet på ${h.t('mp-temp')}, ${h.t('mp-tid')} på hver side. ${h.k('ph-hd920')} oppgir ${h.t('ph-temp')} i ${h.t('ph-tid')} for kyllingbryst. ${SVAR_ADVARSEL} Kjernetemperaturen avgjør.`,
    tabell: {
      tittel: 'Tid og temperatur fra to kilder', intro: 'Tallene er veiledende, og de to kildene bruker ulik temperatur. Begge står her, ikke et snitt av dem.',
      kolonner: ['Kilde', 'Temperatur', 'Tid', 'Mengde'],
      rader: [
        [h.k('mp-kyllingfilet'), h.t('mp-temp'), `${h.t('mp-tid')} på hver side`, `${h.t('mp-antall')} kyllingfilet`],
        [h.k('ph-hd920'), h.t('ph-temp'), h.t('ph-tid'), `${h.t('ph-antall')} kyllingbryst, ca. ${h.t('ph-vekt')} hver`],
      ],
      etter: ['MatPrat er en oppskrift fra Opplysningskontoret for egg og kjøtt. Philips er matvaretabellen i brukerhåndboken til en av sine airfryere.'],
    },
    avsnitt: [
      ['Hvorfor tallene er ulike', h.p(
        `MatPrat bruker den høyeste temperaturen, ${h.t('mp-temp')}, og snur filetene etter ${h.t('mp-tid')} til de har fått en fin stekeskorpe. Philips oppgir ${h.t('ph-temp')} og en lengre tid. Philips skriver at tabellens innstillinger er forslag, og at de ikke kan garantere at de passer maten din, fordi ingredienser varierer i opprinnelse, størrelse, form og merke.`,
        `Mengden er heller ikke lik. MatPrat bruker ${h.t('mp-antall')} filetter, mens Philips oppgir ${h.t('ph-antall')} bryst på ca. ${h.t('ph-vekt')}. Ingen av kildene oppgir tykkelse, så vi kan ikke si hvilken tid som passer en tykk filet.`,
      )],
      ['Slik bruker du de to tidene', h.p(
        'MatPrat skriver at tiden kan variere mellom produsentene, og ber deg sjekke med jevne mellomrom for å unngå at kyllingen blir svidd. Det er en grei måte å lese begge tallene på: de sier hvor du kan begynne å sjekke, ikke når kyllingen er ferdig.',
        `Skal du følge MatPrat, snur du fileten halvveis. Tabellen fra Philips har ingen merknad om snuing for kyllingbryst, men Philips ber deg riste, snu eller røre i større mengder, som pommes frites og kyllingklubber.`,
      )],
    ],
    kjerne: KJERNE(h.p(
      `${h.k('mt-sommer')} skriver i en tekst om grilling at alt fjørfekjøtt bør gjennomstekes, og at gjennomstekt betyr en kjernetemperatur på minimum ${h.t('mt-kjerne')}. ${h.k('mp-kylling')} oppgir ${h.t('kjerne')} i kjernen for gjennomstekt kyllingfilet. De to kildene er enige.`,
      'Tidene over sier bare hvor du kan begynne å sjekke. Det er kjernetemperaturen som avgjør om kyllingen er ferdig, ikke klokka.',
    )),
    app: 'Har du en kyllingfiletoppskrift du liker, lagrer du den i Matlyst og legger den på dagen du skal lage den.',
    faq: [
      ['Må jeg snu kyllingfileten i airfryeren?', 'MatPrat snur fileten etter halve tiden i oppskriften sin. Philips har ingen egen merknad om snuing for kyllingbryst, men ber deg snu eller røre i større mengder mat.'],
      ['Hvilken temperatur er kyllingfilet ferdig ved?', `${h.k('mt-sommer')} oppgir minimum ${h.t('mt-kjerne')} i kjernen for gjennomstekt fjørfekjøtt, og ${h.k('mp-kylling')} oppgir ${h.t('kjerne')} for kyllingfilet. Det er kjernetemperaturen som avgjør, ikke tiden i airfryeren.`],
      ['Hvor lenge skal frossen kyllingfilet i airfryeren?', 'Vi har ikke funnet en kilde for frossen kyllingfilet, så vi oppgir ingen tid. Philips har en egen rad for frosne kyllingbiter, og den står under frossen mat.'],
    ],
    les: [L('kyllinglar', 'Kyllinglår og kyllingklubber i airfryer'), L('kyllingvinger', 'Kyllingvinger i airfryer'), L('frossen-mat', 'Frossen mat i airfryer')],
  }),

  kyllinglar: (h) => ({
    ord: 'kyllinglår',
    title: 'Kyllinglår i airfryer: tid og temperatur',
    h1: 'Kyllinglår i airfryer: tid og temperatur',
    description: `MatPrat stekte kyllinglår på ${h.t('mp-temp')} i ${h.t('mp-tid')}. Philips oppgir ${h.t('ph-temp')} i ${h.t('ph-tid')} for kyllingklubber. Tidene side om side, og kjernetemperaturen som avgjør.`,
    lead: 'Lår, klubber og ferdiggrillede klubber får ulike tider i kildene. Her står de hver for seg, med kilde og år.',
    svar: `${h.k('mp-kyllinglar')} stekte kyllinglår på ${h.t('mp-temp')} i ${h.t('mp-tid')}. ${h.k('ph-hd920')} oppgir ${h.t('ph-temp')} i ${h.t('ph-tid')} for kyllingklubber. ${SVAR_ADVARSEL} Kjernetemperaturen avgjør.`,
    tabell: {
      tittel: 'Tid og temperatur for lår og klubber', intro: 'Tre oppføringer fra tre kilder. De gjelder ikke helt det samme kjøttet, så les raden og merknaden.',
      kolonner: ['Kilde', 'Temperatur', 'Tid', 'Hva det gjelder'],
      rader: [
        [h.k('mp-kyllinglar'), h.t('mp-temp'), h.t('mp-tid'), 'Kyllinglår, skinnsiden ned, forvarmet airfryer'],
        [h.k('mp-kyllingklubber'), h.t('mpk-temp'), `${h.t('mpk-tid')} på hver side`, 'Ferdiggrillede kyllingklubber, skinnet opp'],
        [h.k('ph-hd920'), h.t('ph-temp'), h.t('ph-tid'), `${h.t('ph-antall')} kyllingklubber, ca. ${h.t('ph-vekt')} hver`],
      ],
    },
    avsnitt: [
      ['Lår, klubber og ferdiggrillet er tre ulike ting', h.p(
        `MatPrat har to oppskrifter. Den ene er for kyllinglår som skal stekes fra rått, og den andre er for ferdiggrillede kyllingklubber som bare varmes og gjøres sprø. Det er derfor tidene ser så ulike ut. ${h.t('mpk-tid')} på hver side gjelder altså ikke rå klubber.`,
        'Philips oppgir klubber uten å si om de er rå eller ferdige. Tabellen har en lengre tid enn MatPrat sin ferdiggrillede variant.',
      )],
      ['Slik står kildene til forvarming og snuing', h.p(
        `MatPrat forvarmer airfryeren til ${h.t('mp-temp')} i noen minutter før lårene legges inn, og snur dem gjerne halvveis. Skinnsiden skal ned først. Philips skriver at du ikke trenger å forvarme apparatet sitt, og ber deg riste, snu eller røre i større mengder mat, som kyllingklubber.`,
        'Kildene er altså uenige om forvarming. Les mer om det på samlesiden for airfryer.',
      )],
    ],
    kjerne: KJERNE(h.p(
      `${h.k('mt-sommer')} skriver i en tekst om grilling at alt fjørfekjøtt bør gjennomstekes, og at gjennomstekt betyr en kjernetemperatur på minimum ${h.t('mt-kjerne')}. I tabellen til ${h.k('mp-kylling')} har lår ingen egen kjernetemperatur, men hel kylling og filet er gjennomstekt ved ${h.t('kjerne')}.`,
      'Det er kjernetemperaturen som avgjør om kyllingen er ferdig, ikke klokka.',
    )),
    app: 'Planlegger du kyllinglår til helga, legger du oppskriften i ukemenyen og lar handlelisten samle varene.',
    faq: [
      ['Skal kyllinglår ligge med skinnsiden ned eller opp?', 'MatPrat legger kyllinglår med skinnsiden ned og snur dem gjerne halvveis. Ferdiggrillede klubber legger MatPrat med skinnet opp.'],
      ['Må jeg forvarme airfryeren til kyllinglår?', 'MatPrat forvarmer til kyllinglår, mens Philips skriver at du ikke trenger å forvarme. Kildene er uenige.'],
      ['Hvilken kjernetemperatur har kyllinglår?', `${h.k('mt-sommer')} oppgir minimum ${h.t('mt-kjerne')} for gjennomstekt fjørfekjøtt. MatPrat har ingen egen verdi for lår, men ${h.t('kjerne')} for hel kylling og filet.`],
    ],
    les: [L('kyllingfilet', 'Kyllingfilet i airfryer'), L('kyllingvinger', 'Kyllingvinger i airfryer')],
  }),

  kyllingvinger: (h) => ({
    ord: 'kyllingvinger',
    title: 'Kyllingvinger i airfryer: tid og temperatur',
    h1: 'Kyllingvinger i airfryer: tid og temperatur',
    description: `${h.k('godt-vinger')} bruker ${h.t('godt-temp')}, ${h.t('godt-tid')} og så ${h.t('godt-tid2')}. MatPrat bruker ${h.t('mp-temp')} for ferdigstekte vinger. Begge side om side.`,
    lead: 'MatPrat bruker ferdigstekte vinger, Godt.no sier ikke at vingene er ferdigstekte. Her står begge med kilde, år og hva de gjelder.',
    svar: `${h.k('godt-vinger')} stekte vinger på ${h.t('godt-temp')}: ${h.t('godt-tid')}, så ${h.t('godt-tid2')} etter snuing. ${h.k('mp-kyllingvinger')} brukte ferdigstekte vinger på ${h.t('mp-temp')}, ${h.t('mp-tid')} på hver side. ${SVAR_ADVARSEL}`,
    tabell: {
      tittel: 'Tid og temperatur for vinger', intro: 'To oppskrifter og én sammenligningstabell fra MatPrat. Godt.no sier ikke at vingene er ferdigstekte, MatPrat gjør det.',
      kolonner: ['Kilde', 'Temperatur', 'Tid', 'Hva det gjelder'],
      rader: [
        [h.k('godt-vinger'), h.t('godt-temp'), `${h.t('godt-tid')}, snu, så ${h.t('godt-tid2')}`, `${h.t('godt-vekt')} vinger, ikke oppgitt som ferdigstekte`],
        [h.k('mp-kyllingvinger'), h.t('mp-temp'), `${h.t('mp-tid')} på hver side, så ${h.t('mp-bbq')} med saus`, `${h.t('mp-antall')} ferdigstekte vinger`],
        [`${h.k('mp-tilb')}, sammenligningstabell`, h.t('mpt-af-temp'), h.t('mpt-af-tid'), `I ovn med varmluft: ${h.t('mpt-ov-temp')}, ${h.t('mpt-ov-tid')}`],
      ],
    },
    avsnitt: [
      ['Ferdigstekte eller ikke', h.p(
        `MatPrats oppskrift bruker ferdigstekte vinger, og tiden gjelder derfor bare å gjøre skinnet sprøtt og varme vingene. Godt.no sier ikke at vingene er ferdigstekte, og bruker ${h.t('godt-temp')}. Les derfor bare tallet fra den kilden som matcher det du har kjøpt.`,
        `Tabellen til MatPrat, som sammenligner airfryer og ovn, oppgir ${h.t('mpt-af-tid')} ved ${h.t('mpt-af-temp')} for vinger i airfryer. Samme tabell oppgir ${h.t('mpt-ov-tid')} ved ${h.t('mpt-ov-temp')} i ovn med varmluft. Her er altså temperaturen lavere i airfryeren, og tiden lik eller litt kortere.`,
      )],
      ['Sauset og sticky vinger', h.p(
        `Både MatPrat og Godt.no pensler vingene med bbq-saus mot slutten. MatPrat steker videre ${h.t('mp-bbq')} til sausen har satt seg. Godt.no bruker ${h.t('godt-vekt')} vinger.`,
        'Godt.no skriver at tiden kan variere mellom airfryere, og ber deg sjekke underveis for å unngå at vingene blir svidd.',
      )],
    ],
    kjerne: KJERNE(h.p(
      `${h.k('mt-sommer')} skriver i en tekst om grilling at alt fjørfekjøtt bør gjennomstekes, og at gjennomstekt betyr en kjernetemperatur på minimum ${h.t('mt-kjerne')}. ${h.k('mp-kylling')} oppgir ${h.t('kjerne')} som gjennomstekt for kylling. MatPrats tabell har ingen egen verdi for vinger, så den gjelder kylling generelt.`,
      'Det er kjernetemperaturen som avgjør om vingene er ferdige, ikke klokka.',
    )),
    app: 'Lag en vingekveld ved å legge oppskriften i ukemenyen og la handlelisten ta med sausen.',
    faq: [
      ['Hvor lenge skal kyllingvinger i airfryeren?', `Det avhenger av om vingene er ferdigstekte. ${h.k('godt-vinger')} bruker ${h.t('godt-tid')} og så ${h.t('godt-tid2')}, og ${h.k('mp-kyllingvinger')} bruker ${h.t('mp-tid')} på hver side for ferdigstekte.`],
      ['Hvilken temperatur skal jeg bruke til kyllingvinger?', `${h.k('godt-vinger')} bruker ${h.t('godt-temp')} og MatPrat ${h.t('mp-temp')}. Begge er veiledende.`],
      ['Må jeg snu vingene?', 'Ja, begge kildene snur vingene underveis i steketiden.'],
    ],
    les: [L('kyllinglar', 'Kyllinglår og kyllingklubber i airfryer'), L('kyllingfilet', 'Kyllingfilet i airfryer')],
  }),

  // ---------------------------------------------------------------- fisk
  laks: (h) => ({
    ord: 'laks',
    title: 'Laks i airfryer: tid og temperatur',
    h1: 'Laks i airfryer: tid og temperatur',
    description: `MatPrat og Lerøy stekte laks på ${h.t('mp-temp')} i ca. ${h.t('mp-tid')}. Philips oppgir ${h.t('ph-temp')} i ${h.t('ph-tid')} for fiskefilet. Tre kilder side om side.`,
    lead: 'To kilder om laks stemmer overens, og en generell tabell for fiskefilet er langt fra dem. Her står alle tre, med kilde og år.',
    svar: `${h.k('mp-laks')} og ${h.k('le-hoisin')} stekte laks på ${h.t('mp-temp')} i ca. ${h.t('mp-tid')}. ${h.k('ph-hd920')} oppgir ${h.t('ph-temp')} og ${h.t('ph-tid')} for fiskefilet generelt. ${SVAR_ADVARSEL}`,
    tabell: {
      tittel: 'Tid og temperatur for laksefilet', intro: 'De to første radene gjelder laks. Den siste er en generell rad for fiskefilet, og den er vist fordi den er så annerledes.',
      kolonner: ['Kilde', 'Temperatur', 'Tid', 'Hva det gjelder'],
      rader: [
        [h.k('mp-laks'), h.t('mp-temp'), h.t('mp-tid'), `${h.t('mp-antall')} laksefilet`],
        [h.k('le-hoisin'), h.t('le-temp'), h.t('le-tid', { ca: true }), 'Laksefileter penslet med hoisinsaus'],
        [h.k('le-pommes'), h.t('lep-temp'), h.t('lep-tid', { ca: true }), 'Laks sammen med pommes frites i samme airfryer'],
        [h.k('ph-hd920'), h.t('ph-temp'), h.t('ph-tid'), `Fiskefilet, ca. ${h.t('ph-vekt')}, ett lag`],
      ],
    },
    avsnitt: [
      ['Hvorfor Philips skiller seg ut', h.p(
        `MatPrat og Lerøy stekte laksen på ${h.t('mp-temp')} i omtrent ${h.t('mp-tid')}. Philips oppgir en lavere temperatur, ${h.t('ph-temp')}, og en tid som er mer enn dobbelt så lang. Tabellen er for fiskefilet generelt, ikke laks, og Philips skriver at innstillingene er forslag.`,
        `Vi vet ikke hvor tykk laksen var hos kildene. MatPrats sammenligningstabell oppgir ${h.t('mpt-ov-tid')} ved ${h.t('mpt-ov-temp')} for laks i ovn med varmluft, så laksen står på samme temperatur i ovn og airfryer, men kortere tid i airfryeren.`,
      )],
      ['Laks sammen med pommes frites', h.p(
        `Lerøy lager laks og pommes frites i samme airfryer. Pommes frites får først ${h.t('lep-pommes-tid')} alene på ${h.t('lep-pommes-temp')}. Så rister du kurven, setter ned varmen til ${h.t('lep-temp')} og legger laksen inn ved siden av. Laksen får ${h.t('lep-tid', { ca: true })}. Lerøy skriver at oppskriften er laget for en stor airfryer og kan halveres hvis du har en mindre.`,
      )],
    ],
    kjerne: KJERNE(h.p(`${h.k('mp-fisk')} oppgir ca. ${h.t('kjerne')} i kjernen for filet i ovn. Det er MatPrats tall for ferdig tilberedt filet, og de skriver at kjernetemperaturen kan være lavere om du ønsker en rå kjerne. Tidene over sier bare hvor du kan begynne å sjekke. Det er kjernetemperaturen som avgjør, ikke klokka.`)),
    app: 'Legg laksemiddagen i ukemenyen, så kommer varene med på handlelisten.',
    faq: [
      ['Hvor lenge skal laks i airfryeren?', `${h.k('mp-laks')} oppgir ${h.t('mp-tid')} ved ${h.t('mp-temp')}. ${h.k('le-hoisin')} oppgir ca. ${h.t('le-tid')} ved ${h.t('le-temp')}.`],
      ['Hvorfor oppgir Philips så lang tid for fisk?', `${h.k('ph-hd920')} oppgir ${h.t('ph-tid')} ved ${h.t('ph-temp')} for fiskefilet generelt. Tabellen er for hele apparatet og er ikke skrevet for laks. Philips kaller innstillingene forslag.`],
      ['Hvilken kjernetemperatur har laks?', `${h.k('mp-fisk')} oppgir ca. ${h.t('kjerne')} for filet i ovn.`],
    ],
    les: [L('torsk', 'Torsk i airfryer'), L('fiskepinner', 'Fiskepinner i airfryer')],
  }),

  torsk: (h) => ({
    ord: 'torsk',
    title: 'Torsk i airfryer: tid og temperatur',
    h1: 'Torsk i airfryer: tid og temperatur',
    description: `Lerøy stekte sprøpanert torsk på ${h.t('le-temp')} i ${h.t('le-tid')}. Philips oppgir ${h.t('ph-temp')} i ${h.t('ph-tid')} for fiskefilet. Hva tallene gjelder, og kjernetemperaturen.`,
    lead: 'Vi har ikke funnet en kilde for ren torskefilet i airfryer. Her er det kildene har: panert torsk fra Lerøy og en generell rad for fiskefilet fra Philips.',
    svar: `${h.k('le-torsk')} stekte sprøpanerte torsketerninger på ${h.t('le-temp')} i ${h.t('le-tid')}. ${h.k('ph-hd920')} oppgir ${h.t('ph-temp')} i ${h.t('ph-tid')} for fiskefilet generelt. ${SVAR_ADVARSEL}`,
    tabell: {
      tittel: 'Hva kildene oppgir', intro: 'Ingen av radene er for rå torskefilet uten panering. Les «hva det gjelder».',
      kolonner: ['Kilde', 'Temperatur', 'Tid', 'Hva det gjelder'],
      rader: [
        [h.k('le-torsk'), h.t('le-temp'), h.t('le-tid'), 'Sprøpanerte torsketerninger fra Lerøy'],
        [h.k('le-fiskepinner'), h.t('lef-temp'), h.t('lef-tid', { ca: true }), `Hjemmelagde fiskepinner av torsk, fra ${h.t('lef-vekt')} blokk`],
        [h.k('ph-hd920'), h.t('ph-temp'), h.t('ph-tid'), `Fiskefilet generelt, ca. ${h.t('ph-vekt')}, ett lag`],
      ],
    },
    avsnitt: [
      ['Panert eller ren torsk', h.p(
        `De to radene fra Lerøy gjelder panert torsk, og tiden er kort. Rad tre fra Philips er et generelt tall for fiskefilet, med lavere temperatur og lengre tid. Vi har ikke funnet en kilde som oppgir tid for ren torskefilet i airfryer, så vi oppgir ingen.`,
      )],
      ['Mager fisk og fett', h.p(
        `${h.k('le-tips')} skriver at du kan legge et bakeark over fet fisk, som laks og ørret, slik at fettet ikke sprutter opp i varmeelementene. For magrere fisk som torsk og hyse skriver de at det kan være smart å tilsette litt smør eller olje, for god smak og et saftig resultat.`,
      )],
    ],
    kjerne: KJERNE(h.p(`${h.k('mp-fisk')} oppgir ca. ${h.t('kjerne')} i kjernen for filet i ovn. Tabellen nevner ikke torsk spesielt, men gjelder fisk generelt. Tidene over sier bare hvor du kan begynne å sjekke. Det er kjernetemperaturen som avgjør, ikke klokka.`)),
    app: 'Legg torsken i ukemenyen og la handlelisten samle resten av middagen.',
    faq: [
      ['Hvor lenge skal torsk i airfryeren?', `For panert torsk oppgir ${h.k('le-torsk')} ${h.t('le-tid')} ved ${h.t('le-temp')}. For ren torskefilet har vi ikke funnet en kilde.`],
      ['Kan jeg bruke tiden for fiskepinner til torskefilet?', 'Nei, det er ikke samme produkt. Fiskepinner er ferdigpanerte pakker med egne tider, og tallene for dem står på siden om fiskepinner.'],
      ['Hvilken kjernetemperatur har torsk?', `${h.k('mp-fisk')} oppgir ca. ${h.t('kjerne')} for filet i ovn, og tabellen gjelder fisk generelt.`],
    ],
    les: [L('laks', 'Laks i airfryer'), L('fiskepinner', 'Fiskepinner i airfryer')],
  }),

  fiskepinner: (h) => ({
    ord: 'fiskepinner',
    title: 'Fiskepinner i airfryer: tid og temperatur',
    h1: 'Fiskepinner i airfryer: tid og temperatur',
    description: `Findus oppgir ${h.t('fi10-temp')} i ca. ${h.t('fi10-tid')} for fiskepinner, og ${h.t('fi32-temp')} for en annen pakke. Tre pakker og én hjemmelaget variant side om side.`,
    lead: 'Det er pakken som gjelder. Findus oppgir ulik temperatur og tid for tre pakker av fiskepinner, og her står alle sammen med ovnstiden til samme pakke.',
    svar: `${h.k('fi-10')} oppgir ${h.t('fi10-temp')} i ca. ${h.t('fi10-tid')} for frosne fiskepinner. Fish & Crisp bruker ${h.t('fifc-tid')}. ${SVAR_ADVARSEL} Følg pakken du har.`,
    tabell: {
      tittel: 'Findus: tre pakker, ovn mot airfryer', intro: 'Tallene er produsentens egne, fra hver sin produktside. Samme firma gir altså ulike tall for ulike pakker.',
      kolonner: ['Pakke', 'Ovn med varmluft', 'Airfryer'],
      rader: [
        ['Findus Fiskepinner, liten pakke', `${h.t('fi10-ov-temp')}, ${h.t('fi10-ov-tid', { ca: true })}`, `${h.t('fi10-temp')}, ${h.t('fi10-tid', { ca: true })}, ${h.t('fi10-antall')} fiskepinner`],
        ['Findus Fiskepinner, stor pakke', `${h.t('fi32-ov-temp')}, ${h.t('fi32-ov-tid')}`, `${h.t('fi32-temp')}, ${h.t('fi32-tid', { ca: true })}, ${h.t('fi32-antall')} fiskepinner`],
        ['Findus Fish & Crisp', `${h.t('fifc-ov-temp')}, ${h.t('fifc-ov-tid')}`, `${h.t('fifc-temp')}, ${h.t('fifc-tid')}`],
      ],
      etter: [`Findus skriver at fiskepinnene skal stå i ca. ${h.t('fi10-hvile')} før servering, og at tilberedningstiden kan variere. De ber deg sjekke at maten er gjennomvarm før servering.`],
    },
    avsnitt: [
      ['Hjemmelagde fiskepinner', h.p(
        `Lerøy lager fiskepinner av torsk i blokk og steker dem på ${h.t('le-temp')} i ${h.t('le-tid', { ca: true })}, eller til de er sprø og gyllene. Det er hjemmepanert fisk, ikke de ferdige fiskepinnene fra butikken, så tallet er ikke direkte sammenlignbart med Findus.`,
      )],
      ['Hva sier tabellen om omregning fra ovn', h.p(
        `Alle tre pakkene har kortere tid i airfryeren enn i ovn med varmluft, og temperaturen er lavere. For den lille pakken går Findus fra ${h.t('fi10-ov-temp')} i ovnen til ${h.t('fi10-temp')} i airfryeren. For den store pakken er det ${h.t('fi32-ov-temp')} mot ${h.t('fi32-temp')}. Det er mer enn en femtedel kortere tid i alle tre.`,
        'Les mer om omregning på siden om ovn til airfryer.',
      )],
    ],
    app: 'Fiskepinner er en rask hverdagsmiddag. Legg den i ukemenyen på en travel dag.',
    faq: [
      ['Må jeg forvarme airfryeren til fiskepinner?', `Findus ber deg forvarme airfryeren, til ${h.t('fi10-temp')} for den lille pakken og ${h.t('fi32-temp')} for den store.`],
      ['Hvor mange fiskepinner kan det være i kurven?', `Findus oppgir ${h.t('fi10-antall')} fiskepinner for begge de to vanlige pakkene, og en halv pakke for Fish & Crisp.`],
      ['Hvorfor er tiden ulik for ulike fiskepinner?', 'Findus gir ulike tall for hver pakke, og skriver at tilberedningstiden kan variere. Følg pakken du har kjøpt.'],
    ],
    les: [L('frossen-mat', 'Frossen mat i airfryer'), L('torsk', 'Torsk i airfryer')],
  }),

  // ---------------------------------------------------------------- potet
  'pommes-frites': (h) => ({
    ord: 'pommes frites',
    title: 'Pommes frites i airfryer: tid og temperatur',
    h1: 'Pommes frites i airfryer: tid og temperatur',
    description: `Philips oppgir ${h.t('ph-tynn-temp')} i ${h.t('ph-tynn-tid')} for tynne frosne pommes frites og ${h.t('ph-hjem-tid')} for hjemmelagde. Mengde, risting og tidene fra Lerøy.`,
    lead: 'Frosne og hjemmelagde pommes frites får ulike tider. Her er tallene fra Philips sin brukerhåndbok, med mengden og ristingen de gjelder for.',
    svar: `${h.k('ph-hd920')} oppgir ${h.t('ph-tynn-temp')} i ${h.t('ph-tynn-tid')} for tynn frossen pommes frites og ${h.t('ph-hjem-tid')} for hjemmelaget. ${SVAR_ADVARSEL}`,
    tabell: {
      tittel: 'Tid og temperatur for pommes frites', intro: 'Alle tallene er fra Philips unntatt den siste raden. Philips skriver at innstillingene er forslag.',
      kolonner: ['Hva det gjelder', 'Temperatur', 'Tid', 'Mengde'],
      rader: [
        [`Tynn frossen pommes frites, ${h.t('ph-tynn-mm')} tykk (${h.kp('ph-hd920')})`, h.t('ph-tynn-temp'), h.t('ph-tynn-tid'), h.t('ph-tynn-mengde')],
        [`Hjemmelaget pommes frites, ${h.t('ph-hjem-mm')} tykk (${h.kp('ph-hd920')})`, h.t('ph-hjem-temp'), h.t('ph-hjem-tid'), h.t('ph-hjem-mengde')],
        [`Pommes frites sammen med laks (${h.kp('le-pommes')})`, h.t('le-temp'), h.t('le-tid'), 'Oppgis ikke'],
      ],
      etter: [`Philips skriver at du bør riste, snu eller røre ${h.t('ph-rist')} under steking, og at det er best å luftsteke pommes frites i porsjoner på opptil ${h.t('ph-porsjon')} for et jevnt resultat. Store pommes frites er ofte mindre sprø enn små, skriver de.`],
    },
    avsnitt: [
      ['Hjemmelaget pommes frites, slik Philips beskriver det', h.p(
        `Philips anbefaler nypoteter med en litt melaktig konsistens, kuttet i staver på ca. ${h.t('ph-stav')} i tykkelse. Stavene skal ligge i vann i minst ${h.t('ph-bloetlegg')}, tørkes og blandes med litt olje. De skal ikke helles fra bollen og ned i kurven, så ikke overflødig olje havner i pannen. Så rister du kurven ${h.t('ph-rist')} under steking.`,
      )],
      ['Pommes frites sammen med laks', h.p(
        `Lerøy legger pommes frites i airfryeren i ${h.t('le-tid')} på ${h.t('le-temp')} og rister kurven før laksen kommer til. Oppskriften oppgir ikke hvilken type pommes frites, og tallet er derfor ikke direkte sammenlignbart med Philips.`,
      )],
    ],
    app: 'Pommes frites er tilbehør. Legg hovedretten i ukemenyen, så er tilbehøret med på handlelisten.',
    faq: [
      ['Hvor lenge skal frosne pommes frites i airfryeren?', `${h.k('ph-hd920')} oppgir ${h.t('ph-tynn-tid')} ved ${h.t('ph-tynn-temp')} for tynne, frosne pommes frites. Pakken din kan oppgi noe annet, og den gjelder foran.`],
      ['Hvor mye pommes frites kan jeg lage om gangen?', `Philips oppgir ${h.t('ph-tynn-mengde')} i tabellen og ${h.t('ph-porsjon')} som best for et jevnt resultat.`],
      ['Må jeg riste kurven?', `Ja, Philips ber deg riste, snu eller røre ${h.t('ph-rist')} under steking av pommes frites.`],
    ],
    les: [L('potetbater', 'Potetbåter i airfryer'), L('frossen-mat', 'Frossen mat i airfryer')],
  }),

  potetbater: (h) => ({
    ord: 'potetbåter',
    title: 'Potetbåter i airfryer: tid og temperatur',
    h1: 'Potetbåter i airfryer: tid og temperatur',
    description: `MatPrat stekte potetbåter på ${h.t('mp-temp')} i ${h.t('mp-tid')}, bakt potet på ${h.t('bakt-temp')} og søtpotetchips på ${h.t('sot-temp')}. Med ovnstidene til sammenligning.`,
    lead: 'Potetbåter, bakt potet og søtpotetchips har hver sin tid hos MatPrat. Her står de side om side, sammen med hva samme rett krever i ovn.',
    svar: `${h.k('mp-potetbater')} stekte potetbåter på ${h.t('mp-temp')} i ${h.t('mp-tid')}. Bakt potet tok ${h.t('bakt-tid')} på ${h.t('bakt-temp')}, og søtpotetchips ${h.t('sot-tid')} på ${h.t('sot-temp')}. ${SVAR_ADVARSEL}`,
    tabell: {
      tittel: 'Tid og temperatur for poteter', intro: 'Alle tallene er fra MatPrat. Ovnstidene er fra MatPrats sammenligningstabell.',
      kolonner: ['Rett', 'Airfryer', 'Ovn med varmluft'],
      rader: [
        ['Potetbåter', `${h.t('mp-temp')}, ${h.t('mp-tid')}`, `${h.t('mpt-ov-temp')}, ${h.t('mpt-ov-tid')}`],
        ['Bakt potet', `${h.t('bakt-temp')}, ${h.t('bakt-tid')}`, 'Oppgis ikke'],
        ['Søtpotetchips', `${h.t('sot-temp')}, ${h.t('sot-tid')}`, `${h.t('sot-ov-temp')}, ${h.t('sot-ov-tid')}`],
      ],
    },
    avsnitt: [
      ['Halvert steketid, men ikke for alle poteter', h.p(
        `MatPrat skriver at du kan halvere steketiden for noen retter, og nevner potetbåter, bacon og søtpotetchips. Potetbåtene stekes ved ${h.t('mp-temp')} og får ${h.t('mp-tid')}, mot ${h.t('mpt-ov-tid')} ved ${h.t('mpt-ov-temp')} i ovn.`,
        `Søtpotetchips er et unntak fra mønsteret om lavere temperatur. MatPrat bruker ${h.t('sot-temp')} i airfryeren og ${h.t('sot-ov-temp')} i ovn, men tiden er langt kortere: ${h.t('sot-tid')} mot ${h.t('sot-ov-tid')}.`,
      )],
      ['Bakt potet i airfryer', h.p(
        `Bakt potet er den lengste. MatPrat stikker mange små hull over hele poteten og baker den ved ${h.t('bakt-temp')} i ${h.t('bakt-tid')}. Oppskriften bruker ${h.t('bakt-antall')} bakepoteter og skriver at tiden kan variere mellom produsentene, så sjekk underveis.`,
      )],
    ],
    app: 'Legg poteter som tilbehør i ukemenyen, så får handlelisten med potetene og oljen.',
    faq: [
      ['Hvor lenge skal potetbåter i airfryeren?', `MatPrat oppgir ${h.t('mp-tid')} ved ${h.t('mp-temp')}, med ${h.t('mp-antall')} poteter i oppskriften.`],
      ['Hvor lenge skal bakt potet i airfryeren?', `MatPrat bruker ${h.t('bakt-tid')} ved ${h.t('bakt-temp')}.`],
      ['Hvor lenge skal søtpotetchips i airfryeren?', `MatPrat oppgir ${h.t('sot-tid')} ved ${h.t('sot-temp')}. Skivene bør ha lik tykkelse, og MatPrat skriver at du kan bruke en mandolin.`],
    ],
    les: [L('pommes-frites', 'Pommes frites i airfryer'), L('gronnsaker', 'Grønnsaker i airfryer')],
  }),

  gronnsaker: (h) => ({
    ord: 'grønnsaker',
    title: 'Grønnsaker i airfryer: tid og temperatur',
    h1: 'Grønnsaker i airfryer: tid og temperatur',
    description: `MatPrat oppgir ${h.t('mpt-af-tid')} på ${h.t('mpt-af-temp')} for grønnsaker. Philips oppgir ${h.t('ph-tid')} på ${h.t('ph-temp')} for grovhakkede. To kilder som spriker.`,
    lead: 'Kildene gir helt ulike tider for grønnsaker. Her står begge, med hva de gjelder, og hvorfor du ikke kan lese ett tall for alle grønnsaker.',
    svar: `${h.k('mp-tilb')} oppgir ${h.t('mpt-af-tid')} på ${h.t('mpt-af-temp')}. ${h.k('ph-hd920')} oppgir ${h.t('ph-tid')} på ${h.t('ph-temp')} for grovhakkede, blandede grønnsaker. ${SVAR_ADVARSEL}`,
    tabell: {
      tittel: 'To kilder, to svar', intro: 'Forskjellen er stor. Begge står her, og ingen av dem er et snitt.',
      kolonner: ['Kilde', 'Temperatur', 'Tid', 'Mengde og hva det gjelder'],
      rader: [
        [h.k('mp-tilb'), h.t('mpt-af-temp'), h.t('mpt-af-tid'), 'Grønnsaker uten nærmere angivelse'],
        [h.k('ph-hd920'), h.t('ph-temp'), h.t('ph-tid'), `Blandede grønnsaker, grovhakket, ${h.t('ph-mengde')}`],
      ],
      etter: [`MatPrat oppgir ${h.t('mpt-ov-tid')} ved ${h.t('mpt-ov-temp')} for samme grønnsaker i ovn med varmluft.`],
    },
    avsnitt: [
      ['Hvorfor tidene er så ulike', h.p(
        'Grønnsaker er ikke én matvare, og begge kildene oppgir bare ett tall. MatPrats tabell sier ikke hva slags grønnsaker de mener, og Philips oppgir en blanding som er hakket grovt.',
        'Philips skriver i raden at steketiden kan stilles inn etter egen smak, og at du bør riste, snu eller røre halvveis.',
      )],
      ['Hvordan velge tid', h.p(
        'Begge kildene sier at tiden varierer, og ingen av dem oppgir en tid per type grønnsak. MatPrat ber deg sjekke med jevne mellomrom, og Philips sier at du kan stille inn steketiden etter egen smak.',
      )],
    ],
    app: 'Ukemenyen i Matlyst kan ha en grønnsaksdag. Handlelisten samler grønnsakene fra oppskriftene dine.',
    faq: [
      ['Hvor lenge skal grønnsaker i airfryeren?', `${h.k('mp-tilb')} oppgir ${h.t('mpt-af-tid')} ved ${h.t('mpt-af-temp')}. ${h.k('ph-hd920')} oppgir ${h.t('ph-tid')} ved ${h.t('ph-temp')} for grovhakket blanding.`],
      ['Må jeg riste grønnsakene?', 'Ja, Philips ber deg riste, snu eller røre halvveis for blandede grønnsaker.'],
      ['Hvor mye grønnsaker kan det være i kurven?', `Philips oppgir ${h.t('ph-mengde')} for blandede, grovhakkede grønnsaker.`],
    ],
    les: [L('potetbater', 'Potetbåter i airfryer'), L('frossen-mat', 'Frossen mat i airfryer')],
  }),

  // ---------------------------------------------------------------- svin, storfe, pølser
  bacon: (h) => ({
    ord: 'bacon',
    title: 'Bacon i airfryer: tid og temperatur',
    h1: 'Bacon i airfryer: tid og temperatur',
    description: `MatPrat stekte bacon på ${h.t('mp-temp')} i ${h.t('mp-tid')}. Fredriksstad Blad oppgir ${h.t('fb-tid')} ved ${h.t('fb-temp')}. To tider side om side.`,
    lead: 'Samme temperatur, ulik tid. MatPrat og Fredriksstad Blad er enige om temperaturen for bacon, men ikke om tiden.',
    svar: `${h.k('mp-bacon')} stekte bacon på ${h.t('mp-temp')} i ${h.t('mp-tid')}. ${h.k('fb-airfryer')} oppgir ${h.t('fb-tid')} ved ${h.t('fb-temp')}. ${SVAR_ADVARSEL}`,
    tabell: {
      tittel: 'Tid og temperatur for bacon', intro: 'Begge kildene bruker samme temperatur. Tiden er ulik.',
      kolonner: ['Kilde', 'Temperatur', 'Tid', 'Mengde'],
      rader: [
        [h.k('mp-bacon'), h.t('mp-temp'), h.t('mp-tid'), h.t('mp-vekt')],
        [h.k('fb-airfryer'), h.t('fb-temp'), h.t('fb-tid'), 'Oppgis ikke'],
      ],
    },
    avsnitt: [
      ['Tynne og tykke skiver', h.p(
        'Fredriksstad Blad skriver at tynne skiver trenger kortere tid og tykke skiver litt mer. Ingen av de to kildene oppgir hvor tykk baconen var, så vi kan ikke si hvor mye det forklarer av forskjellen.',
        `${h.k('mp-tilb')} skriver at du kan halvere steketiden for bacon sammenlignet med ovn.`,
      )],
      ['Ett lag og fett', h.p(
        'Fredriksstad Blad ber deg legge baconskivene i ett lag i kurven og ikke oppå hverandre, fordi de da blir mer kokt enn sprø. De skriver også at du bør tømme ut fettet hvis du lager flere runder, ellers kan det ryke mer enn nødvendig.',
        `MatPrat bruker ${h.t('mp-vekt')} bacon i oppskriften.`,
      )],
    ],
    kjerne: KJERNE(h.p('Vi har ikke funnet en kilde med kjernetemperatur for bacon, så vi oppgir ingen. Tidene over er veiledende, og det er du som må vurdere om baconen er stekt nok. Følg anvisningen på pakken.')),
    app: 'Bacon er ofte en del av en frokost- eller brunsjmeny. Legg oppskriften i ukemenyen.',
    faq: [
      ['Hvor lenge skal bacon i airfryeren?', `${h.k('mp-bacon')} oppgir ${h.t('mp-tid')} ved ${h.t('mp-temp')}, og ${h.k('fb-airfryer')} oppgir ${h.t('fb-tid')} ved samme temperatur.`],
      ['Må baconet ligge i ett lag?', 'Fredriksstad Blad ber deg legge det i ett lag, så det blir sprøtt og ikke kokt.'],
      ['Må jeg forvarme airfryeren til bacon?', 'Ingen av de to kildene sier at du må forvarme til bacon.'],
    ],
    les: [L('polser', 'Pølser i airfryer'), L('egg', 'Egg i airfryer')],
  }),

  polser: (h) => ({
    ord: 'pølser',
    title: 'Pølser i airfryer: tid og temperatur',
    h1: 'Pølser i airfryer: tid og temperatur',
    description: `Gilde oppgir ${h.t('gi-hel-tid')} på ${h.t('gi-hel-temp')} for grillpølser og ${h.t('gi-skinnfri-tid')} på ${h.t('gi-skinnfri-temp')} for skinnfri kjøttpølse. Philips oppgir ${h.t('ph-tid')}.`,
    lead: 'Hvor lenge pølsene skal stå i airfryeren avhenger av typen. Gilde oppgir fem ulike tider, og Philips har en sjette.',
    svar: `${h.k('gi-polser')} oppgir ${h.t('gi-hel-tid')} på ${h.t('gi-hel-temp')} for en hel pakke grillpølser og ${h.t('gi-skinnfri-tid')} på ${h.t('gi-skinnfri-temp')} for skinnfri kjøttpølse. ${SVAR_ADVARSEL}`,
    tabell: {
      tittel: 'Tid og temperatur etter pølsetype', intro: 'Gilde skriver at temperatur og steketid avhenger av hvilke pølser du skal steke. Philips har én rad for tynne pølser.',
      kolonner: ['Pølsetype', 'Temperatur', 'Tid', 'Antall'],
      rader: [
        [`Grillpølse, hel pakke (${h.kp('gi-polser')})`, h.t('gi-hel-temp'), h.t('gi-hel-tid'), h.t('gi-hel-antall')],
        [`Grillpølse, halv pakke (${h.kp('gi-polser')})`, h.t('gi-halv-temp'), h.t('gi-halv-tid'), h.t('gi-halv-antall')],
        [`Skinnfri kjøttpølse (${h.kp('gi-polser')})`, h.t('gi-skinnfri-temp'), h.t('gi-skinnfri-tid'), 'Oppgis ikke'],
        [`Mindre prosessert skinnfri kjøttpølse (${h.kp('gi-polser')})`, h.t('gi-mindre-temp'), h.t('gi-mindre-tid'), 'Oppgis ikke'],
        [`Pølsemakerens beste og andre spesialpølser (${h.kp('gi-polser')})`, h.t('gi-spesial-temp'), h.t('gi-spesial-tid'), 'Snittes først'],
        [`Tynne pølser (${h.kp('ph-hd920')})`, h.t('ph-temp'), h.t('ph-tid'), `${h.t('ph-antall')}, ca. ${h.t('ph-vekt')} hver`],
      ],
    },
    avsnitt: [
      ['Snitt spesialpølser', h.p(
        'Gilde skriver at pølsemakerens beste og andre spesialpølser må snittes, slik at de ikke sprekker. De ber deg skjære noen små snitt i skinnet med en liten kniv før du steker dem.',
      )],
      ['Fastere skinn enn i panne', h.p(
        'Gilde forklarer at airfryeren fjerner noe fuktighet fra pølsene, og at du derfor får et fastere skinn og en mer markert struktur enn når de stekes i panne.',
        'De anbefaler å snu pølsene halvveis og steke dem i ett lag for jevn steking. Steketid og temperatur kan variere noe fra airfryer til airfryer, skriver de.',
      )],
      ['Når Gilde og Philips er uenige', h.p(
        `Philips oppgir ${h.t('ph-tid')} ved ${h.t('ph-temp')} for tynne pølser, noe lengre enn Gildes ${h.t('gi-halv-tid')} til ${h.t('gi-hel-tid')} for grillpølser ved samme temperatur. Philips-raden gjelder en bestemt pølsetype og et bestemt antall, så les begge radene.`,
      )],
    ],
    kjerne: KJERNE(h.p(
      `${h.k('mt-sommer')} skriver i en tekst om grilling at foredlede kjøttprodukter som hamburgere og pølser bør gjennomstekes, og at gjennomstekt betyr en kjernetemperatur på minimum ${h.t('mt-kjerne')}. Gilde og Philips oppgir ingen kjernetemperatur for pølser.`,
      'Tidene over sier bare hvor du kan begynne å sjekke. Det er kjernetemperaturen som avgjør om pølsene er ferdige, ikke klokka.',
    )),
    app: 'Legg pølsemiddagen i ukemenyen, og la handlelisten ta med brød og tilbehør.',
    faq: [
      ['Hvor lenge skal pølser i airfryeren?', `${h.k('gi-polser')} oppgir ${h.t('gi-hel-tid')} ved ${h.t('gi-hel-temp')} for ${h.t('gi-hel-antall')} grillpølser, og ${h.t('gi-halv-tid')} for ${h.t('gi-halv-antall')}.`],
      ['Må jeg snitte pølsene?', 'Gilde ber deg snitte spesialpølser, slik at de ikke sprekker. For vanlige pølser nevner de ikke snitting.'],
      ['Må jeg snu pølsene?', 'Gilde anbefaler å snu pølsene halvveis i steketiden.'],
    ],
    les: [L('bacon', 'Bacon i airfryer'), L('kjottboller', 'Kjøttboller i airfryer')],
  }),

  hamburger: (h) => ({
    ord: 'hamburger',
    title: 'Hamburger i airfryer: tid og temperatur',
    h1: 'Hamburger i airfryer: tid og temperatur',
    description: `Philips oppgir ${h.t('ph-tid')} på ${h.t('ph-temp')} for hamburgere på ca. ${h.t('ph-vekt')}. Kjernetemperatur: Mattilsynet minimum ${h.t('mt-kjerne')}, MatPrat ${h.t('kjerne')}. Hva kildene sier om karbonader.`,
    lead: 'Hamburgere av kjøttdeig skal gjennomstekes. Her er tiden fra Philips og kjernetemperaturen fra MatPrat, og hva vi ikke har funnet tall for.',
    svar: `${h.k('ph-hd920')} oppgir ${h.t('ph-tid')} på ${h.t('ph-temp')} for hamburgere på ca. ${h.t('ph-vekt')}. Mattilsynet oppgir minimum ${h.t('mt-kjerne')} i kjernen for gjennomstekt, og ${h.k('mp-burger')} skriver at ${h.t('kjerne')} er tilstrekkelig. ${SVAR_ADVARSEL}`,
    tabell: {
      tittel: 'Tid og temperatur for hamburger', intro: 'Én kilde har tid for hamburger i airfryer. Vi har ikke funnet en kilde med tid for karbonader eller burgere av annen størrelse.',
      kolonner: ['Kilde', 'Temperatur', 'Tid', 'Mengde'],
      rader: [[h.k('ph-hd920'), h.t('ph-temp'), h.t('ph-tid'), `${h.t('ph-antall')} hamburgere, ca. ${h.t('ph-vekt')} hver`]],
    },
    avsnitt: [
      ['Hvorfor burgeren skal gjennomstekes', h.p(
        `${h.k('mp-burger')} minner om at Mattilsynet alltid anbefaler at hamburgere av kjøttdeig skal gjennomstekes. Bakgrunnen var et nasjonalt utbrudd av E. coli-smitte, der bakterien var påvist i råvare brukt til hamburgere.`,
        'MatPrat forklarer at bakterier bare finnes på overflaten av hele kjøttstykker. Når kjøttet kvernes, blir bakteriene på overflaten jevnt fordelt i kjøttdeigen. Derfor skal kjøttdeig, hamburgere og andre produkter av oppmalt kjøtt som tommelfingerregel være gjennomstekte.',
      )],
      ['Slik ser du at burgeren er ferdig, ifølge MatPrat', h.p(
        'MatPrat skriver at du kan vente til kjøttsaften som pipler ut av burgeren er helt klar i fargen før du legger den til hvile. Du kan også bruke en kjernetemperaturmåler, og har du en ekstra tykk burger, er det spesielt lurt å bruke en, skriver de.',
        'MatPrat nevner at både ferske og frosne produkter av kjøttdeig skal gjennomstekes.',
      )],
    ],
    kjerne: KJERNE(`${h.p('To kilder oppgir ulike kjernetemperaturer for hamburger. Begge står her, og ingen av dem er et snitt.')}${h.tabell('Kjernetemperatur for hamburger', ['Kilde', 'Kjernetemperatur', 'Hva kilden skriver'], [
      [h.k('mt-sommer'), `minimum ${h.t('mt-kjerne')}`, 'Gjennomstekt betyr en kjernetemperatur på minimum dette. Hamburgere og rå kjøttfarse bør gjennomstekes.'],
      [h.k('mp-burger'), h.t('kjerne'), 'Gjennomstekning til dette er tilstrekkelig for å drepe eventuelle uønskede bakterier i hamburgerkjøttet.'],
    ])}${h.p('Tiden fra Philips sier bare hvor du kan begynne å sjekke. Det er kjernetemperaturen som avgjør, ikke klokka.')}`),
    app: 'Legg burgerkvelden i ukemenyen, og la Matlyst samle handlelisten.',
    faq: [
      ['Hvor lenge skal hamburger i airfryeren?', `${h.k('ph-hd920')} oppgir ${h.t('ph-tid')} ved ${h.t('ph-temp')} for hamburgere på ca. ${h.t('ph-vekt')}.`],
      ['Kan jeg ha medium stekt burger?', 'MatPrat skriver at å kverne kjøttet selv kan gi en viss kontroll, og er å foretrekke dersom du ønsker å nyte en medium stekt burger. Samtidig skal hamburgere av kjøttdeig gjennomstekes, skriver de.'],
      ['Hva med karbonader?', 'Vi har ikke funnet en kilde med tid for karbonader i airfryer, så vi oppgir ingen.'],
    ],
    les: [L('kjottboller', 'Kjøttboller i airfryer'), L('svinekoteletter', 'Svinekoteletter i airfryer')],
  }),

  kjottboller: (h) => ({
    ord: 'kjøttboller',
    title: 'Kjøttboller i airfryer: tid og temperatur',
    h1: 'Kjøttboller i airfryer: tid og temperatur',
    description: `Gilde oppgir ${h.t('gi-ferdig-tid', { ca: true })} på ${h.t('gi-ferdig-temp')} for ferdige kjøttboller og ${h.t('gi-ra-tid', { ca: true })} på ${h.t('gi-ra-temp')} for rå. Kjernetemperatur for oppmalt kjøtt.`,
    lead: 'Ferdige og rå kjøttboller er to forskjellige ting i airfryeren. Gilde oppgir tid for begge.',
    svar: `${h.k('gi-kjottboller')} oppgir ${h.t('gi-ferdig-tid', { ca: true })} på ${h.t('gi-ferdig-temp')} for ferdige kjøttboller og ${h.t('gi-ra-tid', { ca: true })} på ${h.t('gi-ra-temp')} for rå. ${SVAR_ADVARSEL}`,
    tabell: {
      tittel: 'Ferdige og rå kjøttboller', intro: 'Begge tallene er fra Gilde. De gjelder ulike produkter, og ingen av dem oppgir størrelsen på bollene.',
      kolonner: ['Hva det gjelder', 'Temperatur', 'Tid'],
      rader: [
        ['Ferdige kjøttboller, Slakterens beste', h.t('gi-ferdig-temp'), h.t('gi-ferdig-tid', { ca: true })],
        ['Rå kjøttboller, kjøpt', h.t('gi-ra-temp'), h.t('gi-ra-tid', { ca: true })],
      ],
      etter: [`Gilde viser også hvordan du lager kjøttbollene selv, med ${h.t('gi-deig')} kjøttdeig som eksempel, men oppgir ikke en egen tid for dem.`],
    },
    avsnitt: [
      ['Ferdige mot rå', h.p(
        `Ferdige kjøttboller er allerede tilberedt, og Gilde har satt ${h.t('gi-ferdig-tid', { ca: true })} ved ${h.t('gi-ferdig-temp')}. Rå kjøttboller får høyere temperatur og litt lengre tid, ${h.t('gi-ra-tid', { ca: true })} ved ${h.t('gi-ra-temp')}.`,
      )],
      ['Kjøttdeig skal gjennomstekes', h.p(
        `${h.k('mp-burger')} skriver at kjøttdeig, hamburgere og andre produkter av oppmalt kjøtt som tommelfingerregel skal være gjennomstekte. For hamburgere oppgir de ${h.t('kjerne')} i kjernen. MatPrat nevner ikke kjøttboller spesielt.`,
      )],
    ],
    kjerne: KJERNE(`${h.p(`${h.k('mt-sommer')} skriver i en tekst om grilling at alle rå kjøttfarseprodukter bør gjennomstekes, og at gjennomstekt betyr en kjernetemperatur på minimum ${h.t('mt-kjerne')}. For hamburgere oppgir ${h.k('mp-burger')} ${h.t('kjerne')} som tilstrekkelig. Gilde oppgir ingen kjernetemperatur for kjøttboller.`)}${h.p('Kildene oppgir altså ulike tall, og vi viser begge. Det er kjernetemperaturen som avgjør om rå kjøttboller er ferdige, ikke klokka.')}`),
    app: 'Kjøttboller er en klassiker i ukemenyen. Legg oppskriften din inn, så lager Matlyst handlelisten.',
    faq: [
      ['Hvor lenge skal kjøttboller i airfryeren?', `For ferdige kjøttboller oppgir ${h.k('gi-kjottboller')} ${h.t('gi-ferdig-tid', { ca: true })} ved ${h.t('gi-ferdig-temp')}. For rå oppgir de ${h.t('gi-ra-tid', { ca: true })} ved ${h.t('gi-ra-temp')}.`],
      ['Hvor mye kjøttdeig til hjemmelagde kjøttboller?', `Gildes eksempel bruker ${h.t('gi-deig')} kjøttdeig. Gilde oppgir ikke en egen tid for de hjemmelagde.`],
      ['Må jeg gjennomsteke rå kjøttboller?', `${h.k('mt-sommer')} skriver at alle rå kjøttfarseprodukter bør gjennomstekes, med minimum ${h.t('mt-kjerne')} i kjernen. MatPrat skriver at produkter av oppmalt kjøtt som tommelfingerregel skal være gjennomstekte, og oppgir ${h.t('kjerne')} for hamburgere.`],
    ],
    les: [L('hamburger', 'Hamburger i airfryer'), L('polser', 'Pølser i airfryer')],
  }),

  svinekoteletter: (h) => ({
    ord: 'svinekoteletter',
    title: 'Svinekoteletter i airfryer: tid og temperatur',
    h1: 'Svinekoteletter i airfryer: tid og temperatur',
    description: `Philips oppgir ${h.t('ph-tid')} på ${h.t('ph-temp')} for benfrie koteletter på ca. ${h.t('ph-vekt')}. MatPrat oppgir ${h.t('kjerne')} som gjennomstekt for flere svinekjøttstykker.`,
    lead: 'Én kilde oppgir tid for svinekoteletter i airfryer, og den gjelder benfrie koteletter. Her står den, sammen med det MatPrat sier om kjernetemperatur for svinekjøtt.',
    svar: `${h.k('ph-hd920')} oppgir ${h.t('ph-tid')} på ${h.t('ph-temp')} for benfrie koteletter på ca. ${h.t('ph-vekt')}. ${SVAR_ADVARSEL} Kjernetemperaturen avgjør.`,
    tabell: {
      tittel: 'Tid og temperatur for koteletter', intro: 'Én kilde. Vi har ikke funnet en kilde med tid for koteletter med ben eller for tykkere koteletter.',
      kolonner: ['Kilde', 'Temperatur', 'Tid', 'Mengde'],
      rader: [[h.k('ph-hd920'), h.t('ph-temp'), h.t('ph-tid'), `${h.t('ph-antall')} benfrie koteletter, ca. ${h.t('ph-vekt')} hver`]],
      etter: ['Philips ber deg riste, snu eller røre halvveis i steketiden.'],
    },
    avsnitt: [
      ['Hva tabellen ikke sier', h.p(
        'Philips oppgir benfrie koteletter, og antallet er opptil to. Vi har ikke funnet tid for koteletter med ben eller for tykkere koteletter, og ingen av våre kilder oppgir tykkelsen.',
        'Philips skriver også at innstillingene er forslag, og at de ikke kan garantere at de passer maten din.',
      )],
      ['Hva MatPrat og Mattilsynet sier om svinekotelett', h.p(
        'MatPrat har en egen tabell for steking av svinekjøtt. Der brunes koteletter først raskt på sterk varme, og så legges et lokk over mens de etterstekes. Tabellen har ingen kjernetemperatur for koteletter.',
        `${h.k('mt-sommer')} skriver i en tekst om grilling at det ved steking av hele kjøttstykker som biff og koteletter er nok at overflatene blir godt stekte, fordi bakteriene finnes der. Det gjelder hele stykker, ikke kjøttdeig.`,
      )],
    ],
    kjerne: KJERNE(h.p(`${h.k('mp-svin')} oppgir ${h.t('kjerne')} som gjennomstekt for svinekjøtt som ytrefilet, indrefilet og stek. Koteletter står uten egen kjernetemperatur i tabellen, så vi kan ikke oppgi en verdi for dem. Det er kjernetemperaturen som avgjør om kotelettene er ferdige, ikke klokka.`)),
    app: 'Legg koteletter i ukemenyen, og la handlelisten samle tilbehøret.',
    faq: [
      ['Hvor lenge skal svinekoteletter i airfryeren?', `${h.k('ph-hd920')} oppgir ${h.t('ph-tid')} ved ${h.t('ph-temp')} for benfrie koteletter på ca. ${h.t('ph-vekt')}.`],
      ['Hvilken kjernetemperatur har svinekotelett?', `MatPrat har ingen egen verdi for koteletter. For andre svinekjøttstykker oppgir ${h.k('mp-svin')} ${h.t('kjerne')} som gjennomstekt.`],
      ['Må jeg snu koteletten?', 'Philips ber deg riste, snu eller røre halvveis.'],
    ],
    les: [L('hamburger', 'Hamburger i airfryer'), L('ribbe', 'Ribbe i airfryer')],
  }),

  biff: (h) => ({
    ord: 'biff',
    title: 'Biff i airfryer: tid og temperatur',
    h1: 'Biff i airfryer: tid og temperatur',
    description: `MatPrat stekte ${h.t('mp-vekt')} entrecôte på ${h.t('mp-temp')} i ca. ${h.t('mp-tid')}. Kjernetemperaturen fra lite stekt, ${h.t('kjerne-lite')}, til gjennomstekt, ${h.t('kjerne-gjennom')}.`,
    lead: 'MatPrat har en oppskrift på entrecôte i airfryer med tid, hviletid og kjernetemperatur for hver stekegrad. Her står alle tallene.',
    svar: `${h.k('mp-biff')} stekte ${h.t('mp-vekt')} entrecôte på ${h.t('mp-temp')} i ca. ${h.t('mp-tid')}. Kjernetemperaturen er ${h.t('kjerne-lite')} for lite stekt og ${h.t('kjerne-gjennom')} for gjennomstekt. ${SVAR_ADVARSEL}`,
    tabell: {
      tittel: 'Tid og temperatur for entrecôte', intro: `Én oppskrift fra MatPrat. Tiden gjelder ${h.t('mp-vekt')} entrecôte, og tykkelsen er ikke oppgitt.`,
      kolonner: ['Hva', 'Tall'],
      rader: [
        ['Temperatur i airfryeren', h.t('mp-temp')],
        ['Steketid', h.t('mp-tid', { ca: true })],
        ['Tempereres før steking', `minst ${h.t('mp-temper')}`],
        ['Hviler etter steking', h.t('mp-hvile')],
      ],
      etter: ['MatPrat skriver at tiden kan variere mellom produsentene, så du bør sjekke med jevne mellomrom for å unngå overstekt biff.'],
    },
    avsnitt: [
      ['Temperer og hvil', h.p(
        `MatPrat ber deg temperere kjøttet i minst ${h.t('mp-temper')} før steking, gni det inn med salt, pepper og olje, og la det hvile i ${h.t('mp-hvile')} før du skjærer det i tynne skiver.`,
        'Oppskriften bruker en entrecôte, og tallene er ikke for tynnere eller tykkere biffer.',
      )],
    ],
    kjerne: KJERNE(h.p(
      `${h.k('mp-biff')} oppgir disse kjernetemperaturene: lite stekt ${h.t('kjerne-lite')}, medium ${h.t('kjerne-medium')}, medium pluss ${h.t('kjerne-pluss')} og gjennomstekt ${h.t('kjerne-gjennom')}.`,
      `${h.k('mt-sommer')} skriver i en tekst om grilling at det ved steking av hele kjøttstykker som biff er nok at overflatene blir godt stekte, fordi bakteriene finnes der.`,
      'Tiden over gjelder én entrecôte, og det er kjernetemperaturen som avgjør hvilken stekegrad du får, ikke klokka.',
    )),
    app: 'Legg biffen i ukemenyen, og la handlelisten ta med tilbehøret.',
    faq: [
      ['Hvor lenge skal biff i airfryeren?', `${h.k('mp-biff')} stekte ${h.t('mp-vekt')} entrecôte på ${h.t('mp-temp')} i ca. ${h.t('mp-tid')}.`],
      ['Hvilken kjernetemperatur har medium stekt biff?', `MatPrat oppgir ${h.t('kjerne-medium')} for medium og ${h.t('kjerne-pluss')} for medium pluss.`],
      ['Hvor lenge skal biffen hvile?', `MatPrat ber deg la den hvile ${h.t('mp-hvile')}.`],
    ],
    les: [L('svinekoteletter', 'Svinekoteletter i airfryer'), L('ribbe', 'Ribbe i airfryer')],
  }),

  ribbe: (h) => ({
    ord: 'ribbe',
    title: 'Ribbe i airfryer: tid og temperatur',
    h1: 'Ribbe i airfryer: tid og temperatur',
    description: `MatPrat steker ${h.t('mp-vekt')} ribbe på ${h.t('mp-temp1')} i ${h.t('mp-tid1')}, og øker så til ${h.t('mp-temp2')} i ${h.t('mp-tid2')} for sprø svor.`,
    lead: 'MatPrat har en oppskrift på ribbe i airfryer. Her står temperaturene og tidene i to trinn, og hva oppskriften sier om forberedelsen.',
    svar: `${h.k('mp-ribbe')} steker ${h.t('mp-vekt')} ribbe på ${h.t('mp-temp1')} i ${h.t('mp-tid1')}, og øker så til ${h.t('mp-temp2')} i ${h.t('mp-tid2')} til svoren har poppet. ${SVAR_ADVARSEL}`,
    tabell: {
      tittel: 'Ribbe i to trinn', intro: `Alle tallene er fra én oppskrift fra MatPrat, for ${h.t('mp-vekt')} ribbe.`,
      kolonner: ['Trinn', 'Temperatur', 'Tid', 'Merknad'],
      rader: [
        ['Forberedelse', 'Ingen', `${h.t('mp-dager')} i kjøleskapet`, `Svoren skjæres, ribba gnis med salt og pepper og dekkes med folie`],
        ['Første trinn', h.t('mp-temp1'), h.t('mp-tid1'), `Svoren opp, ca. ${h.t('mp-vann')} vann i bunnen`],
        ['Andre trinn', h.t('mp-temp2'), h.t('mp-tid2'), 'Til svoren har poppet, følg med'],
      ],
      etter: [`Oppskriften bruker ${h.t('mp-vekt')} ribbe. MatPrat ber deg la ribba hvile litt før servering.`],
    },
    avsnitt: [
      ['Hvorfor to trinn', h.p(
        `Første trinn er lavt og langt, ${h.t('mp-temp1')} i ${h.t('mp-tid1')}, med vann i bunnen av airfryeren. Andre trinn øker temperaturen til ${h.t('mp-temp2')} i ${h.t('mp-tid2')} for at svoren skal poppe. MatPrat skriver at du bør følge med i dette trinnet.`,
        `Tallene gjelder ${h.t('mp-vekt')} ribbe. Oppskriften sier ikke hvordan tiden endres for større stykker, og vi har ikke funnet en kilde som gjør det.`,
      )],
      ['Forberedelsen', h.p(
        `MatPrat skjærer gjennom svoren og litt ned i spekket med en skarp kniv, gnir inn salt og pepper, dekker med aluminiumsfolie og lar ribba stå i kjøleskapet i ${h.t('mp-dager')}. Kjøper du ferdig rutet og krydret ribbe, kan du hoppe over det første steget.`,
      )],
    ],
    kjerne: KJERNE(h.p(`Oppskriften til MatPrat oppgir ingen kjernetemperatur for ribbe. For svinekjøtt som skinkestek oppgir ${h.k('mp-svin')} ${h.t('kjerne')} som gjennomstekt. Vi bruker ikke det tallet for ribbe, men viser til det. Det er kjernetemperaturen som avgjør om ribba er ferdig, ikke klokka.`)),
    app: 'Julemiddagen skal planlegges i god tid. Legg ribba i ukemenyen, og la handlelisten samle alt til middagen.',
    faq: [
      ['Hvor lenge skal ribbe i airfryeren?', `${h.k('mp-ribbe')} steker ribba i ${h.t('mp-tid1')} på ${h.t('mp-temp1')}, så ${h.t('mp-tid2')} på ${h.t('mp-temp2')}.`],
      ['Hvorfor skal det være vann i bunnen?', `Oppskriften fra MatPrat heller ca. ${h.t('mp-vann')} vann i bunnen av airfryeren i første trinn. Den sier ikke hvorfor.`],
      ['Hvor stor ribbe får plass?', `MatPrats oppskrift bruker ${h.t('mp-vekt')}. Hvor mye som får plass i din airfryer, må du sjekke i brukerveiledningen.`],
    ],
    les: [L('svinekoteletter', 'Svinekoteletter i airfryer'), L('biff', 'Biff i airfryer')],
  }),

  egg: (h) => ({
    ord: 'egg',
    title: 'Egg i airfryer: tid og temperatur',
    h1: 'Egg i airfryer: tid og temperatur',
    description: `MatPrat koker egg i airfryer på ${h.t('mp-temp')}: ${h.t('mp-blot')} for bløtkokt, ${h.t('mp-smil')} for smilende og ${h.t('mp-hard')} for hardkokt.`,
    lead: 'MatPrat legger eggene rett i airfryeren og oppgir temperatur og tid for tre stekegrader.',
    svar: `${h.k('mp-egg')} forvarmer airfryeren til ${h.t('mp-temp')}. Så tar eggene ${h.t('mp-blot')} for bløtkokt, ${h.t('mp-smil')} for smilende og ${h.t('mp-hard')} for hardkokt. ${SVAR_ADVARSEL}`,
    tabell: {
      tittel: 'Tid og temperatur for egg', intro: 'Alle tallene er fra én oppskrift fra MatPrat, med fire egg.',
      kolonner: ['Stekegrad', 'Temperatur', 'Tid'],
      rader: [
        ['Bløtkokt', h.t('mp-temp'), h.t('mp-blot')],
        ['Smilende', h.t('mp-temp'), h.t('mp-smil')],
        ['Hardkokt', h.t('mp-temp'), h.t('mp-hard')],
      ],
      etter: [`Oppskriften bruker ${h.t('mp-antall')} egg. Hvor mange som får plass i airfryeren din, kan du lese i brukerveiledningen.`],
    },
    avsnitt: [
      ['Forvarm først', h.p(
        `MatPrat ber deg forvarme airfryeren til ${h.t('mp-temp')} og legge i eggene. Oppskriften nevner ikke vann, og den oppgir ikke om eggene skal kjøles i kaldt vann etterpå.`,
      )],
      ['Størrelse og starttemperatur', h.p(
        'Oppskriften sier ikke hvor store eggene er, eller hvilken temperatur de har når de legges i. Tidene kan derfor ikke leses som sikre.',
      )],
    ],
    app: 'Hardkokte egg er en del av mange matpakker og frokoster. Legg dem inn som en del av ukemenyen.',
    faq: [
      ['Hvor lenge skal egg i airfryeren?', `${h.k('mp-egg')} oppgir ${h.t('mp-blot')} for bløtkokt, ${h.t('mp-smil')} for smilende og ${h.t('mp-hard')} for hardkokt, på ${h.t('mp-temp')}.`],
      ['Må jeg forvarme airfryeren til egg?', `Ja, MatPrat forvarmer airfryeren til ${h.t('mp-temp')} før eggene legges i.`],
      ['Trengs det vann i airfryeren?', 'Oppskriften fra MatPrat nevner ikke vann.'],
    ],
    les: [L('bacon', 'Bacon i airfryer'), L('potetbater', 'Potetbåter i airfryer')],
  }),

  // ---------------------------------------------------------------- frossen mat
  'frossen-mat': (h) => ({
    ord: 'frossen mat',
    title: 'Frossen mat i airfryer: vårruller, kyllingbiter og pommes frites',
    h1: 'Frossen mat i airfryer: vårruller, kyllingbiter og pommes frites',
    description: `Philips oppgir ${h.t('ph-vr-tid')} på ${h.t('ph-vr-temp')} for frosne vårruller og ${h.t('ph-kb-tid')} for kyllingbiter. Findus forvarmer til ${h.t('fi-temp')} for fiskepinner.`,
    lead: 'Frossen mat har ofte egne tider på pakken. Her er tallene fra Philips og Findus, og hvor kildene er uenige om forvarming.',
    svar: `${h.k('ph-hd920')} oppgir ${h.t('ph-vr-tid')} på ${h.t('ph-vr-temp')} for frosne vårruller og kyllingbiter. ${h.k('fi-10')} oppgir ${h.t('fi-temp')} i ca. ${h.t('fi-tid')} for fiskepinner. ${SVAR_ADVARSEL} Følg pakken.`,
    tabell: {
      tittel: 'Tid og temperatur for frossen mat', intro: 'Tre typer frossen mat fra to produsenter. Pakken din går foran.',
      kolonner: ['Hva', 'Kilde', 'Temperatur', 'Tid'],
      rader: [
        ['Frosne vårruller', h.k('ph-hd920'), h.t('ph-vr-temp'), h.t('ph-vr-tid')],
        ['Frosne kyllingbiter', h.k('ph-hd920'), h.t('ph-kb-temp'), h.t('ph-kb-tid')],
        ['Tynn frossen pommes frites', h.k('ph-hd920'), h.t('ph-pommes-temp'), h.t('ph-pommes-tid')],
        ['Fiskepinner, liten pakke', h.k('fi-10'), h.t('fi-temp'), h.t('fi-tid', { ca: true })],
      ],
      etter: [`Philips oppgir ${h.t('ph-vr-mengde')} for både vårruller og kyllingbiter, og ber deg riste, snu eller røre halvveis. Mer om fiskepinner står på siden om fiskepinner, og om pommes frites på siden om pommes frites.`],
    },
    avsnitt: [
      ['Forvarming: kildene er uenige', h.p(
        `Findus ber deg forvarme airfryeren til ${h.t('fi-temp')} før de frosne fiskepinnene legges i. Philips skriver tvert imot at du ikke trenger å forvarme apparatet sitt.`,
        'Vi tar ikke side. Begge påstandene står i produsentenes egne tekster, og du kan lese i brukerveiledningen for din egen airfryer.',
      )],
      ['Tilberedningstiden kan variere', h.p(
        'Findus skriver at tilberedningstiden kan variere, og at du skal sjekke at maten er gjennomvarm før servering. Philips skriver at innstillingene er forslag.',
        'Frossen mat kommer i mange størrelser og med ulik panering. Følg pakken du har kjøpt, hvis den oppgir en tid for airfryer.',
      )],
    ],
    app: 'Frossenmat er en rask hverdagsløsning. Legg den i ukemenyen på dagene du trenger det.',
    faq: [
      ['Må jeg tine frossen mat før airfryeren?', 'Både Findus og Philips oppgir tider for frossen mat uten tining først. Følg pakken du har kjøpt.'],
      ['Må jeg forvarme airfryeren til frossen mat?', `Findus forvarmer til ${h.t('fi-temp')}. Philips skriver at det ikke trengs. Kildene er uenige.`],
      ['Hvor mye frossen mat kan det være i kurven?', `Philips oppgir ${h.t('ph-vr-mengde')} for vårruller og kyllingbiter.`],
    ],
    les: [L('fiskepinner', 'Fiskepinner i airfryer'), L('pommes-frites', 'Pommes frites i airfryer')],
  }),
};

// ---------------------------------------------------------------------------- omregningssiden
/** Omregnertabellen fra Arla: [ovn, airfryer, ovnstid, airfryertid]. Vakten under kaster hvis datafila og regelen ikke stemmer. */
export const OMREGNER_TABELL = [150, 165, 175, 190, 200, 225];

export function kontrollerRegel(h) {
  for (const o of OMREGNER_TABELL) {
    const ovn = Number(h.n(`arla-${o}-ovn-tid`));
    const af = Number(h.n(`arla-${o}-af-tid`));
    if (Math.abs(af - ovn * 0.8) > 1e-9) throw new Error(`omregner: tiden i raden ${o} er ikke en femtedel kortere (${ovn} mot ${af})`);
    if (!(Number(h.n(`arla-${o}-af`)) < o)) throw new Error(`omregner: temperaturen i raden ${o} er ikke lavere i airfryeren`);
  }
}

/** Kalkulatoren: statisk eksempel (en rad fra Arlas tabell) og tabellen som data, så siden virker uten JavaScript og skriptet ikke har egne tall. */
export function kalkulator(h) {
  kontrollerRegel(h);
  const start = 175;
  const rader = OMREGNER_TABELL.map((o) => [Number(h.n(`arla-${o}-ovn`)), Number(h.n(`arla-${o}-af`))]);
  const tider = OMREGNER_TABELL.map((o) => [Number(h.n(`arla-${o}-ovn-tid`)), Number(h.n(`arla-${o}-af-tid`))]);
  const data = { rader, tider, feilTemp: 'Tabellen vi bygger på dekker {min} til {max} °C. Skriv en temperatur innenfor.', feilTid: 'Skriv antall minutter som et tall.', svar: ['I airfryeren: ', '{temp} °C', ' i ', '{tid} minutter', '.'] };
  // Ingen class-attributter: stilen ligger i airfryer-omregner.css og velger på data-attributtene, så side.css ikke trenger nye klasser.
  // JSON-en skrives med linjeskift, så tallene står som egne tall (ikke «150,135», som tallvakten leser som ett desimaltall).
  return `<link rel="stylesheet" href="/airfryer-omregner.css"><script src="/airfryer-omregner.js" defer></script>
<form data-oaf onsubmit="return false" aria-label="Omregner fra ovn med varmluft til airfryer">
  <div data-oaf-rad>
    <label><span>Temperatur i ovnen (varmluft, °C)</span><input data-felt="temp" type="text" inputmode="numeric" autocomplete="off" value="${start}"></label>
    <label><span>Tid i ovnen (minutter)</span><input data-felt="tid" type="text" inputmode="numeric" autocomplete="off" value="${h.n(`arla-${start}-ovn-tid`)}"></label>
  </div>
  <p data-oaf-svar data-felt="svar" role="status" aria-live="polite">I airfryeren: <strong>${h.n(`arla-${start}-af`)} °C</strong> i <strong>${h.n(`arla-${start}-af-tid`)} minutter</strong>.</p>
  <p data-oaf-merk>Veiledende. Regelen er fra ${h.k('ar-airfryer')}, og gjelder varmluftsovn.</p>
  <script type="application/json" data-oaf-data>${JSON.stringify(data, null, 1)}</script>
</form>`;
}

TEKST['ovn-til-airfryer'] = (h) => {
  kontrollerRegel(h);
  const tabellRader = OMREGNER_TABELL.map((o) => [h.t(`arla-${o}-ovn`), h.t(`arla-${o}-af`), h.t(`arla-${o}-ovn-tid`), h.t(`arla-${o}-af-tid`)]);
  const rett = (navn, nokkel) => [navn, `${h.t(`mp-${nokkel}-af-temp`)}, ${h.t(`mp-${nokkel}-af-tid`)}`, `${h.t(`mp-${nokkel}-ov-temp`)}, ${h.t(`mp-${nokkel}-ov-tid`)}`];
  return {
    ord: 'omregning fra ovn',
    title: 'Ovn til airfryer: slik regner du om temperatur og tid',
    h1: 'Ovn til airfryer: slik regner du om temperatur og tid',
    description: `Omregner fra ovn med varmluft til airfryer: lavere temperatur og en femtedel kortere tid, etter tabellen til ${h.k('ar-airfryer')}. Med tall fra MatPrat og Findus til sammenligning.`,
    lead: `Skriv inn temperatur og tid fra ovnsoppskriften, så får du et tall å begynne med i airfryeren. Regelen er en tabell for varmluftsovn fra ${h.k('ar-airfryer')}, og tallene er veiledende.`,
    svar: `Fra ${h.t('arla-175-ovn')} og ${h.t('arla-175-ovn-tid')} i varmluftsovn blir det ${h.t('arla-175-af')} og ${h.t('arla-175-af-tid')} i airfryeren, ifølge ${h.k('ar-airfryer')}. Temperaturen er lavere og tiden en femtedel kortere. Tallene er veiledende.`,
    seksjoner: [
      ['Omregner: temperatur og tid', `${h.p('Skriv inn temperaturen og tiden fra ovnsoppskriften. Svaret er et tall å begynne med, ikke en fasit.')}${kalkulator(h)}`],
      ['Arlas omregningstabell', h.p(
        `${h.k('ar-airfryer')} viser hvordan temperatur og tid kan regnes om fra ovn med varmluft til airfryer. I alle seks radene er temperaturen i airfryeren lavere, og tiden er en femtedel kortere.`,
        'Arla skriver at tabellen bare er en tommelfingerregel, fordi det kommer an på den enkelte ovnen og airfryerens kapasitet og kraft.',
      ) + `<div class="table-wrap" tabindex="0" role="region" aria-label="Arlas omregningstabell"><table class="sprik"><thead><tr><th scope="col">Ovn, varmluft</th><th scope="col">Airfryer</th><th scope="col">Tid i ovn</th><th scope="col">Tid i airfryer</th></tr></thead><tbody>${tabellRader.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`],
      ['Slik regner omregneren', h.p(
        'Omregneren bruker tabellen over. For temperatur finner den raden over og under det du skriver, og regner lineært mellom dem. Den utregningen er vår, ikke Arlas. For tid tar den en femtedel av tiden bort, slik alle seks radene gjør.',
        'Tabellen dekker bare temperaturene i den første og siste raden, og omregneren svarer ikke utenfor dem. Står oppskriften på over- og undervarme, har vi ikke en kilde for hvordan den skal regnes om, så vi gir ikke et tall for det.',
      )],
      ['MatPrat: fem retter, ovn mot airfryer', h.p(
        'MatPrats sammenligningstabell oppgir tid og temperatur for fem retter både i airfryer og i ovn med varmluft. Den viser at regelen fra Arla er et utgangspunkt, ikke en lov. Laks står på samme temperatur i begge, og søtpotetchips har høyere temperatur i airfryeren enn i ovnen.',
      ) + `<div class="table-wrap" tabindex="0" role="region" aria-label="MatPrat: airfryer mot ovn"><table class="sprik"><thead><tr><th scope="col">Rett</th><th scope="col">Airfryer</th><th scope="col">Ovn med varmluft</th></tr></thead><tbody>${[rett('Kyllingvinger', 'vinger'), rett('Potetbåter', 'potetbater'), rett('Laksefilet', 'laks'), rett('Grønnsaker', 'gronnsaker'), rett('Søtpotetchips', 'sotpotet')].map(([a, b, c]) => `<tr><th scope="row">${a}</th><td>${b}</td><td>${c}</td></tr>`).join('')}</tbody></table></div><p><small>Kilde: ${h.k('mp-tilb')}.</small></p>`],
      ['Findus: tre pakker fiskepinner', h.p(
        'Findus oppgir ovnstid og airfryertid for tre pakker fiskepinner. Her er tiden i airfryeren mer enn en femtedel kortere enn i ovnen for alle tre, og temperaturen er lavere.',
      ) + `<div class="table-wrap" tabindex="0" role="region" aria-label="Findus: ovn mot airfryer"><table class="sprik"><thead><tr><th scope="col">Pakke</th><th scope="col">Ovn med varmluft</th><th scope="col">Airfryer</th></tr></thead><tbody><tr><th scope="row">Fiskepinner, liten pakke</th><td>${h.t('fi10-ov-temp')}, ${h.t('fi10-ov-tid', { ca: true })}</td><td>${h.t('fi10-af-temp')}, ${h.t('fi10-af-tid', { ca: true })}</td></tr><tr><th scope="row">Fiskepinner, stor pakke</th><td>${h.t('fi32-ov-temp')}, ${h.t('fi32-ov-tid')}</td><td>${h.t('fi32-af-temp')}, ${h.t('fi32-af-tid', { ca: true })}</td></tr><tr><th scope="row">Fish &amp; Crisp</th><td>${h.t('fifc-ov-temp')}, ${h.t('fifc-ov-tid')}</td><td>${h.t('fifc-af-temp')}, ${h.t('fifc-af-tid')}</td></tr></tbody></table></div><p><small>Kilde: Findus (2026), produktsidene for de tre pakkene.</small></p>`],
      ['Kjøtt og fisk: kjernetemperaturen avgjør', h.p(
        'Tider fra en omregning er bare et sted å begynne å sjekke. For kylling, kjøtt og fisk er det kjernetemperaturen som avgjør om maten er ferdig, ikke klokka. Kjernetemperaturene fra MatPrat står på <a href="/airfryer/#kjernetemperatur">samlesiden for airfryer</a>.',
      )],
    ],
    app: 'Har du en ovnsoppskrift du vil lage i airfryeren? Lagre den i Matlyst, og legg den på dagen du skal lage den.',
    faq: [
      ['Hvor mye lavere skal temperaturen være i airfryeren?', `${h.k('ar-airfryer')} har seks rader for varmluftsovn. Fra ${h.t('arla-150-ovn')} i ovn blir det ${h.t('arla-150-af')} i airfryeren, og fra ${h.t('arla-225-ovn')} blir det ${h.t('arla-225-af')}. Forskjellen er ikke lik i alle radene.`],
      ['Hvor mye kortere skal tiden være?', `En femtedel kortere i alle seks radene hos Arla. Raden ${h.t('arla-175-ovn')} i ovn og ${h.t('arla-175-ovn-tid')} blir ${h.t('arla-175-af')} og ${h.t('arla-175-af-tid')} i airfryeren.`],
      ['Gjelder omregningen også over- og undervarme?', 'Arlas tabell er for varmluftsovn. Vi har ikke en kilde for over- og undervarme, så omregneren gir ikke et tall for det.'],
      ['Må jeg forvarme airfryeren?', `Kildene er uenige. ${h.k('fi-10')} forvarmer fiskepinnene, mens ${h.k('ph-hd920')} skriver at du ikke trenger å forvarme. Les mer på samlesiden for airfryer.`],
    ],
    les: [['/blogg/ovnsoppskrift-i-airfryer/', 'Ovnsoppskrift i airfryer: slik regner du om tid og temperatur'], L('fiskepinner', 'Fiskepinner i airfryer'), L('potetbater', 'Potetbåter i airfryer')],
  };
};

// ---------------------------------------------------------------------------- kjernetemperatur (samleside)
export const KJERNE_NAV = (hf, rader) => {
  const r = (id) => hf(rader.find((x) => x.id === id));
  const kylling = r('kyllingfilet');
  const burger = r('hamburger');
  const biff = r('biff');
  const svin = r('svinekoteletter');
  const fisk = r('laks');
  return [
    ['Fjørfe, hamburgere, pølser og rå kjøttfarse', kylling.k('mt-sommer'), `minimum ${kylling.t('mt-kjerne')}`, 'Slik definerer Mattilsynet gjennomstekt, i en tekst om grilling'],
    ['Kylling', kylling.k('mp-kylling'), kylling.t('kjerne'), 'Gjennomstekt'],
    ['Hamburger', burger.k('mp-burger'), burger.t('kjerne'), 'Tilstrekkelig for å drepe bakterier i hamburgerkjøttet'],
    ['Biff, lite stekt', biff.k('mp-biff'), biff.t('kjerne-lite'), 'Lite stekt'],
    ['Biff, medium', biff.k('mp-biff'), biff.t('kjerne-medium'), 'Medium'],
    ['Biff, medium pluss', biff.k('mp-biff'), biff.t('kjerne-pluss'), 'Medium pluss'],
    ['Biff, gjennomstekt', biff.k('mp-biff'), biff.t('kjerne-gjennom'), 'Gjennomstekt'],
    ['Svinekjøtt, stek og filet', svin.k('mp-svin'), svin.t('kjerne'), 'Gjennomstekt'],
    ['Fisk, filet i ovn', fisk.k('mp-fisk'), `ca. ${fisk.t('kjerne')}`, 'Lavere om du ønsker en rå kjerne'],
  ];
};

// ---------------------------------------------------------------------------- samleside
export function NAV({ rader, h, sti, tabell, p, esc }) {
  const hf = (rad) => h(rad);
  const rad = (id) => rader.find((x) => x.id === id);
  const t = (id) => h(rad(id));
  const lenke = (id, navn) => `<a href="${sti(rad(id))}">${esc(navn)}</a>`;
  const kf = t('kyllingfilet'); const kl = t('kyllinglar'); const kv = t('kyllingvinger'); const la = t('laks'); const to = t('torsk');
  const pf = t('pommes-frites'); const pb = t('potetbater'); const ba = t('bacon'); const po = t('polser'); const hb = t('hamburger');
  const kb = t('kjottboller'); const gr = t('gronnsaker'); const sk = t('svinekoteletter'); const fm = t('frossen-mat'); const fp = t('fiskepinner');
  const eg = t('egg'); const bi = t('biff'); const ri = t('ribbe');
  const ovn = t('ovn-til-airfryer');
  const hurtig = [
    [lenke('kyllingfilet', 'Kyllingfilet'), kf.k('mp-kyllingfilet'), kf.t('mp-temp'), `${kf.t('mp-tid')} på hver side`],
    [lenke('kyllinglar', 'Kyllinglår'), kl.k('mp-kyllinglar'), kl.t('mp-temp'), kl.t('mp-tid')],
    [lenke('kyllingvinger', 'Kyllingvinger'), kv.k('godt-vinger'), kv.t('godt-temp'), `${kv.t('godt-tid')}, snu, ${kv.t('godt-tid2')}`],
    [lenke('laks', 'Laks'), la.k('mp-laks'), la.t('mp-temp'), la.t('mp-tid')],
    [lenke('torsk', 'Torsk (panert)'), to.k('le-torsk'), to.t('le-temp'), to.t('le-tid')],
    [lenke('pommes-frites', 'Pommes frites (frossen, tynn)'), pf.k('ph-hd920'), pf.t('ph-tynn-temp'), pf.t('ph-tynn-tid')],
    [lenke('potetbater', 'Potetbåter'), pb.k('mp-potetbater'), pb.t('mp-temp'), pb.t('mp-tid')],
    [lenke('bacon', 'Bacon'), ba.k('mp-bacon'), ba.t('mp-temp'), ba.t('mp-tid')],
    [lenke('polser', 'Pølser (grillpølser, hel pakke)'), po.k('gi-polser'), po.t('gi-hel-temp'), po.t('gi-hel-tid')],
    [lenke('hamburger', 'Hamburger'), hb.k('ph-hd920'), hb.t('ph-temp'), hb.t('ph-tid')],
    [lenke('kjottboller', 'Kjøttboller (ferdige)'), kb.k('gi-kjottboller'), kb.t('gi-ferdig-temp'), kb.t('gi-ferdig-tid', { ca: true })],
    [lenke('gronnsaker', 'Grønnsaker'), gr.k('mp-tilb'), gr.t('mpt-af-temp'), gr.t('mpt-af-tid')],
    [lenke('svinekoteletter', 'Svinekoteletter (uten ben)'), sk.k('ph-hd920'), sk.t('ph-temp'), sk.t('ph-tid')],
    [lenke('fiskepinner', 'Fiskepinner (frosne)'), fp.k('fi-10'), fp.t('fi10-temp'), fp.t('fi10-tid', { ca: true })],
    [lenke('frossen-mat', 'Frosne vårruller'), fm.k('ph-hd920'), fm.t('ph-vr-temp'), fm.t('ph-vr-tid')],
    [lenke('egg', 'Egg (hardkokt)'), eg.k('mp-egg'), eg.t('mp-temp'), eg.t('mp-hard')],
    [lenke('biff', 'Biff (entrecôte)'), bi.k('mp-biff'), bi.t('mp-temp'), bi.t('mp-tid', { ca: true })],
    [lenke('ribbe', 'Ribbe'), ri.k('mp-ribbe'), `${ri.t('mp-temp1')}, så ${ri.t('mp-temp2')}`, `${ri.t('mp-tid1')}, så ${ri.t('mp-tid2')}`],
  ];
  const kjerneRader = KJERNE_NAV(hf, rader);
  const forvarm = [
    ['Philips', 'Du trenger ikke å forvarme apparatet.', fm.k('ph-hd920')],
    [`Findus, fiskepinner`, `Forvarm airfryeren til ${fm.t('fi-temp')}.`, fm.k('fi-10')],
    ['MatPrat, egg', `Forvarm airfryeren til ${eg.t('mp-temp')}.`, eg.k('mp-egg')],
    ['MatPrat, kyllinglår', `Forvarm airfryeren til ${kl.t('mp-temp')} i noen minutter.`, kl.k('mp-kyllinglar')],
  ];
  return {
    title: 'Airfryer: tid og temperatur for vanlig mat',
    description: `Tid og temperatur i airfryer for kylling, laks, pommes frites, bacon og mer, med kilde og år. Omregner fra ovn, kjernetemperaturer og to kilder side om side der de er uenige.`,
    h1: 'Airfryer: tid og temperatur, og omregner fra ovn',
    lead: 'Tider og temperaturer for vanlig mat i airfryer, hentet fra navngitte kilder med år. Der kildene er uenige, står begge. Alt er veiledende.',
    svar: `Velg råvaren i tabellen for tid og temperatur med kilde og år, eller regn om fra ovn til airfryer med omregneren under. Der kildene er uenige, står begge. Alt er veiledende, og kjernetemperaturen avgjør for kjøtt, kylling og fisk.`,
    seksjoner: [
      ['Omregner: temperatur og tid', `${p('Skriv inn temperaturen og tiden fra ovnsoppskriften, så får du et tall å begynne med i airfryeren.')}${kalkulator(ovn)}`],
      ['Tid og temperatur for vanlig mat', `${p('Hver rad viser én kilde. Trykk på matvaren for å se alle kildene vi har brukt, med hva de gjelder. Tallene er veiledende, og de varierer med airfryer, mengde og tykkelse.')}${tabell('Tid og temperatur for vanlig mat', ['Matvare', 'Kilde', 'Temperatur', 'Tid'], hurtig)}`],
      ['Ovn til airfryer', `${p(`Omregneren øverst bruker tabellen til ${ovn.k('ar-airfryer')} for varmluftsovn. Lavere temperatur og en femtedel kortere tid er utgangspunktet. Tabellen er en tommelfingerregel, og MatPrats egne tall for fem retter viser at ikke alt følger den.`)}${p(`Se hele tabellen, og tallene fra MatPrat og Findus, på ${lenke('ovn-til-airfryer', 'siden om ovn til airfryer')}.`)}`],
      ['Forvarming: kildene er uenige', `${p('Noen sier at du bør forvarme airfryeren, og noen at du ikke trenger det. Her er det de sier, hver for seg.')}${tabell('Hva kildene sier om forvarming', ['Kilde', 'Hva de skriver', 'Referanse'], forvarm)}${p('Vi tar ikke side. Les i brukerveiledningen for din egen airfryer.')}`],
      ['Kjernetemperatur', `${p('For kylling, kjøtt og fisk er det kjernetemperaturen som avgjør om maten er ferdig, ikke klokka. Tidene på sidene våre er veiledende og sier bare hvor du kan begynne å sjekke. Dette er kjernetemperaturene vi har funnet hos Mattilsynet og MatPrat:')}${tabell('Kjernetemperaturer fra Mattilsynet og MatPrat', ['Hva', 'Kilde', 'Kjernetemperatur', 'Merknad'], kjerneRader)}${p(`Mattilsynet og MatPrat er ikke helt enige om hamburger: Mattilsynet oppgir minimum ${hb.t('mt-kjerne')} som gjennomstekt, og MatPrat oppgir ${hb.t('kjerne')} som tilstrekkelig. Vi viser begge. Vi har ikke funnet kjernetemperatur for bacon, og oppgir derfor ingen. Du kan lese mer i artikkelen <a href="/blogg/kjernetemperatur/">kjernetemperatur for lam, storfe, svin og kylling</a>.`)}`],
      ['Slik leser du tidene', p(
        `${t('hamburger').k('ph-hd920')} skriver at innstillingene er forslag, og at de ikke kan garantere at de passer maten din. MatPrat skriver at steketid kan variere mellom produsentene, og ber deg sjekke med jevne mellomrom for å unngå at maten blir svidd eller underkokt.`,
        'Philips ber deg riste, snu eller røre i ingrediensene i større mengder mat, som pommes frites og frosne snacks. Gilde anbefaler å steke pølser i ett lag, og Philips ber deg ikke overstige mengdene i tabellen sin.',
      )],
    ],
    app: 'Matlyst lagrer oppskriftene dine fra nettet. Legg dem på dagene i ukemenyen, og la handlelisten samle varene.',
    kilderTekst: 'Alle tall på siden er hentet fra disse kildene. Sitatet bak hvert tall ligger i datafilen vi bygger sidene fra, og blir kontrollert mot kilden.',
    faqTittel: 'Spørsmål om airfryer',
    faq: [
      ['Hvor lenge skal kylling i airfryeren?', `Det avhenger av delen. ${kf.k('mp-kyllingfilet')} stekte kyllingfilet i ${kf.t('mp-tid')} på hver side ved ${kf.t('mp-temp')}, mens ${kf.k('ph-hd920')} oppgir ${kf.t('ph-tid')} ved ${kf.t('ph-temp')}. Se siden om kyllingfilet for begge.`],
      ['Må jeg forvarme airfryeren?', 'Kildene er uenige. Findus forvarmer til frosne fiskepinner, mens Philips skriver at du ikke trenger å forvarme apparatet sitt.'],
      ['Hvordan regner jeg om fra ovn til airfryer?', `${ovn.k('ar-airfryer')} har en tabell for varmluftsovn med lavere temperatur og en femtedel kortere tid. Omregneren øverst på siden bruker den.`],
      ['Hvilken kjernetemperatur har kylling?', `${kf.k('mt-sommer')} oppgir minimum ${kf.t('mt-kjerne')} i kjernen for gjennomstekt fjørfekjøtt, og ${kf.k('mp-kylling')} oppgir ${kf.t('kjerne')} for kyllingfilet. Det er kjernetemperaturen som avgjør, ikke klokka.`],
    ],
  };
}

