// Lange sider på språket «sv» (utkast til Patricks godkjenning). Samme oppbygging som en-rike-sider.mjs:
// felt per path som legges oppå den tynne siden, eller en ny side når path ikke finnes fra før.
// Fakta følger de engelske sidene (funksjonssjekken 18.11.2026). Ingen skjermbilder av engelsk app.
// Matsikkerhetstall fra Livsmedelsverket er IKKE hentet (sidene lot seg ikke lese ut), så tabellen er utelatt.
import { byggRik, founder, illustrasjon, scenario, scenarioNotat } from './rik-sider.mjs';

export const RIK_DATO = '2026-11-18';

const p = (...ps) => ps.map((t) => `<p>${t}</p>`).join('');
const sc = (tittel, o) => scenario(tittel, o, 'sv');
const notat = () => scenarioNotat('sv');

const receptbok = (() => {
  const { html } = byggRik({
    lang: 'sv',
    svarTekst: 'Matlyst är en receptbok-app. Dela ett recept från en webbsida, ett inlägg på Instagram eller en TikTok, eller fota ett recept, så blir det en ren lista med ingredienser och steg som du kan söka i, räkna om, planera med och handla efter. Det är gratis att börja.',
    seksjoner: [
      ['Därför byggde jag appen', founder([
        'Jag är ingen utbildad kock. Jag är utbildad kylmontör.',
      ], 'Patrick, grundare av Matlyst. Mat är mitt kärleksspråk. Jag ville bara sluta tappa bort recepten jag lagar den efter.')
      + p('Som lärling tog jobbet mig in i några av de bästa restaurangköken i min hemstad. Jag var aldrig den som lagade maten. Jag var den som lagade kylrummet innan första beställningen kom in. Därifrån fick jag se på nära håll hur proffs arbetar. Ingenting är slumpmässigt. Allt har en plats, en etikett och ett datum.',
        'Hemma låg mina recept på åtta ställen: anteckningar, OneNote, en receptapp, bokmärken, TikTok, Instagram, YouTube och favoriter. Jag kunde laga mat, men jag hade inget system. Så jag byggde det system jag hade sett i de köken, fast för en vanlig middag hemma.',
        'Resten av sidan visar vad systemet gör, steg för steg, och var det har sina gränser.')],
      ['Så fungerar det i tre steg', p('Du behöver inte flytta hela samlingen första dagen. Börja med de recept du lagar oftast.')
        + '<h3>1. Spara det där du hittade det</h3>'
        + p('Dela en länk eller ett inlägg med Matlyst via delningsmenyn, eller tryck på <strong>Lägg till recept</strong> och välj <strong>Klistra in länk</strong>. Matlyst läser sidan eller bildtexten och gör om den till ett recept: ingredienser med mängder, numrerade steg och en bild när det finns någon. Webbsidor, Instagram, TikTok (även korta länkar) och YouTube-beskrivningar fungerar. Med Matlyst Pro kan du också importera från foton, upp till 20 per recept.')
        + '<h3>2. Kontrollera det och gör det till ditt</h3>'
        + p('Läs receptet innan du sparar det. Ändra en mängd, byt namn på en ingrediens eller lägg till en anteckning. Recept på andra språk översätts till svenska. Mängderna är metriska som standard.')
        + '<h3>3. Hitta det igen på några sekunder</h3>'
        + p('Sök på titel eller ingrediens, eller öppna en mapp. Skriv ”vitlök” och se alla sparade recept som använder den. Markera favoriterna och låt källänken ligga kvar på varje recept, så att du kan gå tillbaka till den som skrev det.')],
      ['Vad en receptapp egentligen ska göra', p('De flesta har redan en receptsamling. Den ligger bara utspridd: en anteckning här, en skärmdump där, en sparad video som du inte hittar längre. En bra receptbok-app gör fyra saker.')
        + '<h3>Den samlar allt på ett ställe</h3>'
        + p('Recept från webbsidor, sociala inlägg och foton sparas på samma sätt, i mappar som du väljer. Varje recept ser likadant ut, så du slipper leta i tre appar efter det du vill ha.')
        + '<h3>Den gör sparade recept möjliga att hitta</h3>'
        + p('En samling du inte kan söka i är bara en större hög. Sökningen ska fungera på ingredienser, för det är så man bestämmer vad man ska laga en tisdagskväll.')
        + '<h3>Den gör recepten till en plan</h3>'
        + p('Lägg recept i en veckomeny, så hamnar ingredienserna på en inköpslista, sammanslagna och sorterade efter butikens avdelningar. Läs mer om <a href="/sv/veckomeny-app/">veckomenyn</a> och <a href="/sv/inkopslista/">inköpslistan från recept</a>.')
        + '<h3>Den hjälper dig medan du lagar maten</h3>'
        + p('Matlagningsläget visar receptet som en checklista som du bockar av. När ett steg nämner en tid föreslår Matlyst en timer, den fortsätter gå i bakgrunden och skärmen stannar tänd. Matlagningsläget kräver internetanslutning.')],
      ['Räkna om ett recept till fler eller färre portioner', p('Ändra antalet portioner mellan 1 och 20 så följer alla mängder med. Omräkningen är linjär, så kontrollera ägg, salt och jäsmedel själv när du bakar, för de skalar inte alltid i rak linje.')],
      ['Fyra situationer, och vad du gör', notat()
        + sc('Säg att du såg en TikTok där mängderna bara sägs', {
          situasjon: 'Skaparen säger ”en rejäl skvätt soja och ungefär två matskedar honung”, och bildtexten består bara av emojis.',
          galt: 'Du tar en skärmdump, tittar aldrig om videon och tappar receptet.',
          gjor: 'Dela videon med receptappen och läs resultatet innan du litar på det.',
          tall: 'Matlyst läser bildtexten. Appen transkriberar inte videon, så mängder som bara sägs finns inte med.',
          matlyst: 'Dela videon, kontrollera utkastet, skriv in mängderna du hörde och spara.' })
        + sc('Säg att du har ärvt ett handskrivet familjerecept', {
          situasjon: '”Smör stort som ett ägg”, ett fläckigt hörn och lutande handstil.',
          galt: 'Kortet ligger kvar i en låda och ingen lagar något efter det.',
          gjor: 'Fota det och importera det som ett recept du kan söka i och räkna om. Fotoimport är en funktion i Matlyst Pro.',
          tall: 'Handstil är det svåra fallet. Kontrollera varje mängd mot kortet innan du sparar.',
          matlyst: 'Importera från foto och rätta sedan det som lästes fel.' })
        + sc('Säg att ett recept ligger sparat på fem ställen', {
          situasjon: 'En anteckning, ett bokmärke, en skärmdump, en pin och en video.',
          galt: 'Du vet inte vilken version som är den bra.',
          gjor: 'Behåll en kopia på ett ställe och skriv en anteckning om vad du ändrade.',
          matlyst: 'Ett recept med källänken på, och dina egna ändringar ovanpå.' })
        + sc('Säg att du planerar middagar för en familj på fyra', {
          situasjon: 'Fem middagar, en budget och ett butiksbesök.',
          galt: 'Två recept behöver var sin lök och du köper tre.',
          gjor: 'Planera veckan först och handla sedan från en sammanslagen lista.',
          matlyst: 'Lägg recepten i veckomenyn och öppna inköpslistan. Likadana varor med samma enhet läggs ihop, och varor som redan finns i ditt skafferi är bortvalda och märkta «I skafferiet» när du lägger till ett recept.' })],
      ['Byt ut en ingrediens eller gör din egen version', p('Har du ingen filmjölk, eller saknas den färska örten? Öppna receptet och be om en ersättning i <strong>Fråga Matlyst</strong>. <strong>Använd det jag har</strong> föreslår byten bland det som finns i ditt skafferi. Du kan också be om en vegetarisk, vegansk, snabbare eller mindre version, eller skriva en egen önskan, till exempel ”gör den mer spännande”.')
        + p('Ändringarna visas som en lista du kan ångra. När du sparar väljer du <strong>Skapa en kopia</strong>, som behåller originalet och länkar tillbaka till källan med markeringen ”anpassat”, eller <strong>Skriv över</strong>, som ersätter ditt eget recept. Fråga Matlyst är en Pro-funktion, använder AI och har en månadskvot. Kontrollera resultatet innan du lagar efter det.')],
      ['Ditt skafferi, och recepten du glömt', p('Matlyst kan hålla reda på vad du har hemma. Sök bland dina sparade recept på en ingrediens från kylskåpet och se vilka som använder den. I den gratis planen visar skafferiet 5 varor. Läs mer om <a href="/sv/skafferi-app/">skafferi-appen</a>.')
        + p('En kväll hade jag en burk miso i kylen, sökte på ”miso” och hittade ett misokycklingrecept som jag sparat och glömt bort. Middagen var bestämd på ett par sekunder. För min ADHD-hjärna betyder det mycket. Middagen är avgjord, och jag kan gå vidare med resten av dagen.')],
      ['Där en receptapp slår de andra sätten att spara recept', p('De flesta använder en blandning av alternativen nedan. Vart och ett fungerar för något, och vart och ett går sönder någonstans.')
        + '<div class="table-wrap"><table><thead><tr><th>Sätt att spara recept</th><th>Det här gör det bra</th><th>Här brister det</th></tr></thead><tbody>'
        + '<tr><td>Skärmdumpar och sparade inlägg</td><td>Snabbt att spara, ingen text att skriva.</td><td>Du kan inte söka på ingrediens, inte räkna om mängder, och inlägget kan försvinna.</td></tr>'
        + '<tr><td>Anteckningsapp eller dokument</td><td>Flexibelt, och allt är ditt.</td><td>Varje recept ser olika ut och inget länkar till en inköpslista.</td></tr>'
        + '<tr><td>Tryckta kort och kokböcker</td><td>Pålitligt i köket och fullt av familjehistoria.</td><td>En enda kopia, lätt att spilla på eller tappa bort, och ingen sökning.</td></tr>'
        + '<tr><td>En receptapp</td><td>Samma upplägg för allt, sökbart, lätt att räkna om och kopplat till veckomeny och inköpslista.</td><td>Du måste spara receptet en gång, och mängder som bara sägs i videor måste skrivas in.</td></tr>'
        + '</tbody></table></div>'
        + p('Jämför du appar? Vår guide <a href="/sv/blogg/valj-receptapp/">Så väljer du receptapp</a> listar vad du ska titta efter, oavsett vilken du väljer.')],
      ['Vad Matlyst inte gör', p('Ett bra verktyg säger var det slutar. Det här kan du räkna med, så att inget kommer som en överraskning i köket.')
        + '<ul><li><strong>Den läser bildtexter, inte ljud.</strong> Matlyst transkriberar inte videor. Om mängderna bara sägs skriver du in dem efter importen.</li>'
        + '<li><strong>Den läser inte kommentarer.</strong> Har skaparen lagt receptet i en kommentar eller bakom en länk i profilen kopierar du in det för hand eller delar länken till receptsidan.</li>'
        + '<li><strong>Ett recept per inlägg.</strong> Visar en reel tre recept får du dela upp dem själv.</li>'
        + '<li><strong>Den räknar inte om enheter vid import.</strong> Mängderna är metriska som standard.</li>'
        + '<li><strong>AI kan göra fel.</strong> Matlyst använder AI för att läsa och översätta recept, så kontrollera mängder och steg innan du lagar, särskilt från foton och handskrift.</li>'
        + '<li><strong>Matlagningsläget kräver internetanslutning.</strong> Du kan läsa ett sparat recept offline i upp till 30 dagar efter senaste synkningen.</li></ul>'],
      ['Vanliga misstag när du ordnar recept', p('Det här är de som kostar mest tid.')
        + '<ul><li><strong>Att spara utan att läsa.</strong> Mängderna är det som går fel. Läs utkastet en gång, varje gång.</li>'
        + '<li><strong>Att ha fem kopior.</strong> Välj ett ställe. Skriv en anteckning om vad du ändrade så slipper du gissa nästa gång.</li>'
        + '<li><strong>Att bara spara videon.</strong> Då tittar du om den varje gång du lagar maten. Spara receptet i stället.</li>'
        + '<li><strong>Att bygga det perfekta mappsystemet först.</strong> Börja med några mappar som Vardagsmiddagar och Helg, och lägg till fler först när du behöver dem.</li>'
        + '<li><strong>Att glömma källan.</strong> Låt länken till skaparen ligga kvar på receptet, så hittar du fler av deras recept senare.</li></ul>'],
      ['Dina recept är dina', p('Du kan exportera alla dina recept när du vill, gratis, som en Matlyst-fil (en zip med mappar och bilder) eller som HTML. Flyttar du från Paprika? <a href="/sv/byt-fran-paprika/">Importera din Paprika-export</a>, så blir dina kategorier till mappar. Har du recept på papper? Se <a href="/sv/handskrivna-recept/">handskrivna recept</a>, och för länkar från andra sidor <a href="/sv/importera-recept/">importera recept</a>.')
        + p('Du kan läsa dina recept och din inköpslista offline i upp till 30 dagar efter senaste synkningen. Redigering och matlagningsläget kräver anslutning.')],
      ['Så kommer du igång utan att det blir ett projekt', p('Det vanligaste skälet till att en receptsamling inte blir av är att det känns som ett stort jobb. Gör det litet. Spara tre recept du lagar nästa vecka, och läs utkasten ordentligt. Lägg dem i veckomenyn och skicka dem till inköpslistan. Då har du provat hela kedjan, från sparat recept till handlad vara, på en kväll.')
      + p('Därefter kan du lägga till fler, ett recept i taget, när du ändå hittar något du vill laga. Efter ett par veckor har du en samling som speglar det du faktiskt äter, inte det du tänkte att du skulle laga.')],
    ['Planer, gränser och delning', p('Matlyst är gratis att börja med: 5 importer per kalendermånad, och skafferiet visar 5 varor. Att spara recept, mappar, sökning, veckomenyn och inköpslistan fungerar i den gratis planen. Matlyst Pro ger fler importer, fotoimport, Fråga Matlyst och möjlighet att skapa ett hushåll.')
        + p('En Pro-medlem kan skapa ett hushåll för upp till 6 personer, och det är gratis att gå med. Inköpslistan, veckomenyn och skafferiet delas och uppdateras direkt för alla. På sidan om <a href="/sv/inkopslista/">inköpslistan</a> står hur delningen fungerar.')],
    ],
  });
  return html;
})();

