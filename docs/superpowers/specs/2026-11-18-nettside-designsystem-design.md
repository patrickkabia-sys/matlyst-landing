# Designspec for matlyst-app.no: lett, levende og bygget rundt appen

Status: versjon 4, 19.11.2026. Versjon 3 ble godkjent av Patrick 18.11.2026 og erstattet versjon 2 («Lekeboks møter Standby»). Versjon 4 legger til punkt 16 (reglene fra utrullingen og polishen 19.11) og retter punkt 7, 9, 13 og 15 etter dem. Der punkt 16 og eldre tekst er uenige, gjelder punkt 16.

Denne specen gjelder for alt arbeid med nettsiden fremover (Patrick 19.11). Reglene i punkt 16 er låst av tester; en endring som bryter dem, er en spec-endring og tas opp først.

Prototype: https://claude.ai/artifact/C9caMSz3tjdQNizGLDnB27 (versjon 42). Den er fasit for forsiden og for sideskallet.
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
- På PC (over 1000 px) er toppen klebrig med tett, nesten hvit bakgrunn (94 %) og en hårlinje under når siden er rullet. Ingen uskarp bakgrunn (punkt 16.3). På mobil ruller den med siden.
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
- På mobil dukker en fast nedlastingsknapp opp nederst når knappen i toppen er rullet bort. Den forsvinner før knappen i hylledelen kommer til syne. Den står på et tett, lyst felt så den synes over både lyse og mørke flater. På forsiden er den skjult mens flisene og Spør Matlyst er i bildet (punkt 16.2).

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
7. **Hva koster det?** To kort. Gratis: 5 importer i måneden, ukemeny og handleliste, skalering, lag maten steg for steg, ingen tidsgrense. Pro: uten grensen på fem importer, lagre fra bilder og kokebøker, Spør Matlyst, næringsinnhold per porsjon, del med husstanden (opptil 6). «Prisen ser du i appen før du kjøper.» Pro lover aldri «ubegrenset». Under kortene står det stort «Vi har bedre ting å gjøre enn å spore deg. Nyt maten din.», og under det «Matlyst sporer deg ikke for reklame. Ingen annonser, ingen salg av data.» med lenke til personvernsiden.
8. **Spørsmål og svar.** Seks spørsmål som trekkspill: pris, kilder, flytting fra Paprika, oversettelse, flere om ukemeny og handleliste, Android. Svarene følger de som alt står på `importer-oppskrifter`.
9. **Bunnen i tre lag** (punkt 7).

Forsiden har ingen egen avslutningsseksjon. Den ble tatt ut fordi tre nedlastingsoppfordringer sto på rad.

## 9. Bevegelse

- **Alt går i loop, og ingenting kan stoppes.** Patricks ord: «Alt skal gå i loop. Det skal ikke være mulig å stoppe noen av dem.» Film, kort og samlebånd har verken pauseknapp eller pause ved trykk.
- Det som ikke er i bildet, står stille. Kortene spiller bare når de er aktive, og starter forfra hver gang (punkt 16.2). Film og samlebånd går når de er i bildet.
- **Redusert bevegelse** (`prefers-reduced-motion`): alt står stille. Filmen viser plakatbildet, kortene viser sluttilstanden, samlebåndet står som en midtstilt rad, og overskriften står ferdig skrevet.
- **Kjent avvik fra WCAG 2.2.2.** Kravet sier at bevegelse som starter av seg selv og varer over fem sekunder skal kunne stoppes. Systemets innstilling for redusert bevegelse er eneste stopp. Patrick har valgt dette med åpne øyne. Det bør tas opp igjen i tilgjengelighetskontrollen før siden går ut.
- Ingenting svever eller flyter fritt. Bevegelse har alltid en retning og en grunn.

## 10. Regler for innhold

- **Ingen påstand uten kilde.** Vurderingen er en fast verdi som er låst av `test/lansering.test.mjs`, og den rettes der når den endres. Kilder på samlebåndet må være målt. Gratis og Pro følger appens kode.
- **En lenke vises først når siden finnes.** De seks nye kalkulatorene står ikke i hyllene før de er bygget.
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
| «5,0 av 5 i App Store» | Hentet 18.11.2026 (12 vurderinger, norsk butikk) | Fast verdi, låst av test |
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

