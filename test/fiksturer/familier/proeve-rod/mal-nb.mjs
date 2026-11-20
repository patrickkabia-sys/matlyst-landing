// Rød fikstur: alle sider har samme tittel og nesten samme tekst, og et tall (137) som ikke står i data.
export const tillatteTall = () => new Set(['55']);
const side = (h1) => ({
  title: 'Samme tittel', description: 'Samme beskrivelse på alle sidene i den røde prøvefamilien.', eyebrow: 'Rød', h1, lead: 'Én dl veier 137 g og det er alt vi har å si om den saken her.',
  forst: 'Les av tallet.', stegTittel: 'Slik', steg: [['Les', 'Les tallet på siden.']], alternativ: '', grense: '', seksjoner: [], faqTittel: 'Spørsmål', faq: [['Hvor mye?', 'Se over.']],
  rik: '<p>Dette er en felles prøvetekst som er helt lik på alle sidene i den røde familien og derfor skal felles av vakten.</p>', cta: 'Prøv', publisert: '2026-11-20', schemas: [{}],
});
export const navSide = () => side('Samleside');
export const sideForRad = (rad) => side(rad.navn);
