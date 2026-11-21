// Ukemenyene (nb): sju middager per meny, lest fra menyer.nb.json og kontrollert her.
// data.nb.json har tallene med kilde (Mattilsynet); denne fila har rettene, restene og varene.
// Reglene, som bygget stopper på:
//   - hver meny har nøyaktig sju dager, mandag til søndag, i rekkefølge;
//   - hver dag har enten en oppskrift (https-lenke til en norsk kilde) eller en egen kort framgangsmåte, aldri begge;
//   - hver vare har en butikkhylle (appens hyller, lib/sprak/register/ingredienser.ts i appen);
//   - en rest kommer fra en tidligere dag som lager mer, høyst to dager før, eller via fryseren.
//     To dager holder oss godt innenfor Mattilsynets to til fire dager for rester i kjøleskap.
// Oppskriftene kopieres aldri: siden viser rettnavn, lenke, hvorfor retten står der og varene uten mengder.
import { readFileSync } from 'node:fs';
import { z } from 'zod';

export const DAGER = Object.freeze(['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag', 'søndag']);
export const MAKS_DAGER_REST = 2;
const KILDEVERTER = new Set(['www.matprat.no']);

const tekst = z.string().trim().min(1);
const Dag = z.strictObject({
  dag: z.enum(DAGER),
  rett: tekst,
  oppskrift: z.string().refine((s) => { try { const u = new URL(s); return u.protocol === 'https:' && KILDEVERTER.has(u.hostname); } catch { return false; } }, 'må være en https-lenke til en godkjent norsk oppskriftskilde').optional(),
  framgang: z.array(tekst).min(1).optional(),
  hvorfor: tekst,
  lagMer: tekst.optional(),
  rest: z.strictObject({ fra: z.enum(DAGER), hva: tekst, via: z.literal('fryser').optional() }).optional(),
  varer: z.array(tekst).min(1),
});
const Meny = z.strictObject({
  tittel: tekst.max(60), h1: tekst, beskrivelse: tekst.min(100).max(160), ingress: tekst, vinkel: tekst,
  dager: z.array(Dag).length(7),
  faq: z.array(z.tuple([tekst, tekst])).min(1),
});
const Fil = z.strictObject({
  hentet: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
  hyller: z.array(tekst).min(1),
  basis: z.array(tekst),
  varer: z.record(tekst, tekst),
  menyer: z.record(tekst, Meny),
});

/** Validerer innholdet i menyer.nb.json. Kaster med meny og dag i meldingen. */
export function validerMenyer(obj) {
  const d = Fil.parse(obj);
  const feil = [];
  for (const [vare, hylle] of Object.entries(d.varer)) if (!d.hyller.includes(hylle)) feil.push(`varer.${vare}: ukjent hylle «${hylle}»`);
  for (const [id, m] of Object.entries(d.menyer)) {
    m.dager.forEach((x, i) => {
      const hvor = `${id}/${x.dag}`;
      if (x.dag !== DAGER[i]) feil.push(`${hvor}: dag nr. ${i + 1} skal være ${DAGER[i]}`);
      if (Boolean(x.oppskrift) === Boolean(x.framgang)) feil.push(`${hvor}: dagen skal ha enten oppskrift eller framgang`);
      for (const v of x.varer) if (!Object.hasOwn(d.varer, v)) feil.push(`${hvor}: varen «${v}» har ingen hylle`);
      if (new Set(x.varer).size !== x.varer.length) feil.push(`${hvor}: samme vare står to ganger`);
      if (x.rest) {
        const fra = DAGER.indexOf(x.rest.fra);
        const kilde = m.dager[fra];
        if (fra >= i) feil.push(`${hvor}: resten må komme fra en tidligere dag`);
        else if (!kilde.lagMer) feil.push(`${hvor}: ${x.rest.fra} lager ikke mer, så det finnes ingen rest`);
        else if (x.rest.via !== 'fryser' && i - fra > MAKS_DAGER_REST) feil.push(`${hvor}: resten fra ${x.rest.fra} er ${i - fra} dager gammel (høyst ${MAKS_DAGER_REST} uten fryser)`);
      }
    });
    for (const x of m.dager) {
      if (x.lagMer && !m.dager.some((y) => y.rest?.fra === x.dag)) feil.push(`${id}/${x.dag}: lager mer, men ingen dag bruker resten`);
    }
  }
  if (feil.length) throw new Error(feil.join('\n'));
  return d;
}

export const lesMenyer = (fil = new URL('./menyer.nb.json', import.meta.url)) => validerMenyer(JSON.parse(readFileSync(fil, 'utf8')));

/** Handlelista for en meny: hyllene i appens rekkefølge, varene sortert, med dagene som trenger dem. */
export function handleliste(meny, alle) {
  const perVare = new Map();
  for (const x of meny.dager) for (const v of x.varer) perVare.set(v, [...(perVare.get(v) ?? []), x.dag]);
  return alle.hyller
    .map((hylle) => ({ hylle, varer: [...perVare].filter(([v]) => alle.varer[v] === hylle).map(([vare, dager]) => ({ vare, dager })).sort((a, b) => a.vare.localeCompare(b.vare, 'nb')) }))
    .filter((h) => h.varer.length > 0);
}

/** Restene i uka: hvilken dag lager mer, hvilken dag bruker det, og om det går via fryseren. */
export const resteKjeder = (meny) => meny.dager.filter((x) => x.rest).map((x) => ({ fra: x.rest.fra, til: x.dag, hva: x.rest.hva, via: x.rest.via ?? null, lagMer: meny.dager.find((y) => y.dag === x.rest.fra).lagMer }));
