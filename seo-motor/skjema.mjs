import { readFileSync } from 'node:fs';

import { z } from 'zod';

const AvsnittSkjema = z.object({
  type: z.literal('avsnitt'),
  overskrift: z.string().min(1),
  tekst: z.string().min(1),
});

const TabellSkjema = z.object({
  type: z.literal('tabell'),
  overskrift: z.string().min(1),
  rader: z.array(z.array(z.string()).length(2)),
});

const ListeSkjema = z.object({
  type: z.literal('liste'),
  overskrift: z.string().min(1),
  punkter: z.array(z.string().min(1)),
});

export const ArtikkelSkjema = z.object({
  sprak: z.enum(['nb', 'sv', 'da', 'en']),
  emne_id: z.string().min(1),
  slug: z.string().min(1),
  tittel: z.string().min(1).max(60),
  meta: z.string().min(120).max(160),
  ingress: z.string().min(1),
  seksjoner: z.array(z.discriminatedUnion('type', [AvsnittSkjema, TabellSkjema, ListeSkjema])).min(3).max(6),
  faq: z.array(z.object({
    sporsmal: z.string().min(1),
    svar: z.string().min(1),
  })).min(3).max(5),
  pastander: z.array(z.object({
    tekst: z.string().min(1),
    kilde_id: z.string().min(1),
  })),
  appkobling: z.enum(['import', 'ukemeny', 'handleliste', 'bruk-det-jeg-har', 'kokemodus']),
  tagger: z.array(z.string().min(1)),
  kilder: z.array(z.object({
    id: z.string().min(1),
    url: z.string().url(),
    tekst: z.string().min(1).optional(),
  }).strict()).optional(),
  lenker: z.array(z.object({ sti: z.string().min(1), tittel: z.string().min(1) }).strict()).optional(),
  lesOgså: z.array(z.object({ sti: z.string().min(1), tittel: z.string().min(1) }).strict()).optional(),
  publisert: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u).optional(),
}).strict();

export const ArtikkelInndataSkjema = z.object({
  sprak: z.string(),
  emne_id: z.string(),
  slug: z.string(),
  tittel: z.string(),
  meta: z.string(),
  ingress: z.string(),
  seksjoner: z.array(z.object({ type: z.string() }).passthrough()),
  faq: z.array(z.object({ sporsmal: z.string(), svar: z.string() }).passthrough()),
  pastander: z.array(z.object({ tekst: z.string(), kilde_id: z.string() }).passthrough()),
  appkobling: z.string(),
  tagger: z.array(z.string()),
}).passthrough();

export const GranskSkjema = z.object({
  beslutning: z.enum(['GODKJENT', 'AVVIST']),
  grunner: z.array(z.string()),
  artikkel_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
}).strict();

export const BestillingSkjema = z.object({
  dato: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
  sprak: z.enum(['nb', 'sv', 'da', 'en']),
  emne_id: z.string().regex(/^e-[a-f0-9]{16}$/u),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  emne: z.string().min(1),
  vinkel: z.string().min(1),
  appkoblinger: z.array(z.enum(['import', 'ukemeny', 'handleliste', 'bruk-det-jeg-har', 'kokemodus'])).min(1),
  kilde_ider: z.array(z.string().min(1)),
  krav: z.object({
    ord_min: z.number().int().nonnegative(),
    ord_maks: z.number().int().positive(),
    seksjoner_min: z.number().int().positive(),
    seksjoner_maks: z.number().int().positive(),
    faq_min: z.number().int().nonnegative(),
    faq_maks: z.number().int().nonnegative(),
    sprakregler_ref: z.string().min(1),
  }).strict(),
}).strict();

export function lesData(navn, rot) {
  const dataRot = rot ? new URL('seo-data/', rot) : new URL('../seo-data/', import.meta.url);
  return JSON.parse(readFileSync(new URL(navn, dataRot), 'utf8'));
}