const ill = (fil, tekst) => illustrasjon('sv', fil, tekst);

const instagram = byggRik({
  lang: 'sv',
  svarTekst: 'Öppna inlägget eller reelen, tryck på dela, välj Matlyst och kontrollera receptutkastet som byggs av bildtexten. Spara det, så blir det ett sökbart recept med ingredienser och steg, inte ett bokmärke du aldrig hittar igen. Det fungerar när receptet står i bildtexten. Matlyst transkriberar inte tal eller text som bara visas i videon, och laddar inte ner videon.',
  seksjoner: [
    ['Tre sätt att spara Instagram-recept, och var vart och ett brister', p('De flesta använder ett av dessa. Alla tre fungerar ett tag, och sedan behöver du receptet.')
      + '<h3>Instagrams egen sparaknapp</h3>'
      + p('Det går snabbt, och inlägget ligger kvar bland dina sparade. Haken är att det är ett bokmärke, inte ett recept. Du kan inte söka på ingrediens, räkna om portioner eller lägga det på en inköpslista, och om skaparen tar bort inlägget är det borta.')
      + '<h3>En skärmdump eller en kopierad bildtext</h3>'
      + p('Du behåller texten, men en skärmdump av en lång bildtext är svår att läsa senare, och kopierad text blir en textvägg i en anteckningsapp. Ingen av dem går att söka i som ett riktigt recept.')
      + '<h3>Att spara reelen i kamerarullen</h3>'
      + p('Du behåller videon, men mängderna sägs ofta bara eller blinkar förbi på skärmen en sekund. Du tittar om den varje gång du lagar maten.')
      + '<h3>Att dela direkt med en receptapp</h3>'
      + p('Inlägget blir ett strukturerat recept med ingredienser, mängder och numrerade steg. Det är det resten av guiden visar.')],
    ['Så sparar du ett recept från Instagram, steg för steg', ill('share-instagram-post-to-matlyst', 'Ett Instagram-inlägg delas med Matlyst med några tryck.')
      + '<ol><li><strong>Öppna inlägget eller reelen</strong> som har receptet i bildtexten.</li>'
      + '<li><strong>Tryck på delaikonen</strong> (pappersflygplanet), gå vidare till fler delningsalternativ och välj <strong>Matlyst</strong> i applistan. Syns den inte direkt, bläddra i listan.</li>'
      + '<li><strong>Vänta en stund</strong> medan Matlyst läser bildtexten.</li>'
      + '<li><strong>Läs utkastet.</strong> Jämför mängder och steg med inlägget.</li>'
      + '<li><strong>Rätta det som ser fel ut,</strong> välj en mapp och spara.</li></ol>'
      + p('Vill du inte använda delningsmenyn? Kopiera inläggets länk, öppna <strong>Lägg till recept</strong> i Matlyst och välj <strong>Klistra in länk</strong>. Går det att kopiera receptets text men inte att läsa länken, klistra in texten under <strong>Skriv in</strong>.')
      + ill('add-matlyst-to-share-sheet', 'Så lägger du till Matlyst i delningsmenyn om den inte syns.')],
    ['Det här fann vi när vi testade', p('Den 18 november 2026 importerade vi två riktiga reels. En kort bildtext med 5 ingredienser och 5 steg gav 5 av 5 ingredienser och 5 av 5 steg. En lång bildtext på 1 716 tecken, med 18 ingredienser i tre grupper, gav 18 av 18 ingredienser och 5 av 5 steg, trots att Instagram klipper långa bildtexter med ”… mer”.')
      + p('Det är två reels, inte ett löfte. Bildtexter varierar, så läs utkastet varje gång. Mängderna är det som går fel.')],
    ['När receptet inte står i bildtexten', p('Vissa skapare lägger receptet i en kommentar, bakom en länk i profilen eller bara i videon. Så här är det med vad Matlyst kan och inte kan göra.')
      + '<ul><li><strong>Recept i en kommentar eller länk i profilen.</strong> Matlyst läser inte kommentarer. Kopiera receptet från kommentaren och klistra in det under <strong>Skriv in</strong>, eller dela länken om den går till en receptsida.</li>'
      + '<li><strong>Recept som bara sägs i videon.</strong> Matlyst transkriberar inte tal och läser inte text som bara visas i en reel. Titta en gång och lägg sedan till mängderna själv efter importen.</li>'
      + '<li><strong>Flera recept i en reel.</strong> Matlyst importerar ett recept per inlägg. Dela upp dem för hand.</li>'
      + '<li><strong>Privata, borttagna eller begränsade inlägg.</strong> Matlyst behöver komma åt ett offentligt inlägg, så dessa kanske inte går att läsa.</li>'
      + '<li><strong>Videon laddas inte ner.</strong> Matlyst sparar det strukturerade receptet och källänken, inte videofilen.</li></ul>'],
    ['Det här ska du kontrollera i utkastet innan du sparar', p('Att läsa utkastet tar en minut, och det är steget som avgör om receptet fungerar. Gå igenom i den här ordningen.')
      + '<ol><li><strong>Mängder och enheter.</strong> Har varje ingrediens en siffra? En saknad mängd betyder oftast att skaparen inte skrev någon. Mängderna är metriska och Matlyst räknar inte om mellan enheter.</li>'
      + '<li><strong>Ingrediensgrupper.</strong> Långa bildtexter delar ofta upp ingredienserna i grupper, som sås, fyllning och topping. Se till att inget hamnat i fel grupp.</li>'
      + '<li><strong>Ugnstemperatur och tider.</strong> De är lätta att missa i en lång bildtext. Jämför med inlägget.</li>'
      + '<li><strong>Stegen.</strong> Kommer de i rätt ordning, och är varje steg något du gör? Stryk det som är ett skämt eller en hashtag.</li>'
      + '<li><strong>Språket.</strong> Stod bildtexten på ett annat språk är receptet översatt till svenska. Titta på ingrediensnamn du inte känner igen.</li></ol>'
      + p('Matlyst använder AI för att läsa och översätta recept, och AI kan göra fel. Därför kommer utkastet först och sparandet sedan.')],
    ['Efter att du sparat: det här kan du göra med receptet', p('Ett sparat recept är ett vanligt Matlyst-recept, så du får allt det andra också.')
      + '<ul><li><strong>Räkna om det</strong> mellan 1 och 20 portioner.</li>'
      + '<li><strong>Planera det.</strong> Lägg det i veckomenyn och skicka ingredienserna till en inköpslista, sammanslagen och sorterad efter butikens avdelningar.</li>'
      + '<li><strong>Laga efter det.</strong> Matlagningsläget visar stegen som en checklista och föreslår timers utifrån stegtexten. Det kräver internetanslutning.</li>'
      + '<li><strong>Anpassa det.</strong> Med Fråga Matlyst, en Pro-funktion, kan du be om en vegansk, snabbare eller mindre version och spara den som en kopia.</li>'
      + '<li><strong>Ta det med dig.</strong> Exportera alla recept gratis som en Matlyst-fil eller HTML.</li></ul>'
      + p('Matlyst är gratis att börja med, med 5 importer per kalendermånad. Matlyst Pro ger fler importer och fotoimport.')],
    ['Fyra situationer, och vad du gör', notat()
      + sc('Säg att bildtexten slutar med ”… mer”', {
        situasjon: 'Du ser en pastagratäng, trycker och bildtexten är avklippt efter ingredienserna.',
        galt: 'Du sparar inlägget och hittar senare ett halvt recept.',
        gjor: 'Dela inlägget och läs utkastet innan du sparar.',
        tall: 'I vårt test av en lång bildtext kom alla 18 ingredienser och 5 steg med.',
        matlyst: 'Dela, läs utkastet, lägg till det som saknas och spara.' })
      + sc('Säg att mängderna bara finns i en berättarröst', {
        situasjon: 'Skaparen säger ”fem deciliter mjöl” högt och skriver ingenting.',
        galt: 'Matlyst läser bildtexten, inte ljudet, så det finns inga mängder att importera.',
        gjor: 'Titta en gång och skriv sedan in mängderna du hör i receptet.',
        matlyst: 'Importera inlägget, redigera ingredienslistan och spara.' })
      + sc('Säg att du sparat 40 recept och inte hittar soppan', {
        situasjon: 'Dina sparade inlägg på Instagram är ett långt rutnät av miniatyrer.',
        galt: 'Du skrollar i tio minuter och ger upp.',
        gjor: 'Flytta recepten du faktiskt lagar till en samling du kan söka i.',
        matlyst: 'Sök på ”linser” eller öppna en mapp.' })
      + sc('Säg att du vill ha receptet för sex, inte fyra', {
        situasjon: 'En skapare lagar mat till fyra, och du har gäster.',
        galt: 'Du räknar i huvudet och missbedömer saltet.',
        gjor: 'Ändra portionerna. Omräkningen är linjär, så kontrollera ägg och jäsmedel själv när du bakar.',
        matlyst: 'Ändra portionerna från 4 till 6, mellan 1 och 20 totalt.' })],
    ['Några ord om hur du sparar utan att samla på hög', p('Instagram gör det lätt att spara och svårt att hitta tillbaka. Det som hjälper är en enkel vana: spara bara det du tänker laga, välj mapp direkt och skriv en rad om vad du ändrade när du lagat det. Då blir samlingen något du använder, inte en hög du skäms över.')
      + p('Fungerar bildtexten dåligt kan du alltid skriva in receptet själv: tryck på <strong>Lägg till recept</strong> och välj <strong>Skriv in</strong>. Det går snabbt när du har ingredienslistan framför dig, och du får samma upplägg som alla andra recept: sökbart, omräkningsbart och redo för inköpslistan.')],
    ['Det verkliga problemet: mängder saknas', p('Den vanligaste orsaken till att ett sparat Instagram-recept är oanvändbart är att skaparen aldrig skrev ner mängderna. Matlyst kan inte hitta på dem, och ska inte göra det. När du ser ”salt och peppar” utan mängd, eller bara ”en skvätt soja”, behandla utkastet som en början. Smaka, justera och spara dina egna mängder så slipper du gissa nästa gång.')],
    ['Respekt för skaparen', p('Varje recept som sparas från Instagram visar sin källa: plattformen och skaparens användarnamn, i en etikett på receptet. Tryck på den för att öppna originalinlägget, eller skaparens profil om inläggslänken saknas, så att du kan gå tillbaka för fler recept. Jag byggde det så av respekt för dem som skriver recepten. När du anpassar ett recept med Fråga Matlyst behåller kopian den ursprungliga källan, markerad som ”anpassat”.')
      + p('Matlyst sparar det strukturerade receptet och källänken. Videon laddas inte ner som fil.')
      + p('Källan följer med. Privat eller otillgängligt innehåll kan inte alltid importeras.')],
    ['Vanliga misstag', '<ul><li><strong>Att spara utan att kontrollera.</strong> Läs alltid utkastet en gång. Mängderna är det som går fel.</li>'
      + '<li><strong>Att lita på en skärmdump.</strong> Det är en bild, inte ett recept.</li>'
      + '<li><strong>Att bara spara reelen.</strong> Då tittar du om den varje gång.</li>'
      + '<li><strong>Att inte behålla källan.</strong> Låt skaparens länk ligga kvar på receptet.</li></ul>'
      + p('När ett recept är sparat kan du räkna om det, lägga det i din <a href="/sv/veckomeny-app/">veckomeny</a> och skicka ingredienserna till din <a href="/sv/inkopslista/">inköpslista</a>. Vill du ha helheten? Se sidan om <a href="/sv/receptbok-app/">receptbok-appen</a>, eller spara från <a href="/sv/spara-recept-fran-tiktok/">TikTok</a> och <a href="/sv/handskrivna-recept/">handskrivna recept</a> också.')],
  ],
}).html;

