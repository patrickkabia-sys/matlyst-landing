// Text för familjen «holdbarhet» (sv): hur länge maten håller. Varje mening återger vad en namngiven källa säger.
// Siffror skrivs aldrig här: h.t(fält) läser dem ur data.sv.json, där varje siffra har ett citat från källan.
// h.s(id) ger en hel mening ur källan, ordagrant. scripts/familier/holdbarhet/kildekontroll.mjs kontrollerar att citaten finns kvar på källsidan.
// Källor: Livsmedelsverket först, sedan Svenskt Kött. Inga egna råd. Siffrorna är hämtade från svenska sidor, inte översatta från norska.
// Undvik ord som kylskåp, rester, plan, vecka, meny, laga, steg, köp, spara, recept, hitta i h2: scripts/app-bevis.mjs kopplar dem till appkort.

const HOLD = '/sv/hallbarhet/';
const FRYS = '/sv/frysa/';
const INNER = '/sv/innertemperatur/';
const H = (slug, text) => [`${HOLD}${slug}/`, text];
const F = (slug, text) => [`${FRYS}${slug}/`, text];

const KOLONNER = ['Mat', 'Tid'];

export const TEKST = {
  rester: (h) => ({
    ord: 'matrester',
    title: 'Hur länge håller matrester i kylen?',
    h1: 'Hur länge håller matrester och matlådor i kylen?',
    description: `Tillagad mat håller upp till ${h.t('vecka')} i kylen vid ${h.t('kjol')}, enligt ${h.k('matlada')}. Så svalnar maten, och vad Livsmedelsverket skriver om förvaring.`,
    lead: `Rätt förvarad vid ${h.t('kjol')} håller tillagad mat upp till ${h.t('vecka')} i kylen, enligt ${h.k('matlada')}. Här är vad källorna säger om att svalna, förvara och bedöma maten.`,
    kilder: [
      `Om tillagad mat står det så här: ${h.s('flera')}`,
      `Maten ska svalna först. ${h.s('kallt')}`,
      `Små mängder får gå direkt in. Gränsen är ${h.t('halv')}. För större mängder står det: ${h.s('vatten')}`,
      `Om förvaringen: ${h.s('sinnen')}`,
      h.s('lita'),
    ],
    tabell: { tittel: 'Så länge håller tillagad mat', kilde: 'matlada', intro: `${h.k('matlada')} anger den här tiden:`, kolonner: KOLONNER, rader: [[`Tillagad mat vid ${h.t('kjol')}`, { tekst: `Upp till ${h.t('vecka')}` }]], etter: [`${h.k('kylvaror')} skriver att en lämplig temperatur i kylen är ${h.t('kjol')}.`] },
    faq: [
      ['Hur länge håller tillagad mat i kylen?', `${h.k('matlada')} anger upp till ${h.t('vecka')} vid ${h.t('kjol')}.`],
      ['Hur snabbt ska maten ner i kylen?', `${h.s('kallt')}`],
      ['Går det att frysa matresterna?', `${h.s('frys')} Mer finns på sidan <a href="${FRYS}matrester/">Kan man frysa matrester?</a>`],
    ],
    soster: F('matrester', 'Kan man frysa matrester?'),
    andre: [H('framme', 'Hur länge får maten stå framme?'), H('kylskapstemperatur', 'Vilken temperatur ska kylen ha?'), H('kokt-ris-och-pasta', 'Hur länge håller kokt ris och pasta?')],
  }),

  framme: (h) => ({
    ord: 'mat som står framme',
    title: 'Hur länge får maten stå framme?',
    h1: 'Hur länge får maten stå framme?',
    description: `Livsmedelsverket (2026): kylvaror får stå framme högst ${h.t('h20')} vid högst ${h.t('g20')}, ${h.t('h25')} vid högst ${h.t('g25')} och ${h.t('h30')} vid ${h.t('g30')}.`,
    lead: `Enligt ${h.k('kylvaror')} beror tiden på hur varmt det är. Vid högst ${h.t('g20')} är gränsen ${h.t('h20')}. Ju varmare, desto kortare tid.`,
    kilder: [
      `Så här lyder regeln: ${h.s('regel')}`,
      h.s('snabbt'),
      h.s('rester'),
      `Om var maten står: ${h.s('sol')}`,
      `Källan nämner också pålägg: ${h.s('helg')}`,
    ],
    tabell: { tittel: 'Längsta tid framme', kilde: 'kylvaror', intro: `${h.k('kylvaror')} anger de här tiderna för kylvaror:`, kolonner: ['Temperaturen i rummet', 'Längsta tid framme'], rader: [[`Högst ${h.t('g20')}`, 'h20'], [`Högst ${h.t('g25')}`, 'h25'], [h.t('g30'), 'h30']] },
    faq: [
      ['Hur länge får mat stå framme på sommaren?', `Vid ${h.t('g30')} är gränsen ${h.t('h30')}, enligt ${h.k('kylvaror')}.`],
      ['Vad räknas som kylvaror?', `${h.k('kylvaror')} nämner som exempel färsk fisk, kött och mejerivaror.`],
    ],
    soster: H('rester', 'Hur länge håller matrester i kylen?'),
    andre: [H('elavbrott', 'Hur länge håller maten i kylen vid elavbrott?'), H('kylskapstemperatur', 'Vilken temperatur ska kylen ha?')],
  }),

  elavbrott: (h) => ({
    ord: 'maten vid elavbrott',
    title: 'Hur länge håller maten i kylen vid elavbrott?',
    h1: 'Hur länge håller maten i kylen vid elavbrott?',
    description: `Vid strömavbrott kan du bedöma maten i kylen om avbrottet varat högst ${h.t('h4')} (kylen höll ${h.t('g4')}) eller ${h.t('h8')} (${h.t('g8')}). Enligt Livsmedelsverket.`,
    lead: `Hur länge maten håller utan el beror på hur kallt det var i kylen från början. ${h.k('elkyl')} anger högst ${h.t('h4')} om kylen höll ${h.t('g4')} och högst ${h.t('h8')} om den höll ${h.t('g8')}.`,
    kilder: [
      `Regeln lyder: ${h.s('ingen')} Därför anger källan två gränser för när du själv kan titta, lukta och smaka.`,
      `Om dörren: ${h.s('dorr')}`,
      h.s('fullt'),
      h.s('notera'),
      `Om rått kött och fågel: ${h.s('kott')}`,
      `Om frysen: ${h.s('oppna')}`,
    ],
    tabell: { tittel: 'Längsta tid utan el, för att själv bedöma maten', kilde: 'elkyl', intro: `${h.k('elkyl')} anger de här tiderna:`, kolonner: ['Temperaturen i kylen före avbrottet', 'Längsta avbrott'], rader: [[h.t('g4'), 'h4'], [h.t('g8'), 'h8'], ['Full frys som hålls stängd', { tekst: `Upp till ${h.t('frys')}` }]], etter: [`Siffran för frysen kommer från ${h.k('elfrys')}.`] },
    faq: [
      ['Hur länge klarar sig maten i kylen utan ström?', `Det beror på temperaturen. ${h.k('elkyl')} anger högst ${h.t('h4')} om kylen höll ${h.t('g4')} och högst ${h.t('h8')} om den höll ${h.t('g8')}.`],
      ['Hur länge håller kylan i en frys?', `${h.k('elfrys')} skriver att en stängd full frys kan hålla kylan i upp till ${h.t('frys')}.`],
      ['Kan man frysa in halvtinad mat igen?', `${h.s('halv')} Se även <a href="${FRYS}frysa-om/">Kan man frysa om mat?</a>`],
    ],
    soster: F('frysa-om', 'Kan man frysa om mat som har tinat?'),
    andre: [H('kylskapstemperatur', 'Vilken temperatur ska kylen ha?'), H('framme', 'Hur länge får maten stå framme?')],
  }),

  kylskapstemperatur: (h) => ({
    ord: 'kylens temperatur',
    title: 'Vilken temperatur ska kylskåpet ha?',
    h1: 'Vilken temperatur ska kylskåpet ha?',
    description: `Livsmedelsverket (2026): en lämplig kylskåpstemperatur är ${h.t('kjol')}. Vid ${h.t('kjol')} håller sig maten fräsch ungefär dubbelt så länge som vid ${h.t('varm')}.`,
    lead: `${h.k('kylvaror')} anger ${h.t('kjol')} som lämplig temperatur i kylskåpet och ${h.t('frys')} i frysen.`,
    kilder: [
      h.s('dubbel'),
      h.s('ju'),
      h.s('mer'),
      `Om var det är kallast: ${h.s('kallast')}`,
      h.s('varmmat'),
    ],
    tabell: { tittel: 'Temperaturerna som källan anger', kilde: 'kylvaror', intro: `${h.k('kylvaror')} nämner de här temperaturerna:`, kolonner: ['Vad', 'Temperatur'], rader: [['Lämplig temperatur i kylen', 'kjol'], ['Högsta temperatur som många kylvaror är märkta för', 'varm'], ['Frysen', 'frys']] },
    faq: [
      ['Vilken temperatur ska kylskåpet ha?', `${h.k('kylvaror')} skriver att en lämplig kylskåpstemperatur är ${h.t('kjol')}.`],
      ['Vilken temperatur ska frysen ha?', `${h.k('kylvaror')} nämner ${h.t('frys')} eller lägre.`],
    ],
    soster: H('elavbrott', 'Hur länge håller maten i kylen vid elavbrott?'),
    andre: [H('rester', 'Hur länge håller matrester i kylen?'), F('matrester', 'Kan man frysa matrester?')],
  }),

  egg: (h) => ({
    ord: 'ägg',
    title: 'Hur länge håller ägg i kylen?',
    h1: 'Hur länge håller ägg i kylen?',
    description: `Råa ägg förvaras i kylen, cirka ${h.t('kjol')}. Då kan de hålla flera veckor efter bäst före-datumet, enligt Livsmedelsverket (2026). Det här skriver källan.`,
    lead: `Livsmedelsverket anger inget antal dagar för ägg. Källan skriver att råa ägg ska förvaras i kylen, cirka ${h.t('kjol')}, och att de då kan hålla flera veckor efter bäst före-datumet.`,
    kilder: [
      h.s('veckor'),
      `Så avgör du: ${h.s('sinnen')}`,
      `Om datumet på förpackningen: ${h.s('datum')}`,
      `Källan tillägger: ${h.s('rutten')}`,
      `Om ägg från andra länder: ${h.s('utland')}`,
    ],
    tabell: { tittel: 'Förvaring av råa ägg', kilde: 'forvara', intro: `${h.k('forvara')} anger den här temperaturen:`, kolonner: ['Vad', 'Temperatur'], rader: [['Råa ägg i kylen', 'kjol']], etter: [`Antalet veckor anges inte som en siffra: källan skriver ”flera veckor”.`] },
    faq: [
      ['Hur länge håller ägg efter bäst före-datumet?', `${h.s('veckor')}`],
      ['När dör salmonella i ägg?', `${h.s('gula')}`],
      ['Kan man frysa ägg?', `${h.s('frys')} Se <a href="${FRYS}agg/">Kan man frysa ägg?</a>`],
    ],
    soster: F('agg', 'Kan man frysa ägg?'),
    andre: [H('kylskapstemperatur', 'Vilken temperatur ska kylen ha?')],
  }),

  kjott: (h) => ({
    ord: 'kött och köttfärs',
    title: 'Hur länge håller kött och köttfärs i kylen?',
    h1: 'Hur länge håller kött och köttfärs i kylen?',
    description: `Färskt kött utan datummärkning håller några dagar i kylen, enligt Svenskt Kött (2023). Köttfärs ska användas senast på sista förbrukningsdag. Källorna i korthet.`,
    lead: `Ingen av källorna ger ett exakt antal dagar. Svenskt Kött skriver att färskt kött utan datum håller några dagar och att köttfärs ska användas senast på sista förbrukningsdag. Kylen ska hålla ${h.t('kjol')}.`,
    kilder: [
      `Om färskt kött: ${h.s('nodatum')}`,
      h.s('kallaste'),
      `Om köttfärs: ${h.s('kanslig')}`,
      h.s('sista'),
      `Om datumet: ${h.s('sistadag')}`,
      `Livsmedelsverket skriver: ${h.s('par')}`,
      h.s('vakuum'),
      h.s('oppna'),
    ],
    tabell: { tittel: 'Siffrorna i källorna', kilde: 'skforvara', intro: `${h.k('skforvara')} och ${h.k('kottfars')} anger dessa siffror:`, kolonner: ['Vad', 'Siffra'], rader: [['Temperatur i kylen', 'kjol'], ['Innertemperatur när köttfärs är genomstekt', 'fars']], etter: ['Tider i dagar anges inte som siffror i källorna.'] },
    faq: [
      ['Hur länge håller köttfärs i kylen?', `${h.s('sista')}`],
      ['Hur länge håller färskt kött i kylen?', `${h.s('nodatum')}`],
      ['Hur varmt ska köttfärs bli när den stekts?', `${h.k('kottfars')} anger ${h.t('fars')} innertemperatur. Se <a href="${INNER}kottfars/">Innertemperatur köttfärs</a>.`],
    ],
    soster: F('kott', 'Hur länge kan man ha kött i frysen?'),
    andre: [H('kylskapstemperatur', 'Vilken temperatur ska kylen ha?'), F('kottfars', 'Kan man frysa köttfärs?')],
  }),

  'kokt-ris-og-pasta': (h) => ({
    ord: 'kokt ris och pasta',
    title: 'Hur länge håller kokt ris i kylen?',
    h1: 'Hur länge håller kokt ris och pasta i kylen?',
    description: `Livsmedelsverket anger ingen egen tid för kokt ris. Regeln för tillagad mat är upp till ${h.t('vecka')} vid ${h.t('kjol')}. Så svalnar du ris och pasta enligt källan.`,
    lead: `På de sidor från Livsmedelsverket som vi har läst finns ingen särskild tid för kokt ris eller pasta. Därför visar vi regeln för tillagad mat, med källan. Källan pekar på att maten ska svalna snabbt.`,
    kilder: [
      `Regeln för tillagad mat: ${h.s('flera')}`,
      `Om ris och pasta: ${h.s('starkelse')}`,
      h.s('sporer'),
      h.s('gift'),
      `Så minskar du risken: ${h.s('kyl')}`,
      `Om svalning: ${h.s('behallare')}`,
      h.s('vattenbad'),
    ],
    tabell: { tittel: 'Siffrorna i källorna', kilde: 'kylvaror', intro: `${h.k('kylvaror')} och ${h.k('avsvalning')} anger dessa siffror för tillagad mat:`, kolonner: ['Vad', 'Siffra'], rader: [['Tillagad mat, ofta upp till', 'vecka'], ['Temperatur i kylen', 'kjol'], ['Mängd där svalning ska gå snabbt', 'halv']], etter: ['Det finns alltså ingen tid som gäller bara ris. Det är källans allmänna regel för tillagad mat.'] },
    faq: [
      ['Hur länge håller kokt ris i kylen?', `${h.k('kylvaror')} anger för tillagad mat ”ofta flera dagar, ibland upp till ungefär en vecka”. Ingen egen tid för ris står på de sidor vi har läst.`],
      ['Varför nämns ris och pasta särskilt?', `${h.s('starkelse')}`],
      ['Kan man frysa kokt ris?', `Källan nämner att matrester kan frysas in. Se <a href="${FRYS}matrester/">Kan man frysa matrester?</a>`],
    ],
    soster: H('rester', 'Hur länge håller matrester i kylen?'),
    andre: [H('framme', 'Hur länge får maten stå framme?'), H('kylskapstemperatur', 'Vilken temperatur ska kylen ha?')],
  }),

  hardost: (h) => ({
    ord: 'hårdost',
    title: 'Hur länge håller ost i kylen?',
    h1: 'Hur länge håller hårdost i kylen?',
    description: `Hårdost håller länge i kylen, skriver Livsmedelsverket (2026). Vid mögel ska du skära bort fläcken med minst ${h.t('mogel')} marginal. Kylen ska hålla ${h.t('kjol')}.`,
    lead: `Livsmedelsverket anger inget antal dagar för ost. Källan skriver att hårdost håller sig länge i kylen. Råden gäller hårdost, inte mögelost eller färskost.`,
    kilder: [
      h.s('svinnsakert'),
      h.s('lange'),
      `Om vilka ostar som avses: ${h.s('skilja')}`,
      `Om mögel: Livsmedelsverket (2026) skriver att man ska skära bort mögelfläckar med minst ${h.t('mogel')} marginal. ${h.s('gifter')}`,
      h.s('kant'),
    ],
    tabell: { tittel: 'Siffrorna i källan', kilde: 'ost', intro: `${h.k('ost')} anger dessa siffror:`, kolonner: ['Vad', 'Siffra'], rader: [['Temperatur i kylen', 'kjol'], ['Marginal runt mögelfläck', 'mogel']] },
    faq: [
      ['Kan man äta möglig ost?', `För hårdost skriver ${h.k('ost')} att mögelfläckar ska skäras bort med minst ${h.t('mogel')} marginal. För mögelost och färskost gäller andra råd.`],
      ['Kan man frysa ost?', `${h.s('frys')} Se <a href="${FRYS}ost/">Kan man frysa ost?</a>`],
    ],
    soster: F('ost', 'Kan man frysa ost?'),
    andre: [H('kylskapstemperatur', 'Vilken temperatur ska kylen ha?')],
  }),

  brod: (h) => ({
    ord: 'bröd',
    title: 'Hur länge håller bröd?',
    h1: 'Hur länge håller bröd, och ska det ligga i kylen?',
    description: `Mjukt bröd möglar ofta efter ungefär ${h.t('mogel')}, enligt Livsmedelsverket (2026). Bröd mår bäst i rumstemperatur, inte i kylen. Det här säger källan.`,
    lead: `Livsmedelsverket skriver att mjukt bröd ofta möglar efter ungefär ${h.t('mogel')}, men att vissa bröd håller längre. Bröd ska förvaras i rumstemperatur.`,
    kilder: [
      h.s('rum'),
      `${h.s('kylen')} ${h.s('retro')}`,
      `Om tiden: Livsmedelsverket (2026) skriver att bröd ofta möglar efter ungefär ${h.t('mogel')}. ${h.s('hygien')}`,
      h.s('surdeg'),
      `Om hårt bröd: ${h.s('hart')}`,
      `Om mögel: ${h.s('mogligt')}`,
    ],
    tabell: { tittel: 'Siffran i källan', kilde: 'brod', intro: `${h.k('brod')} anger den här tiden:`, kolonner: ['Vad', 'Tid'], rader: [['Mjukt bröd, tills det ofta möglar', 'mogel']], etter: ['Källan skriver ”ofta”, och att vissa bröd håller längre.'] },
    faq: [
      ['Ska bröd ligga i kylen?', `${h.s('rum')}`],
      ['Kan man äta bröd där det bara syns mögel på en skiva?', `${h.s('mogligt')}`],
      ['Kan man frysa bröd?', `${h.s('frys')} Se <a href="${FRYS}brod/">Kan man frysa bröd?</a>`],
    ],
    soster: F('brod', 'Kan man frysa bröd?'),
    andre: [H('frukt-och-gront', 'Hur ska frukt och grönsaker förvaras?')],
  }),

  'frukt-og-gronnsaker': (h) => ({
    ord: 'frukt och grönsaker',
    title: 'Hur ska frukt och grönsaker förvaras?',
    h1: 'Hur ska frukt och grönsaker förvaras?',
    description: `De flesta grönsaker och frukter trivs bäst i kylen, skriver Livsmedelsverket (2026). Några ska stå svalt, ${h.t('svalt')}, eller i rumstemperatur. Så säger källan.`,
    lead: `Livsmedelsverket anger inga dagar här, men visar var olika frukter och grönsaker trivs. Med svalt menas ${h.t('svalt')}.`,
    kilder: [
      h.s('kylen'),
      h.s('kold'),
      `Om skuren frukt och grönt: ${h.s('skuret')}`,
      `Om tomat och avokado: ${h.s('mogna')}`,
      `Om potatis: ${h.s('potatis')}`,
      h.s('solanin'),
      `När det börjar se trött ut: ${h.s('skrumpna')}`,
    ],
    tabell: { tittel: 'Var det trivs enligt källan', kilde: 'fruktgront', intro: `${h.k('fruktgront')} sorterar på plats. Exempel ur listorna:`, kolonner: ['Plats', 'Exempel'], rader: [['Kylen', { tekst: 'Äpple, morot, kål, bär, vitlök' }], ['Rumstemperatur', { tekst: 'Banan, gurka, tomat, paprika, avokado' }], [`Svalt, ${h.t('svalt')}, och mörkt`, { tekst: 'Potatis' }]] },
    faq: [
      ['Ska potatis ligga i kylen?', `${h.s('potatis')}`],
      ['Ska tomater ligga i kylen?', `${h.s('mogna')}`],
      ['Kan man rädda sallad som tappat spänsten?', `${h.s('sallad')}`],
    ],
    soster: F('frukt-och-gront', 'Kan man frysa frukt, bär och grönsaker?'),
    andre: [H('brod', 'Hur länge håller bröd?')],
  }),
};

