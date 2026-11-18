# Designspec for matlyst-app.no: lett, levende og bygget rundt appen

Status: versjon 3, godkjent av Patrick 18.11.2026. Erstatter versjon 2 («Lekeboks møter Standby»).

Prototype: https://claude.ai/artifact/C9caMSz3tjdQNizGLDnB27 (versjon 39). Den er fasit for forsiden og for sideskallet.
Kildefila ligger i `docs/superpowers/prototyper/2026-11-18-forside.html`. Bilder, film og logoer ligger i `~/matlyst-privat/seo-matlyst/2026-11-18/nettfilm/` og i artefaktet.
Produktgrunnlag: `PRODUCT.md` i roten av repoet.

Det som er merket **(mitt valg)** er mine forslag. Patrick godkjente specen som helhet 18.11, men tok ikke stilling til hvert av dem for seg. Alt annet er valgt eller bekreftet av ham 18.11, enten i valgkort eller i kommentarer på prototypen.

## 1. Hvorfor

Nettsiden har gått fra 30 til 851 sider på kort tid. Teksten er god. Sideopplevelsen er ikke like god: sidene er bygget av flere generatorer og håndlagde filer, og det synes. Dagens uttrykk (krem, Fraunces, terrakotta) er blitt det vanlige «varme KI-uttrykket», og sidene viser ikke appen i bruk.

Patrick vil ha:

- Ett konsept på alle sider på fire språk. Én meny, én bunn.
- Lett og minimalistisk, som pasteapp.io. Seriøst og profesjonelt.
- Appen i bruk: importflyten som film øverst, og appens egne flater som bevis nedover.
- Liv på siden, etter afternow.co: ting som beveger seg rolig, og en side som ligger som et kort over en flat bunn.
- Mobil like bra som PC. Ingen overlapp og ingen tekst som renner ut.

## 2. Hva som er endret fra versjon 2

Versjon 2 bygget på fliser med ml.-logoen som fysiske gjenstander, og små koder i skrivemaskinskrift. Patrick gikk bort fra det underveis:

- **Ingen svevende fliser.** «Den flytende effekten kan du fjerne. Det er rotete.» Flisene finnes nå bare i menyen og i bunnen, én per hylle.
- **Ingen koder.** «! og ML·01 må bort.»
- **Film i stedet for skjermbilde.** Importflyten vises som film med stegene ved siden av.
- **Appens flater gjenskapes i HTML.** Beskårne nærbilder av skjermbilder «blir fort stygt». Kortene viser i stedet de samme flatene som appen har, med appens farger og skrifter.
- **Toppen følger med på PC, og mobil har fast nedlastingsknapp.** Versjon 2 hadde ingen av delene.
- **Guide og omregner er ikke tegnet på nytt.** Eksempelet på en guide ble tatt ut av prototypen fordi det ikke hørte hjemme på forsiden. De tegnes som egne prototyper (punkt 13).

## 3. Mål, ikke-mål og feilmål

**Mål**
- Forsiden på fire språk er bygget etter prototypen.
- Alle sider bruker samme sideskall (topp, hyllemeny, bunn i tre lag), samme tokenfil og samme komponenter.
- Dagens 35 farger, 46 skriftstørrelser, 26 hjørneradier og 14 skygger erstattes av tokenene i punkt 6.
- Revisjonen (punkt 11) går grønn på 360, 390, 768 og 1280 px for alle sider, og den kjører i CI.

**Ikke-mål**
- Ny logo. ml.-logoen står.
- Omskriving av tekst på undersidene. Vi endrer form, ikke innhold.
- Nye adresser. Ingen URL endres.
- Mørk modus. Siden er lys **(mitt valg)**.
- Kronebeløp. Prisen testes og varierer, og står aldri på nettstedet.

**Feilmål** (dette ville vært en fiasko selv om det teknisk virker)
- Rot: mange ting som beveger seg uten grunn, eller pynt mellom avsnitt.
- En side som kunne tilhørt hvilken som helst app. Appens egne flater og ordmerket er det som gjør den til Matlyst.
- Påstander appen ikke holder: kilder som ikke virker, tall som ikke er hentet, funksjoner i feil kolonne under Gratis og Pro.
- Mobil som en krympet PC-side.

## 4. Tilnærminger

**A. Felles sideskall og komponenter i dagens uttrykk.** Minst risiko, men løser ikke at uttrykket er generisk. Valgt bort da Patrick ba om nytt konsept.