const tiktok = byggRik({
  lang: 'sv',
  svarTekst: 'Öppna TikTok-videon, tryck på dela, välj Matlyst och granska receptutkastet som byggs av videons bildtext. Spara det, så kan du söka i det, räkna om det och handla efter det. Det fungerar när receptet står i bildtexten, och korta länkar som vm.tiktok.com fungerar också. Matlyst transkriberar inte tal eller text som bara visas i videon, och laddar inte ner videon.',
  seksjoner: [
    ['Därför räcker inte TikToks egna favoriter', p('Favoriter sparar videon, inte receptet. Du tittar om 40 sekunder varje gång du lagar maten, du kan inte söka på ingrediens, och om skaparen tar bort videon är receptet borta.')],
    ['Så sparar du ett recept från TikTok, steg för steg', illustrasjon('sv', 'share-tiktok-video-to-matlyst', 'En TikTok delas med Matlyst med några tryck.')
      + '<ol><li><strong>Öppna TikTok-videon</strong> som har receptet i bildtexten.</li>'
      + '<li><strong>Tryck på dela</strong> och välj sedan <strong>Matlyst</strong>. Syns den inte, öppna applistan och välj den där. Du kan också kopiera länken, trycka på <strong>Lägg till recept</strong> i Matlyst och välja <strong>Klistra in länk</strong>.</li>'
      + '<li><strong>Vänta en stund</strong> medan Matlyst läser bildtexten.</li>'
      + '<li><strong>Läs utkastet.</strong> Jämför mängder och steg med videon.</li>'
      + '<li><strong>Rätta det som ser fel ut,</strong> välj en mapp och spara.</li></ol>'
      + p('Korta länkar som vm.tiktok.com, vt.tiktok.com och tiktok.com/t/ fungerar.')],
    ['När bildtexten saknar recept', p('Matlyst läser bildtexten, inte ljudet. Appen transkriberar inte tal och läser inte text som bara visas inne i videon. Om en skapare säger ”två matskedar honung” högt och inte skriver något finns det inget att importera. Skapa receptet för hand med mängderna du hör, eller leta efter en skriven version på skaparens profil eller webbplats. En TikTok utan någon text går inte att importera. Videon laddas aldrig ner. Matlyst sparar bara receptet och källänken.')],
    ['Det här ska du kontrollera i utkastet innan du sparar', p('Ta en minut med utkastet. Det är steget som avgör om receptet fungerar när du lagar det.')
      + '<ul><li><strong>Mängder och enheter.</strong> En saknad siffra betyder oftast att skaparen inte skrev någon. Mängderna är metriska och Matlyst räknar inte om mellan enheter.</li>'
      + '<li><strong>Stegen i ordning.</strong> TikTok-texter är korta och ibland rörigt ordnade. Flytta eller ta bort steg tills de stämmer med videon.</li>'
      + '<li><strong>Temperaturer och tider.</strong> Jämför med vad skaparen säger eller visar.</li>'
      + '<li><strong>Översatta namn.</strong> Stod bildtexten på ett annat språk är receptet översatt till svenska. Kolla ingrediensnamn du inte känner igen.</li></ul>'
      + p('Matlyst använder AI för att läsa och översätta recept, och AI kan göra fel. Läs innan du lagar.')],
    ['Efter att du sparat', p('Receptet är nu ett vanligt Matlyst-recept. Räkna om det mellan 1 och 20 portioner, lägg det i din <a href="/sv/veckomeny-app/">veckomeny</a> och skicka ingredienserna till din <a href="/sv/inkopslista/">inköpslista</a>. Öppna det i matlagningsläget för en checklista och timers som föreslås utifrån stegen. Den gratis planen har 5 importer per kalendermånad, och Matlyst Pro ger fler.')],
    ['Fyra situationer, och vad du gör', notat()
      + sc('Säg att en video på 30 sekunder bara visar mängderna på skärmen', {
        situasjon: 'Mängderna blinkar förbi och står inte i bildtexten.',
        galt: 'Du kisar, missar en och gissar.',
        gjor: 'Pausa, skriv in mängderna i ett nytt recept och behåll videolänken som källa.',
        matlyst: 'Importera videon, skriv sedan in mängderna du såg och spara.' })
      + sc('Säg att du vill laga det till sex, inte två', {
        situasjon: 'Skaparen lagar en enda portion, och du har gäster.',
        galt: 'Du räknar gånger tre i huvudet och tappar bort kryddorna.',
        gjor: 'Räkna om receptet. Omräkningen är linjär, så kontrollera ägg och jäsmedel själv när du bakar.',
        matlyst: 'Ändra portionerna, mellan 1 och 20 totalt.' })
      + sc('Säg att du sparat tio TikTok-recept den här veckan', {
        situasjon: 'De ligger alla bland favoriterna, utan ordning.',
        galt: 'På tisdagen hittar du inte kycklingen.',
        gjor: 'Flytta de du ska laga till mappar och sök på ingrediens.',
        matlyst: 'Spara i en mapp för vardagsmiddagar och sök sedan på ”kyckling”.' })
      + sc('Säg att skaparen skriver ”salta efter smak”', {
        situasjon: 'Det finns ingen mängd för saltet, citronen eller chilin.',
        galt: 'Du saltar för mycket eller för lite och minns aldrig hur mycket du använde.',
        gjor: 'Se det som en början: tillsätt en nypa, smaka, justera.',
        matlyst: 'Redigera receptet och skriv in din slutliga mängd, så slipper du gissa nästa gång.' })],
    ['Så ordnar du dina TikTok-recept', p('Det som gör TikTok bra, att man hittar något nytt varje dag, är också det som skapar högen. Tio sparade videor i veckan blir snabbt hundra. Därför lönar det sig att välja i stället för att samla.')
      + '<ul><li><strong>Spara bara det du tänker laga.</strong> Ser du en video som är rolig att titta på men som du aldrig skulle göra, låt den vara.</li>'
      + '<li><strong>Välj mapp direkt.</strong> Det tar en sekund när du sparar, och du slipper leta senare. Några få mappar räcker långt.</li>'
      + '<li><strong>Skriv en rad om vad du ändrade.</strong> Mindre salt, mer vitlök, ugnen på 200 grader. Då är receptet ditt nästa gång, inte skaparens.</li>'
      + '<li><strong>Sök på ingrediens när du handlat.</strong> Har du kyckling och spenat hemma hittar du på någon sekund vad du redan sparat.</li></ul>'],
    ['Vad som skiljer TikTok från andra källor', p('Ett recept på en webbsida är oftast skrivet för att läsas. Ett recept på TikTok är gjort för att tittas på, och texten är en bisak. Därför varierar det mycket hur mycket som står i bildtexten: ibland en komplett ingredienslista med steg, ibland bara några emojis och en hashtag.',
      'Matlyst kan bara läsa det som faktiskt står där. Är bildtexten komplett blir utkastet bra. Är den tunn får du ett tunt utkast, och då är det du som fyller i det du såg i videon. Det är ett ärligt sätt att arbeta: du får ett recept med dina egna mängder i stället för en gissning från en app.')],
    ['Respekt för skaparen', p('Varje recept som sparas från TikTok visar skaparens användarnamn och en länk tillbaka till originalvideon, eller till skaparens profil om videolänken saknas. Det är av respekt för skaparen, och det gör att du kan gå tillbaka för fler av deras recept.')
      + p('Privat, borttaget eller geografiskt spärrat innehåll kan inte alltid läsas.')],
    ['Vanliga misstag', '<ul><li><strong>Att spara utan att läsa utkastet.</strong> Mängderna är det som går fel.</li>'
      + '<li><strong>Att vänta sig mängder som bara sades.</strong> Matlyst läser text, inte ljud.</li>'
      + '<li><strong>Att spara videolänken som recept.</strong> Spara själva receptet.</li></ul>'
      + p('Fler sätt att spara: <a href="/sv/spara-recept-fran-instagram/">Instagram</a>, <a href="/sv/handskrivna-recept/">handskrivna recept</a> och översikten över <a href="/sv/receptbok-app/">receptbok-appen</a>.')],
  ],
}).html;