**Status 19.11.2026:** steg 1, 2, 3, 4, 6 og 7 er publisert, og tjenestesidene (avmelding, bekreftelse, vervekort, innlogging, 404) har samme identitet. Alle 876 sider bruker `tokens.css`, `skall.css` og `side.css` eller `tjeneste.css`; `styles.css` er slettet. Av steg 5 er omregnerne flyttet til ny mal. Det som gjenstår av steg 5 (kalkulatoren øverst, «cups» i teksten og de seks nye kalkulatorene) er en egen runde som Patrick starter senere.

### Sidefamilier

Datadrevne sider (hundrevis av like sider fra tall med kilde) bor i `scripts/familier/`.

- **Data:** `scripts/familier/<familie>/data.<marked>.json`, én fil per marked. Skjemaet (`felles.mjs`) krever kilde på hvert tall (navn, utgiver, år, https-adresse, hentedato). Bare rader med status `kontrollert` blir sider. Samme rad-id på to markeder gir hreflang mellom språkene.
- **Maler:** `mal-<marked>.mjs` i familiens mappe: `navSide`, `sideForRad` og `tillatteTall`. Strukturerte data bygges med `skjema.mjs` (ingen HowTo, ingen FAQPage; `'faq'` i `schemas` lager FAQPage fra synlig FAQ).
- **Register:** `register.mjs` kobler familiene til `RIKE` (`rike-sider-register.mjs`), `SIDEGRUPPER` (`locale-sider.mjs`) og sideregisteret (`fam:<id>` i `sidetyper.mjs`). Alt under en familierot skal komme fra datafila.
- **Vakter:** `test/familier.test.mjs` med `test/hjelp/familievakt.mjs` krever for hver familie og marked: gyldig data, ingen tall utenfor `tillatteTall`, ingen side for lik de andre (terskel 0,2, måles på ekte sider av første familie), ingen like titler, H1 eller beskrivelser, ingen norske restord på sv, da og en, og samsvar mellom rader og filer.
- **Hva likhetsvakten ikke stopper:** terskelen på 0,2 stopper sider som er like, men ikke malsider med ulike navn og tall (40 kopier av én side med bare navn og tall byttet fikk 23 til 33 prosent «unikt»). `maskertUnik` i `familievakt.mjs` måler likheten etter at radens egne navn og alle tall er maskert, og er en opplysning uten terskel. To sider i samme marked med lik maskert tekst og like datatall er duplikater og gir rødt.
- **Sidekontroll:** PR-er går på et utvalg per familie; `felles.mjs`, `skjema.mjs` og `register.mjs` gir full kontroll (`scripts/revisjon-omfang.mjs`).

## 14. Det byggeren avgjør selv

- Hvordan prototypens ene fil deles i `tokens.css`, komponent-CSS og skript, og hvordan generatorene tar dem i bruk.
- Eksakte mellomstørrelser i `clamp()`.
- Bildeformater og størrelser, og hvordan filmen lastes. Prototypen henter filmen som én fil før avspilling fordi hopp mellom stegene krevde det der. På GitHub Pages kan vanlig lasting holde, men hopp må virke i Safari.
- Hvordan revisjonen deles opp i CI.

## 15. Åpent

- Guide og omregner bygger på grunnstilen i `side.css` (designnotatet `2026-11-19-undersider-designnotat.md`). Omregnerens neste steg (kalkulatoren øverst, seks nye kalkulatorer) er ikke tegnet.
- Avviket fra WCAG 2.2.2 (punkt 9).
- Om engelsk skal hete Smoop. Navn, logoflis og ordmerke hentes fra én innstilling per språk, så et bytte ikke krever at noe tegnes om.
- Avgjort 19.11: undersidene har fast nedlastingsknapp på mobil og ingen følgemeny.
- Tre avmeldingssider (`/sv/avregistrera/`, `/da/afmeld/`, `/en/unsubscribe/`) er håndskrevet og avviker fra generatoren. De står som kjente avvik i `test/fasit/kjede-kjente-avvik.json`.
- Innfødt lesing av forsidene på svensk, dansk og engelsk er anbefalt før de markedsføres.

