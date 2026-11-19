# Undersidene i det nye uttrykket (tillegg til designspecen, punkt 16)

Status: mitt forslag 18.11.2026, bygger på den godkjente forsiden og på omregner-prototypen (https://claude.ai/artifact/NJqvWT1PFRpwsdqJoqEHeA, kildefil `omregner.html`). Patrick har ikke sett guide, blogg eller juridisk side i nytt uttrykk. Målet hans (18.11): alle sider på alle språk i samme identitet, publisert, og til slutt polert til forsidens nivå.

## Prinsipp
Undersidene bytter form, ikke innhold. H1, H2, avsnitt, lenker, strukturerte data og adresser står urørt. Det nye uttrykket kommer fra tre ting: felles sideskall, felles tokens, og én stil per byggekloss som alt finnes i sidene.

## Felles for alle undersider
- Sideskallet fra forsiden: topp med logoflis, ordmerke, meny og «Last ned», hyllemeny, bunn i tre lag, QR-vindu på PC, fast knapp på mobil. Ingen følgemeny.
- Toppen av siden er midtstilt: brødsmule eller overlinje i dempet tekst, H1 (38 px mobil, opptil 62 px PC), ingress.
- Lesekolonne på maks 68 tegn, midtstilt, brødtekst 19 px med linjeavstand 1,6. H2 26 til 34 px.
- Seksjoner har 112 px luft på PC og 72 px på mobil.
- Kort er varm grå (`--hylle`) med 32 px radius og ingen skygge. Mørkt kort (`--blekk`) brukes bare til det ene som skal fremheves.
- Ingen fliser, ingen koder, ingen oransje utenom ordmerket og appens egne flater.

## Byggeklosser (dagens klasse → nytt utseende)
| I dag | Nytt |
|---|---|
| `header.locale-page-hero` (`.eyebrow`, `h1.disp`, `.lead`) | Midtstilt topp. Overlinja blir dempet tekst, ikke versaler med sporing. |
| `.answer` | «Kort svar»: 19 px, midtstilt under toppen, med fet ledetekst. På guider står den i et grått kort med 28 px radius. |
| `.toc` | På omregnere skjules den. På lange guider blir den en rolig liste i et grått kort, sammenfoldet på mobil. |
| `form.omregner` | Kalkulatoren fra omregner-prototypen: to store felt, snu-knapp, hurtigknapper, svarsetning. Står rett under ingressen. |
| `.table-wrap > table`, `.blogg-tabell` | Tabell som i prototypen: tynn svart strek under hodet, lyse skillelinjer, siste kolonne høyrestilt og fet. Ruller sidelengs i egen boks når den er for bred. |
| `aside.i-appen` (app-bevis) | Kort med avrundede hjørner og svak fargetoning i hjørnene, bildet av appen til høyre på PC og under teksten på mobil. |
| `.app-cta`, `.page-cta` | Samme kort, med svart nedlastingsknapp (`data-hent`). Butikkmerkene byttes med knappen. |
| `.faq` (`details`/`summary`) | Trekkspill som på forsiden: linje mellom spørsmålene, pluss som blir kryss. |
| `.related`, `.blogg-flere`, lenkelister i omregnere | Rad med piller. |
| `ul.blogg-kort` | Rutenett av grå kort med bilde, tittel og dato. |
| `.scenario`, `.founder`, `.phones`, `.shot` | Grå kort eller bilde med 24 px radius, innenfor lesekolonnen. |
| `main.legal-doc`, `main.doc` | Ren lesekolonne. Ingen kort utenom `.legal-callout`. |
| `.steps > .step` | Nummererte steg med svart sirkel, som stegene ved importfilmen. |

## Sider som ikke får fullt skall
Avmelding, bekreftelse, TikTok-auth, vervekort, butikkvideresending, 404 og kampanjesidene (Christine, TikTok-mellomlanding) er smale tjenestesider. De får tokens, skrifter, ordmerket og knappestilen, men ikke meny, hyller eller QR-vindu. Flere av dem skal ikke laste analyse, og vervekortet er byte-låst mot sin generator.

## Rekkefølge
1. Skall og grunnstil på alle indekserbare undersider, alle fire språk (én utrulling per sidetype, omregnere først).
2. Omregnerne får kalkulatoren øverst og «cups» i stedet for «kopp» i synlig tekst.
3. Forsidene på svensk, dansk og engelsk etter den norske.
4. Tjenestesidene.
5. Polish: hele nettstedet gjennomgås på 360, 390, 768 og 1280 px.
