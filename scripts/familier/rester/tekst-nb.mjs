// Teksten til familien «rester» (nb): /hva-kan-jeg-lage/med-<vare>/. Hver side lister typer retter som passer, uten oppskrifter:
// rettens navn, hvorfor den passer og hva du ellers trenger i grove trekk. Oppbevaring står bare der en kilde har et tall eller en
// uttalelse (Mattilsynet, MatPrat, Matvett, melk.no). Retter er våre forslag og har ikke tall. T(id) henter tall fra data.nb.json.
import { kortListe, og, p, ul } from '../erstatning/bygg.mjs';

const retter = (liste) => kortListe(liste.map(([navn, hvorfor, trenger]) => [navn, ['Hvorfor den passer', hvorfor], ['Du trenger ellers', trenger]]));
const oppbevaring = (...deler) => ['Slik oppbevarer du resten', deler.join('')];
// To avsnitt: spiskammeret og søk i egne oppskrifter. Overskriftene styrer hvilke app-bevis siden får (scripts/app-bevis.mjs).
const app = (...deler) => [
  ['Fra spiskammeret til middag', p(...deler.filter((d) => d !== SOK))],
  ['Søk i oppskriftene dine', p(SOK, 'Har du ikke lagret noe som passer, kan du importere en oppskrift fra en lenke og søke i den etterpå.')],
];

const SPISEKAMMER = 'I <a href="/spiskammer-app/">spiskammeret</a> i Matlyst legger du inn det du har, og ser hvor mange dager det er igjen på hver vare. ';
const SOK = 'Søk i oppskriftene du har lagret på ingrediensen, så ser du hvilke som bruker den. Det er vanlig søk og fungerer uten KI. ';
const LAG = 'Med <strong>Lag noe av det jeg har</strong> i Spør Matlyst får du middagsforslag ut fra varene i spiskammeret, med tilberedningstid. Det er en Pro-funksjon, bruker KI og har en månedlig kvote, så les resultatet før du lager maten.';

