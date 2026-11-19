import { writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEKST } from './forside-tekst.mjs';
import { topp, hylledel, morkBunn, nedlasting, samtykke, sprakvelger } from './skall.mjs';
import { organisasjonSkjema } from './app-uttrykk.mjs';

// Språkets adresse, dokumenthode, film og kalender samles her.
const SPRAK = {
  nb: { adresse: '/', lang: 'no', film: '/images/forside/film/import-nb.mp4', plakat: '/images/forside/film/import-nb-plakat.webp', forsteUkedag: 1, hode: `
<meta charset="UTF-8">
<meta http-equiv="content-language" content="nb-NO">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="facebook-domain-verification" content="n8gdqjhrbrimaux8ejsfmkyzo7zwhw" />
<title>Matlyst: oppskriftsappen for iPhone og Android</title>
<meta name="description" content="Oppskriftsappen som oversetter og tilpasser oppskriftene dine. Importer fra en lenke, en video eller et bilde, også av håndskrevne oppskrifter. Planlegg uka og send ukas ingredienser til handlelista. Ingen reklame, ingen salg av data. Gratis å prøve på App Store og Google Play.">
<link rel="canonical" href="https://matlyst-app.no/">
<link rel="alternate" hreflang="nb-NO" href="https://matlyst-app.no/">
<link rel="alternate" hreflang="sv-SE" href="https://matlyst-app.no/sv/">
<link rel="alternate" hreflang="da-DK" href="https://matlyst-app.no/da/">
<link rel="alternate" hreflang="en" href="https://matlyst-app.no/en/">
<link rel="alternate" hreflang="x-default" href="https://matlyst-app.no/en/">
<script src="/locale.js" defer></script>
<meta name="theme-color" content="#FFFFFF">
<meta name="apple-itunes-app" content="app-id=6762563515">
<meta property="og:title" content="Matlyst: oppskriftsappen for iPhone og Android">
<meta property="og:description" content="Oppskriftsappen som oversetter og tilpasser oppskriftene dine. Importer fra en lenke, en video eller et bilde, også av håndskrevne oppskrifter. Planlegg uka og send ukas ingredienser til handlelista. Gratis å prøve.">
<meta property="og:image" content="https://matlyst-app.no/images/og.jpg">
<meta property="og:url" content="https://matlyst-app.no/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Matlyst">
<meta property="og:locale" content="nb_NO">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Matlyst: oppskriftsappen for iPhone og Android">
<meta name="twitter:description" content="Oppskriftsappen som oversetter og tilpasser oppskriftene dine. Importer fra en lenke, en video eller et bilde, også av håndskrevne oppskrifter. Planlegg uka og send ukas ingredienser til handlelista.">
<meta name="twitter:image" content="https://matlyst-app.no/images/og.jpg">
<link rel="icon" type="image/png" href="images/icon.png">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  "name": "Matlyst",
  "operatingSystem": "iOS, Android",
  "applicationCategory": "LifestyleApplication",
  "url": "https://matlyst-app.no/",
  "downloadUrl": ["https://apps.apple.com/no/app/matlyst/id6762563515", "https://play.google.com/store/apps/details?id=app.matlyst"],
  "description": "Oppskriftsappen som oversetter og tilpasser oppskriftene dine. Importer fra en lenke, en video eller et bilde, også av håndskrevne oppskrifter. Planlegg uka og send ukas ingredienser til handlelista.",
  "inLanguage": "nb-NO",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "NOK" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "ratingCount": "12", "bestRating": "5" },
  "publisher": { "@type": "Organization", "name": "Matlyst", "url": "https://matlyst-app.no/", "sameAs": ["https://apps.apple.com/no/app/matlyst/id6762563515", "https://play.google.com/store/apps/details?id=app.matlyst", "https://www.instagram.com/matlyst_app", "https://www.tiktok.com/@matlyst.appen"] },
  "author": { "@type": "Person", "name": "Patrick Kabia" },
  "dateModified": "2026-09-01"
}
</script>
<script>document.documentElement.className += ' js'; setTimeout(function () { document.querySelector('.hero h1')?.classList.add('klar'); }, 1500);</script>
<link rel="stylesheet" href="/tokens.css">
<link rel="stylesheet" href="/skall.css">
<link rel="stylesheet" href="/forside.css">
<link rel="stylesheet" href="/language-switcher.css">
<script src="/language-switcher.js" defer></script>
<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
<script src="/site.js" defer></script>
<script src="/skall.js" defer></script>
<script src="/forside.js" defer></script>
` },
};
const sider = { nb: '/', sv: '/sv/', da: '/da/', en: '/en/' };
const skjerm = (verdi) => String(verdi).replace(/[&<>"']/g, (tegn) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[tegn]);

// Proxyen følger nøkkelstien også gjennom lister og nøstede tekstgrupper.
function lesTekst(verdi, sti) {
  if (verdi === undefined) throw new Error(`Mangler tekst: ${sti}`);
  if (verdi === null || typeof verdi !== 'object') return verdi;
  return new Proxy(verdi, { get(objekt, nokkel) {
    return lesTekst(Reflect.get(objekt, nokkel), `${sti}.${String(nokkel)}`);
  } });
}

function hode(sprak, oppsett) {
  const butikklenker = JSON.parse(oppsett.hode.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]).downloadUrl;
  return `<head>${oppsett.hode}${organisasjonSkjema(sprak, { ios: butikklenker[0], play: butikklenker[1] })}
</head>`;
}

const IKONER = {
  "instagram": "<svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077\"></path></svg>",
  "tiktok": "<svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z\"></path></svg>",
  "youtube": "<svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z\"></path></svg>",
  "facebook": "<svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z\"></path></svg>",
  "nettsider": "<svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"M3 12h18M12 3c2.6 2.8 2.6 15.2 0 18M12 3c-2.6 2.8-2.6 15.2 0 18\"></path></svg>",
  "matblogger": "<svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"3\"></rect><path d=\"M8 8h8M8 12h8M8 16h5\"></path></svg>",
  "bildegalleri": "<svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"></rect><circle cx=\"8.5\" cy=\"9.5\" r=\"1.6\"></circle><path d=\"M21 15.5l-4.6-4.6a1.5 1.5 0 0 0-2.1 0L5.6 19.6\"></path></svg>",
  "kokeboker": "<svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 6.5C10.2 5 7.6 4.5 4 4.5v13c3.6 0 6.2.5 8 2 1.8-1.5 4.4-2 8-2v-13c-3.6 0-6.2.5-8 2zM12 6.5v13\"></path></svg>"
};
const stjerne = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z"></path></svg>';
const hake = '<svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5.5 5.5L20 7"></path></svg>';

function helt(t, oppsett) {
  const vurdering = t.vurdering;
  const bevis = vurdering === '' ? '' : `<div class="bevis"><span class="stjerner" aria-hidden="true">${stjerne.repeat(5)}</span><span>${skjerm(vurdering).replace(/^(\S+)/, '<b>$1</b>')}</span></div>`;
  return `<section class="hero ramme">
    <h1>${skjerm(t.h1)}</h1>
    <p class="lead">${skjerm(t.ingress)}</p>
    <div class="valg"><a class="knapp" href="/app" data-hent="helt">${skjerm(t.knapp)}</a></div>
    ${bevis}
    <div class="spiller importflyt">
      <ol class="steg" aria-label="${skjerm(t.stegAria)}">
        ${t.steg.map((steg, i) => `<li${i === 0 ? ' class="naa"' : ''}><button type="button" class="st" data-t="${t.stegtider[i]}"${i === 0 ? ' aria-current="step"' : ''}><b>${i === t.steg.length - 1 ? hake : i + 1}</b><span>${skjerm(steg)}</span></button></li>`).join('\n        ')}
      </ol>
      <div class="film" id="lagre"><video src="${oppsett.film}" width="628" height="1300" poster="${oppsett.plakat}" muted playsinline loop preload="metadata" aria-label="${skjerm(t.filmAria)}"></video></div>
    </div>
    ${kilder(t)}
  </section>`;
}

function kilder(t) {
  const liste = t.kilder.map((kilde) => `<li>${IKONER[kilde.ikon]}<span>${skjerm(kilde.navn)}</span></li>`).join('');
  return `<div class="kilder"><p class="kildetittel">${skjerm(t.kildetittel)}</p><div class="band" id="band" role="group" aria-label="${skjerm(t.kilderAria)}"><div class="bane">${Array.from({ length: 4 }, (_, i) => `<ul${i ? ' aria-hidden="true"' : ''}>${liste}</ul>`).join('')}</div></div></div>`;
}

// Disse seksjonene fylles i oppgave 7 og 8.
function kokebok() { return ''; }
function spor() { return ''; }
function middag() { return ''; }
function pris() { return ''; }
function svar() { return ''; }

export function forside(sprak) {
  if (!Object.hasOwn(TEKST, sprak) || !Object.hasOwn(SPRAK, sprak)) throw new RangeError(`Mangler forside for språk: ${sprak}`);
  const t = lesTekst(TEKST[sprak], sprak), oppsett = SPRAK[sprak];
  const adresser = { ...sider, [sprak]: oppsett.adresse };
  return `<!DOCTYPE html>
<html lang="${oppsett.lang}">
${hode(sprak, oppsett)}
<body data-app-uttrykk="1">
<div class="side"><div class="kort"><div class="blad">
${topp(sprak, { folg: t.folg.lenker.map((lenke) => ({ href: '#' + lenke.mal, tekst: lenke.tekst })), sprakvelger: sprakvelger(sprak, 'topp', adresser) })}
<main id="hovedinnhold">
${helt(t, oppsett)}${kokebok(t)}${spor(t)}${middag(t, oppsett)}${pris(t)}${svar(t)}
</main></div>
${hylledel(sprak)}</div>
${morkBunn(sprak, { sprakvelger: sprakvelger(sprak, 'bunn', adresser) })}
${nedlasting(sprak)}
${samtykke(sprak)}
</div>
</body>
</html>
`;
}

export function kjor(rot) {
  writeFileSync(join(rot, 'index.html'), forside('nb'));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  kjor(fileURLToPath(new URL('..', import.meta.url)));
}
