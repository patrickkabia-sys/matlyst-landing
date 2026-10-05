#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = 'https://matlyst-app.no';
const common = {
  sv: {
    locale: 'sv_SE', market: 'Sverige', home: 'Hem', skip: 'Hoppa till innehållet',
    features: 'Funktioner', legal: 'Integritet och villkor', download: 'Hämta Matlyst',
    appStore: 'https://apps.apple.com/se/app/matlyst/id6762563515',
    play: 'https://play.google.com/store/apps/details?id=app.matlyst&hl=sv&gl=SE',
    footer: 'Recept, matplanering och inköpslista.',
    langLabel: 'Språk', privacy: 'Integritet', terms: 'Villkor',
  },
  da: {
    locale: 'da_DK', market: 'Danmark', home: 'Forside', skip: 'Spring til indholdet',
    features: 'Funktioner', legal: 'Vilkår og privatliv', download: 'Hent Matlyst',
    appStore: 'https://apps.apple.com/dk/app/matlyst/id6762563515',
    play: 'https://play.google.com/store/apps/details?id=app.matlyst&hl=da&gl=DK',
    footer: 'Opskrifter, madplan og indkøbsliste.',
    langLabel: 'Sprog', privacy: 'Privatliv', terms: 'Vilkår',
  },
};

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const json = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');

function alternateLinks(lang, path, counterpart = path) {
  const svPath = lang === 'sv' ? path : counterpart;
  const daPath = lang === 'da' ? path : counterpart;
  const links = [['sv-SE', '/sv/' + (svPath || '')], ['da-DK', '/da/' + (daPath || '')]];
  return links.map(([lang, href]) => `<link rel="alternate" hreflang="${lang}" href="${base}${href}">`).join('\n');
}

function nav(lang, activePath = '', counterpart = activePath, nb = null) {
  const c = common[lang];
  const svPath = lang === 'sv' ? activePath : counterpart;
  const daPath = lang === 'da' ? activePath : counterpart;
  return `<a class="skip-link" href="#hovedinnhold">${c.skip}</a>
<nav aria-label="${lang === 'sv' ? 'Huvudnavigering' : 'Hovednavigation'}">
  <a href="/${lang}/" class="brand">Mat<em>lyst</em></a>
  <div class="nav-right">
    <a class="link" href="/${lang}/#funktioner">${c.features}</a>
    <span class="language-switcher" aria-label="${c.langLabel}">
      ${nb ? `<a href="${nb}?sprak=nb" lang="nb">NO</a>` : ''}<a href="/sv/${svPath}?sprak=sv" lang="sv" ${lang === 'sv' ? 'aria-current="page"' : ''}>SV</a>
      <a href="/da/${daPath}?sprak=da" lang="da" ${lang === 'da' ? 'aria-current="page"' : ''}>DA</a>
    </span>
  </div>
</nav>`;
}

function footer(lang) {
  const c = common[lang];
  return `<footer>
  <a href="/${lang}/" class="brand">Mat<em>lyst</em></a>
  <div class="f-l"><a href="/${lang}/${lang === 'sv' ? 'villkor/' : 'vilkaar/'}">${c.terms}</a><a href="/${lang}/${lang === 'sv' ? 'integritet/' : 'privatliv/'}">${c.privacy}</a><a href="#samtykke" data-consent-withdraw>${lang === 'sv' ? 'Ändra samtycke' : 'Skift samtykke'}</a><a href="mailto:hei@matlyst-app.no">Kontakt</a></div>
  <span class="c">© 2026 Matlyst · ${c.footer}</span>
</footer>${consentBanner(lang)}`;
}

function consentBanner(lang) {
  const sv = lang === 'sv';
  const text = sv
    ? 'Vi använder nödvändig lagring för att webbplatsen ska fungera. Om du säger ja använder vi även kakor för analys (PostHog, Google Analytics) och marknadsföring (Meta Pixel). Läs mer i vår <a href="/sv/integritet/">integritetspolicy</a>.'
    : 'Vi bruger nødvendig lagring, for at siden virker. Siger du ja, bruger vi også analyse og måling af markedsføring (PostHog, Google Analytics og Meta Pixel) til at forbedre Matlyst. Læs mere i vores <a href="/da/privatliv/">privatlivspolitik</a>.';
  return `<div class="cookie" id="cookie" hidden><div class="cookie-inner" id="samtykke"><p>${text}</p><div class="cookie-actions"><button class="ck-btn ck-accept" id="ck-accept" type="button">${sv ? 'Godkänn' : 'Acceptér'}</button><button class="ck-btn ck-reject" id="ck-reject" type="button">${sv ? 'Bara nödvändiga' : 'Kun nødvendige'}</button></div></div></div>`;
}

