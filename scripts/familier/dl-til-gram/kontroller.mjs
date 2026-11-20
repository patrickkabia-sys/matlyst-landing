// Kontrollerer data.nb.json mot Matvaretabellen. Skriver aldri over et tall som avviker.
// Bruk: node scripts/familier/dl-til-gram/kontroller.mjs [--fil <foods.json>] [--dato ÅÅÅÅ-MM-DD]
// Uten avvik settes status «kontrollert», `kontrollert` og `hentet` på Matvaretabellen-kilden. Med avvik skrives lista,
// ingenting endres, og skriptet avslutter med kode 1. Uten --fil hentes API-et direkte.
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { validerData } from '../felles.mjs';
import { DATAFIL, arg, dlFraMatvare, finnMatvare, lesFoods } from './hent.mjs';

/** Rader der dl-tallet i fila er et annet enn kildens. Rader uten matvare i `foods` meldes av manglerIKilden. */
export function avvik(data, foods) {
  const ut = [];
  for (const rad of data.rader) {
    const dlKilden = dlFraMatvare(finnMatvare(foods, rad.tekst?.matvaretabell));
    if (dlKilden === null) continue;
    if (rad.tall.dl.verdi !== dlKilden) ut.push({ id: rad.id, felt: 'dl', iFila: rad.tall.dl.verdi, iKilden: dlKilden });
  }
  // Andre poster (tekst.andrePoster) som finnes i kilden, skal ha samme vekt som i fila.
  for (const rad of data.rader) {
    for (const [navn, iFila] of JSON.parse(rad.tekst?.andrePoster ?? '[]')) {
      const iKilden = dlFraMatvare(finnMatvare(foods, navn));
      if (iKilden !== null && iKilden !== iFila) ut.push({ id: rad.id, felt: `annen post «${navn}»`, iFila, iKilden });
    }
  }
  return ut;
}

/** Rader der matvaren ikke finnes i kilden, eller ikke har dl-porsjon lenger. */
export function manglerIKilden(data, foods) {
  return data.rader
    .filter((r) => dlFraMatvare(finnMatvare(foods, r.tekst?.matvaretabell)) === null)
    .map((r) => ({ id: r.id, matvaretabell: r.tekst?.matvaretabell }));
}

/** Andre poster i fila (tekst.andrePoster) som ikke finnes i kilden, eller ikke har dl-porsjon lenger. */
export function manglerAndrePoster(data, foods) {
  return data.rader.flatMap((r) => JSON.parse(r.tekst?.andrePoster ?? '[]').filter(([navn]) => dlFraMatvare(finnMatvare(foods, navn)) === null).map(([navn]) => ({ id: r.id, matvaretabell: navn })));
}

/** Ny kopi med alle rader kontrollert på `dato`. Kalles bare når det ikke er avvik. */
export function somKontrollert(data, dato) {
  const ny = structuredClone(data);
  for (const r of ny.rader) {
    r.status = 'kontrollert';
    r.kontrollert = dato;
  }
  ny.kilder.matvaretabellen.hentet = dato;
  return ny;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dato = arg('--dato') ?? new Date().toISOString().slice(0, 10);
  const data = validerData(JSON.parse(readFileSync(DATAFIL, 'utf8')));
  const foods = await lesFoods(arg('--fil'));
  const a = avvik(data, foods);
  const m = [...manglerIKilden(data, foods), ...manglerAndrePoster(data, foods)];
  if (a.length || m.length) {
    for (const x of a) console.log(`AVVIK ${x.id}: ${x.felt} er ${x.iFila} i fila og ${x.iKilden} i kilden`);
    for (const x of m) console.log(`MANGLER ${x.id}: «${x.matvaretabell}» finnes ikke med dl-porsjon i kilden`);
    console.log('Ingenting er endret.');
    process.exit(1);
  }
  writeFileSync(DATAFIL, `${JSON.stringify(validerData(somKontrollert(data, dato)), null, 2)}\n`);
  console.log(`Alle ${data.rader.length} dl-tall stemmer med kilden. Status kontrollert, ${dato}.`);
}
