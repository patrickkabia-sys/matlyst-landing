// Kontrollerer data.en.json mot USDA SR Legacy. Skriver aldri over et tall som avviker.
// Bruk: node scripts/familier/dl-til-gram/kontroller-usda.mjs --fil <SR Legacy-JSON> [--dato ÅÅÅÅ-MM-DD]
// Uten avvik settes status «kontrollert», `kontrollert` og `hentet` på USDA-kilden. Med avvik skrives lista,
// ingenting endres, og skriptet avslutter med kode 1.
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { validerData } from '../felles.mjs';
import { DATAFIL_EN, arg, finnPost, lesSr, porsjonEtikett } from './hent-usda.mjs';

/** Porsjonen i posten som har denne etiketten (modifikator, med mengde foran når den ikke er 1). */
export const porsjonMedEtikett = (post, etikett) => (post?.foodPortions ?? []).find((p) => porsjonEtikett(p) === etikett) ?? null;

/** Tall i fila som er et annet enn kildens, eller der porsjonen (eller postens navn) ikke finnes i kilden. */
export function avvikUsda(data, sr) {
  const ut = [];
  for (const rad of data.rader) {
    const post1 = finnPost(sr, Number(rad.tekst?.fdcId));
    const post2 = rad.tekst?.fdcId2 ? finnPost(sr, Number(rad.tekst.fdcId2)) : null;
    if (!post1) continue; // meldes av manglerUsda
    if (rad.tekst.usdaNavn !== post1.description) ut.push({ id: rad.id, felt: 'usdaNavn', iFila: rad.tekst.usdaNavn, iKilden: post1.description });
    if (rad.tekst.fdcId2 && (!post2 || rad.tekst.usdaNavn2 !== post2.description)) ut.push({ id: rad.id, felt: 'usdaNavn2', iFila: rad.tekst.usdaNavn2, iKilden: post2?.description ?? null });
    for (const [felt, tall] of Object.entries(rad.tall)) {
      const post = felt.startsWith('b_') ? post2 : post1;
      const p = porsjonMedEtikett(post, tall.merknad);
      if (p && p.gramWeight !== tall.verdi) ut.push({ id: rad.id, felt, iFila: tall.verdi, iKilden: p.gramWeight });
      if (!p) ut.push({ id: rad.id, felt, iFila: tall.verdi, iKilden: null });
    }
  }
  return ut;
}

/** Rader der posten ikke finnes i datasettet. */
export function manglerUsda(data, sr) {
  return data.rader.flatMap((r) => [r.tekst?.fdcId, r.tekst?.fdcId2].filter(Boolean).filter((f) => !finnPost(sr, Number(f))).map((f) => ({ id: r.id, fdcId: f })));
}

/** Ny kopi med alle rader kontrollert på `dato`. Kalles bare når det ikke er avvik. */
export function somKontrollertEn(data, dato) {
  const ny = structuredClone(data);
  for (const r of ny.rader) {
    r.status = 'kontrollert';
    r.kontrollert = dato;
  }
  ny.kilder.usda.hentet = dato;
  return ny;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const fil = arg('--fil');
  if (!fil) throw new Error('Bruk: kontroller-usda.mjs --fil <SR Legacy-JSON> [--dato ÅÅÅÅ-MM-DD]');
  const dato = arg('--dato') ?? new Date().toISOString().slice(0, 10);
  const data = validerData(JSON.parse(readFileSync(DATAFIL_EN, 'utf8')));
  const sr = lesSr(fil);
  const a = avvikUsda(data, sr);
  const m = manglerUsda(data, sr);
  if (a.length || m.length) {
    for (const x of a) console.log(`AVVIK ${x.id}: ${x.felt} er ${x.iFila} i fila og ${x.iKilden} i kilden`);
    for (const x of m) console.log(`MANGLER ${x.id}: FDC-ID ${x.fdcId} finnes ikke i datasettet`);
    console.log('Ingenting er endret.');
    process.exit(1);
  }
  writeFileSync(DATAFIL_EN, `${JSON.stringify(validerData(somKontrollertEn(data, dato)), null, 2)}\n`);
  console.log(`Alle tall i ${data.rader.length} rader stemmer med kilden. Status kontrollert, ${dato}.`);
}