function head({ lang, path = '', counterpart = path, title, description, image = '/images/og.jpg', noindex = false, schema }) {
  const c = common[lang];
  const canonical = `${base}/${lang}/${path}`;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow'}">
<link rel="canonical" href="${canonical}">
${alternateLinks(lang, path, counterpart)}
<meta name="theme-color" content="#F7F3EC">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${base}${image}">
<meta property="og:image:alt" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Matlyst">
<meta property="og:locale" content="${c.locale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${base}${image}">
<meta name="twitter:image:alt" content="${esc(description)}">
<link rel="icon" type="image/png" href="/images/icon.png">
<link rel="stylesheet" href="/styles.css">
${schema ? `<script type="application/ld+json">${json(schema)}</script>` : ''}
<script src="/locale.js"></script>
</head>`;
}

function storeButtons(lang) {
  const c = common[lang];
  return `<div class="store-badges">
<a class="btn-store" href="${c.appStore}" rel="noopener"><img src="/images/appstore-badge.svg" alt="Download on the App Store"></a>
<a class="btn-store" href="${c.play}" rel="noopener"><img src="/images/googleplay-badge-en.png" alt="Get it on Google Play"></a>
</div>`;
}

function home(lang) {
  const sv = lang === 'sv';
  const c = common[lang];
  const title = sv ? 'Receptapp för vardagen | Matlyst Sverige' : 'Opskriftsapp til hverdagen | Matlyst Danmark';
  const description = sv
    ? 'Receptappen som översätter och anpassar dina recept. Importera från webben, Instagram, TikTok eller ett foto, planera veckans middagar och gör en inköpslista.'
    : 'Opskriftsappen, der oversætter og tilpasser dine opskrifter. Importér fra nettet, Instagram, TikTok eller et foto, planlæg ugens aftensmad, og lav en indkøbsliste.';
  const schema = {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Matlyst',
    applicationCategory: 'LifestyleApplication', operatingSystem: 'iOS, Android',
    description, url: `${base}/${lang}/`,
  };
  return `${head({ lang, title, description, schema })}<body data-locale="${lang}">
${nav(lang)}
<main id="hovedinnhold">
<header class="hero locale-home-hero" data-section="hero">
  <div><p class="eyebrow hero-eyebrow">${sv ? 'Receptappen för vardagen' : 'Opskriftsappen til hverdagen'}</p>
  <h1 class="disp">${sv ? 'Recepten du sparar,<br><span class="it">klara för vardagen.</span>' : 'Dine opskrifter,<br><span class="it">klar til hverdagen.</span>'}</h1></div>
  <div class="hero-side"><p class="lead">${description}</p>${storeButtons(lang)}</div>
</header>
<section class="manifesto" id="funktioner" data-section="overview">
  <div>${sv ? '<p class="eyebrow">Ett lugnare kök</p>' : ''}<h2 class="disp">${sv ? 'Från inspiration till <em>middag</em>.' : 'Fra inspiration til <em>aftensmad</em>.'}</h2>
  <p class="answer">${sv ? 'Importera recept från webben, Instagram, TikTok eller ett foto. Ordna dem i mappar och hitta dem igen när det är dags att laga mat.' : 'Importér opskrifter fra nettet, Instagram, TikTok eller et foto. Saml dem i mapper, og find dem igen, når det er tid til at lave mad.'}</p></div>
  <div class="steps">
    <div class="step"><div class="n">01</div><div><div class="h">${sv ? 'Samla recepten' : 'Saml opskrifterne'}</div><div class="d">${sv ? 'Källan följer med när ett recept importeras.' : 'Kilden følger med, når en opskrift importeres.'}</div></div></div>
    <div class="step"><div class="n">02</div><div><div class="h">${sv ? 'Planera själv' : 'Planlæg selv'}</div><div class="d">${sv ? 'Välj recept till veckans dagar. Du bestämmer själv vad som ska stå på bordet varje dag.' : 'Vælg opskrifter til ugens dage. Du bestemmer selv, hvad der skal på bordet hver dag.'}</div></div></div>
    <div class="step"><div class="n">03</div><div><div class="h">${sv ? 'Handla med överblick' : 'Køb ind med overblik'}</div><div class="d">${sv ? 'Skicka ingredienser från recepten till inköpslistan.' : 'Send ingredienser fra opskrifterne til Indkøbslisten.'}</div></div></div>
  </div>
</section>
<section class="locale-grid" aria-label="${c.features}">
  ${[
    sv ? ['Importera recept','Länk, video eller foto blir ett recept du kan använda.','importera-recept/'] : ['Importér opskrifter','Link, video eller foto bliver til en opskrift, du kan bruge.','importer-opskrifter/'],
    sv ? ['Veckomeny','Lägg egna recept på de dagar som passar.','veckomeny-app/'] : ['Madplan','Læg dine egne opskrifter på de dage, der passer.','madplan-app/'],
    sv ? ['Inköpslista','Samla ingredienser och egna varor på samma lista.','inkopslista/'] : ['Indkøbsliste','Saml ingredienser og egne varer på den samme liste.','indkoebsliste-app/'],
    sv ? ['Fråga Matlyst','Fråga om receptet eller anpassa en rätt.','vad-ska-jag-laga/'] : ['Spørg Matlyst','Stil spørgsmål om opskriften, eller find <a href="/da/nem-mad/">nem mad</a>.','middagsforslag/'],
  ].map(([h,p,u]) => `<article class="locale-card"><h2 class="disp">${h}</h2><p>${p}</p><a class="more" href="/${lang}/${u}">${sv ? 'Läs mer' : 'Læs mere'} →</a></article>`).join('')}
</section>
<section class="house" data-section="household"><img src="/images/life/life-household-1400.webp" width="1408" height="3050" alt="${sv ? 'Två personer planerar mat tillsammans' : 'To personer planlægger mad sammen'}" loading="lazy"><div class="house-text"><p class="eyebrow">${sv ? 'Ett kök med överblick' : 'Et køkken med overblik'}</p><h2 class="disp">${sv ? 'Samma plan<br><em>för hela hushållet.</em>' : 'Den samme plan<br><em>for hele husstanden.</em>'}</h2><p>${sv ? 'Med Matlyst Pro kan ett hushåll dela recept, Veckomeny, Inköpslista och Skafferi.' : 'Med Matlyst Pro kan en husstand dele opskrifter, Madplan, Indkøbsliste og Spisekammer.'}</p></div></section>
<section class="cta"><p class="eyebrow">Matlyst</p><h2 class="disp">${sv ? 'Ditt kök.<br><em>Dina recept.</em>' : 'Dit køkken.<br><em>Dine opskrifter.</em>'}</h2><p>${sv ? '5,0 i norska App Store den 5 oktober 2026, baserat på 12 betyg.' : '5,0 i den norske App Store den 5. oktober 2026, baseret på 12 vurderinger.'}</p>${storeButtons(lang)}<div class="wordmark" aria-hidden="true">Mat<em>lyst</em></div></section>
</main>${footer(lang)}<script src="/site.js" defer></script></body></html>`;
}

const legal = {
  sv: {
    terms: {
      path:'villkor/', counterpart:'vilkaar/', nb:'/vilkar.html', title:'Användarvillkor | Matlyst', h1:'Användarvillkor',
      intro:'Villkoren gäller när du använder Matlyst. Matlyst tillhandahålls av Patrick Omassa Kabia, Vollebekkveien 2J, 0598 Oslo, Norge. Kontakta oss på hei@matlyst-app.no om något är oklart.',
      sections:[
        ['1. Användning av tjänsten','Du ansvarar för att uppgifterna i kontot är riktiga och för aktiviteten på kontot. Matlyst får inte användas olagligt, för att göra intrång i andras rättigheter eller för att försöka kringgå säkerheten.'],
    ['2. Ålder, samtycke och AI','Vissa funktioner kräver åldersbekräftelse och ett separat samtycke innan innehåll skickas till en AI-leverantör. Du kan använda övriga delar av appen utan detta samtycke.'],
        ['3. Innehåll och rättigheter','Du behåller rättigheterna till recepten och annat innehåll du lägger in. Du ger Matlyst den begränsade rätt som behövs för att lagra, visa, bearbeta och säkerhetskopiera innehållet åt dig.'],
        ['4. Upphovsrätt och borttagning','Importera bara innehåll som du har rätt att använda. Rättighetshavare kan kontakta hei@matlyst-app.no. Vi kan stoppa import från en källa eller ta bort innehåll när det krävs.'],
        ['5. Abonnemang och betalning','Abonnemanget förnyas automatiskt tills du säger upp det. Du säger upp det i inställningarna för ditt Apple-konto eller i Google Play, och det gäller då till den betalda periodens slut. Du har 14 dagars ångerrätt enligt lagen om distansavtal och avtal utanför affärslokaler, räknat från den dag avtalet ingås. Ångerrätten kan upphöra när du uttryckligen begär att tjänsten ska börja levereras direkt och samtidigt godtar att du därmed förlorar ångerrätten. Köpet görs hos Apple eller Google, som hanterar betalning, ångerrätt och eventuell återbetalning enligt den lag som gäller för dig.'],
        ['6. Ansvar','Matlyst hjälper till med planering och matlagning men ersätter inte professionell rådgivning. Kontrollera allergener, hållbarhetstid och säker tillagning själv. Vi ansvarar inte för indirekt skada om inte tvingande lag föreskriver annat.'],
        ['7. Ändringar och avslut','Vi kan ändra tjänsten och villkoren. Väsentliga ändringar meddelas i god tid innan de börjar gälla, i appen eller via e-post. Om du inte godtar ändringarna kan du säga upp avtalet. Du kan sluta använda tjänsten och radera kontot när som helst.'],
        ['8. Lag och klagomål','Norsk lag gäller i den utsträckning tvingande svensk konsumenträtt inte ger dig ett starkare skydd. Kontakta oss först. Om vi inte kommer överens kan du kontakta Konsument Europa, som kan medla i tvister med företag i Norge. I Norge kan Forbrukertilsynet medla, och ett ärende om ångerrätt kan därefter prövas av Forbrukerklageutvalget. Du kan också väcka talan vid domstol i Sverige.'],
      ],
    },
    privacy: {
      path:'integritet/', counterpart:'privatliv/', nb:'/personvern.html', title:'Integritetspolicy | Matlyst', h1:'Integritetspolicy',
      intro:'Patrick Omassa Kabia är personuppgiftsansvarig för Matlyst. Matlyst drivs som ett personligt projekt i Norge. Kontakt: Vollebekkveien 2J, 0598 Oslo, Norge, hei@matlyst-app.no.',
      sections:[
        ['Tre löften','Vi säljer inte dina personuppgifter. Recept används inte för att träna allmänna AI-modeller. Analys på webbplatsen och i appen kräver samtycke.'],
        ['Uppgifter vi behandlar','Vi behandlar uppgifter om ditt konto och din inloggning, profil och inställningar, recept och bilder, Veckomeny, Inköpslista, Skafferi, feedback, tekniska loggar och de uppgifter du aktivt skickar till import eller Fråga Matlyst. Matlogg och kalorimål behandlas bara med ditt uttryckliga samtycke.'],
        ['Ändamål och rättslig grund','Avtal enligt GDPR artikel 6.1 b används för konto, synkronisering, import och funktionerna du begär. Berättigat intresse enligt artikel 6.1 f används för säkerhet och nödvändig felsökning och för att hantera feedback du skickar. Samtycke enligt artikel 6.1 a används för analys och marknadsföring samt för personliga dagliga middagsförslag från AI och pushnotiser. Matlogg och kalorimål behandlas bara med ditt uttryckliga samtycke enligt artikel 6.1 a och artikel 9.2 a. Rättslig förpliktelse enligt artikel 6.1 c används där lag kräver det.'],
        ['AI-behandling','När du har godkänt AI-funktionen skickas det innehåll som behövs för din begäran till Anthropic Ireland, Limited, som nämns i samtyckestexten. Äldre konton utan den nya bekräftelsen använder tills vidare Google (Gemini API) som huvudleverantör och Anthropic som reserv. Vi använder inte recept eller frågor för att träna allmänna modeller. Du kan återkalla samtycket när som helst i appens inställningar.'],
        ['Webbplats och lokal lagring','Webbplatsen använder nödvändig lokal lagring för språkval och ditt samtyckesval i matlyst-sprak och matlyst-consent. Meta Pixel, PostHog och Google Analytics laddas först efter ett aktivt samtycke. Du kan återkalla analyssamtycket via länken Ändra samtycke längst ned på sidan. På den norska webbplatsen används EmailOctopus för nyhetsbrev, och Google reCAPTCHA laddas först när du fyller i nyhetsbrevsformuläret.'],
        ['Leverantörer och överföring','Supabase, PostHog och Sentry lagrar uppgifterna inom EU (ingen överföring). Apple, Google (inloggning, köp, Gemini, Google Analytics och reCAPTCHA), Meta och RevenueCat: EU–US Data Privacy Framework, i andra hand standardavtalsklausuler. EmailOctopus: Storbritanniens adekvansbeslut. Anthropic: standardavtalsklausuler (inte certifierat enligt Data Privacy Framework).'],
        ['Lagring och radering','Konto och innehåll lagras tills du raderar kontot. Tekniska felsökningsloggar raderas efter 90 dagar och Sentry-rapporter efter 30 dagar. Push-token raderas vid utloggning eller kontoradering. Feedback sparas så länge kontot finns eller tills du ber oss radera den. Statistik i PostHog samlas bara in medan ditt samtycke gäller; redan insamlad statistik raderas när du raderar kontot eller ber oss om det. Din e-postadress hos EmailOctopus sparas tills du avregistrerar dig från nyhetsbrevet eller raderar kontot. Om du återkallar samtycket till matloggen raderas matloggen och kalorimålet nollställs. Samtycke till analys kan återkallas när som helst.'],
        ['Dina rättigheter','Du har rätt att begära tillgång till, rättelse och radering av dina uppgifter, begränsning av behandlingen och dataportabilitet. Du har också rätt att invända mot viss behandling och att återkalla ett samtycke. Kontakta hei@matlyst-app.no. Du kan också klaga hos Integritetsskyddsmyndigheten (imy.se) eller Datatilsynet i Norge (datatilsynet.no).'],
        ['Ålder och samtycke','I Sverige är åldersgränsen 13 år för att själv samtycka till de digitala funktioner som kräver samtycke. För detta lagrar vi land, bekräftad åldersgräns och tidpunkt – inte födelsedatum.'],
      ],
    },
    delete: {
      path:'radera-konto/', counterpart:'slet-konto/', nb:'/slett-konto.html', title:'Radera konto | Matlyst', h1:'Radera ditt konto',
      intro:'Du kan radera Matlyst-kontot och innehållet permanent. Ett abonnemang måste sägas upp separat i App Store eller Google Play.',
      sections:[
        ['Radera i appen','Öppna Matlyst, gå till Inställningar och välj Radera konto. Bekräfta åtgärden. Kontot och innehållet raderas och du loggas ut.'],
        ['Om du inte kan logga in','Mejla hei@matlyst-app.no från adressen som hör till kontot. Vi kontrollerar din identitet och behandlar din begäran inom 30 dagar.'],
        ['Det som raderas','Konto, profil, recept, mappar, bilder, anteckningar, Veckomeny, Inköpslista, Skafferi, hushållsmedlemskap, feedback och push-token raderas. Krypterade säkerhetskopior rensas automatiskt inom 30 dagar.'],
      ],
    },
  },
  da: {
    terms: {
      path:'vilkaar/', counterpart:'villkor/', nb:'/vilkar.html', title:'Brugervilkår | Matlyst', h1:'Brugervilkår',
      intro:'Vilkårene gælder, når du bruger Matlyst. Matlyst udbydes af Patrick Omassa Kabia, Vollebekkveien 2J, 0598 Oslo, Norge. Skriv til hei@matlyst-app.no, hvis noget er uklart.',
      sections:[
        ['1. Brug af tjenesten','Du er ansvarlig for, at oplysningerne på kontoen er korrekte, og for aktiviteten på kontoen. Matlyst må ikke bruges ulovligt, til at krænke andres rettigheder eller til at omgå sikkerheden.'],
        ['2. Alder, samtykke og AI','Nogle funktioner kræver aldersbekræftelse og et særskilt samtykke, før indhold sendes til en AI-leverandør. Du kan bruge resten af appen uden dette samtykke.'],
        ['3. Indhold og rettigheder','Du beholder rettighederne til opskrifter og andet indhold, du lægger ind. Du giver Matlyst den begrænsede ret, der er nødvendig for at lagre, vise, behandle og sikkerhedskopiere indholdet for dig.'],
        ['4. Ophavsret og fjernelse','Importér kun indhold, du har ret til at bruge. Rettighedshavere kan kontakte hei@matlyst-app.no. Vi kan stoppe import fra en kilde eller fjerne indhold, når det er nødvendigt.'],
        ['5. Abonnement og betaling','Abonnementet fornyes automatisk, indtil du opsiger det. Du opsiger det i indstillingerne for din Apple-konto eller i Google Play, og abonnementet løber så til udgangen af den betalte periode. Du har 14 dages fortrydelsesret efter forbrugeraftaleloven, regnet fra den dag, aftalen indgås. Fortrydelsesretten kan bortfalde, når du udtrykkeligt beder om, at leveringen starter straks, og samtidig anerkender, at du dermed mister fortrydelsesretten. Købet sker hos Apple eller Google, som håndterer betaling, fortrydelse og eventuel refusion efter den lov, der gælder for dig.'],
        ['6. Ansvar','Matlyst hjælper med planlægning og madlavning, men erstatter ikke professionel rådgivning. Kontrollér selv allergener, holdbarhed og sikker tilberedning. Vi hæfter ikke for indirekte tab, medmindre ufravigelig lovgivning bestemmer andet.'],
        ['7. Ændringer og ophør','Vi kan ændre tjenesten og vilkårene. Væsentlige ændringer meddeles i appen eller pr. e-mail i god tid, før de træder i kraft. Hvis du ikke accepterer ændringerne, kan du opsige aftalen. Du kan stoppe med at bruge tjenesten og slette kontoen når som helst.'],
        ['8. Lovvalg og klage','Norsk ret gælder, i det omfang ufravigelig dansk forbrugerret ikke giver dig bedre beskyttelse. Kontakt os først. Hvis vi ikke finder en løsning, kan du få gratis hjælp hos Forbruger Europa, som også hjælper med klager mod virksomheder i Norge. I Norge kan Forbrukertilsynet mægle, og en sag om fortrydelsesret kan derefter indbringes for Forbrukerklageutvalget. Du kan også anlægge sag ved en domstol i Danmark.'],
      ],
    },
    privacy: {
      path:'privatliv/', counterpart:'integritet/', nb:'/personvern.html', title:'Privatlivspolitik | Matlyst', h1:'Privatlivspolitik',
      intro:'Patrick Omassa Kabia er dataansvarlig for Matlyst. Matlyst drives som et personligt projekt i Norge. Kontakt: Vollebekkveien 2J, 0598 Oslo, Norge, hei@matlyst-app.no.',
      sections:[
        ['Tre løfter','Vi sælger ikke dine personoplysninger. Opskrifter bruges ikke til at træne generelle AI-modeller. Analyse på hjemmesiden og i appen kræver samtykke.'],
        ['Oplysninger, vi behandler','Vi behandler oplysninger om din konto og dit login, din profil og dine indstillinger, opskrifter og billeder, Madplan, Indkøbsliste, Spisekammer, feedback, tekniske logge og de oplysninger, du aktivt sender til import eller Spørg Matlyst. Madlog og kaloriemål behandles kun med udtrykkeligt samtykke efter GDPR artikel 9, stk. 2, litra a.'],
        ['Formål og retsgrundlag','Aftale efter GDPR artikel 6, stk. 1, litra b bruges til konto, synkronisering, import og de funktioner, du beder om. Legitim interesse efter artikel 6, stk. 1, litra f bruges til sikkerhed og nødvendig fejlfinding og til at håndtere feedback, du sender. Samtykke efter artikel 6, stk. 1, litra a bruges til analyse og markedsføring samt til personlige daglige middagsforslag fra AI og push-notifikationer. Madlog og kaloriemål behandles kun med dit udtrykkelige samtykke efter artikel 6, stk. 1, litra a, og artikel 9, stk. 2, litra a. Retlig forpligtelse efter artikel 6, stk. 1, litra c bruges, hvor loven kræver det.'],
        ['AI-behandling','Når du har godkendt AI-funktionen, sendes det indhold, der er nødvendigt for din anmodning, til Anthropic Ireland, Limited, der er nævnt i samtykketeksten. Ældre konti uden den nye bekræftelse bruger indtil videre Google (Gemini API) som primær leverandør og Anthropic som reserve. Vi bruger ikke opskrifter eller spørgsmål til at træne generelle modeller. Du kan trække samtykket tilbage i appens indstillinger.'],
        ['Hjemmesiden og lokal lagring','Hjemmesiden bruger nødvendig lokal lagring til sprogvalg og dit samtykkevalg i matlyst-sprak og matlyst-consent. Meta Pixel, PostHog og Google Analytics indlæses først efter et aktivt samtykke. Du kan trække analysesamtykket tilbage via «Skift samtykke» nederst på siden. På den norske hjemmeside bruges EmailOctopus til nyhedsbreve, og Google reCAPTCHA indlæses først, når du udfylder nyhedsbrevsformularen.'],
        ['Leverandører og overførsel','Supabase, PostHog og Sentry lagrer oplysningerne i EU (ingen overførsel). Apple og Google bruges til login og køb. Overførsel til Apple, Google (herunder Gemini), Meta og RevenueCat i USA sker på grundlag af EU-US Data Privacy Framework og ellers standardkontraktbestemmelser. Anthropic er ikke certificeret, og overførslen dertil sker på grundlag af standardkontraktbestemmelser. EmailOctopus er omfattet af Storbritanniens tilstrækkelighedsafgørelse.'],
        ['Opbevaring og sletning','Konto og indhold opbevares, til du sletter kontoen. Tekniske fejlfindingslogge slettes efter 90 dage og Sentry-rapporter efter 30 dage. Push-token slettes ved logout eller kontosletning. Feedback gemmes, så længe kontoen findes, eller til du beder os slette den. Statistik hos PostHog indsamles kun, mens dit samtykke gælder; allerede indsamlet statistik slettes, når du sletter kontoen, eller hvis du beder os om det. Din e-mailadresse hos EmailOctopus gemmes, til du afmelder nyhedsbrevet eller sletter kontoen. Trækker du samtykket til madloggen tilbage, slettes madloggen, og kaloriemålet nulstilles. Samtykke til analyse kan trækkes tilbage når som helst.'],
        ['Dine rettigheder','Du har ret til at bede om indsigt i, rettelse og sletning af dine oplysninger, begrænsning af behandlingen og dataportabilitet. Du har også ret til at gøre indsigelse mod visse behandlinger og trække et samtykke tilbage. Skriv til hei@matlyst-app.no. Du kan også klage til Datatilsynet i Danmark (datatilsynet.dk) eller i Norge (datatilsynet.no).'],
        ['Alder og samtykke','I Danmark skal du være mindst 15 år for selv at give samtykke til de funktioner i Matlyst, der kræver samtykke. Vi gemmer det land, du har valgt, din bekræftelse af aldersgrænsen og tidspunktet, men ikke din fødselsdato.'],
      ],
    },
    delete: {
      path:'slet-konto/', counterpart:'radera-konto/', nb:'/slett-konto.html', title:'Slet konto | Matlyst', h1:'Slet din konto',
      intro:'Du kan slette Matlyst-kontoen og indholdet permanent. Et abonnement skal opsiges særskilt i App Store eller Google Play.',
      sections:[
        ['Slet i appen','Åbn Matlyst, gå til Indstillinger, og vælg Slet konto. Bekræft handlingen. Kontoen og indholdet slettes, og du logges ud.'],
        ['Hvis du ikke kan logge ind','Skriv til hei@matlyst-app.no fra den adresse, der hører til kontoen. Vi kontrollerer din identitet og behandler din anmodning inden 30 dage.'],
        ['Det, der slettes','Konto, profil, opskrifter, mapper, billeder, noter, Madplan, Indkøbsliste, Spisekammer, husstandsmedlemskab, feedback og push-token slettes. Krypterede sikkerhedskopier slettes automatisk senest 30 dage efter sletningen.'],
      ],
    },
  },
};

function legalPage(lang, key) {
  const d = legal[lang][key];
  const description = d.intro;
  const breadcrumb = {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:common[lang].home,item:`${base}/${lang}/`},
    {'@type':'ListItem',position:2,name:d.h1,item:`${base}/${lang}/${d.path}`},
  ]};
  return `${head({lang,path:d.path,counterpart:d.counterpart,title:d.title,description,schema:breadcrumb})}<body data-locale="${lang}">
${nav(lang,d.path,d.counterpart,d.nb)}
<main id="hovedinnhold" class="legal-doc">
<header><p class="eyebrow">${common[lang].legal}</p><h1 class="disp">${d.h1}</h1><p class="lead">${d.intro}</p><p class="legal-updated">${lang === 'sv' ? 'Senast uppdaterad 5 oktober 2026' : 'Senest opdateret 5. oktober 2026'}</p></header>
${d.sections.map(([h,p])=>`<section><h2>${h}</h2><p>${p}</p></section>`).join('\n')}
<section class="legal-callout"><h2>${lang === 'sv' ? 'Kontakt' : 'Kontakt'}</h2><p>${lang === 'sv' ? 'Frågor och begäranden skickas till' : 'Spørgsmål og anmodninger sendes til'} <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>.</p></section>
</main>${footer(lang)}<script src="/site.js" defer></script></body></html>`;
}

const featurePages = {
  sv: [
    ['importera-recept/','importer-opskrifter/','Importera recept till en app','Importera recept från en länk, Instagram, TikTok eller ett foto och samla dem i Matlyst.','Importera recept','Skicka en länk eller dela innehållet med Matlyst. Appen tolkar ingredienser och steg, och visar källan på receptet.','Länkimport ingår med fem importer per månad utan Pro. Fotoimport kräver Matlyst Pro.','Kan jag importera från en webbsida?','Ja. Klistra in länken eller dela den med Matlyst.'],
    ['hitta-recept/','find-opskrifter/','Hitta mina recept','Sök i din egen receptsamling efter namn, ingrediens, kategori eller källa.','Hitta tillbaka till det du sparat','Sökningen gäller recepten i din samling. Filter hjälper dig att begränsa listan utan att blanda in recept från webben.','Mappar och favoriter ger fler vägar tillbaka till rätter du vill laga igen.','Söker Matlyst på hela webben?','Nej. Den här sökningen gäller din egen receptsamling.'],
    ['inkopslista/','indkoebsliste-app/','Inköpslista från recept','Skicka ingredienser från recept och veckomeny till en gemensam inköpslista.','En inköpslista från dina recept','Välj ett recept eller en hel planerad dag. Ingredienserna läggs i listan, där du också kan skriva in egna varor.','När en vara bockas av kan den flyttas till Skafferi. Hushållsdelning kräver Matlyst Pro.','Är inköpslistan gratis?','Den vanliga inköpslistan kan användas utan Pro. Hushållsdelning är en Pro-funktion.'],
    ['handskrivna-recept/','haandskrevne-opskrifter/','Digitalisera handskrivna recept','Fotografera ett receptkort och gör texten sökbar i din receptsamling.','Från receptkort till digital kokbok','Fotoimporten tolkar titel, ingredienser och steg. Kontrollera resultatet innan du sparar, särskilt svårläst handstil och mängder.','Fotoimport kräver Matlyst Pro. Originalets källa kan beskrivas i receptet.','Blir all handstil rätt?','Nej. Resultatet beror på bilden och handstilen och ska alltid kontrolleras.'],
    ['recept-pa-ingredienser/','opskrifter-ud-fra-ingredienser/','Vad kan jag laga med dessa ingredienser?','Hitta recept i din egen samling som passar ingredienserna du har hemma.','Sök med det som finns hemma','Skriv ingredienser eller använd Skafferi. Matlyst jämför med recepten du redan har sparat och visar relevanta träffar.','Förslagen är ett hjälpmedel. Kontrollera alltid att du faktiskt har rätt mängd och att varorna är användbara.','Skapar sökningen nya recept?','Nej. Den matchar mot recept i din egen samling. Fråga Matlyst kan skapa eller anpassa en rätt.'],
    ['vad-ska-jag-laga/','middagsforslag/','Vad ska jag laga till middag?','Få middagsförslag från egna recept och fråga Matlyst när du vill anpassa en rätt.','Middagsförslag från din samling','På Hem visas förslag från din egen receptsamling. Skafferi kan hjälpa till att lyfta fram rätter som passar det du har.','Fråga Matlyst kan skapa eller ändra recept. Den funktionen följer appens Pro-gate.','Varifrån kommer förslagen?','Från recepten du har sparat och de uppgifter appen har om Skafferi.'],
    ['veckomeny-app/','madplan-app/','Matplanering och inköpslista','Planera veckans middagar med egna recept och skicka ingredienserna till inköpslistan.','Planera veckan själv','Välj ett recept för varje dag du vill planera. Matlyst skapar inte en färdig vecka automatiskt.','Veckomenyn och den vanliga inköpslistan kan användas utan Pro. Hushållsdelning kräver Pro.','Gör Matlyst veckomenyn åt mig?','Nej. Du väljer själv recept och dagar.'],
    ['byt-fran-paprika/','skift-fra-paprika/','Alternativ till Paprika Recipe Manager','Flytta dina recept med Matlysts import och kontrollera varje resultat innan du sparar.','Byt utan att lova en magisk flytt','Matlyst kan importera recept från länkar och filer som appen stöder. Exakt flöde beror på hur recepten kan exporteras från din nuvarande app.','Matlyst har ingen koppling till Paprika och garanterar inte att alla fält kan flyttas automatiskt.','Finns en direktkoppling till Paprika?','Nej. Använd export- och importmöjligheterna som apparna erbjuder.'],
    ['receptbok-app/','opskrifts-app/','Egen kokbok i en app','Samla egna och importerade recept i mappar, med favoriter, anteckningar och källa.','Din digitala kokbok','Spara familjerecept, länkar du hittar och rätter du gör ofta på samma ställe. Mappar och sökning håller samlingen användbar.','Du bestämmer över innehållet. Källan visas på importerade recept när den finns.','Kan jag lägga in egna recept?','Ja. Du kan skriva in ett recept själv eller importera från källor som stöds.'],
    ['spara-recept-fran-instagram/','gem-opskrifter-fra-instagram/','Spara recept från Instagram','Dela en offentlig reel med Matlyst och kontrollera receptet innan du sparar.','Från reel till recept','Använd Instagrams delningsmeny och välj Matlyst. När importen kan läsa innehållet får du ingredienser och steg i ett redigerbart recept.','Källan följer med. Privat eller otillgängligt innehåll kan inte alltid importeras.','Är Matlyst knutet till Instagram?','Nej. Matlyst använder den länk eller delning du själv skickar.'],
    ['spara-recept-fran-tiktok/','gem-opskrifter-fra-tiktok/','Spara TikTok-recept','Dela en TikTok-video från ett offentligt konto med Matlyst och samla receptet med källan kvar.','Spara när du hittar något gott','Välj Matlyst i delningsmenyn. Kontrollera mängder och steg innan receptet sparas i din samling.','Privat, borttaget eller geografiskt spärrat innehåll kan inte alltid läsas.','Behålls länken till videon?','Ja, när källan är tillgänglig sparas den tillsammans med receptet.'],
    ['skafferi-app/','spisekammer-app/','Skafferi-app för recept','Håll koll på varor hemma och hitta recept som passar innan maten blir gammal.','Det du har, synligt','Lägg in varor manuellt eller flytta avbockade inköp till Skafferi. Förslag kan sedan använda innehållet som underlag.','Gratisnivån visar ett begränsat antal skafferivaror; Pro öppnar mer kapacitet.','Är lagersaldot exakt?','Bara om du håller Skafferi uppdaterat. Matlyst känner inte av varorna automatiskt.'],
    ['tom-kylskapet/','toem-koeleskabet/','Töm kylskåpet med recept','Använd det du redan har genom att matcha Skafferi mot din egen receptsamling.','Börja med det som finns','Se vilka sparade recept som passar varorna hemma och vilka ingredienser som saknas. Det minskar onödiga extraköp.','Matlyst kan inte avgöra om en vara är säker att äta. Kontrollera lukt, utseende, datum och förvaring själv.','Kan Matlyst avgöra om maten fortfarande är bra?','Nej. Du ansvarar alltid för att bedöma maten.'],
    ['enkel-middag/','nem-mad/','Enkel middag från det du har','Planera enkel middag med egna recept, Skafferi, Veckomeny och Inköpslista.','Enklare vardagsmiddag','Välj en snabb rätt du redan tycker om, planera den till rätt dag och skicka det som saknas till listan.','Exempel som köttbullar med potatis, ugnslax eller en enkel pastarätt är inspiration, inte färdiga recept på sidan.','Vad är en enkel vardagsmiddag?','En rätt med tydliga steg, rimlig tid och råvaror du faktiskt har eller lätt kan köpa.'],
    ['receptskapare/','opskriftsskabere/','Matlyst för receptskapare','Så visar Matlyst källa, hanterar import och tar emot begäran från rättighetshavare.','Källan ska vara tydlig','Importerade recept behåller källänken när den finns.','En skapare kan kontakta hei@matlyst-app.no för frågor, rättelse eller blockering av import från en källa.','Kan en skapare stoppa import?','Ja. Kontakta oss med källan och underlag så behandlar vi begäran.'],
  ],
  da: [
    ['importer-opskrifter/','importera-recept/','Importér opskrifter til en app','Importér opskrifter fra et link, Instagram, TikTok eller et foto, og saml dem i Matlyst.','Importér opskrifter','Send et link, eller del indholdet med Matlyst. Appen tolker ingredienser og trin og viser kilden på opskriften.','Linkimport omfatter fem importer om måneden uden Pro. Fotoimport kræver Matlyst Pro.','Kan jeg importere fra en hjemmeside?','Ja. Indsæt linket, eller del det med Matlyst.'],
    ['find-opskrifter/','hitta-recept/','Find mine opskrifter','Søg i din egen opskriftssamling efter navn, ingrediens, kategori eller kilde.','Find tilbage til det, du har gemt','Søgningen gælder opskrifterne i din samling. Filtre begrænser listen uden at blande opskrifter fra nettet ind.','Mapper og favoritter giver flere veje tilbage til de retter, du vil lave igen.','Søger Matlyst på hele nettet?','Nej. Denne søgning gælder din egen opskriftssamling.'],
    ['indkoebsliste-app/','inkopslista/','Fælles indkøbsliste fra opskrifter','Send ingredienser fra opskrifter og Madplan til én indkøbsliste.','En indkøbsliste fra dine opskrifter','Vælg en opskrift eller en planlagt dag. Ingredienserne føjes til listen, hvor du også kan skrive egne varer.','Når en vare krydses af, kan den flyttes til Spisekammeret. Deling i en husstand kræver Matlyst Pro.','Er indkøbslisten gratis?','Den almindelige indkøbsliste kan bruges uden Pro. Deling i en husstand er en Pro-funktion.'],
    ['haandskrevne-opskrifter/','handskrivna-recept/','Scan håndskrevne opskrifter','Fotografér et opskriftskort, og gør teksten søgbar i din opskriftssamling.','Fra opskriftskort til digital kogebog','Fotoimporten tolker titel, ingredienser og trin. Kontrollér resultatet før lagring, især ved svær håndskrift og mængder.','Fotoimport kræver Matlyst Pro. Den oprindelige kilde kan beskrives på opskriften.','Bliver al håndskrift læst korrekt?','Nej. Resultatet afhænger af billedet og håndskriften og skal altid kontrolleres.'],
    ['opskrifter-ud-fra-ingredienser/','recept-pa-ingredienser/','Opskrifter ud fra ingredienser','Find opskrifter i din egen samling, der passer til de ingredienser, du har derhjemme.','Søg med det, du har derhjemme','Skriv ingredienser, eller brug Spisekammeret. Matlyst sammenligner med opskrifterne, du allerede har gemt.','Forslagene er hjælp. Kontrollér mængder, holdbarhed og om varerne kan bruges.','Laver søgningen nye opskrifter?','Nej. Den matcher din egen samling. Spørg Matlyst kan lave eller tilpasse en ret.'],
    ['middagsforslag/','vad-ska-jag-laga/','Hvad skal jeg lave til aftensmad?','Få middagsforslag fra egne opskrifter, og brug Spørg Matlyst til at tilpasse en ret.','Middagsforslag med sammenhæng','På Forsiden vises forslag fra din opskriftssamling. Spisekammeret kan hjælpe med at fremhæve retter, der passer til det, du har.','Spørg Matlyst kan lave eller ændre opskrifter. Funktionen følger appens Pro-gate.','Hvor kommer forslagene fra?','Fra opskrifter, du har gemt, og oplysninger i Spisekammeret.'],
    ['madplan-app/','veckomeny-app/','Madplan-app med indkøbsliste','Planlæg ugens aftensmad med egne opskrifter, og send ingredienserne til indkøbslisten.','Planlæg ugen selv','Vælg en opskrift til hver dag, du vil planlægge. Du bestemmer selv, hvad der skal på bordet hver dag.','Madplanen og den almindelige indkøbsliste kan bruges uden Pro. Deling i en husstand kræver Pro.','Er madplanen og indkøbslisten gratis?','Madplanen og den almindelige indkøbsliste kan bruges uden Pro. Du vælger selv opskrifter og dage.'],
    ['skift-fra-paprika/','byt-fran-paprika/','Alternativ til Paprika Recipe Manager','Flyt dine opskrifter med Matlysts import, og kontrollér hvert resultat, før du gemmer det.','Skift uden løfter om en magisk flytning','Matlyst kan importere links og filer, som appen understøtter. Det konkrete forløb afhænger af eksporten fra din nuværende app.','Matlyst har ingen tilknytning til Paprika og garanterer ikke, at alle felter kan flyttes automatisk.','Er der en direkte forbindelse til Paprika?','Nej. Brug de eksport- og importmuligheder, som tjenesterne tilbyder.'],
    ['opskrifts-app/','receptbok-app/','App til egne opskrifter','Saml egne og importerede opskrifter i mapper med favoritter, noter og kilde.','Din digitale kogebog','Gem familieopskrifter, links og retter, du laver ofte, på samme sted. Mapper og søgning holder samlingen anvendelig.','Du bestemmer over indholdet. Kilden vises på importerede opskrifter, når den findes.','Kan jeg skrive mine egne opskrifter ind?','Ja. Du kan skrive en opskrift selv eller importere fra en understøttet kilde.'],
    ['gem-opskrifter-fra-instagram/','spara-recept-fran-instagram/','Gem opskrifter fra Instagram','Del en offentlig reel med Matlyst, og kontrollér opskriften, før du gemmer den.','Fra reel til opskrift','Brug Instagrams delingsmenu, og vælg Matlyst. Når indholdet kan læses, får du ingredienser og trin i en redigerbar opskrift.','Kilden følger med. Privat eller utilgængeligt indhold kan ikke altid importeres.','Har Matlyst tilknytning til Instagram?','Nej. Matlyst bruger det link eller den deling, du selv sender.'],
    ['gem-opskrifter-fra-tiktok/','spara-recept-fran-tiktok/','Gem TikTok-opskrifter','Del en TikTok-video fra en offentlig konto med Matlyst, og saml opskriften med kilden bevaret.','Gem, når du finder noget godt','Vælg Matlyst i delingsmenuen. Kontrollér mængder og trin, før opskriften gemmes.','Privat, slettet eller geografisk blokeret indhold kan ikke altid læses.','Bevares linket til videoen?','Ja, når kilden er tilgængelig, gemmes den med opskriften.'],
    ['spisekammer-app/','skafferi-app/','Spisekammer-app til opskrifter','Hold styr på varer hjemme, og find opskrifter, der passer, før maden bliver gammel.','Det, du har, samlet','Tilføj varer manuelt, eller flyt afkrydsede indkøb til Spisekammeret. Forslag kan derefter bruge indholdet som grundlag.','Gratisniveauet viser et begrænset antal varer; Pro giver mere kapacitet.','Er beholdningen altid præcis?','Kun hvis du holder Spisekammeret opdateret. Matlyst registrerer ikke varer automatisk.'],
    ['toem-koeleskabet/','tom-kylskapet/','Tøm køleskabet med opskrifter','Brug det, du har, ved at matche Spisekammeret med din egen opskriftssamling.','Begynd med det, du har derhjemme','Se, hvilke gemte opskrifter der passer til de varer, du har derhjemme, og hvilke ingredienser der mangler.','Matlyst kan ikke afgøre, om en vare er sikker at spise. Kontrollér selv lugt, udseende, dato og opbevaring.','Giver Matlyst en holdbarhedsgaranti?','Nej. Du har altid ansvaret for at vurdere maden.'],
    ['nem-mad/','enkel-middag/','Nem mad til hverdagen','Planlæg nem mad med egne opskrifter, Spisekammeret, Madplanen og Indkøbslisten.','Nem aftensmad med overblik','Vælg en hurtig ret, du allerede kan lide, læg den på den rigtige dag, og send det, du mangler, til listen.','Frikadeller med kartofler, en pastaret eller ovnbagt laks er eksempler, ikke færdige opskrifter på siden.','Hvad er nem mad til hverdag?','En ret med tydelige trin, rimelig tid og råvarer, du har eller let kan købe.'],
    ['opskriftsskabere/','receptskapare/','Matlyst for opskriftsskabere','Sådan viser Matlyst kilden, håndterer import og modtager henvendelser fra rettighedshavere.','Kilden skal være tydelig','Importerede opskrifter beholder kildelinket, når det findes. Matlyst gør ikke krav på skaberens tekst eller billeder.','En skaber kan skrive til hei@matlyst-app.no om spørgsmål, rettelser eller blokering af import fra en kilde.','Kan en skaber stoppe import?','Ja. Kontakt os med kilde og dokumentation, så behandler vi henvendelsen.'],
  ],
};

const featureOverrides = {
    sv: {
      'importera-recept/': { title:'Importera recept till appen', p2:'Utan Pro kan du importera fem recept via länk per månad.' },
      'inkopslista/': { description:'Skicka ingredienser från recept och veckomeny till en och samma inköpslista.', p1:'Välj ett recept eller en hel planerad dag. Ingredienserna läggs till i listan, där du också kan skriva in egna varor.' },
      'handskrivna-recept/': { q:'Klarar appen all handstil?', p2:'Fotoimport kräver Matlyst Pro. Du kan skriva in var receptet kommer ifrån, till exempel ”Mormors receptbok”.' },
      'recept-pa-ingredienser/': { p1:'Skriv in ingredienser eller utgå från Skafferi.', p2:'Förslagen är ett hjälpmedel. Kontrollera alltid mängderna, hållbarheten och att varorna fortfarande går att äta.' },
      'vad-ska-jag-laga/': { h1:'Middagsförslag från dina egna recept', p2:'Fråga Matlyst kräver Matlyst Pro.', p1:'På fliken Hem visas förslag från din egen receptsamling. Skafferi kan hjälpa till att lyfta fram rätter som passar det du har.' },
      'veckomeny-app/': { title:'Veckomeny-app: planera veckans middagar', h1:'Veckomeny: planera veckans middagar', h2:'Så fungerar Veckomeny' },
      'byt-fran-paprika/': { h1:'Byt från Paprika – och kontrollera varje recept', p1:'Matlyst kan importera recept från länkar och filer som appen stöder. Exakt hur det går till beror på vilka exportmöjligheter din nuvarande app har.', q:'Finns det en direktkoppling till Paprika?' },
      'receptbok-app/': { p1:'Spara familjerecept, länkar du hittar och rätter du gör ofta på samma ställe. Med mappar och sökning är det lätt att hitta runt i samlingen.' },
      'spara-recept-fran-instagram/': { description:'Spara recept från Instagram i Matlyst och kontrollera dem innan du lagar maten.', p1:'Dela en reel från ett offentligt konto med Matlyst och kontrollera receptet innan du sparar.' },
      'spara-recept-fran-tiktok/': { a:'Ja. Länken sparas med receptet när videon är tillgänglig.' },
      'skafferi-app/': { title:'Skafferi-app för recept', description:'Håll koll på varor hemma och hitta recept som passar innan varorna blir gamla.', h1:'Överblick över det du har', p1:'Lägg in varor manuellt eller flytta avbockade inköp till Skafferi. Sedan kan Matlyst föreslå recept utifrån det du har hemma.', p2:'I gratisversionen rymmer Skafferi ett begränsat antal varor. Med Pro får du plats med fler.', q:'Vet appen exakt vad jag har hemma?' },
      'enkel-middag/': { h1:'Enkel middag från det du har', h2:'Från sparat recept till middag', description:'Planera en enkel middag med dina egna recept, det du har i Skafferi och en färdig inköpslista.', p1:'Välj en snabb rätt du redan tycker om och lägg in den på en dag som passar. Skicka sedan det som saknas till listan.', p2:'Tänk köttbullar med potatis, ugnsbakad lax eller en snabb pastarätt – vardagsrätter du sparar en gång och lagar igen och igen.', },
      'receptskapare/': { description:'Så visar Matlyst källan, hanterar import och tar emot begäranden från rättighetshavare.', p2:'En skapare kan kontakta hei@matlyst-app.no om frågor, rättelse eller blockering av import från en källa. Matlyst gör inte anspråk på skaparens text eller bilder.' },
    },
    da: {
      'importer-opskrifter/': { title:'Importér opskrifter til din opskriftsapp', p2:'Uden Pro kan du importere fem links om måneden.' },
      'indkoebsliste-app/': { p1:'Vælg en opskrift eller en planlagt dag. Ingredienserne lægges på Indkøbslisten, hvor du også kan skrive egne varer.', q:'Er Indkøbsliste gratis?', a:'Ja. Du kan bruge Indkøbsliste uden Pro. Deling i en husstand er en Pro-funktion.' },
      'haandskrevne-opskrifter/': { p1:'Fotoimporten tolker titel, ingredienser og trin. Tjek resultatet, før du gemmer – især mængderne, og når håndskriften er svær at læse.', p2:'Fotoimport kræver Matlyst Pro. Du kan selv notere, hvor opskriften stammer fra.' },
      'opskrifter-ud-fra-ingredienser/': { p1:'Skriv ingredienser, eller brug Spisekammeret. Matlyst sammenligner dem med de opskrifter, du allerede har gemt.', p2:'Forslagene er kun vejledende. Tjek mængder, holdbarhed, og om varerne stadig kan bruges.' },
      'middagsforslag/': { title:'Forslag til aftensmad fra dine egne opskrifter', h1:'Forslag til aftensmad fra dine egne opskrifter', h2:'Forslag fra din egen samling', p1:'På Hjem vises forslag fra din opskriftssamling. Spisekammeret kan hjælpe med at fremhæve retter, der passer til det, du har. Se også <a href="/da/nem-mad/">nem mad</a>.', p2:'Spørg Matlyst kræver Matlyst Pro.' },
      'madplan-app/': { description:'Planlæg ugens aftensmad med egne opskrifter, og send ingredienserne til Indkøbslisten.', p1:'Vælg en opskrift til de dage, du vil planlægge. Du bestemmer selv, hvad der skal på bordet.', p2:'Deling af Madplan og Indkøbsliste i en husstand kræver Matlyst Pro.', q:'Er Madplan og Indkøbsliste gratis?', a:'Ja. Du kan bruge Madplan og Indkøbsliste uden Pro.' },
      'skift-fra-paprika/': { description:'Flyt dine opskrifter med Matlysts import, og kontrollér hvert resultat, før du gemmer det.', h1:'Skift til Matlyst – uden tomme løfter', p1:'Matlyst kan importere links og filer, som appen understøtter. Det konkrete forløb afhænger af eksporten fra din nuværende app.' },
      'opskrifts-app/': { p1:'Gem familieopskrifter, links og retter, du laver ofte, på samme sted. Med mapper og søgning er det let at finde rundt i samlingen.' },
      'gem-opskrifter-fra-instagram/': { description:'Gem opskrifter fra Instagram i Matlyst, og kontrollér dem, før du laver mad.', p1:'Del en reel fra en offentlig konto med Matlyst, og kontrollér opskriften, før du gemmer den.' },
      'gem-opskrifter-fra-tiktok/': { a:'Ja. Linket gemmes med opskriften, når videoen er tilgængelig.' },
      'spisekammer-app/': { title:'Spisekammer-app til opskrifter', description:'Hold styr på varerne derhjemme, og find opskrifter, der passer, før maden skal smides ud.', h1:'Overblik over det, du har', p1:'Tilføj varer manuelt, eller flyt afkrydsede indkøb til Spisekammeret. Så kan forslagene tage udgangspunkt i det.', p2:'I gratisversionen er der plads til et begrænset antal varer. Med Pro er der plads til flere.', },
      'nem-mad/': { h1:'Nem mad til hverdagen', h2:'Fra gemt opskrift til aftensmad', p1:'Vælg en hurtig ret, du allerede kan lide, læg den på en dag, der passer, og send det, du mangler, til listen.', p2:'Det kan være frikadeller med kartofler, en hurtig pastaret eller laks i ovnen – retter, du allerede kender.' },
    },
};

function featureValues(lang, row) {
  const [path,counterpart,title,description,h1,p1,p2,q,a] = row;
  return { path, counterpart, title, description, h1, h2: title, p1, p2, q, a, ...featureOverrides[lang]?.[path] };
}

function featurePage(lang, row) {
  const values = featureValues(lang, row);
  const { path, counterpart } = values;
  const faq = {'@context':'https://schema.org','@type':'FAQPage',mainEntity:[{'@type':'Question',name:values.q,acceptedAnswer:{'@type':'Answer',text:values.a}}]};
  const crumbs = {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:common[lang].home,item:`${base}/${lang}/`},
    {'@type':'ListItem',position:2,name:values.h1,item:`${base}/${lang}/${path}`},
  ]};
  const sectionLabel = lang === 'sv' ? 'Bra att veta' : 'Godt at vide';
  return `${head({lang,path,counterpart,title:`${values.title} | Matlyst`,description:values.description,schema:[crumbs,faq]})}<body data-locale="${lang}">
${nav(lang,path,counterpart)}<main id="hovedinnhold"><header class="locale-page-hero"><p class="eyebrow">Matlyst</p><h1 class="disp">${values.h1}</h1><p class="lead">${values.description}</p></header>
<section class="prose locale-prose"><h2>${values.h2}</h2><p>${values.p1}</p><h2>${sectionLabel}</h2><p>${values.p2}</p></section>
<section class="faq"><h2>${lang === 'sv' ? 'Vanliga frågor' : 'Ofte stillede spørgsmål'}</h2><details open><summary>${values.q}</summary><p>${values.a}</p></details></section>
<section class="page-cta"><h2 class="disp">${lang === 'sv' ? 'Få ordning på vardagsmaten med Matlyst' : 'Få styr på hverdagen med Matlyst'}</h2>${storeButtons(lang)}</section></main>${footer(lang)}<script src="/site.js" defer></script></body></html>`;
}

const sourcePages = {
  sv: [
    ['koket/','dr-mad/','Spara recept från Köket.se','Så sparar du ett recept från Köket.se i Matlyst, med källan kvar.','Köket.se','https://www.koket.se/'],
    ['landleys-kok/','alletiders-kogebog/','Spara recept från Landleys Kök','Så sparar du ett recept från Landleys Kök i Matlyst, med källan kvar.','Landleys Kök','https://www.landleyskok.se/'],
  ],
  da: [
    ['alletiders-kogebog/','landleys-kok/','Gem opskrifter fra Alletiders Kogebog','Sådan gemmer du en opskrift fra Alletiders Kogebog i Matlyst med kilden bevaret.','Alletiders Kogebog','https://www.dk-kogebogen.dk/'],
    ['dr-mad/','koket/','Gem opskrifter fra DR Mad','Sådan gemmer du en opskrift fra DR Mad i Matlyst med kilden bevaret.','DR Mad','https://www.dr.dk/mad'],
  ],
};

function sourcePage(lang, row) {
  const [path,counterpart,title,description,source,sourceUrl] = row;
  const sv = lang === 'sv';
  const crumbs = {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:common[lang].home,item:`${base}/${lang}/`},
    {'@type':'ListItem',position:2,name:title,item:`${base}/${lang}/${path}`},
  ]};
  return `${head({lang,path,counterpart,title:`${title} | Matlyst`,description,schema:crumbs})}<body data-locale="${lang}">
${nav(lang,path,counterpart)}<main id="hovedinnhold"><header class="locale-page-hero"><p class="eyebrow">${sv ? 'Spara med källan kvar' : 'Gem med kilden bevaret'}</p><h1 class="disp">${title}</h1><p class="lead">${description}</p></header>
<section class="prose locale-prose"><h2>${sv ? 'Så gör du' : 'Sådan gør du'}</h2><ol><li>${sv ? `Öppna ett recept från ${source}.` : `Åbn en opskrift fra ${source}.`}</li><li>${sv ? 'Dela länken med Matlyst eller klistra in den i importen.' : 'Del linket med Matlyst, eller indsæt det i importen.'}</li><li>${sv ? 'Kontrollera ingredienser, mängder och steg innan du sparar.' : 'Kontrollér ingredienser, mængder og trin, før du gemmer den.'}</li></ol>
<h2>${sv ? 'Källa och ansvar' : 'Kilde og ansvar'}</h2><p>${sv ? `Matlyst visar källänken när den kan läsas. Matlyst samarbetar inte med ${source} och gör inte anspråk på deras texter eller bilder.` : `Matlyst viser kildelinket, når det kan læses. Matlyst samarbejder ikke med ${source} og gør ikke krav på deres tekster eller billeder.`}</p><p><a href="${sourceUrl}" rel="noopener">${sv ? `Besök ${source}` : `Besøg ${source}`}</a></p></section>
<section class="page-cta"><h2 class="disp">${sv ? 'Spara recepten där du lagar maten' : 'Gem dine yndlingsopskrifter ét sted'}</h2>${storeButtons(lang)}</section></main>${footer(lang)}<script src="/site.js" defer></script></body></html>`;
}

const supportPages = {
  sv: [
    ['avregistrera/','afmeld/','Avregistrera dig från nyhetsbrevet','Avregistrera dig via länken längst ned i e-postmeddelandet eller kontakta hei@matlyst-app.no.'],
    ['tiktok/','tiktok/','TikTok och Matlyst','Den här sidan används när du delar en länk till en TikTok-video från ett offentligt konto med Matlyst. Privat eller borttaget innehåll kan inte alltid läsas.'],
    ['tiktok-auth/','tiktok-auth/','TikTok-anslutning','Teknisk retursida för TikTok-anslutning i Matlyst.'],
  ],
  da: [
    ['afmeld/','avregistrera/','Afmeld nyhedsbrevet','Afmeld dig via linket nederst i e-mailen, eller skriv til hei@matlyst-app.no.'],
    ['tiktok/','tiktok/','TikTok og Matlyst','Denne side bruges, når du deler et link til en TikTok-video fra en offentlig konto med Matlyst. Privat eller slettet indhold kan ikke altid læses.'],
    ['tiktok-auth/','tiktok-auth/','TikTok-forbindelse','Teknisk returside til TikTok-forbindelse i Matlyst.'],
  ],
};

function supportPage(lang, row) {
  const [path,counterpart,title,text] = row;
  const nb = /^(?:avregistrera|afmeld)\//.test(path) ? '/avmeld/' : `/${path}`;
  const schema = {'@context':'https://schema.org','@type':'WebPage',name:title,url:`${base}/${lang}/${path}`};
  return `${head({lang,path,counterpart,title:`${title} | Matlyst`,description:text,noindex:true,schema})}<body data-locale="${lang}">${nav(lang,path,counterpart,nb)}<main id="hovedinnhold" class="legal-doc"><header><p class="eyebrow">Matlyst</p><h1 class="disp">${title}</h1><p class="lead">${text}</p></header></main>${footer(lang)}<script src="/site.js" defer></script></body></html>`;
}

const lokaleSider = [];
function write(path, content) {
  const file = fileURLToPath(new URL(path, import.meta.url));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  if (/^\.\.\/(?:sv|da)\/(?:.*\/)?index\.html$/u.test(path)) lokaleSider.push(content);
}

for (const lang of ['sv','da']) {
  write(`../${lang}/index.html`, home(lang));
  for (const key of ['terms','privacy','delete']) {
    const d = legal[lang][key];
    write(`../${lang}/${d.path}index.html`, legalPage(lang,key));
  }
  for (const row of featurePages[lang]) write(`../${lang}/${row[0]}index.html`, featurePage(lang,row));
  for (const row of sourcePages[lang]) write(`../${lang}/${row[0]}index.html`, sourcePage(lang,row));
  for (const row of supportPages[lang]) write(`../${lang}/${row[0]}index.html`, supportPage(lang,row));
}

// Ett sitemap per språk. Sider med noindex (støttesidene) tas ikke med.
const sistEndret = '2026-10-05';
for (const lang of ['sv','da']) {
  const urls = lokaleSider
    .filter((html) => html.includes(`<html lang="${lang}">`) && !html.includes('content="noindex'))
    .map((html) => {
      const loc = html.match(/<link rel="canonical" href="([^"]+)">/u)[1];
      const alternativer = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/gu)]
        .map(([, kode, href]) => `    <xhtml:link rel="alternate" hreflang="${kode}" href="${href}"/>`);
      return [`  <url>`, `    <loc>${loc}</loc>`, `    <lastmod>${sistEndret}</lastmod>`, ...alternativer, `  </url>`].join('\n');
    })
    .sort();
  write(`../sitemap-${lang}.xml`, ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">', ...urls, '</urlset>'].join('\n') + '\n');
}

const norskeAvsnitt = {
  'importera-recept/': 'Send en lenke eller del innholdet til Matlyst. Appen tolker ingredienser og fremgangsmåte og viser kilden på oppskriften.',
  'hitta-recept/': 'Søk i oppskriftene i din egen samling. Filtre avgrenser listen uten å blande inn oppskrifter fra nettet.',
  'inkopslista/': 'Velg en oppskrift eller en planlagt dag. Ingrediensene legges i handlelisten, der du også kan skrive inn egne varer.',
  'handskrivna-recept/': 'Bildeimporten tolker tittel, ingredienser og fremgangsmåte. Kontroller resultatet før du lagrer.',
  'recept-pa-ingredienser/': 'Skriv ingredienser eller bruk Spiskammeret. Matlyst sammenligner med oppskriftene du allerede har lagret.',
  'vad-ska-jag-laga/': 'På Hjem vises forslag fra din egen oppskriftsamling. Spiskammeret kan løfte fram retter som passer det du har.',
  'veckomeny-app/': 'Velg en oppskrift for hver dag du vil planlegge. Matlyst lager ikke en ferdig uke automatisk.',
  'byt-fran-paprika/': 'Matlyst kan importere lenker og filer som appen støtter. Flyttingen avhenger av eksporten fra den gamle appen.',
  'receptbok-app/': 'Samle familieoppskrifter, lenker og retter du lager ofte på samme sted. Mapper og søk holder samlingen oversiktlig.',
  'spara-recept-fran-instagram/': 'Bruk Instagrams delingsmeny og velg Matlyst. Kontroller ingredienser og steg før du lagrer.',
  'spara-recept-fran-tiktok/': 'Velg Matlyst i delingsmenyen. Kildelenken lagres sammen med oppskriften når innholdet er tilgjengelig.',
  'skafferi-app/': 'Legg inn varer manuelt eller flytt avkryssede innkjøp til Spiskammeret. Forslag kan bruke innholdet som grunnlag.',
  'tom-kylskapet/': 'Se hvilke lagrede oppskrifter som passer varene hjemme, og hvilke ingredienser som mangler.',
  'enkel-middag/': 'Velg en enkel rett du allerede liker, planlegg den på riktig dag og send det som mangler til handlelisten.',
  'receptskapare/': 'Importerte oppskrifter beholder kildelenken når den finnes. Matlyst gjør ikke krav på skaperens tekst eller bilder.',
};
const sammenheng = ['# Funksjonssider: norsk, svensk og dansk', '', 'Kontrollgrunnlag generert 2026-10-05. Hver rad viser samme produktløfte med lokal formulering.', '', '| Norsk | Svensk | Dansk |', '|---|---|---|'];
for (const sv of featurePages.sv) {
  const da = featurePages.da.find((row) => row[0] === sv[1]);
  if (!da) continue;
  const svValues = featureValues('sv', sv);
  const daValues = featureValues('da', da);
  sammenheng.push(`| ${norskeAvsnitt[sv[0]]} | **${svValues.h1}:** ${svValues.p1} | **${daValues.h1}:** ${daValues.p1} |`);
}
write('../qa/sv-da/funksjoner-side-for-side.md', sammenheng.join('\n') + '\n');

function bevis(path) {
  if (/import|instagram|tiktok|handskriv|haandskrev/.test(path)) return '`lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx`';
  if (/hitta|find|recept-pa|opskrifter-ud/.test(path)) return '`hooks/useRecipeSearch.ts:53-94`, `hooks/usePantryRecipes.ts`';
  if (/inkop|indkoeb/.test(path)) return '`app/(tabs)/grocery.tsx:285-367`, `hooks/useGrocery.ts`';
  if (/veckomeny|madplan/.test(path)) return '`app/(tabs)/ukemeny.tsx:371-433`, `app/recipe-picker.tsx`';
  if (/skafferi|spisekammer|kylskap|koeleskab/.test(path)) return '`hooks/usePantry.ts:247-276`, `hooks/usePantryRecipes.ts`';
  if (/vad-ska|middagsforslag/.test(path)) return '`hooks/useRecommendations.ts:76-131`, `hooks/useSporMatlyst.ts:118-221`';
  if (/paprika/.test(path)) return '`components/RecipeFileImport.tsx`, `lib/importEngine.ts:248-270`';
  if (/receptskapare|opskriftsskabere/.test(path)) return '`lib/source.ts:20-74`, `lib/source.ts:84-107`';
  return '`hooks/useRecipes.ts:169-199`, `hooks/useRecipeSearch.ts:53-94`';
}
const paastander = ['# Produktpåstander per side', '', 'Kontrollert mot appens `origin/master` `2613d17d3173676a0eb6229a16b3e534a670a946`, lest 2026-10-05. Påstanden er sitert ordrett fra sidens avsnitt «Bra att veta» / «Godt at vide» (kildesider: «Källa och ansvar» / «Kilde og ansvar»).', '', '| Side | Påstand som må holde (ordrett sitat) | Kodebevis |', '|---|---|---|'];
for (const lang of ['sv','da']) for (const row of featurePages[lang]) {
  const claim = featureValues(lang, row).p2;
  paastander.push(`| /${lang}/${row[0]} | ${claim} | ${bevis(row[0])} |`);
}
for (const lang of ['sv','da']) for (const row of sourcePages[lang]) {
  paastander.push(`| /${lang}/${row[0]} | ${lang === 'sv' ? `Matlyst visar källänken när den kan läsas. Matlyst samarbetar inte med ${row[4]} och gör inte anspråk på deras texter eller bilder.` : `Matlyst viser kildelinket, når det kan læses. Matlyst samarbejder ikke med ${row[4]} og gør ikke krav på deres tekster eller billeder.`} | \`lib/importEngine.ts:201-229\`, \`lib/source.ts:20-74\` |`);
}
write('../qa/sv-da/produktpaastander.md', paastander.join('\n') + '\n');

