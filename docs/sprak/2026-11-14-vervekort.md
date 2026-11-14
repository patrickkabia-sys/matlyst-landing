# Språkrapport: vervekortet (/v/, /sv/v/, /da/v/, /en/v/)

Dato: 2026-11-14. Skrevet av Claude (Opus) etter skillen `matlyst-sprak`. Ikke lest av en innfødt. Tekstene står i `scripts/vervekort/tekster.mjs`; sidene og OG-bildene lages fra dem. Ingen signering: signeringsskriptet gjelder bare appkatalogene.

## Brief

Mottakeren har fått en melding fra en venn med lenke og kode. Meldingsappen viser et forhåndsvisningskort (tittel, beskrivelse, bilde). Trykker mottakeren, sendes telefonen rett til butikken; på datamaskin vises sida. Sida forklarer i to steg hva mottakeren gjør: hent appen, lag konto med e-post og skriv koden i kodefeltet. Da får mottakeren 5 bonusimporter. Kortet skal beskrive hvor lenka går, ikke tale på vegne av den som sendte den (`docs/vervekort-jus.md`).

## Fakta tekstene bygger på (app-repoet, origin/master e25ea0ffd)

- Kodefeltet heter `auth.vervKode`: nb «Vervekode (valgfritt)», sv «Värvningskod (valfritt)», da «Henvisningskode (valgfri)», en «Referral code (optional)». Sida bruker feltnavnet uten «(valgfritt)», så mottakeren kjenner det igjen.
- Feltet finnes bare i registreringsskjemaet for e-post (`components/onboarding2/Registrering.tsx`, `app/auth/register.tsx`). Apple- og Google-registrering har det ikke. Derfor «med e-post».
- Vennen får `BONUS_IMPORTER = 5` (`lib/vervebonus.ts`) i en egen pott oppå månedskvoten. Derfor «5 ekstra gratisimporter», samme ord som appens `profil.bonusInviter` («gratisimporter»).
- En svakhet: engelsk katalog bruker både «Referral code» (feltet) og «Invite code» (`profil.vervekodeIkkeKlar`). Sida følger feltet.

## Tekstene

| nøkkel | nb | sv | da | en |
|---|---|---|---|---|
| tittel (kort og side) | Du er invitert til Matlyst | Du är inbjuden till Matlyst | Du er inviteret til Matlyst | You’re invited to try Matlyst |
| beskrivelse (kort) | Oppskriftsappen som lagrer oppskrifter fra nettet, Instagram og TikTok. Lenken åpner App Store eller Google Play. | Receptappen som sparar recept från webben, Instagram och TikTok. Länken öppnar App Store eller Google Play. | Opskriftsappen, der gemmer opskrifter fra nettet, Instagram og TikTok. Linket åbner App Store eller Google Play. | The recipe app that saves recipes from websites, Instagram, and TikTok. This link opens the App Store or Google Play. |
| bildeAlt | Matlyst-logoen og teksten «Du er invitert til Matlyst» ved siden av en tallerken pasta i tomatsaus med basilikum. | Matlysts logotyp och texten ”Du är inbjuden till Matlyst” bredvid en tallrik pasta i tomatsås med basilika. | Matlysts logo og teksten »Du er inviteret til Matlyst« ved siden af en tallerken pasta i tomatsauce med basilikum. | The Matlyst logo and the words “You’re invited to try Matlyst” next to a bowl of pasta in tomato sauce with basil. |
| intro | Med Matlyst lagrer du oppskrifter fra nettet, Instagram og TikTok, og bruker dem til ukemeny og handleliste. | Med Matlyst sparar du recept från webben, Instagram och TikTok och använder dem i veckomenyn och inköpslistan. | Med Matlyst gemmer du opskrifter fra nettet, Instagram og TikTok og bruger dem til madplanen og indkøbslisten. | Matlyst saves recipes from websites, Instagram, and TikTok so you can plan your meals and build your grocery list. |
| stegTittel | Slik kommer du i gang | Så kommer du igång | Sådan kommer du i gang | How to get started |
| steg1 | Last ned Matlyst fra App Store eller Google Play. | Hämta Matlyst i App Store eller Google Play. | Hent Matlyst i App Store eller Google Play. | Get Matlyst from the App Store or Google Play. |
| steg2 | Lag en konto med e-post, og skriv koden i feltet «Vervekode». Da får du 5 ekstra gratisimporter. | Skapa ett konto med e-post och skriv in koden i fältet ”Värvningskod”. Då får du 5 extra gratisimporter. | Opret en konto med e-mail, og skriv koden i feltet »Henvisningskode«. Så får du 5 ekstra gratisimporter. | Sign up with email and enter the code in the “Referral code” field. You’ll get 5 extra free imports. |
| kodeEtikett | Vervekode | Värvningskod | Henvisningskode | Referral code |
| kopier / kopiert | Kopier / Kopiert | Kopiera / Kopierad | Kopier / Kopieret | Copy / Copied |
| kopierFeil | Marker koden og kopier den selv. | Markera koden och kopiera den själv. | Marker koden, og kopier den selv. | Select the code and copy it. |
| utenKode | Fikk du en vervekode i meldingen? Skriv den inn når du lager en konto med e-post. | Fick du en värvningskod i meddelandet? Skriv in den när du skapar ett konto med e-post. | Fik du en henvisningskode i beskeden? Skriv den, når du opretter en konto med e-mail. | Got a referral code in the message? Enter it when you sign up with email. |
| butikker (aria) | Last ned Matlyst | Hämta Matlyst | Hent Matlyst | Get Matlyst |
| lesMer | Les mer om Matlyst | Läs mer om Matlyst | Læs mere om Matlyst | Learn more about Matlyst |