## 16. Regler fra utrullingen og polishen (19.11.2026)

Alle punktene er valgt eller bekreftet av Patrick 19.11, i valgkort eller etter test i forhåndsvisning på PC og telefon. Hver regel har en test som feiler når den brytes.

### 16.1 Alt får plass på en mobilskjerm

- Synlig skjerm i mobil-Safari er omtrent 390 x 664. En flis eller en telefonmockup skal kunne ses hel.
- Telefonbilder og film begrenses med `svh` og beholder formatet.
- Appkortene på undersidene har teksten til venstre og telefonen til høyre på mobil.
- Rene tekstkort (kortsvar, scenario, innholdsfortegnelse, utheving i juridisk tekst) er lesestoff og er unntatt.
- Ingenting ruller siden sidelengs. Rader som er for brede, sveipes i sin egen boks.
- Vokter: revisjonen, «alt får plass på en mobilskjerm», ved 390 x 664 og 360 x 640 på alle sidetyper.

### 16.2 Forsidens fliser på mobil

- **Husstand** viser én rett, og husstandene ligger på én linje som sveipes.
- **Handle** har rettene på én linje som sveipes, og lista viser tre varer. Før «hold inne» ruller raden retten fram, og menyen holder seg innenfor flisen.
- **Spør Matlyst** er to fliser: spørsmål og forslag i den første, svarkortet med to endringer i den andre.
- **Stabling:** hver flis fester seg øverst, og den neste glir opp over den. Alle stablede fliser er like høye. **Ett sveip er ett kort**, også et kraftig sveip. Inn i stabelen ovenfra og ut nedenfra går fritt.
- Stabling og låsing er bare på når hvert kort får plass i høyden. På liggende telefon og med stor tekst ligger kortene vanlig under hverandre.
- Låsingen virker bare rett etter et sveip med finger inne i stabelen. Den er av ved redusert bevegelse, og den rører aldri tastatur, lenker eller søk på siden. Rullingen stoppes aldri med `preventDefault`.
- **Kortene spiller bare når de er aktive:** minst 60 % synlig (av det minste av kortet og skjermen), og i stabelen det øverste, udekkede kortet. De starter forfra hver gang og står i startbildet ellers.
- Den faste nedlastingsknappen er skjult mens flisene eller Spør Matlyst er i bildet.
- PC er uendret: rutenett, ingen stabling, ingen låsing.

### 16.3 Rulling

- Rullingen er nettleserens egen. Ingen rullebiblioteker og ingen lytter som tar over hjul eller berøring. Slik gjør apple.com det.
- Elementer som følger rullingen (kokebokraden på PC), glir mot målet i stedet for å følge hakk for hakk, og bare med `transform` og `opacity`.
- Ingen `backdrop-filter` på flater som ligger fast over innhold som ruller (toppen, den faste knappen). Det ga doble bilderuter på PC. Dialogens bakteppe er unntatt.
- Faste flater over innhold har helt tett bakgrunn, eller minst 94 % uten uskarphet for toppen.
- Null layoutskift mens man ruller. Inn-sveip er bare `opacity` og høyst 12 px forskyvning.

### 16.4 Omregneren

- Enhetsomregnerne (de fire samlesidene og de 710 parsidene på norsk, svensk, dansk og engelsk) bruker kalkulatorkortet i 16.8 med `data-kalk="enhet"`, rett under ingressen. Kortet er svaret: seksjonen «Kalkulator», svarboksen og innholdsfortegnelsen finnes ikke i lesedelen, og under kortet står ett kort svar («1 cup = 2,366 dl», «180 °C = 356 °F») som åpner med den samme setningen kortet viser uten JavaScript.
- Bytteanimasjon, flertall, desimaltegn, tallesing og regneregler beskrives av 16.8 (fire gjeldende sifre, 1000 og over som heltall, mengden står ved bytte, temperatur er affin og kan være negativ, engelsk tar brøker). Tabellene og teksten på siden bruker samme tallregel, så de er like kortets svar.
- «Cups» er hovedordet i enhetsnavn, tittel og overskrift på norsk, svensk og dansk («1 cup», «2 cups»). «Kopp» (nb og sv) og «kop» (da) står bare i noen få nøyaktig angitte setninger: én forklaring («En cup er en amerikansk kopp på 236,6 ml») og spørsmålene «Er en cup det samme som en kopp?» og, mellom cups og dl, «Hvor mange dl er en kopp?». Adressene beholder «kopp» og «kop».
- Samlesidene har kortet med volumenhetene og beholder sin innledning som første avsnitt i lesedelen.