const OVERSIKT = {
  rester: ['Tillagad mat, upp till', 'vecka'],
  framme: ['Mat som står framme (vid högst 20 °C)', 'h20'],
  elavbrott: ['Elavbrott, kylen höll 4 °C', 'h4'],
  kylskapstemperatur: ['Lämplig temperatur i kylen', 'kjol'],
  egg: ['Råa ägg i kylen', 'kjol'],
  kjott: ['Köttfärs, innertemperatur vid stekning', 'fars'],
  'kokt-ris-og-pasta': ['Tillagad mat, ofta upp till', 'vecka'],
  hardost: ['Marginal runt mögelfläck', 'mogel'],
  brod: ['Mjukt bröd, tills det ofta möglar', 'mogel'],
  'frukt-og-gronnsaker': ['Svalt förvarat', 'svalt'],
};

export function nav({ data, rader, sti, h, p, esc }) {
  const rester = h(rader.find((r) => r.id === 'rester'));
  const temp = h(rader.find((r) => r.id === 'kylskapstemperatur'));
  const framme = h(rader.find((r) => r.id === 'framme'));
  const radene = rader.map((r) => {
    const x = h(r);
    const [etikett, felt] = OVERSIKT[r.id];
    const kilde = r.tall[felt]?.kilde ?? r.tall[`${felt}-min`].kilde;
    return `<tr><td><a href="${sti(r)}">${esc(r.navn)}</a></td><td>${esc(etikett)}</td><td>${x.t(felt)}</td><td>${x.k(kilde)}</td></tr>`;
  }).join('');
  return {
    title: 'Hur länge håller maten? Förvaring i kylen, med källor',
    h1: 'Hur länge håller maten i kylen?',
    description: 'Hur länge håller matrester, ägg, kött, ost och bröd? Siffror från Livsmedelsverket och Svenskt Kött, med källa på varje siffra. Vi skriver bara det källorna säger.',
    lead: `Livsmedelsverket anger ${temp.t('kjol')} som lämplig temperatur i kylen. Varje siffra på sidorna kommer från en namngiven svensk källa. Hittar vi ingen siffra, skriver vi det.`,
    rik: [
      `<h2>Det här säger källorna</h2>${p([
        `${temp.k('kylvaror')} skriver att en lämplig kylskåpstemperatur är ${temp.t('kjol')}.`,
        `${rester.k('matlada')} anger att tillagad mat håller upp till ${rester.t('vecka')} i kylen vid ${rester.t('kjol')}.`,
        `${framme.k('kylvaror')} anger att kylvaror får stå framme högst ${framme.t('h20')} vid högst ${framme.t('g20')}.`,
      ])}`,
      `<h2>Siffror för varje vara</h2><p>Välj en vara för alla siffror, reglerna bakom dem och källorna. Källan står i sista kolumnen.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Förvaring i kylen"><table class="sprik"><thead><tr><th scope="col">Vara</th><th scope="col">Vad</th><th scope="col">Siffra</th><th scope="col">Källa</th></tr></thead><tbody>${radene}</tbody></table></div>`,
      '<h2>Varor som inte finns här</h2><p>Vi anger bara en siffra när vi har hittat den på en svensk källsida. Livsmedelsverket och Svenskt Kött anger inga dagar för kyckling, fisk eller mjölk i kylen, så de varorna har ingen egen sida. Frysta varor finns i <a href="/sv/frysa/">Kan man frysa det?</a>.</p>',
      '<div class="related"><h2>Läs också</h2><ul><li><a href="/sv/frysa/">Kan man frysa det? Hur länge håller maten i frysen</a></li><li><a href="/sv/innertemperatur/">Innertemperatur för kött och fågel</a></li></ul></div>',
    ].join('\n'),
    faqTittel: 'Frågor om hur länge maten håller',
    faq: [
      ['Vilken temperatur ska kylskåpet ha?', `${temp.k('kylvaror')} anger ${temp.t('kjol')} som lämplig temperatur i kylskåpet.`],
      ['Hur länge får maten stå framme?', `${framme.k('kylvaror')} anger högst ${framme.t('h20')} vid högst ${framme.t('g20')}. Vid varmare rum är tiden kortare. Se <a href="${sti(rader.find((r) => r.id === 'framme'))}">Hur länge får maten stå framme?</a>`],
    ],
  };
}
