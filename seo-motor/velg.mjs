export function velgEmne(ko, publisert) {
  const brukteIder = new Set(publisert.map(({ emne_id }) => emne_id));
  const brukteSlugs = new Set(publisert.map(({ slug }) => slug).filter(Boolean));
  const sisteSyv = [...publisert]
    .sort((a, b) => (a.dato ?? '').localeCompare(b.dato ?? ''))
    .slice(-7);

  return [...ko]
    .sort((a, b) => b.score - a.score)
    .find((emne) => (
      !brukteIder.has(emne.id)
      && !brukteSlugs.has(emne.slug)
      && sisteSyv.filter(({ sprak }) => sprak === emne.sprak).length < 4
    )) ?? null;
}
