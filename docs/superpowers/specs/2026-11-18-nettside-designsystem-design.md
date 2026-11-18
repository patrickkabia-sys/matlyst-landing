# Designspec for matlyst-app.no: Lekeboks møter Standby

Status: versjon 2, 18.11.2026 kveld. Venter på Patricks lesing. Erstatter utkastet «siden er en oppskrift».

Skisse: https://claude.ai/artifact/PEkJo7nDu8WXZEUHCbf5Eq (forside på PC og mobil, guide på PC og mobil, omregner på mobil).
Produktgrunnlag: `PRODUCT.md` i roten av repoet.

Det som er merket **(mitt valg)** har Patrick ikke tatt stilling til. Alt annet er valgt eller bekreftet av ham 18.11.

## 1. Hvorfor

Nettsiden har gått fra 30 til 851 sider på kort tid. Teksten er god. Sideopplevelsen er ikke like god: sidene er bygget av flere generatorer og håndlagde filer, og det synes. Dagens uttrykk (krem, Fraunces, terrakotta) er dessuten blitt det vanlige «varme KI-uttrykket», og guidene viser ikke appen.

Patrick vil ha:

- Ett konsept på alle 851 sider på fire språk. Én meny, én språkvelger.
- Seriøst og profesjonelt.
- Mobil like bra som PC.
- Sider som er lette å lese, og ingen artikkelvegg.
- Ingen overlapp og ingen tekst som renner ut, på noen skjermbredde.

Moodboardet hans var clocks.app, notbor.ing og supercute.io. Av tre konsepter valgte han en kombinasjon av to: Lekeboks (etter !Boring) og Standby (etter Clocks).

## 2. Mål, ikke-mål og feilmål

**Mål**
- Alle sider bruker samme sideskall, samme tokenfil og samme komponenter.
- Svaret står øverst på hver guide og hver omregner. Appen kommer etterpå.
- Revisjonen (punkt 9) går grønn på 360, 390, 768 og 1280 px for alle sider, og den kjører i CI.
- Dagens 35 farger, 46 skriftstørrelser, 26 hjørneradier og 14 skygger erstattes av tokenene i punkt 5.

**Ikke-mål**
- Ny logo. ml.-logoen står.
- Omskriving av tekst. Vi endrer form, ikke innhold.
- Nye adresser. Ingen URL endres.
- Mørk modus. Siden er lys **(mitt valg)**.

**Feilmål** (dette ville vært en fiasko selv om det teknisk virker)
- Lekeboksen tar over. Fliser på hver side og i hver seksjon gjør siden barnslig og sliten.
- Standby tar over. Alt blir hvitt og grått, og siden kunne tilhørt hvilken som helst app.
- Pynt som gjør siden tregere eller dytter svaret ned.
- Mobil som en krympet PC-side.

## 3. Tilnærminger

**A. Felles sideskall og komponenter i dagens uttrykk.** Minst risiko, men løser ikke at uttrykket er generisk. Det var anbefalingen i utkastet. Valgt bort da Patrick ba om nytt konsept.

**B. Nytt visuelt konsept, side for side.** Raskt synlig på forsiden, men 851 sider kan ikke tegnes for hånd, og avvikene kommer tilbake ved neste generator.

**C. Nytt visuelt konsept båret av felles skall og komponenter (valgt).** Utseendet byttes ett sted (tokenfil og komponenter), og alle generatorer bruker de samme byggeklossene. Mest arbeid nå, lavest vedlikehold, og revisjonen låser resultatet. Risikoen for søk holdes nede ved at adresser, tekst, overskriftsnivåer og strukturerte data står urørt.

## 4. Konseptet: én verden, to lydnivåer

Standby er rommet. Lekeboks er tingene i rommet.

- **Standby gir roen:** hvit flate, smal lesekolonne, grå kort med myke hjørner, ekte skjermbilder av appen, mye luft.
- **Lekeboks gir særpreget:** ml.-logoen i smør, mel, honning og glass som fysiske fliser, og små koder i skrivemaskinskrift («!IMPORT · ML·01»).

Det som gjør kombinasjonen pen, er at de to deler alt unntatt lydnivået:

1. **Én skrift.** Schibsted Grotesk i overskrifter og brødtekst.
2. **Én form.** Flisene har appikonets myke hjørner, og kort og knapper følger samme form. Ingen harde kanter og ingen forskjøvet skygge.
3. **Flisene er eneste farge.** Alt rundt er hvitt, varm grå og nesten svart. Flisene har varme bakgrunner, og en kald grå ville gjort dem skitne.
4. **Svart knapp.** En oransje knapp ville konkurrert med smør og honning.
5. **Hver flis har en fast rolle.** Samme flis står på forsiden og øverst i guiden om samme funksjon. Det binder sidene sammen.
6. **Leken doseres etter sidetype** (punkt 6).

