# Vervekortet og PR 20b: er forhåndsvisningen «ferdig tekst fra Matlyst»?

Dato: 2026-11-14. Skrevet av Claude (Opus) uten juridisk kompetanse. Dette er en lesning av kildene i app-repoet, ikke en juridisk vurdering.

## Hva som endres

Før: appen delte `butikklenke\nKODE`. Mottakeren så butikkens eget forhåndsvisningskort (App Store eller Google Play).
Nå (app-PR #804): appen deler `https://matlyst-app.no/v/?k=KODE\nKODE`. Meldingsappene (iMessage, WhatsApp, Messenger, Slack, SMS-klienter med forhåndsvisning) henter OG-taggene fra `/v/` og viser Matlysts eget kort: bilde, tittel («Du er invitert til Matlyst») og beskrivelse.

Delingsteksten fra appen er uendret: bare lenka og koden. Kortet er det nye.

## Hva vedtaket sier

Spec `docs/superpowers/specs/2026-09-06-dansk-svensk-design.md` §12, beslutning 29 (vedtatt 09.09.2026, «alle land» 19.10.2026):

> 29. **Vervebonus belønner bare vennen**, OS-delearket uten forhåndsutfylt tekst, egen PR 20b før PR 23.

Kommentaren over `verveDeling` i `lib/verveTilbud.ts`:

> ⚠️ BARE LENKA OG KODEN, ingen tekst fra Matlyst (PR 20b, vedtak 09.09, §12 punkt 29). Forbrugerombudsmanden godtar ubelønnet deling «så længe kunden bare kan rette eller slette i teksten», og vedtaket er at Matlyst ikke fyller ut meldingen i det hele tatt: brukeren skriver sine egne ord. Heller ingen `title`: på Android blir den emnefeltet i e-post, altså også ferdig tekst.

Kildene bak, fra `docs/juridisk/dk-se-jus.md`:

- Rad A23/A24/A27 (spamvejledningen kap. 4): «Hvis en virksomhed skaber et incitament, fx en belønning, for, at brugere tipper venner ... anser Forbrugerombudsmanden tippet til vennerne for at komme fra virksomheden.» og «lovlig vennehvervning, hvis virksomheden ikke belønner brugeren, men alene belønner vennen.»
- Rad A25 (FO longread 01.01.2015): ubelønnet deling er lov «så længe kunden bare kan rette eller slette i teksten og i øvrigt ikke får noget for at gøre det.»
- C3 alternativ A: «fjern belønningen til den som verver i DK og SE. Da trengs ingen ekstra tekst utover ordinær reklamemerking.» Og: «Delearket skal aldri ha forhåndsutfylt tekst fra Matlyst.»

## Er kortet «ferdig tekst fra Matlyst»?

**Det er et tolkningsspørsmål, og kildene avgjør det ikke.** Ingen av kildene i `dk-se-jus.md` handler om forhåndsvisningskort.

For at kortet IKKE er ferdig tekst:
- Teksten står ikke i meldingsfeltet. Brukeren skriver sin egen melding; kortet er en visning av lenkens mål, laget av mottakerens eller avsenderens meldingsapp.
- Alle lenker får slike kort. Den gamle butikklenka ga også et kort, med butikkens tekst om Matlyst (navn, ikon, undertittel). Det var ikke regnet som ferdig tekst i PR 20b.
- Ververen får ingen belønning (PR 20b). Etter spamvejledningen kap. 4 regnes tipset da ikke som sendt av Matlyst; det er brukerens egen henvendelse, og vennen alene belønnes.
- I iMessage og WhatsApp kan brukeren fjerne forhåndsvisningen før sending (krysset på kortet). Brukeren kan altså «rette eller slette», som A25 krever.

For at kortet KAN være ferdig tekst:
- Matlyst velger ordene i kortet, og «Du er invitert til Matlyst» er formulert som en invitasjon fra noen. Det ligner mer en melding enn en nøytral beskrivelse av en nettside.
- Kortet vises inne i brukerens melding, og mange brukere vet ikke at det kan fjernes. På noen flater (SMS på Android, enkelte e-postklienter) kan det ikke fjernes i det hele tatt.
- Kortet er utvilsomt markedsføring fra Matlyst (bilde, appnavn, beskrivelse). Spørsmålet om det bør reklamemerkes («ordinær reklamemerking» i C3 A) er ikke vurdert i kildene.

Konklusjon: Kortet bryter ikke ordlyden i vedtaket («OS-delearket uten forhåndsutfylt tekst»): delearket er fortsatt uten tekst fra Matlyst. Om kortet bryter *formålet* (at brukeren skriver sine egne ord og at Matlyst ikke taler i meldingen), kan jeg ikke avgjøre. Det bør inn i jurist-spørsmålene i `dk-se-jus.md` 6.6 før lanseringen i DK og SE, eller avgjøres av Patrick.

## Slik er kortet holdt nøytralt nå

- Beskrivelsen beskriver lenkens mål, ikke avsenderen: «Oppskriftsappen som lagrer oppskrifter fra nettet, Instagram og TikTok. Lenken åpner App Store eller Google Play.» Ingen superlativer, ingen pris, ingen bonus.
- Kortet nevner verken bonusen eller koden. Bonusen (5 gratisimporter til vennen) står bare på sida, som Matlysts egen opplysning til den som åpner lenka.
- Ingen persondata: ingen navn, ingen kode i taggene. Kortet er likt for alle koder og alle avsendere.
- Ingen første person. Test `test/vervekort.test.mjs` feiler hvis tittel eller beskrivelse sier «jeg/min/I/my».

## Forslag hvis Patrick eller en jurist vil ha det strammere

1. Bytt tittelen fra en invitasjon til en beskrivelse, f.eks. «Matlyst: oppskriftsappen» / «Matlyst: receptappen» / «Matlyst: opskriftsappen» / «Matlyst: the recipe app». Da taler kortet ikke på vegne av noen. Tittelen «Du er invitert …» kom fra oppdraget, ikke fra et vedtak.
2. Si i appen, ved delingen, at forhåndsvisningen kan fjernes før sending. (Det er apptekst og hører til app-PR-en.)
3. Vurder reklamemerking av kortet i DK og SE (C3 A sier «ordinær reklamemerking»).

## To ting til som bør avklares

- **Bildet er KI-generert** (Nano Banana, `marketing/raw/ai-mat/tomatpasta.jpg`, laget 2026-09-01 til butikkbildene). AI-forordningen art. 50 nr. 4 om merking av KI-genererte bilder som framstår som ekte, gjelder fra 02.08.2026. Om et matbilde i et forhåndsvisningskort faller inn under den, har jeg ikke vurdert, og `dk-se-jus.md` C5 gjelder bare videoer med personer. Det samme bildet står allerede i App Store-skjermbildene.
- **Play-referrer er AV** (`REFERRER_PA = false` i `v/vervekort.js`). Med den på ville koden gått til Google i Play-adressen. Appen leser ikke Install Referrer i dag, så den ville ikke gjort noe. Slås på bare etter et vedtak, og da med en oppdatert personvernerklæring hvis det trengs.
