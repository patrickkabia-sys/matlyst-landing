import { createHash } from 'node:crypto';

import { ordOverlapp } from './nettsted.mjs';

const LAND_TIL_SPRAK = {
  nor: 'nb',
  swe: 'sv',
  dnk: 'da',
  usa: 'en',
};

function ord(tekst) {
  return new Set(tekst.toLocaleLowerCase().match(/\p{L}[\p{L}\p{N}-]{1,}/gu) ?? []);
}

function finnFrø(sokeord, språkfil) {
  const sokeordOrd = ord(sokeord);
  let beste = null;
  let besteTreff = 0;
  for (const frø of språkfil?.['forslagsfrø'] ?? []) {
    const treff = [...ord(frø.tekst)].filter((verdi) => sokeordOrd.has(verdi)).length;
    if (treff > besteTreff) {
      beste = frø;
      besteTreff = treff;
    }
  }
  return beste;
}

function emneId(sprak, sokeord) {
  const hash = createHash('sha256')
    .update(`${sprak}\0${sokeord.trim().toLocaleLowerCase()}`, 'utf8')
    .digest('hex')
    .slice(0, 16);
  return `e-${hash}`;
}

function erForbudt(sokeord, sprak, forbudt) {
  const helseord = Array.isArray(forbudt.helseord)
    ? forbudt.helseord
    : forbudt.helseord?.[sprak] ?? [];
  const forbudteOrd = [
    ...(forbudt.domener ?? []),
    ...(forbudt.navn ?? []),
    ...helseord,
  ];
  const normalisert = sokeord.toLocaleLowerCase();
  return forbudteOrd.some((verdi) => {
    const escaped = verdi.toLocaleLowerCase().replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
    return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`, 'u')
      .test(normalisert);
  });
}

export function byggKo({ kandidater, språkfiler, nettsted, forbudt, brukt }) {
  const perTema = new Map();
  const styrkEksisterende = [];
  const brukteIder = new Set(brukt.map((emne) => (
    typeof emne === 'string' ? emne : emne.emne_id ?? emne.id
  )));

  for (const kandidat of kandidater) {
    if (kandidat.plassering !== undefined
      && (kandidat.plassering < 8 || kandidat.plassering > 30)) continue;
    const sprak = kandidat.sprak ?? LAND_TIL_SPRAK[kandidat.land];
    if (!sprak || !språkfiler[sprak]) continue;
    const frø = kandidat.frø ?? finnFrø(kandidat.sokeord, språkfiler[sprak]);
    if (!frø || erForbudt(kandidat.sokeord, sprak, forbudt)) continue;
    if (nettsted.sider.some((side) => ordOverlapp(kandidat.sokeord, side.tittel) > 0.5)) {
      styrkEksisterende.push(kandidat.sokeord);
      continue;
    }
    const id = emneId(sprak, kandidat.sokeord);
    if (brukteIder.has(id)) continue;
    const proxy = kandidat.kilde === 'gsc' || kandidat.visninger !== undefined
      ? kandidat.visninger ?? 0
      : kandidat.forslagAntall ?? 0;
    const emne = {
      id,
      sprak,
      sokeord: kandidat.sokeord,
      score: frø.passform * proxy,
      passform: frø.passform,
      proxy,
      tagger: frø.tagger,
      appkobling: frø.appkobling,
      tema: frø.tema,
      vinkel: frø.vinkel,
      slug: frø.slug,
      kilde_ider: frø.kilde_ider,
    };
    const temaid = `${sprak}:${frø.slug}`;
    if (!perTema.has(temaid) || perTema.get(temaid).score < emne.score) {
      perTema.set(temaid, emne);
    }
  }

  const ko = [...perTema.values()].sort((a, b) => b.score - a.score);
  return { ko, styrkEksisterende };
}

function fyllMal(mal, navn, verdi) {
  return mal.replaceAll(`{{${navn}}}`, verdi);
}

export function lagBestilling(emne, språkfil, grenser, dato) {
  return {
    dato,
    sprak: emne.sprak,
    emne_id: emne.id,
    slug: emne.slug,
    emne: fyllMal(språkfil.bestillingsmal.emne, 'tema', emne.tema),
    vinkel: fyllMal(språkfil.bestillingsmal.vinkel, 'vinkel', emne.vinkel),
    appkoblinger: [emne.appkobling],
    kilde_ider: emne.kilde_ider,
    krav: {
      ord_min: grenser.brodtekstMinOrd,
      ord_maks: grenser.brodtekstMaksOrd,
      seksjoner_min: grenser.seksjonerMin,
      seksjoner_maks: grenser.seksjonerMaks,
      faq_min: grenser.faqMin,
      faq_maks: grenser.faqMaks,
      sprakregler_ref: `seo-data/sprak/${emne.sprak}.json`,
    },
  };
}
