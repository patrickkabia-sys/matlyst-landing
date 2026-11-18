# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

To besøkende er like viktige (bekreftet av Patrick 18.11.2026):

- **Den som googlet et spørsmål.** Lander på en guide, en høytidsside eller en omregner, mest på mobil, og kjenner ikke Matlyst fra før. Jobben er å få svaret raskt. Rundt 800 av de 851 sidene er slike sider.
- **Den som kommer fra sosiale medier eller en annonse til forsiden.** Har sett Matlyst på Instagram, TikTok eller YouTube og vil se hva appen er før nedlasting.

Kjernebrukeren av appen er hjemmekokker på 25 til 45 år, med tyngdepunkt hos kvinner i småbarnsfamilier, som lagrer matvideoer i sosiale medier og ikke finner dem igjen når middagen skal lages.

## Product Purpose

matlyst-app.no er nettsiden til oppskriftsappen Matlyst. Siden skal gi det beste svaret på spørsmålet den besøkende kom med. Appen vises etterpå, rolig, som neste steg. Suksess er først at siden svarer godt (søk, lesbarhet, tillit) og deretter at den besøkende laster ned appen.

Appen henter oppskriften fra en lenke, en video eller et bilde, oversetter den til brukerens språk og gjør målene metriske. Derfra planlegger brukeren uka, handler og lager maten.

## Positioning

Matlyst får oppskriftene ut av Instagram, TikTok og nettsider og inn i en handleliste, på brukerens eget språk og med lokale mål. Hele kjeden ligger i én app: import, arkiv, ukemeny, handleliste, spiskammer og kokemodus.

## Operating Context

- Fire språk: norsk bokmål, svensk, dansk og amerikansk engelsk. Hvert språk har egne adresser og egne skjermbilder av appen.
- 851 sider per 18.11.2026: forsider, guider, høytidssider, enhetsomregnere, blogg og juridiske sider. De fleste er generert av skript, noen er håndlaget.
- De fleste besøk kommer fra søk på mobil.
- Siden er statisk HTML og CSS med Node-generatorer, og ligger på GitHub Pages.
- Appen finnes for iPhone, iPad og Android.

## Capabilities and Constraints

- Ingen adresse endres. Sidene er under indeksering, og hver URL står.
- Teksten er godkjent. Redesign endrer form, ikke innhold.
- Priser og prøveperioder testes og varierer. Ingen pris hardkodes i design eller eksempeltekst.
- Fakta om appen hentes fra `llms.txt`, som er kontrollert mot appens kode.
- Navn: alle fire språk heter Matlyst i dag. Smoop er valgt som merkenavn utenfor Norden, men er ikke tatt i bruk. Designet skal tåle at navn og logo byttes på engelsk uten ny tegning (bekreftet av Patrick 18.11.2026).
- Appen har ingen reklame og sporer ikke brukere på tvers av apper. Nettsiden skal ikke gi et annet inntrykk.

## Brand Commitments

- Logoen er «ml.» med oransje punktum. Den hentes fra `main`.
- Bare ekte skjermbilder av appen og egne bilder. Aldri arkivfoto, og aldri illustrasjoner som later som de er appen.
- Aldri snakk ned konkurrenter. Paprika nevnes bare når det gjelder flytting av oppskrifter.
- Ikke selg på KI. Selg på resultatet: oppskriften er ferdig, på ditt språk, med dine mål.
- Tekst skrives uten tankestrek som skilletegn.
- Språkene skrives som av en innfødt, ikke oversatt fra norsk setning for setning.

## Evidence on Hand

- Skjermbilder av appen på nb, sv og da (33 PNG, 1179 x 2556) og på engelsk i `images/en-guide/`.
- 15 korte filmer av appen i bruk i `images/en-guide/` og delingsfilmer per språk.
- ml.-logoen rendret i materialer (smør, mel, spaghetti, keramikk, honning, glass, sjokolade og flere), som stillbilder og løkker.
- 29 bloggartikler på fire språk.
- Vurdering i App Store: 5,0 av 12 vurderinger i Norge per 5.10.2026. Tallet må sjekkes på nytt før det vises.
- Finnes ikke og skal ikke diktes opp: kundesitater, pressesitater, brukertall og sammenligningstall mot konkurrenter.

## Product Principles

1. Svar først, appen etterpå.
2. Vis appen slik den er. Produktet er beviset.
3. Én side, ett spørsmål, ett svar øverst.
4. Samme opplevelse på alle fire språk og på alle skjermbredder.
5. Ingenting som gjør siden tregere eller dytter svaret ned.

## Accessibility & Inclusion

WCAG 2.2 AA på alle sider: tekst minst 4,5:1, stor tekst og ikoner minst 3:1, trykkflater minst 44 px, full tastaturbruk og `prefers-reduced-motion` respektert. Synlig tekst på en knapp skal være med i det tilgjengelige navnet (2.5.3).
