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

export function scenario(tittel, { situasjon, galt, gjor, tall, matlyst }) {
  const rader = [['Situation', situasjon], ['What goes wrong', galt], ['What to do', gjor], tall ? ['The numbers', tall] : null, ['In Matlyst', matlyst]].filter(Boolean);
  return `<div class="scenario"><h3>${tittel}</h3><dl>${rader.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`;
}

export const scenarioNotat = '<p class="scenario-note">Scenarios marked “Say you …” are examples we made up to show how it works. They are not customer stories.</p>';

export function founder(avsnitt, signatur) {
  return `<div class="founder">${avsnitt.map((p) => `<p>${p}</p>`).join('')}<p class="by">${signatur}</p></div>`;
}

const slugg = (tekst) => tekst.toLowerCase().replace(/&[a-z]+;/gu, '').replace(/[^a-z0-9]+/gu, '-').replace(/^-|-$/gu, '');

// rik: [[h2, html], ...]. Gir prose-HTML med id på hver H2 og en innholdsfortegnelse.
export function byggRik({ svarTekst, seksjoner }) {
  const med = seksjoner.map(([h, body]) => ({ h, id: slugg(h), body }));
  const toc = `<div class="toc" role="navigation" aria-label="On this page"><div class="toc-title">On this page</div><ol>${med.map(({ h, id }) => `<li><a href="#${id}">${h}</a></li>`).join('')}</ol></div>`;
  const innhold = med.map(({ h, id, body }) => `<h2 id="${id}">${h}</h2>${body}`).join('\n');
  return { toc, html: `${svar(svarTekst)}\n${toc}\n${innhold}` };
}
