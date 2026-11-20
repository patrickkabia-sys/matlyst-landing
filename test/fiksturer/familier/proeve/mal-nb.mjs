// Fiksturmal (norsk) for familien «proeve». Oppdiktede varer, ingen ekte tall. Gir ekte sideobjekter til registertestene.
const fmt = (n) => String(n).replace('.', ',');
const tegn = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
const esc = (t) => String(t).replace(/[&<>]/gu, (c) => tegn[c]);
const ROT = 'verktoy/proeve/';

const rik = (svar, seksjoner) => `<div class="answer"><p>${svar}</p></div>\n${seksjoner.map(([h, b]) => `<h2>${esc(h)}</h2>${b}`).join('\n')}`;

export function tillatteTall(rad) {
  const t = Object.values(rad.tall);
  return new Set([...t.map((x) => fmt(x.verdi)), ...t.flatMap((x) => (x.andre ?? []).map((a) => fmt(a.verdi))), '1']);
}

export function navSide(data, rader) {
  const liste = `<ul>${rader.map((r) => `<li><a href="/${ROT}${r.slug}/">${esc(r.navn)}</a></li>`).join('')}</ul>`;
  return {
    title: 'Prøveomregner', description: 'Prøveside for familieregisteret, med oppdiktede varer og tall som ikke finnes i virkeligheten.',
    eyebrow: 'Prøvefamilie', h1: 'Prøveomregneren', lead: 'Samleside for prøvefamilien.', forst: 'Velg en vare.',
    stegTittel: 'Slik bruker du prøveomregneren', steg: [['Velg vare', 'Åpne siden for varen.']],
    alternativ: '', grense: '', seksjoner: [], faqTittel: 'Spørsmål om prøvefamilien', faq: [['Er tallene ekte?', 'Nei, de er oppdiktet.']],
    rik: rik('En samleside for oppdiktede varer.', [['Varene', liste]]), cta: 'Prøv Matlyst',
    publisert: data.rader[0].oppdatert,
    schemas: [{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Prøveomregneren' }],
  };
}

export function sideForRad(rad) {
  const [navn, t] = Object.entries(rad.tall)[0];
  return {
    title: `${rad.navn} i gram`, description: `Prøveside for ${rad.navn.toLowerCase()}, en oppdiktet vare i familieregisteret, med ${navn} og kilde.`,
    eyebrow: 'Prøvefamilie', h1: `${rad.navn} i gram`, lead: `Én dl ${rad.navn.toLowerCase()} veier ${fmt(t.verdi)} ${t.enhet}.`, forst: 'Les av tallet.',
    stegTittel: 'Slik leser du av', steg: [['Les tallet', `Tallet er ${fmt(t.verdi)}.`]],
    alternativ: '', grense: '', seksjoner: [], faqTittel: `Spørsmål om ${rad.navn.toLowerCase()}`, faq: [['Hvor mye veier én dl?', `${fmt(t.verdi)} ${t.enhet}.`]],
    rik: rik(`Én dl veier ${fmt(t.verdi)} ${t.enhet}.`, [['Tallet', `<p>${fmt(t.verdi)} ${t.enhet}.</p>`]]), cta: 'Prøv Matlyst',
    publisert: rad.oppdatert,
    schemas: [{ '@context': 'https://schema.org', '@type': 'WebApplication', name: `${rad.navn} i gram` }],
  };
}