write('../qa/sv-da/juridiske-kilder.md', [
  '# Juridiske kilder for sv/da', '',
  'Kontrollert 2026-10-05. Tekstene skal ikke leses som juridisk godkjenning; de viser hvilket faktisk grunnlag generatoren bruker. Kolonnen «Sidetekst» siterer generatoren.', '',
  '| Påstand | Sidetekst | Kilde | Lest |', '|---|---|---|---|',
  '| Identitet og geografisk adresse | «Patrick Omassa Kabia, Vollebekkveien 2J, 0598 Oslo, Norge» | `matlyst-landing-jus-da-sv/personvern.html` og `vilkar.html`, hei@matlyst-app.no | 2026-10-05 |',
  '| Ångerrätt og fortrydelsesret | villkor §5 / vilkaar §5 | `matlyst-plan1/docs/juridisk/kilder/forbruker.md`, avsnittene om App Store/Google Play og distanseavtaler | 2026-10-05 |',
  '| Forbruger Europa hjelper gratis med klager mot virksomheter i Norge | DA §8: «kan du få gratis hjælp hos Forbruger Europa, som også hjælper med klager mod virksomheder i Norge» | https://forbrugereuropa.dk/klag/ («Vi tilbyder gratis hjælp, når du som forbruger får problemer med en virksomhed i et andet europæisk land»; dekker EU, Island, Norge og Storbritannia) | 2026-10-05 |',
  '| Konsument Europa medler med virksomheter i Norge | SV §8: «kontakta Konsument Europa, som kan medla i tvister med företag i Norge» | https://www.konsumenteuropa.se/ («Medling med företag som har sitt säte i ett annat EU-land, Island eller Norge», kostnadsfritt) | 2026-10-05 |',
  '| Forbrukertilsynet mekler i Norge, ikke Forbrukerrådet | DA: «I Norge kan Forbrukertilsynet mægle»; SV: «I Norge kan Forbrukertilsynet medla» | https://www.forbrukerradet.no/her-klager-du/ (Forbrukertilsynet kan mekle; fører meklingen ikke fram, kan saken tas videre til Forbrukerklageutvalget) | 2026-10-05 |',
  '| Forbrukerklageutvalget behandler etter mekling saker om kjøp av varer, håndverkertjenester og angrerett | DA: «en sag om fortrydelsesret kan derefter indbringes for Forbrukerklageutvalget»; SV: «ett ärende om ångerrätt kan därefter prövas av Forbrukerklageutvalget» | https://www.forbrukertilsynet.no/forbrukerklageutvalget/ («saker som gjeld kjøp av varer, håndverkartenester og angrerett»; saken må ha vært meklet i Forbrukartilsynet) | 2026-10-05 |',
  '| Forbrukeren kan saksøke i eget land | SV §8: «Du kan också väcka talan vid domstol i Sverige.»; DA §8: «Du kan også anlægge sag ved en domstol i Danmark.» | Luganokonvensjonen 2007, som Norge er part i: forbrukeren kan saksøke i sin egen bostedsstat. https://lagen.nu/prop/2008/09:205 (prop. 2008/09:205 En ny Luganokonvention) | 2026-10-05 |',
  '| Overføringsgrunnlag per mottaker | integritet «Leverantörer och överföring» / privatliv «Leverandører og overførsel» | `personvern.html`, «Overføring ut av EØS»: EU uten overføring (Supabase, PostHog, Sentry), adekvans (EmailOctopus), SCC (Anthropic, ikke DPF-sertifisert), DPF og subsidiært SCC (Apple, Google inkl. Gemini, Meta, RevenueCat) | 2026-10-05 |',
  '| Helseopplysninger | «artikel 9.2 a» / «artikel 9, stk. 2, litra a» | `personvern.html`, «Formål og rettslig grunnlag» og «Matlogg og kalorimål» | 2026-10-05 |',
].join('\n') + '\n');

const kildeQa = ['# Lokale kildesider', '', 'Kontrollert 2026-10-05. Sidene beskriver import av offentlige URL-er og påstår ikke samarbeid.', '', '| Side | Offisiell kilde | Fem tilfeldige importer |', '|---|---|---|'];
for (const lang of ['sv','da']) for (const row of sourcePages[lang]) {
  kildeQa.push(`| /${lang}/${row[0]} | ${row[5]} | Ikke kjørt: krever testkonto og er en lanseringsport |`);
}
write('../qa/sv-da/lokale-kilder.md', kildeQa.join('\n') + '\n');
