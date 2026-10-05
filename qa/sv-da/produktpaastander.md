# Produktpåstander per side

Kontrollert mot appens `origin/master` `2613d17d3173676a0eb6229a16b3e534a670a946`, lest 2026-10-05. Påstanden er sitert ordrett fra sidens avsnitt «Bra att veta» / «Godt at vide» (kildesider: «Källa och ansvar» / «Kilde og ansvar»).

| Side | Påstand som må holde (ordrett sitat) | Kodebevis |
|---|---|---|
| /sv/importera-recept/ | Utan Pro kan du importera fem recept via länk per månad. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /sv/hitta-recept/ | Mappar och favoriter ger fler vägar tillbaka till rätter du vill laga igen. | `hooks/useRecipeSearch.ts:53-94`, `hooks/usePantryRecipes.ts` |
| /sv/inkopslista/ | När en vara bockas av kan den flyttas till Skafferi. Hushållsdelning kräver Matlyst Pro. | `app/(tabs)/grocery.tsx:285-367`, `hooks/useGrocery.ts` |
| /sv/handskrivna-recept/ | Fotoimport kräver Matlyst Pro. Du kan skriva in var receptet kommer ifrån, till exempel ”Mormors receptbok”. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /sv/recept-pa-ingredienser/ | Förslagen är ett hjälpmedel. Kontrollera alltid mängderna, hållbarheten och att varorna fortfarande går att äta. | `hooks/useRecipeSearch.ts:53-94`, `hooks/usePantryRecipes.ts` |
| /sv/vad-ska-jag-laga/ | Det är gratis att ställa frågor om ett recept. När Fråga Matlyst ska skapa eller ändra recept krävs Matlyst Pro. | `hooks/useRecommendations.ts:76-131`, `hooks/useSporMatlyst.ts:118-221`, `supabase/functions/_shared/sporMatlyst/skjema.ts:390-391` (gratis: bare spørsmål i en oppskrift) |
| /sv/veckomeny-app/ | Veckomenyn och den vanliga inköpslistan kan användas utan Pro. Hushållsdelning kräver Pro. | `app/(tabs)/ukemeny.tsx:371-433`, `app/recipe-picker.tsx` |
| /sv/byt-fran-paprika/ | Matlyst har ingen koppling till Paprika och garanterar inte att alla fält kan flyttas automatiskt. | `components/RecipeFileImport.tsx`, `lib/importEngine.ts:248-270` |
| /sv/receptbok-app/ | Du bestämmer över innehållet. Källan visas på importerade recept när den finns. | `hooks/useRecipes.ts:169-199`, `hooks/useRecipeSearch.ts:53-94` |
| /sv/spara-recept-fran-instagram/ | Källan följer med. Privat eller otillgängligt innehåll kan inte alltid importeras. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /sv/spara-recept-fran-tiktok/ | Privat, borttaget eller geografiskt spärrat innehåll kan inte alltid läsas. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /sv/skafferi-app/ | I gratisversionen rymmer Skafferi ett begränsat antal varor. Med Pro får du plats med fler. | `hooks/usePantry.ts:247-276`, `hooks/usePantryRecipes.ts` |
| /sv/tom-kylskapet/ | Matlyst kan inte avgöra om en vara är säker att äta. Kontrollera lukt, utseende, datum och förvaring själv. | `hooks/usePantry.ts:247-276`, `hooks/usePantryRecipes.ts` |
| /sv/enkel-middag/ | Tänk köttbullar med potatis, ugnsbakad lax eller en snabb pastarätt – vardagsrätter du sparar en gång och lagar igen och igen. | `hooks/useRecipes.ts:169-199`, `hooks/useRecipeSearch.ts:53-94` |
| /sv/receptskapare/ | En skapare kan kontakta hei@matlyst-app.no om frågor, rättelse eller blockering av import från en källa. Matlyst gör inte anspråk på skaparens text eller bilder. | `lib/source.ts:20-74`, `lib/source.ts:84-107` |
| /da/importer-opskrifter/ | Uden Pro kan du importere fem links om måneden. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /da/find-opskrifter/ | Mapper og favoritter giver flere veje tilbage til de retter, du vil lave igen. | `hooks/useRecipeSearch.ts:53-94`, `hooks/usePantryRecipes.ts` |
| /da/indkoebsliste-app/ | Når en vare krydses af, kan den flyttes til Spisekammeret. Deling i en husstand kræver Matlyst Pro. | `app/(tabs)/grocery.tsx:285-367`, `hooks/useGrocery.ts` |
| /da/haandskrevne-opskrifter/ | Fotoimport kræver Matlyst Pro. Du kan selv notere, hvor opskriften stammer fra. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /da/opskrifter-ud-fra-ingredienser/ | Forslagene er kun vejledende. Tjek mængder, holdbarhed, og om varerne stadig kan bruges. | `hooks/useRecipeSearch.ts:53-94`, `hooks/usePantryRecipes.ts` |
| /da/middagsforslag/ | Det er gratis at stille spørgsmål om en opskrift. Når Spørg Matlyst skal lave eller ændre opskrifter, kræver det Matlyst Pro. | `hooks/useRecommendations.ts:76-131`, `hooks/useSporMatlyst.ts:118-221`, `supabase/functions/_shared/sporMatlyst/skjema.ts:390-391` (gratis: bare spørsmål i en oppskrift) |
| /da/madplan-app/ | Deling af Madplan og Indkøbsliste i en husstand kræver Matlyst Pro. | `app/(tabs)/ukemeny.tsx:371-433`, `app/recipe-picker.tsx` |
| /da/skift-fra-paprika/ | Matlyst har ingen tilknytning til Paprika og garanterer ikke, at alle felter kan flyttes automatisk. | `components/RecipeFileImport.tsx`, `lib/importEngine.ts:248-270` |
| /da/opskrifts-app/ | Du bestemmer over indholdet. Kilden vises på importerede opskrifter, når den findes. | `hooks/useRecipes.ts:169-199`, `hooks/useRecipeSearch.ts:53-94` |
| /da/gem-opskrifter-fra-instagram/ | Kilden følger med. Privat eller utilgængeligt indhold kan ikke altid importeres. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /da/gem-opskrifter-fra-tiktok/ | Privat, slettet eller geografisk blokeret indhold kan ikke altid læses. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /da/spisekammer-app/ | I gratisversionen er der plads til et begrænset antal varer. Med Pro er der plads til flere. | `hooks/usePantry.ts:247-276`, `hooks/usePantryRecipes.ts` |
| /da/toem-koeleskabet/ | Matlyst kan ikke afgøre, om en vare er sikker at spise. Kontrollér selv lugt, udseende, dato og opbevaring. | `hooks/usePantry.ts:247-276`, `hooks/usePantryRecipes.ts` |
| /da/nem-mad/ | Det kan være frikadeller med kartofler, en hurtig pastaret eller laks i ovnen – retter, du allerede kender. | `hooks/useRecipes.ts:169-199`, `hooks/useRecipeSearch.ts:53-94` |
| /da/opskriftsskabere/ | En skaber kan skrive til hei@matlyst-app.no om spørgsmål, rettelser eller blokering af import fra en kilde. | `lib/source.ts:20-74`, `lib/source.ts:84-107` |
| /sv/koket/ | Matlyst visar källänken när den kan läsas. Matlyst samarbetar inte med Köket.se och gör inte anspråk på deras texter eller bilder. | `lib/importEngine.ts:201-229`, `lib/source.ts:20-74` |
| /sv/landleys-kok/ | Matlyst visar källänken när den kan läsas. Matlyst samarbetar inte med Landleys Kök och gör inte anspråk på deras texter eller bilder. | `lib/importEngine.ts:201-229`, `lib/source.ts:20-74` |
| /da/alletiders-kogebog/ | Matlyst viser kildelinket, når det kan læses. Matlyst samarbejder ikke med Alletiders Kogebog og gør ikke krav på deres tekster eller billeder. | `lib/importEngine.ts:201-229`, `lib/source.ts:20-74` |
| /da/dr-mad/ | Matlyst viser kildelinket, når det kan læses. Matlyst samarbejder ikke med DR Mad og gør ikke krav på deres tekster eller billeder. | `lib/importEngine.ts:201-229`, `lib/source.ts:20-74` |

