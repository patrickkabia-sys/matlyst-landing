import { ArtikkelSkjema } from './skjema.mjs';
import { ordOverlapp, slugify } from './nettsted.mjs';
import { gjenkjennSprak } from './sprakgjenkjenning.mjs';

export function sjekkFast(artikkel, { nettsted, forbudt, sprakfiler, grenser }) {
  const grunner = [];
  const skjemaresultat = ArtikkelSkjema.safeParse(artikkel);
  if (!skjemaresultat.success) {
    for (const problem of skjemaresultat.error.issues) {
      const felt = String(problem.path[0] ?? 'artikkel');
      const grunn = `skjema: ${felt}`;
      if (!grunner.includes(grunn)) grunner.push(grunn);
    }
  }

  const seksjonTekster = [];
  for (const seksjon of artikkel.seksjoner ?? []) {
    seksjonTekster.push(seksjon.overskrift ?? '');
    if (seksjon.type === 'avsnitt') seksjonTekster.push(seksjon.tekst ?? '');
    if (seksjon.type === 'tabell') seksjonTekster.push(...(seksjon.rader ?? []).flat());
    if (seksjon.type === 'liste') seksjonTekster.push(...(seksjon.punkter ?? []));
  }
  const faqTekster = (artikkel.faq ?? []).flatMap(({ sporsmal, svar }) => [sporsmal, svar]);
  const brodtekst = seksjonTekster.join(' ');
  const antallOrd = brodtekst.match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
  if (antallOrd < grenser.brodtekstMinOrd || antallOrd > grenser.brodtekstMaksOrd) {
    grunner.push('skjema: brødtekst');
  }

  const tittel = artikkel.tittel?.trim().toLocaleLowerCase() ?? '';
  const meta = artikkel.meta?.trim().toLocaleLowerCase() ?? '';
  if (nettsted.sider.some((side) => side.tittel.trim().toLocaleLowerCase() === tittel)) {
    grunner.push('unikhet: tittel finnes fra før');
  }
  if (nettsted.sider.some((side) => side.meta.trim().toLocaleLowerCase() === meta)) {
    grunner.push('unikhet: meta finnes fra før');
  }

  const normalisertSlug = slugify(artikkel.slug ?? '');
  if ((forbudt.slugs ?? []).some((slug) => slugify(slug) === normalisertSlug)) {
    grunner.push('forbudt: slug');
  }

  const slugKollisjon = [...nettsted.stier].some((sti) => {
    const sisteDel = sti.replace(/\/$/u, '').split('/').at(-1);
    return sisteDel === artikkel.slug;
  });
  if (slugKollisjon) grunner.push('slug: finnes fra før');

  if (nettsted.sider.some((side) => ordOverlapp(artikkel.tittel ?? '', side.tittel) > grenser.overlappMaks)) {
    grunner.push('overlapp: artikkelen ligner en eksisterende side');
  }

  const kontrolltekst = JSON.stringify({
    tittel: artikkel.tittel,
    meta: artikkel.meta,
    ingress: artikkel.ingress,
    seksjoner: artikkel.seksjoner,
    faq: artikkel.faq,
    lenker: artikkel.lenker,
    kilder: artikkel.kilder,
  }).toLocaleLowerCase();
  const forbudtDomene = (forbudt.domener ?? []).some((domene) =>
    kontrolltekst.includes(domene.toLocaleLowerCase()));
  const forbudtNavn = (forbudt.navn ?? []).some((navn) => {
    const escaped = navn.toLocaleLowerCase().replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
    return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`, 'u').test(kontrolltekst);
  });
  if (forbudtDomene || forbudtNavn) grunner.push('forbudt: domene eller navn');

  for (const lenke of artikkel.lenker ?? []) {
    let internSti;
    try {
      const url = new URL(lenke.sti, 'https://matlyst-app.no');
      if (url.origin === 'https://matlyst-app.no') internSti = url.pathname;
    } catch {}
    if (internSti && !nettsted.stier.has(internSti)) {
      grunner.push(`intern lenke finnes ikke: ${lenke.sti}`);
    }
  }

  const kjenteKilder = new Set((artikkel.kilder ?? []).map((kilde) => kilde.id));
  for (const pastand of artikkel.pastander ?? []) {
    if (!kjenteKilder.has(pastand.kilde_id)) {
      grunner.push(`ukjent kilde_id: ${pastand.kilde_id}`);
    }
  }

  const tall = [...`${seksjonTekster.join(' ')} ${faqTekster.join(' ')}`.matchAll(/\d+([.,–-]\d+)?/gu)]
    .map((treff) => treff[0]);
  const pastandstekst = (artikkel.pastander ?? []).map((pastand) => pastand.tekst).join(' ');
  const pastandstall = new Set([...pastandstekst.matchAll(/\d+([.,–-]\d+)?/gu)]
    .map((treff) => treff[0]));
  if (tall.some((verdi) => !pastandstall.has(verdi))) {
    grunner.push('tall: mangler påstand');
  }

  const synligTekst = [
    artikkel.tittel,
    artikkel.meta,
    artikkel.ingress,
    ...seksjonTekster,
    ...faqTekster,
  ].filter(Boolean).join(' ');
  const stoppord = Object.fromEntries(
    Object.entries(sprakfiler).map(([sprak, sprakfil]) => [sprak, sprakfil.stoppord]),
  );
  if (gjenkjennSprak(synligTekst, stoppord) !== artikkel.sprak) {
    grunner.push('språk: teksten stemmer ikke med språkfeltet');
  }

  if (artikkel.sprak === 'en') {
    const britisk = (sprakfiler.en.britiskeOrd ?? []).some((ord) => {
      const escaped = ord.toLocaleLowerCase().replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
      return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`, 'u')
        .test(synligTekst.toLocaleLowerCase());
    });
    if (britisk) grunner.push('britisk ord i en-US-tekst');
  }

  const harHelseord = Object.values(sprakfiler).some((sprakfil) =>
    (sprakfil.helseord ?? []).some((ord) => {
      const escaped = ord.toLocaleLowerCase().replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
      return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`, 'u')
        .test(synligTekst.toLocaleLowerCase());
    }));
  if (harHelseord) grunner.push('helseord: emnet er ikke tillatt');

  return { ok: grunner.length === 0, grunner };
}
