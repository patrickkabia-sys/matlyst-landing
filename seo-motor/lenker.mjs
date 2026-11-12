export function byggLenker(artikler, ny) {
  const kandidater = artikler
    .map((artikkel, indeks) => ({
      artikkel,
      indeks,
      felles: artikkel.tagger.filter((tagg) => ny.tagger.includes(tagg)).length,
    }))
    .filter(({ artikkel, felles }) => (
      artikkel.sprak === ny.sprak
      && artikkel.slug !== ny.slug
      && felles > 0
    ))
    .sort((a, b) => b.felles - a.felles || b.indeks - a.indeks);
  const appSti = ny.sprakfil.appkoblingSti[ny.appkobling];
  const appTittel = ny.sprakfil.appCta[ny.appkobling].tittel;
  const appLenke = appSti ? { sti: appSti, tittel: appTittel } : null;
  const valgte = kandidater.slice(0, appLenke ? 3 : 4);
  const nyLenker = valgte.map(({ artikkel }) => ({
    sti: artikkel.sti,
    tittel: artikkel.tittel,
  }));
  if (appLenke) nyLenker.push(appLenke);

  const lesOgså = new Map(valgte.map(({ artikkel }) => [
    artikkel.slug,
    { sti: ny.sti, tittel: ny.tittel },
  ]));

  return { nyLenker, lesOgså };
}
