# Designspec for matlyst-app.no: ett konsept på alle sider (UTKAST)

Status: utkast 18.11.2026, venter på Patricks lesing. Ett åpent spørsmål står nederst.

## 1. Hvorfor

Nettsiden har gått fra 30 til 851 sider på kort tid (guider, høytider, enhetsomregnere på fire språk). Teksten er god. Sideopplevelsen er ikke like god: sidene er bygget av flere generatorer og håndlagde filer, og det synes. Patrick vil ha:

- **Ett konsept på tvers av alle sider.** Én meny, én språkvelger, samme rytme og samme komponenter.
- **Seriøst og profesjonelt.** Kjøkkenhyllen var inspirasjon, ikke retningen.
- **Mobil like bra som PC.** De fleste kommer fra Google på telefonen.
- **Ingen artikkelvegg.** Lange sider skal være designet så godt at de ikke føles lange.
- **Ingen overlapp eller tekst som renner ut**, på noen skjermbredde.

Fond og ReciMe er referansen: de har ett fast konsept og mange små kreative løsninger, og hver side føles som samme produkt.

## 2. Mål, ikke-mål og feilmål

**Mål**
- Alle 851 sider bruker samme sideskall (topp, bunn, nedlastingslinje) og samme komponentbibliotek.
- En lang guide på telefon har noe visuelt (skjermbilde, tabell, kort, kalkulator) minst hver tredje skjermhøyde.
- Revisjonen (se punkt 8) går grønn på 360, 390, 768 og 1280 px for alle sider, og den kjører i CI.

**Ikke-mål**
- Ny logo, nye farger eller nye skrifter. Merkevaren (ml.-logoen, krem og terrakotta, Fraunces og DM Sans) står.
- Omskriving av tekst. Teksten er godkjent; vi endrer form, ikke innhold.
- Nye adresser. Ingen URL endres (SEO).

**Feilmål** (dette ville vært en fiasko selv om det teknisk virker)
- Sidene ser like ut, men like kjedelige: konsistens som gir en mal uten liv.
- Pynt som gjør siden tregere (Core Web Vitals faller) eller dytter teksten ned.
- Mobil som en krympet desktop i stedet for designet for tommelen.

## 3. Hva revisjonen fant (18.11, alle 130 hovedsider, senere alle 851)

| Funn | Omfang | Status |
|---|---|---|
| 8 ulike varianter av toppmenyen | 130 sider | Generert topp samlet; fem håndlagde nb-sider fikk samme meny i #78 |
| Menyknapp og «Get the app» utenfor skjermen på 390 px | 117 sider | Rettet i #78 |
| Bred tabell gjorde siden bredere enn skjermen | 1 side | Rettet i #79 |
| H1 varierer: 44 til 52 px på mobil, 76 til 107 px på desktop | alle sidetyper | Åpen: én typeskala |
| Bloggoversikter og juridiske sider har en annen mal (ingen meny, annen rytme) | 18 sider | Åpen |
| Forsiden på norsk er håndlaget og skiller seg fra sv, da og en | 1 side | Åpen |
| Bildekaruseller i bloggen går utenfor spalten (tilsiktet sidelengs rulling) | 18 sider | Sjekkes for tommelvennlighet |

## 4. Tilnærminger

**A. Felles sideskall og komponentbibliotek (anbefalt).** Alle generatorer bruker de samme byggeklossene (topp, svar-kort, innholdsfortegnelse, scenario-kort, app-bevis, tabell, FAQ, nedlastingslinje). De håndlagde sidene flyttes inn i en generator. Fordel: ett sted å endre, konsistens blir automatisk, revisjonen låser det. Kost: mest arbeid nå (ca. 3 til 5 dager), men lavest vedlikehold.

**B. Pusse side for side.** Raskt synlig, men 851 sider kan ikke pusses for hånd, og avvikene kommer tilbake ved neste generator.

**C. Nytt visuelt konsept fra bunnen.** Gir mest «wow», men kaster et uttrykk Patrick er fornøyd med, og risikerer SEO (oppsett, ytelse) midt i indekseringen.

Anbefaling: **A**, med kreative komponenter som gir liv (punkt 6), slik at vi unngår feilmålet «konsistent men kjedelig».

## 5. Konseptet: siden er en oppskrift

Matlyst gjør oppskrifter ryddige. Sidene bør se ut som det appen lager: en god oppskrift. Det gir et fast konsept som er seriøst, kjent for leseren og vårt eget.