### 16.5 Tekst og typografi

- All tekst står i `rem`, også i skallet og på forsiden, så den følger tekststørrelsen i nettleseren. Tekst skal vokse med minst faktor 1,9 når brukeren dobler størrelsen.
- Lister med lenke og forklaring er rolige rader med hårlinjer, ikke piller som bryter teksten («Beslektede omregninger», «Relaterte guider»).
- Innholdsfortegnelsen i lange guider står i to kolonner fra 1000 px og er foldet sammen på mobil.
- Lesetekst og spørsmål og svar har samme kolonne. Kort bryter ut og flukter med toppen av siden.
- Hver skriftvekt og stil som brukes, har et `@font-face` i `tokens.css`.

### 16.6 Merke

- Nettsideikonet er honning-logoen (den som står øverst på siden): `favicon.ico`, `images/favicon-192.png` og `images/apple-touch-icon.png`.
- Appikonet (flat «ml.» på beige, `images/icon.png`) brukes der noe viser til selve appen: appkortene, nedlastingssiden og organisasjonslogoen i strukturerte data.
- Vurderingslinja vises likt på alle språk. Engelsk har egne portretter i husstandseksemplet. Importfilmen er rendret per språk.

### 16.7 Slik holdes malen ved like

- **Én mal:** en side får skallet gjennom `scripts/skall-paa.mjs`, og `scripts/sidetyper.mjs` sier hvilken type en side er. En ny sidetype legges i registeret før den får stil.
- **Byggekjeden:** `scripts/kjede.mjs` kjører generatorene og etterbehandlingen i riktig rekkefølge. `node scripts/kjedeproeve.mjs alle` kjører den i en kopi og sammenligner med de publiserte sidene. En generator kjøres aldri alene mot arbeidskopien.
- **Revisjonen** (`REVISJON=alle npx playwright test revisjon.spec`) går gjennom hver side på fire bredder, med 200 og 400 % zoom, uten JavaScript, med forstørret tekst og på mobilskjerm. Null røde før publisering.
- **Sider med koder og lenker** (avmelding, bekreftelse, vervekort, innlogging) får aldri skall, måling eller nye skript. Skriptene deres er låst i en hviteliste.
- **Juridisk tekst** er låst med kontrollsum og endres bare med vilje.
- **En test som aldri er sett rød, vokter ingenting.** Hver ny test bevises rød ved et bevisst brudd før den regnes.
- Publisering skjer steg for steg når testene er grønne, med kontroll av den publiserte siden etterpå.


### 16.8 Kalkulatorkortet

