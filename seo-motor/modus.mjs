const GYLDIGE_MODUSER = new Set(['av', 'utkast', 'på'])
const OSLO_DATOFORMAT = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Oslo' })

export function lesModus({ variabel, sperre }) {
  if (!GYLDIGE_MODUSER.has(variabel)) return 'av'
  if (variabel === 'på' && sperre) return 'utkast'
  return variabel
}

export function osloDato(tid) {
  return OSLO_DATOFORMAT.format(tid)
}

export function kanPublisere(publisert, tid) {
  const dato = osloDato(tid)
  return !publisert.some((innlegg) => innlegg.dato === dato)
}

export function tellAvvisningerPåRad(logg) {
  let antall = 0
  for (let indeks = logg.length - 1; indeks >= 0; indeks -= 1) {
    if (logg[indeks].resultat !== 'avvist') break
    antall += 1
  }
  return antall
}

export function skalSperre(antall) {
  return antall >= 3
}
