# Søgeord Danmark

Status: grundlag for gennemgang før sideproduktion

Dato: 2026-10-05

Marked: Danmark (`da-DK`)

## Kilder og begrænsninger

Listen bygger på `matlyst-kontroll/rapporter/2026-10-05-sokeord-da.md`, læst 2026-10-05. Rapporten omfatter cirka 1.500 Google-autocomplete-forslag (`hl=da`, `gl=dk`) og SERP-kontrol af 98 kandidater via DuckDuckGo som proxy. Autocomplete viser efterspørgsel, men ikke præcist søgevolumen. De fem øverste Google.dk-resultater skal derfor åbnes og vurderes manuelt, før teksten til hver side skrives.

Regel for kommende sider: hovedfrasen skal stå naturligt i `title`, `h1`, første afsnit og den danske slug. Fraser med samme søgeintention samles på én side. Danske tegn transskriberes konsekvent i sluggen: `æ→ae`, `ø→oe`, `å→aa`.

## Prioriteret sideliste

| Prioritet | Side | Hovedsøgeord | Nære varianter og spørgsmål | Grundlag og konkurrence | Indholdsvinkel |
|---|---|---|---|---|---|
| 1 | `/da/` | opskriftsapp | app til egne opskrifter; saml opskrifter app; madapp | Konkurrence 2–3 for funktionsfraserne, højere for brede madord. Forsiden skal støtte de smalle sider. | Matlyst som en skandinavisk app til opskrifter, planlægning og madlavning. |
| 1 | `/da/madplan-app/` | app madplan og indkøbsliste | madplanlægning app; madplan app gratis; gratis madplan med indkøbsliste; fælles madplan app | AC nr. 4 for appfrasen og AC nr. 1 for gratis madplan med indkøbsliste; samme produktintention samles på én side. | Madplan med brugerens egne opskrifter og en indkøbsliste lavet fra planen. Egen H2: «gratis madplan med indkøbsliste». Appkoden viser at begge grundfunktioner er kan bruges uden Pro. |
| 1 | `/da/opskrifts-app/` | app til egne opskrifter | app samle opskrifter; app til at gemme opskrifter; gem opskrifter app; digital opskriftsbog | AC på flere varianter; konkurrence 2–3. | Saml egne og importerede opskrifter med kilde og mapper. |
| 1 | `/da/gem-opskrifter-fra-instagram/` | gemme opskrifter fra instagram | gem opskrifter fra Instagram; samle opskrifter fra Instagram | Ingen dokumenteret AC for den fulde frase, men svag SERP og høj produktfit. | Del en reel til Matlyst og gem opskriften struktureret. |
| 1 | `/da/gem-opskrifter-fra-tiktok/` | gemme opskrifter fra tiktok | gem TikTok-opskrifter; importér opskrift fra TikTok | Strategisk kernefunktion; efterspørgslen skal genkontrolleres. | TikToks delingsflow forklaret konkret, uden generelle marketingfraser. |
| 1 | `/da/importer-opskrifter/` | importér opskrifter | importér opskrift fra link; gem opskrifter fra hjemmesider; saml opskrifter i en app | Strategisk produktside; de sociale kanaler får egne, smallere sider. | Import fra web, video, billede og link inden for appens faktiske funktioner. |
| 2 | `/da/find-opskrifter/` | find mine opskrifter | søg i opskrifter; find opskrift efter ingrediens; søg i egen opskriftssamling | Ingen særskilt volumenmåling i rapporten. Siden er den lokale pendant til søgning i egen samling. | Søg og filtrér egne opskrifter efter ingrediens, tag og kilde. |
| 1 | `/da/nem-mad/` | nem mad | nem aftensmad; nem mad til hverdag; hurtig aftensmad; nem aftensmad med få ingredienser | Høj efterspørgsel, men 9 af 10 stærke resultater: Valdemarsro, Arla, Madens Verden, Mummum, Coop og Spis Bedre. | Bred destinationsside om, hvordan Matlyst gør hverdagsmaden nem med forslag, ugeplan, indkøbsliste og Spørg Matlyst. Skal indeholde reelle eksempler og FAQ. |
| 2 | `/da/spisekammer-app/` | spisekammer app | opskrifter fra spisekammeret; hold styr på varer hjemme | Svensk pendantside har en egen smal intention; dansk volumen er ikke dokumenteret. | Hold styr på varer, og se hvilke gemte opskrifter der passer. |
| 2 | `/da/toem-koeleskabet/` | tøm køleskabet app | tøm køleskabet opskrift; hvad kan jeg lave af det, jeg har i køleskabet | AC nr. 1; konkurrence 2–3. | Opskrifter fra eget spisekammer og varer, der bør bruges. |
| 2 | `/da/opskrifter-ud-fra-ingredienser/` | søg opskrift ud fra ingredienser | hvad kan jeg lave af disse ingredienser | AC; konkurrence 2–3. | Søg i egne opskrifter og få forslag ud fra de ingredienser, brugeren har. |
| 2 | `/da/indkoebsliste-app/` | fælles indkøbsliste app | delt indkøbsliste app; indkøbsliste app på dansk | AC nr. 1; konkurrence 3. | En indkøbsliste fra opskrifter og ugeplan. Delingspåstanden kontrolleres mod appen før tekst. |
| 2 | `/da/haandskrevne-opskrifter/` | skan håndskrevne opskrifter | digitalisér mormors opskrifter; opskrift fra billede | Konkurrence cirka 2, men lav eller udokumenteret efterspørgsel. | Fotografer et opskriftskort og gør det søgbart. |
| 2 | `/da/middagsforslag/` | hvad skal jeg lave til aftensmad | middagsforslag fra egne opskrifter; aftensmad af det, jeg har | Den brede intention har 5–6 stærke domæner. | Smal produktvinkel: forslag fra brugerens egne opskrifter og spisekammer. |
| 3 | `/da/skift-fra-paprika/` | paprika app alternativ | flyt opskrifter fra Paprika; eksportér opskrifter fra Paprika | Ingen dansk AC; konkurrence 1, primært engelske resultater. | Kort, praktisk migreringsguide. |
| 3 | `/da/alletiders-kogebog/` | gem opskrifter fra Alletiders Kogebog | importér opskrift fra dk-kogebogen | Lokal tilpasning besluttet 2026-10-05. Ny SERP-kontrol kræves før tekst. | Gem et offentligt link; ingen påstand om samarbejde. Fem importtests før lancering. |
| 3 | `/da/dr-mad/` | gem opskrifter fra DR Mad | importér opskrift fra DR Mad | Lokal tilpasning besluttet 2026-10-05. Ny SERP-kontrol kræves før tekst. | Samme dokumenterede importflow som ovenfor. |
| 3 | `/da/opskriftsskabere/` | app til opskriftsskabere | opskriftsskaber og kildehenvisning; stop import af opskrifter | Intet volumen dokumenteret. Siden kræves som lokal pendant til `skapere`. | Forklar kildevisning, lagring og mulighed for at blokere import. |