- Kortet (`form.kalk`) står rett under ingressen i toppen av siden, midtstilt og høyst 920 px bredt. Grått kort (`--hylle`, 32 px radius), med en hvit inndataside, en mørk svarside og bytteknappen mellom. På mobil stables sidene, og hurtigmengdene ruller sidelengs i sin egen rad.
- Felt: mengde, fra-enhet og til-enhet (dl, ss, ts, ml, liter, cups, gram, kilo), bytteknapp og seks hurtigmengder som følger fra-enheten. Varen står fast øverst i kortet med lenken «Bytt vare», eller velges i en liste. Under står én svarsetning («2 dl hvetemel = 110 g») som leses opp (`role="status"`).
- Regning: alt går via gram. Volum til gram er ml per enhet delt på 100 ganger gram per dl; vekt til vekt og samme enhet trenger ikke varens vekt. Bytteknappen bytter fra og til og setter mengden til 100 (gram), 1 (kilo) eller 2.
- Tall: svar i gram fra 10 g er hele gram (halve runder opp), og under 10 g to gjeldende sifre uten «,0» til slutt (2,8 g, 8,3 g, 0,52 g). Alle andre enheter: 100 og over som heltall, 10 til 100 med tre gjeldende sifre, under 10 med to, uten «,0» til slutt (2 dl, 18,2 dl, 0,77 dl). Språkets desimaltegn, ingen tusenskille. Tallesingen er den samme som i omregneren (`tolkTall`, `visTall`). Tabellene på sidene i en sidefamilie skrives etter samme regel, låst av `test/playwright/kalk-tabell.spec.mjs`.
- Ugyldig inntasting (tomt, tekst, flere desimaltegn, negativt tall) gir veiledningen fra sidens data og `aria-invalid="true"` på feltet, aldri «NaN» eller «0 g». Det gjelder også tall som ikke er endelige («1» fulgt av 309 nuller), med eller uten brøk.
- All tekst kommer fra sidens egne data (`kalk-data`). Uten JavaScript står et ferdig utregnet eksempel. Trykkflater er minst 44 px, fokus er synlig også på den mørke siden, og bytteanimasjonen står stille ved redusert bevegelse.
- Fire valgfrie felt i `kalk-data` gir engelske skjemaer det de trenger; mangler de, gjelder reglene over uendret (norske sider er bytelike):
  - `brok: true`: mengden kan skrives `a/b` eller `n a/b` (heltall, nevner over 0, valgfritt mellomrom rundt skråstreken), og svarsetningen gjengir brøken normalisert («1 1/2»). Mellomrom mellom sifre er da ikke tusenskille («1 2» er ugyldig). Med `negativ` kan brøken ha minus rett foran («-1/2», «-1 1/2»); uten `negativ` er en negativ brøk ugyldig, som negative desimaltall. Hurtigmengder kan være brøker, og `aria-pressed` sammenligner tallverdier.
  - `kort[e]` som liste er `[entall, flertall]`: entall når mengden er nøyaktig 1 eller en ekte brøk under 1 skrevet som brøk («1/2 cup»), ellers flertall («0.8 cups», «1 1/2 cups»). På svarsiden er det entall bare når svaret vises som «1».
  - `stegFor[e]` peker på hurtiggruppen i `steg` for hver fra-enhet; bare gruppene den peker på kreves.
  - `byttTil[e]` er mengden som settes når `e` blir fra-enhet ved bytte. Enhetsnøklene i `ml` og `g` er fritt valgte (`floz` er volum, `oz` og `lb` er vekt); fluid ounces til ounces krysser volum og vekt og trenger varens vekt.
- Fem valgfrie felt gir enhetsomregning uten vare (lengde, temperatur, volum, vekt); mangler de, oppfører kortet seg som over:
  - `affin: { [enhet]: [a, b] }`: grunnverdi = `n * a + b`. Når både fra og til står i `affin`, er `ut = (n * aFra + bFra - bTil) / aTil`. Celsius er `[1, 0]`, fahrenheit `[5/9, -160/9]`.
  - `negativ: true`: negative mengder er gyldige (minusgrader). Uten feltet gir negative tall veiledningen.
  - `sifre: 4`: svaret skrives slik for alle enheter, også gram. 0 er «0», absoluttverdi 1000 og over er heltall (halve runder opp, rundet på tolv gjeldende sifre først), ellers `sifre` gjeldende sifre uten overflødige nuller og uten tak på desimaler. Språkets desimaltegn.
  - `beholdMengde: true`: bytteknappen bytter fra og til og lar mengden stå.
  - `varer` kan mangle. Vareordet er da tomt, og kryssing mellom `ml` og `g` gir veiledningen. `ml` holder faktorene for gruppen som ikke er vekt (volum eller lengde); en temperaturside har `ml: {}` og `g: {}`.
- Låst av `test/playwright/kalk.spec.mjs` (også `kalk-en.html`), `test/playwright/kalk-enhet.spec.mjs` (også `kalk-enhet-en.html`), `test/omregner-sider.test.mjs`, `test/site-tall.test.mjs` og `test/side-css.test.mjs`.