const skafferi = byggRik({
  lang: 'sv',
  svarTekst: 'Lägg in det som finns i ditt kök, så visar Matlyst vad du har, hur många dagar det är kvar på varje vara och vilka av dina sparade recept som använder den. Varor som redan finns i skafferiet är bortvalda och märkta «I skafferiet» när du lägger till ett recept i inköpslistan, så att du inte köper en burk till.',
  seksjoner: [
    ['Därför hjälper en skafferilista', p('Att slänga mat är oftast ett minnesproblem, inte ett matlagningsproblem. Du glömmer att spenaten finns, resterna skjuts längst in, och en vecka senare är det soptunnan. Skriver du ner det en gång kommer du ihåg det.')
      + founder(['Nu söker jag på det som finns i mitt skafferi, hittar misokycklingen jag sparat, och middagen är bestämd på ett par sekunder.'], 'Patrick, grundare av Matlyst. Vi äter oss ur kylskåpet i stället för att slänga mat.')],
    ['Det här gör skafferiet i Matlyst', '<h3>Det håller en lista med dagar kvar</h3>'
      + p('Lägg till en vara med bäst före-datum så visar skafferiet hur många dagar som är kvar, så att du har koll på det som går ut först. I den gratis planen visar skafferiet 5 varor.')
      + '<h3>Det hittar recept du redan sparat</h3>'
      + p('Sök bland dina egna recept på en ingrediens från kylskåpet, som ”miso”, och se vad du kan laga. Det är vanlig sökning, så den fungerar utan AI. Se <a href="/sv/recept-pa-ingredienser/">recept på ingredienser</a> och <a href="/sv/tom-kylskapet/">att tömma kylskåpet</a>.')
      + '<h3>Det föreslår middagar av det du har (Pro)</h3>'
      + p('I <strong>Fråga Matlyst</strong> bygger <strong>Använd det jag har</strong> middagsförslag av varorna i ditt skafferi, med tillagningstider. Det använder AI och har en månadskvot, så läs resultatet innan du lagar.')
      + '<h3>Det byter ut det du saknar</h3>'
      + p('Saknar du filmjölk? Öppna receptet och be om en ersättning i <strong>Fråga Matlyst</strong> som utgår från ditt skafferi. Du ser ändringarna som en lista och kan ångra dem.')
      + '<h3>Det håller dubbletter borta från inköpslistan</h3>'
      + p('Varor som redan finns i skafferiet är bortvalda och märkta «I skafferiet» när du lägger till ett recept i <a href="/sv/inkopslista/">inköpslistan</a>, så du köper inte en burk till av det du redan har. Har du ett hushåll delas skafferiet dessutom och uppdateras direkt för alla.')
      + p('I gratisversionen rymmer Skafferi ett begränsat antal varor. Med Pro får du plats med fler.')],
    ['Så sätter du upp skafferiet på tio minuter', p('Du behöver inte föra bok över hela köket. En kort lista som du håller aktuell slår en perfekt lista som du ger upp.')
      + '<ol><li><strong>Börja med det som blir dåligt först.</strong> Färska grönsaker, mejeriprodukter, öppnade burkar och sådant du köpte till ett recept och har kvar.</li>'
      + '<li><strong>Lägg till bäst före-datum där förpackningen har ett.</strong> För färsk mat utan datum anger du dagen du köpte den och går efter eget omdöme.</li>'
      + '<li><strong>Lägg till frysen sedan.</strong> Skriv in vad som ligger där, med datum, så att det äldsta går först.</li>'
      + '<li><strong>Hoppa över basvarorna</strong> du aldrig har slut på, som salt och olja, tills du vill ha dem på listan.</li>'
      + '<li><strong>Uppdatera när du handlar och när du lagar mat.</strong> Två minuter då sparar tio senare.</li></ol>'
      + p('I den gratis planen visar skafferiet 5 varor. Det räcker för att prova vanan på det som blir dåligt först.')],
    ['Använd skafferiet och veckomenyn tillsammans', p('Skafferiet är mest användbart när det matar planen. Så här ser ett varv ut i en vanlig vecka.')
      + '<ol><li>Öppna skafferiet och se vad som går ut först.</li>'
      + '<li>Sök bland dina sparade recept på de ingredienserna och lägg två eller tre i <a href="/sv/veckomeny-app/">veckomenyn</a>.</li>'
      + '<li>Skicka ingredienserna till inköpslistan. Varor som redan finns i skafferiet är bortvalda och märkta «I skafferiet», så du handlar det som saknas.</li>'
      + '<li>Laga maten och uppdatera skafferiet.</li></ol>'
      + p('Du bestämmer fortfarande vad som hamnar i planen. Matlyst fyller inte veckan åt dig.')],
    ['Dela skafferiet med hushållet', p('En Pro-medlem kan skapa ett hushåll för upp till 6 personer, och det är gratis att gå med. Inköpslistan, veckomenyn och skafferiet delas och uppdateras direkt för alla. Den som just använde de sista äggen kan ta bort dem från listan, och den som står i butiken ser det.')],
    ['Vad ska ligga i skafferiet och vad kan vänta', p('En fråga många ställer är hur detaljerad listan måste vara. Svaret är att den ska vara så detaljerad att den hjälper dig, och inte mer.')
      + '<ul><li><strong>Ta med</strong> sådant som blir dåligt: färsk fisk och kött, grönsaker, mejeriprodukter, bröd och rester.</li>'
      + '<li><strong>Ta med</strong> det du köpte till ett enda recept och har hälften kvar av, som en kruka färsk ingefära eller en burk kokosmjölk.</li>'
      + '<li><strong>Vänta med</strong> torrvaror som håller länge, till exempel ris, pasta och mjöl, om du inte vill ha dem på listan.</li>'
      + '<li><strong>Vänta med</strong> kryddor och sådant du aldrig tar slut på.</li></ul>'
      + p('Poängen är att det som riskerar att glömmas finns på listan. Resten klarar du dig utan, och du kan alltid lägga till det senare.')],
    ['Vad Matlyst inte gör', '<ul><li><strong>Den skannar inga streckkoder.</strong> Du lägger till varor för hand.</li>'
      + '<li><strong>Den vet inte vad som verkligen finns i kylskåpet.</strong> Listan är bara så bra som senaste gången du uppdaterade den.</li>'
      + '<li><strong>Den avgör inte livsmedelssäkerhet åt dig.</strong> Ett datum är en vägledning. Lita på dina sinnen och på Livsmedelsverkets råd.</li></ul>'],
    ['Hur länge håller maten', p('Hur länge rester och öppnade förpackningar håller, och vilken temperatur kylskåp och frys ska ha, beror på varan. Vi anger inga egna siffror här. Livsmedelsverket har råd om hur du förvarar maten och minskar matsvinnet: <a href="https://www.livsmedelsverket.se/matvanor-halsa--miljo/matsvinn">Livsmedelsverket om matsvinn</a>.')
      + p('En vana från proffsköken: rått kött ställs längst ner, under mat som inte ska tillagas igen, så att inget kan droppa på det. Som kylmontör såg jag det göras med flit varje dag. Det kostar ingenting, och det fungerar.')],
    ['Fyra situationer, och vad du gör', notat()
      + sc('Säg att du har en halv grillad kyckling, spenat och ris', {
        situasjon: 'Klockan är 18 och inget verkar passa ihop.',
        galt: 'Du beställer hem mat och kycklingen åker i soporna på fredag.',
        gjor: 'Sök bland dina recept på ”kyckling” och ”spenat”, eller be om idéer av det du har.',
        matlyst: 'Sök på ingrediens, eller använd Fråga Matlyst, en Pro-funktion.' })
      + sc('Säg att tre saker går ut den här veckan', {
        situasjon: 'En burk yoghurt, en påse spenat och ett paket kycklinglårfilé.',
        galt: 'Du handlar till fem nya middagar och de gamla blir dåliga.',
        gjor: 'Planera två middagar kring de varor som går ut först.',
        matlyst: 'Lägg till varorna, se dagarna som är kvar och lägg matchande recept i veckomenyn.' })
      + sc('Säg att din frys är ett mysterium', {
        situasjon: 'Omärkta påsar längst ner i frysen.',
        galt: 'Du vet inte vad de är eller hur gamla de är.',
        gjor: 'Skriv in vad som finns där, så att det äldsta går först.',
        matlyst: 'Lägg till varje vara med datum.' })
      + sc('Säg att det är veckan före en resa', {
        situasjon: 'Kylskåpet är halvfullt och du åker på lördag.',
        galt: 'Du storhandlar och kommer hem till förstörd mat.',
        gjor: 'Planera måltiderna av skafferiet och handla bara det som saknas.',
        matlyst: 'Kolla skafferiet, planera veckan och skicka bara det som saknas till inköpslistan.' })],
    ['Vanliga misstag', '<ul><li><strong>Att bara föra in färsk mat.</strong> Även det som ligger i frysen och skafferiet kostar pengar när det slängs.</li>'
      + '<li><strong>Att aldrig uppdatera listan.</strong> Ta bort varor när de är använda, annars slutar listan stämma.</li>'
      + '<li><strong>Att köpa dubbletter.</strong> Kolla skafferiet innan du handlar.</li></ul>'
      + p('Se sedan hur ett skafferi hänger ihop med <a href="/sv/veckomeny-app/">veckomenyn</a> och hela <a href="/sv/receptbok-app/">receptbok-appen</a>.')],
  ],
}).html;

