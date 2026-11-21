// Text för familjen «airfryer» (sv): tid och temperatur per vara. Varje mening återger vad en namngiven källa säger.
// Siffror skrivs aldrig här: h.t(fält) läser dem ur data.sv.json, och h.s(id) ger en hel mening ur källan, ordagrant.
// Källor: Arla (receptsidorna «... i airfryer» och artikeln om airfryer), Findus (produktsida), OBH Nordica (köpguide) och Svensk Fågel (innertemperatur kyckling).
// Tiderna gäller de recept och produkter källan beskriver och är veiledande: modell, mängd och bitarnas storlek ändrar dem. Inga egna råd om mattrygghet.
// Undvik orden laga, steg, ugn, timer, plan, vecka, meny, köp, spara, recept, hitta i h2: scripts/app-bevis.mjs kopplar dem till appkort.

const A = '/sv/airfryer/';
const T = '/sv/tillagningstid/';
const L = (slug, text) => [`${A}${slug}/`, text];
const VEILEDENDE = 'Tiderna är veiledande: modell, mängd och bitarnas storlek ändrar dem.';

export const TEKST = {
  'ovn-til-airfryer': (h) => ({
    ord: 'airfryer',
    title: 'Ugn till airfryer: temperatur och tid',
    h1: 'Ugn till airfryer: så ändrar du temperatur och tid',
    description: `Arla (2026) och OBH Nordica (2026) säger att du kan sänka ugnens temperatur med ${h.t('sank-arla')}. Arlas omvandlingstabell visar tid och temperatur för fem steg.`,
    lead: `Arla säger att du kan sänka temperaturen på ugnsrecept med ${h.t('sank-arla')} i airfryern. OBH Nordica säger samma sak. Arla har också en tabell som visar tiden.`,
    kilder: [
      `Om temperaturen: ${h.k('arlaart')} anger att man kan sänka temperaturen på ugnsrecept med ${h.t('sank-arla')}, och ${h.k('obh')} anger cirka ${h.t('sank-obh')}.`,
      `Om skälet: ${h.s('intensiv')}`,
      `Om små bitar: ${h.s('smabitar')}`,
      `Om stora bitar: ${h.s('storbitar')}`,
      `Om förvärmning: ${h.k('arlaart')} föreslår ${h.t('forvarm')} förvärmning.`,
      `Om vad som passar sämre: ${h.s('steka')} ${h.s('ost')}`,
    ],
    tabell: {
      tittel: 'Arlas omvandlingstabell', kilde: 'arlaart', intro: 'Tabellen är Arlas. Läs raden där ugnens temperatur är närmast ditt recept.',
      kolonner: ['Ugn', 'Airfryer', 'Tid i ugn', 'Tid i airfryer'],
      rader: [150, 165, 175, 190, 205].map((a) => [h.t(`u${a}-ugn`), `u${a}-air`, `u${a}-minugn`, `u${a}-minair`]),
      etter: ['Arlas tabell har en sista rad som vi inte tar med, eftersom tiderna där inte hänger ihop med raderna ovanför.'],
    },
    faq: [
      ['Hur ändrar man temperaturen från ugn till airfryer?', `${h.k('arlaart')} säger att du kan sänka temperaturen på ugnsrecept med ${h.t('sank-arla')}. ${h.k('obh')} anger cirka ${h.t('sank-obh')}.`],
      ['Hur ändrar man tiden?', `Arlas tabell visar till exempel ${h.t('u175-minugn')} i ugn på ${h.t('u175-ugn')} som ${h.t('u175-minair')} i airfryer på ${h.t('u175-air')}.`],
      ['Ska man förvärma airfryern?', `${h.k('arlaart')} föreslår ${h.t('forvarm')}.`],
    ],
    soster: [`${A}kycklingfile/`, 'Kycklingfilé i airfryer'],
    andre: [[T, 'Tillagningstider i vanlig ugn']],
  }),

  kyllingfilet: (h) => ({
    ord: 'kycklingfilé',
    title: 'Kycklingfilé i airfryer: tid och temperatur',
    h1: 'Kycklingfilé i airfryer: tid och temperatur',
    description: `OBH Nordica (2026): kycklingfilé blir saftig efter ${h.t('obh-tid')} vid ${h.t('obh-temp')}. Arla (2026): ${h.t('arla-tid')} vid ${h.t('arla-temp')}. Innertemperatur ${h.t('sf-filet')} enligt Svensk Fågel.`,
    lead: `OBH Nordica anger ${h.t('obh-temp')} och ${h.t('obh-tid')} för kycklingfilé. Arla anger ${h.t('arla-temp')} i cirka ${h.t('arla-tid')} för kycklinglårfilé. ${VEILEDENDE}`,
    kilder: [
      `Om att vända: ${h.s('vanda')}`,
      `Om airfryer och ugn: ${h.s('vs-ugn')} ${h.s('saftig')}`,
      `Om innertemperaturen: ${h.k('akyckling')} anger minst ${h.t('arla-klar')}, och ${h.k('sfsakra')} anger ${h.t('sf-filet')} för kycklingfilé och lårfilé.`,
    ],
    tabell: {
      tittel: 'Kycklingfilé enligt två källor', kilde: 'obh', intro: 'Källorna beskriver olika bitar.',
      kolonner: ['Källa', 'Bit', 'Temperatur', 'Tid'],
      rader: [['OBH Nordica (2026)', { tekst: 'Kycklingfilé' }, 'obh-temp', 'obh-tid'], ['Arla (2026)', { tekst: `Kycklinglårfilé, ${h.t('arla-gram')}` }, 'arla-temp', { tekst: `cirka ${h.t('arla-tid')}` }]],
    },
    faq: [
      ['Hur länge ska kycklingfilé vara i airfryer?', `${h.k('obh')} anger ${h.t('obh-tid')} vid ${h.t('obh-temp')}.`],
      ['Vilken temperatur ska kycklingfilé ha i airfryer?', `${h.k('obh')} anger ${h.t('obh-temp')}, och ${h.k('akyckling')} anger ${h.t('arla-temp')}.`],
      ['Vilken innertemperatur ska kycklingfilé ha?', `${h.k('sfsakra')} anger ${h.t('sf-filet')}. ${h.k('akyckling')} anger minst ${h.t('arla-klar')}.`],
    ],
    soster: [`${A}kycklingben/`, 'Kycklingben och kycklingklubbor i airfryer'],
    andre: [[`${T}kycklingfile/`, 'Kycklingfilé i stekpanna och ugn'], [`/sv/innertemperatur/kyckling/`, 'Innertemperatur kyckling']],
  }),

  kyllinglar: (h) => ({
    ord: 'kycklingben',
    title: 'Kycklingben och kycklingklubbor i airfryer: tid och temperatur',
    h1: 'Kycklingben och kycklingklubbor i airfryer',
    description: `Arla (2026): kycklingklubbor ${h.t('klubb-tid')} vid ${h.t('klubb-temp')}, kycklingben cirka ${h.t('ben-tid')} vid ${h.t('ben-temp')}. Innertemperatur vid benet ${h.t('ben-klar')}.`,
    lead: `Arla anger ${h.t('klubb-tid')} vid ${h.t('klubb-temp')} för kycklingklubbor och cirka ${h.t('ben-tid')} vid ${h.t('ben-temp')} för kycklingben. Innertemperaturen vid benet ska vara ${h.t('ben-klar')}. ${VEILEDENDE}`,
    kilder: [
      `Om att vända: ${h.s('vs-ugn')}`,
      `Om innertemperaturen: ${h.k('aklubbor')} och ${h.k('aben')} anger båda ${h.t('klubb-klar')} vid benet. ${h.k('obh')} anger ${h.t('obh-klubb-klar')} för kycklingklubbor efter ${h.t('obh-klubb')}.`,
      `Om att vända: ${h.k('aben')} föreslår att kycklingen vänds ${h.t('vanda')} eller fler under tillagningen så att den inte bränns.`,
    ],
    tabell: {
      tittel: 'Kycklingben och kycklingklubbor', kilde: 'aklubbor', intro: 'Källorna anger olika temperatur för olika bitar.',
      kolonner: ['Källa och bit', 'Temperatur', 'Tid', 'Innertemperatur'],
      rader: [['Arla (2026), kycklingklubbor', 'klubb-temp', 'klubb-tid', 'klubb-klar'], ['Arla (2026), kycklingben', 'ben-temp', { tekst: `cirka ${h.t('ben-tid')}` }, 'ben-klar'], ['OBH Nordica (2026), kycklingklubbor', null, 'obh-klubb', 'obh-klubb-klar']],
    },
    faq: [
      ['Hur länge ska kycklingklubbor vara i airfryer?', `${h.k('aklubbor')} anger ${h.t('klubb-tid')} vid ${h.t('klubb-temp')}.`],
      ['Hur länge ska kycklingben vara i airfryer?', `${h.k('aben')} anger cirka ${h.t('ben-tid')} vid ${h.t('ben-temp')}.`],
      ['Vilken innertemperatur ska kycklingen ha?', `${h.k('aklubbor')} anger ${h.t('klubb-klar')} vid benet, och ${h.k('obh')} anger ${h.t('obh-klubb-klar')}.`],
    ],
    soster: [`${A}kycklingvingar/`, 'Kycklingvingar i airfryer'],
    andre: [L('hel-kyckling', 'Hel kyckling i airfryer'), [`${T}hel-kyckling/`, 'Hel kyckling i ugn']],
  }),

  kyllingvinger: (h) => ({
    ord: 'kycklingvingar',
    title: 'Kycklingvingar i airfryer: tid och temperatur',
    h1: 'Kycklingvingar i airfryer: tid och temperatur',
    description: `Arla (2026): kycklingvingar ${h.t('ving-tid')} vid ${h.t('ving-temp')}, och skaka korgen ${h.t('ving-skaka')} under tiden. Kycklingspett ${h.t('spett-temp')} i ${h.t('spett-tid')} per sida.`,
    lead: `Arla anger ${h.t('ving-temp')} i ${h.t('ving-tid')} för kycklingvingar, och att korgen skakas ${h.t('ving-skaka')} under tiden. Kycklingspett tillagas på ${h.t('spett-temp')}. ${VEILEDENDE}`,
    kilder: [
      `Om marinering: ${h.s('vs-ugn')}`,
      `Om vingarna: ${h.k('avingar')} föreslår att vingarna får stå ${h.t('ving-marin')} i kylen i marinaden för extra smak.`,
      `Om spett: ${h.k('aspett')} anger ${h.t('spett-temp')} i ${h.t('spett-tid')}, och sedan ytterligare ${h.t('spett-extra')} efter att spetten vänts. Träspetten blötläggs i minst ${h.t('spett-blot')}.`,
    ],
    tabell: {
      tittel: 'Kycklingvingar och kycklingspett', kilde: 'avingar', intro: 'Båda är Arlas receptsidor.',
      kolonner: ['Vara', 'Temperatur', 'Tid'],
      rader: [['Kycklingvingar', 'ving-temp', 'ving-tid'], ['Kycklingspett', 'spett-temp', { tekst: `${h.t('spett-tid')}, vänd, sedan ${h.t('spett-extra')}` }]],
    },
    faq: [
      ['Hur länge ska kycklingvingar vara i airfryer?', `${h.k('avingar')} anger ${h.t('ving-tid')} vid ${h.t('ving-temp')}.`],
      ['Hur länge ska kycklingspett vara i airfryer?', `${h.k('aspett')} anger ${h.t('spett-temp')} i ${h.t('spett-tid')}, och sedan ytterligare ${h.t('spett-extra')} efter att spetten vänts.`],
    ],
    soster: [`${A}kycklingben/`, 'Kycklingben och kycklingklubbor i airfryer'],
    andre: [L('kycklingfile', 'Kycklingfilé i airfryer')],
  }),

  'hel-kylling': (h) => ({
    ord: 'hel kyckling',
    title: 'Hel kyckling i airfryer: tid och temperatur',
    h1: 'Hel kyckling i airfryer: tid och temperatur',
    description: `Arla (2026): hel kyckling i airfryer ${h.t('temp')} i ${h.t('tid1')}, vänd, och sedan ytterligare ${h.t('tid2')}. Innertemperatur ${h.t('klar')} vid lårbenet.`,
    lead: `Arla anger ${h.t('temp')} i ${h.t('tid1')} med bröstsidan nedåt. Sedan vänds kycklingen och tillagas ytterligare ${h.t('tid2')}. Innertemperaturen ska vara ${h.t('klar')} vid lårbenet. ${VEILEDENDE}`,
    kilder: [
      `Om hur den ligger: ${h.s('riktning')}`,
      `Om vilan: ${h.k('ahel')} anger att kycklingen ska stå ${h.t('vila')} innan den skärs upp.`,
      `Om innertemperaturen: ${h.k('sfsakra')} anger ${h.t('sf-hel')} intill benet för hel kyckling.`,
    ],
    tabell: {
      tittel: 'Hel kyckling enligt Arla', kilde: 'ahel', intro: 'Receptet vänder kycklingen efter första omgången.',
      kolonner: ['Moment', 'Tid och temperatur'],
      rader: [['Första omgången, bröstsidan nedåt', { tekst: `${h.t('tid1')} vid ${h.t('temp')}` }], ['Efter vändning', { tekst: `ytterligare ${h.t('tid2')}` }], ['Innertemperatur vid lårbenet', 'klar'], ['Vila innan den skärs upp', 'vila']],
    },
    faq: [
      ['Hur länge ska en hel kyckling vara i airfryer?', `${h.k('ahel')} anger ${h.t('tid1')} vid ${h.t('temp')}, och sedan ytterligare ${h.t('tid2')} efter att kycklingen vänts.`],
      ['Vilken innertemperatur ska hel kyckling ha?', `${h.k('ahel')} anger ${h.t('klar')} vid lårbenet, och ${h.k('sfsakra')} anger ${h.t('sf-hel')} intill benet.`],
    ],
    soster: [`${T}hel-kyckling/`, 'Hel kyckling i ugn'],
    andre: [L('kycklingben', 'Kycklingben och kycklingklubbor i airfryer')],
  }),

  laks: (h) => ({
    ord: 'lax',
    title: 'Lax i airfryer: tid och temperatur',
    h1: 'Lax i airfryer: tid och temperatur',
    description: `Arla (2026): lax i airfryer ${h.t('temp')} i cirka ${h.t('tid')}, innertemperatur ${h.t('klar')}. Torsk ${h.t('t-tid')} vid samma temperatur.`,
    lead: `Arla anger ${h.t('temp')} i cirka ${h.t('tid')} för lax i airfryer. Termometern ska visa mellan ${h.t('klar')}. Torsk tillagas på samma temperatur, men tar ${h.t('t-tid')}. ${VEILEDENDE}`,
    kilder: [
      `Om när den är klar: ${h.s('flagor')}`,
      `Om frusen lax: ${h.s('fryst')}`,
      `Om att torka av: ${h.s('torka')}`,
      `Om saftig lax: ${h.k('alax')} anger att laxen blir saftig när den tillagas på ${h.t('saftig')} och inte högre.`,
    ],
    tabell: {
      tittel: 'Lax och torsk enligt Arla', kilde: 'alax', intro: 'Båda är Arlas receptsidor.',
      kolonner: ['Fisk', 'Temperatur', 'Tid', 'Innertemperatur'],
      rader: [['Lax', 'temp', { tekst: `cirka ${h.t('tid')}` }, 'klar'], ['Torsk', 't-temp', 't-tid', 't-klar']],
    },
    faq: [
      ['Hur länge ska lax vara i airfryer?', `${h.k('alax')} anger cirka ${h.t('tid')} vid ${h.t('temp')}.`],
      ['Vilken innertemperatur ska lax ha?', `${h.k('alax')} anger att termometern ska visa mellan ${h.t('klar')}.`],
      ['Kan man tillaga fryst lax i airfryer?', `${h.s('fryst')}`],
    ],
    soster: [`${T}lax-i-ugn/`, 'Lax i ugn: tid och temperatur'],
    andre: [L('fiskpinnar', 'Fiskpinnar i airfryer')],
  }),

  'pommes-frites': (h) => ({
    ord: 'pommes frites',
    title: 'Pommes frites i airfryer: tid och temperatur',
    h1: 'Pommes frites i airfryer: tid och temperatur',
    description: `Arla (2026): hemgjorda pommes frites i airfryer ${h.t('temp')} i cirka ${h.t('tid')}, av potatisstavar på ${h.t('tjock')}. Så blir de krispiga enligt Arla.`,
    lead: `Arla anger ${h.t('temp')} i cirka ${h.t('tid')} för pommes frites av potatis, skuren i stavar på ${h.t('tjock')}. Siffrorna gäller färsk potatis, inte frysta pommes frites. ${VEILEDENDE}`,
    kilder: [
      `Om torkning: ${h.s('torr')}`,
      `Om korgen: ${h.s('omg')}`,
      `Om sorten: ${h.s('sort')}`,
      `Om skakning: ${h.s('skaka')}`,
      `Om olja: ${h.k('apommes')} anger att du inte behöver olja, men att ${h.t('olja')} olja kan ge ett krispigare resultat.`,
    ],
    tabell: {
      tittel: 'Pommes frites enligt Arla', kilde: 'apommes', intro: 'Receptet utgår från färsk potatis.',
      kolonner: ['Moment', 'Siffra'], rader: [['Tjocklek på stavarna', 'tjock'], ['Temperatur', 'temp'], ['Tid', 'tid']],
    },
    faq: [
      ['Hur länge ska pommes frites vara i airfryer?', `${h.k('apommes')} anger cirka ${h.t('tid')} vid ${h.t('temp')} för hemgjorda pommes frites.`],
      ['Hur blir pommes frites krispiga i airfryer?', `${h.s('torr')}`],
      ['Behöver man olja?', `${h.k('apommes')} anger att du inte behöver olja, men att ${h.t('olja')} olja kan ge ett krispigare resultat.`],
    ],
    soster: [`${A}klyftpotatis/`, 'Klyftpotatis, hasselbackspotatis och sötpotatis i airfryer'],
    andre: [L('bakad-potatis', 'Bakad potatis i airfryer')],
  }),

  potetbater: (h) => ({
    ord: 'klyftpotatis',
    title: 'Klyftpotatis, hasselbackspotatis och sötpotatis i airfryer',
    h1: 'Klyftpotatis, hasselbackspotatis och sötpotatis i airfryer',
    description: `Arla (2026): klyftpotatis ${h.t('k-temp')} i cirka ${h.t('k-tid')}, hasselbackspotatis ${h.t('h-temp')} i cirka ${h.t('h-tid')}, sötpotatis ${h.t('s-temp')} i cirka ${h.t('s-tid')}.`,
    lead: `Arla anger ${h.t('k-temp')} i cirka ${h.t('k-tid')} för klyftpotatis, ${h.t('h-temp')} för hasselbackspotatis och ${h.t('s-temp')} för sötpotatis. ${VEILEDENDE}`,
    kilder: [
      `Om sorten: ${h.s('sort')}`,
      `Om krispigare klyftor: ${h.s('krispig')}`,
      `Om högre värme: ${h.k('aklyft')} föreslår att temperaturen kan höjas till ${h.t('k-hojd')} för klyftpotatis.`,
    ],
    tabell: {
      tittel: 'Tre potatisrätter enligt Arla', kilde: 'aklyft', intro: 'Alla tre är Arlas receptsidor.',
      kolonner: ['Potatis', 'Temperatur', 'Tid'],
      rader: [['Klyftpotatis', 'k-temp', { tekst: `cirka ${h.t('k-tid')}` }], ['Hasselbackspotatis', 'h-temp', { tekst: `cirka ${h.t('h-tid')}` }], ['Sötpotatis i stavar', 's-temp', { tekst: `cirka ${h.t('s-tid')}` }]],
    },
    faq: [
      ['Hur länge ska klyftpotatis vara i airfryer?', `${h.k('aklyft')} anger cirka ${h.t('k-tid')} vid ${h.t('k-temp')}, eller tills potatisen är klar.`],
      ['Hur länge ska hasselbackspotatis vara i airfryer?', `${h.k('ahassel')} anger cirka ${h.t('h-tid')} vid ${h.t('h-temp')}.`],
      ['Hur länge ska sötpotatis vara i airfryer?', `${h.k('asot')} anger cirka ${h.t('s-tid')} vid ${h.t('s-temp')}.`],
    ],
    soster: [`${A}pommes-frites/`, 'Pommes frites i airfryer'],
    andre: [L('bakad-potatis', 'Bakad potatis i airfryer'), [`${T}koka-potatis/`, 'Koka potatis: hur länge?']],
  }),

  'bakt-potet': (h) => ({
    ord: 'bakad potatis',
    title: 'Bakad potatis i airfryer: tid och temperatur',
    h1: 'Bakad potatis i airfryer: tid och temperatur',
    description: `Arla (2026): bakad potatis i airfryer ${h.t('temp')} i cirka ${h.t('tid')}, och vänd potatisen efter halva tiden.`,
    lead: `Arla anger ${h.t('temp')} i cirka ${h.t('tid')} för bakad potatis i airfryer. Potatisen vänds efter halva tiden. ${VEILEDENDE}`,
    kilder: [`Om förberedelsen: ${h.s('tvatta')} ${h.s('hal')}`, `Om att vända: ${h.s('vanda')}`],
    tabell: { tittel: 'Bakad potatis enligt Arla', kilde: 'abakad', intro: 'Arlas recept.', kolonner: ['Moment', 'Siffra'], rader: [['Temperatur', 'temp'], ['Tid', 'tid']] },
    faq: [
      ['Hur länge ska bakad potatis vara i airfryer?', `${h.k('abakad')} anger cirka ${h.t('tid')} vid ${h.t('temp')}.`],
      ['Ska man vända potatisen?', `${h.s('vanda')}`],
    ],
    soster: [`${A}klyftpotatis/`, 'Klyftpotatis, hasselbackspotatis och sötpotatis i airfryer'],
    andre: [L('pommes-frites', 'Pommes frites i airfryer')],
  }),

  bacon: (h) => ({
    ord: 'bacon',
    title: 'Bacon i airfryer: tid och temperatur',
    h1: 'Bacon i airfryer: tid och temperatur',
    description: `Arla (2026): bacon i airfryer ${h.t('tid')} på ${h.t('temp')}, och vänd skivorna efter halva tiden.`,
    lead: `Arla anger ${h.t('tid')} på ${h.t('temp')} för bacon i airfryer. Skivorna vänds efter halva tiden. ${VEILEDENDE}`,
    kilder: [`Om att vända: ${h.s('vanda')}`, `Om underlaget: ${h.s('papper')}`],
    tabell: { tittel: 'Bacon enligt Arla', kilde: 'abacon', intro: 'Arlas recept.', kolonner: ['Moment', 'Siffra'], rader: [['Temperatur', 'temp'], ['Tid', 'tid']] },
    faq: [['Hur länge ska bacon vara i airfryer?', `${h.k('abacon')} anger ${h.t('tid')} på ${h.t('temp')}.`], ['Ska man vända baconet?', `${h.s('vanda')}`]],
    soster: [`${A}hamburgare/`, 'Hamburgare i airfryer'],
    andre: [L('kottbullar', 'Köttbullar i airfryer')],
  }),

  hamburger: (h) => ({
    ord: 'hamburgare',
    title: 'Hamburgare i airfryer: tid och temperatur',
    h1: 'Hamburgare i airfryer: tid och temperatur',
    description: `Arla (2026): hamburgare i airfryer ${h.t('tid1')} på ${h.t('temp')}, och sedan ytterligare ${h.t('tid2')} efter att de vänts.`,
    lead: `Arla anger ${h.t('tid1')} på ${h.t('temp')}. Sedan vänds burgarna och tillagas ytterligare ${h.t('tid2')}. ${VEILEDENDE}`,
    kilder: [`Om korgen: ${h.s('lager')}`, `Om formen: Arla säger att burgarna ska formas till jämntjocka burgare. ${h.s('tjock')}`],
    tabell: { tittel: 'Hamburgare enligt Arla', kilde: 'aburgare', intro: 'Arlas recept med ostburgare.', kolonner: ['Moment', 'Siffra'], rader: [['Temperatur', 'temp'], ['Första omgången', 'tid1'], ['Efter vändning', 'tid2']] },
    faq: [['Hur länge ska hamburgare vara i airfryer?', `${h.k('aburgare')} anger ${h.t('tid1')} på ${h.t('temp')}, och sedan ytterligare ${h.t('tid2')} efter vändning.`], ['Får burgarna ligga på varandra?', `${h.s('lager')}`]],
    soster: [`${A}kottbullar/`, 'Köttbullar i airfryer'],
    andre: [L('flaskfile', 'Fläskfilé i airfryer')],
  }),

  kjottboller: (h) => ({
    ord: 'köttbullar',
    title: 'Köttbullar i airfryer: tid och temperatur',
    h1: 'Köttbullar i airfryer: tid och temperatur',
    description: `Arla (2026): köttbullar i airfryer ${h.t('tid')} på ${h.t('temp')}, tills de är genomstekta. Receptet gör ${h.t('antal')}.`,
    lead: `Arla anger ${h.t('tid')} på ${h.t('temp')} tills köttbullarna är genomstekta. Korgen skakas en gång under tiden. ${VEILEDENDE}`,
    kilder: [`Om korgen: ${h.s('skaka')}`, `Om storleken: ${h.k('akott')} formar smeten till jämstora köttbullar, i receptet ${h.t('antal')}.`],
    tabell: { tittel: 'Köttbullar enligt Arla', kilde: 'akott', intro: 'Arlas recept.', kolonner: ['Moment', 'Siffra'], rader: [['Temperatur', 'temp'], ['Tid', 'tid']] },
    faq: [['Hur länge ska köttbullar vara i airfryer?', `${h.k('akott')} anger ${h.t('tid')} på ${h.t('temp')}, tills de är genomstekta.`], ['Ska man skaka korgen?', `${h.s('skaka')}`]],
    soster: [`${A}hamburgare/`, 'Hamburgare i airfryer'],
    andre: [L('bacon', 'Bacon i airfryer')],
  }),

  gronnsaker: (h) => ({
    ord: 'grönsaker',
    title: 'Grönsaker och broccoli i airfryer: tid och temperatur',
    h1: 'Grönsaker och broccoli i airfryer: tid och temperatur',
    description: `Arla (2026): grönsaker ${h.t('g-temp')} i cirka ${h.t('g-tid')} och broccoli ${h.t('b-temp')} i ${h.t('b-tid')}. Bitarna ska vara jämnstora.`,
    lead: `Arla anger ${h.t('g-temp')} i cirka ${h.t('g-tid')} för rostade grönsaker och ${h.t('b-temp')} i ${h.t('b-tid')} för broccoli. ${VEILEDENDE}`,
    kilder: [`Om korgen: ${h.s('lager')}`, `Om bitarna: ${h.s('jamn')}`, `Om osten: ${h.k('agront')} lägger osten på grönsakerna och tillagar ytterligare ${h.t('g-extra')}.`],
    tabell: { tittel: 'Grönsaker och broccoli enligt Arla', kilde: 'agront', intro: 'Båda är Arlas receptsidor.', kolonner: ['Vara', 'Temperatur', 'Tid'], rader: [['Grönsaker, rostade', 'g-temp', { tekst: `cirka ${h.t('g-tid')}` }], ['Broccoli', 'b-temp', 'b-tid']] },
    faq: [['Hur länge ska grönsaker vara i airfryer?', `${h.k('agront')} anger cirka ${h.t('g-tid')} vid ${h.t('g-temp')}.`], ['Hur länge ska broccoli vara i airfryer?', `${h.k('abroccoli')} anger ${h.t('b-tid')} vid ${h.t('b-temp')}.`]],
    soster: [`${A}klyftpotatis/`, 'Klyftpotatis, hasselbackspotatis och sötpotatis i airfryer'],
    andre: [L('flaskfile', 'Fläskfilé i airfryer')],
  }),

  flaskfile: (h) => ({
    ord: 'fläskfilé',
    title: 'Fläskfilé i airfryer: tid och temperatur',
    h1: 'Fläskfilé i airfryer: tid och temperatur',
    description: `Arla (2026): fläskfilé i airfryer ${h.t('tid')} på ${h.t('temp')}, tills innertemperaturen är ${h.t('klar')}.`,
    lead: `Arla anger ${h.t('tid')} på ${h.t('temp')} tills innertemperaturen är ${h.t('klar')}. ${VEILEDENDE}`,
    kilder: [`Om förberedelsen: ${h.s('putsa')}`],
    tabell: { tittel: 'Fläskfilé enligt Arla', kilde: 'aflask', intro: 'Arlas recept.', kolonner: ['Moment', 'Siffra'], rader: [['Temperatur', 'temp'], ['Tid', 'tid'], ['Innertemperatur', 'klar']] },
    faq: [['Hur länge ska fläskfilé vara i airfryer?', `${h.k('aflask')} anger ${h.t('tid')} på ${h.t('temp')}, tills innertemperaturen är ${h.t('klar')}.`]],
    soster: [`${A}hamburgare/`, 'Hamburgare i airfryer'],
    andre: [[`${T}flaskstek/`, 'Fläskstek i ugn']],
  }),

  egg: (h) => ({
    ord: 'ägg',
    title: 'Koka ägg i airfryer: tid och temperatur',
    h1: 'Koka ägg i airfryer: tid och temperatur',
    description: `Arla (2026): ägg i airfryer på ${h.t('temp')}, ${h.t('medel')} för medelkokta och ${h.t('hard')} för hårdkokta. Justera med ${h.t('just')}.`,
    lead: `Arla anger ${h.t('temp')}: ${h.t('medel')} för medelkokt ägg med krämig gula och ${h.t('hard')} för hårdkokt ägg med fast gula. ${VEILEDENDE}`,
    kilder: [`Om modellen: ${h.s('modell')}`, `Om förvärmning: ${h.s('forvarm')}`, `Om sprickor: ${h.s('spricker')}`, `Om kylskåpskalla ägg: ${h.s('kylskap')}`],
    tabell: { tittel: 'Ägg enligt Arla', kilde: 'aagg', intro: 'Äggen läggs direkt i korgen.', kolonner: ['Ägg', 'Temperatur', 'Tid'], rader: [['Medelkokt, krämig gula', 'temp', 'medel'], ['Hårdkokt, fast gula', 'temp', 'hard']] },
    faq: [['Hur länge ska man koka ägg i airfryer?', `${h.k('aagg')} anger ${h.t('medel')} för medelkokta och ${h.t('hard')} för hårdkokta, på ${h.t('temp')}.`], ['Behöver man förvärma airfryern till ägg?', `${h.s('forvarm')}`]],
    soster: [`${T}koka-agg/`, 'Koka ägg i vanlig kastrull'],
    andre: [L('bacon', 'Bacon i airfryer')],
  }),

  fiskepinner: (h) => ({
    ord: 'fiskpinnar',
    title: 'Fiskpinnar i airfryer: tid och temperatur',
    h1: 'Fiskpinnar i airfryer: tid och temperatur',
    description: `Findus (2026): frysta fiskpinnar i airfryer ${h.t('temp')} i cirka ${h.t('tid')} för ${h.t('antal')}. Varmluftsugn ${h.t('ugn-temp')} i cirka ${h.t('ugn-tid')}.`,
    lead: `Findus anger ${h.t('temp')} i cirka ${h.t('tid')} för ${h.t('antal')} frysta fiskpinnar. I varmluftsugn anger Findus ${h.t('ugn-temp')} i cirka ${h.t('ugn-tid')}. Siffrorna gäller Findus produkt, så följ alltid förpackningen. ${VEILEDENDE}`,
    kilder: [`Om förvärmning: ${h.s('forvarm')}`, `Om att stå: ${h.k('findusfp')} anger att fiskpinnarna ska stå i cirka ${h.t('stå')} före servering.`],
    tabell: { tittel: 'Fiskpinnar enligt Findus', kilde: 'findusfp', intro: 'Findus produktsida anger båda.', kolonner: ['Hur', 'Temperatur', 'Tid'], rader: [['Airfryer', 'temp', { tekst: `cirka ${h.t('tid')}` }], ['Varmluftsugn', 'ugn-temp', { tekst: `cirka ${h.t('ugn-tid')}` }]] },
    faq: [['Hur länge ska fiskpinnar vara i airfryer?', `${h.k('findusfp')} anger cirka ${h.t('tid')} vid ${h.t('temp')} för ${h.t('antal')} frysta fiskpinnar.`], ['Ska man förvärma airfryern?', `${h.s('forvarm')}`]],
    soster: [`${A}lax/`, 'Lax och torsk i airfryer'],
    andre: [L('kycklingfile', 'Kycklingfilé i airfryer')],
  }),
};