export const TEKST = {
  kjottdeig: (T) => ({
    gruppe: 'Kjøtt og fisk', kort: 'Saus, boller, taco, gryte og fylte grønnsaker.',
    tittel: 'Hva kan jeg lage med kjøttdeig?',
    h1: 'Hva kan jeg lage med kjøttdeig?',
    beskrivelse: 'Seks typer retter som passer til en pakke kjøttdeig, med hvorfor de passer og hva du trenger ellers. Dessuten hva Mattilsynet og MatPrat sier om oppbevaring.',
    ingress: 'Kjøttdeig er en av de enkleste varene å bygge en middag rundt. Du kan steke den, forme den eller la den koke i en gryte.',
    svar: 'Kjøttdeig passer til kjøttsaus med pasta, kjøttboller, taco, lapskaus, lasagne og fylte grønnsaker. Mattilsynet sier at oppmalt kjøtt bør gjennomsteikes. Rå kjøttdeig holder ' + T('raa') + ' dager i kjøleskapet ifølge MatPrat når den ligger i pose, skål eller kartong.',
    steg: [['Velg en rettype', 'Saus, boller, taco, gryte, lasagne eller fyll.'], ['Sjekk det du har ellers', 'Tomat, løk, poteter, pasta eller tortilla.'], ['Stek ferdig', 'Mattilsynet: oppmalt kjøtt bør gjennomsteikes.']],
    kilder: ['mp-kjoleskap', 'mt-oppbevaring', 'mt-kjokken', 'mp-rester'],
    seksjoner: [
      ['Seks retter som passer', retter([
        ['Kjøttsaus til pasta', 'Du brunser kjøttdeigen og lar den trekke i tomat. Det gir mye mat av litt kjøtt, og sausen tåler å lages i stor porsjon.', 'Hermetiske tomater, løk, hvitløk og pasta.'],
        ['Kjøttboller eller karbonader', 'Deigen formes og steker. Det passer når du vil ha noe som er lett å dele i porsjoner.', 'Noe som binder, som egg, melk eller mel. Poteter og saus til.'],
        ['Taco eller tortilla', 'Kjøttdeigen krydres og settes på bordet med tilbehør hver for seg. Hver person lager sin egen.', 'Tacokrydder, lefser eller skjell, og grønnsaker og ost etter hva du har.'],
        ['Lapskaus eller gryte', 'Kjøttdeigen gir smak uten lang koketid, så retten er klar raskere enn en gryte med grytekjøtt. MatPrat har en lapskaus med kjøttdeig.', 'Poteter, rotgrønnsaker og buljong eller kraft.'],
        ['Lasagne eller ovnsrett', 'Kjøttsausen kan lages først og legges i lag. Retten kan stå klar før gjestene kommer.', 'Lasagneplater, en hvit saus og ost.'],
        ['Fylte grønnsaker', 'Fyllet er allerede ferdig, du trenger bare noe å fylle. Paprika og squash er vanlige valg.', 'Grønnsaker som kan fylles, ost og noe å servere til, som ris.'],
      ])],
      oppbevaring(
        p('Mattilsynet sier at restemat holder seg ' + T('rest-min') + ' til ' + T('rest-maks') + ' dager i kjøleskap, og at du bør fryse maten med en gang hvis du ikke skal spise den snart. MatPrat oppgir at rå kjøttdeig, karbonadedeig og medisterdeig holder ' + T('raa') + ' dager i kjøleskap i pose, skål eller kartong.'),
        p('Mattilsynet skriver at oppmalt kjøtt bør gjennomsteikes. Ved oppvarming til over ' + T('varme') + ' grader i flere minutter blir de aller fleste bakterier drept, ifølge Mattilsynet.'),
      ),
      ...app(SPISEKAMMER, SOK, LAG),
    ],
    faq: [
      ['Hva kan jeg lage med kjøttdeig og ingenting annet?', 'En enkel kjøttsaus eller kjøttboller. Du trenger helst noe tomat eller noe som binder, men det du har av grønnsaker og stivelse avgjør resten.'],
      ['Hvor lenge holder rå kjøttdeig?', 'MatPrat oppgir ' + T('raa') + ' dager i kjøleskap i pose, skål eller kartong.'],
      ['Hvor lenge holder stekt kjøttdeig?', 'Mattilsynet sier at restemat holder seg ' + T('rest-min') + ' til ' + T('rest-maks') + ' dager i kjøleskap.'],
    ],
  }),

  kylling: (T) => ({
    gruppe: 'Kjøtt og fisk', kort: 'Wok, gryte, salat, suppe og wraps, og hva Mattilsynet sier om oppvarming.',
    tittel: 'Hva kan jeg lage med kylling?',
    h1: 'Hva kan jeg lage med kylling?',
    beskrivelse: 'Seks typer retter som passer til kylling, rå eller som rester. Med hva Mattilsynet, MatPrat og Matvett sier om oppbevaring og oppvarming.',
    ingress: 'Kylling går i alt fra wok til suppe. Hva du velger, avhenger av om kyllingen er rå eller allerede stekt.',
    svar: 'Rå kylling passer til wok, gryte, ovnsrett og suppe. Stekt kylling passer til salat, wraps og pastaretter. Mattilsynet oppgir ' + T('rest-min') + ' til ' + T('rest-maks') + ' dager for restemat, og MatPrat ' + T('raa') + ' dager i kjøleskap for rå kylling i pose.',
    steg: [['Er den rå eller stekt?', 'Rå til wok og gryte, stekt til salat og wraps.'], ['Se på det du har ellers', 'Grønnsaker, ris, pasta eller tortilla.'], ['Varm gjennom', 'Mattilsynet: fjørfekjøtt bør gjennomsteikes.']],
    kilder: ['mp-kjoleskap', 'mt-oppbevaring', 'mt-kjokken', 'mv-kylling'],
    seksjoner: [
      ['Seks retter som passer', retter([
        ['Wok eller stekt med grønnsaker', 'Kyllingen skjæres i strimler og steker raskt. Det passer når du har lite tid og en blanding av grønnsaker som må brukes.', 'Grønnsaker, ris eller nudler og en saus, for eksempel soya.'],
        ['Gryte eller curry', 'Kyllingen får tid på å koke i saus. Det er en rett som tåler å stå og bli bedre.', 'Løk, tomat eller kokosmelk, krydder og ris.'],
        ['Suppe', 'Kyllingen gir smak til kraften, og rester av stekt kylling kan rives ned i suppen.', 'Kraft, grønnsaker og pasta eller ris.'],
        ['Ovnsrett', 'Alt legges i et fat og går i ovnen. Du trenger ikke stå ved komfyren.', 'Poteter eller rotgrønnsaker, olje og krydder.'],
        ['Kyllingsalat eller wraps', 'Stekt kylling er allerede ferdig. Du skjærer eller river den og setter sammen.', 'Salat, grønnsaker, en dressing eller saus og lefser.'],
        ['Pasta med kylling', 'Rester av kylling går fint i en saus, og pastaen får mer å tygge på.', 'Pasta, en fløte- eller tomatsaus og noe grønt.'],
      ])],
      oppbevaring(
        p('MatPrat oppgir ' + T('raa') + ' dager i kjøleskap for rå kylling og kalkun i pose, skål eller kartong. Matvett skriver at du bør ta datomerkingen «siste forbruksdag» ganske bokstavelig når det gjelder kylling.'),
        p('For ferdig stekt kylling gjelder Mattilsynets ramme for restemat: ' + T('rest-min') + ' til ' + T('rest-maks') + ' dager i kjøleskap. Mattilsynet skriver at fjørfekjøtt bør gjennomsteikes, og at oppvarming til over ' + T('varme') + ' grader i flere minutter dreper de aller fleste bakterier.'),
      ),
      ...app(SPISEKAMMER, 'Du ser da at kyllingen har noen dager igjen før du bestemmer deg for en rett. ', LAG),
    ],
    faq: [
      ['Kan jeg bruke kylling som er stekt i går?', 'Ja, så lenge du holder deg innenfor Mattilsynets ramme for restemat, ' + T('rest-min') + ' til ' + T('rest-maks') + ' dager i kjøleskap.'],
      ['Hvor lenge holder rå kylling?', 'MatPrat oppgir ' + T('raa') + ' dager i kjøleskap i pose, skål eller kartong.'],
      ['Hvor varmt skal kyllingen bli?', 'Mattilsynet skriver at oppvarming til over ' + T('varme') + ' grader i flere minutter dreper de aller fleste bakterier, og at fjørfekjøtt bør gjennomsteikes.'],
    ],
  }),

  egg: (T) => ({
    gruppe: 'Egg og meieri', kort: 'Omelett, eggekake, pannekaker og hva du gjør med plommer og hviter.',
    tittel: 'Hva kan jeg lage med egg?',
    h1: 'Hva kan jeg lage med egg?',
    beskrivelse: 'Retter som passer til egg, hardkokte egg og overskudd av plommer eller hviter, med MatPrats tall for hvor lenge hver del holder i kjøleskapet.',
    ingress: 'Egg er mer enn frokost. Her er rettene, og hva du gjør når du har plommer eller hviter til overs.',
    svar: 'Egg passer til omelett, eggekake, pannekaker og eggesalat. Hardkokte egg holder ' + T('hardkokte-min') + ' til ' + T('hardkokte-maks') + ' dager i kjøleskapet, eggehviter ' + T('hviter-min') + ' til ' + T('hviter-maks') + ' dager og eggeplommer ' + T('plommer-min') + ' til ' + T('plommer-maks') + ' dager, ifølge MatPrat.',
    steg: [['Hva har du?', 'Hele egg, kokte egg eller bare plommer eller hviter.'], ['Velg rettype', 'Omelett, eggekake, pannekaker eller eggesalat.'], ['Bruk delene', 'Hvitene kan fryses eller brukes i bakst.']],
    kilder: ['mp-kjoleskap', 'mv-egg'],
    seksjoner: [
      ['Fem retter som passer', retter([
        ['Omelett eller eggerøre', 'Det er den raskeste retten. Du kan bruke det som ligger i kjøleskapet, som skinke, ost eller grønnsaksrester.', 'Smør eller olje og det du vil ha i. Brød til.'],
        ['Eggekake', 'Eggene hviler i en panne eller et fat sammen med grønnsaker. Den kan serveres varm eller kald og passer på en matpakke.', 'Poteter, grønnsaker eller kjøttrester og litt ost.'],
        ['Pannekaker eller lapper', 'Eggene er en del av røren. Når du har egg og mel, trenger du lite annet.', 'Mel, melk eller en erstatning og noe å steke i.'],
        ['Eggesalat og fylte egg', 'Hardkokte egg er allerede ferdige. Du hakker dem og blander med noe kremet.', 'Majones, rømme eller yoghurt, og brød eller salat.'],
        ['Plommer til sauser og kremer', 'Eggeplommer brukes i rettene som trenger rikdom og farge. Du slipper da å bruke hele egget.', 'Fløte eller melk, og noe søtt eller surt til å smake til med.'],
      ])],
      oppbevaring(
        p('MatPrat oppgir at hardkokte egg holder ' + T('hardkokte-min') + ' til ' + T('hardkokte-maks') + ' dager i kjøleskapet, eggehviter ' + T('hviter-min') + ' til ' + T('hviter-maks') + ' dager, og eggemasse eller eggeplommer ' + T('plommer-min') + ' til ' + T('plommer-maks') + ' dager.'),
        p('Matvett skriver at mange oppskrifter bare bruker eggeplommene, og oppfordrer: «Ikke kast dem!» om hvitene. Frys dem eller bruk dem i bakst, eggerøre, omelett, sufflé eller sorbet.'),
      ),
      ...app(SPISEKAMMER, SOK, 'Mangler du egg i en oppskrift, kan du lese <a href="/erstatning/egg/">hva du kan bruke i stedet for egg i baking</a>. '),
    ],
    faq: [
      ['Hva kan jeg gjøre med eggehvitene som blir til overs?', 'Matvett foreslår å fryse dem eller bruke dem i bakst, eggerøre og omelett, eller til sufflé og sorbet. MatPrat oppgir at de holder ' + T('hviter-min') + ' til ' + T('hviter-maks') + ' dager i kjøleskap.'],
      ['Hvor lenge holder hardkokte egg?', 'MatPrat oppgir ' + T('hardkokte-min') + ' til ' + T('hardkokte-maks') + ' dager i kjøleskapet.'],
      ['Hvor lenge holder eggeplommer?', 'MatPrat oppgir ' + T('plommer-min') + ' til ' + T('plommer-maks') + ' dager i kjøleskapet.'],
    ],
  }),

  poteter: (T) => ({
    gruppe: 'Grønt og rotfrukt', kort: 'Ovn, mos, grateng, rösti og suppe, og hvordan poteter oppbevares.',
    tittel: 'Hva kan jeg lage med poteter?',
    h1: 'Hva kan jeg lage med poteter?',
    beskrivelse: 'Retter som passer til rå poteter, fra ovnsbakte til suppe, og hva Matvett sier om oppbevaring og poteter som har begynt å spire.',
    ingress: 'Poteter er basisvaren i mange hjem. Her er rettene du kan bygge, og hvordan du holder dem lenger.',
    svar: 'Rå poteter passer til ovnsbakt potet, mos, grateng, rösti, suppe og lapskaus. Matvett skriver at de skal oppbevares mørkt og kjølig, men ikke under ' + T('kjolig') + ' °C, og at tette plastposer bør unngås.',
    steg: [['Velg tilberedning', 'Ovn, koking, steking eller suppe.'], ['Sjekk det du har ellers', 'Fløte, ost, løk eller kjøttrester.'], ['Se på potetene', 'Matvett sier hva du kan gjøre med spirer.']],
    kilder: ['mv-potet', 'mp-rester'],
    seksjoner: [
      ['Seks retter som passer', retter([
        ['Ovnsbakte poteter eller båter', 'Du skjærer, krydrer og legger poteten i ovnen. Det går nesten av seg selv.', 'Olje, salt og krydder, og noe å ha ved siden av.'],
        ['Potetmos', 'Det er en trygg rett til alle. Du kan ha i andre rotgrønnsaker for å bruke dem opp.', 'Smør eller melk, og salt.'],
        ['Potetgrateng', 'Tynne skiver legges i lag og stekes i en saus. Retten passer til en lang middag.', 'Fløte eller melk, ost og eventuelt hvitløk.'],
        ['Rösti eller potetpannekaker', 'Revet potet stekes som en flat kake. MatPrat skriver at kokte revne poteter også kan stekes som rösti.', 'Olje til steking, salt, og gjerne ost eller urter.'],
        ['Potetsuppe', 'Poteten gjør suppen tykk uten fløte. Den passer sammen med purre og andre grønnsaker.', 'Kraft, purre eller løk, og krydder.'],
        ['Lapskaus', 'Poteter, rotgrønnsaker og kjøtt koker i én gryte.', 'Kjøttrester eller kjøtt, rotgrønnsaker og buljong.'],
      ])],
      oppbevaring(
        p('Matvett skriver at poteten skal oppbevares mørkt og kjølig. For de fleste betyr det kjøleskapet, men ikke under ' + T('kjolig') + ' °C. Unngå tette plastposer.'),
        p('Matvett skriver også at poteter i pose er mer sårbare for å tørke ut og raskere utvikler groer. Så lenge selve potetkjøttet ikke er grønt, kan du ifølge Matvett fjerne groene og spise potetene.'),
      ),
      ...app(SPISEKAMMER, SOK),
    ],
    faq: [
      ['Kan jeg bruke poteter som har begynt å spire?', 'Matvett skriver at så lenge selve potetkjøttet ikke er grønt, kan du fjerne groene og spise potetene.'],
      ['Hvor skal poteter oppbevares?', 'Matvett: mørkt og kjølig, men ikke under ' + T('kjolig') + ' °C, og uten tette plastposer.'],
      ['Kan jeg bruke poteter som er tørre og triste?', 'Matvett skriver at poteten fortsatt kan brukes om den ikke er grønn, og at du for eksempel kan lage mos eller rotmos.'],
    ],
  }),

  'kokte-poteter': (T) => ({
    gruppe: 'Grønt og rotfrukt', kort: 'Stekt, potetkaker, salat og lapskaus av dagen før.',
    tittel: 'Hva kan jeg lage med kokte poteter fra i går?',
    h1: 'Hva kan jeg lage med kokte poteter fra i går?',
    beskrivelse: 'Kokte poteter er rester som er enkle å bruke på nytt. Se fem retter, og hva Mattilsynet sier om nedkjøling og hvor lenge restene holder.',
    ingress: 'Har du kokt for mye? MatPrat kaller kokte poteter noe av det enkleste å bruke på nytt.',
    svar: 'Kokte poteter passer til stekte potetskiver, potetlapper, potetsalat, rösti og lapskaus. Mattilsynet sier at restemat holder seg ' + T('rest-min') + ' til ' + T('rest-maks') + ' dager i kjøleskap, og at varm mat skal kjøles ned fra ' + T('avkjol-fra') + ' til ' + T('avkjol-til') + ' °C på senest ' + T('avkjol-timer') + ' timer.',
    steg: [['Kjøl ned raskt', 'Senest ' + T('avkjol-timer') + ' timer fra ' + T('avkjol-fra') + ' til ' + T('avkjol-til') + ' °C.'], ['Velg rett', 'Stekt, lapper, salat eller lapskaus.'], ['Bruk innen ' + T('rest-maks') + ' dager', 'Eller frys.']],
    kilder: ['mp-rester', 'mt-oppbevaring'],
    seksjoner: [
      ['Fem retter som passer', retter([
        ['Stekte potetskiver', 'MatPrat skriver at du kan dele dem i biter og steke dem gylne i en stekepanne eller i ovnen.', 'Smør eller olje, salt, og gjerne egg, bacon eller en grønn salat til.'],
        ['Potetlapper', 'Potetene rives grovt og blandes med egg, urter og krydder, og stekes. MatPrat nevner potetlapper.', 'Egg, urter, krydder og olje til steking.'],
        ['Potetsalat', 'Poteten er allerede kokt. Du skjærer dem og blander med en saus.', 'Rømme, majones eller en vinaigrette, og løk eller urter.'],
        ['Rösti', 'MatPrat skriver at kokte revne poteter kan stekes som en rösti i en stekepanne.', 'Salt, pepper, litt ost eller urter og olje i pannen.'],
        ['Lapskaus av rester', 'Poteter og andre rester kan koke opp i en kraft. Retten bruker mye av det du har. MatPrat nevner også potetmos eller kokte poteter som jevning i en suppe.', 'Kraft, rotgrønnsaker og kjøttrester eller pølse.'],
      ])],
      oppbevaring(
        p('Mattilsynet sier at restemat holder seg ' + T('rest-min') + ' til ' + T('rest-maks') + ' dager i kjøleskap. For varm mat som skal oppbevares kald, bør temperaturen senkes fra ' + T('avkjol-fra') + ' til ' + T('avkjol-til') + ' °C så raskt som mulig, men senest i løpet av ' + T('avkjol-timer') + ' timer.'),
        p('Skal du ikke spise maten snart, sier Mattilsynet at du bør fryse den med en gang.'),
      ),
      ...app(SPISEKAMMER, 'Legg inn de kokte potetene med dagen du kokte dem, så ser du når det nærmer seg. ', LAG),
    ],
    faq: [
      ['Hvor lenge holder kokte poteter i kjøleskapet?', 'Mattilsynet sier at restemat holder seg ' + T('rest-min') + ' til ' + T('rest-maks') + ' dager i kjøleskap.'],
      ['Hvor fort skal de kjøles ned?', 'Mattilsynet: fra ' + T('avkjol-fra') + ' til ' + T('avkjol-til') + ' °C så raskt som mulig, men senest i løpet av ' + T('avkjol-timer') + ' timer.'],
      ['Kan jeg bruke potetmos fra i går?', 'MatPrat skriver at du kan blande en liten rest potetmos med grovhakkede grønnsaksrester.'],
    ],
  }),

  ris: (T) => ({
    gruppe: 'Ris og pasta', kort: 'Stekt ris, suppe, salat og fyll, og hvorfor risen må kjøles raskt.',
    tittel: 'Hva kan jeg lage med kokt ris fra i går?',
    h1: 'Hva kan jeg lage med kokt ris fra i går?',
    beskrivelse: 'Fire retter som bruker kokt ris, og hva Mattilsynet og MatPrat sier om oppbevaring: kjøl raskt, ikke i romtemperatur, og hvor mange dager.',
    ingress: 'Rester av ris er en vanlig start på neste dags middag. Men ris krever mer aktsomhet enn andre rester.',
    svar: 'Kokt ris passer til stekt ris, suppe, risalat og fylte grønnsaker. Mattilsynet sier at du bør ikke oppbevare kokt ris i romtemperatur. MatPrat oppgir at risen holder ' + T('kjoleskap-min') + ' til ' + T('kjoleskap-maks') + ' dager i kjøleskap hvis du kjøler den raskt ned.',
    steg: [['Kjøl raskt', 'Legg risen i en tett boks i kjøleskapet.'], ['Velg en rett', 'Stekt ris, suppe, salat eller fyll.'], ['Bruk den innen ' + T('kjoleskap-maks') + ' dager', 'Eller kok bare det du trenger neste gang.']],
    kilder: ['mt-ris', 'mt-oppbevaring', 'mp-ris', 'mp-rester'],
    seksjoner: [
      ['Fire retter som passer', retter([
        ['Stekt ris', 'Kald ris fra dagen før er det oppskriften helst vil ha. Du steker den i en varm panne sammen med det du har.', 'Egg, grønnsaker, soya eller en annen saus og olje.'],
        ['Suppe', 'Risen gjør suppen mer mettende. MatPrat skriver at kald ris kan gjøre supper eller salater mer mettende.', 'Kraft og grønnsaker eller kjøttrester.'],
        ['Risalat eller kald rett', 'Risen blandes med en dressing og grønnsaker, og spises kald.', 'Grønnsaker, en dressing og noe proteinrikt, som egg eller kylling.'],
        ['Fylte paprika eller squash', 'Risen er det som gir fyllet kropp og mettende. Du trenger ikke koke noe nytt.', 'Grønnsaker som kan fylles, ost eller saus og krydder.'],
      ])],
      oppbevaring(
        p('Mattilsynet skriver at du bør ikke oppbevare kokt ris eller kokt pasta i romtemperatur. De råder deg til å koke bare den mengden ris du trenger til hvert måltid.'),
        p('MatPrat oppgir at du kan oppbevare ris og pasta ' + T('kjoleskap-min') + ' til ' + T('kjoleskap-maks') + ' dager i kjøleskapet hvis du kjøler den raskt ned. MatPrat skriver også: sørg for å avkjøle restene raskt og oppbevar dem i en tett boks i kjøleskapet.'),
      ),
      ...app(SPISEKAMMER, 'Legg inn risen med dagen du kokte den, så ser du hvor mange dager den har igjen. ', LAG),
    ],
    faq: [
      ['Kan jeg bruke ris som har stått ute over natten?', 'Mattilsynet skriver at du bør ikke oppbevare kokt ris eller kokt pasta i romtemperatur.'],
      ['Hvor lenge holder kokt ris i kjøleskapet?', 'MatPrat oppgir ' + T('kjoleskap-min') + ' til ' + T('kjoleskap-maks') + ' dager hvis den kjøles raskt ned.'],
      ['Hva er best å lage med ris fra i går?', 'Stekt ris er den vanligste. MatPrat nevner også suppe og salat.'],
    ],
  }),

  pasta: (T) => ({
    gruppe: 'Ris og pasta', kort: 'Spagettiomelett, pastasalat, ovnsrett og suppe.',
    tittel: 'Hva kan jeg lage med kokt pasta fra i går?',
    h1: 'Hva kan jeg lage med kokt pasta fra i går?',
    beskrivelse: 'Fem retter som bruker kokt pasta, fra spagettiomelett til pastasalat. Med hva Mattilsynet og MatPrat sier om oppbevaring og hvor mange dager.',
    ingress: 'Pasta som blir til overs er lett å gi nytt liv. Du kan steke den, bake den eller bruke den kald.',
    svar: 'Kokt pasta passer til spagettiomelett, pastasalat, ovnsrett og suppe. MatPrat nevner både spagettiomelett og suppe med kortere biter. MatPrat oppgir ' + T('kjoleskap-min') + ' til ' + T('kjoleskap-maks') + ' dager i kjøleskap for ris og pasta som kjøles raskt ned.',
    steg: [['Kjøl raskt ned', 'Pasta skal ikke stå på benken.'], ['Velg en rett', 'Omelett, salat, ovn eller suppe.'], ['Bruk den innen ' + T('kjoleskap-maks') + ' dager', 'Eller frys den ferdige retten.']],
    kilder: ['mt-ris', 'mt-oppbevaring', 'mp-ris', 'mp-rester'],
    seksjoner: [
      ['Fem retter som passer', retter([
        ['Spagettiomelett', 'Pastaen blandes med egg og stekes til en tykk kake. Det er en vanlig måte å bruke spagetti fra dagen før.', 'Egg, ost og olje eller smør til steking.'],
        ['Pastasalat', 'Pastaen kan spises kald. Du blander den med grønnsaker og en saus.', 'Grønnsaker, en dressing og noe som gir smak, som oliven eller skinke.'],
        ['Ovnsrett eller gratinert pasta', 'Pasta, saus og ost går i ovnen sammen. Retten kan stå og vente.', 'En tomat- eller fløtesaus og revet ost.'],
        ['Suppe', 'MatPrat skriver at pasta kan skjæres i kortere biter og brukes i suppe.', 'Kraft, grønnsaker og krydder.'],
        ['Stekt pasta med grønnsaker', 'Pastaen varmes i en panne og får litt farge. Det er en hurtig måte å bruke opp grønnsaksrester.', 'Olje, grønnsaker og ost eller en saus.'],
      ])],
      oppbevaring(
        p('Mattilsynet skriver at du bør ikke oppbevare kokt ris eller kokt pasta i romtemperatur. MatPrat oppgir at du kan oppbevare ris og pasta ' + T('kjoleskap-min') + ' til ' + T('kjoleskap-maks') + ' dager i kjøleskapet hvis du kjøler den raskt ned.'),
        p('Mattilsynet sier også at hvis du ikke skal spise maten snart, bør du fryse den med en gang.'),
      ),
      ...app(SPISEKAMMER, SOK),
    ],
    faq: [
      ['Kan jeg bruke pasta som har stått ute?', 'Mattilsynet skriver at du bør ikke oppbevare kokt pasta i romtemperatur.'],
      ['Hvor lenge holder kokt pasta?', 'MatPrat oppgir ' + T('kjoleskap-min') + ' til ' + T('kjoleskap-maks') + ' dager i kjøleskap.'],
      ['Hva er enklest å lage med kald pasta?', 'MatPrat nevner spagettiomelett. En pastasalat er et annet vanlig valg.'],
    ],
  }),

  laks: (T) => ({
    gruppe: 'Kjøtt og fisk', kort: 'Pasta, suppe, kaker, plukkfisk og salat med laks.',
    tittel: 'Hva kan jeg lage med laks?',
    h1: 'Hva kan jeg lage med laks?',
    beskrivelse: 'Retter som passer til laks, rå eller som rester, med hva Mattilsynet og MatPrat sier om hvor mange dager restene og fisken holder.',
    ingress: 'Laks fra i går kan bli til noe helt annet i dag. Her er rettene, og hva du må passe på.',
    svar: 'Laks passer til pasta med laks, laksesuppe, laksekaker, plukkfisk og salat. Mattilsynet oppgir ' + T('rest-min') + ' til ' + T('rest-maks') + ' dager for ferdig laget restemat, og MatPrat ' + T('fersk-min') + ' til ' + T('fersk-maks') + ' dager i kjøleskap for fersk fisk.',
    steg: [['Er den rå eller ferdig?', 'Rå laks til ovn og suppe, ferdig laks til salat og pasta.'], ['Velg en rett', 'Pasta, suppe, kaker, plukkfisk eller salat.'], ['Se dagene i kilden', 'Mattilsynet og MatPrat oppgir hver sin ramme.']],
    kilder: ['mp-kjoleskap', 'mt-oppbevaring', 'mp-rester'],
    seksjoner: [
      ['Fem retter som passer', retter([
        ['Pasta med laks', 'Lakserester kan deles i biter og røres inn til slutt. Da holder du fisken myk.', 'Pasta, fløte eller crème fraîche, og noe grønt eller sitron.'],
        ['Laksesuppe', 'Fisken gir suppen smak og mettende. Du trenger lite fisk til en stor gryte.', 'Kraft eller fløte, poteter og gulrot.'],
        ['Laksekaker eller fiskekaker', 'Fisken blandes og formes, så stekes den. Det passer når du har litt fisk og vil få det til å strekke til.', 'Egg, mel eller potet som binder, og løk.'],
        ['Plukkfisk', 'MatPrat skriver at plukkfisk er enkelt og raskt å lage av rester av fersk og lettsaltet fisk, og at du kan bruke all slags fisk.', 'Poteter, løk, en hvit saus eller melk og smør.'],
        ['Salat eller smørbrød med laks', 'Fisken er ferdig, så du trenger bare noe ved siden av. Det er en rask lunsj.', 'Brød eller salat, og noe kremet eller surt, som rømme eller sitron.'],
      ])],
      oppbevaring(
        p('For ferdig laget laks gjelder Mattilsynets ramme for restemat: ' + T('rest-min') + ' til ' + T('rest-maks') + ' dager i kjøleskap. MatPrat oppgir ' + T('fersk-min') + ' til ' + T('fersk-maks') + ' dager i kjøleskap for fersk fisk i pose, skål eller kartong.'),
        p('Skal du ikke spise maten snart, sier Mattilsynet at du bør fryse den med en gang.'),
      ),
      ...app(SPISEKAMMER, SOK, LAG),
    ],
    faq: [
      ['Hvor lenge holder fersk laks i kjøleskapet?', 'MatPrat oppgir ' + T('fersk-min') + ' til ' + T('fersk-maks') + ' dager for fersk fisk i pose, skål eller kartong.'],
      ['Hvor lenge holder laksen fra i går?', 'Mattilsynet sier at restemat holder seg ' + T('rest-min') + ' til ' + T('rest-maks') + ' dager i kjøleskap.'],
      ['Kan jeg bruke laks i plukkfisk?', 'MatPrat skriver at du kan bruke all slags fisk i plukkfisk.'],
    ],
  }),

  'kokt-skinke': (T) => ({
    gruppe: 'Kjøtt og fisk', kort: 'Omelett, pai, varme smørbrød, pasta og grateng.',
    tittel: 'Hva kan jeg lage med kokt skinke?',
    h1: 'Hva kan jeg lage med kokt skinke?',
    beskrivelse: 'Retter som bruker kokt skinke fra pakken, fra omelett til pai og pasta, og hva MatPrat oppgir om holdbarhet for pålegg i kjøleskapet.',
    ingress: 'Skinken som ble igjen på pålegget kan bli til varmmat. Her er seks retter som passer.',
    svar: 'Kokt skinke passer til omelett, paier, varme smørbrød, pasta og grateng. MatPrat oppgir ' + T('pose-min') + ' til ' + T('pose-maks') + ' dager i kjøleskap for ferskt og røkt pålegg i pose, skål eller kartong, og ' + T('vakuum') + ' dager vakuumpakket.',
    steg: [['Se hva du har', 'Skiver, biter eller hel skinke.'], ['Velg en rett', 'Omelett, pai, pasta eller varme smørbrød.'], ['Se dagene i kilden', 'MatPrats tall er en ramme, ikke en garanti.']],
    kilder: ['mp-kjoleskap', 'mt-oppbevaring'],
    seksjoner: [
      ['Seks retter som passer', retter([
        ['Omelett eller eggerøre med skinke', 'Skinken er allerede ferdig og trenger bare å varmes. Retten tar få minutter.', 'Egg, smør og gjerne ost.'],
        ['Varme smørbrød eller toast', 'Skinken blir varm sammen med ost og brødet blir sprøtt. Det er en enkel måte å bruke noen skiver.', 'Brød og ost, og eventuelt tomat.'],
        ['Pai eller quiche', 'Skinken er det som gir fyllet smak. Du kan bruke rester av skiver i terninger.', 'Pai- eller mørdeig, egg, fløte eller melk, og ost.'],
        ['Pasta med skinke', 'Skinken skjæres i strimler og røres inn i en kremsaus. En klassisk hverdagsmiddag.', 'Pasta, fløte eller crème fraîche, og ost.'],
        ['Potetgrateng med skinke', 'Skinken legges i lagene av poteter. Den gir salt og mettende smak til et fat som ellers er mildt.', 'Poteter, fløte eller melk og ost.'],
        ['Ertesuppe eller bønnesuppe', 'Skinketerninger gir suppen smak og kropp. Du trenger ikke mye.', 'Erter eller bønner, kraft og løk.'],
      ])],
      oppbevaring(
        p('MatPrat oppgir at ferskt og røkt pålegg, som kokt og røkt skinke, sylte, rull, leverpostei og kylling- og kalkunpålegg, holder ' + T('pose-min') + ' til ' + T('pose-maks') + ' dager i kjøleskap i pose, skål eller kartong, og ' + T('vakuum') + ' dager vakuumpakket. Tallene gjelder varen i emballasjen.'),
        p('Når skinken er brukt i en ferdig rett, regnes den som restemat. Mattilsynet sier at restemat holder seg ' + T('rest-min') + ' til ' + T('rest-maks') + ' dager i kjøleskap.'),
      ),
      ...app(SPISEKAMMER, 'Skinken står ofte lenge uten at noen husker den. Legg den inn med datoen, så ser du hvor mange dager den har igjen. ', SOK),
    ],
    faq: [
      ['Hvor lenge holder kokt skinke i kjøleskapet?', 'MatPrat oppgir ' + T('pose-min') + ' til ' + T('pose-maks') + ' dager for pålegg i pose, skål eller kartong, og ' + T('vakuum') + ' dager vakuumpakket.'],
      ['Hva kan jeg lage med bare noen skiver skinke?', 'Omelett, varme smørbrød eller en kremet pasta bruker lite skinke.'],
      ['Hvor lenge holder en rett med skinke?', 'Mattilsynet sier at restemat holder seg ' + T('rest-min') + ' til ' + T('rest-maks') + ' dager i kjøleskap.'],
    ],
  }),

  floete: (T) => ({
    gruppe: 'Egg og meieri', kort: 'Saus, suppe, grateng, dessert og pisket krem, og frysing i isbiter.',
    tittel: 'Hva kan jeg lage med fløte som snart går ut?',
    h1: 'Hva kan jeg lage med fløte?',
    beskrivelse: 'Fløte til overs? Fem retter som bruker den opp, og hva melk.no sier om frysing i inntil tre måneder og hva fløten egner seg til etter tining.',
    ingress: 'En liten rest fløte kan bli til mer enn en saus. Du kan også fryse den.',
    svar: 'Fløte passer til saus, suppe, grateng, dessert og pisket krem. Melk.no skriver at all fløte kan fryses i inntil ' + T('frys') + ' måneder, og at den etter tining er best i sauser, supper eller fløtestuede poteter.',
    steg: [['Bruk den nå', 'Saus, suppe, grateng eller dessert.'], ['Eller frys den', 'Isbitformer gir en fløteterning til senere.'], ['Bruk den frosne i mat', 'Ikke som pisket krem.']],
    kilder: ['melk-frys'],
    seksjoner: [
      ['Fem retter som passer', retter([
        ['Fløtesaus', 'En skvett fløte og litt kraft er nok til å lage en saus til kjøtt, fisk eller pasta.', 'Kraft eller buljong, noe som gir smak, som sopp, og en jevning om du vil.'],
        ['Kremet suppe', 'Fløten rundes av en suppe og gjør den fyldigere, til slutt og i liten mengde.', 'Grønnsaker eller en base, og kraft.'],
        ['Potetgrateng eller fløtestuede poteter', 'Fløten gir en saus rundt potetene. Melk.no nevner fløtestuede poteter som en passende bruk etter tining.', 'Poteter, salt og eventuelt ost eller hvitløk.'],
        ['Dessert som panna cotta eller kremer', 'Fløten er hovedingrediensen. Du trenger en enkel base og tid til å la den stivne.', 'Sukker, noe som stivner kremen, og bær eller saus.'],
        ['Pisket krem', 'Kremfløte kan piskes. Melk.no skriver at fløte etter tining kan piskes til krem, men at den får et kornete utseende.', 'Kjøleskapskald kremfløte og eventuelt litt sukker.'],
      ])],
      oppbevaring(
        p('Melk.no foreslår å fryse fløte til overs i isbitformer eller isbitposer, så du har en fløteterning klar til sauser og supper. Kilden sier at all fløte kan fryses i inntil ' + T('frys') + ' måneder.'),
        p('Etter tining er fløten ifølge melk.no best egnet i sauser, supper eller fløtestuede poteter. Den kan piskes til krem, men får et kornete utseende, holder ikke like lenge og skiller seg lettere.'),
      ),
      ...app(SPISEKAMMER, 'Legg inn fløten med datoen, så får du en påminnelse før den går ut. Du får også «Har hjemme» på handlelista når fløte står på en oppskrift. ', LAG),
    ],
    faq: [
      ['Kan jeg fryse fløte?', 'Ja. Melk.no skriver at all fløte kan fryses i inntil ' + T('frys') + ' måneder.'],
      ['Kan jeg piske fløte etter tining?', 'Melk.no skriver at den kan piskes, men at den får et kornete utseende og skiller seg lettere.'],
      ['Hva er best å bruke frossen fløte til?', 'Sauser, supper og fløtestuede poteter, ifølge melk.no.'],
    ],
  }),

  gulrotter: (T) => ({
    gruppe: 'Grønt og rotfrukt', kort: 'Suppe, kake, råkost, ovn og kraft, og hvordan de holder seg lenge.',
    tittel: 'Hva kan jeg lage med gulrøtter?',
    h1: 'Hva kan jeg lage med gulrøtter?',
    beskrivelse: 'Retter som passer til gulrøtter, også til de slappe, og hva Matvett og MatPrat sier om oppbevaring i kjøleskap og bruk av gulrøtter som har blitt myke.',
    ingress: 'Gulrøtter er billige og holder lenge. Men de blir slappe, og da er det lurt å vite hva de kan brukes til.',
    svar: 'Gulrøtter passer til suppe, kake, råkost, ovnsbakte gulrøtter og kraft. Matvett skriver at de skal lagres kaldt, mellom ' + T('kaldt-fra') + ' og ' + T('kaldt-til') + ' °C, og at slappe gulrøtter fortsatt kan brukes til kraft eller rotmos.',
    steg: [['Se på gulrøttene', 'Faste, slappe eller revet.'], ['Velg en rett', 'Suppe, kake, råkost, ovn eller kraft.'], ['Lagre dem kaldt', 'Matvett: ' + T('kaldt-fra') + ' til ' + T('kaldt-til') + ' °C.']],
    kilder: ['mv-gulrot', 'mp-gront'],
    seksjoner: [
      ['Fem retter som passer', retter([
        ['Gulrotsuppe', 'Gulrøttene koker mykt og blir til en glatt suppe. Slappe gulrøtter funker like bra som faste.', 'Løk, kraft og gjerne ingefær eller en skvett fløte.'],
        ['Gulrotkake eller gulrot i brød', 'Matvett skriver at du kan rive gulrøttene i brøddeigen eller gulrotkaken. Det gir fuktighet og søthet.', 'Mel, bakepulver, egg, sukker og krydder, eller en brøddeig.'],
        ['Råkost eller salat', 'Revet gulrot er en rask side til mye mat. Den tåler å stå en stund.', 'En dressing, som sitron og olje, og gjerne frukt eller nøtter.'],
        ['Ovnsbakte gulrøtter', 'Hele eller skjært i staver. Ovnen gjør dem søte og myke, og du trenger ikke gjøre noe underveis.', 'Olje, salt og krydder eller honning.'],
        ['Kraft eller rotmos', 'Matvett skriver at slappe gulrøtter fortsatt kan brukes til kraft eller rotmos.', 'Andre rotgrønnsaker og vann til kraft. Smør til mosen.'],
      ])],
      oppbevaring(
        p('Matvett skriver at gulrot skal lagres kaldt, mellom ' + T('kaldt-fra') + ' og ' + T('kaldt-til') + ' °C, og at de er holdbare i flere måneder når de er riktig lagret. Best er originalemballasjen i perforert plast.'),
        p('MatPrat skriver at en slapp gulrot er en selvsagt ingrediens i enhver rett med tomater.'),
      ),
      ...app(SPISEKAMMER, SOK, 'Gulrøtter blir ofte glemt nederst i kjøleskapet. Med dager igjen på varen i spiskammeret blir du minnet om dem. '),
    ],
    faq: [
      ['Kan jeg bruke gulrøtter som er slappe?', 'Ja, ifølge Matvett kan de fortsatt brukes til kraft eller rotmos. MatPrat nevner dem også i retter med tomat.'],
      ['Hvordan lagrer jeg gulrøtter?', 'Matvett: kaldt, mellom ' + T('kaldt-fra') + ' og ' + T('kaldt-til') + ' °C, helst i originalemballasjen i perforert plast.'],
      ['Kan jeg ha gulrot i brød?', 'Matvett skriver at du kan rive gulrøttene i brøddeigen eller gulrotkaken.'],
    ],
  }),

  brod: (T) => ({
    gruppe: 'Brød og frukt', kort: 'Krutonger, arme riddere, brødpudding, brødsalat og frysing.',
    tittel: 'Hva kan jeg lage med gammelt brød?',
    h1: 'Hva kan jeg lage med gammelt brød?',
    beskrivelse: 'Retter som passer til tørt brød, fra krutonger til arme riddere og brødpudding, og hva Matvett sier om å fryse brød og friske opp tørt brød i ovnen.',
    ingress: 'Tørt brød trenger ikke havne i søpla. Det er til og med bedre enn ferskt til noen retter.',
    svar: 'Tørt brød passer til krutonger, arme riddere, brødpudding, brødsalat og griljermel. Matvett skriver at du også kan friske det opp: fukt det og varm det en kort stund på ' + T('ovn') + ' °C i stekeovnen.',
    steg: [['Er brødet tørt eller bare litt gammelt?', 'Tørt brød til retter, gammelt til toast.'], ['Velg en rett', 'Krutonger, arme riddere, pudding eller salat.'], ['Frys neste gang', 'Frys halve brødet før det blir tørt.']],
    kilder: ['mv-brod', 'mp-kjoleskap'],
    seksjoner: [
      ['Fem retter som passer', retter([
        ['Krutonger', 'Brødet skjæres i terninger og stekes sprøtt. De passer til suppe og salat. Matvett nevner krutonger som en bruk av tørt brød.', 'Olje, salt og gjerne urter eller hvitløk.'],
        ['Arme riddere', 'Brødskivene dyppes i en eggerøre og stekes. Matvett nevner arme riddere.', 'Egg, melk, smør til steking og noe søtt eller salt å servere med.'],
        ['Brødpudding', 'Brødet suger til seg en krem av egg og melk og bakes. Matvett nevner brødpudding.', 'Egg, melk, sukker og krydder, og eventuelt frukt.'],
        ['Brødsalat', 'Tørt brød i biter suger til seg dressingen og blir en del av salaten.', 'Tomater, grønnsaker, olje og eddik.'],
        ['Griljermel', 'Tørt brød kan rives eller knuses til smuler som du bruker til å panere.', 'Et kjøkkenredskap til å knuse brødet og noe å panere, som fisk eller kotelett.'],
      ])],
      oppbevaring(
        p('Matvett skriver at du for å unngå mugg best oppbevarer brød i papirpose i en brødboks. Frys ned halve brødet om du ikke tror du rekker å spise det før det blir tørt.'),
        p('Frosne skiver kan ristes direkte, og Matvett skriver at tørt brød blir som nytt om du fukter det og varmer det kort på ' + T('ovn') + ' °C. MatPrat skriver at brød og bakervarer blir raskere tørre i kjøleskapet.'),
      ),
      ...app(SPISEKAMMER, SOK),
    ],
    faq: [
      ['Kan jeg fryse brød?', 'Ja, Matvett anbefaler å fryse ned halve brødet om du ikke rekker å spise det før det blir tørt.'],
      ['Hvordan får jeg tørt brød mykt igjen?', 'Matvett: fukt det og varm det en kort stund på ' + T('ovn') + ' °C i stekeovnen.'],
      ['Skal brød stå i kjøleskapet?', 'MatPrat skriver at brød og bakervarer blir raskere tørre i kjøleskapet. Matvett anbefaler papirpose i en brødboks.'],
    ],
  }),

  bananer: (T) => ({
    gruppe: 'Brød og frukt', kort: 'Kake, pannekaker, smoothie, grøt og søtning i vafler.',
    tittel: 'Hva kan jeg lage med overmodne bananer?',
    h1: 'Hva kan jeg lage med overmodne bananer?',
    beskrivelse: 'Seks retter som passer til brune bananer, og hva Matvett og MatPrat sier om at bananer ikke tåler kjøleskap og holder seg i flere uker etter brune flekker.',
    ingress: 'Brune flekker er ikke et tegn på at bananene er ferdige. De er et tegn på at de er søte.',
    svar: 'Overmodne bananer passer til banankake, pannekaker, smoothie, grøt og vafler. Matvett skriver at bananer holder i flere uker etter at de begynner å få brune flekker, og at de ikke bør lagres under ' + T('ikke-under') + ' °C.',
    steg: [['Se på bananene', 'Brune og myke er best til baking.'], ['Velg en rett', 'Kake, pannekaker, smoothie eller grøt.'], ['Ikke i kjøleskapet', 'Skallet blir grått under ' + T('ikke-under') + ' °C.']],
    kilder: ['mv-banan', 'mp-kjoleskap', 'melk-vafler'],
    seksjoner: [
      ['Seks retter som passer', retter([
        ['Banankake eller bananbrød', 'Bananen gir fuktighet og søthet. Matvett nevner banankake som første bruk av banan som er for brun.', 'Mel, egg, bakepulver eller natron, smør eller olje og litt sukker.'],
        ['Pannekaker eller lapper', 'Bananen moses i røren. Matvett nevner at den kan gå i pannekakerøra.', 'Mel, egg eller en erstatning, og melk.'],
        ['Vafler uten ekstra sukker', 'Melk.no skriver at du kan droppe sukkeret og la bananen være søtningen i vaffelrøren.', 'Vaffelrøre og et vaffeljern.'],
        ['Smoothie', 'Brune bananer gir en rund og søt smoothie. Matvett nevner smoothie.', 'Melk eller yoghurt, og bær eller frukt.'],
        ['Grøt', 'Bananen moses eller skjæres i terninger og røres inn. Matvett nevner grøten.', 'Havregryn eller risgrøt, melk og kanel.'],
        ['Brød eller pannekake med banan og kanel', 'Matvett foreslår banan som pålegg på brødskiva eller pannekaka, med kanel og sukker.', 'Brød eller pannekaker, kanel og litt sukker.'],
      ])],
      oppbevaring(
        p('Matvett skriver at bananer holder i flere uker etter at de begynner å få brune flekker. De bør ikke lagres under ' + T('ikke-under') + ' °C, siden skallet da blir grått.'),
        p('MatPrat skriver at bananer ikke bør stå i kjøleskapet, fordi de blir misfargede og myke.'),
      ),
      ...app(SPISEKAMMER, SOK, 'Bananer som er for modne er en god grunn til å åpne en oppskrift du har lagret. Søk på «banan», så ser du hvilke du har. '),
    ],
    faq: [
      ['Kan jeg bruke bananer med brune flekker?', 'Ja. Matvett skriver at bananer holder i flere uker etter at de begynner å få brune flekker, og at du kan lage banankake, smoothie eller bruke dem i pannekaker og grøt.'],
      ['Skal bananer i kjøleskapet?', 'MatPrat skriver at bananer blir misfargede og myke i kjøleskapet. Matvett: ikke under ' + T('ikke-under') + ' °C.'],
      ['Kan jeg bruke banan i stedet for sukker?', 'Melk.no skriver at du i vaffelrøren kan droppe sukkeret og la bananen være søtningen.'],
    ],
  }),

  epler: (T) => ({
    gruppe: 'Brød og frukt', kort: 'Kake, havregrøt, salat, moset og juice, og hva som skjer ved siden av bananer.',
    tittel: 'Hva kan jeg lage med epler som begynner å bli myke?',
    h1: 'Hva kan jeg lage med epler?',
    beskrivelse: 'Retter som passer til epler, også til de som er på kanten, og hva Matvett og MatPrat sier om at epler holder lenge i kjøleskap og påvirker andre varer.',
    ingress: 'Epler er en av de varene som holder lengst. Når de endelig blir myke, er det mye du kan lage.',
    svar: 'Epler passer til eplekake, eplemos, havregrøt, salat og juice. Matvett skriver at vanlige butikkepler holder seg fint i et par måneder i kjøleskap, og at epler som er på kanten, men ikke muggne eller råtne, kan brukes til kaker, smoothie, coleslaw, juice eller sider.',
    steg: [['Se på eplene', 'Faste, myke eller med små flekker.'], ['Velg en rett', 'Kake, mos, grøt, salat eller juice.'], ['Hold dem unna andre varer', 'Epler gir fra seg etylen.']],
    kilder: ['mv-eple', 'mp-kjoleskap', 'mv-banan'],
    seksjoner: [
      ['Seks retter som passer', retter([
        ['Eplekake eller eplepai', 'Myke epler gir en saftig kake. Matvett nevner kaker som første bruk.', 'Mel, sukker, smør, egg og kanel.'],
        ['Eplemos', 'Eplene koker til mos. Du slipper å skrelle om du vil, og kan bruke epler med skader.', 'Vann, litt sukker og kanel.'],
        ['Havregrøt eller ovnsbakte epler', 'Eple i grøten gir søthet, og ovnsbakte epler er en enkel dessert.', 'Havregryn eller smør, kanel og litt sukker.'],
        ['Coleslaw eller salat', 'Matvett nevner coleslaw. Eplet gir sødme og noe å tygge på.', 'Kål eller kålrot, gulrot og en dressing.'],
        ['Smoothie eller juice', 'Matvett nevner både smoothie og juice for epler som er på kanten.', 'En blender eller en juicer, og noe å blande med.'],
        ['Sider eller gjæret drikke', 'Matvett nevner hjemmelaget sider. Det er en lengre prosess, men en måte å bruke store mengder.', 'Utstyr til gjæring og tid.'],
      ])],
      oppbevaring(
        p('Matvett skriver at vanlige butikkepler som Aroma og Gravenstein holder fint i et par måneder i kjøleskap, og at holdbarheten på kjøkkenbenken reduseres til et par uker. Kilden oppgir ' + T('kjoleskap-fra') + ' til ' + T('kjoleskap-til') + ' °C.'),
        p('MatPrat skriver at frukt som epler og tomater avgir etylen, som kan få andre produkter til å modne raskere. Matvett skriver at bananer bør holdes atskilt fra epler og tomater av samme grunn.'),
      ),
      ...app(SPISEKAMMER, SOK),
    ],
    faq: [
      ['Kan jeg bruke epler med små myke flekker?', 'Matvett skriver at du kan bruke epler som er på kanten, men ikke mugne eller råtne, til kaker, smoothie, coleslaw, juice eller sider. Epler med rift eller små myke flekker bør brukes først.'],
      ['Hvor lenge holder epler?', 'Matvett: et par måneder i kjøleskap for vanlige butikkepler, og et par uker på kjøkkenbenken.'],
      ['Hvorfor skal epler ikke ligge ved siden av bananer?', 'MatPrat og Matvett skriver at epler avgir etylen, som får andre frukter til å modne raskere.'],
    ],
  }),

  'ribbe-og-pinnekjott': (T) => ({
    gruppe: 'Kjøtt og fisk', kort: 'Juletapas, wraps, lapskaus, pai og hash av julematen.',
    tittel: 'Hva kan jeg lage med rester av ribbe og pinnekjøtt?',
    h1: 'Hva kan jeg lage med ribberester og pinnekjøttrester?',
    beskrivelse: 'Fem retter som bruker restene etter julemiddagen, og hva Mattilsynet og MatPrat sier om rask nedkjøling og hvor mange dager restemat holder.',
    ingress: 'Ribbe og pinnekjøtt blir ofte til overs. Her er rettene som passer, og reglene for restene.',
    svar: 'Ribbe- og pinnekjøttrester passer til juletapas, wraps, lapskaus, pai og stekt med poteter. Mattilsynet sier at restemat holder seg ' + T('rest-min') + ' til ' + T('rest-maks') + ' dager i kjøleskap, og at oppvarming til over ' + T('varme') + ' grader i flere minutter dreper de aller fleste bakterier.',
    steg: [['Kjøl raskt ned', 'Pakk inn og sett kaldt.'], ['Velg en rett', 'Tapas, wraps, lapskaus, pai eller stekt med poteter.'], ['Bruk den innen ' + T('rest-maks') + ' dager', 'Eller frys den.']],
    kilder: ['mp-jul', 'mp-ribbe', 'mt-oppbevaring', 'mt-kjokken'],
    seksjoner: [
      ['Fem retter som passer', retter([
        ['Juletapas', 'MatPrat skriver at restene kan brukes til julelunsjer og tapas i løpet av juledagene. Små biter på brød eller kjeks, med noe syrlig.', 'Brød, surkål eller rødkål, sennep eller en saus.'],
        ['Wraps eller smørbrød med ribbe', 'Kjøttet skjæres i skiver eller biter og rulles inn. Det passer når alle har en annen sak å gjøre.', 'Lefser eller brød, kål og en saus.'],
        ['Lapskaus', 'Restene av både ribbe og pinnekjøtt kan skjæres opp og kokes i lapskaus sammen med poteter og rot.', 'Poteter, kålrot eller gulrot og kraft.'],
        ['Stekt med poteter, hash', 'Kjøttet og potetene steker i en panne til de får farge. Du kan ha eggerøre på toppen.', 'Poteter, løk, olje og gjerne egg.'],
        ['Pai eller pizza', 'Kjøttet er allerede ferdig, og du trenger en bunn. Det blir en måte å gjøre julematen til noe annet.', 'En bunn, ost og kål eller løk.'],
      ])],
      oppbevaring(
        p('Mattilsynet sier at restemat holder seg ' + T('rest-min') + ' til ' + T('rest-maks') + ' dager i kjøleskap, og at du bør fryse maten med en gang hvis du ikke skal spise den snart. MatPrat skriver at du bør avkjøle så raskt som mulig, pakke i egnet emballasje og sette kaldt.'),
        p('Mattilsynet skriver at varm mat skal være rykende varm: ved oppvarming til over ' + T('varme') + ' grader i flere minutter blir de aller fleste bakterier drept.'),
      ),
      ...app(SPISEKAMMER, 'Julematen kommer i store mengder. Legg restene inn med datoen, så ser du når de må brukes eller fryses. ', LAG),
    ],
    faq: [
      ['Hvor lenge holder rester av ribbe i kjøleskapet?', 'Mattilsynet sier at restemat holder seg ' + T('rest-min') + ' til ' + T('rest-maks') + ' dager i kjøleskap.'],
      ['Hvordan kjøler jeg ned ribberestene?', 'MatPrat: avkjøl så raskt som mulig, pakk i egnet emballasje og sett kaldt.'],
      ['Hva kan jeg lage med rester av pinnekjøtt?', 'MatPrat nevner juletapas og julelunsjer. Lapskaus og stekt med poteter er andre vanlige valg.'],
    ],
  }),
};