const inkopslista = byggRik({
  lang: 'sv',
  svarTekst: 'Lägg ett recept, eller en hel planerad vecka, på din inköpslista i Matlyst, så hamnar ingredienserna på en enda lista. Likadana varor med samma enhet läggs ihop, listan sorteras efter butikens avdelningar, och varor som redan finns i skafferiet är bortvalda och märkta «I skafferiet» när du lägger till ett recept.',
  seksjoner: [
    ['Så gör du en inköpslista av recept', '<ol><li><strong>Öppna ett recept eller din veckomeny.</strong> Välj ett recept, eller en dag eller vecka du planerat.</li>'
      + '<li><strong>Lägg det på inköpslistan.</strong> Ingredienserna hamnar på listan, med mängderna receptet anger.</li>'
      + '<li><strong>Handla efter avdelning.</strong> Varorna är grupperade efter butikens avdelningar, som frukt och grönt, mejeri och kryddor. Bocka av dem medan du handlar.</li></ol>'
      + p('Det fungerar med alla recept i Matlyst, oavsett om du sparat det från en webbsida, TikTok eller Instagram eller skrivit in det själv. Du kan också lägga till sådant som inte står i något recept, som kaffe och hushållspapper.')],
    ['Vad händer när två recept behöver samma sak', p('Säg att två recept båda behöver en lök. Då får du en rad för lök, inte två. Matlyst lägger varor med samma namn på en rad. När enheterna skiljer sig, som 1 dl i ett recept och 200 g i ett annat, visas båda mängderna på samma rad, till exempel «1 dl · 200 g», för Matlyst gissar inte hur de ska räknas om. Vill du ha en enda mängd trycker du på mängden och anger en mängd och enhet.')
      + p('Listan är sorterad efter butikens avdelningar, så du går igenom butiken en gång i stället för att korsa den två gånger för den enda saken du glömde.')],
    ['Planera först, handla en gång', p('En inköpslista är bara så bra som planen bakom den. Lägg veckans middagar i <a href="/sv/veckomeny-app/">veckomenyn</a>, lägg hela veckan på inköpslistan och gör ett butiksbesök i stället för tre. Vill du ha helheten kring att spara, ordna och laga recept, se sidan om <a href="/sv/receptbok-app/">receptbok-appen</a>.')],
    ['Hoppa över det du redan har', p('Varor som redan finns i ditt <a href="/sv/skafferi-app/">skafferi</a> är bortvalda och märkta «I skafferiet» när du lägger till ett recept. Det är en påminnelse, inte en regel: du ser vad du redan har innan du köper en burk till. Kolla skafferiet innan du handlar och uppdatera det när du lagar mat.')],
    ['Dela listan med hushållet', p('En Pro-medlem kan skapa ett hushåll för upp till 6 personer, och det är gratis att gå med. Inköpslistan, veckomenyn och skafferiet delas och uppdateras direkt för alla. En planerar, en annan handlar, och den som står i butiken bockar av åt alla.')],
    ['Tre situationer, och vad du gör', notat()
      + sc('Säg att du planerar fem middagar för en familj på fyra', {
        situasjon: 'En budget och ett butiksbesök.',
        galt: 'Två recept behöver var sin lök och du köper tre.',
        gjor: 'Planera veckan först och handla sedan från en sammanslagen lista.',
        matlyst: 'Lägg recepten i veckomenyn, lägg veckan på inköpslistan och handla efter avdelning.' })
      + sc('Säg att din partner handlar på vägen hem', {
        situasjon: 'Du planerade veckan, och hen står i butiken.',
        galt: 'Du skickar en lista i ett meddelande och hälften försvinner i tråden.',
        gjor: 'Dela en gemensam lista som uppdateras direkt.',
        matlyst: 'Med ett Pro-hushåll delas listan och uppdateras för er båda. Det är gratis att gå med.' })
      + sc('Säg att du ska laga ett recept för sju, inte fyra', {
        situasjon: 'Det kommer gäster.',
        galt: 'Du räknar om receptet i huvudet och köper för lite.',
        gjor: 'Räkna om portionerna först och lägg sedan receptet på listan. Omräkningen är linjär, så kontrollera ägg och jäsmedel själv när du bakar.',
        matlyst: 'Ändra portionerna, mellan 1 och 20 totalt, och lägg sedan receptet på inköpslistan.' })],
    ['Så ser en vanlig vecka ut', p('Ett upplägg som fungerar för många: en kväll i veckan, kanske söndag, väljer du middagarna och lägger dem i <a href="/sv/veckomeny-app/">veckomenyn</a>. Du lägger hela veckan på inköpslistan och tittar igenom den en gång. Det som redan finns hemma ser du direkt, eftersom varor från skafferiet är bortvalda och märkta «I skafferiet».',
      'Sedan handlar du efter avdelning och bockar av medan du går. Kommer du på något som inte står i något recept, som kaffe eller disktabletter, skriver du in det på samma lista. Under veckan ändrar du planen om den inte håller, och listan följer med.')],
    ['Tips för en lista som verkligen används', '<ul><li><strong>Läs recepten innan du lägger dem på listan.</strong> En ingrediens som är fel i receptet blir fel på listan också.</li>'
      + '<li><strong>Räkna om portionerna först.</strong> Då blir mängderna på listan rätt från början.</li>'
      + '<li><strong>Håll skafferiet aktuellt.</strong> Det är det som gör att listan visar vad du faktiskt behöver köpa.</li>'
      + '<li><strong>Titta på olika enheter.</strong> Står det 1 dl på en rad och 200 g på en annan är det du som avgör hur mycket du köper.</li>'
      + '<li><strong>Dela listan om ni är flera.</strong> Med ett Pro-hushåll ser alla samma lista. Annars kan du skicka den som text med delningsknappen.</li></ul>'
      + p('Hör receptet hemma i en samling du ännu inte byggt upp? Börja med att <a href="/sv/importera-recept/">importera recept</a> från de sidor du brukar laga efter.')],
    ['Vad inköpslistan inte gör', '<ul><li><strong>Den beställer inga varor.</strong> Det är en lista, inte en butik.</li>'
      + '<li><strong>Den räknar inte om enheter åt dig.</strong> Samma enheter läggs ihop, och olika enheter visas som separata rader.</li>'
      + '<li><strong>Den kan läsa ett recept fel.</strong> Matlyst använder AI för att läsa recept från inlägg och foton, så kontrollera mängderna innan du litar på listan.</li></ul>'],
  ],
}).html;