**B. Nytt visuelt konsept, side for side.** Raskt synlig på forsiden, men 851 sider kan ikke tegnes for hånd, og avvikene kommer tilbake ved neste generator.

**C. Nytt visuelt konsept båret av felles skall og komponenter (valgt).** Utseendet byttes ett sted (tokenfil og komponenter), og alle generatorer bruker de samme byggeklossene. Mest arbeid nå, lavest vedlikehold, og revisjonen låser resultatet. Risikoen for søk holdes nede ved at adresser, tekst, overskriftsnivåer og strukturerte data på undersidene står urørt.

Innenfor C er retningen endret fra «fliser og koder» til «film, appflater og dybde» (punkt 2).

## 5. Konseptet

Tre ting bærer uttrykket:

1. **Ro i rammen.** Hvit flate, varm grå hylle, nesten svart tekst, én skrift, runde hjørner, svart knapp. Oransje finnes bare i ordmerket og inne i appens egne flater.
2. **Appen er innholdet.** Importfilmen øverst, og kort som gjenskaper appens flater med appens egne farger og skrifter. Ingen pynteillustrasjoner.
3. **Dybde og rolig bevegelse.** Siden er et kort med avrundet bunn som ligger over en flat, mørk bunn. Film, kort og samlebånd går i loop.

## 6. Tokens

Alt under ligger i én fil, `tokens.css`. Ingen andre verdier brukes i sideskallet og på forsiden.

**Farger i rammen**

| Token | Verdi | Bruk |
|---|---|---|
| `--flate` | `#FFFFFF` | Sidebakgrunn |
| `--hylle` | `#F5F3EF` | Kort, hylledelen i bunnen, prisplan Gratis |
| `--linje` | `#E6E2DB` | Skillelinjer og rammer |
| `--blekk` | `#141210` | Tekst, knapper, den mørke bunnen, prisplan Pro |
| `--blekk-lys` | `#2B2723` | Knapp ved peker over |
| `--dempet` | `#5F5952` | Støttetekst |
| På mørk bunn | `#F3EFE8`, `#E9E5DE`, `#A8A199` | Ordmerke, lenker og støttetekst i den mørke bunnen |

**Farger i appens flater** (speiler `lightTheme` i appens `constants/colors.gen.ts`, og skal følge den)

| Token | Verdi | Bruk |
|---|---|---|
| `--a-flate` | `#FFFFFF` | Kort i appen |
| `--a-tekst` | `#1A1714` | Tekst |
| `--a-dempet` | `#69645E` | Støttetekst |
| `--a-oransje` | `#B03B00` | Oransje tekst (mengder, lenker) |
| `--a-knapp` | `#B34600` | Fylt knapp |
| `--a-merke` | `#FF5500` | «lyst» i ordmerket. Aldri brødtekst |
| `--a-gronn` | `#146B3A` | «Har du» og avhuket |
| Kula | `#F9C8B3`, `#EFC5D4`, `#BEB4DF` | Spør Matlyst |

**Skrift**

- **Schibsted Grotesk** 400, 500 og 700: all tekst i rammen.
- **Fraunces** kursiv 300 og 400 med optisk størrelse 144: ordmerket. Fraunces 500 og 600: titler inne i appens flater.
- **DM Sans**: brødtekst inne i appens flater.
- **IBM Plex Mono** 500: bare stegtall og små merker som «PRO».
- Alle legges som woff2 i `fonts/` og lastes derfra. Ingen forespørsel til Google **(mitt valg)**. Prototypen laster fra Google Fonts fordi den er en prototype.

| Rolle | Mobil | PC | Vekt | Linjeavstand |
|---|---|---|---|---|
| H1 forside | 38 px | 52 til 70 px | 700 | 1,05 |
| H2 | 30 px | 44 px | 700 | 1,08 |
| Ingress | 18 px | 20 px | 400 | 1,5 |
| Brødtekst | 18 px | 18 px | 400 | 1,55 |
| Samlebånd | 26 px | 30 px | 700 | 1,1 |
| Støttetekst | 15 px | 15 px | 400 | 1,4 |

Overskrifter har bokstavavstand −0,028 em og `text-wrap: balance`.

**Ordmerket** skrives nøyaktig som i appen (`components/Logo.tsx`): små bokstaver, «mat» i Fraunces kursiv 300 og «lyst» i Fraunces kursiv 400 i `#FF5500`. Ved siden av logoflisen løftes det 0,11 em, slik at de små bokstavene står på flisens midtlinje.

**Form**

