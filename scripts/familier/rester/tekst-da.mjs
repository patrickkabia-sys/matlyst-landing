// Tekst til familien «rester» (da): hvad man kan lave med det, man har. Siderne lister typer af retter, uden opskrifter: rettens navn,
// hvorfor den passer, og hvad du skal bruge ud over det. Rettene er vores forslag og har ingen kilde. Opbevaring står kun med tal eller sætning
// fra Fødevarestyrelsen, Forbrugerrådet Tænk, Madens Verden, Teknologisk Institut eller Arla (de samme som siderne om holdbarhed og frysning).
// Tal skrives aldrig her: h.t(felt) læser dem fra data.da.json, og h.q(id) giver en sætning fra kilden, ordret.
import { kortListe, p, ul } from './bygg-flersprak.mjs';

const og = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} og ${xs.at(-1)}` : xs[0] ?? '');
const retter = (liste) => kortListe(liste.map(([navn, hvorfor, brug]) => [navn, ['Hvorfor den passer', hvorfor], ['Du skal også bruge', brug]]));
export const OPBEVARING = 'Sådan opbevarer du resten';
const opbevaring = (...dele) => [OPBEVARING, dele.join('')];
const SPISEKAMMER = 'I <a href="/da/spisekammer-app/">spisekammeret</a> i Matlyst lægger du ind, hvad du har, og ser, hvor mange dage der er tilbage på hver vare. ';
const SOG = 'Søg i de opskrifter, du har gemt, på varen, så ser du, hvilke der bruger den. Det er almindelig søgning og virker uden AI. ';
const LAV = 'Med <strong>Lav noget af det, jeg har</strong> i Spørg Matlyst får du forslag til aftensmad ud fra varerne i spisekammeret, med tilberedningstid. Det er en Pro-funktion, bruger AI og har en månedlig kvote, så læs resultatet, før du laver maden.';
const app = (...dele) => [
  ['Fra spisekammeret til aftensmad', p(dele.filter((d) => d !== SOG).join(''))],
  ['Søg i dine egne opskrifter', p(`${SOG}Har du ikke gemt noget, der passer, kan du importere en opskrift fra et link og søge i den bagefter.`)],
];

export const TEKST = {
  kjottdeig: (h) => ({
    gruppe: 'Kød og fisk', kort: 'Kødsovs, frikadeller, hakkebøf, millionbøf, tacos og lasagne.',
    tittel: 'Hvad kan man lave med hakket oksekød?',
    h1: 'Hvad kan man lave med hakket oksekød?',
    beskrivelse: 'Seks typer retter, der passer til en pakke hakket oksekød, med hvorfor de passer og hvad du skal bruge ud over det. Dertil hvad Forbrugerrådet Tænk og Madens Verden siger om opbevaring.',
    ingress: 'Hakket oksekød er en af de nemmeste varer at bygge en aftensmad op omkring. Du kan stege det, forme det eller lade det simre i en sovs.',
    svar: `Hakket oksekød passer til kødsovs, frikadeller, hakkebøf, millionbøf, tacos og lasagne. ${h.k('taenk-holdbarhed')} oplyser, at hakket kød kan holde sig op til ${h.t('dage')} i køleskabet, og ${h.k('mv-fryser')}, at hakket oksekød normalt bevarer en god kvalitet i ${h.t('mv-okse')} ved -18 grader.`,
    steg: [['Vælg en rettype', 'Sovs, frikadeller, bøf, tacos eller lasagne.'], ['Se, hvad du har ellers', 'Tomat, løg, kartofler, pasta eller tortillas.'], ['Brug det i tide', 'Følg datoen på pakken.']],
    seksjoner: [
      ['Seks retter, der passer', retter([
        ['Kødsovs med pasta', 'Du bruner kødet og lader det simre med tomat. Der bliver meget mad ud af lidt kød, og sovsen kan laves i stor portion.', 'Hakkede tomater, løg, hvidløg og spaghetti.'],
        ['Frikadeller', 'Farsen formes og steges. Det passer, når du vil have noget, der er nemt at dele i portioner.', 'Æg, mælk og mel eller rasp, og kartofler og sovs til.'],
        ['Hakkebøf med bløde løg', 'Kødet formes til flade bøffer og steges hurtigt. Det går hurtigere end frikadeller.', 'Løg, kartofler og brun sovs.'],
        ['Millionbøf', 'En dansk klassiker, hvor kødet bliver til små bøffer i en tomatsovs, og alle spiser med en skefuld kartoffelmos.', 'Tomatpuré, løg, fløde og kartofler eller ris.'],
        ['Tacos', 'Kødet krydres, og tilbehøret sættes på bordet hver for sig, så alle laver deres egen.', 'Tacokrydderi, skaller eller tortillas, grøntsager og ost.'],
        ['Lasagne', 'Kødsovsen laves først og lægges i lag. Retten kan stå klar, før gæsterne kommer.', 'Lasagneplader, en hvid sovs og revet ost.'],
      ])],
      opbevaring(
        p(`${h.q('pakning')} ${h.q('dato')} ${h.k('taenk-holdbarhed')} oplyser, at hakket kød kan holde sig op til ${h.t('dage')} i køleskab. Køleskabet bør ifølge ${h.k('fvst-koel')} være højst ${h.t('kjol')}.`),
        p(`${h.q('bakterier')}`),
        p(`Hvis du fryser kødet: ${h.q('okse-faar')} ${h.q('ikke-farlig')}`),
      ),
      ...app(SPISEKAMMER, SOG, LAV),
    ],
    faq: [
      ['Hvad kan jeg lave med hakket oksekød og næsten ingenting andet?', 'En enkel kødsovs eller frikadeller. Du vil helst have tomat eller noget, der binder, men det, du har af grøntsager og stivelse, afgør resten.'],
      ['Hvor længe holder hakket kød i køleskabet?', `Forbrugerrådet Tænk oplyser op til ${h.t('dage')} i køleskab.`],
      ['Kan man fryse hakket oksekød?', `Ja. Madens Verden oplyser ${h.t('mv-okse')} ved -18 grader som normal kvalitetsperiode.`],
    ],
  }),

  kylling: (h) => ({
    gruppe: 'Kød og fisk', kort: 'Gryde, wok, suppe, salat og pasta, og hvad Tænk siger om tilberedt kød.',
    tittel: 'Hvad kan man lave med kylling?',
    h1: 'Hvad kan man lave med kylling?',
    beskrivelse: 'Seks typer retter, der passer til kylling, rå eller som rester. Med hvad Forbrugerrådet Tænk og Madens Verden siger om opbevaring.',
    ingress: 'Kylling kan bruges til alt fra wok til suppe. Hvad du vælger, afhænger af, om kyllingen er rå eller allerede stegt.',
    svar: `Rå kylling passer til gryde, wok, ovnret og suppe. Stegt kylling passer til salat, wraps og pasta. ${h.k('taenk-holdbarhed')} oplyser, at tilberedt kød holder sig cirka ${h.t('tilb')} i køleskab, hvis det er varmet grundigt igennem og kølet hurtigt ned.`,
    steg: [['Er den rå eller stegt?', 'Rå til gryde og wok, stegt til salat og wraps.'], ['Se, hvad du har ellers', 'Grøntsager, ris, pasta eller tortillas.'], ['Varm helt igennem', 'Fødevarestyrelsen: maden skal varmes helt igennem.']],
    seksjoner: [
      ['Seks retter, der passer', retter([
        ['Kyllingegryde eller karry', 'Kyllingen får tid til at simre i sovsen. Det er en ret, der kan stå og blive bedre.', 'Løg, tomat eller kokosmælk, krydderier og ris.'],
        ['Wok med grøntsager', 'Kyllingen skæres i strimler og steges hurtigt. Det passer, når du har lidt tid og grøntsager, der skal bruges.', 'Grøntsager, nudler eller ris og en sovs, for eksempel soja.'],
        ['Kyllingesuppe', 'Kyllingen giver smag til bouillonen, og rester af stegt kylling kan rives ned i suppen.', 'Bouillon, grøntsager og pasta eller ris.'],
        ['Ovnret', 'Alt lægges i et fad og går i ovnen. Du behøver ikke stå ved komfuret.', 'Kartofler eller rodfrugter, olie og krydderier.'],
        ['Hønsesalat eller wraps', 'Stegt kylling er allerede færdig. Du skærer eller river den og sætter det sammen.', 'Salat, grøntsager, en dressing og tortillas.'],
        ['Pasta med kylling', 'Rester af kylling passer fint i en flødesovs eller tomatsovs, og pastaen bliver mere mættende.', 'Pasta, fløde eller tomat og noget grønt.'],
      ])],
      opbevaring(
        p(`${h.k('taenk-holdbarhed')} oplyser, at tilberedt kød holder sig cirka ${h.t('tilb')} i køleskab, hvis det er varmet grundigt igennem og kølet hurtigt ned. ${h.q('lufttaet')}`),
        p(`${h.q('varm')}`),
        p(`Hvis du fryser kyllingen i mindre stykker: ${h.q('stykker')} ${h.k('taenk-holdbarhed')} oplyser ${h.t('kylling')} i fryseren for kylling.`),
      ),
      ...app(SPISEKAMMER, 'Så ser du, hvor mange dage kyllingen har tilbage, før du vælger en ret. ', LAV),
    ],
    faq: [
      ['Kan jeg bruge kylling, der blev stegt i går?', `Ja. Forbrugerrådet Tænk oplyser, at tilberedt kød holder sig cirka ${h.t('tilb')} i køleskab, hvis det er varmet grundigt igennem og kølet hurtigt ned.`],
      ['Hvordan skal kyllingen opbevares?', h.q('lufttaet')],
      ['Hvordan varmer jeg kyllingen op?', h.q('varm')],
    ],
  }),

  egg: (h) => ({
    gruppe: 'Æg og mejeri', kort: 'Røræg, æggekage, pandekager og æggesalat.',
    tittel: 'Hvad kan man lave med æg?',
    h1: 'Hvad kan man lave med æg?',
    beskrivelse: 'Retter, der passer til æg, og hvad Forbrugerrådet Tænk siger om, hvor længe de holder i køleskabet.',
    ingress: 'Æg er mere end morgenmad. Her er retterne, du kan bygge på dem.',
    svar: `Æg passer til røræg, æggekage, pandekager og æggesalat. ${h.k('taenk-holdbarhed')} oplyser, at æg skal opbevares i køleskab og kan holde ${h.t('uger')}.`,
    steg: [['Hvad har du?', 'Hele æg eller kogte æg.'], ['Vælg rettype', 'Røræg, æggekage, pandekager eller æggesalat.'], ['Brug sanserne', 'Æg kan ofte holde sig længere end datoen.']],
    seksjoner: [
      ['Fire retter, der passer', retter([
        ['Røræg eller omelet', 'Det er det hurtigste. Du kan bruge det, der ligger i køleskabet, for eksempel skinke, ost eller grøntsagsrester.', 'Smør eller olie og det, du vil have i. Brød til.'],
        ['Æggekage', 'Æggene bliver i panden eller ovnen sammen med bacon og tomat og bliver til en tyk kage, der også er god kold.', 'Bacon eller grøntsager, mælk og mel og tomat eller purløg.'],
        ['Pandekager', 'Æggene er en del af dejen. Har du æg, mælk og mel, skal du ikke bruge meget mere.', 'Mel, mælk og smør til stegning.'],
        ['Æggesalat', 'Kogte æg er allerede klar. Du hakker dem og blander med noget cremet.', 'Mayonnaise, creme fraiche og brød eller rugbrød.'],
      ])],
      opbevaring(
        p(`${h.k('taenk-holdbarhed')} oplyser, at æg skal opbevares i køleskab og kan holde ${h.t('uger')}. Køleskabets temperatur bør ifølge ${h.k('fvst-koel')} være højst ${h.t('kjol')}.`),
        p(`${h.q('sanser')}`),
      ),
      ...app(SPISEKAMMER, SOG, 'Mangler du æg i en opskrift, kan du læse, <a href="/da/erstatning/">hvad du kan bruge i stedet</a>. '),
    ],
    faq: [
      ['Hvor længe holder æg i køleskabet?', `Forbrugerrådet Tænk oplyser ${h.t('uger')}.`],
      ['Kan man spise æg efter datoen?', h.q('sanser')],
      ['Hvor koldt skal køleskabet være?', `Fødevarestyrelsen oplyser højst ${h.t('kjol')}.`],
    ],
  }),

  poteter: (h) => ({
    gruppe: 'Grønt og rodfrugter', kort: 'Ovnbagte, mos, flødekartofler, rösti og suppe, og hvordan kartofler opbevares.',
    tittel: 'Hvad kan man lave med kartofler?',
    h1: 'Hvad kan man lave med kartofler?',
    beskrivelse: 'Retter, der passer til rå kartofler, fra ovnbagte til suppe, og hvad Forbrugerrådet Tænk siger om opbevaring.',
    ingress: 'Kartofler er grundvaren i mange hjem. Her er retterne, du kan bygge på dem.',
    svar: `Rå kartofler passer til ovnbagte kartofler, kartoffelmos, flødekartofler, rösti og suppe. ${h.k('taenk-holdbarhed')} oplyser, at kartofler skal opbevares mørkt og køligt ved ${h.t('kartofler')}, for eksempel i en kølig kælder.`,
    steg: [['Vælg tilberedning', 'Ovn, kogning, stegning eller suppe.'], ['Se, hvad du har ellers', 'Fløde, ost, løg eller kødrester.'], ['Find en kølig plads', 'Mørkt og køligt.']],
    seksjoner: [
      ['Fem retter, der passer', retter([
        ['Ovnbagte kartofler', 'Du skærer, krydrer og lægger kartoflerne i ovnen. Det går næsten af sig selv.', 'Olie, salt og krydderier og noget at have ved siden af.'],
        ['Kartoffelmos', 'En tryg ret til alle. Du kan blande andre rodfrugter i for at bruge dem op.', 'Smør eller mælk og salt.'],
        ['Flødekartofler', 'Tynde skiver lægges i lag og bages i fløde. Retten passer til en lang aftensmad.', 'Fløde eller mælk, hvidløg og ost.'],
        ['Rösti', 'Revne kartofler steges som en flad kage, til de er sprøde.', 'Olie til stegning, salt og gerne løg eller urter.'],
        ['Kartoffelsuppe', 'Kartoflerne gør suppen tyk uden meget fløde. Den passer sammen med porre.', 'Bouillon, porre eller løg og krydderier.'],
      ])],
      opbevaring(
        p(`${h.k('taenk-holdbarhed')} oplyser, at kartofler skal opbevares mørkt og køligt ved ${h.t('kartofler')}, for eksempel i en kølig kælder.`),
      ),
      ...app(SPISEKAMMER, SOG),
    ],
    faq: [
      ['Hvor skal kartofler opbevares?', `Forbrugerrådet Tænk: mørkt og køligt ved ${h.t('kartofler')}.`],
      ['Kan jeg bruge kartofler, der er blevet bløde?', 'Til mos og suppe går det ofte fint. Se efter, om de er grønne eller har spirer.'],
      ['Hvad kan man lave af kartofler, der er til overs?', 'Kog dem og lav biksemad eller kartoffelsalat. Siden om kogte kartofler har flere forslag.'],
    ],
  }),

  'kokte-poteter': (h) => ({
    gruppe: 'Grønt og rodfrugter', kort: 'Biksemad, stegte kartofler, kartoffelsalat og kartoffelmadder fra dagen før.',
    tittel: 'Hvad kan man lave med kogte kartofler fra i går?',
    h1: 'Hvad kan man lave med kogte kartofler fra i går?',
    beskrivelse: 'Kogte kartofler er rester, der er nemme at bruge igen. Fire retter, og hvad Fødevarestyrelsen og Forbrugerrådet Tænk siger om at køle og opbevare rester.',
    ingress: 'Har du kogt for mange? Kogte kartofler er noget af det nemmeste at lave en ny ret af.',
    svar: `Kogte kartofler passer til biksemad, stegte kartofler, kartoffelsalat og kartoffelmadder. ${h.k('fvst-koel')} oplyser, at rester fra middagen skal opbevares i køleskab ved højst ${h.t('kjol')}.`,
    steg: [['Køl dem ned', 'Del store portioner i mindre.'], ['Vælg ret', 'Biksemad, stegte, salat eller madder.'], ['Fryseren', 'Færdige retter kan fryses.']],
    seksjoner: [
      ['Fire retter, der passer', retter([
        ['Biksemad', 'Den klassiske resteret: kogte kartofler i tern steges med løg og det, der er tilbage af kød eller pølse.', 'Løg, kød eller pølse, æg og rødbeder eller syltede agurker.'],
        ['Stegte kartofler', 'Kartoflerne er allerede kogt, så du behøver kun at brune dem i smør.', 'Smør eller olie, salt og gerne æg eller sild til.'],
        ['Kartoffelsalat', 'Du skærer kartoflerne og blander dem med en dressing, mens de er kolde.', 'Mayonnaise eller creme fraiche og rødløg eller purløg.'],
        ['Kartoffelmadder', 'Skiver af kogte kartofler lægges på rugbrød med mayonnaise og purløg. Det er en klassisk dansk madpakke.', 'Rugbrød, mayonnaise, purløg og salt.'],
      ])],
      opbevaring(
        p(`${h.q('rester5')}`),
        p(`${h.q('portioner')} ${h.q('koel')}`),
        p(`${h.k('taenk-holdbarhed')} oplyser ${h.t('faerdige')} i fryseren for færdige retter.`),
      ),
      ...app(SPISEKAMMER, 'Læg de kogte kartofler ind med den dag, du kogte dem, så ser du, hvornår det nærmer sig. ', LAV),
    ],
    faq: [
      ['Hvor skal rester fra middagen opbevares?', h.q('rester5')],
      ['Hvordan køler jeg dem ned?', h.q('portioner')],
      ['Kan jeg fryse kogte kartofler?', `${h.k('taenk-holdbarhed')} oplyser ${h.t('faerdige')} i fryseren for færdige retter.`],
    ],
  }),

  ris: (h) => ({
    gruppe: 'Ris og pasta', kort: 'Stegte ris, risret, suppe og fyldte peberfrugter, og hvordan resterne køles ned.',
    tittel: 'Hvad kan man lave med kogte ris fra i går?',
    h1: 'Hvad kan man lave med kogte ris fra i går?',
    beskrivelse: 'Fire retter, der bruger kogte ris, og hvad Fødevarestyrelsen siger om at opbevare og køle rester ned.',
    ingress: 'Rester af ris er en nem start på næste dags aftensmad.',
    svar: `Kogte ris passer til stegte ris, risret med grøntsager, suppe og fyldte peberfrugter. ${h.k('fvst-koel')} oplyser, at rester fra middagen skal opbevares i køleskab ved højst ${h.t('kjol')}.`,
    steg: [['Køl dem ned', 'Del i mindre portioner.'], ['Vælg ret', 'Stegte ris, risret, suppe eller fyld.'], ['Opbevar køligt', 'Ved højst køleskabets temperatur.']],
    seksjoner: [
      ['Fire retter, der passer', retter([
        ['Stegte ris', 'Kolde ris fra dagen før er det, en stegt risret helst vil have. Du steger dem i en varm pande med det, du har.', 'Æg, grøntsager, soja eller en anden sovs og olie.'],
        ['Risret med grøntsager', 'Risene varmes sammen med grøntsager og krydderier i en gryde eller pande.', 'Grøntsager, krydderier og eventuelt kyllingerester.'],
        ['Suppe', 'Risene gør suppen mere mættende og trækker smag fra bouillonen.', 'Bouillon og grøntsager eller kødrester.'],
        ['Fyldte peberfrugter', 'Risene gør fyldet mættende. Du behøver ikke koge noget nyt.', 'Peberfrugter, ost eller sovs og krydderier.'],
      ])],
      opbevaring(
        p(`${h.q('rester5')}`),
        p(`${h.q('koel')}`),
      ),
      ...app(SPISEKAMMER, 'Læg risene ind med den dag, du kogte dem, så ser du, hvor mange dage de har tilbage. ', LAV),
    ],
    faq: [
      ['Hvor skal kogte ris opbevares?', h.q('rester5')],
      ['Hvor hurtigt skal de køles ned?', h.q('koel')],
      ['Hvad er bedst at lave af ris fra i går?', 'Stegte ris er det mest almindelige. Suppe og fyldte peberfrugter er to andre måder.'],
    ],
  }),

  pasta: (h) => ({
    gruppe: 'Ris og pasta', kort: 'Pastasalat, ovnret, suppe og omelet af kogt pasta.',
    tittel: 'Hvad kan man lave med kogt pasta fra i går?',
    h1: 'Hvad kan man lave med kogt pasta fra i går?',
    beskrivelse: 'Fire retter, der bruger kogt pasta, og hvad Fødevarestyrelsen og Forbrugerrådet Tænk siger om opvarmning, portioner og fryseren.',
    ingress: 'Det er nemt at koge for meget pasta. Her er fire måder at give den nyt liv dagen efter.',
    svar: `Kogt pasta passer til pastasalat, ovnret, suppe og pastaomelet. ${h.k('fvst-koel')} oplyser, at rester skal opbevares i køleskab ved højst ${h.t('kjol')}, og ${h.k('taenk-holdbarhed')} at færdige retter kan holde ${h.t('faerdige')} i fryseren.`,
    steg: [['Del i portioner', 'Mindre portioner køles hurtigere.'], ['Vælg ret', 'Salat, ovnret, suppe eller omelet.'], ['Varm igennem', 'Fødevarestyrelsen: varm maden helt igennem.']],
    seksjoner: [
      ['Fire retter, der passer', retter([
        ['Pastasalat', 'Pastaen er klar. Du blander den med grøntsager og en dressing og spiser den kold, for eksempel i madpakken.', 'Grøntsager, en dressing og noget proteinrigt, som skinke eller æg.'],
        ['Pastaret i fad', 'Pastaen lægges i et fad med sovs og ost og går i ovnen. Retten bliver som en ny aftensmad.', 'En tomat- eller flødesovs, ost og eventuelt kødrester.'],
        ['Pastasuppe', 'Pastaen kan komme i en bouillon med grøntsager, så suppen bliver mere mættende.', 'Bouillon, grøntsager og krydderier.'],
        ['Pastaomelet', 'Kogt pasta blandes med æg og steges som en tyk omelet. Det passer, når der kun er lidt pasta tilbage.', 'Æg, ost og måske lidt skinke eller grøntsager.'],
      ])],
      opbevaring(
        p(`${h.q('portioner')} ${h.q('varm')}`),
        p(`${h.k('taenk-holdbarhed')} oplyser ${h.t('faerdige')} i fryseren for færdige retter.`),
      ),
      ...app(SPISEKAMMER, 'Læg pastaen ind med den dag, du kogte den, så ser du, hvornår det nærmer sig. ', LAV),
    ],
    faq: [
      ['Hvor længe kan kogt pasta stå i køleskabet?', `Fødevarestyrelsen oplyser, at rester skal opbevares ved højst ${h.t('kjol')}. Vi har ikke fundet en dansk kilde med et bestemt antal dage for kogt pasta.`],
      ['Hvordan varmer jeg pasta op?', h.q('varm')],
      ['Kan jeg fryse pasta?', `${h.k('taenk-holdbarhed')} oplyser ${h.t('faerdige')} i fryseren for færdige retter.`],
    ],
  }),

  laks: (h) => ({
    gruppe: 'Kød og fisk', kort: 'Ovnbagt laks, pasta, frikadeller, røget laks og salat, og hvad Tænk siger om frisk fisk.',
    tittel: 'Hvad kan man lave med laks?',
    h1: 'Hvad kan man lave med laks?',
    beskrivelse: 'Retter, der passer til laks, frisk eller røget, og hvad Forbrugerrådet Tænk og Madens Verden siger om opbevaring og frysning.',
    ingress: 'Laks passer til alt fra hverdagsmad til smørrebrød. Her er retterne, og hvordan du tager vare på det, der er tilbage.',
    svar: `Laks passer til ovnbagt laks, laksepasta, laksefrikadeller, røget laks på rugbrød og laksesalat. ${h.k('taenk-holdbarhed')} oplyser, at frisk fisk skal opbevares koldt ved højst ${h.t('max2')}, og at røget laks holder ${h.t('laks')} efter åbning.`,
    steg: [['Er den frisk eller røget?', 'Frisk til ovn og frikadeller, røget til brød og salat.'], ['Se, hvad du har ellers', 'Kartofler, pasta, fløde eller grøntsager.'], ['Spis eller frys', 'Fed fisk holder kortere tid i fryseren.']],
    seksjoner: [
      ['Fem retter, der passer', retter([
        ['Ovnbagt laks med grøntsager', 'Alt går i ét fad. Du skal bare sætte det i ovnen og lave en enkel sovs, mens fisken bages.', 'Kartofler eller rodfrugter, citron, dild og olie.'],
        ['Laksepasta', 'Tilberedt laks pilles i stykker og varmes i en flødesovs. Rester fra gårsdagens aftensmad rækker langt.', 'Pasta, fløde eller creme fraiche og noget grønt.'],
        ['Laksefrikadeller', 'Laksen hakkes og blandes med æg og mel og steges som små frikadeller.', 'Æg, mel, løg og citron.'],
        ['Røget laks på rugbrød', 'Røget laks er færdig og skal bare lægges på brød. Det er det enkleste.', 'Rugbrød, remoulade eller flødeost, citron og dild.'],
        ['Laksesalat', 'Kold laks pilles i stykker og sættes sammen med grøntsager. Det går hurtigt og passer til frokost.', 'Salat, agurk, en dressing og brød.'],
      ])],
      opbevaring(
        p(`${h.q('fiskehandler')} ${h.k('taenk-holdbarhed')} oplyser, at frisk fisk skal opbevares koldt ved højst ${h.t('max2')}, og at fisken ved en almindelig køleskabstemperatur kun kan holde sig ${h.t('fem')}.`),
        p(`${h.q('laenger')} Røget laks holder ${h.t('laks')} efter åbning.`),
        p(`Hvis du fryser laksen: ${h.q('fed-mager')} ${h.k('taenk-holdbarhed')} oplyser ${h.t('fed')} for fed fisk.`),
      ),
      ...app(SPISEKAMMER, 'Så ser du, hvor mange dage laksen har tilbage, før du vælger en ret. ', LAV),
    ],
    faq: [
      ['Hvor længe holder frisk laks i køleskabet?', `Forbrugerrådet Tænk oplyser, at frisk fisk skal opbevares koldt ved højst ${h.t('max2')}, og at den ved en almindelig køleskabstemperatur kun kan holde sig ${h.t('fem')}.`],
      ['Hvor længe holder røget laks?', `Forbrugerrådet Tænk oplyser ${h.t('laks')} efter åbning.`],
      ['Kan man fryse laks?', h.q('fed-mager')],
    ],
  }),

  flaeskesteg: (h) => ({
    gruppe: 'Kød og fisk', kort: 'Flæskestegsmad, biksemad, sandwich, suppe og pastaret af resterne.',
    tittel: 'Hvad kan man lave med rester af flæskesteg?',
    h1: 'Hvad kan man lave med rester af flæskesteg?',
    beskrivelse: 'Fem retter, der bruger rester af flæskesteg, og hvad Forbrugerrådet Tænk og Teknologisk Institut siger om, hvor længe tilberedt kød holder.',
    ingress: 'Flæskestegen rækker ofte længere end til én aften. Her er retterne, der bruger resten.',
    svar: `Rester af flæskesteg passer til flæskestegsmad på rugbrød, biksemad, sandwich, suppe og pastaret. ${h.k('taenk-holdbarhed')} oplyser, at tilberedt kød kan holde sig cirka ${h.t('tilb')} i køleskab, og ${h.k('tek-sikker')} oplyser op til ${h.t('tek')} ved højst 5 grader for tilberedt gris- og oksekød.`,
    steg: [['Se, hvad der er tilbage', 'Skiver, bidder eller sprød svær.'], ['Vælg ret', 'Madder, biksemad, sandwich, suppe eller pasta.'], ['Opbevar rigtigt', 'I en lufttæt pose eller beholder i køleskabet.']],
    seksjoner: [
      ['Fem retter, der passer', retter([
        ['Flæskestegsmad på rugbrød', 'Skiver af den kolde steg lægges på rugbrød med rødkål eller agurkesalat. Det er det enkleste.', 'Rugbrød, rødkål eller syltede agurker og sennep.'],
        ['Biksemad', 'Stegen skæres i tern og steges med kartofler og løg. Retten bruger det, der er tilbage af en aftensmad.', 'Kogte kartofler, løg, æg og rødbeder.'],
        ['Sandwich eller burger', 'Tyndt skåret steg varmes og kommer i et brød med salat og sennep.', 'Brød, salat, sennep eller remoulade og pickles.'],
        ['Suppe', 'Rester og ben giver smag til en bouillon, og kødet kommer i til sidst.', 'Rodfrugter, løg og krydderier.'],
        ['Pastaret', 'Kødet skæres i små stykker og varmes i en sovs sammen med pasta.', 'Pasta, tomat eller fløde og noget grønt.'],
      ])],
      opbevaring(
        p(`${h.q('lufttaet')} ${h.k('taenk-holdbarhed')} oplyser, at kødet kan holde sig cirka ${h.t('tilb')} i køleskab, hvis det er varmet grundigt igennem og kølet hurtigt ned.`),
        p(`${h.k('tek-sikker')} oplyser op til ${h.t('tek')} ved højst 5 grader for tilberedt gris- og oksekød.`),
        p(`${h.q('portioner')} ${h.q('varm')}`),
      ),
      ...app(SPISEKAMMER, 'Læg resterne ind med den dag, du lavede stegen, så ser du, hvornår det nærmer sig. ', LAV),
    ],
    faq: [
      ['Hvor længe holder rester af flæskesteg?', `Forbrugerrådet Tænk oplyser cirka ${h.t('tilb')} i køleskab, hvis kødet er varmet grundigt igennem og kølet hurtigt ned. Teknologisk Institut oplyser op til ${h.t('tek')}.`],
      ['Hvordan skal stegen opbevares?', h.q('lufttaet')],
      ['Hvordan varmer jeg den op?', h.q('varm')],
    ],
  }),

  and: (h) => ({
    gruppe: 'Kød og fisk', kort: 'Andesalat, wraps, suppe og pasta af resterne, og hvordan de opbevares.',
    tittel: 'Hvad kan man lave med rester af and?',
    h1: 'Hvad kan man lave med rester af and?',
    beskrivelse: 'Fire retter, der bruger rester af and, og hvad Fødevarestyrelsen og Forbrugerrådet Tænk siger om at opbevare og varme rester.',
    ingress: 'En and rækker ofte længere end til én aften. Her er retterne, der bruger resten.',
    svar: `Rester af and passer til andesalat, pandekager med and, suppe og pasta. ${h.k('taenk-holdbarhed')} oplyser, at tilberedt kød kan holde sig cirka ${h.t('tilb')} i køleskab, og ${h.k('fvst-koel')} at rester fra middagen skal opbevares ved højst ${h.t('kjol')}.`,
    steg: [['Skær kødet af benet', 'Opbevar det køligt.'], ['Vælg ret', 'Salat, pandekager, suppe eller pasta.'], ['Varm helt igennem', 'Fødevarestyrelsen: maden skal varmes igennem.']],
    seksjoner: [
      ['Fire retter, der passer', retter([
        ['Andesalat', 'Kødet rives og blandes med grøntsager og noget syrligt, for eksempel appelsin eller bær. Det er en let ret efter en tung jul.', 'Salat, appelsin eller æble, nødder og en dressing.'],
        ['Pandekager med and', 'Kødet rives og lægges i tynde pandekager med agurk og hoisin eller en anden sød sovs.', 'Pandekager eller tortillas, agurk, forårsløg og sovs.'],
        ['Suppe på resterne', 'Knogler og rester giver smag til bouillonen, og kødet kommer i til sidst.', 'Rodfrugter, løg og krydderier.'],
        ['Pasta med and', 'Kødet skæres i stykker og varmes i en sovs med pasta.', 'Pasta, fløde eller tomat og svampe.'],
      ])],
      opbevaring(
        p(`${h.k('taenk-holdbarhed')} oplyser, at tilberedt kød kan holde sig cirka ${h.t('tilb')} i køleskab, hvis det er varmet grundigt igennem og kølet hurtigt ned. ${h.q('rester5')}`),
        p(`${h.q('koel')} ${h.q('varm')}`),
      ),
      ...app(SPISEKAMMER, 'Læg resterne ind med den dag, du lavede anden, så ser du, hvornår det nærmer sig. ', LAV),
    ],
    faq: [
      ['Hvor længe holder rester af and?', `Forbrugerrådet Tænk oplyser, at tilberedt kød kan holde sig cirka ${h.t('tilb')} i køleskab.`],
      ['Hvor skal resterne opbevares?', h.q('rester5')],
      ['Hvordan varmer jeg and op?', h.q('varm')],
    ],
  }),

  floete: (h) => ({
    gruppe: 'Æg og mejeri', kort: 'Sovs, flødekartofler, suppe, pastasovs og dessert, og hvad Arla siger om frossen fløde.',
    tittel: 'Hvad kan man lave med fløde, der er til overs?',
    h1: 'Hvad kan man lave med fløde, der er til overs?',
    beskrivelse: 'Retter, der passer til fløde, der er til overs, og hvad Forbrugerrådet Tænk og Arla siger om, hvor længe den holder, og om frossen fløde.',
    ingress: 'Der bliver ofte fløde til overs efter en aftensmad. Her er retterne, der bruger den.',
    svar: `Fløde, der er til overs, passer til sovs, flødekartofler, suppe, pastasovs og dessert. ${h.k('taenk-holdbarhed')} oplyser, at fløde holder sig ${h.t('floede')} efter åbning i køleskabet.`,
    steg: [['Se, hvor meget du har', 'En sjat eller en hel pakke.'], ['Vælg ret', 'Sovs, flødekartofler, suppe eller dessert.'], ['Brug den hurtigt', 'Åbnet fløde holder kun få dage.']],
    seksjoner: [
      ['Fem retter, der passer', retter([
        ['Flødesovs til kød eller fisk', 'En sjat fløde gør en sovs rund og blød. Du skal ikke bruge meget.', 'Bouillon, sennep eller peber og noget at servere til.'],
        ['Flødekartofler', 'Retten kræver ret meget fløde, så den passer, når pakken er næsten fuld.', 'Kartofler, hvidløg og ost.'],
        ['Cremet pastasovs', 'Fløden bliver bunden i en sovs, der er hurtig at lave og passer til det meste.', 'Pasta, ost og noget grønt eller kød.'],
        ['Suppe', 'Fløde til sidst gør suppen blød og rund, for eksempel tomatsuppe eller champignonsuppe.', 'Grøntsager eller svampe, bouillon og krydderier.'],
        ['Dessert', 'Fløden piskes eller koges til en creme, for eksempel panna cotta.', 'Sukker, vanilje og gelatine eller frugt.'],
      ])],
      opbevaring(
        p(`${h.k('taenk-holdbarhed')} oplyser, at fløde skal opbevares på køl, hvor den kan holde sig ${h.t('floede')} efter åbning.`),
        p(`${h.q('floede')}`),
      ),
      ...app(SPISEKAMMER, SOG),
    ],
    faq: [
      ['Hvor længe holder fløde efter åbning?', `Forbrugerrådet Tænk oplyser ${h.t('floede')} i køleskab efter åbning.`],
      ['Kan man fryse fløde?', 'Ja, men fløde, der har været frosset, kan ikke piskes til flødeskum bagefter. Se, hvad Arla skriver, i kilderne.'],
      ['Kan jeg bruge frossen fløde til madlavning?', h.q('floede')],
    ],
  }),

  gulrotter: (h) => ({
    gruppe: 'Grønt og rodfrugter', kort: 'Suppe, gulerodskage, råkost, ovnbagte og boller, og hvordan gulerødder opbevares.',
    tittel: 'Hvad kan man lave med gulerødder?',
    h1: 'Hvad kan man lave med gulerødder?',
    beskrivelse: 'Retter, der passer til gulerødder, og hvad Forbrugerrådet Tænk og Madens Verden siger om opbevaring og om at fryse grøntsager.',
    ingress: 'Gulerødder holder længe, men en pose bliver let glemt. Her er retterne, der bruger dem.',
    svar: `Gulerødder passer til suppe, gulerodskage, råkost, ovnbagte gulerødder og gulerodsboller. ${h.k('taenk-holdbarhed')} oplyser, at gulerødder i en pose med hul i køleskabet kan holde ${h.t('gulerod')}.`,
    steg: [['Se på gulerødderne', 'Bløde kan ofte bruges i suppe.'], ['Vælg ret', 'Suppe, kage, råkost, ovn eller boller.'], ['Fryseren', 'Nogle grøntsager skal blancheres først.']],
    seksjoner: [
      ['Fem retter, der passer', retter([
        ['Gulerodssuppe', 'Gulerødderne koges bløde og blendes. Det er en god måde at bruge bløde gulerødder.', 'Bouillon, løg og gerne ingefær eller appelsin.'],
        ['Gulerodskage', 'Revne gulerødder gør kagen saftig. Der går flere gulerødder til ad gangen.', 'Mel, æg, sukker, olie og kanel.'],
        ['Råkost', 'Du river dem og blander dem med en dressing. En enkel salat, der passer til det meste.', 'Olie, citron og noget sprødt, for eksempel nødder.'],
        ['Ovnbagte gulerødder', 'Hele eller halve gulerødder får sødme i ovnen. Lidt arbejde og meget smag.', 'Olie, salt og krydderier, for eksempel timian.'],
        ['Gulerodsboller', 'Gulerødderne rives og blandes med æg og mel eller gryn og steges i panden.', 'Æg, mel eller havregryn, løg og en sovs.'],
      ])],
      opbevaring(
        p(`${h.k('taenk-holdbarhed')} oplyser: »Opbevar gulerødder i en pose med hul i køleskabet. Der kan de holde i 2-3 uger.« Det vil sige ${h.t('gulerod')}.`),
        p(`${h.q('blanchere')}`),
      ),
      ...app(SPISEKAMMER, SOG),
    ],
    faq: [
      ['Hvor længe holder gulerødder?', `Forbrugerrådet Tænk oplyser ${h.t('gulerod')} i en pose med hul i køleskabet.`],
      ['Kan man fryse gulerødder?', h.q('blanchere')],
      ['Hvad laver jeg af bløde gulerødder?', 'Suppe er det mest oplagte. Gulerodskage og gulerodsboller er andre måder.'],
    ],
  }),

  brod: (h) => ({
    gruppe: 'Brød og frugt', kort: 'Øllebrød, rugbrødschips, rugbrødskrummer og brødtorte, og hvordan brød fryses.',
    tittel: 'Hvad kan man lave med gammelt rugbrød?',
    h1: 'Hvad kan man lave med gammelt rugbrød?',
    beskrivelse: 'Fire retter, der bruger gammelt rugbrød, og hvad Madens Verden siger om at fryse brød og skære det i skiver.',
    ingress: 'Rugbrød bliver tørt, før det bliver dårligt. Her er fire klassiske måder at bruge det på.',
    svar: `Gammelt rugbrød passer til øllebrød, rugbrødschips, rugbrødskrummer og brødtorte. ${h.k('mv-fryser')} oplyser, at brød og boller kan holde ${h.t('brod')} i fryseren.`,
    steg: [['Se på brødet', 'Tørt brød går fint.'], ['Vælg ret', 'Øllebrød, chips, krummer eller brødtorte.'], ['Fryseren', 'Skær i skiver først.']],
    seksjoner: [
      ['Fire retter, der passer', retter([
        ['Øllebrød', 'En gammel dansk ret, hvor tørt rugbrød koges til en tyk grød. Det er den klassiske måde at bruge rugbrød, der er blevet hårdt.', 'Mælk eller øl, sukker og fløde eller mælk til servering.'],
        ['Rugbrødschips', 'Tynde skiver bages sprøde i ovnen. De passer til suppe eller som snack.', 'Olie, salt og krydderier.'],
        ['Rugbrødskrummer', 'Tørt brød hakkes og ristes på panden. Krummerne bruges på salat, suppe eller ovnretter.', 'Smør eller olie og eventuelt hvidløg.'],
        ['Brødtorte', 'Rugbrødskrummer lægges i lag med fløde og syltetøj eller kompot. Det er en gammel dansk dessert.', 'Fløde, syltetøj eller kompot og sukker.'],
      ])],
      opbevaring(
        p(`${h.k('mv-fryser')} oplyser, at brød og boller kan holde ${h.t('brod')} i fryseren. ${h.q('skiver')}`),
      ),
      ...app(SPISEKAMMER, SOG),
    ],
    faq: [
      ['Kan man fryse rugbrød?', `Ja. Madens Verden oplyser ${h.t('brod')} for brød og boller i fryseren.`],
      ['Skal brødet skæres i skiver, før det fryses?', h.q('skiver')],
      ['Hvad kan jeg bruge tørt rugbrød til?', 'Øllebrød er den klassiske ret. Rugbrødschips og rugbrødskrummer er to andre.'],
    ],
  }),

  bananer: (h) => ({
    gruppe: 'Brød og frugt', kort: 'Bananbrød, smoothie, pandekager og is, og hvad Tænk siger om at fryse frugt.',
    tittel: 'Hvad kan man lave med bananer, der er blevet for modne?',
    h1: 'Hvad kan man lave med bananer, der er blevet for modne?',
    beskrivelse: 'Fire retter, der passer til bananer, der er blevet for modne, og hvad Forbrugerrådet Tænk siger om at fryse frugt.',
    ingress: 'Bananer bliver brune hurtigt. Så er de bedst til bagning og smoothies.',
    svar: `Modne bananer passer til bananbrød, smoothie, bananpandekager og is af frosne bananer. ${h.k('taenk-holdbarhed')} oplyser ${h.t('frugt')} i fryseren for frugt og frugtprodukter.`,
    steg: [['Se på bananerne', 'Brune er gode til bagning og smoothies.'], ['Vælg ret', 'Brød, smoothie, pandekager eller is.'], ['Fryseren', 'Frys dem i stykker.']],
    seksjoner: [
      ['Fire retter, der passer', retter([
        ['Bananbrød', 'Modne bananer giver sødme og fugt, så brødet behøver mindre sukker.', 'Mel, æg, smør og bagepulver.'],
        ['Smoothie', 'Bananen blendes med mælk eller yoghurt. Frosne stykker giver en tykkere smoothie.', 'Mælk eller yoghurt og bær.'],
        ['Bananpandekager', 'Moset banan blandes med æg og havregryn og steges som små pandekager.', 'Æg, havregryn og smør til stegning.'],
        ['Is af frosne bananer', 'Frosne stykker blendes, til de bliver cremede som is. Det går uden fløde.', 'En blender eller foodprocessor og gerne kakao eller bær.'],
      ])],
      opbevaring(
        p(`${h.k('taenk-holdbarhed')} oplyser ${h.t('frugt')} i fryseren for frugt og frugtprodukter. Det er en generel oplysning om frugt, ikke et tal for bananer.`),
      ),
      ...app(SPISEKAMMER, SOG),
    ],
    faq: [
      ['Kan man fryse bananer?', `Forbrugerrådet Tænk oplyser ${h.t('frugt')} i fryseren for frugt og frugtprodukter. Tallet gælder frugt generelt.`],
      ['Hvad kan jeg bruge brune bananer til?', 'Bananbrød og smoothies er de mest almindelige. Pandekager og is er to andre måder.'],
      ['Skal bananerne skrælles, før de fryses?', 'Vi har ikke fundet en dansk kilde, der siger noget om det, så siden giver ikke et råd.'],
    ],
  }),
};

const GRUPPER = ['Kød og fisk', 'Æg og mejeri', 'Grønt og rodfrugter', 'Ris og pasta', 'Brød og frugt'];

const GRENSE = 'Forslagene er kun vejledende. Tjek mængder, holdbarhed, og om varerne stadig kan bruges.';

export const NAV = {
  lenke: 'Hvad kan jeg lave?',
  innhold(sider) {
    const grupper = GRUPPER.map((g) => [g, sider.filter((s) => s.c.gruppe === g)]).filter(([, l]) => l.length);
    return {
      tittel: 'Hvad kan jeg lave med det, jeg har?',
      h1: 'Hvad kan jeg lave med det, jeg har?',
      beskrivelse: 'Vælg varen, du har til overs, fra hakket oksekød og kylling til kartofler, ris og rugbrød, og se, hvilke typer retter der passer, og hvordan resten opbevares.',
      grense: GRENSE,
      ingress: 'Vælg varen, du har, og se, hvilke typer retter der passer. Appen kan også foreslå retter ud fra det, du har.',
      svar: 'Vælg varen, du har til overs: ' + og(sider.map((s) => s.rad.navn)) + '. Hver side lister typer af retter, der passer, hvad du skal bruge ud over det, og hvordan resten opbevares, med kilde. Siderne har ingen opskrifter.',
      steg: [['Vælg varen', 'Kød, æg, grønt, ris, pasta, brød eller frugt.'], ['Læs rettene', 'Hvorfor de passer, og hvad du skal bruge ud over det.'], ['Læg varen i spisekammeret', 'Matlyst finder opskrifter og forslag.']],
      seksjoner: [
        ['Fra spisekammeret til aftensmad', p('Læg ind, hvad du har, så matcher Matlyst varerne med opskrifterne i din samling. Du ser med det samme, hvad du kan lave uden en tur i butikken.')],
        ['Søg i dine egne opskrifter', p('Skriv en vare, for eksempel »hakket oksekød«, i søgningen i Matlyst, så ser du, hvilke af dine gemte opskrifter der bruger den. Det er almindelig søgning og virker uden AI.')],
        ['Vælg varen, du har', grupper.map(([g, l]) => `<h3>${g}</h3>${l.map((s) => `<div class="scenario"><h3><a href="${s.href}">${s.c.h1}</a></h3><p>${s.c.kort}</p></div>`).join('')}`).join('')],
        ['Red maden, før den bliver dårlig', p('Matlyst holder øje med datoerne. Når noget nærmer sig, får du forslag til at bruge det op, så mindre mad ender i skraldespanden og mere på tallerkenen.')],
        ['Færre ture i butikken', p('Når du kan se, hvad du allerede kan lave, springer du den ekstra tur over. Du køber mindre, smider mindre ud og bruger det, du allerede har betalt for.')],
        ['Godt at vide', p(GRENSE)],
        ['Sådan er siderne lavet', ul([
          '<strong>Ingen opskrifter.</strong> Hver side har typer af retter, hvorfor de passer, og hvad du skal bruge ud over det, i grove træk.',
          '<strong>Opbevaring kun med kilde.</strong> Tal og sætninger om opbevaring kommer fra Fødevarestyrelsen, Forbrugerrådet Tænk, Madens Verden, Teknologisk Institut og Arla, med link nederst. Hvor vi ikke har en kilde, står der ikke noget.',
          '<strong>Tallene er en ramme.</strong> De kommer fra kilderne og er ingen garanti for en enkelt vare.',
        ])],
        ['Mere fra Matlyst', p('Se også <a href="/da/middagsforslag/">middagsforslag hver dag</a>, <a href="/da/toem-koeleskabet/">tøm køleskabet</a> og <a href="/da/spisekammer-app/">spisekammer-appen</a>. Mangler du en ingrediens? Se <a href="/da/erstatning/">hvad du kan bruge i stedet</a>.')],
      ],
      faq: [
        ['Laver søgningen nye opskrifter?', 'Nej. Den matcher din egen samling. Spørg Matlyst kan lave eller tilpasse en ret.'],
        ['Er siderne gratis?', 'Ja, du behøver ikke appen for at bruge dem. Søgning i egne opskrifter og spisekammeret er også gratis. Forslag til aftensmad fra spisekammeret er en Pro-funktion.'],
        ['Har siderne opskrifter?', 'Nej. De lister typer af retter, der passer, hvorfor, og hvad du skal bruge ud over det.'],
        ['Hvor kommer tallene fra?', 'Fra Fødevarestyrelsen, Forbrugerrådet Tænk, Madens Verden, Teknologisk Institut og Arla. Kilderne står nederst på hver side.'],
      ],
    };
  },
};

