// Byggeklosser for lange engelske sider: svar-boks, innholdsfortegnelse, scenarier,
// skjermbilder med alt-tekst og dimensjoner, og korte animasjoner med plakat.
// Alt-tekst og mål kommer fra seo-data/bilder-en.json (laget fra de ferdige webbildene).
import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync(new URL('../images/en-guide/bilder.json', import.meta.url), 'utf8'));
const MAPPE = '/images/en-guide';

const perBase = new Map();
for (const verdi of Object.values(manifest)) {
  if (!verdi.files) continue;
  for (const f of Object.values(verdi.files)) {
    const base = f.file.replace(/-(400|800)\.webp$/u, '');
    perBase.set(base, { alt: verdi.alt, w400: verdi.files['400'], w800: verdi.files['800'] });
  }
}

export const ETIKETTER = {
  en: { toc: 'On this page', rader: ['Situation', 'What goes wrong', 'What to do', 'The numbers', 'In Matlyst'],
    notat: 'Scenarios marked “Say you …” are examples we made up to show how it works. They are not customer stories.',
    illustrasjon: 'A simplified illustration, not a screen recording.' },
  nb: { toc: 'På denne siden', rader: ['Situasjon', 'Hva som går galt', 'Hva du gjør', 'Tallene', 'I Matlyst'],
    notat: 'Scenarioer som begynner med «Tenk deg at du …» er eksempler vi har laget for å vise hvordan det fungerer. De er ikke kundehistorier.',
    illustrasjon: 'En forenklet illustrasjon, ikke et skjermopptak.' },
  sv: { toc: 'På den här sidan', rader: ['Situation', 'Vad som går fel', 'Vad du gör', 'Siffrorna', 'I Matlyst'],
    notat: 'Scenarier som börjar med ”Säg att du …” är exempel vi har hittat på för att visa hur det fungerar. De är inte kundberättelser.',
    illustrasjon: 'En förenklad illustration, inte en skärminspelning.' },
  da: { toc: 'På denne side', rader: ['Situation', 'Hvad der går galt', 'Hvad du gør', 'Tallene', 'I Matlyst'],
    notat: 'Scenarier, der begynder med ”Sig, at du …”, er eksempler, vi selv har fundet på for at vise, hvordan det fungerer. De er ikke kundehistorier.',
    illustrasjon: 'En forenklet illustration, ikke en skærmoptagelse.' },
};

const esc = (s) => s.replace(/&/gu, '&amp;').replace(/"/gu, '&quot;').replace(/</gu, '&lt;');

export function skjerm(base, bildetekst) {
  const b = perBase.get(base);
  if (!b) throw new Error(`Mangler skjermbilde i manifestet: ${base}`);
  const { w400, w800 } = b;
  return `<figure><img src="${MAPPE}/${w400.file}" srcset="${MAPPE}/${w400.file} 400w, ${MAPPE}/${w800.file} 800w" sizes="(min-width: 760px) 220px, 60vw" width="${w400.width}" height="${w400.height}" loading="lazy" decoding="async" alt="${esc(b.alt)}">${bildetekst ? `<figcaption>${bildetekst}</figcaption>` : ''}</figure>`;
}

export function telefoner(...figurer) {
  return `<div class="phones">${figurer.join('')}</div>`;
}

// Animasjon: stum løkke med plakatbilde. Teksten under er tekstalternativet.
export function animasjon({ fil, plakat, bredde, hoyde, tekst, bildetekst }) {
  return `<div class="phones"><figure><video controls muted loop playsinline preload="none" poster="${MAPPE}/${plakat}" width="${bredde}" height="${hoyde}" aria-label="${esc(tekst)}" data-autoplay><source src="${MAPPE}/${fil}" type="video/mp4"></video><figcaption>${bildetekst ?? tekst}</figcaption></figure></div>`;
}

export const svar = (tekst) => `<div class="answer"><p>${tekst}</p></div>`;

export function scenario(tittel, { situasjon, galt, gjor, tall, matlyst }, lang = 'en') {
  const [a, b, c, d, e] = ETIKETTER[lang].rader;
  const rader = [[a, situasjon], [b, galt], [c, gjor], tall ? [d, tall] : null, [e, matlyst]].filter(Boolean);
  return `<div class="scenario"><h3>${tittel}</h3><dl>${rader.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`;
}

export const scenarioNotat = (lang = 'en') => `<p class="scenario-note">${ETIKETTER[lang].notat}</p>`;

export function founder(avsnitt, signatur) {
  return `<div class="founder">${avsnitt.map((p) => `<p>${p}</p>`).join('')}<p class="by">${signatur}</p></div>`;
}

const TEGN = { å: 'a', ä: 'a', æ: 'ae', ø: 'o', ö: 'o', é: 'e', è: 'e' };
const slugg = (tekst) => tekst.toLowerCase().replace(/&[a-z]+;/gu, '').replace(/[åäæøöéè]/gu, (c) => TEGN[c]).replace(/[^a-z0-9]+/gu, '-').replace(/^-|-$/gu, '');

// rik: [[h2, html], ...]. Gir prose-HTML med id på hver H2 og en innholdsfortegnelse.
export function byggRik({ svarTekst, seksjoner, ekstra = [], lang = 'en' }) {
  const alle = ekstra.length ? [...seksjoner.slice(0, -1), ...ekstra, seksjoner[seksjoner.length - 1]] : seksjoner;
  const med = alle.map(([h, body]) => ({ h, id: slugg(h), body }));
  const toc = `<div class="toc" role="navigation" aria-label="${ETIKETTER[lang].toc}"><div class="toc-title">${ETIKETTER[lang].toc}</div><ol>${med.map(({ h, id }) => `<li><a href="#${id}">${h}</a></li>`).join('')}</ol></div>`;
  const innhold = med.map(({ h, id, body }) => `<h2 id="${id}">${h}</h2>${body}`).join('\n');
  return { toc, html: `${svar(svarTekst)}\n${toc}\n${innhold}` };
}

// Lesedel uten svarboks og innholdsfortegnelse, for sider som har kalkulatorkortet og det korte svaret i `topp`.
// Samme slugg og samme H2-form som byggRik. rik: [[h2, html], ...].
export function byggLese({ seksjoner }) {
  return seksjoner.map(([h, body]) => `<h2 id="${slugg(h)}">${h}</h2>${body}`).join('\n');
}

// Veiledningsillustrasjon (egen grafikk, fiktivt eksempel) med lokal video og plakat. Filene ligger i /images/en-guide/<lang>/ for nordiske språk.
export function illustrasjon(lang, fil, tekst) {
  const mappe = lang === 'en' ? '' : `${lang}/`;
  return animasjon({ fil: `${mappe}matlyst-${fil}.mp4`, plakat: `${mappe}matlyst-${fil}-poster.webp`, bredde: 540, hoyde: 960, tekst, bildetekst: `${tekst} ${ETIKETTER[lang].illustrasjon}` });
}