// Lenker til holdbarhet- og frysingssidene (scripts/familier/holdbarhet og frysing) fra oppbevaringsdelen.
const SE = {
  kjottdeig: [['/holdbarhet/kjottdeig-og-kylling/', 'holdbarhet for kjøttdeig og kylling'], ['/frysing/kjottdeig-og-kylling/', 'frysing av kjøttdeig og kylling']],
  kylling: [['/holdbarhet/kjottdeig-og-kylling/', 'holdbarhet for kjøttdeig og kylling'], ['/frysing/kjottdeig-og-kylling/', 'frysing av kjøttdeig og kylling']],
  egg: [['/holdbarhet/egg/', 'holdbarhet for egg'], ['/holdbarhet/kokte-egg/', 'holdbarhet for kokte egg'], ['/frysing/egg/', 'frysing av egg']],
  'kokte-poteter': [['/holdbarhet/rester/', 'hvor lenge rester holder']],
  ris: [['/holdbarhet/kokt-ris-og-pasta/', 'holdbarhet for kokt ris og pasta']],
  pasta: [['/holdbarhet/kokt-ris-og-pasta/', 'holdbarhet for kokt ris og pasta']],
  laks: [['/frysing/fisk/', 'frysing av fisk'], ['/holdbarhet/rester/', 'hvor lenge rester holder']],
  'kokt-skinke': [['/holdbarhet/kjott/', 'holdbarhet for kjøtt']],
  floete: [['/frysing/melk/', 'frysing av melk og meieri']],
  gulrotter: [['/frysing/frukt-og-gronnsaker/', 'frysing av frukt og grønnsaker']],
  brod: [['/frysing/brod/', 'frysing av brød']],
  bananer: [['/frysing/frukt-og-gronnsaker/', 'frysing av frukt og grønnsaker']],
  epler: [['/frysing/frukt-og-gronnsaker/', 'frysing av frukt og grønnsaker']],
  'ribbe-og-pinnekjott': [['/holdbarhet/rester/', 'hvor lenge rester holder'], ['/frysing/middagsrester/', 'frysing av middagsrester']],
};
for (const [id, lenker] of Object.entries(SE)) {
  const mal = TEKST[id];
  TEKST[id] = (T, E, rad) => {
    const c = mal(T, E, rad);
    const i = c.seksjoner.findIndex(([h]) => h === 'Slik oppbevarer du resten');
    if (i < 0) throw new Error(`rester/${id}: ingen oppbevaringsdel å legge «se også» i`);
    c.seksjoner[i] = [c.seksjoner[i][0], `${c.seksjoner[i][1]}${p(`Se også ${og(lenker.map(([h, t]) => `<a href="${h}">${t}</a>`))}.`)}`];
    return c;
  };
}