export function nav({ data, rader, sti, h, p, esc }) {
  const ugn = h(rader.find((r) => r.id === 'ovn-til-airfryer'));
  const kf = h(rader.find((r) => r.id === 'kyllingfilet'));
  const OVERSIKT = {
    'ovn-til-airfryer': ['Sänk ugnens temperatur med', (x) => x.t('sank-arla'), 'arlaart'],
    kyllingfilet: ['Kycklingfilé', (x) => `${x.t('obh-tid')} vid ${x.t('obh-temp')}`, 'obh'],
    kyllinglar: ['Kycklingklubbor', (x) => `${x.t('klubb-tid')} vid ${x.t('klubb-temp')}`, 'aklubbor'],
    kyllingvinger: ['Kycklingvingar', (x) => `${x.t('ving-tid')} vid ${x.t('ving-temp')}`, 'avingar'],
    'hel-kylling': ['Hel kyckling', (x) => `${x.t('tid1')} och ${x.t('tid2')} vid ${x.t('temp')}`, 'ahel'],
    laks: ['Lax', (x) => `${x.t('tid')} vid ${x.t('temp')}`, 'alax'],
    'pommes-frites': ['Pommes frites av färsk potatis', (x) => `${x.t('tid')} vid ${x.t('temp')}`, 'apommes'],
    potetbater: ['Klyftpotatis', (x) => `${x.t('k-tid')} vid ${x.t('k-temp')}`, 'aklyft'],
    'bakt-potet': ['Bakad potatis', (x) => `${x.t('tid')} vid ${x.t('temp')}`, 'abakad'],
    bacon: ['Bacon', (x) => `${x.t('tid')} vid ${x.t('temp')}`, 'abacon'],
    hamburger: ['Hamburgare', (x) => `${x.t('tid1')} och ${x.t('tid2')} vid ${x.t('temp')}`, 'aburgare'],
    kjottboller: ['Köttbullar', (x) => `${x.t('tid')} vid ${x.t('temp')}`, 'akott'],
    gronnsaker: ['Rostade grönsaker', (x) => `${x.t('g-tid')} vid ${x.t('g-temp')}`, 'agront'],
    flaskfile: ['Fläskfilé', (x) => `${x.t('tid')} vid ${x.t('temp')}`, 'aflask'],
    egg: ['Hårdkokt ägg', (x) => `${x.t('hard')} vid ${x.t('temp')}`, 'aagg'],
    fiskepinner: ['Frysta fiskpinnar', (x) => `${x.t('tid')} vid ${x.t('temp')}`, 'findusfp'],
  };
  const radene = rader.map((r) => {
    const x = h(r);
    const [etikett, tekst, kilde] = OVERSIKT[r.id];
    return `<tr><td><a href="${sti(r)}">${esc(r.navn)}</a></td><td>${esc(etikett)}</td><td>${tekst(x)}</td><td>${x.k(kilde)}</td></tr>`;
  }).join('');
  return {
    title: 'Airfryer: tid och temperatur för kyckling, potatis, lax och mer',
    h1: 'Tid och temperatur i airfryer',
    description: `Hur länge ska kycklingfilé vara i airfryer? ${rader.length} sidor med tid och temperatur från Arla, Findus och OBH Nordica, med omvandling från ugn och källa på varje siffra.`,
    lead: `Siffrorna på de här sidorna kommer från svenska källor, främst Arlas receptsidor för airfryer. Arla säger att du kan sänka ugnens temperatur med ${ugn.t('sank-arla')} i airfryern. Tiderna är veiledande: modell och mängd ändrar dem.`,
    rik: [
      `<h2>Det här säger källorna</h2>${p([
        `${ugn.k('arlaart')} anger att man kan sänka temperaturen på ugnsrecept med ${ugn.t('sank-arla')}, och ${ugn.k('obh')} anger cirka ${ugn.t('sank-obh')}.`,
        `${kf.k('obh')} anger ${kf.t('obh-temp')} för kyckling, och ${kf.t('obh-tid')} för kycklingfilé.`,
      ])}`,
      `<h2>Tider för varje vara</h2><p>Välj en vara för alla siffror, vad de bygger på och källorna. Källan står i sista kolumnen.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Airfryer: tid och temperatur"><table class="sprik"><thead><tr><th scope="col">Vara</th><th scope="col">Vad</th><th scope="col">Siffra</th><th scope="col">Källa</th></tr></thead><tbody>${radene}</tbody></table></div>`,
      '<h2>Varor som inte finns här</h2><p>Vi anger bara en siffra när vi har hittat den på en svensk källsida. Till exempel har vi ingen siffra för frysta pommes frites, grillkorv eller pizza från en svensk källa, så de har ingen egen sida.</p>',
      '<div class="related"><h2>Läs också</h2><ul><li><a href="/sv/tillagningstid/">Tillagningstider i vanlig ugn</a></li><li><a href="/sv/innertemperatur/">Innertemperatur för kött och fågel</a></li></ul></div>',
    ].join('\n'),
    faqTittel: 'Frågor om airfryer',
    faq: [
      ['Hur ändrar man ett ugnsrecept till airfryer?', `${ugn.k('arlaart')} säger att du kan sänka temperaturen med ${ugn.t('sank-arla')}. Arlas tabell på sidan om ugn till airfryer visar också tiden.`],
      ['Hur länge ska kycklingfilé vara i airfryer?', `${kf.k('obh')} anger ${kf.t('obh-tid')} vid ${kf.t('obh-temp')}.`],
      ['Är tiderna exakta?', 'Nej. Modell, mängd och bitarnas storlek ändrar tiden. Källorna anger tiderna för sina egna recept och produkter, så följ alltid förpackningen.'],
    ],
  };
}
