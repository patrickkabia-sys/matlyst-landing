import { webApplikasjon } from '../../../../scripts/familier/skjema.mjs';
// Fiksturmal (engelsk) for familien «proeve». Oppdiktede varer, ingen ekte tall.
const fmt = (n) => String(n);
const tegn = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
const esc = (t) => String(t).replace(/[&<>]/gu, (c) => tegn[c]);
const ROT = 'en/tools/proeve/';

const rik = (svar, seksjoner) => `<div class="answer"><p>${svar}</p></div>\n${seksjoner.map(([h, b]) => `<h2>${esc(h)}</h2>${b}`).join('\n')}`;

export function tillatteTall(rad) {
  const t = Object.values(rad.tall);
  return new Set([...t.map((x) => fmt(x.verdi)), ...t.flatMap((x) => (x.andre ?? []).map((a) => fmt(a.verdi))), '1']);
}

export function navSide(data, rader) {
  const liste = `<ul>${rader.map((r) => `<li><a href="/${ROT}${r.slug}/">${esc(r.navn)}</a></li>`).join('')}</ul>`;
  return {
    title: 'Test converter', description: 'A test page for the family register, with made-up ingredients and numbers that do not exist in the real world.',
    eyebrow: 'Test family', h1: 'The test converter', lead: 'Hub page for the test family.', forst: 'Pick an ingredient.',
    stegTittel: 'How to use the test converter', steg: [['Pick an ingredient', 'Open the page for it.']],
    alternativ: '', grense: '', seksjoner: [], faqTittel: 'Questions about the test family', faq: [['Are the numbers real?', 'No, they are made up.']],
    rik: rik('A hub page for made-up ingredients.', [['The ingredients', liste]]), cta: 'Try Matlyst',
    publisert: data.rader[0].oppdatert,
    // Brødsmulene lager guidePage selv; 'faq' lager FAQPage fra synlig FAQ (locale-pages-testen krever at de er like).
    schemas: ['faq', webApplikasjon({ navn: 'The test converter', beskrivelse: 'Test page.', adresse: `/${ROT}`, sprak: 'en' })],
  };
}

export function sideForRad(rad) {
  const [navn, t] = Object.entries(rad.tall)[0];
  return {
    title: `${rad.navn} in grams`, description: `A test page for ${rad.navn.toLowerCase()}, a made-up ingredient in the family register, with ${navn} and its source.`,
    eyebrow: 'Test family', h1: `${rad.navn} in grams`, lead: `One cup of ${rad.navn.toLowerCase()} weighs ${fmt(t.verdi)} ${t.enhet}.`, forst: 'Read off the number.',
    stegTittel: 'How to read it', steg: [['Read the number', `The number is ${fmt(t.verdi)}.`]],
    alternativ: '', grense: '', seksjoner: [], faqTittel: `Questions about ${rad.navn.toLowerCase()}`, faq: [['How much does one cup weigh?', `${fmt(t.verdi)} ${t.enhet}.`]],
    rik: rik(`One cup weighs ${fmt(t.verdi)} ${t.enhet}.`, [['The number', `<p>${fmt(t.verdi)} ${t.enhet}.</p>`], ['About the ingredient', `<p>${esc(rad.tekst?.beskrivelse ?? '')}</p>`]]), cta: 'Try Matlyst',
    publisert: rad.oppdatert,
    schemas: ['faq', webApplikasjon({ navn: `${rad.navn} in grams`, beskrivelse: 'Test page.', adresse: `/${ROT}${rad.slug}/`, sprak: 'en' })],
  };
}