| Del av oppskriften | På siden |
|---|---|
| Tittel og porsjoner | H1 og ingress, med lesetid og «oppdatert»-dato |
| «Kort fortalt» | Svar-kortet øverst: svaret på to linjer |
| «Du trenger» | Innholdsfortegnelsen, som en ingrediensliste med avkrysning |
| Nummererte steg | H2-seksjonene, nummerert der innholdet er en rekkefølge |
| Tips fra kokken | Scenario-kort og Patricks erfaring som eget kort |
| Bilde av retten | Skjermbilde av appen i telefonramme ved hver funksjon |
| Lagre oppskriften | Nedlastingslinjen og «Gjør dette i Matlyst»-kortet |

Konseptet gjelder alle sidetyper: pengesider, guider, høytider, blogg og verktøy. Juridiske sider bruker samme skall, men uten de kreative kortene.

## 6. Regler

**Sideskall**
- Topp: logo, «Få appen», meny. Desktop har språkvelgeren i toppen, mobil har den inne i menyen. Én variant, generert ett sted.
- Bunn: samme kolonner, sosiale lenker og språkvelger på alle sider.
- Nedlastingslinjen nederst på mobil på alle indekserbare sider.

**Typografi**
- Én skala med `clamp()`: H1 40 til 72 px, H2 28 til 40 px, H3 20 til 24 px, brødtekst 17 til 19 px.
- Linjelengde maks 68 tegn. Linjeavstand 1,6 på brødtekst og 1,1 på H1.

**Avstand**
- Én skala (4, 8, 12, 16, 24, 32, 48, 72, 112 px). Ingen tilfeldige verdier.
- Seksjoner har samme luft over og under. H2 har dobbel luft over og enkel under.

**Rytme mot artikkelvegg**
- Maks tre tekstavsnitt etter hverandre før noe visuelt: skjermbilde, tabell, kort, sitat eller kalkulator.
- Avsnitt på maks fire linjer på mobil.
- Lange sider får «Du trenger» som klebrig sidekolonne på desktop og som klebrig knapp («På denne siden») på mobil.
- Lange FAQ-er er trekkspill.

**Mobil først**
- Designes på 390 px og skaleres opp, ikke omvendt.
- Trykkflater minst 44 px. Brede tabeller ruller i spalten. Ingen sidelengs rulling av siden.

**Bevegelse**
- Én tydelig bevegelse per side (for eksempel at telefonen i heroen glir inn). Ingen innflyging på hver seksjon. `prefers-reduced-motion` respekteres.

## 7. Komponentbibliotek (alle sider, fire språk)

Svar-kort, innholdsfortegnelse, nummerert steg-seksjon, scenario-kort, kokkens tips (Patrick), app-bevis i telefonramme, tabell, sammenligningskort, kalkulator, FAQ-trekkspill, «Gjør dette i Matlyst»-kort, relaterte sider som kortgalleri, bloggkort med bilde, nedlastingslinje. Hver komponent får én HTML-funksjon og én CSS-blokk, og vises på en intern komponentside (`/design/`, noindex) slik at vi ser alle samlet.

## 8. Låsing og måling

- Revisjonsskriptet (Playwright, i dag i scratchpad) flyttes inn i repoet som test: alle sider på 360, 390, 768 og 1280 px, feiler ved sidelengs rulling, elementer utenfor toppen, overlapp, H1 utenfor skalaen eller mer enn tre tekstavsnitt uten visuelt element.
- Lighthouse på pengesidene: ytelse og tilgjengelighet minst 95 på mobil.
- Skjermbilder av én side per sidetype på mobil og desktop før hver designendring merges.

## 9. Inspirasjon som skal samles (neste steg)

Referansetavle med skjermbilder på mobil og desktop, side om side. Ikke for å kopiere, men for å se hvordan andre løser lange sider på telefon:
- Fond og ReciMe (fast konsept, kreative detaljer)
- Lange matartikler som leses godt på telefon (store matmedier med oppskriftskort)
- Produktsider med mye dokumentasjon som likevel føles lette (hjelpesider og guider hos kjente apper)
- Verktøysider som rangerer (omregnere og kalkulatorer)

## 10. Det byggeren avgjør selv

Eksakte fargeverdier innenfor dagens tokens, rekkefølgen generatorene flyttes over i, og hvordan revisjonen deles opp i CI for å holde kjøretiden nede.

## 11. Åpent spørsmål til Patrick

Når noen kommer fra Google til en lang guide på telefonen, hva skal de føle og gjøre de første sekundene? Svaret avgjør hva som står øverst på siden (svaret, et skjermbilde av appen, eller en knapp til appen) og hvor hardt vi selger.