const kopguide = byggRik({
  lang: 'sv',
  svarTekst: 'En bra receptapp sparar recept från de ställen där du faktiskt hittar dem, gör dem sökbara på ingrediens, räknar om mängderna och kopplar ihop sig med en veckomeny och en inköpslista. Testa vilken app som helst med fem recept ur ditt eget liv innan du bestämmer dig. Vi gör Matlyst, så vi säger var den passar och var den inte gör det.',
  seksjoner: [
    ['Vem guiden är till för', p('Du har recept på för många ställen: skärmdumpar, bokmärken, sparade reels, en anteckningsapp, en hög med utskrivna kort. Du vill ha ett ställe för dem. Guiden listar vad du ska titta efter, hur du testar en app på tio minuter och vilka misstag folk gör när de väljer.')
      + p('Full öppenhet: vi gör Matlyst, en receptapp. Guiden rankar inga appar och nämner inga konkurrenter vid namn. Den ger dig kriterier som fungerar för vilken app som helst, och säger ärligt var Matlyst passar och var den inte gör det.')],
    ['Tio saker att titta efter i en receptapp', '<h3>1. Den sparar recept där du verkligen hittar dem</h3>'
      + p('Gör en lista över dina tio senaste receptfynd. Var de på webbsidor, Instagram, TikTok, YouTube, ett foto av en sida eller ett meddelande från en vän? Appen ska klara det mesta av din lista med ett eller två tryck.')
      + '<h3>2. Den rensar upp receptet</h3>'
      + p('En sparad länk är inget recept. Du vill ha ingredienser med mängder och numrerade steg i samma upplägg varje gång, utan reklam och långa berättelser.')
      + '<h3>3. Du kan kontrollera och redigera</h3>'
      + p('Importer från sociala inlägg och foton kan bli fel, särskilt mängderna. Du måste kunna läsa resultatet innan du sparar, rätta det och lägga till egna anteckningar.')
      + '<h3>4. Den söker på ingrediens</h3>'
      + p('Frågan en tisdagskväll är inte ”vad hette den där soppan”, utan ”vad kan jag laga av kyckling och spenat”. Sökning på ingrediens är funktionen som gör en hög till ett verktyg.')
      + '<h3>5. Den räknar om portioner</h3>'
      + p('Leta efter omräkning som ändrar alla mängder på en gång. Kom ihåg att omräkningen är linjär, så vid bakning behöver du fortfarande bedöma ägg, salt och jäsmedel själv.')
      + '<h3>6. Den hanterar dina enheter</h3>'
      + p('Lagar du efter svenska recept vill du ha gram, deciliter och grader Celsius. Lagar du efter amerikanska recept vill du kanske se cups och ounces som de står. Kolla om appen räknar om, behåller källans enheter eller gör ingetdera.')
      + '<h3>7. Den kopplar till en veckomeny och en inköpslista</h3>'
      + p('Att ordna är halva jobbet. Vinsten är att lägga veckans recept i en plan och få en sammanslagen inköpslista, sorterad efter butikens avdelningar.')
      + '<h3>8. Den fungerar i köket</h3>'
      + p('Kan du laga maten med kladdiga händer? Leta efter en checklista eller stegvy, timers och en skärm som stannar tänd. Kolla om den fungerar offline när wifi:t är dåligt.')
      + '<h3>9. Du kan lämna den</h3>'
      + p('Du ska kunna exportera alla dina recept, gratis, i ett format du kan öppna någon annanstans. Kommer du inte åt dina recept äger du dem inte.')
      + '<h3>10. Den är ärlig om sina gränser och sitt pris</h3>'
      + p('Läs vad som är gratis och inte innan du sparar hundra recept. Leta efter en tydlig beskrivning av vad appen inte kan, till exempel att läsa text i videor eller kommentarer.')],
    ['Ett test på tio minuter som du kan köra på vilken app som helst', p('Lita inte på en funktionslista. Prova fem riktiga recept.')
      + '<ol><li><strong>Ett recept från en webbsida</strong> med en lång berättelse före ingredienserna.</li>'
      + '<li><strong>Ett recept från Instagram eller TikTok</strong> där receptet står i bildtexten.</li>'
      + '<li><strong>Ett recept där mängderna bara sägs</strong> i en video. Se vad appen gör, och om den säger det ärligt.</li>'
      + '<li><strong>Ett foto av ett tryckt eller handskrivet recept.</strong> Kontrollera varje mängd mot originalet.</li>'
      + '<li><strong>Två recept som båda behöver en lök.</strong> Lägg båda på inköpslistan och se vad du får.</li></ol>'
      + p('Sök sedan på en ingrediens, räkna om ett recept till ett annat antal portioner och försök exportera allt. Tar något steg mer än ett par minuter eller lämnar dig osäker är det användbar information.')],
    ['Så tänker du om pris och gratisplaner', p('De flesta receptappar har en gratis nivå och en betald. Det är inget konstigt i sig, men det är skillnad på en gratisplan som låter dig prova på riktigt och en som låser det du behöver först. Läs vad som begränsas: antal importer, antal varor i skafferiet, funktioner som kräver abonnemang.')
      + p('Gör en enkel kalkyl. Hur många recept sparar du i månaden, och vilka funktioner kommer du använda varje vecka? Betala för det du använder, inte för det som låter bra på en funktionslista.')],
    ['Vad appar brukar göra fel', '<ul><li><strong>Tysta fel.</strong> En app som importerar ett recept med en felaktig mängd och inte visar något utkast är farligare än en som ber dig kontrollera.</li>'
      + '<li><strong>Att låtsas läsa video.</strong> Många skapare säger bara mängderna högt. En app ska tala om när den inte kan läsa dem.</li>'
      + '<li><strong>Enhetsöverraskningar.</strong> Vissa appar räknar om i tysthet och avrundar mängder så att receptet förstörs.</li>'
      + '<li><strong>Ingen väg ut.</strong> Din receptsamling är flera års arbete. Se till att du kan ta den med dig.</li></ul>'],
    ['Fyra situationer, och vad du ska titta efter', notat()
      + sc('Säg att du mest sparar recept från Instagram och TikTok', {
        situasjon: 'Dina sparade inlägg är fulla och du hittar ingenting.',
        galt: 'Du väljer en app som bara sparar länkar till webbsidor.',
        gjor: 'Välj en app som läser bildtexter från sociala inlägg, och testa den med två riktiga inlägg. Kolla vad den gör när receptet inte står i bildtexten.',
        matlyst: 'Matlyst läser bildtexter från Instagram och TikTok. Den transkriberar inte video och läser inte kommentarer.' })
      + sc('Säg att du ärvt en låda med handskrivna kort', {
        situasjon: 'Blekt bläck, ”en klick smör” och inga ugnstemperaturer.',
        galt: 'Du litar på skanningen och lagar efter den.',
        gjor: 'Använd en app med fotoimport och kontrollera varje mängd mot kortet. Behåll originalet.',
        matlyst: 'Fotoimport är en funktion i Matlyst Pro, upp till 20 foton per recept, och resultatet ska alltid kontrolleras.' })
      + sc('Säg att du lagar mat till en familj på fem', {
        situasjon: 'Recepten räcker till fyra och inköpslistan är lång.',
        galt: 'Du räknar om i huvudet och får slut på salt.',
        gjor: 'Leta efter omräkning och en inköpslista som lägger ihop likadana varor.',
        matlyst: 'Portionerna kan räknas om mellan 1 och 20, och likadana varor med samma enhet läggs ihop på inköpslistan.' })
      + sc('Säg att ni delar på matlagningen', {
        situasjon: 'En av er planerar, den andra handlar.',
        galt: 'Ni skickar listor i meddelanden och tappar hälften av varorna.',
        gjor: 'Leta efter en delad lista som uppdateras direkt.',
        matlyst: 'En Pro-medlem skapar ett hushåll för upp till 6 personer. Inköpslistan, veckomenyn och skafferiet uppdateras direkt, och det är gratis att gå med.' })],
    ['Där Matlyst passar, och där den inte gör det', p('Vi byggde Matlyst för att lösa problemet som beskrivs i början av guiden. Här är den ärliga sammanfattningen.')
      + '<div class="table-wrap"><table><thead><tr><th>Matlyst passar bra om du …</th><th>Den är nog inte för dig om du …</th></tr></thead><tbody>'
      + '<tr><td>sparar recept från Instagram, TikTok, webbsidor eller foton</td><td>behöver att appen transkriberar det som sägs i videor</td></tr>'
      + '<tr><td>vill ha veckomeny och inköpslista byggda av dina egna recept</td><td>vill att en app genererar en hel veckomeny åt dig</td></tr>'
      + '<tr><td>vill söka på ingrediens och ha ett skafferi</td><td>behöver skanna streckkoder för varor i skafferiet</td></tr>'
      + '<tr><td>vill kunna exportera allt du sparar gratis</td><td>bara lagar efter tryckta kokböcker och aldrig sparar något digitalt</td></tr>'
      + '</tbody></table></div>'
      + p('Matlyst är gratis att börja med, med 5 importer per kalendermånad. Läs mer på sidan om <a href="/sv/receptbok-app/">receptbok-appen</a>, eller se hur den fungerar med <a href="/sv/spara-recept-fran-instagram/">Instagram</a>, <a href="/sv/spara-recept-fran-tiktok/">TikTok</a>, <a href="/sv/veckomeny-app/">veckomenyn</a> och <a href="/sv/inkopslista/">inköpslistan</a>.')],
    ['Vanliga misstag när man väljer', '<ul><li><strong>Att välja efter funktionslista.</strong> Testa med dina egna recept.</li>'
      + '<li><strong>Att flytta allt första dagen.</strong> Börja med de tio recept du lagar oftast.</li>'
      + '<li><strong>Att inte läsa importen.</strong> Kontrollera alltid mängderna.</li>'
      + '<li><strong>Att strunta i exporten.</strong> Testa den innan du förlitar dig på appen.</li></ul>'],
  ],
}).html;

