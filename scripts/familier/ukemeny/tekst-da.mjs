// Tekstene for ukemeny på dansk (/da/madplaner/). Skrevet fra meningen, ikke oversatt fra norsk.
// Tallene og sitatene kommer fra data.da.json (Fødevarestyrelsen); denne fila skriver aldri et tall selv.
const MAANEDER = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
const og = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} og ${xs.at(-1)}` : xs[0] ?? '');
const ul = (xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`;
const p = (...xs) => xs.map((x) => `<p>${x}</p>`).join('');
const stor = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const T = {
  marked: 'da', rot: '/da/madplaner/', lest: 'Læst', anf: ['»', '«'],
  dato: (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d}. ${MAANEDER[m - 1]} ${a}`; },
  tallNr: (v) => String(v).replace('.', ','),
  tallTekst: (x) => `${String(x.verdi).replace('.', ',')}${x.enhet === '°C' ? ' °C' : ` ${x.enhet}`}`,
  kortNavn: (k) => k.utgiver,
  og,
  ord: ['ingen', 'én', 'to', 'tre', 'fire', 'fem', 'seks', 'syv'],
  dagKort: ['man', 'tir', 'ons', 'tor', 'fre', 'lør', 'søn'],
  hjem: ['Forside', '/da/'],
  eyebrowRot: 'Madplaner',
  etikett: { hvorfor: 'Hvorfor denne dag', lagMer: 'Lav mere', rest: 'Bruger rester', framgang: 'Sådan gør du', oppskrift: 'Opskrift' },
  oppskriftLenke: 'Opskriften hos Arla',
  restLinje: (x) => `${stor(x.rest.hva)} fra ${x.rest.fra}${x.rest.via === 'fryser' ? ', via fryseren' : ''}.`,
  oversiktIntro: 'Dagene med »rester« bruger noget, du laver ekstra tidligere på ugen. Under tabellen står, hvorfor hver ret ligger, hvor den ligger.',
  dagKolonne: 'Dag', middagKolonne: 'Aftensmad', restMerke: 'rester',
  restKjede: (c, esc) => `<strong>${c.fra} til ${c.til.toLowerCase()}${c.via ? ', via fryseren' : ''}:</strong> ${esc(c.lagMer)} ${c.til} bruger ${esc(c.hva)}.`,
  restRegler: 'Regler for resterne',
  hvorUke: 'i denne uge', hvorNav: 'i vores madplaner',
  regler: (h, hvor) => ul([
    `<strong>Køl varm mad hurtigt ned.</strong> ${h.s('dampe')} ${h.q('del')}`,
    `<strong>Køleskabet på højst ${h.t('kjol')}.</strong> ${h.s('koel')}`,
    `<strong>Varm resterne helt igennem.</strong> ${h.s('varm')}`,
    `<strong>Frys det, I ikke når at spise.</strong> ${h.s('optoen')}`,
    `<strong>Resterne bruges tidligt.</strong> Resterne ${hvor} bruges senest to dage efter, eller de fryses.`,
    '<strong>Ris og pasta gemmes ikke.</strong> I vores madplaner går ingen ris eller pasta videre som rester. De koges til hvert måltid.',
  ]),
  listeIntro: 'Listen har alle de varer, de syv opskrifter skal bruge, sorteret efter hylderne i butikken. Hvor en ret bruger rester, står kun det, du skal købe ud over dem. Mængderne står i opskrifterne. Dagene efter hver vare viser, hvilke aftensmåltider den skal bruges til. Friske varer til slutningen af ugen kan du købe tættere på dagen.',
  hjemmeFra: (basis) => `<strong>Tjek, at du har:</strong> ${basis}. De står ikke på listen ovenfor.`,
  app: ({ egne, harEgne, lenker, over, gratis }) => p('Matlyst laver ikke madplanen for dig, og appen ved ikke, hvilke rester du har. Du får en madplan med dine opskrifter og én indkøbsliste, der laves ud fra dem. Sådan lægger du ugen ind:')
    + `<ol>
<li><strong>Gem opskrifterne.</strong> Åbn hvert link ovenfor, og del det med Matlyst, eller indsæt linket i appen. Læs mere om at <a href="/da/importer-opskrifter/">importere opskrifter</a>.${harEgne ? ` Til ${egne} er der intet link. Skriv trinnene ovenfor ind som en egen opskrift.` : ''}</li>
<li><strong>Læg dem på dagene.</strong> Åbn <a href="/da/madplan-app/">Madplan</a>, og læg hver opskrift på den dag, den står på her.</li>
<li><strong>Tilpas portionerne.</strong> Hvor ugen siger »lav mere«, sætter du antallet af portioner op på den opskrift, før du handler.</li>
<li><strong>Læg ugen på indkøbslisten.</strong> Matlyst samler ens varer på én linje og sorterer listen efter afdeling, se <a href="/da/indkoebsliste-app/">indkøbslisten</a>. Inden varerne lægges ind, ser du listen og kan fjerne fluebenet ved det, du får fra resterne, for eksempel sovsen i en ret, der bruger sovsen fra en tidligere dag.</li>
</ol>`
    + p(`<strong>Gratis eller Pro:</strong> Madplanen og indkøbslisten er gratis. Import fra links er gratis for ${gratis} importer pr. kalendermåned, og i denne uge er der ${['ingen', 'ét', 'to', 'tre', 'fire', 'fem', 'seks', 'syv'][lenker]} links${over ? '. Med den gratis version kan du gemme resten måneden efter eller skrive dem ind selv' : ''}. Med Matlyst Pro er der ingen sådan grænse, og husstanden kan dele madplanen og indkøbslisten.`),
  kildeIntro: (meny) => `${meny ? `Opskrifterne er Arlas. Vi linker til dem og gengiver dem ikke, og linkene blev åbnet ${meny.hentet}. Trinnene uden link er vores egne. ` : ''}Rådene om rester, nedkøling, opvarmning og optøning kommer fra Fødevarestyrelsen, den danske myndighed for fødevaresikkerhed.`,
  ingenTall: 'Vi oplyser ingen priser, kalorier eller portionsstørrelser, fordi vi ikke har en åben kilde til dem for hver ret. Har du fundet en fejl, eller virker et link ikke længere? Skriv til <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>.',
  felleSpm: (h) => [
    ['Hvor længe kan resterne stå i køleskabet?', `${h.k('fvst-koel')} oplyser ikke en fast tid for rester på den side, vi bruger. Siden siger, at rester fra middagen skal opbevares i køleskab ved højst ${h.t('kjol')}. Vi bruger derfor resterne tidligt: Resterne i denne uge bruges senest to dage efter, eller de fryses.`],
    ['Kan jeg gemme madplanen i Matlyst?', 'Ja. Gem opskrifterne, læg dem på dagene i madplanen, og læg ugen på indkøbslisten. Matlyst laver ikke planen for dig, så du lægger den ind selv.'],
  ],
  svar: ({ dager, rester, restOrd }) => `${stor(og(dager))}. ${rester === 0 ? 'Ingen' : stor(restOrd)} af aftensmåltiderne bruger rester fra en tidligere dag, og indkøbslisten nedenfor har alt, du skal bruge til hele ugen.`,
  fyll: (a) => a,
  sek: { dager: 'Madplanen dag for dag', rester: 'Sådan bruger du resterne', liste: 'Indkøbsliste til hele ugen', app: 'Gem ugen i Matlyst', kilder: 'Kilder', restRegler: 'Regler for resterne' },
  andre: 'Flere madplaner', alle: 'Alle madplaner',
  steg: [['Læs ugen igennem', 'Syv aftensmåltider, og hvilke dage der giver rester.'], ['Handl én gang', 'Brug indkøbslisten, der er sorteret efter hylde.'], ['Lav mere, hvor ugen siger det', 'Så har du aftensmaden to dage senere.']],
  stegTittel: 'Sådan bruger du madplanen', faqTittel: 'Spørgsmål om madplanen',
  cta: 'Planlæg ugen i Matlyst',
  elementNavn: (h1) => `${h1}: syv aftensmåltider`,
  navSvar: (navne) => `Hver madplan har syv aftensmåltider med link til opskriften, en plan for, hvordan resterne bruges videre i ugen, og én indkøbsliste sorteret efter hylde. Vælg mellem ${navne}.`,
  navFaq: (h) => [
    ['Er madplanerne gratis?', 'Ja. Siderne er gratis at bruge, og du behøver ikke appen for at følge dem. Madplanen og indkøbslisten i Matlyst er også gratis.'],
    ['Kommer der en ny madplan hver uge?', 'Nej. Det er faste madplaner, du kan bruge, når du vil. Byt gerne en ret ud, men hold afstanden mellem en ret og de rester, den giver.'],
    ['Hvorfor står der ingen priser eller kalorier?', 'Vi skriver kun tal, vi har en åben kilde til. Priserne ændrer sig fra butik til butik og fra uge til uge, og vi har ingen kilde til næringsindholdet i hver ret.'],
    ['Hvad siger Fødevarestyrelsen om rester?', `${h.k('fvst-koel')} skriver, at rester fra middagen skal opbevares i køleskab ved højst ${h.t('kjol')}. Resterne i vores madplaner bruges senest to dage efter.`],
  ],
  nav: {
    title: 'Madplaner: syv aftensmåltider med indkøbsliste',
    description: 'Færdige madplaner med syv aftensmåltider, rester lagt ind i ugen og én indkøbsliste efter hylde: til børnefamilien, billig, vegetarisk, til én og klassiske retter.',
    h1: 'Madplaner med indkøbsliste',
    lead: 'Syv aftensmåltider om ugen, sat op så ét måltid giver det næste, og med én indkøbsliste til hele ugen.',
    steg: [['Vælg en madplan', 'Børnefamilie, billig, vegetarisk, til én eller klassiske retter.'], ['Handl én gang', 'Brug den samlede indkøbsliste.'], ['Brug resterne', 'Ugen viser, hvilke dage der giver mere.']],
    stegTittel: 'Sådan bruger du madplanerne', faqTittel: 'Spørgsmål om madplanerne',
    velg: 'Vælg en madplan',
    velgIntro: 'Alle madplaner går fra mandag til søndag og er bygget op på samme måde: dagene, resterne, indkøbslisten og vejen ind i appen.',
    oppsett: 'Sådan er madplanerne sat op',
    punkter: [
      '<strong>Resterne er lagt ind.</strong> Hver uge har dage, der giver mere, og dage, der bruger det. Ingen rest står længere end to dage i køleskabet, og ingen ris eller pasta går videre som rest.',
      '<strong>Én indkøbsliste til hele ugen.</strong> Varerne står én gang, sorteret efter de samme hylder som i Matlyst, med de dage, der skal bruge dem.',
      '<strong>Opskrifterne er Arlas.</strong> Vi linker til dem og gengiver dem ikke. Hvor en ret ikke har en opskrift, står en kort fremgangsmåde, vi selv har skrevet.',
      '<strong>Ingen tal uden kilde.</strong> Vi oplyser ingen priser, kalorier eller portionsstørrelser. Rådene om rester og nedkøling kommer fra Fødevarestyrelsen.',
    ],
    egne: 'Planlæg med dine egne opskrifter',
    egneTekst: 'Vil du hellere bruge de opskrifter, du allerede har? I <a href="/da/madplan-app/">madplanen i Matlyst</a> lægger du dine egne opskrifter på dagene og får én indkøbsliste til hele ugen, sorteret efter hylde. Matlyst vælger ikke retterne for dig.',
  },
};
