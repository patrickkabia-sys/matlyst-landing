import { fyllMal, kallStrukturert } from './claude.mjs';
import { slugify } from './nettsted.mjs';
import { ArtikkelSkjema } from './skjema.mjs';

export async function skrivArtikkel(klient, { emne, utdrag, sprakfil, mal }) {
  const innhold = JSON.stringify(emne);
  const instruks = fyllMal(mal, {
    sprakregler: JSON.stringify(sprakfil),
    emne: innhold,
    utdrag: JSON.stringify(utdrag),
    appkoblinger: JSON.stringify(Object.keys(sprakfil.appCta)),
  });
  const { data, kostnadUsd } = await kallStrukturert(klient, {
    instruks,
    innhold,
    skjema: ArtikkelSkjema,
    effort: 'medium',
  });

  return {
    artikkel: {
      ...data,
      sprak: emne.sprak,
      emne_id: emne.id,
      slug: slugify(data.slug),
    },
    kostnadUsd,
  };
}
