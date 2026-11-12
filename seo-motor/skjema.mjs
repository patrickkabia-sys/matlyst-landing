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
});

export const GranskSkjema = z.object({
  beslutning: z.enum(['GODKJENT', 'AVVIST']),
  grunn: z.string(),
});

export const PassformSkjema = z.object({
  vurderinger: z.array(z.object({
    sokeord: z.string(),
    passform: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
    tagger: z.array(z.string()),
  })),
});

export function lesData(navn, rot) {
  const dataRot = rot ? new URL('seo-data/', rot) : new URL('../seo-data/', import.meta.url);
  return JSON.parse(readFileSync(new URL(navn, dataRot), 'utf8'));
}