## 5. Tokens

Alt under ligger i én fil, `tokens.css`. Ingen andre verdier brukes.

**Farger**

| Token | Verdi | Bruk |
|---|---|---|
| `--flate` | `#FFFFFF` | Sidebakgrunn |
| `--hylle` | `#F3F1EC` | Kort, svarkort, scenen bak telefonen |
| `--linje` | `#E4DFD6` | Skillelinjer og rammer |
| `--blekk` | `#141210` | Tekst, knapper, stegtall |
| `--dempet` | `#5B554D` | Støttetekst. 7:1 på hvitt, 6:1 på hylle |
| `--prikk` | `#FF5500` | Punktumet i logoen og små merker. Aldri tekst |
| `--oransje-tekst` | `#C2410C` | Lenker i løpende tekst, bare på hvit flate (5,2:1) **(mitt valg)** |

**Skrift**

- Schibsted Grotesk 400, 500, 700 og 800. IBM Plex Mono 500 bare til koder og små etiketter.
- Begge legges som woff2 i `fonts/` og lastes derfra, slik Fraunces og DM Sans gjør i dag. Ingen forespørsel til Google **(mitt valg)**.
- Fraunces og DM Sans fjernes når siste side er flyttet.

| Rolle | Mobil | PC | Vekt | Linjeavstand |
|---|---|---|---|---|
| H1 forside | 40 px | 68 px | 800 | 1,02 |
| H1 guide og omregner | 34 px | 52 px | 800 | 1,06 |
| H2 | 24 px | 30 px (44 px på forsiden) | 800 | 1,15 |
| H3 | 22 px | 24 px (30 px i kort) | 800 | 1,2 |
| Brødtekst | 18 px | 19 px | 400 | 1,6 |
| Svarkort | 19 px | 21 px | 500 | 1,5 |
| Støttetekst | 15 px | 15 px | 400 | 1,4 |
| Kode (mono) | 12 px | 13 px | 500 | 1,4 |

Linjelengde maks 68 tegn. Overskrifter har negativ bokstavavstand (0,02 til 0,035 em), brødtekst har ingen. Koder står i store bokstaver med 0,06 em avstand og er aldri lengre enn fire ord.

**Form**

| Token | Verdi | Bruk |
|---|---|---|
| `--r-flis` | 23 % av bredden | Fliser i alle størrelser |
| `--r-liten` | 16 px | Felt og små flater |
| `--r-kort` | 28 px | Kort på mobil og i lesekolonnen |
| `--r-scene` | 36 til 40 px | Store kort og scenen på forsiden |
| `--r-pille` | 999 px | Knapper og språkvelger |

**Skygge.** To, og bare på fysiske ting. Gjenstandsskygge under fliser og telefoner. Trykk-kant (en lys kant under flisen) bare på fliser som er lenker. Kort har ingen skygge.

**Avstand.** Én skala: 4, 8, 12, 16, 20, 24, 28, 40, 56, 64, 112 px. Seksjoner har 64 px luft på mobil og 112 px på PC.

## 6. Fliser og dosering

**Seks faste roller**

| Kode | Flis | Funksjon |
|---|---|---|
| !IMPORT · ML·01 | Smør | Import fra Instagram, TikTok, nettsider og bilder |
| !SKALER · ML·02 | Mel | Porsjoner og mengder |
| !HANDLELISTE · ML·03 | Spaghetti | Handleliste |
| !SPISKAMMER · ML·04 | Keramikk | Spiskammer |
| !KOKEMODUS · ML·05 | Honning | Kokemodus og tidtaker |
| !OMREGNER · ML·06 | Glass | Enhetsomregnere |

Honningflisen er også logomerket i toppen. Ukemeny, Spør Matlyst, høytider og blogg har ingen egen flis i dag. De bruker flisen til funksjonen siden handler mest om, og logoflisen når ingen passer **(mitt valg)**. Nye fliser kan lages senere, men aldri mer enn én per funksjon. Juridiske sider har ingen flis.

**Dosering**

| Sidetype | Lek |
|---|---|
| Forside | Full lekeboks: fire fliser rundt telefonen i scenen, rad med seks fliser som lenker, én flis ved avslutningen |
| Hub (alle guider, alle omregnere) | Én rad med fliser som navigasjon. Resten er lister og kort |
| Guide, høytid, omregner, blogg | Én liten flat flis med kode øverst. Én flis i app-kortet nederst. Ellers ingen |
| Juridisk | Ingen |

Fliser brukes aldri som pynt mellom avsnitt.

## 7. Sideskall og regler

