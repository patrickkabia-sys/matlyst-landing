// Tekstene for ukemeny på svensk (/sv/veckomenyer/). Skrevet fra meningen, ikke oversatt fra norsk.
// Tallene og sitatene kommer fra data.sv.json (Livsmedelsverket); denne fila skriver aldri et tall selv.
const MAANEDER = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
const ETT = { dagar: 'dag', veckor: 'vecka', timmar: 'timme', månader: 'månad', grader: 'grad' };
const og = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} och ${xs.at(-1)}` : xs[0] ?? '');
const ul = (xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`;
const p = (...xs) => xs.map((x) => `<p>${x}</p>`).join('');

export const T = {
  marked: 'sv', rot: '/sv/veckomenyer/', lest: 'Läst', anf: ['”', '”'],
  dato: (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d} ${MAANEDER[m - 1]} ${a}`; },
  tallNr: (v) => String(v).replace('.', ','),
  tallTekst: (x) => `${String(x.verdi).replace('.', ',')}${x.enhet === '°C' ? ' °C' : ` ${x.verdi === 1 ? (ETT[x.enhet] ?? x.enhet) : x.enhet}`}`,
  kortNavn: (k) => k.utgiver,
  og,
  ord: ['ingen', 'en', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju'],
  dagKort: ['mån', 'tis', 'ons', 'tors', 'fre', 'lör', 'sön'],
  hjem: ['Hem', '/sv/'],
  eyebrowRot: 'Veckomenyer',
  etikett: { hvorfor: 'Varför den här dagen', lagMer: 'Gör mer', rest: 'Använder rester', framgang: 'Så här gör du', oppskrift: 'Recept' },
  oppskriftLenke: 'Receptet hos Arla',
  restLinje: (x) => `${x.rest.hva.charAt(0).toUpperCase()}${x.rest.hva.slice(1)} från ${x.rest.fra}${x.rest.via === 'fryser' ? ', via frysen' : ''}.`,
  oversiktIntro: 'Dagarna märkta ”rester” använder något du lagar extra tidigare i veckan. Under tabellen står varför varje rätt ligger där den ligger.',
  dagKolonne: 'Dag', middagKolonne: 'Middag', restMerke: 'rester',
  restKjede: (c, esc) => `<strong>${c.fra} till ${c.til.toLowerCase()}${c.via ? ', via frysen' : ''}:</strong> ${esc(c.lagMer)} ${c.til} använder ${esc(c.hva)}.`,
  restRegler: 'Regler för resterna',
  hvorUke: 'den här veckan', hvorNav: 'i veckomenyerna',
  regler: (h, hvor) => ul([
    `<strong>Kyl ner snabbt.</strong> ${h.k('avsvalning')} skriver: ${h.q('svalna')} ${h.q('delaupp')}`,
    `<strong>Kylskåp på ${h.t('kjol')}.</strong> ${h.k('kylvaror')} skriver att en lämplig kylskåpstemperatur är ${h.t('kjol')}.`,
    `<strong>Rester håller upp till en vecka.</strong> ${h.k('matlada')} skriver att tillagad mat håller upp till en vecka i kylskåpet, om kylskåpet håller ${h.n('kjol')} grader. Resterna ${hvor} används senast två dagar senare, eller fryses.`,
    `<strong>Titta, lukta och smaka.</strong> ${h.s('sinnen')}`,
    `<strong>Frys det du inte hinner äta.</strong> ${h.s('frys')}`,
    '<strong>Ris och pasta sparas inte.</strong> I våra veckomenyer går inget ris eller pasta vidare som rester. De kokas till varje måltid.',
  ]),
  listeIntro: 'Listan har alla varor de sju recepten behöver, ordnade efter hyllorna i butiken. Där en rätt använder rester står bara det du behöver köpa utöver dem. Mängderna står i recepten. Dagarna efter varje vara visar vilka middagar den ska till. Färskvaror till slutet av veckan kan du köpa närmare dagen.',
  hjemmeFra: (basis) => `<strong>Kolla att du har:</strong> ${basis}. De här står inte i listan ovan.`,
  app: ({ egne, harEgne, lenker, over, gratis }) => p('Matlyst gör inte veckomenyn åt dig, och appen vet inte vilka rester du har. Du får en veckomeny med dina recept och en inköpslista som skapas från dem. Så här lägger du in veckan:')
    + `<ol>
<li><strong>Spara recepten.</strong> Öppna varje länk ovan och dela den med Matlyst, eller klistra in länken i appen. Läs mer om att <a href="/sv/importera-recept/">importera recept</a>.${harEgne ? ` För ${egne} finns ingen länk. Skriv in stegen ovan som ett eget recept.` : ''}</li>
<li><strong>Lägg dem på dagarna.</strong> Öppna <a href="/sv/veckomeny-app/">Veckomeny</a> och lägg varje recept på den dag det står på här.</li>
<li><strong>Justera portionerna.</strong> Där veckan säger ”gör mer” ökar du antalet portioner på det receptet innan du handlar.</li>
<li><strong>Lägg veckan på inköpslistan.</strong> Matlyst slår ihop likadana varor på en rad och sorterar listan efter avdelning, se <a href="/sv/inkopslista/">inköpslistan</a>. Innan varorna läggs in ser du listan och kan ta bort bocken vid det du får från resterna, till exempel såsen i en rätt som använder såsen från en tidigare dag.</li>
</ol>`
    + p(`<strong>Gratis eller Pro:</strong> Veckomenyn och inköpslistan är gratis. Import från länkar är gratis för ${gratis} importer per kalendermånad, och den här veckan har ${['inga', 'en', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju'][lenker]} länkar${over ? '. Med gratisversionen kan du spara resten månaden efter, eller skriva in dem själv' : ''}. Med Matlyst Pro finns ingen sådan gräns, och hushållet kan dela veckomenyn och inköpslistan.`),
  kildeIntro: (meny) => `${meny ? `Recepten är Arlas. Vi länkar till dem och återger dem inte, och länkarna öppnades ${meny.hentet}. Stegen utan länk är våra egna. ` : ''}Råden om rester, kylning och frysning kommer från Livsmedelsverket, den svenska myndigheten för livsmedelssäkerhet.`,
  ingenTall: 'Vi anger inga priser, kalorier eller portionsstorlekar, eftersom vi inte har en öppen källa för dem per rätt. Hittade du ett fel, eller har en länk slutat fungera? Skriv till <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>.',
  felleSpm: (h) => [
    ['Hur länge håller resterna i kylskåpet?', `${h.k('matlada')} skriver att tillagad mat håller upp till en vecka i kylskåpet, om kylskåpet håller ${h.n('kjol')} grader. Kyl maten snabbt, och frys det du inte ska äta snart. Resterna i den här veckan används senast två dagar senare.`],
    ['Kan jag spara veckomenyn i Matlyst?', 'Ja. Spara recepten, lägg dem på dagarna i veckomenyn och lägg veckan på inköpslistan. Matlyst gör inte menyn åt dig, så du lägger in den själv.'],
  ],
  svar: ({ dager, rester, restOrd }) => `${og(dager).charAt(0).toUpperCase()}${og(dager).slice(1)}. ${rester === 0 ? 'Ingen' : `${restOrd.charAt(0).toUpperCase()}${restOrd.slice(1)}`} av middagarna använder rester från en tidigare dag, och inköpslistan nedan har allt du behöver för hela veckan.`,
  fyll: (a, h) => a.replace('{fryser}', h.t('vecka')),
  sek: { dager: 'Veckomenyn dag för dag', rester: 'Så använder du resterna', liste: 'Inköpslista för hela veckan', app: 'Spara veckan i Matlyst', kilder: 'Källor', restRegler: 'Regler för resterna' },
  andre: 'Fler veckomenyer', alle: 'Alla veckomenyer',
  steg: [['Läs igenom veckan', 'Sju middagar, och vilka dagar som ger rester.'], ['Handla en gång', 'Använd inköpslistan, som är ordnad efter hylla.'], ['Gör mer där veckan säger det', 'Då har du middagen två dagar senare.']],
  stegTittel: 'Så använder du veckomenyn', faqTittel: 'Frågor om veckomenyn',
  cta: 'Planera veckan i Matlyst',
  elementNavn: (h1) => `${h1}: sju middagar`,
  navSvar: (namn) => `Varje veckomeny har sju middagar med länk till receptet, en plan för hur resterna används vidare i veckan och en inköpslista ordnad efter hylla. Välj mellan ${namn}.`,
  navFaq: (h) => [
    ['Är veckomenyerna gratis?', 'Ja. Sidorna är gratis att använda, och du behöver inte appen för att följa dem. Veckomenyn och inköpslistan i Matlyst är också gratis.'],
    ['Kommer det en ny veckomeny varje vecka?', 'Nej. Det här är fasta veckomenyer som du kan använda när du vill. Byt gärna ut en rätt, men håll avståndet mellan en rätt och resterna den ger.'],
    ['Varför står det inga priser eller kalorier?', 'Vi skriver bara siffror vi har en öppen källa för. Priserna ändras från butik till butik och vecka till vecka, och vi har ingen källa för näringsinnehållet i varje rätt.'],
    ['Hur länge håller resterna?', `${h.k('matlada')} skriver att tillagad mat håller upp till en vecka i kylskåpet, om kylskåpet håller ${h.n('kjol')} grader. Resterna i våra veckomenyer används senast två dagar senare.`],
  ].map(([q, a]) => [q, a]),
  nav: {
    title: 'Veckomenyer: sju middagar med inköpslista',
    description: 'Färdiga veckomenyer med sju middagar, rester inplanerade och en inköpslista efter hylla: för barnfamiljen, billig, vegetarisk, för en och husmanskost.',
    h1: 'Veckomenyer med inköpslista',
    lead: 'Sju middagar per vecka, upplagda så att en middag ger nästa, och med en inköpslista för hela veckan.',
    steg: [['Välj en veckomeny', 'Barnfamilj, billig, vegetarisk, för en eller husmanskost.'], ['Handla en gång', 'Använd den gemensamma inköpslistan.'], ['Använd resterna', 'Veckan visar vilka dagar som ger mer.']],
    stegTittel: 'Så använder du veckomenyerna', faqTittel: 'Frågor om veckomenyerna',
    velg: 'Välj en veckomeny',
    velgIntro: 'Alla veckomenyer går från måndag till söndag och är byggda på samma sätt: dagarna, resterna, inköpslistan och vägen in i appen.',
    oppsett: 'Så är veckomenyerna upplagda',
    punkter: [
      '<strong>Resterna är inplanerade.</strong> Varje vecka har dagar som ger mer och dagar som använder det. Ingen rest står längre än två dagar i kylskåpet, och inget ris eller pasta går vidare som rest.',
      '<strong>En inköpslista för hela veckan.</strong> Varorna står en gång, ordnade efter samma hyllor som i Matlyst, med dagarna som behöver dem.',
      '<strong>Recepten är Arlas.</strong> Vi länkar till dem och återger dem inte. Där en rätt inte behöver recept står ett kort steg-för-steg som vi har skrivit själva.',
      '<strong>Inga siffror utan källa.</strong> Vi anger inga priser, kalorier eller portionsstorlekar. Råden om rester och kylning kommer från Livsmedelsverket.',
    ],
    egne: 'Planera med dina egna recept',
    egneTekst: 'Vill du hellre använda recepten du redan har? I <a href="/sv/veckomeny-app/">veckomenyn i Matlyst</a> lägger du dina egna recept på dagarna och får en inköpslista för hela veckan, sorterad efter hylla. Matlyst väljer inte rätterna åt dig.',
  },
};