const GRUPPER = ['Kjøtt og fisk', 'Egg og meieri', 'Grønt og rotfrukt', 'Ris og pasta', 'Brød og frukt'];

export const NAV = {
  lenke: 'Hva kan jeg lage?',
  innhold(sider) {
    const grupper = GRUPPER.map((g) => [g, sider.filter((s) => s.c.gruppe === g)]).filter(([, l]) => l.length);
    return {
      tittel: 'Hva kan jeg lage med det jeg har?',
      h1: 'Hva kan jeg lage med det jeg har?',
      beskrivelse: 'Velg varen du har til overs, fra kjøttdeig og kylling til poteter, ris og brød, og se hvilke typer retter som passer og hvordan resten oppbevares.',
      ingress: 'Velg varen du har, og se hvilke typer retter som passer. Appen kan også foreslå retter ut fra det du har.',
      svar: 'Velg varen du har til overs: ' + og(sider.map((s) => s.rad.navn)) + '. Hver side lister typer retter som passer, hva du trenger ellers, og hvordan resten oppbevares, med kilde. Sidene har ingen oppskrifter.',
      steg: [['Velg varen', 'Kjøtt, egg, grønt, ris, pasta, brød eller frukt.'], ['Les rettene', 'Hvorfor de passer og hva du trenger ellers.'], ['Legg varen i spiskammeret', 'Matlyst finner oppskrifter og forslag.']],
      seksjoner: [
        ['Fra spiskammer til middag', p('Legg inn varene dine, så matcher Matlyst dem mot oppskriftene i samlingen din. Du ser med en gang hva du kan lage uten en tur i butikken.')],
        ['Søk i oppskriftene dine', p('Skriv inn en vare, for eksempel «kjøttdeig», i søket i Matlyst, så ser du hvilke av de lagrede oppskriftene dine som bruker den. Det er vanlig søk og fungerer uten KI.')],
        ['Velg varen du har', grupper.map(([g, l]) => `<h3>${g}</h3>${l.map((s) => `<div class="scenario"><h3><a href="${s.href}">${s.c.h1}</a></h3><p>${s.c.kort}</p></div>`).join('')}`).join('')],
        ['Redd maten før den ryker', p('Matlyst holder øye med datoene. Når noe nærmer seg, får du forslag til å bruke det opp, så mindre mat havner i søpla og mer havner på tallerkenen.')],
        ['Færre butikkturer', p('Når du ser hva du allerede kan lage, dropper du impulsturen til butikken. Du handler mindre, kaster mindre, og bruker opp det du faktisk har betalt for.')],
        ['Slik er sidene laget', ul([
          '<strong>Ingen oppskrifter.</strong> Hver side har typer retter, hvorfor de passer og hva du trenger ellers i grove trekk.',
          '<strong>Oppbevaring bare med kilde.</strong> Tall om dager og temperatur kommer fra Mattilsynet, MatPrat, Matvett eller melk.no, med lenke nederst. Der vi ikke har en kilde, står det ikke noe.',
          '<strong>Tallene er en ramme.</strong> De er hentet fra kildene og er ikke en garanti for en enkelt vare.',
        ])],
        ['Mer fra Matlyst', p('Se også <a href="/middagsforslag/">middagsforslag hver dag</a>, <a href="/tom-kjoleskapet/">tøm kjøleskapet</a> og <a href="/spiskammer-app/">spiskammer-appen</a>. Mangler du en ingrediens? Se <a href="/erstatning/">hva du kan bruke i stedet</a>.')],
      ],
      faq: [
        ['Er sidene gratis?', 'Ja, du trenger ikke appen for å bruke dem. Søk i egne oppskrifter og spiskammeret er også gratis. Middagsforslag fra spiskammeret er en Pro-funksjon.'],
        ['Har sidene oppskrifter?', 'Nei. De lister typer retter som passer, hvorfor, og hva du trenger ellers.'],
        ['Hvor kommer tallene fra?', 'Fra Mattilsynet, MatPrat, Matvett og melk.no. Kildene står nederst på hver side.'],
      ],
    };
  },
};
