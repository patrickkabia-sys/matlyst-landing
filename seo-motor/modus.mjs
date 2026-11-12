const GYLDIGE_MODUSER = new Set(['av', 'utkast', 'på']);
const OSLO_DATOFORMAT = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Oslo' });

export function lesModus({ variabel, sperre }) {
  if (!GYLDIGE_MODUSER.has(variabel)) return 'av';
  if (variabel === 'på' && sperre) return 'utkast';
  return variabel;
}

export function osloDato(tid) {
  return OSLO_DATOFORMAT.format(tid);
}

export function kanPublisere(publisert, tid) {
  const dato = osloDato(tid);
  return !publisert.some((innlegg) => innlegg.dato === dato);
}

export function kanPublisereDenneUken(publisert, tid, maks) {
  const dato = osloDato(tid);
  const kalenderdato = new Date(`${dato}T12:00:00Z`);
  const dagerSidenMandag = (kalenderdato.getUTCDay() + 6) % 7;
  kalenderdato.setUTCDate(kalenderdato.getUTCDate() - dagerSidenMandag);
  const mandag = kalenderdato.toISOString().slice(0, 10);
  const antall = publisert.filter((innlegg) => (
    innlegg.dato >= mandag && innlegg.dato <= dato
  )).length;
  return antall < maks;
}

export function skalSperre(antall) {
  return antall >= 3;
}