| Verdi | Bruk |
|---|---|
| 999 px | Knapper og piller |
| 24 px | Matbilder |
| 28 px | Menypanelet, svarkortet i Spør Matlyst |
| 32 px | Kort, prisplaner, QR-vinduet |
| 40 px | Flaten bak Spør Matlyst |
| 44 px (32 px på mobil) | Bunnen av det hvite bladet og av hele kortet |
| 23 % av bredden | Logofliser |

**Skygge.** Bare på ting som ligger over noe: telefonen, det hvite bladet, hele kortet, menypanelet, QR-vinduet og appens egne kort. Vanlige kort har ingen skygge.

**Avstand.** Seksjoner har 136 px luft over seg på PC og 88 px på mobil. Unntak: «Din egen kokebok» står like langt under samlebåndet som båndet står under telefonen (72 px på PC, 52 px på mobil). Innholdsbredden er 1152 px med minst 16 px sidemarg.

**Brytpunkter.** 720 px (mobil) og 1000 px (PC-oppsett i toppen, klebrig topp, følgemeny).

## 7. Sideskallet (alle sider)

**Topp**
- Logoflis og ordmerke til venstre. Menyknapp og svart «Last ned» til høyre.
- På PC (over 1000 px) er toppen klebrig og halvt gjennomsiktig med uskarp bakgrunn. På mobil ruller den med siden.
- På forsiden har toppen en følgemeny i midten på PC: Lagre, Spør Matlyst, Lag maten, Pris, Spørsmål. Et merke glir til den delen man er i. Undersider har ikke følgemeny **(mitt valg)**.
- **Påskeegg:** logoflisen bytter mellom alle de 40 logoformene, én ny hvert tredje sekund. Peker over gir raskt bytte, trykk gir neste.

**Meny: kjøkkenhyllene**
- Menyen er et panel med seks hyller. Hver hylle har en logoflis, et navn og lenker under: Appen, Lagre oppskrifter, Middag, Verktøy, Kjøkkentips, Matlyst.
- Stilen er «Strek» (alternativ C): flisen står på en strek, lenkene henger under.
- På mobil er hver hylle foldet sammen og åpnes med et trykk.
- Verktøy-hylla har: Enhetsomregner, Cups til dl, Dl til cups, Celsius til Fahrenheit, Dl til gram, Porsjoner, Kakeform, Steketid, Pizzadeig, Gjær, Alle kalkulatorer. De seks siste finnes ikke ennå og skal bygges (punkt 13).

**Bunn i tre lag**
1. **Det hvite bladet:** alt innhold. Avrundet bunn og skygge.
2. **Hylledelen:** de samme seks hyllene som i menyen, hentet fra samme kilde så de aldri kan bli ulike. Under dem linja «Den oppskriften du lagret? Lag den i kveld.» og nedlastingsknappen. Ligger under bladet, på varm grå. På mobil er hyllene foldet sammen.
3. **Den mørke bunnen:** helt flat. Ordmerket stort og midtstilt, så to linjer fra kant til kant: vilkår til venstre og språk til høyre, deretter «© 2026 Matlyst. Laget i Norge» med norsk flagg til venstre og e-postadressen til høyre. På mobil står alt midtstilt.

Blad og hylledel utgjør til sammen ett kort med avrundet bunn og kraftig skygge. Den mørke bunnen står fast nederst (`position: sticky; bottom: 0`), og kortet glir opp over den når man ruller til enden.

**Nedlasting**
- På PC åpner alle nedlastingsknapper et vindu med QR-kode til `matlyst-app.no/app`, som sender telefonen til riktig butikk. Under koden står lenker til App Store og Google Play.
- På mobil går knappene rett til `matlyst-app.no/app`.
- På mobil dukker en fast nedlastingsknapp opp nederst når knappen i toppen er rullet bort. Den forsvinner før knappen i hylledelen kommer til syne. Den står på et lyst, halvt gjennomsiktig felt så den synes over både lyse og mørke flater.

## 8. Forsiden, ovenfra

1. **Topp.** Overskriften «Oppskrifter du faktisk lager.» skrives inn tegn for tegn når siden åpnes, og punktumet kommer etter en liten pause. Ingress, nedlastingsknapp og «5,0 av 5 i App Store» med fem stjerner. Antall vurderinger vises ikke før tallet er høyere.
   - PC: tekst og de seks stegene til venstre, telefonen til høyre. Hele telefonen synes i første skjerm på 1280 × 800.
   - Mobil: overskrift, knapp, stjerner, telefon med gjeldende steg over, og så ingressen under telefonen.
