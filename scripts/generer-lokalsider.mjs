#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = 'https://matlyst-app.no';
const common = {
  sv: {
    locale: 'sv_SE', market: 'Sverige', home: 'Hem', skip: 'Hoppa till innehållet',
    features: 'Funktioner', legal: 'Villkor och integritet', download: 'Hämta Matlyst',
    appStore: 'https://apps.apple.com/se/app/matlyst/id6762563515',
    play: 'https://play.google.com/store/apps/details?id=app.matlyst&hl=sv&gl=SE',
    footer: 'Recept, matplanering och inköpslista på svenska.',
    langLabel: 'Språk', privacy: 'Integritet', terms: 'Villkor',
  },
  da: {
    locale: 'da_DK', market: 'Danmark', home: 'Forside', skip: 'Spring til indholdet',
    features: 'Funktioner', legal: 'Vilkår og privatliv', download: 'Hent Matlyst',
    appStore: 'https://apps.apple.com/dk/app/matlyst/id6762563515',
    play: 'https://play.google.com/store/apps/details?id=app.matlyst&hl=da&gl=DK',
    footer: 'Opskrifter, madplan og indkøbsliste på dansk.',
    langLabel: 'Sprog', privacy: 'Privatliv', terms: 'Vilkår',
  },
};

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const json = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');

function alternateLinks(path, counterpart = path, nb = '/') {
  return [
    ['nb-NO', nb], ['sv-SE', '/sv/' + (path || '')], ['da-DK', '/da/' + (counterpart || '')], ['x-default', nb],
  ].map(([lang, href]) => `<link rel="alternate" hreflang="${lang}" href="${base}${href}">`).join('\n');
}

function nav(lang, activePath = '') {
  const c = common[lang];
  const other = lang === 'sv' ? 'da' : 'sv';
  return `<a class="skip-link" href="#hovedinnhold">${c.skip}</a>
<nav aria-label="${lang === 'sv' ? 'Huvudnavigering' : 'Hovednavigation'}">
  <a href="/${lang}/" class="brand">Mat<em>lyst</em></a>
  <div class="nav-right">
    <a class="link" href="/${lang}/#funktioner">${c.features}</a>
    <span class="language-switcher" aria-label="${c.langLabel}">
      <a href="/?sprak=nb" lang="nb">NO</a>
      <a href="/sv/${activePath}?sprak=sv" lang="sv" ${lang === 'sv' ? 'aria-current="page"' : ''}>SV</a>
      <a href="/da/${activePath}?sprak=da" lang="da" ${lang === 'da' ? 'aria-current="page"' : ''}>DA</a>
    </span>
  </div>
</nav>`;
}

function footer(lang) {
  const c = common[lang];
  return `<footer>
  <a href="/${lang}/" class="brand">Mat<em>lyst</em></a>
  <div class="f-l"><a href="/${lang}/${lang === 'sv' ? 'villkor/' : 'vilkaar/'}">${c.terms}</a><a href="/${lang}/${lang === 'sv' ? 'integritet/' : 'privatliv/'}">${c.privacy}</a><a href="mailto:hei@matlyst-app.no">Kontakt</a></div>
  <span class="c">© 2026 Matlyst · ${c.footer}</span>
</footer>`;
}