**Topp**
- Logoflis og navn til venstre. Guider, Verktøy og Om oss. Språkvelger. Svart «Last ned»-pille.
- På mobil: logo, «Last ned» og menyknapp. Språkvelgeren ligger i menyen og i bunnen.
- Toppen ruller med siden. Den er ikke klebrig **(mitt valg)**.
- Menyknappens tilgjengelige navn er det samme som den synlige teksten.

**Ingen fast nedlastingslinje på mobil.** Utkastet hadde en. Den og den faste toppen tok 17 % av skjermen, og Patrick valgte «svar først, appen etterpå». Nedlasting ligger i toppen og i app-kortet nederst **(mitt valg, endrer utkastet)**.

**Bunn**
- Én rad med få lenker (Guider, Omregnere, Høytider, Personvern, Vilkår), språkvelger og sosiale lenker. Ingen lenkelister per side.

**Guide og omregner, ovenfra**
1. Flis og kode.
2. H1.
3. Svarkortet («Kort svar») på grå hylle. På omregnere står tallet stort.
4. Appen som nærbilde, eller selve kalkulatoren.
5. Stegene, tabellen eller teksten.
6. «Les også» som enkle rader.
7. App-kortet med nedlastingsknapp.

**Appen vises som nærbilde.** I guider beskjæres skjermbildet til den delen teksten handler om, bredt nok til at teksten i bildet kan leses. Hel telefon i ramme brukes bare på forsiden og i funksjonskortene. Skjermbildet er alltid på sidens språk.

**Rytme mot artikkelvegg**
- Maks tre tekstavsnitt etter hverandre før noe visuelt: nærbilde, tabell, kort eller kalkulator.
- Avsnitt på maks fire linjer på mobil.
- Nummer bare der innholdet er en rekkefølge.
- Lange FAQ-er er trekkspill.

**Mobil først**
- Tegnes på 390 px og skaleres opp.
- Trykkflater minst 44 px. Brede tabeller ruller i spalten. Siden ruller aldri sidelengs.

**Bevegelse**
- Flisene på forsiden kan vippe lett når man peker eller trykker på dem. Ingenting annet beveger seg av seg selv **(mitt valg)**.
- Dagens filmer av appen beholdes der de står, og starter når de kommer til syne.
- `prefers-reduced-motion` skrur av alt.

**Trykk-kant og knappeform bare på ting som kan trykkes.**

**Navnebytte på engelsk.** Navn, logoflis og flisbilder hentes fra én innstilling per språk. Blir engelsk til Smoop, byttes verdiene der, og flisene rendres på nytt for engelsk. Ingen side tegnes om.

## 8. Komponenter

Topp, bunn, språkvelger, flis (lenke og flat), kodeetikett, svarkort, nærbilde av appen, telefon i ramme, funksjonskort, nummererte steg, tabell, kalkulator, FAQ-trekkspill, «Les også»-rader, app-kort, knapp (svart pille og tekstlenke), bloggkort.

Hver komponent får én HTML-funksjon og én CSS-blokk. Alle vises samlet på en intern side (`/design/`, noindex).

## 9. Låsing og måling

- Revisjonsskriptet (Playwright) inn i repoet som test: alle sider på 360, 390, 768 og 1280 px. Det feiler ved sidelengs rulling, overlapp, elementer utenfor toppen, H1 utenfor skalaen, farge eller skriftstørrelse utenfor tokenene, mer enn tre avsnitt uten noe visuelt, eller flis på en sidetype som ikke skal ha den.
- Kontrast regnes fra tokenfila i en egen test.
- Lighthouse på mobil for én side per sidetype: ytelse og tilgjengelighet minst 95.
- Skjermbilder av én side per sidetype på mobil og PC før hver designendring merges.
- Søk: klikk og visninger i Search Console sammenlignes to uker før og etter hver utrulling.

## 10. Utrulling

Én sidetype om gangen, hver med egen PR og egen måling **(mitt valg)**:

1. Tokenfil, skrifter, sideskall og komponentside.
2. Guider (flest sider, mest å vinne).
3. Omregnere.
4. Forsidene på fire språk.
5. Hubber, høytider og blogg.
6. Juridiske sider.

Gamle stiler slettes når siste sidetype er flyttet.

## 11. Det byggeren avgjør selv

Rekkefølgen generatorene flyttes over i innenfor hver sidetype, eksakte mellomstørrelser i `clamp()`, bildeformater og størrelser for flisene, og hvordan revisjonen deles opp i CI.

## 12. Åpent

- Hvilken flis ukemeny og Spør Matlyst skal ha hvis de får egne. Ikke nødvendig for å starte.
- Om flisene skal rendres på nytt med lik bakgrunn. I dag har de ulike underlag (grønn, sand, krem, mørk brun). Det ser ut som en lekeboks på forsiden, men kan vurderes når guidene er ute.