2. **Importfilmen.** Bare telefonen, klippet nøyaktig, uten ramme fra filmen. Seks steg: Trykk på papirflyet, Trykk Del til, Velg Matlyst, Velg mappe og trykk Lagre, Matlyst henter oppskriften, Ferdig. Steget som vises i filmen er uthevet, og et trykk på et steg hopper dit. Filmen går i 1,2 ganger fart.
3. **Samlebånd med kilder.** «Lagre oppskrifter fra»: Instagram, TikTok, YouTube, Facebook, Nettsider, Matblogger, Bildegalleri, Kokebøker. Logo og navn glir fra høyre mot venstre i full bredde. En kilde kommer bare på båndet når import derfra er målt (punkt 12).
4. **Din egen kokebok.** Åtte rettekort som i appen: bilde, tittel i Fraunces og tid. På PC glir raden sidelengs i takt med rullingen. På mobil sveiper man selv. Under raden står «Bildene er laget med KI.» så lenge de er det.
5. **Spør Matlyst.** Kula fra appen, et felt der et ønske skrives inn, og fire forslag («Gjør denne vegansk», «Jeg ønsker en lavkarbo-versjon», «Bytt ut fløten», «Bruk det jeg har i spiskammeret»). Når ønsket er ferdig skrevet, gløder feltet. Svaret vises i et kort som i appen, først som pulserende skjeletter i fargene fra kula, så med endringene og valgene «Overskriv» og «Lag en kopi».
6. **Fra oppskrift til middag.** Fem kort med appens flater:
   - Skaler: porsjonene går fra 4 til 6 og mengdene følger med.
   - Lag maten: et trykk på den uthevede tiden i steget, tidtakeren kommer frem i en jevn bevegelse, starter, og steget hukes av.
   - Ukemeny: uka med retter, og kalenderen som åpner seg til hele måneden.
   - Handle: varer der flere retter trenger det samme, og et langt trykk på en rett som åpner «Endre porsjoner».
   - Husstand: tre slags husstander (familien, hytteturen, 17. mai-frokosten) med profilbilder, og felles liste eller ukemeny.
   Kortene sveipes inn fra hver sin side når de kommer til syne.
7. **Hva koster det?** To kort. Gratis: 5 importer i måneden, ukemeny og handleliste, skalering, lag maten steg for steg, ingen tidsgrense. Pro: så mange importer du vil, lagre fra bilder og kokebøker, Spør Matlyst, næringsinnhold per porsjon, del med husstanden (opptil 6). «Prisen ser du i appen før du kjøper.» Under kortene: «Matlyst sporer deg ikke for reklame. Ingen annonser, ingen salg av data.»
8. **Spørsmål og svar.** Seks spørsmål som trekkspill: pris, kilder, flytting fra Paprika, oversettelse, flere om ukemeny og handleliste, Android. Svarene følger de som alt står på `importer-oppskrifter`.
9. **Bunnen i tre lag** (punkt 7).

Forsiden har ingen egen avslutningsseksjon. Den ble tatt ut fordi tre nedlastingsoppfordringer sto på rad.

## 9. Bevegelse

- **Alt går i loop, og ingenting kan stoppes.** Patricks ord: «Alt skal gå i loop. Det skal ikke være mulig å stoppe noen av dem.» Film, kort og samlebånd har verken pauseknapp eller pause ved trykk.
- Det som ikke er i bildet, står stille. Det sparer strøm og gjør at eksemplene starter når man kommer til dem.
- **Redusert bevegelse** (`prefers-reduced-motion`): alt står stille. Filmen viser plakatbildet, kortene viser sluttilstanden, samlebåndet står som en midtstilt rad, og overskriften står ferdig skrevet.
- **Kjent avvik fra WCAG 2.2.2.** Kravet sier at bevegelse som starter av seg selv og varer over fem sekunder skal kunne stoppes. Systemets innstilling for redusert bevegelse er eneste stopp. Patrick har valgt dette med åpne øyne. Det bør tas opp igjen i tilgjengelighetskontrollen før siden går ut.
- Ingenting svever eller flyter fritt. Bevegelse har alltid en retning og en grunn.

## 10. Regler for innhold

