import { fyllMal, kallStrukturert } from './claude.mjs';
import { GranskSkjema } from './skjema.mjs';

export async function granskArtikkel(klient, { artikkel, utdrag, sprakfil, mal }) {
  const innhold = JSON.stringify(artikkel);
  const instruks = fyllMal(mal, {
    sprakregler: JSON.stringify(sprakfil),
    emne: innhold,
    utdrag: JSON.stringify(utdrag),
    appkoblinger: JSON.stringify(Object.keys(sprakfil.appCta)),
  });
  const { data, kostnadUsd } = await kallStrukturert(klient, {
    instruks,
    innhold,
    skjema: GranskSkjema,
    effort: 'low',
  });

  return {
    godkjent: data.beslutning === 'GODKJENT',
    grunn: data.grunn,
    kostnadUsd,
  };
}
