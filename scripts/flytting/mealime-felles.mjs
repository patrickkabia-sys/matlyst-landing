// Mealime-flytteside på nb, sv og da. Følger scripts/en-flytting/mealime.mjs: bare fakta fra mealime.com/closing (lest 2026-11-20) og det som er testet.
// Lenkeimport av to publiserte mealime.com-oppskrifter ble testet 2026-11-20 i den ENGELSKE appen (engelsk QA-konto). Sidene sier det.
// Matlyst har INGEN masseimport fra Mealime og ingen kontokobling. Låst av test/mealime-sprak.test.mjs.
import { byggRik } from '../rik-sider.mjs';

export const PUBLISERT = '2026-11-21';
const p = (...ps) => ps.map((t) => `<p>${t}</p>`).join('');
const ul = (...li) => `<ul>${li.map((t) => `<li>${t}</li>`).join('')}</ul>`;
const ol = (...li) => `<ol>${li.map((t) => `<li>${t}</li>`).join('')}</ol>`;
const h3 = (t) => `<h3>${t}</h3>`;

/** T: tekstene for ett språk. */
export function lagMealime(lang, T) {
  const rik = byggRik({
    lang,
    svarTekst: T.svar,
    seksjoner: [
      [T.h.hva, p(T.hva1) + ul(...T.hvaListe) + p(T.hva2)],
      [T.h.lenke, p(T.lenke1) + ol(...T.lenkeSteg) + p(T.lenke2, T.lenke3)],
      [T.h.kan, p(T.kan1, T.kan2)],
      [T.h.egne, p(T.egne1) + h3(T.egneFoto) + p(T.egneFotoTekst) + h3(T.egneSkriv) + p(T.egneSkrivTekst) + h3(T.egneEksport) + p(T.egneEksportTekst) + p(T.egneKi)],
      [T.h.eksport, p(T.eksport1, T.eksport2)],
      [T.h.uke, p(T.uke1, T.uke2) + h3(T.ukeMeny) + p(T.ukeMenyTekst) + h3(T.ukeListe) + p(T.ukeListeTekst) + h3(T.ukeSpiskammer) + p(T.ukeSpiskammerTekst) + h3(T.ukeKok) + p(T.ukeKokTekst)],
      [T.h.pris, p(T.pris1) + p(T.pris2)],
    ],
  }).html;
  const side = {
    title: T.tittel,
    description: T.beskrivelse,
    eyebrow: T.eyebrow,
    h1: T.h1,
    lead: T.lead,
    publisert: PUBLISERT,
    schemas: ['article', 'faq'],
    forst: T.forst,
    stegTittel: T.stegTittel,
    steg: T.steg,
    alternativ: '',
    grense: '',
    seksjoner: [],
    faqTittel: T.faqTittel,
    rik,
    faq: T.faq,
    cta: T.cta,
  };
  return side;
}