## Ordvalg som kan diskuteres

| valg | begrunnelse | kilde |
|---|---|---|
| en «You’re invited to try Matlyst» (ikke «…to Matlyst») | En app er ikke et sted man inviteres «til» på amerikansk; «invited to try» er den vanlige vendingen. Gjør tittelen litt annerledes enn de nordiske. | https://www.merriam-webster.com/dictionary/invite (ikke slått opp i denne økta) |
| da «Henvisningskode», sv «Värvningskod», en «Referral code» | Appens egne ord for feltet (`auth.vervKode`). | `lib/sprak/{da,sv,en}/tekster.json` |
| da «Skriv koden» (ikke «Indtast») | Begrepslista: «Dansk "Skriv" for tekstinntasting (ikke "Indtast")». Lesekontrollen foreslo «Indtast»; avvist med den kilden. | skillen `matlyst-sprak`, references/begreper.md |
| da «Kopier», «Marker» (ikke «Kopiér», «Markér») | Samme regel som «Rediger» (Apple), ikke «Redigér». | references/begreper.md; https://ordnet.dk/ddo/ordbog?query=kopiere (ikke slått opp) |
| sv «Hämta», da «Hent» | Nettstedets eget ord for nedlasting (`common.download` i `scripts/generer-lokalsider.mjs`). Lesekontrollen foreslo sv «Ladda ner … från»; ikke tatt, for å holde nettstedet likt. Preposisjonen «i App Store» er usikker. | https://svenska.se/ (ikke slått opp) |
| «5» med siffer | Appen bruker siffer i de samme tekstene (`{antall}`). Lesekontrollen foreslo «fem»/«five»; ikke tatt. | `profil.bonusInviter` i katalogene |
| sitattegn | nb «», sv ”” (som `hjem.coach.svinn.tre`), da »« (som `ingenTreff`), en “”. | katalogene |
| «gratisimporter» i ett ord | Appens skrivemåte på alle tre nordiske språk. | språkrapporten 2026-10-19-vervebonus-bare-vennen.md i app-repoet |

## Lesekontroll uten fasit

Claude Haiku leste sv, da og en med skjermkonteksten, uten bokmål. På alle tre ble innholdet gjengitt riktig: lenka åpner butikken, lag konto med e-post, skriv koden i feltet, få 5 ekstra gratisimporter. Ingen grammatiske feil funnet.

Tatt: sv «använder dem till veckomenyn» → «i veckomenyn»; en «copy it yourself» → «copy it» (kalk av «selv»).
Ikke tatt: da «Indtast» (begrepslista), «fem» for «5» (appens praksis), sv «Ladda ner från» (nettstedets ord), en «free recipe imports» (appens låste ord er «free imports»).

## Usikkert

- Ingen ord er slått opp i SO, DDO eller Merriam-Webster i denne økta. URL-ene over er der oppslaget bør gjøres.
- Ingen innfødt har lest tekstene. Dansk bør leses av Henriette før DK-lansering.
