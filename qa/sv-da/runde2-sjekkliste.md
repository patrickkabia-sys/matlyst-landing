# Landing #9 – retterunde 3

Kontrollgrunnlag: `matlyst-kontroll/rapporter/2026-10-05-landing9-claude-qa-runde3.md`. Hver rad er kontrollert mot den regenererte filen den peker på: sitatet står ordrett i filen. Filen heter fortsatt `runde2-sjekkliste.md` slik at lenker fra runde 2 virker.

| Punkt | Status | Fil | Nytt sitat |
|---|---|---|---|
| K-klage DA | RETTET | `da/vilkaar/index.html` | `I Norge kan Forbrukertilsynet mægle, og en sag om fortrydelsesret kan derefter indbringes for Forbrukerklageutvalget.` |
| K-klage SV | RETTET | `sv/villkor/index.html` | `kontakta Konsument Europa, som kan medla i tvister med företag i Norge. I Norge kan Forbrukertilsynet medla, och ett ärende om ångerrätt kan därefter prövas av Forbrukerklageutvalget.` |
| K-klage SV, domstol | RETTET, med endret ordlyd | `sv/villkor/index.html` | `Du kan också väcka talan vid domstol i Sverige.` («också» i stedet for «alltid», fordi forbrukerens verneting etter Luganokonvensjonen har vilkår) |
| K-klage kilder | RETTET | `qa/sv-da/juridiske-kilder.md` | `https://www.forbrukertilsynet.no/forbrukerklageutvalget/` |
| B2 merkehøyde | RETTET | `images/googleplay-badge-en.png` | PNG beskåret fra 646 × 250 til 564 × 168; Playwright målte 40 px synlig høyde for begge merkene på `/da/` og `/` |
| B2 kommentar | RETTET | `styles.css` | `App Store og Google Play side om side, med LIK SYNLIG HØYDE (40 px).` |
| Skjermbilder | RETTET | `scripts/qa-lokalsider.mjs` | `Bruk en server som allerede kjører på BASE_URL, ellers start en statisk server selv.` 96 PNG-er med 96 ulike filstørrelser |
| Sjekkliste | RETTET | `qa/sv-da/runde2-sjekkliste.md` | Denne tabellen er skrevet for hånd; generatoren skriver den ikke lenger |
| Identitet DA | RETTET | `da/privatliv/index.html` | `Patrick Omassa Kabia er dataansvarlig for Matlyst.` |
| Identitet SV | RETTET | `sv/integritet/index.html` | `Patrick Omassa Kabia är personuppgiftsansvarig för Matlyst.` |
| Samtykkeboks DA | RETTET | `da/index.html` | `Vi bruger nødvendig lagring, for at siden virker. Siger du ja,` |
| Samtykkeboks SV | UENDRET (godkjent) | `sv/index.html` | `Om du säger ja använder vi även kakor för analys` |
| produktpaastander.md | RETTET | `qa/sv-da/produktpaastander.md` | `Påstanden er sitert ordrett fra sidens avsnitt «Bra att veta» / «Godt at vide»`; testen sjekker hvert sitat mot siden |
| DA M15 | RETTET | `da/privatliv/index.html` | `til Anthropic Ireland, Limited, der er nævnt i samtykketeksten.` |
| DA del … med Matlyst | RETTET | `da/importer-opskrifter/index.html` | `Send et link, eller del indholdet med Matlyst.` |
| DA del … med Matlyst | RETTET | `da/dr-mad/index.html` | `Del linket med Matlyst, eller indsæt det i importen.` |
| DA del … med Matlyst | RETTET | `da/alletiders-kogebog/index.html` | `Del linket med Matlyst, eller indsæt det i importen.` |
| DA del … med Matlyst | RETTET | `da/tiktok/index.html` | `når du deler et link til en TikTok-video fra en offentlig konto med Matlyst.` |
| DA M4 forside | RETTET | `da/index.html` | `dele opskrifter, Madplan, Indkøbsliste og Spisekammer.` |
| DA M4 slet-konto | RETTET | `da/slet-konto/index.html` | `Madplan, Indkøbsliste, Spisekammer, husstandsmedlemskab` |
| DA M4 madplan-app | RETTET | `da/madplan-app/index.html` | `Er Madplan og Indkøbsliste gratis?` |
| DA M4 nem-mad | UENDRET (allerede rett) | `da/nem-mad/index.html` | `Spisekammeret, Madplanen og Indkøbslisten.` |
| DA slet-konto frist | RETTET | `da/slet-konto/index.html` | `slettes automatisk senest 30 dage efter sletningen.` |
| DA like overskrifter, middagsforslag | RETTET | `da/middagsforslag/index.html` | `<h2>Hvor forslagene kommer fra</h2>` |
| DA like overskrifter, nem-mad | RETTET | `da/nem-mad/index.html` | `<h2>Fra gemt opskrift til aftensmad</h2>` |
| DA madplan-app gjentakelse | RETTET | `da/madplan-app/index.html` | `Vælg en opskrift til de dage, du vil planlægge. Du bestemmer selv, hvad der skal på bordet.` / `Deling af Madplan og Indkøbsliste i en husstand kræver Matlyst Pro.` |
| DA derhjemme, H1 | RETTET | `da/opskrifter-ud-fra-ingredienser/index.html` | `Søg med det, du har derhjemme` |
| DA derhjemme, H1 | RETTET | `da/toem-koeleskabet/index.html` | `Begynd med det, du har derhjemme` |
| DA derhjemme, tekst | RETTET | `da/toem-koeleskabet/index.html` | `passer til de varer, du har derhjemme` |
| DA derhjemme, tekst | RETTET | `da/spisekammer-app/index.html` | `Hold styr på varerne derhjemme` |
| DA kildesider | RETTET | `da/dr-mad/index.html` | `Sådan gemmer du en opskrift fra DR Mad i Matlyst` |
| DA kildesider | RETTET | `da/alletiders-kogebog/index.html` | `Sådan gemmer du en opskrift fra Alletiders Kogebog i Matlyst` |
| DA tiktok ingress/brødtekst | RETTET | `da/gem-opskrifter-fra-tiktok/index.html` | `Vælg Matlyst i delingsmenuen. Kontrollér mængder og trin, før opskriften gemmes.` |
| DA tiktok FAQ | RETTET | `da/gem-opskrifter-fra-tiktok/index.html` | `Ja. Linket gemmes med opskriften, når videoen er tilgængelig.` |
| DA privatliv formål | RETTET | `da/privatliv/index.html` | `samt til personlige daglige middagsforslag fra AI og push-notifikationer.` |
| DA privatliv lagringstid | RETTET | `da/privatliv/index.html` | `Statistik hos PostHog indsamles kun, mens dit samtykke gælder;` / `Trækker du samtykket til madloggen tilbage, slettes madloggen, og kaloriemålet nulstilles.` |
| DA privatliv Datatilsynet | RETTET | `da/privatliv/index.html` | `Datatilsynet i Danmark (datatilsynet.dk) eller i Norge (datatilsynet.no).` |
| DA privatliv overførsel | RETTET | `da/privatliv/index.html` | `Overførsel til Apple, Google (herunder Gemini), Meta og RevenueCat i USA sker på grundlag af EU-US Data Privacy Framework og ellers standardkontraktbestemmelser. Anthropic er ikke certificeret, og overførslen dertil sker på grundlag af standardkontraktbestemmelser.` |
| DA vilkaar §7 | RETTET | `da/vilkaar/index.html` | `meddeles i appen eller pr. e-mail i god tid, før de træder i kraft. Hvis du ikke accepterer ændringerne, kan du opsige aftalen.` |
| SV M-A overføring | RETTET | `sv/integritet/index.html` | `Apple, Google (inloggning, köp, Gemini, Google Analytics och reCAPTCHA), Meta och RevenueCat: EU–US Data Privacy Framework, i andra hand standardavtalsklausuler.` |
| SV M-A AI-behandling | RETTET | `sv/integritet/index.html` | `till Anthropic Ireland, Limited, som nämns i samtyckestexten. Äldre konton utan den nya bekräftelsen använder tills vidare Google (Gemini API)` |
| SV M-B artikel 9 | RETTET | `sv/integritet/index.html` | `Matlogg och kalorimål behandlas bara med ditt uttryckliga samtycke enligt artikel 6.1 a och artikel 9.2 a.` |
| SV M-D villkor §5 | RETTET | `sv/villkor/index.html` | `räknat från den dag avtalet ingås` / `och samtidigt godtar att du därmed förlorar ångerrätten. Köpet görs hos Apple eller Google, som hanterar betalning, ångerrätt och eventuell återbetalning enligt den lag som gäller för dig.` |
| SV M-D Apple-konto | RETTET | `sv/villkor/index.html` | `inställningarna för ditt Apple-konto` |
| SV M9 | RETTET | `sv/integritet/index.html` | `Vi behandlar uppgifter om ditt konto och din inloggning, profil och inställningar` |
| SV forside | RETTET | `sv/index.html` | `dela recept, Veckomeny, Inköpslista och Skafferi.` |
| SV Skafferi konsekvent | RETTET | `sv/inkopslista/index.html` | `När en vara bockas av kan den flyttas till Skafferi.` |
| SV villkor §6 | RETTET | `sv/villkor/index.html` | `Kontrollera allergener, hållbarhetstid och säker tillagning själv.` |
| SV overlinje | RETTET | `sv/integritet/index.html` | `<p class="eyebrow">Integritet och villkor</p>` (vises i versaler via CSS) |
| SV begäranden | RETTET | `sv/integritet/index.html` | `Frågor och begäranden skickas till` |
| SV begäranden | RETTET | `sv/villkor/index.html` | `Frågor och begäranden skickas till` |
| SV begäranden | RETTET | `sv/radera-konto/index.html` | `behandlar din begäran inom 30 dagar.` |
| SV begäranden | RETTET | `sv/receptskapare/index.html` | `tar emot begäranden från rättighetshavare.` |
| SV like overskrifter, enkel-middag | RETTET | `sv/enkel-middag/index.html` | `<h2>Från sparat recept till middag</h2>` |
| SV like overskrifter, veckomeny-app | RETTET | `sv/veckomeny-app/index.html` | `<h2>Så fungerar Veckomeny</h2>` |
| SV doble avsnitt, tiktok | RETTET | `sv/spara-recept-fran-tiktok/index.html` | `Välj Matlyst i delningsmenyn. Kontrollera mängder och steg innan receptet sparas i din samling.` |
| SV doble avsnitt, paprika | RETTET | `sv/byt-fran-paprika/index.html` | `Matlyst kan importera recept från länkar och filer som appen stöder.` (ansvarsfraskrivelsen om Paprika står igjen under «Bra att veta») |
| SV /sv/tiktok/ | RETTET | `sv/tiktok/index.html` | `delar en länk till en TikTok-video från ett offentligt konto med Matlyst.` |
| hreflang juridiske sider | RETTET | `sv/integritet/index.html` | Ingen `hreflang="nb-NO"` eller `hreflang="x-default"`; gjelder alle 48 sv/da-sider, også støttesidene |
