# Produktpåstander per side

Kontrollert mot appens `origin/master` `2613d17d3173676a0eb6229a16b3e534a670a946`, lest 2026-10-05.

| Side | Påstand som må holde | Kodebevis |
|---|---|---|
| /sv/importera-recept/ | Länkimport ingår med fem importer per månad utan Pro. Fotoimport kräver Matlyst Pro. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /sv/hitta-recept/ | Mappar och favoriter ger fler vägar tillbaka till rätter du vill laga igen. | `hooks/useRecipeSearch.ts:53-94`, `hooks/usePantryRecipes.ts` |
| /sv/inkopslista/ | När en vara bockas av kan den flyttas till Skafferiet. Hushållsdelning kräver Matlyst Pro. | `app/(tabs)/grocery.tsx:285-367`, `hooks/useGrocery.ts` |
| /sv/handskrivna-recept/ | Fotoimport kräver Matlyst Pro. Originalets källa kan beskrivas i receptet. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /sv/recept-pa-ingredienser/ | Förslagen är ett hjälpmedel. Kontrollera alltid att du faktiskt har rätt mängd och att varorna är användbara. | `hooks/useRecipeSearch.ts:53-94`, `hooks/usePantryRecipes.ts` |
| /sv/vad-ska-jag-laga/ | Fråga Matlyst kan skapa eller ändra recept. Den funktionen följer appens Pro-gate. | `hooks/useRecommendations.ts:76-131`, `hooks/useSporMatlyst.ts:118-221` |
| /sv/veckomeny-app/ | Veckomenyn och den vanliga inköpslistan saknar abonnemangsgate. Hushållsdelning kräver Pro. | `app/(tabs)/ukemeny.tsx:371-433`, `app/recipe-picker.tsx` |
| /sv/byt-fran-paprika/ | Matlyst är inte knutet till Paprika och garanterar inte att alla fält kan flyttas automatiskt. | `components/RecipeFileImport.tsx`, `lib/importEngine.ts:248-270` |
| /sv/receptbok-app/ | Du bestämmer över innehållet. Källan visas på importerade recept när den finns. | `hooks/useRecipes.ts:169-199`, `hooks/useRecipeSearch.ts:53-94` |
| /sv/spara-recept-fran-instagram/ | Källan följer med. Privat eller otillgängligt innehåll kan inte alltid importeras. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /sv/spara-recept-fran-tiktok/ | Privat, borttaget eller geografiskt spärrat innehåll kan inte alltid läsas. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /sv/skafferi-app/ | Gratisnivån visar ett begränsat antal skafferivaror; Pro öppnar mer kapacitet. | `hooks/usePantry.ts:247-276`, `hooks/usePantryRecipes.ts` |
| /sv/tom-kylskapet/ | Matlyst kan inte avgöra om en vara är säker att äta. Kontrollera lukt, utseende, datum och förvaring själv. | `hooks/usePantry.ts:247-276`, `hooks/usePantryRecipes.ts` |
| /sv/enkel-middag/ | Exempel som köttbullar med potatis, ugnslax eller en enkel pastarätt är inspiration, inte färdiga recept på sidan. | `hooks/useRecipes.ts:169-199`, `hooks/useRecipeSearch.ts:53-94` |
| /sv/receptskapare/ | En skapare kan kontakta hei@matlyst-app.no för frågor, rättelse eller blockering av import från en källa. | `lib/source.ts:20-74`, `lib/source.ts:84-107` |
| /da/importer-opskrifter/ | Linkimport omfatter fem importer om måneden uden Pro. Fotoimport kræver Matlyst Pro. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /da/find-opskrifter/ | Mapper og favoritter giver flere veje tilbage til de retter, du vil lave igen. | `hooks/useRecipeSearch.ts:53-94`, `hooks/usePantryRecipes.ts` |
| /da/indkoebsliste-app/ | Når en vare krydses af, kan den flyttes til Spisekammeret. Deling i en husstand kræver Matlyst Pro. | `app/(tabs)/grocery.tsx:285-367`, `hooks/useGrocery.ts` |
| /da/haandskrevne-opskrifter/ | Fotoimport kræver Matlyst Pro. Den oprindelige kilde kan beskrives på opskriften. | `hooks/useRecipes.ts:169-199`, `hooks/useRecipeSearch.ts:53-94` |
| /da/opskrifter-ud-fra-ingredienser/ | Forslagene er hjælp. Kontrollér mængder, holdbarhed og om varerne kan bruges. | `hooks/useRecipeSearch.ts:53-94`, `hooks/usePantryRecipes.ts` |
| /da/middagsforslag/ | Spørg Matlyst kan lave eller ændre opskrifter. Funktionen følger appens Pro-gate. | `hooks/useRecommendations.ts:76-131`, `hooks/useSporMatlyst.ts:118-221` |
| /da/madplan-app/ | Ugemenuen og den almindelige indkøbsliste har ingen abonnementsgate. Deling i en husstand kræver Pro. | `app/(tabs)/ukemeny.tsx:371-433`, `app/recipe-picker.tsx` |
| /da/skift-fra-paprika/ | Matlyst er ikke forbundet med Paprika og garanterer ikke, at alle felter kan flyttes automatisk. | `components/RecipeFileImport.tsx`, `lib/importEngine.ts:248-270` |
| /da/opskrifts-app/ | Du bestemmer over indholdet. Kilden vises på importerede opskrifter, når den findes. | `hooks/useRecipes.ts:169-199`, `hooks/useRecipeSearch.ts:53-94` |
| /da/gem-opskrifter-fra-instagram/ | Kilden følger med. Privat eller utilgængeligt indhold kan ikke altid importeres. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /da/gem-opskrifter-fra-tiktok/ | Privat, slettet eller geografisk blokeret indhold kan ikke altid læses. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /da/spisekammer-app/ | Gratisniveauet viser et begrænset antal varer; Pro giver mere kapacitet. | `hooks/useRecipes.ts:169-199`, `hooks/useRecipeSearch.ts:53-94` |
| /da/toem-koeleskabet/ | Matlyst kan ikke afgøre, om en vare er sikker at spise. Kontrollér selv lugt, udseende, dato og opbevaring. | `hooks/usePantry.ts:247-276`, `hooks/usePantryRecipes.ts` |
| /da/nem-mad/ | Frikadeller med kartofler, en pastaret eller ovnbagt laks er eksempler, ikke færdige opskrifter på siden. | `hooks/useRecipes.ts:169-199`, `hooks/useRecipeSearch.ts:53-94` |
| /da/opskriftsskabere/ | En skaber kan skrive til hei@matlyst-app.no om spørgsmål, rettelser eller blokering af import fra en kilde. | `lib/source.ts:20-74`, `lib/source.ts:84-107` |
| /sv/koket/ | Offentliga länkar kan skickas till importen; källan ska behållas och resultatet kontrolleras. | `lib/importEngine.ts:201-229`, `lib/source.ts:20-74` |
| /sv/landleys-kok/ | Offentliga länkar kan skickas till importen; källan ska behållas och resultatet kontrolleras. | `lib/importEngine.ts:201-229`, `lib/source.ts:20-74` |
| /da/alletiders-kogebog/ | Offentliga länkar kan skickas till importen; källan ska behållas och resultatet kontrolleras. | `lib/importEngine.ts:201-229`, `lib/source.ts:20-74` |
| /da/dr-mad/ | Offentliga länkar kan skickas till importen; källan ska behållas och resultatet kontrolleras. | `lib/importEngine.ts:201-229`, `lib/source.ts:20-74` |