- **Ingen påstand uten kilde.** Vurderingen hentes fra App Store når siden bygges, ikke skrives inn for hånd **(mitt valg)**. Kilder på samlebåndet må være målt. Gratis og Pro følger appens kode.
- **Ingen konkurrenter** nevnes, bortsett fra Paprika, og da bare om flytting.
- **Tekst skrives fra meningen på hvert språk**, etter `matlyst-sprak`. Ingen side oversettes setning for setning.
- **«Cups», ikke «kopper»**, i omregnere og menyer.
- **Ingen tankestrek som skilletegn** i tekst på nettstedet.
- **KI-bilder merkes** der de står.

## 11. Låsing og måling

- Revisjonsskriptet (Playwright) inn i repoet som test: alle sider på 360, 390, 768 og 1280 px. Det feiler ved sidelengs rulling, overlapp, tekst utenfor sin boks, og farge eller skriftstørrelse utenfor tokenene.
- Kontrast regnes fra tokenfila i en egen test, for rammen og for appens flater.
- Hyllene i menyen og i bunnen sammenlignes i en test, så de ikke kan bli ulike.
- `test/interneFiler.test.mjs` finnes alt: ingen arbeidsfil kan publiseres, og ingen side i sitemappene kan utelates.
- Lighthouse på mobil for én side per sidetype: ytelse minst 90, tilgjengelighet minst 95 **(mitt valg)**.
- Søk: klikk og visninger i Search Console sammenlignes to uker før og etter hver utrulling.
- Nedlastinger: klikk på nedlastingsknappene og skanning av QR-koden måles per plassering **(mitt valg)**.

## 12. Det som er eksempler i prototypen og må byttes

| Hva | Status | Må gjøres |
|---|---|---|
| Svarene i Spør Matlyst («Kremet kyllinggryte» og fire svar) | Skrevet for hånd | Byttes mot ekte svar fra appen |
| Navn og profilbilder i Husstand | Oppdiktet, bildene er laget med KI | Kan stå, men merkes eller byttes |
| Mengder, datoer og retter i kortene | Oppdiktet | Kontrolleres mot hvordan appen faktisk viser dem |
| Matbildene i kokeboka | Laget med KI, merket | Patrick: behold og merk |
| «5,0 av 5 i App Store» | Hentet 18.11.2026 (12 vurderinger, norsk butikk) | Hentes ved bygging |
| Facebook på samlebåndet | 10 forsøk fra delearket siden 04.09.2026, 9 lyktes | Patrick: inn nå. Kvaliteten på de ni er ikke sjekket |
| Logoene til Instagram, TikTok, YouTube og Facebook | Fra simple-icons, vist i svart | Sjekkes mot selskapenes retningslinjer før siden går ut |
| Importfilmen | Norsk, rendret fra mal | Rendres på svensk, dansk og engelsk |

## 13. Utrulling

Hver del får egen PR og egen måling **(mitt valg)**:

1. Tokenfil, skrifter og komponentene i sideskallet. Forsiden på bokmål.
2. Forsiden på svensk, dansk og engelsk, med film og tekst på hvert språk.
3. Sideskallet (topp, hyllemeny, bunn i tre lag) på alle sider.
4. Guide tegnes som egen prototype og godkjennes. Deretter guidene, som er flest sider.
5. Omregner tegnes som egen prototype og godkjennes. Deretter omregnerne, omdøping fra «kopp» til «cups» i generatoren, og de seks nye kalkulatorene: Dl til gram (per vare), Porsjoner, Kakeform, Steketid, Pizzadeig og Gjær.
6. Hubber, høytider og blogg.
7. Juridiske sider.

Gamle stiler slettes når siste sidetype er flyttet.

## 14. Det byggeren avgjør selv

- Hvordan prototypens ene fil deles i `tokens.css`, komponent-CSS og skript, og hvordan generatorene tar dem i bruk.
- Eksakte mellomstørrelser i `clamp()`.
- Bildeformater og størrelser, og hvordan filmen lastes. Prototypen henter filmen som én fil før avspilling fordi hopp mellom stegene krevde det der. På GitHub Pages kan vanlig lasting holde, men hopp må virke i Safari.
- Hvordan vurderingen hentes ved bygging, og hva som vises hvis hentingen feiler (ingenting, ikke et gammelt tall).
- Hvordan revisjonen deles opp i CI.

## 15. Åpent

- Guide og omregner er ikke tegnet. Ingenting i denne specen bestemmer hvordan de ser ut under toppen.
- Avviket fra WCAG 2.2.2 (punkt 9).
- Om engelsk skal hete Smoop. Navn, logoflis og ordmerke hentes fra én innstilling per språk, så et bytte ikke krever at noe tegnes om.
- Om undersidene skal ha følgemeny eller fast nedlastingsknapp.