## llms.txt og forsidene

Kontrollert mot appens `origin/master` `1692bc59`, lest 2026-10-05 (bare lesing). Rader merket «forutsetter #536» er kontrollert mot PR-grenen `origin/feat/f2-spor-matlyst-da-sv` (`b051ac02`, lest 2026-10-05, bare lesing) og stemmer først når #536 er merget og edge-funksjonen er deployet. Ikke tatt med i llms.txt fordi belegg mangler: Pinterest, PDF- og tekstfiler.

| Påstand | Kodebevis |
|---|---|
| Plattformer: iOS (iPhone og iPad) og Android | `app.json:24-25` (`"supportsTablet": true`), `app.json:76` (`"android"`) |
| Import fra nettside/matblogg, Instagram, TikTok og YouTube | `lib/sprak/tekster/nb.ts:1205`, `da.ts:453`, `sv.ts:453` («Fra Instagram, TikTok, YouTube eller en matblogg»); `lib/importEngine.ts:121-126`; `supabase/functions/import-recipe/index.ts:33,1478` (YouTube) |
| Import fra Facebook | `supabase/functions/import-recipe/index.ts:1406` (`isMeta` matcher instagram.com, facebook.com og fb.watch); `lib/importEngine.ts:124` |
| Delingsmenyen på iOS og Android | `app.json:142-158` (share extension), `plugins/withAndroidShareActivity.js:57` (`android.intent.action.SEND`) |
| Bilde av oppskrift fra kokebok, blad eller skjerm | `lib/sprak/tekster/nb.ts:1209`, `da.ts:457`, `sv.ts:457` |
| Eksportfil fra Paprika Recipe Manager | `components/RecipeFileImport.tsx:258` |
| Oversetting til brukerens språk nb, da eller sv | `lib/sprak/koder.ts:24` (`SPRAK = ['nb', 'da', 'sv']`); `supabase/functions/import-recipe/index.ts:826-831` (`velgImportSprak(language, profile.app_language)`) |
| Metriske mål som standard; kan beholde amerikanske mål | `supabase/migrations/20260419000000_unit_system_and_delete_account.sql:3` (default `metric`); `supabase/functions/_shared/sprak.ts:176-177, 200-201, 224-225`; `app/innstillinger.tsx:141` |
| Spør Matlyst / Spørg Matlyst / Fråga Matlyst | `lib/sprak/tekster/nb.ts:1187`, `da.ts:435`, `sv.ts:435` |
| Tilpassing: bytte, fjerne, legge til ingredienser og endre porsjoner | `supabase/functions/_shared/sporMatlyst/prompt.ts:27-28` (master); forutsetter #536: `prompt.ts:109` på PR-grenen |
| Spørsmål om en oppskrift er gratis; å lage eller endre oppskrifter med Spør Matlyst krever Pro (/sv/vad-ska-jag-laga/, /da/middagsforslag/, llms.txt) | `supabase/functions/spor-matlyst/index.ts:89-92`; `supabase/functions/_shared/sporMatlyst/skjema.ts:390-391` |
| Spør/Spørg/Fråga Matlyst svarer på brukerens språk (nb, da, sv) — forutsetter #536 | PR-grenen: `hooks/useSporMatlyst.ts:54,122` (sender `sprak`), `supabase/functions/_shared/sporMatlyst/skjema.ts:235` (godtar bare nb/da/sv), `supabase/functions/spor-matlyst/index.ts:89,122` (`byggSystemtekst(f.sprak)`), `supabase/functions/_shared/sporMatlyst/prompt.ts:116-126` («All user-visible text … must be in ${lokal.navn}»). På master er funksjonen nb-only (`skjema.ts:8`) |
| Madplan (da), Veckomeny (sv), Indkøbsliste/Inköpslista og Spisekammer/Skafferi — forutsetter #536 | PR-grenen: `lib/sprak/tekster/da.ts:94,201` (`Madplan`), `da.ts:109,203` (`Spisekammer`, `Indkøbsliste`); `sv.ts:94,109,203` (`Veckomeny`, `Skafferi`, `Inköpslista`). På master heter den danske funksjonen `Ugemenu` |
| Håndskrevne oppskrifter (nb-forsiden, /sv/handskrivna-recept/, /da/haandskrevne-opskrifter/) | Generell bildeavlesning, ikke nevnt spesifikt: `supabase/functions/import-recipe/index.ts:1318` («Analyser bildet og ekstraher oppskriften som JSON», samme linje på master og PR-grenen); `lib/sprak/tekster/nb.ts:1209` («Skann en oppskrift fra kokebok, blad eller skjerm»). Verken prompt eller UI nevner håndskrift |
| Kokemodus holder skjermen våken | `hooks/useCookSession.ts:137`; `lib/keepAwake.ts` |
| Planlegg uka og send ukas ingredienser til handlelista (nb-forsiden; «la handlelista skrive seg selv» på /ukemeny/) | `app/(tabs)/ukemeny.tsx:593-599` (knappen `handleAddWeekToGrocery`, `ukemeny.leggUkeIHandleliste`): ett trykk legger ukas ingredienser i handlelista. Handlelisten fylles ikke uten at brukeren trykker |
| Fem gratis importer i måneden | `constants/limits.ts:5` (`FREE_IMPORT_LIMIT = 5`) |
| Bildeimport krever Pro | `app/(tabs)/legg-til.tsx:879` (`kilde === 'bilde' && fotoGate === 'låst'`) |
| Ingen reklame, ingen annonsenettverk | `package.json` har ingen annonse-SDK (bare RevenueCat, PostHog, Sentry og Expo) |
| 5,0 i App Store (12 vurderinger, Norge, per 5. oktober 2026) | Ikke i koden: tallet er oppgitt av Patrick 2026-10-05 og bekreftet med iTunes-oppslag (id 6762563515, country=no: snitt 5, 12 vurderinger) 2026-10-05. Står på `sv/index.html`, `da/index.html` og i JSON-LD på `index.html` (`ratingCount` 12) |