Forsiden `/da/` får `opskriftsapp` som overordnet emne, men skal primært præsentere Matlyst som en skandinavisk madapp og lede videre til de målrettede funktionssider.

## Sider uden eget SEO-mål

`/da/vilkaar/`, `/da/privatliv/` og `/da/slet-konto/` skal være klare støttesider med korrekte juridiske termer. `/da/afmeld/`, `/da/tiktok/` og `/da/tiktok-auth/` skal have `noindex` som angivet i specen. De får beskrivende titler, men intet kommercielt hovedsøgeord.

## `nem mad`: hvad der rangerer, og hvad der kan vindes først

`nem mad` er Patricks valgte hovedmål. Det er ikke et lavkonkurrenceord. Rapporten viser ni stærke domæner i top 10, herunder Valdemarsro, Arla, Madens Verden, Mummum, Coop og Spis Bedre. `nem aftensmad` har otte stærke resultater, og `nem aftensmad til børn` har syv.

Siden skal derfor først søge synlighed på længere, produktsande varianter:

- nem mad til hverdag med madplan
- nem aftensmad af det, du har
- nem mad med indkøbsliste
- hurtig aftensmad fra egne opskrifter

Varianterne er redaktionelle kombinationer af rapportens dokumenterede ord og Matlysts funktioner. De må ikke omtales som målte søgevolumener. Google.dk-kontrollen før skrivning skal bekræfte, om de vises i autocomplete eller «Andre spørgsmål».

## Senere indholdsklynger

| Klynge | Første mulige sider | Søgeord | Krav før produktion |
|---|---|---|---|
| Erstat ingrediens | `/da/erstatning-for/floede/`, `/da/erstatning-for/creme-fraiche/`, `/da/erstatning-for/kaernemaelk/`, `/da/erstatning-for/mascarpone/` | erstatning for fløde i madlavning; erstatning for creme fraiche; erstatning for kærnemælk; erstatning for mascarpone | Forhold og anvendelse skal faktatjekkes. Hver side skal have selvstændig værdi. |
| Madspild og økonomi | `/da/madspild/`, `/da/spar-penge-paa-mad/` | undgå madspild app; spar penge på mad app | Mellem produktfit. Bygges efter kernefunktionerne og måles i Search Console. |

## Ord, der ikke prioriteres

- `nem aftensmad til børn`, `billig aftensmad børnefamilie` og generelle hverdagsmenuer: 5–8 stærke domæner.
- `nem madplan app`: et eksisterende mærkenavn; Matlyst skal ikke lægge sig op ad det.
- bysøgninger efter aftensmad: restaurantintention.
- `madplan ai` som hovedord: det præcise domæne `madplan.ai` ejer intentionen; bruges kun som underemne.

## Kontrol før sidetekst

For hver valgt side dokumenteres dato, de fem øverste Google.dk-resultater, faktisk søgeintention, relevante «Andre spørgsmål» og om hovedfrasen stadig har efterspørgsel. Det sker før siden skrives, ikke som efterkontrol.

## Verificeret produktavgrænsning

Appens Madplan udfyldes af brugeren ved at vælge opskrifter til de enkelte dage; appen genererer ikke en færdig ugeplan automatisk. Siden `madplan-generator` udgår derfor. Madplanen og den almindelige Indkøbsliste har kan bruges uden Pro i deres skærme. Formuleringen «gratis madplan med indkøbsliste» kan bruges som et afsnit på `madplan-app`, så længe denne kodekontrol fortsat holder ved publicering.
