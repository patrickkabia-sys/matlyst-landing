// Dataskjemaet for sidefamilier: bare tall med kilde blir sider.
// Hver familie har én datafil per marked (data.<marked>.json). Samme rad-id i to markeders filer
// betyr «samme vare», og det er det som gir hreflang mellom språkene.
// Endres denne fila, går sidekontrollen i full modus (se scripts/revisjon-omfang.mjs).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';

const MARKEDER = ['nb', 'sv', 'da', 'en'];
const dato = z.string().regex(/^\d{4}-\d{2}-\d{2}$/u, 'må være en dato på formen ÅÅÅÅ-MM-DD')
  .refine((s) => !Number.isNaN(Date.parse(`${s}T00:00:00Z`)) && new Date(`${s}T00:00:00Z`).toISOString().startsWith(s), 'er ikke en gyldig dato');
const slug = z.string().regex(/^[a-z0-9-]+$/u, 'må bestå av a-z, 0-9 og bindestrek');
const tekst = z.string().trim().min(1, 'kan ikke være tom');
const https = z.string().refine((s) => {
  if (!s.startsWith('https://')) return false;
  try { return new URL(s).protocol === 'https:'; } catch { return false; }
}, 'må være en gyldig adresse som starter med https://');

export const Kilde = z.strictObject({
  navn: tekst, utgiver: tekst, aar: z.number().int().min(1800).max(2100), adresse: https, hentet: dato,
});
const Tall = z.strictObject({
  verdi: z.number().finite(),
  enhet: tekst,
  kilde: tekst,
  andre: z.array(z.strictObject({ verdi: z.number().finite(), kilde: tekst })).optional(),
  merknad: z.string().optional(),
});
const Rad = z.strictObject({
  id: slug,
  slug,
  navn: tekst,
  status: z.enum(['kontrollert', 'utkast', 'avvist']),
  kontrollert: dato.optional(),
  oppdatert: dato,
  tall: z.record(tekst, Tall),
  tekst: z.record(tekst, z.string()).optional(),
});
const Data = z.strictObject({
  familie: slug,
  marked: z.enum(MARKEDER),
  kilder: z.record(tekst, Kilde),
  rader: z.array(Rad),
});

const nevner = (kilder, rader) => [...new Set(rader.flatMap((r) => Object.values(r.tall).flatMap((t) => [t.kilde, ...(t.andre ?? []).map((a) => a.kilde)])))]
  .filter((k) => Object.hasOwn(kilder, k));

/**
 * Validerer en datafil. Kaster Error der hver linje i meldingen begynner med
 * `<familie>/<marked>/<rad-id>:`, så bygget stopper med raden som er feil.
 */
export function validerData(obj) {
  const familie = typeof obj?.familie === 'string' ? obj.familie : '?';
  const marked = typeof obj?.marked === 'string' ? obj.marked : '?';
  const rader0 = Array.isArray(obj?.rader) ? obj.rader : [];
  const raden = (i) => (typeof rader0[i]?.id === 'string' ? rader0[i].id : `rad-${i}`);
  const feil = [];
  const meld = (id, melding) => feil.push(`${familie}/${marked}/${id}: ${melding}`);
  // Kildefeil navngir første rad som bruker kilden (så bygget stopper med en rad-id), ellers kilden selv.
  const brukerKilde = (r, k) => Object.values(r?.tall ?? {}).some((t) => t?.kilde === k || (t?.andre ?? []).some((a) => a?.kilde === k));
  const radSomBruker = (k) => {
    const i = rader0.findIndex((r) => brukerKilde(r, k));
    return i >= 0 ? raden(i) : `kilder.${k}`;
  };

  const resultat = Data.safeParse(obj);
  if (!resultat.success) {
    for (const p of resultat.error.issues) {
      const [rot, i, ...rest] = p.path;
      if (rot === 'rader' && typeof i === 'number') meld(raden(i), `${rest.join('.') || '(raden)'}: ${p.message}`);
      else if (rot === 'kilder' && typeof i === 'string') meld(radSomBruker(i), `kilden «${i}»${rest.length ? ` felt ${rest.join('.')}` : ''}: ${p.message}`);
      else meld('data', `${p.path.join('.') || '(rot)'}: ${p.message}`);
    }
    throw new Error(feil.join('\n'));
  }

  const d = resultat.data;
  const ider = new Set();
  const slugs = new Set();
  for (const r of d.rader) {
    if (ider.has(r.id)) meld(r.id, 'id er brukt på to rader');
    ider.add(r.id);
    if (slugs.has(r.slug)) meld(r.id, `slug «${r.slug}» er brukt på to rader`);
    slugs.add(r.slug);
    if (Object.keys(r.tall).length === 0) meld(r.id, 'raden har ingen tall');
    if (r.status === 'kontrollert' && !r.kontrollert) meld(r.id, 'status kontrollert krever feltet kontrollert (dato)');
    for (const [navn, t] of Object.entries(r.tall)) {
      for (const k of [t.kilde, ...(t.andre ?? []).map((a) => a.kilde)]) {
        if (!Object.hasOwn(d.kilder, k)) meld(r.id, `tallet «${navn}» peker på kilden «${k}», som ikke finnes i kilder`);
      }
    }
  }
  if (feil.length) throw new Error(feil.join('\n'));
  return d;
}

/** Leser og validerer `data.<marked>.json` i familiens mappe. */
export function lesData(mappe, marked) {
  const d = validerData(JSON.parse(readFileSync(join(mappe, `data.${marked}.json`), 'utf8')));
  if (d.marked !== marked) throw new Error(`${d.familie}/${marked}/data: fila data.${marked}.json har marked «${d.marked}»`);
  return d;
}

export const publiserbare = (data) => data.rader.filter((r) => r.status === 'kontrollert');

/** Kildene radene faktisk bruker, i den rekkefølgen de først nevnes. */
export const kilderFor = (data, rader) => nevner(data.kilder, rader).map((k) => data.kilder[k]);
