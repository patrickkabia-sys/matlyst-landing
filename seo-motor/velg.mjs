export function velgEmne(ko, publisert) {
  const brukteIder = new Set(publisert.map(({ emne_id }) => emne_id));
  const sisteSyv = publisert.slice(-7);

  return [...ko]
    .sort((a, b) => b.poeng - a.poeng)
    .find((emne) => (
      !brukteIder.has(emne.id)
      && sisteSyv.filter(({ sprak }) => sprak === emne.sprak).length < 4
    )) ?? null;
}
