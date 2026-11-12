import { fyllMal, kallStrukturert } from './claude.mjs';
import { ordOverlapp, slugify } from './nettsted.mjs';
import { PassformSkjema } from './skjema.mjs';

const LAND_TIL_SPRAK = {
  nor: 'nb',
  swe: 'sv',
  dnk: 'da',
  usa: 'en',
};

export function byggKo({ kandidater, passform, nettsted, forbudt, grenser, brukt }) {
  const ko = [];
  const styrkEksisterende = [];
  const brukteIder = new Set(brukt.map((emne) => (
    typeof emne === 'string' ? emne : emne.emne_id ?? emne.id
  )));

  for (const kandidat of kandidater) {
    if (kandidat.plassering !== undefined
      && (kandidat.plassering < 8 || kandidat.plassering > 30)) continue;

    const sprak = kandidat.sprak ?? LAND_TIL_SPRAK[kandidat.land];
    const vurdering = passform.get(kandidat.sokeord);
    const vanskelighet = kandidat.vanskelighet ?? 0;
    if (!vurdering || vurdering.passform === 0) continue;
    if (vanskelighet > grenser.vanskelighetMaks) continue;

    const helseord = Array.isArray(forbudt.helseord)
      ? forbudt.helseord
      : forbudt.helseord?.[sprak] ?? [];
    const forbudteOrd = [
      ...(forbudt.domener ?? []),
      ...(forbudt.navn ?? []),
      ...helseord,
    ];
    const normalisertSokeord = kandidat.sokeord.toLocaleLowerCase();
    const erForbudt = forbudteOrd.some((ord) => {
      const escaped = ord.toLocaleLowerCase().replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
      return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`, 'u')
        .test(normalisertSokeord);
    });
    if (erForbudt) continue;

    if (nettsted.sider.some((side) =>
      ordOverlapp(kandidat.sokeord, side.tittel) > 0.5)) {
      styrkEksisterende.push(kandidat.sokeord);
      continue;
    }

    const id = `${slugify(kandidat.sokeord)}-${sprak}`;
    if (brukteIder.has(id)) continue;
    const volum = kandidat.volum ?? kandidat.visninger ?? 0;
    ko.push({
      id,
      sprak,
      sokeord: kandidat.sokeord,
      volum,
      vanskelighet,
      passform: vurdering.passform,
      tagger: vurdering.tagger,
      poeng: volum * vurdering.passform * (1 - vanskelighet / 100),
    });
  }

  ko.sort((a, b) => b.poeng - a.poeng);
  return { ko, styrkEksisterende };
}

export async function vurderPassform(klient, kandidater, mal) {
  const innhold = JSON.stringify(kandidater);
  const instruks = fyllMal(mal, {
    sprakregler: '[]',
    emne: innhold,
    utdrag: '[]',
    appkoblinger: '[]',
  });
  const { data } = await kallStrukturert(klient, {
    instruks,
    innhold,
    skjema: PassformSkjema,
    effort: 'low',
  });

  return new Map(data.vurderinger.map(({ sokeord, passform, tagger }) => [
    sokeord,
    { passform, tagger },
  ]));
}
