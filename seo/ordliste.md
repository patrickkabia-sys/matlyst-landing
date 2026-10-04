# Fast ordliste for svensk og dansk

Status: underlag for språkgranskning før sidetekst

Dato: 2026-10-05

Ordlistevalgene er hentet fra appens gjeldende `origin/master`, filene `lib/sprak/tekster/sv.ts` og `lib/sprak/tekster/da.ts`, lest 2026-10-05. Nettstedet bruker de samme produktnavnene som appen. Søkeord kan brukes i forklarende tekst når de avviker fra produktnavnet, men de skal ikke erstatte etiketten brukeren møter i appen.

| Betydning / norsk utgangspunkt | Svensk | Dansk | Bruksregel og appkilde |
|---|---|---|---|
| Matlyst | Matlyst | Matlyst | Egennavn, bøyes ikke. |
| Spør Matlyst | **Fråga Matlyst** | **Spørg Matlyst** | Fast funksjonsnavn. `sporMatlyst.tittel`, `oppskrift.sporr`. |
| oppskrift / oppskrifter | recept / recept | opskrift / opskrifter | `felles.oppskrift`, `oppskrift`-tekstene. Ikke bruk norsk «oppskrift». |
| importer oppskrift | Importera recept | Importér opskrift | `felles.importerOppskrift`. Dansk imperativ har aksent i appetiketten. |
| lagre | Spara | Gem | `felles.lagre`, `sporMatlyst.lagre`. Bruk om å lagre i appen. |
| legg til | Lägg till | Tilføj / Føj til | `felles.leggTil`; dansk bruker «Føj til» i konkrete handlinger som `oppksrift.leggIHandleliste`. Velg etter setningen, ikke ordrett fra norsk. |
| kokebok | kokbok | kogebog | Bruk om brukerens samling. Appens onboarding bruker «kokbok» / «kogebog». |
| oppskriftssamling | receptsamling | opskriftssamling | Forklarende markedsføringsterm; ikke et eget funksjonsnavn. |
| spiskammer | **Skafferi** | **Spisekammer** | Fast skjerm- og funksjonsnavn. `felles.spiskammer`, `spiskammer.tittel`. Stor forbokstav når funksjonen navngis. |
| ukemeny | **Veckomeny** | **Ugemenu** | Fast systemmappe/etikett: `felles.mappe.ukemeny`. Dansk søkeord «madplan» kan forklare funksjonen, men appetiketten er Ugemenu. |
| ukeplan | veckoplanering / plan för veckan | ugeplan / plan for ugen | Beskrivende ord. Dansk onboarding bruker «Ugeplan» noen steder; nettsiden skal si «Ugemenu» om funksjonen og «madplan» om søkeintensjonen. |
| handleliste | **Inköpslista** | **Indkøbsliste** | Fast funksjonsnavn. `felles.mappe.handleliste`, `handleliste.tittel`. |
| middagsforslag | middagsförslag | middagsforslag | Appens onboarding og Spør Matlyst-tekster. |
| middag | middag | aftensmad / middag | Svensk bruker «middag». Dansk bruker «aftensmad» for måltidet i søketekst og «middag» der appteksten gjør det. Ikke oversett mekanisk. |
| det du har hjemme | det du har hemma | det, du har derhjemme | Naturlig markedsføringstekst. For funksjonen kan svensk si «i skafferiet», dansk «i spisekammeret». |
| ingrediens / ingredienser | ingrediens / ingredienser | ingrediens / ingredienser | Samme grunnord, lokal bøying. |
| fremgangsmåte / steg | tillagningsmetod / steg | fremgangsmåde / trin | `oppksrift.ingenFremgangsmate` og redigeringstekstene. |
| porsjon / porsjoner | portion / portioner | portion / portioner | Appens oppskriftstekster. |
| mappe | mapp | mappe | Appens mappeetiketter. |
| favoritt | favorit | favorit | Bruk verbene «Lägg till som favorit» / «Føj til favoritter» i handlinger. |
| kilde | källa | kilde | Bruk om originalside og kildevisning. |
| originaloppskrift | originalrecept | originalopskrift | `oppksrift.delOriginal` og åpne-original-handlingen. |
| del | Dela | Del | Appens delingshandling. |
| søk | Sök | Søg | Appens søkefelt og søkeresultater. |
| hjem | Hem | Hjem | Navigasjonsetikett. |
| husstand | hushåll | husstand | Appens delings- og innstillingstekster. |
| vare / varer | vara / varor | vare / varer | Bruk om innhold i Skafferi/Spisekammer. |
| rester | rester | rester | Lokalt og naturlig i begge språk. |
| matsvinn | matsvinn | madspild | Appens onboarding- og skafferitekster. |
| varsling | notis / avisering | notifikation | Velg «notis» i enkel brukerrettet svensk tekst; appinnstillinger bruker også «Aviseringar». Dansk bruker «notifikation». |
| kunstig intelligens / KI | AI / artificiell intelligens | AI / kunstig intelligens | Appen introduserer full form i samtykketekst. Bruk «AI» i korte forklaringer etter at betydningen er tydelig. |
| personvern | integritet | privatliv | Appens innstillinger: «Integritet och villkor» / «Privatliv og vilkår». Juridisk sidetittel granskes særskilt. |
| vilkår | villkor | vilkår | Juridisk term og lenketekst. |
| slett konto | Radera konto | Slet konto | Fast innstillingshandling. |
| abonnement | abonnemang | abonnement | Appens prøve- og kjøpstekster. |
| prøveperiode | provperiod | prøveperiode | Appens lokale varsler. |
| gratis å prøve | gratis att prova | gratis at prøve | Bruk bare når gjeldende butikkoppsett og vilkår fortsatt underbygger påstanden. |

## Søkeord som ikke er produktnavn

| Marked | Søkeord | Slik brukes det uten å endre appens språk |
|---|---|---|
| Sverige | matplanering, veckoplanering | «Planera veckan i Veckomeny» eller «Veckomeny för matplanering». |
| Sverige | receptbok app | Forklar Matlyst som en digital kokbok; appen har ikke en knapp som heter «Receptbok». |
| Sverige | töm kylskåpet | Bruk som søkeintensjon og overskrift, men kall funksjonen Skafferi. |
| Danmark | madplan, madplan app | Forklar at madplanen lages i Ugemenu. Ikke døp om appens funksjon. |
| Danmark | opskriftsapp | Bruk i SEO-tekst; inne i produktbeskrivelsen heter innholdet opskrifter og kogebog. |
| Danmark | tøm køleskabet | Bruk som søkeintensjon, og vis videre til Spisekammer. |
| Begge | AI-matapp | Bruk bare der funksjonen forklares konkret; Matlyst er ikke en generell chatbot. |

## Språkvern

- Svensk: bruk aldri «oppskrift», «handleliste», «ukemeny», «spiskammer» eller norsk ordstilling.
- Dansk: bruk aldri «oppskrift», «handleliste» eller norsk «ukemeny». Skjelne mellom produktnavnet Ugemenu og søkeordet madplan.
- Behold konteksten fra den norske siden. Eksempler, butikker, måltidsord og spørsmål skal være lokale, ikke ordrette oversettelser.
- Påstander om pris, rangering, butikktilgjengelighet og funksjoner kontrolleres på nytt før publisering.