function head({ lang, path = '', counterpart = path, title, description, image = '/images/og.jpg', nb = '/', noindex = false, schema }) {
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
${alternateLinks(path, counterpart, nb)}
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
</head>`;
}

function storeButtons(lang) {
  const c = common[lang];
  return `<div class="store-badges">
<a class="btn-store" href="${c.appStore}" rel="noopener"><img src="/images/appstore-badge.svg" width="133" height="45" alt="${lang === 'sv' ? 'Hämta i App Store' : 'Hent i App Store'}"></a>
<a class="btn-store" href="${c.play}" rel="noopener"><img src="/images/googleplay-badge.png" width="133" height="40" alt="${lang === 'sv' ? 'Hämta på Google Play' : 'Hent i Google Play'}"></a>
</div>`;
}

function home(lang) {
  const sv = lang === 'sv';
  const c = common[lang];
  const title = sv ? 'Receptapp för vardagen | Matlyst Sverige' : 'Opskriftsapp til hverdagen | Matlyst Danmark';
  const description = sv
    ? 'Samla egna recept, planera veckans middagar och gör en inköpslista i Matlyst.'
    : 'Saml dine egne opskrifter, planlæg ugens aftensmad og lav en indkøbsliste i Matlyst.';
  const schema = {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Matlyst',
    applicationCategory: 'LifestyleApplication', operatingSystem: 'iOS, Android',
    description, url: `${base}/${lang}/`,
  };
  return `${head({ lang, title, description, schema })}<body data-locale="${lang}">
${nav(lang)}
<main id="hovedinnhold">
<header class="hero locale-home-hero" data-section="hero">
  <div><p class="eyebrow hero-eyebrow">${sv ? 'Receptapp för Sverige' : 'Opskriftsapp til Danmark'}</p>
  <h1 class="disp">${sv ? 'Recepten du sparar,<br><span class="it">klara för vardagen.</span>' : 'Dine opskrifter,<br><span class="it">klar til hverdagen.</span>'}</h1></div>
  <div class="hero-side"><p class="lead">${description}</p>${storeButtons(lang)}</div>
</header>
<section class="manifesto" id="funktioner" data-section="overview">
  <div><p class="eyebrow">${sv ? 'Ett lugnare kök' : 'Et roligere køkken'}</p><h2 class="disp">${sv ? 'Från inspiration till <em>middag</em>.' : 'Fra inspiration til <em>aftensmad</em>.'}</h2>
  <p class="answer">${sv ? 'Importera recept från webben, Instagram, TikTok eller ett foto. Ordna dem i mappar och hitta tillbaka när det är dags att laga mat.' : 'Importér opskrifter fra nettet, Instagram, TikTok eller et foto. Saml dem i mapper, og find dem igen, når det er tid til at lave mad.'}</p></div>
  <div class="steps">
    <div class="step"><div class="n">01</div><div><div class="h">${sv ? 'Samla recepten' : 'Saml opskrifterne'}</div><div class="d">${sv ? 'Källan följer med när ett recept importeras.' : 'Kilden følger med, når en opskrift importeres.'}</div></div></div>
    <div class="step"><div class="n">02</div><div><div class="h">${sv ? 'Planera själv' : 'Planlæg selv'}</div><div class="d">${sv ? 'Välj recept till veckans dagar. Matlyst fyller inte veckan åt dig.' : 'Vælg opskrifter til ugens dage. Matlyst udfylder ikke ugen for dig.'}</div></div></div>
    <div class="step"><div class="n">03</div><div><div class="h">${sv ? 'Handla med överblick' : 'Køb ind med overblik'}</div><div class="d">${sv ? 'Skicka ingredienser från recepten till inköpslistan.' : 'Send ingredienser fra opskrifterne til indkøbslisten.'}</div></div></div>
  </div>
</section>
<section class="locale-grid" aria-label="${c.features}">
  ${[
    sv ? ['Importera recept','Länk, video eller foto blir ett recept du kan använda.','importera-recept/'] : ['Importér opskrifter','Link, video eller foto bliver til en opskrift, du kan bruge.','importer-opskrifter/'],
    sv ? ['Veckomeny','Lägg egna recept på de dagar som passar.','veckomeny-app/'] : ['Madplan og Ugemenu','Læg dine egne opskrifter på de dage, der passer.','madplan-app/'],
    sv ? ['Inköpslista','Samla ingredienser och egna varor på samma lista.','inkopslista/'] : ['Indkøbsliste','Saml ingredienser og egne varer på den samme liste.','indkoebsliste-app/'],
    sv ? ['Fråga Matlyst','Fråga om receptet eller anpassa en rätt.','vad-ska-jag-laga/'] : ['Spørg Matlyst','Spørg til opskriften, eller tilpas en ret.','middagsforslag/'],
  ].map(([h,p,u]) => `<article class="locale-card"><h2 class="disp">${h}</h2><p>${p}</p><a class="more" href="/${lang}/${u}">${sv ? 'Läs mer' : 'Læs mere'} →</a></article>`).join('')}
</section>
<section class="house" data-section="household"><img src="/images/life/life-household-1400.webp" width="1408" height="3050" alt="${sv ? 'Två personer planerar mat tillsammans' : 'To personer planlægger mad sammen'}" loading="lazy"><div class="house-text"><p class="eyebrow">${sv ? 'Hushåll med Pro' : 'Husstand med Pro'}</p><h2 class="disp">${sv ? 'Samma plan,<br><em>för hela hushållet.</em>' : 'Den samme plan,<br><em>for hele husstanden.</em>'}</h2><p>${sv ? 'Med Matlyst Pro kan ett hushåll dela recept, veckomeny, inköpslista och skafferi.' : 'Med Matlyst Pro kan en husstand dele opskrifter, Ugemenu, indkøbsliste og spisekammer.'}</p></div></section>
<section class="cta"><p class="eyebrow">Matlyst</p><h2 class="disp">${sv ? 'Ditt kök.<br><em>Dina recept.</em>' : 'Dit køkken.<br><em>Dine opskrifter.</em>'}</h2><p>${sv ? '5,0 i norska App Store den 5 oktober 2026, baserat på 12 betyg.' : '5,0 i den norske App Store den 5. oktober 2026, baseret på 12 vurderinger.'}</p>${storeButtons(lang)}<div class="wordmark" aria-hidden="true">Mat<em>lyst</em></div></section>
</main>${footer(lang)}<script src="/site.js" defer></script></body></html>`;
}

const legal = {
  sv: {
    terms: {
      path:'villkor/', counterpart:'vilkaar/', nb:'/vilkar.html', title:'Användarvillkor | Matlyst', h1:'Användarvillkor',
      intro:'Villkoren gäller när du använder Matlyst. Tjänsten drivs av Matlyst i Norge. Kontakta oss på hei@matlyst-app.no om något är oklart.',
      sections:[
        ['1. Användning av tjänsten','Du ansvarar för att uppgifterna i kontot är riktiga och för aktiviteten på kontot. Matlyst får inte användas olagligt, för att göra intrång i andras rättigheter eller för att försöka kringgå säkerheten.'],
        ['2. Ålder, samtycke och AI','Vissa funktioner kräver åldersbekräftelse och ett separat samtycke innan innehåll skickas till en AI-leverantör. Du kan använda övriga delar av appen utan detta samtycke.'],
        ['3. Innehåll och rättigheter','Du behåller rättigheterna till recepten och annat innehåll du lägger in. Du ger Matlyst den begränsade rätt som behövs för att lagra, visa, bearbeta och säkerhetskopiera innehållet åt dig.'],
        ['4. Upphovsrätt och borttagning','Importera bara innehåll som du har rätt att använda. Rättighetshavare kan kontakta hei@matlyst-app.no. Vi kan stoppa import från en källa eller ta bort innehåll när det krävs.'],
        ['5. Abonnemang och betalning','Matlyst Pro köps och förnyas genom App Store eller Google Play. Pris, period, provperiod och nästa debitering visas i butiken före köp. Uppsägning och återbetalning hanteras enligt butikens villkor och tvingande konsumenträtt.'],
        ['6. Ansvar','Matlyst hjälper till med planering och matlagning men ersätter inte professionell rådgivning. Kontrollera allergener, hållbarhet och säker tillagning själv. Vi ansvarar inte för indirekt skada utöver vad tvingande lag kräver.'],
        ['7. Ändringar och avslut','Vi kan ändra tjänsten och villkoren. Väsentliga ändringar meddelas i appen eller via e-post. Du kan sluta använda tjänsten och radera kontot när som helst.'],
        ['8. Lag och klagomål','Norsk lag gäller i den utsträckning tvingande svensk konsumenträtt inte ger dig ett starkare skydd. Kontakta oss först. Om vi inte kommer överens kan du vända dig till Allmänna reklamationsnämnden (ARN) eller Konsument Europa.'],
      ],
    },
    privacy: {
      path:'integritet/', counterpart:'privatliv/', nb:'/personvern.html', title:'Integritetspolicy | Matlyst', h1:'Integritetspolicy',
      intro:'Matlyst är personuppgiftsansvarig för uppgifterna i tjänsten. Här beskriver vi vad vi behandlar, varför och vilka val du har.',
      sections:[
        ['Tre löften','Vi säljer inte dina personuppgifter. Recept används inte för att träna allmänna AI-modeller. Analys på webbplatsen och i appen kräver samtycke.'],
        ['Uppgifter vi behandlar','Vi behandlar konto och inloggning, profil och inställningar, recept och bilder, veckomeny, inköpslista, skafferi, feedback, tekniska loggar och de uppgifter du aktivt skickar till import eller Fråga Matlyst. Matlogg och kalorimål behandlas bara med uttryckligt samtycke.'],
        ['Ändamål och rättslig grund','Avtalet används för konto, synkronisering, import och funktionerna du begär. Berättigat intresse används för säkerhet och nödvändig felsökning. Samtycke används för analys, marknadsföring och känsliga hälsouppgifter. Rättslig förpliktelse används där lag kräver det.'],
        ['AI-behandling','När du har godkänt AI-funktionen skickas det innehåll som behövs för din begäran till den leverantör som visas i samtycket. Vi använder inte recept eller frågor för att träna allmänna modeller. Du kan återkalla samtycket i inställningarna.'],
        ['Webbplats och lokal lagring','Webbplatsen använder nödvändig lokal lagring för språkvalet matlyst-sprak. Analys och marknadsföringsmätning startar först efter samtycke. Nyhetsbrevsformuläret och dess robotkontroll laddas först när du använder fältet.'],
        ['Leverantörer och överföring','Supabase lagrar konto och innehåll i EU. PostHog och Sentry används i EU. RevenueCat, Apple och Google hanterar köp. Anthropic eller Google kan behandla AI-begäran enligt samtycket. EmailOctopus hanterar nyhetsbrev. Överföring utanför EES använder adekvansbeslut, Data Privacy Framework eller standardavtalsklausuler där det är tillämpligt.'],
        ['Lagring och radering','Konto och innehåll lagras tills du raderar kontot. Tekniska felsökningsloggar raderas efter 90 dagar och Sentry-rapporter efter 30 dagar. Push-token raderas vid utloggning eller kontoradering. Samtycke till analys kan återkallas när som helst.'],
        ['Dina rättigheter','Du kan begära tillgång, rättelse, radering, begränsning, dataportabilitet och invända mot viss behandling. Kontakta hei@matlyst-app.no. Du kan också klaga hos Integritetsskyddsmyndigheten (IMY).'],
        ['Ålder och samtycke','I Sverige är åldersgränsen 13 år för att själv samtycka till de digitala funktioner som kräver samtycke. Vi lagrar bekräftat land, åldersgräns och tidpunkt, inte födelsedatum för detta ändamål.'],
      ],
    },
    delete: {
      path:'radera-konto/', counterpart:'slet-konto/', nb:'/slett-konto.html', title:'Radera konto | Matlyst', h1:'Radera ditt konto',
      intro:'Du kan radera Matlyst-kontot och innehållet permanent. Ett abonnemang måste sägas upp separat i App Store eller Google Play.',
      sections:[
        ['Radera i appen','Öppna Matlyst, gå till Inställningar och välj Radera konto. Bekräfta åtgärden. Kontot och innehållet raderas och du loggas ut.'],
        ['Om du inte kommer in','Mejla hei@matlyst-app.no från adressen som hör till kontot. Vi verifierar identiteten och behandlar begäran inom 30 dagar.'],
        ['Det som raderas','Konto, profil, recept, mappar, bilder, anteckningar, veckomeny, inköpslista, skafferi, hushållsmedlemskap, feedback och push-token raderas. Krypterade säkerhetskopior löper ut inom 30 dagar.'],
      ],
    },
  },
  da: {
    terms: {
      path:'vilkaar/', counterpart:'villkor/', nb:'/vilkar.html', title:'Brugervilkår | Matlyst', h1:'Brugervilkår',
      intro:'Vilkårene gælder, når du bruger Matlyst. Tjenesten drives af Matlyst i Norge. Skriv til hei@matlyst-app.no, hvis noget er uklart.',
      sections:[
        ['1. Brug af tjenesten','Du er ansvarlig for, at oplysningerne på kontoen er korrekte, og for aktiviteten på kontoen. Matlyst må ikke bruges ulovligt, til at krænke andres rettigheder eller til at omgå sikkerheden.'],
        ['2. Alder, samtykke og AI','Nogle funktioner kræver aldersbekræftelse og et særskilt samtykke, før indhold sendes til en AI-leverandør. Du kan bruge resten af appen uden dette samtykke.'],
        ['3. Indhold og rettigheder','Du beholder rettighederne til opskrifter og andet indhold, du lægger ind. Du giver Matlyst den begrænsede ret, der er nødvendig for at lagre, vise, behandle og sikkerhedskopiere indholdet for dig.'],
        ['4. Ophavsret og fjernelse','Importér kun indhold, du har ret til at bruge. Rettighedshavere kan kontakte hei@matlyst-app.no. Vi kan stoppe import fra en kilde eller fjerne indhold, når det er nødvendigt.'],
        ['5. Abonnement og betaling','Matlyst Pro købes og fornyes gennem App Store eller Google Play. Pris, periode, prøveperiode og næste træk vises i butikken før køb. Opsigelse og tilbagebetaling følger butikkens vilkår og ufravigelig forbrugerret.'],
        ['6. Ansvar','Matlyst hjælper med planlægning og madlavning, men erstatter ikke professionel rådgivning. Kontrollér selv allergener, holdbarhed og sikker tilberedning. Vi hæfter ikke for indirekte tab ud over, hvad ufravigelig lov kræver.'],
        ['7. Ændringer og ophør','Vi kan ændre tjenesten og vilkårene. Væsentlige ændringer meddeles i appen eller via e-mail. Du kan stoppe med at bruge tjenesten og slette kontoen når som helst.'],
        ['8. Lovvalg og klage','Norsk ret gælder, i det omfang ufravigelig dansk forbrugerret ikke giver dig bedre beskyttelse. Kontakt os først. Hvis vi ikke finder en løsning, kan du bruge klageportalen hos Nævnenes Hus eller få vejledning hos Forbrug.dk og Forbruger Europa.'],
      ],
    },
    privacy: {
      path:'privatliv/', counterpart:'integritet/', nb:'/personvern.html', title:'Privatlivspolitik | Matlyst', h1:'Privatlivspolitik',
      intro:'Matlyst er dataansvarlig for oplysningerne i tjenesten. Her beskriver vi, hvad vi behandler, hvorfor og hvilke valg du har.',
      sections:[
        ['Tre løfter','Vi sælger ikke dine personoplysninger. Opskrifter bruges ikke til at træne generelle AI-modeller. Analyse på hjemmesiden og i appen kræver samtykke.'],
        ['Oplysninger, vi behandler','Vi behandler konto og login, profil og indstillinger, opskrifter og billeder, Ugemenu, indkøbsliste, spisekammer, feedback, tekniske logge og de oplysninger, du aktivt sender til import eller Spørg Matlyst. Madlog og kaloriemål behandles kun med udtrykkeligt samtykke.'],
        ['Formål og retsgrundlag','Aftalen bruges til konto, synkronisering, import og de funktioner, du beder om. Legitim interesse bruges til sikkerhed og nødvendig fejlfinding. Samtykke bruges til analyse, markedsføring og følsomme helbredsoplysninger. Retlig forpligtelse bruges, hvor loven kræver det.'],
        ['AI-behandling','Når du har godkendt AI-funktionen, sendes det indhold, der er nødvendigt for din anmodning, til den leverandør, som står i samtykket. Vi bruger ikke opskrifter eller spørgsmål til at træne generelle modeller. Du kan trække samtykket tilbage i indstillingerne.'],
        ['Hjemmesiden og lokal lagring','Hjemmesiden bruger nødvendig lokal lagring til sprogvalget matlyst-sprak. Analyse og markedsføringsmåling starter først efter samtykke. Nyhedsbrevsformularen og dens robotkontrol indlæses først, når du bruger feltet.'],
        ['Leverandører og overførsel','Supabase lagrer konto og indhold i EU. PostHog og Sentry bruges i EU. RevenueCat, Apple og Google håndterer køb. Anthropic eller Google kan behandle AI-anmodninger efter samtykke. EmailOctopus håndterer nyhedsbrev. Overførsel uden for EØS bruger en tilstrækkelighedsafgørelse, Data Privacy Framework eller standardkontraktbestemmelser, hvor det er relevant.'],
        ['Opbevaring og sletning','Konto og indhold opbevares, til du sletter kontoen. Tekniske fejlfindingslogge slettes efter 90 dage og Sentry-rapporter efter 30 dage. Push-token slettes ved logout eller kontosletning. Samtykke til analyse kan trækkes tilbage når som helst.'],
        ['Dine rettigheder','Du kan bede om indsigt, rettelse, sletning, begrænsning, dataportabilitet og gøre indsigelse mod visse behandlinger. Skriv til hei@matlyst-app.no. Du kan også klage til Datatilsynet.'],
        ['Alder og samtykke','I Danmark er aldersgrænsen 15 år for selv at give samtykke til de digitale funktioner, der kræver samtykke. Vi gemmer bekræftet land, aldersgrænse og tidspunkt, ikke fødselsdato til dette formål.'],
      ],
    },
    delete: {
      path:'slet-konto/', counterpart:'radera-konto/', nb:'/slett-konto.html', title:'Slet konto | Matlyst', h1:'Slet din konto',
      intro:'Du kan slette Matlyst-kontoen og indholdet permanent. Et abonnement skal opsiges særskilt i App Store eller Google Play.',
      sections:[
        ['Slet i appen','Åbn Matlyst, gå til Indstillinger, og vælg Slet konto. Bekræft handlingen. Kontoen og indholdet slettes, og du logges ud.'],
        ['Hvis du ikke kan logge ind','Skriv til hei@matlyst-app.no fra den adresse, der hører til kontoen. Vi bekræfter din identitet og behandler anmodningen inden 30 dage.'],
        ['Det, der slettes','Konto, profil, opskrifter, mapper, billeder, noter, Ugemenu, indkøbsliste, spisekammer, husstandsmedlemskab, feedback og push-token slettes. Krypterede sikkerhedskopier udløber inden 30 dage.'],
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
  return `${head({lang,path:d.path,counterpart:d.counterpart,title:d.title,description,nb:d.nb,schema:breadcrumb})}<body data-locale="${lang}">
${nav(lang,d.path)}
<main id="hovedinnhold" class="legal-doc">
<header><p class="eyebrow">${common[lang].legal}</p><h1 class="disp">${d.h1}</h1><p class="lead">${d.intro}</p><p class="legal-updated">${lang === 'sv' ? 'Senast uppdaterad' : 'Senest opdateret'} 5 oktober 2026</p></header>
${d.sections.map(([h,p])=>`<section><h2>${h}</h2><p>${p}</p></section>`).join('\n')}
<section class="legal-callout"><h2>${lang === 'sv' ? 'Kontakt' : 'Kontakt'}</h2><p>${lang === 'sv' ? 'Frågor och begäran skickas till' : 'Spørgsmål og anmodninger sendes til'} <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>.</p></section>
</main>${footer(lang)}</body></html>`;
}

function write(path, content) {
  const file = fileURLToPath(new URL(path, import.meta.url));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

for (const lang of ['sv','da']) {
  write(`../${lang}/index.html`, home(lang));
  for (const key of ['terms','privacy','delete']) {
    const d = legal[lang][key];
    write(`../${lang}/${d.path}index.html`, legalPage(lang,key));
  }
}