export const rikeSider = {
  'receptbok-app/': {
    title: 'Receptbok-app: ett hem för alla dina recept',
    description: 'Spara recept från webbsidor, Instagram, TikTok och foton i en receptbok-app. Räkna om portioner, planera veckan och få en inköpslista. Gratis att börja.',
    h1: 'En receptbok-app som samlar alla dina recept på ett ställe',
    rik: receptbok,
    faq: [
      ['Finns det en gratis receptbok-app?', 'Ja. Matlyst är gratis att börja med: 5 importer per kalendermånad, mappar, sökning, veckomeny och inköpslista. Matlyst Pro ger fler importer, fotoimport, Fråga Matlyst och delning med hushållet.'],
      ['Kan jag spara recept från Instagram och TikTok?', 'Ja, genom att dela inlägget med Matlyst. Appen läser receptet från bildtexten. Den transkriberar inte det som sägs i videon, så om mängderna bara sägs lägger du till dem för hand efter importen.'],
      ['Kan jag räkna om ett recept till fler portioner?', 'Ja, mellan 1 och 20 portioner. Omräkningen är linjär, så kontrollera ägg och jäsmedel själv när du bakar.'],
      ['Fungerar den offline?', 'Du kan läsa dina recept och din inköpslista offline i upp till 30 dagar efter senaste synkningen. Matlagningsläget och redigering kräver anslutning.'],
      ['Kan jag dela recept och inköpslista med mitt hushåll?', 'Ja. En Pro-medlem skapar hushållet, upp till 6 personer kan gå med, och det är gratis att gå med. Inköpslistan, veckomenyn och skafferiet uppdateras direkt för alla.'],
      ['Vilka enheter använder den?', 'Mängderna är metriska. Matlyst räknar inte om enheter vid import, och recept på andra språk översätts till svenska.'],
      ['Kan jag exportera mina recept?', 'Ja, gratis, som en Matlyst-fil (en zip med mappar och bilder) eller som HTML.'],
      ['Fungerar Matlyst på iPhone och Android?', 'Ja. Matlyst finns i App Store och på Google Play.'],
      ['Vad ingår i gratisversionen?', 'Gratisversionen har ett visst antal importer per månad, och appen visar hur många du har använt. Med Matlyst Pro får du fler importer och fotoimport.'],
    ],
  },
  'spara-recept-fran-instagram/': {
    title: 'Så sparar du recept från Instagram (inlägg och reels)',
    description: 'Spara ett recept från ett Instagram-inlägg eller en reel genom att dela det med Matlyst. Steg för steg, och vad du gör när receptet inte står i bildtexten.',
    h1: 'Så sparar du recept från Instagram',
    rik: instagram,
    faq: [
      ['Kan jag spara ett recept från en Instagram-reel?', 'Ja, om receptet står i bildtexten. Dela reelen med Matlyst, läs utkastet och spara. Matlyst transkriberar inte tal eller text som bara visas i videon.'],
      ['Laddar Matlyst ner videon?', 'Nej. Matlyst sparar det strukturerade receptet och källänken, inte videofilen.'],
      ['Vad gör jag om receptet står i en kommentar?', 'Matlyst läser inte kommentarer. Kopiera receptet och skriv in det själv under Lägg till recept, eller dela länken om den går till en receptsida.'],
      ['Är det gratis att spara recept från Instagram?', 'Ja, du kan börja gratis med 5 importer per kalendermånad. Matlyst Pro ger fler importer.'],
    ],
  },
  'spara-recept-fran-tiktok/': {
    title: 'Så sparar du recept från TikTok, steg för steg',
    description: 'Gör ett TikTok-recept till ingredienser och steg. Dela videon med Matlyst, kontrollera utkastet och laga efter det, sök och räkna om. Gratis att börja.',
    h1: 'Gör en TikTok till ett recept du faktiskt kan laga',
    rik: tiktok,
    faq: [
      ['Kan jag spara recept från TikTok?', 'Ja, om receptet står i videons bildtext. Dela videon med Matlyst, läs utkastet och spara. Korta länkar som vm.tiktok.com fungerar också.'],
      ['Läser Matlyst vad som sägs i videon?', 'Nej. Matlyst transkriberar inte tal och läser inte text som bara visas i videon. Mängder som bara sägs skriver du in själv.'],
      ['Laddar Matlyst ner TikTok-videon?', 'Nej. Matlyst sparar receptet och en länk till originalvideon, inte videofilen.'],
      ['Är det gratis?', 'Du kan börja gratis med 5 importer per kalendermånad. Matlyst Pro ger fler importer.'],
    ],
  },
  'skafferi-app/': {
    title: 'Skafferi-app: ha koll på vad du har och laga det',
    description: 'En skafferi-app som visar vad du har, hur många dagar som är kvar och vilka sparade recept som använder det. Lägg in varor snabbt och släng mindre mat.',
    h1: 'En skafferi-app som gör det du har till middag',
    eyebrow: 'Skafferi',
    lead: 'Lägg in det du har i köket, se vad som bör användas först och hitta recepten du redan sparat som använder det.',
    forst: 'Börja med kylskåpet. Frysen och torrvarorna kan du lägga till senare.',
    stegTittel: 'Så använder du skafferiet',
    steg: [
      ['Lägg in det du har', 'Öppna skafferiet och lägg in varor, med bäst före-datum om varan har ett.'],
      ['Se vad som bör användas först', 'Skafferiet visar hur många dagar som är kvar på varje vara.'],
      ['Laga mat av det', 'Sök bland dina sparade recept efter en ingrediens, eller be Fråga Matlyst om förslag utifrån det du har. Det är en Pro-funktion.'],
    ],
    alternativ: '',
    grense: 'I gratisversionen rymmer Skafferi ett begränsat antal varor. Med Pro får du plats med fler.',
    seksjoner: [],
    faqTittel: 'Frågor om skafferiet',
    cta: 'Starta ditt skafferi',
    rik: skafferi,
    faq: [
      ['Skannar Matlyst streckkoder?', 'Nej. Du lägger till skafferivaror för hand.'],
      ['Är skafferiet gratis?', 'I den gratis planen visar skafferiet 5 varor. Matlyst Pro ger fler, tillsammans med Fråga Matlyst och delning med hushållet.'],
      ['Kan Matlyst föreslå middag av det jag har?', 'Ja, med Matlyst Pro. I Fråga Matlyst bygger Använd det jag har middagsidéer av ditt skafferi. Det använder AI och har en månadskvot, så kontrollera resultatet innan du lagar.'],
      ['Hindrar skafferiet mig från att köpa dubbletter?', 'Varor som finns i ditt skafferi är bortvalda och märkta «I skafferiet» när du lägger till ett recept i inköpslistan, så du ser vad du redan har innan du handlar.'],
      ['Fungerar det offline?', 'Du kan läsa dina recept och din inköpslista offline i upp till 30 dagar efter senaste synkningen. Redigering kräver anslutning.'],
      ['Hur länge håller rester i kylskåpet?', 'Det beror på maten, och vi anger inga egna siffror. Livsmedelsverket har råd om förvaring och matsvinn på livsmedelsverket.se.'],
    ],
  },
  'inkopslista/': {
    title: 'Inköpslista från recept: en lista för hela veckan',
    description: 'Lägg recept i Matlyst så hamnar ingredienserna på en inköpslista, ihopslagen och sorterad efter butikens avdelningar. Hoppa över det du har. Gratis att börja.',
    h1: 'En inköpslista som kommer direkt från dina recept',
    rik: inkopslista,
    faq: [
      ['Finns det en app för inköpslistor som lägger till ingredienser från recept?', 'Ja. I Matlyst lägger du ett recept eller en planerad dag på inköpslistan, och ingredienserna hamnar på listan med likadana varor ihopslagna.'],
      ['Kan jag dela inköpslistan med min partner?', 'Ja. En Pro-medlem skapar ett hushåll för upp till 6 personer. Inköpslistan, veckomenyn och skafferiet uppdateras direkt för alla, och det är gratis att gå med.'],
      ['Sorterar listan varorna efter avdelning?', 'Ja. Varorna är grupperade efter butikens avdelningar, som frukt och grönt, kött och mejeri.'],
      ['Vad händer när två recept behöver samma ingrediens?', 'Matlyst lägger varor med samma namn på en rad. När enheterna skiljer sig visas mängderna tillsammans på raden, till exempel «1 dl · 200 g».'],
      ['Kan jag lägga till saker som inte står i ett recept?', 'Ja. Tryck på + och skriv vad du behöver.'],
      ['Vet listan vad jag redan har hemma?', 'Varor som redan finns i ditt skafferi är bortvalda och märkta «I skafferiet» när du lägger till ett recept, så du ser vad du har innan du köper det.'],
      ['Är inköpslistan gratis?', 'Inköpslistan är gratis. Vill du dela en gemensam lista med hushållet krävs Matlyst Pro. Du kan alltid skicka listan som text med delningsknappen.'],
    ],
  },
  'blogg/valj-receptapp/': {
    title: 'Så väljer du receptapp: tio saker att kolla',
    description: 'Tio saker att titta efter i en receptapp, ett test på tio minuter som du kan köra på vilken app som helst, och de vanligaste misstagen när man väljer.',
    eyebrow: 'Köpguide',
    h1: 'Så väljer du receptapp',
    lead: 'Tio saker att titta efter, ett test på tio minuter och vad appar brukar göra fel. Skriven av dem som gör Matlyst, utan ranking och utan konkurrenters namn.',
    forst: 'Testa med dina egna recept, inte med en funktionslista.',
    stegTittel: 'Så testar du en receptapp',
    steg: [
      ['Prova fem riktiga recept', 'Ett recept från en webbsida, ett socialt inlägg, en video där mängderna bara sägs, ett foto av ett tryckt recept och två recept som delar en ingrediens.'],
      ['Sök, räkna om och exportera', 'Sök på en ingrediens, räkna om ett recept och försök exportera allt.'],
      ['Bestäm dig', 'Är ett steg långsamt eller lämnar dig osäker, så är det ditt svar.'],
    ],
    alternativ: '',
    grense: '',
    seksjoner: [],
    faqTittel: 'Att välja receptapp',
    rik: kopguide,
    faq: [
      ['Vad är det bästa sättet att ordna recept?', 'Ha dem på ett ställe, i samma upplägg, med en möjlighet att söka på ingrediens. En receptapp gör det och kopplar recepten till en veckomeny och en inköpslista.'],
      ['Vad ska jag titta efter i en receptapp?', 'Titta efter att den sparar från de ställen där du faktiskt hittar recept, ett utkast du kan kontrollera och redigera, sökning på ingrediens, omräkning, hantering av enheter, veckomeny och inköpslista, läsning offline och gratis export.'],
      ['Ska en receptapp kunna läsa recept ur videor?', 'Den ska vara ärlig om det. Många skapare säger bara mängderna högt. En app ska tala om när den inte kan läsa dem, så att du kan lägga till dem själv.'],
      ['Räcker en gratis receptapp?', 'För många, ja. Kolla vad den gratis planen begränsar, till exempel importer per månad, innan du sparar en stor samling.'],
      ['Hur flyttar jag mina recept mellan appar?', 'Leta efter export i ett format som andra appar kan öppna, och efter import som läser andra appars exportfiler. Testa båda innan du flyttar allt.'],
    ],
    cta: 'Prova med dina egna recept',
  },
};
